import {httpClient} from './http-client'
import {webComponents} from './web-components';
import {CfInterface} from './cf.interface'

const cf: CfInterface = (function () {

    return {
        httpClient: httpClient,
        webComponents: webComponents,
        google: {
            maps: {
                scriptUrl: null,
                isLoaded: false,
            },
        },
    }

})();

export {cf}
