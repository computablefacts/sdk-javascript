import {fetchCfApi} from './fetch-api-client'
import {
    autocompleteConceptConfig,
    HttpClientInterface,
    materializeConceptConfig,
    materializedConceptsSqlQueryConfig
} from './http-client.interface'
import {CfInterface} from './cf.interface';

const httpClient: HttpClientInterface = (function () {

    let baseUrl_ = ''
    let baseUrlAutodetect_ = false
    let token_ = ''
    let tokenAutodetect_ = false

    const reset_ = () => {
        baseUrl_ = ''
        baseUrlAutodetect_ = false
        token_ = ''
        tokenAutodetect_ = false
    }

    const findTokenFromQueryString_ = (): string => {

        const urlParams = new URLSearchParams(window?.location?.search);
        const token = urlParams.get('token')

        return token ? token : '';
    }

    const findBaseUrlFromReferrer_ = (): string => {

        let origin = ''

        if (window && window.document && window.document.referrer) {
            const url = new URL(window.document.referrer)
            origin = url.origin
        }

        return origin
    }

    const getToken = (): string => {
        return token_
    }

    const setToken = (newValue: string): void => {
        tokenAutodetect_ = false
        token_ = newValue
    }

    const hasToken = (): boolean => {
        return token_ !== ''
    }

    const getBaseUrl = (): string => {
        return baseUrl_
    }

    const setBaseUrl = (newValue: string): void => {
        baseUrlAutodetect_ = false
        baseUrl_ = newValue
    }

    const hasBaseUrl = (): boolean => {
        return baseUrl_ !== ''
    }

    const hasAutodetect = (): boolean => {
        return tokenAutodetect_ && baseUrlAutodetect_
    }

    const init = (token?: string, baseUrl?: string): void => {

        reset_()

        if (typeof token === 'undefined') {
            token_ = findTokenFromQueryString_()
            tokenAutodetect_ = hasToken()
            //console.log('init-autodetect-token token=', token, '_tokenAutodetect=', _tokenAutodetect)
        } else {
            setToken(token)
        }

        if (typeof baseUrl === 'undefined') {
            baseUrl_ = findBaseUrlFromReferrer_()
            baseUrlAutodetect_ = hasBaseUrl()
            //console.log('init-autodetect-baseUrl baseUrl=', baseUrl, 'baseUrlAutodetect_=', baseUrlAutodetect_)
        } else {
            setBaseUrl(baseUrl)
        }
    }

    const queryMaterializedConcepts = (config: materializedConceptsSqlQueryConfig) => {
        return fetchCfApi(`${baseUrl_}/api/v2/public/materialize/sql`, {
            // @ts-ignore
            // error TS2345: Argument of type '{ method: string; body: { query: string; format: "objects" | "arrays" | "arrays_with_header" | "csv" | "csv_with_header"; catalog: boolean; }; headers: { Authorization: string; }; }' is not assignable to parameter of type '{ body: any; }'.
            method: 'POST',
            body: {
                query: config.query,
                format: config.format || 'objects',
                catalog: config.catalog || false,
            },

            // @ts-ignore
            // error TS2345: Argument of type '{ body: { query: string; format: string; }; headers: { Authorization: string; }; }' is not assignable to parameter of type '{ body: any; }'.
            headers: {
                Authorization: `Bearer ${token_}`
            }
        });
    }

    const whoAmI = () => {
        return fetchCfApi(`${baseUrl_}/api/v2/users/whoami`, {
            // @ts-ignore
            // error TS2345: Argument of type '{ body: { query: string; format: string; }; headers: { Authorization: string; }; }' is not assignable to parameter of type '{ body: any; }'.
            headers: {
                Authorization: `Bearer ${token_}`
            }
        });
    }

    const autocompleteConcept = (config: autocompleteConceptConfig) => {
        return fetchCfApi(`${baseUrl_}/api/v3/coreapi/problog/queries/autocomplete`, {

            // @ts-ignore
            // TS2345: Argument of type '{ method: string; body: { uuid: string; concept: string; properties: string[]; terms: string[]; }; headers: { Authorization: string; }; }' is not assignable to parameter of type '{ body: any; }'.
            method: 'POST',

            body: {
                uuid: config.uuid,
                concept: config.concept,
                properties: config.properties,
                terms: config.terms,
                format: config.format,
                sample_size: config.sample_size,
            },

            // @ts-ignore
            // TS2345: Argument of type '{ method: string; body: { uuid: string; query: string; properties: string[]; terms: string[]; }; headers: { Authorization: string; }; }' is not assignable to parameter of type '{ body: any; }'.
            headers: {
                Authorization: `Bearer ${token_}`
            }
        });
    }

    const materializeConcept = (config: materializeConceptConfig) => {

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const cf = (window as any).cf as CfInterface;
        const cache = cf.cache;
        const namespace = 'mc';
        const cacheKey = config.concept + '¤' +
            config.format + '¤' +
            config.sample_size + '¤' +
            config.parameters.map(param => JSON.stringify(param, Object.keys(param).sort())).join('¤');

        if (cache.hasKey(namespace, cacheKey)) {
            const result = {
                id: config.uuid,
                results: cache.get(namespace, cacheKey).results,
            }
            return Promise.resolve(result);
        }
        return fetchCfApi(`${baseUrl_}/api/v3/coreapi/problog/queries/execute`, {

            // @ts-ignore
            method: 'POST',

            body: {
                uuid: config.uuid,
                concept: config.concept,
                parameters: config.parameters,
                format: config.format,
                sample_size: config.sample_size,
            },

            // @ts-ignore
            headers: {
                Authorization: `Bearer ${token_}`
            }
        }).then(results => {
            cache.put(namespace, cacheKey, results);
            return results;
        });
    }

    return {
        getToken: getToken,
        setToken: setToken,
        hasToken: hasToken,

        getBaseUrl: getBaseUrl,
        setBaseUrl: setBaseUrl,
        hasBaseUrl: hasBaseUrl,

        init: init,
        hasAutodetect: hasAutodetect,
        queryMaterializedConcepts: queryMaterializedConcepts,
        whoAmI: whoAmI,
        autocompleteConcept: autocompleteConcept,
        materializeConcept: materializeConcept,
    }
})();

export {httpClient, HttpClientInterface, materializedConceptsSqlQueryConfig, autocompleteConceptConfig}
