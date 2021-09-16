import {CacheInterface} from './cache.interface';

type CacheEntry = {
    data: any,
    hit: number,
    touchedAt: Date,
};

const cache: CacheInterface = (function () {

    const MAX_ENTRIES = 2500;

    let map_: Record<string, Record<string, CacheEntry>> = {};
    let hit_ = 0;
    let miss_ = 0;

    const put = (namespace: string, key: string, value: any): void => {
        if (!hasKey(namespace, key)) {
            if (hit_ + miss_ >= MAX_ENTRIES) {
                invalidate(); // invalidate cache if we reached the maximum number of entries
            }
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
        console.log('hit rate : ' + (hit_ / (hit_ + miss_)));
        console.log('miss rate : ' + (miss_ / (hit_ + miss_)));
    };

    return {
        put: put,
        get: get,
        hasKey: hasKey,
        invalidate: invalidate,
        logStats: logStats,
    }
})();

export {cache}