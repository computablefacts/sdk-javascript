import {HttpClientInterface} from './http-client'
import {WebComponentsInterface} from './web-components.interface';
import {CacheInterface} from './cache.interface';

type CfInterface = {
    httpClient: HttpClientInterface;
    webComponents: WebComponentsInterface;
    cache: CacheInterface;
    google: {
        maps: {
            scriptUrl: string | null;
            isLoaded: boolean;
        };
    };
};

export {CfInterface}
