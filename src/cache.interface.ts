interface CacheInterface {

    put: (namespace: string, key: string, value: any) => void,

    get: (namespace: string, key: string) => any,

    hasKey: (namespace: string, key: string) => boolean,

    invalidate: () => void,

    logStats: () => void,
}

export {CacheInterface}
