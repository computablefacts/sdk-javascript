import {CacheInterface} from './cache.interface';

export class MemoizedPromise {

    private hit: number;
    private miss: number;
    private error: number;
    private readonly cache: Record<string, any>;
    private readonly cacheIndefinitely: boolean;
    private readonly userDefinedFunction: (params: any) => Promise<any>;

    /**
     * Create a new object that memoizes promises returned by a user-defined function.
     *
     * @param userDefinedFunction user-defined function that returns a promise.
     * @param cacheIndefinitely if true, indefinitely cache the promise.
     */
    constructor(userDefinedFunction: (params: any) => Promise<any>, cacheIndefinitely: boolean | null) {
        this.cache = {};
        this.hit = 0;
        this.miss = 0;
        this.error = 0;
        this.cacheIndefinitely = cacheIndefinitely === true;
        this.userDefinedFunction = userDefinedFunction;
        this.request = this.request.bind(this);
    }

    public request({cacheKey, ...params}: { cacheKey: string }): Promise<any> {

        if (!cacheKey) {
            this.error++;
            return Promise.reject(new Error('Unique key not passed'));
        }
        if (this.cache[cacheKey]) {
            this.hit++;
            return this.cache[cacheKey];
        }

        this.cache[cacheKey] = this.userDefinedFunction(params)
            .then((res) => {
                if (!this.cacheIndefinitely) {
                    delete this.cache[cacheKey];
                }
                return res;
            })
            .catch((err) => {
                delete this.cache[cacheKey];
                throw err;
            });
        this.miss++;
        return this.cache[cacheKey];
    }

    public logStats() {

        console.log('# errors : ' + this.error);
        console.log('# entries : ' + (this.hit + this.miss));
        console.log('# hits : ' + this.hit);
        console.log('# misses : ' + this.miss);

        if (this.hit > 0) {
            console.log('hit rate : ' + (this.hit / (this.hit + this.miss)));
        }
        if (this.miss > 0) {
            console.log('miss rate : ' + (this.miss / (this.hit + this.miss)));
        }
    }
}

type CacheEntry = {
    data: any,
    hit: number,
    touchedAt: Date,
};

const cache: CacheInterface = (function () {

    let map_: Record<string, Record<string, CacheEntry>> = {};
    let hit_ = 0;
    let miss_ = 0;

    const put = (namespace: string, key: string, value: any): void => {
        if (!hasKey(namespace, key)) {
            miss_++;
            map_[namespace] = map_[namespace] || {};
            map_[namespace][key] = {data: value, hit: 0, touchedAt: new Date()};
        }
    };

    const get = (namespace: string, key: string): any => {
        if (!hasKey(namespace, key)) {
            return null;
        }
        hit_++;
        map_[namespace][key].hit++;
        map_[namespace][key].touchedAt = new Date();
        return map_[namespace][key].data;
    };

    const hasKey = (namespace: string, key: string): boolean => {
        return namespace in map_ && key in map_[namespace];
    };

    const size = (): number => {
        return hit_ + miss_;
    };

    const invalidate = (): void => {

        logStats();

        map_ = {};
        hit_ = 0;
        miss_ = 0;
    };

    const logStats = (): void => {

        console.log('# entries : ' + (hit_ + miss_));
        console.log('# hits : ' + hit_);
        console.log('# misses : ' + miss_);

        if (hit_ > 0) {
            console.log('hit rate : ' + (hit_ / (hit_ + miss_)));
        }
        if (miss_ > 0) {
            console.log('miss rate : ' + (miss_ / (hit_ + miss_)));
        }
    };

    const temporarilyMemoizedPromise = (fn: (params: any) => Promise<any>): MemoizedPromise => {
        return new MemoizedPromise(fn, false);
    };

    const indefinitelyMemoizedPromise = (fn: (params: any) => Promise<any>): MemoizedPromise => {
        return new MemoizedPromise(fn, true);
    };

    return {
        put: put,
        get: get,
        hasKey: hasKey,
        size: size,
        invalidate: invalidate,
        logStats: logStats,
        temporarilyMemoizedPromise: temporarilyMemoizedPromise,
        indefinitelyMemoizedPromise: indefinitelyMemoizedPromise,
    }
})();

export {cache}