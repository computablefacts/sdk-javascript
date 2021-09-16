import {httpClient} from './http-client'
import {webComponents} from './web-components';
import {CfInterface} from './cf.interface'
import {cache} from './cache';

const cf: CfInterface = (function () {

    return {
        httpClient: httpClient,
        webComponents: webComponents,
        cache: cache,
        google: {
            maps: {
                scriptUrl: null,
                isLoaded: false,
            },
        },
    }

})();

export {cf}
