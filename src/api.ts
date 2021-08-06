import {client} from './api-client'
import {CfApiInterface, materializeSqlConfig} from './api.interface'

const api: CfApiInterface = (function () {

  let baseUrl_: string
  let baseUrlAutodetect_: boolean
  let token_: string
  let tokenAutodetect_: boolean

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

    if (document && document.referrer) {
      const url = new URL(document.referrer)
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

  const materializeSql = (config: materializeSqlConfig) => {
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
  }

  const whoami = () => {
    return client(`${baseUrl_}/api/v2/users/whoami`, {
      // @ts-ignore
      // error TS2345: Argument of type '{ body: { query: string; format: string; }; headers: { Authorization: string; }; }' is not assignable to parameter of type '{ body: any; }'.
      headers: {
        Authorization: `Bearer ${token_}`
      }
    })
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
    materializeSql: materializeSql,
    whoami: whoami,
  }

})();

export {api, CfApiInterface, materializeSqlConfig}
