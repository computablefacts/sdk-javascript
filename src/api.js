const api = (function () {

  let _baseUrl;
  let _token;
  let publicFunctions = {};

  const reset = () => {
    _baseUrl = undefined
    _token = undefined
  }

  publicFunctions.getToken = () => {
    return _token
  }

  publicFunctions.setToken = (newValue) => {
    _token = newValue
  }

  publicFunctions.hasToken = (newValue) => {
    return _token !== undefined && _token !== null && _token !== ''
  }

  publicFunctions.getBaseUrl = () => {
    return _baseUrl
  }

  publicFunctions.setBaseUrl = (newValue) => {
    _baseUrl = newValue
  }

  publicFunctions.hasBaseUrl = (newValue) => {
    return _baseUrl !== undefined && _baseUrl !== null && _baseUrl !== ''
  }

  const findTokenFromQueryString = () => {
    const urlParams = new URLSearchParams(window?.location?.search);
    const token = urlParams.get('token')

    return token ? token : undefined;
  }

  const findUrlFromReferrer = () => {
    let origin

    if (document?.referrer) {
      const url = new URL(document?.referrer)
      origin = url.origin
    }

    return origin
  }

  publicFunctions.init = (token, baseUrl) => {
    reset()

    if (typeof token === 'undefined') {
      token = findTokenFromQueryString()
    }
    //console.log('token:', token)

    if (typeof baseUrl === 'undefined') {
      baseUrl = findUrlFromReferrer()
    }
    //console.log('baseUrl:', baseUrl)

    publicFunctions.setBaseUrl(baseUrl)
    publicFunctions.setToken(token)
  }

  return publicFunctions

})();

export {api}
