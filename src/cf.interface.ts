import {HttpClientInterface} from './http-client'
import {WebComponentsInterface} from './web-components.interface';

type CfInterface = {
    httpClient: HttpClientInterface;
    webComponents: WebComponentsInterface;
    google: {
        maps: {
            scriptUrl: string | null;
            isLoaded: boolean;
        };
    };
};

export {CfInterface}
