'use strict'

/**
 * @module platform
 */
export const platform = {};

/**
 * The HttpClient type.
 *
 * @memberOf module:platform
 * @constructor
 * @struct
 * @final
 */
platform.HttpClient = function () {

  let baseUrl_ = '';
  let baseUrlAutodetect_ = false;
  let token_ = '';
  let tokenAutodetect_ = false;

  const reset = () => {
    baseUrl_ = '';
    baseUrlAutodetect_ = false;
    token_ = '';
    tokenAutodetect_ = false;
  }

  const findTokenFromQueryString = () => {
    const urlParams = new URLSearchParams(window?.location?.search);
    const token = urlParams.get('token');
    return token ? token : '';
  }

  const findBaseUrlFromReferrer = () => {
    let origin = '';
    if (window && window.document && window.document.referrer) {
      const url = new URL(window.document.referrer);
      origin = url.origin;
    }
    return origin;
  }

  /**
   * Execute a Http request to a given platform endpoint.
   *
   * @param {string} endpoint the platform endpoint.
   * @param {Object} body the request payload.
   * @param {...*} customConfig the Http request configuration.
   * @return {Promise<Object>} the platform response.
   */
  const fetch = (endpoint, {body, ...customConfig} = {}) => {
    const headers = {'Content-Type': 'application/json'}
    const config = {
      method: 'GET', ...customConfig, headers: {
        ...headers, ...customConfig.headers,
      },
    }
    if (body) {
      if (config.method === 'GET') {
        endpoint += '?' + new URLSearchParams(body);
      } else {
        config.body = JSON.stringify(body);
      }
    }
    return window.fetch(endpoint, config).then(async response => {
      if (response.ok) {
        return await response.json();
      } else {
        const errorMessage = await response.json();
        return Promise.reject(new Error(errorMessage.error));
      }
    });
  }

  /**
   * Returns the API token.
   *
   * @return {string} the API token.
   */
  this.getToken = function () {
    return token_;
  }

  /**
   * Set the API token.
   *
   * @param {string} token The API token.
   */
  this.setToken = function (token) {
    tokenAutodetect_ = false;
    token_ = token;
  }

  /**
   * Checks if the API token is set.
   *
   * @returns {boolean} returns true iif the API token is set, false otherwise.
   */
  this.hasToken = function () {
    return token_ !== '';
  }

  /**
   * Returns the API base URL.
   *
   * @return {string} the API base URL.
   */
  this.getBaseUrl = function () {
    return baseUrl_;
  }

  /**
   * Set the API base URL.
   *
   * @param {string} url the API base URL.
   */
  this.setBaseUrl = function (url) {
    baseUrlAutodetect_ = false;
    baseUrl_ = url;
  }

  /**
   * Checks if the API base URL is set.
   *
   * @returns {boolean} true iif the API base URL is set, false otherwise.
   */
  this.hasBaseUrl = function () {
    return baseUrl_ !== '';
  }

  /**
   * Initializes the Http client.
   *
   * If you omit a parameter, we will try to autodetect it.
   * For `token`, we try to find it on the query string. Ex: `?token=your_api_token`.
   * For `baseUrl`, we try to find it from the referrer.
   *
   * @param {string} baseUrl the base URL eg. https://www.company.computablefacts.com
   * @param {string} token the token.
   */
  this.init = function (baseUrl, token) {

    reset();

    if (typeof token === 'undefined') {
      token_ = findTokenFromQueryString();
      tokenAutodetect_ = this.hasToken();
      // console.log('init-autodetect-token token=', token, '_tokenAutodetect=', _tokenAutodetect)
    } else {
      this.setToken(token)
    }

    if (typeof baseUrl === 'undefined') {
      baseUrl_ = findBaseUrlFromReferrer();
      baseUrlAutodetect_ = this.hasBaseUrl();
      // console.log('init-autodetect-baseUrl baseUrl=', baseUrl, 'baseUrlAutodetect_=', baseUrlAutodetect_)
    } else {
      this.setBaseUrl(baseUrl);
    }
  }

  /**
   * Checks if the API token and base URL have been automatically set.
   *
   * @return `true` if the API token and base URL have been automatically set during [[`init`]].
   */
  this.hasAutodetect = function () {
    return tokenAutodetect_ && baseUrlAutodetect_;
  }

  /**
   * Returns the user information based on the API token.
   *
   * @return {Promise<Object>} the user permissions and authorizations.
   */
  this.whoAmI = function () {
    return fetch(`${baseUrl_}/api/v2/users/whoami`, {
      headers: {
        Authorization: `Bearer ${token_}`
      }
    });
  }

  /**
   * Call the platform JSON-RPC endpoint.
   *
   * @param {Object} payload the request payload.
   * @return {Promise<Object>} the platform response.
   * @preserve The specification can be found at https://www.jsonrpc.org/specification.
   */
  this.fetch = function (payload) {
    return fetch(`${baseUrl_}/api/v2/public/json-rpc?api_token=${token_}`,
        {body: payload, method: 'POST'}).then(response => {
      if ('error' in response) {
        const error = response['error'];
        const message = '(' + error.code + ') ' + error.message + '\n'
            + JSON.stringify(error.data);
        return Promise.reject(new Error(message));
      }
      return response['result'];
    });
  }

  /**
   * Call the `execute-problog-query` platform endpoint.
   *
   * @param {Object} params the request payload.
   * @return {Promise<Object>} the platform response.
   */
  this.executeProblogQuery = function (params) {
    return this.fetch({
      jsonrpc: '2.0',
      id: Date.now(),
      method: 'execute-problog-query',
      params: params
    });
  }

  /**
   * Call the `execute-sql-query` platform endpoint.
   *
   * @param {Object} params the request payload.
   * @return {Promise<Object>} the platform response.
   */
  this.executeSqlQuery = function (params) {
    return this.fetch({
      jsonrpc: '2.0',
      id: Date.now(),
      method: 'execute-sql-query',
      params: params
    });
  }

  /**
   * Call the `find-objects` platform endpoint.
   *
   * @param params the request payload.
   * @return {Promise<Object>} the platform response.
   */
  this.findObjects = function (params) {
    return this.fetch({
      jsonrpc: '2.0', id: Date.now(), method: 'find-objects', params: params
    });
  }

  /**
   * Call the `get-objects` platform endpoint.
   *
   * @param params the request payload.
   * @return {Promise<Array<Object>>} the platform response.
   */
  this.getObjects = function (params) {
    return this.fetch({
      jsonrpc: '2.0', id: Date.now(), method: 'get-objects', params: params
    });
  }

  /**
   * Call the `get-flattened-objects` platform endpoint.
   *
   * @param params the request payload.
   * @return {Promise<Array<Object>>} the platform response.
   */
  this.getFlattenedObjects = function (params) {
    return this.fetch({
      jsonrpc: '2.0',
      id: Date.now(),
      method: 'get-flattened-objects',
      params: params
    });
  }
}