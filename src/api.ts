import {client} from './api-client'

type materializeSqlConfig = {
  query: string,
  format: string,
}

interface CfApi {
  getToken: () => string,
  setToken: (newValue: string) => void,
  hasToken: () => boolean,

  getBaseUrl: () => string,
  setBaseUrl: (newValue: string) => void,
  hasBaseUrl: () => boolean,

  init: (token: string, baseUrl: string) => void,
  hasAutodetect: () => boolean,
  materializeSql: (config: materializeSqlConfig) => Promise<Response>,
}

const api = (function () {

  let baseUrl_: string
  let baseUrlAutodetect_: boolean
  let token_: string
  let tokenAutodetect_: boolean

  const reset = () => {
    baseUrl_ = ''
    baseUrlAutodetect_ = false
    token_ = ''
    tokenAutodetect_ = false
  }

  const findTokenFromQueryString = (): string => {
    const urlParams = new URLSearchParams(window?.location?.search);
    const token = urlParams.get('token')

    return token ? token : '';
  }

  const findBaseUrlFromReferrer = (): string => {
    let origin: string = ''

    if (document && document.referrer) {
      const url = new URL(document.referrer)
      origin = url.origin
    }

    return origin
  }

  let publicFunctions: CfApi = {
    getToken: (): string => {
      return token_
    },

    setToken: (newValue: string): void => {
      tokenAutodetect_ = false
      token_ = newValue
    },

    hasToken: (): boolean => {
      return token_ !== ''
    },

    getBaseUrl: (): string => {
      return baseUrl_
    },

    setBaseUrl: (newValue: string): void => {
      baseUrlAutodetect_ = false
      baseUrl_ = newValue
    },

    hasBaseUrl: (): boolean => {
      return baseUrl_ !== ''
    },

    hasAutodetect: (): boolean => {
      return tokenAutodetect_ && baseUrlAutodetect_
    },

    init: (token: string, baseUrl: string): void => {
      reset()

      if (typeof token === 'undefined') {
        token_ = findTokenFromQueryString()
        tokenAutodetect_ = publicFunctions.hasToken()
        //console.log('init-autodetect-token token=', token, '_tokenAutodetect=', _tokenAutodetect)
      } else {
        publicFunctions.setToken(token)
      }

      if (typeof baseUrl === 'undefined') {
        baseUrl_ = findBaseUrlFromReferrer()
        baseUrlAutodetect_ = publicFunctions.hasBaseUrl()
        //console.log('init-autodetect-baseUrl baseUrl=', baseUrl, 'baseUrlAutodetect_=', baseUrlAutodetect_)
      } else {
        publicFunctions.setBaseUrl(baseUrl)
      }

    },

    materializeSql: (config: materializeSqlConfig) => {
      return client(`${baseUrl_}/api/v2/public/materialize/sql`, {
        body: {
          query: config.query,
          format: config.format,
        },

        // @ts-ignore
        // error TS2345: Argument of type '{ body: { query: string; format: string; }; headers: { Authorization: string; }; }' is not assignable to parameter of type '{ body: any; }'.
        headers: {
          Authorization: `Bearer ${token_}`
        }
      })
    },

  }


  return publicFunctions

})();

export {api, CfApi}
