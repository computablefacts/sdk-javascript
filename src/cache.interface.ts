import {MemoizedPromise} from './cache';

interface CacheInterface {

    put: (namespace: string, key: string, value: any) => void,

    get: (namespace: string, key: string) => any,

    hasKey: (namespace: string, key: string) => boolean,

    invalidate: () => void,

    logStats: () => void,

    temporarilyMemoizedPromise: (fn: (params: any) => Promise<any>) => MemoizedPromise,

    indefinitelyMemoizedPromise: (fn: (params: any) => Promise<any>) => MemoizedPromise,
}

export {CacheInterface}
