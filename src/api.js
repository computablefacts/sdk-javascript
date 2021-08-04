import {client} from './api-client'

const api = (function () {

  let _baseUrl;
  let _baseUrlAutodetect;
  let _token;
  let _tokenAutodetect;
  let publicFunctions = {};

  const reset = () => {
    _baseUrl = undefined
    _baseUrlAutodetect = undefined
    _token = undefined
    _tokenAutodetect = undefined
  }

  publicFunctions.getToken = () => {
    return _token
  }

  publicFunctions.setToken = (newValue) => {
    _tokenAutodetect = false
    _token = newValue
  }

  publicFunctions.hasToken = () => {
    return _token !== undefined && _token !== null && _token !== ''
  }

  publicFunctions.getBaseUrl = () => {
    return _baseUrl
  }

  publicFunctions.setBaseUrl = (newValue) => {
    _baseUrlAutodetect = false
    _baseUrl = newValue
  }

  publicFunctions.hasBaseUrl = () => {
    return _baseUrl !== undefined && _baseUrl !== null && _baseUrl !== ''
  }

  const findTokenFromQueryString = () => {
    const urlParams = new URLSearchParams(window?.location?.search);
    const token = urlParams.get('token')

    return token ? token : undefined;
  }

  const findBaseUrlFromReferrer = () => {
    let origin

    if (document?.referrer) {
      const url = new URL(document?.referrer)
      origin = url.origin
    }

    return origin
  }

  publicFunctions.hasAutodetect = (newValue) => {
    return _tokenAutodetect && _baseUrlAutodetect
  }

  publicFunctions.init = (token, baseUrl) => {
    reset()

    if (typeof token === 'undefined') {
      _token = findTokenFromQueryString()
      _tokenAutodetect = publicFunctions.hasToken()
      //console.log('init-autodetect-token token=', token, '_tokenAutodetect=', _tokenAutodetect)
    } else {
      publicFunctions.setToken(token)
    }

    if (typeof baseUrl === 'undefined') {
      _baseUrl = findBaseUrlFromReferrer()
      _baseUrlAutodetect = publicFunctions.hasBaseUrl()
      //console.log('init-autodetect-baseUrl baseUrl=', baseUrl, '_baseUrlAutodetect=', _baseUrlAutodetect)
    } else {
      publicFunctions.setBaseUrl(baseUrl)
    }

  }

  publicFunctions.materializeSql = ({query, format}) => {
    return client(`${_baseUrl}/api/v2/public/materialize/sql`, {
      body: {
        query: query,
        format: format,
      },
      headers: {
        Authorization: `Bearer ${_token}`
      }
    })
  }

  return publicFunctions

})();

export {api}
