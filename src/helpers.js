'use strict'

/**
 * @module helpers
 */
export const helpers = {};

/**
 * Converts a Javascript value to a base-64 encoded string.
 *
 * @param {*} obj a Javascript value, usually an object or array, to be converted.
 * @return {string} a base-64 encoded string.
 * @memberOf module:helpers
 */
helpers.toBase64 = function (obj) {
  return btoa(JSON.stringify(obj));
}

/**
 * Converts a base-64 encoded string to a Javascript value.
 *
 * @param {string} str a base-64 encoded string.
 * @return {*} a Javascript value.
 * @memberOf module:helpers
 */
helpers.fromBase64 = function (str) {
  return JSON.parse(atob(str));
}

/**
 * A version of {@link JSON.stringify} that returns a canonical JSON format.
 *
 * 'Canonical JSON' means that the same object should always be stringified to the exact same string.
 * JavaScripts native {@link JSON.stringify} does not guarantee any order for object keys when serializing.
 *
 * @param value the value to stringify.
 * @returns {string} the stringified value.
 * @memberOf module:helpers
 * @preserve The code is extracted from https://github.com/mirkokiefer/canonical-json.
 */
helpers.stringify = function (value) {

  function isObject(object) {
    return Object.prototype.toString.call(object) === '[object Object]'
  }

  function copyObjectWithSortedKeys(object) {
    if (isObject(object)) {
      const newObj = {}
      const keysSorted = Object.keys(object).sort()
      let key
      for (let i = 0, len = keysSorted.length; i < len; i++) {
        key = keysSorted[i]
        newObj[key] = copyObjectWithSortedKeys(object[key])
      }
      return newObj
    } else if (Array.isArray(object)) {
      return object.map(copyObjectWithSortedKeys)
    } else {
      return object
    }
  }

  return JSON.stringify(copyObjectWithSortedKeys(value))
}

/**
 * A simple 53-bits hashing algorithm with good enough distribution.
 *
 * @param {*} obj the value to hash.
 * @param {number} seed a seed.
 * @return {number} the hashed value.
 * @memberOf module:helpers
 * @preserve The code is extracted from https://stackoverflow.com/a/52171480.
 */
helpers.goodFastHash = function (obj, seed) {

  const newStr = obj ? helpers.stringify(obj) : '';
  const newSeed = seed ? seed : 0;
  let h1 = 0xdeadbeef ^ newSeed;
  let h2 = 0x41c6ce57 ^ newSeed;

  for (let i = 0, ch; i < newStr.length; i++) {
    ch = newStr.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }

  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

/**
 * Inject multiple scripts.
 *
 * @param {Element} el the root node where the scripts will be injected.
 * @param {Array<string>} urls the scripts URL.
 * @return a {Promise<*>}.
 */
helpers.injectScripts = function (el, urls) {

  let promise = null;

  for (let i = 0; i < urls.length; i++) {
    if (promise) {
      promise = promise.then(() => this.injectScript(el, urls[i]));
    } else {
      promise = this.injectScript(el, urls[i]);
    }
  }
  return promise;
}

/**
 * Inject a single script.
 *
 * @param {Element} el the root node where the script will be injected.
 * @param {string} url the script URL.
 * @return a {Promise<*>}.
 * @preserve The code is extracted from https://gist.github.com/james2doyle/28a59f8692cec6f334773007b31a1523.
 */
helpers.injectScript = function (el, url) {
  return el ? new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    script.onerror = function (err) {
      console.log('Script failed : ' + url, err);
      reject(url, script, err);
    }
    script.onload = function () {
      console.log('Script loaded : ' + url);
      resolve(url, script)
    }
    el.appendChild(script);
  }) : Promise.reject('invalid node');
}

/**
 * Inject multiple stylesheets.
 *
 * @param {Element} el the root node where the scripts will be injected.
 * @param {Array<String>} urls the stylesheets URL.
 * @return a {Promise<*>}.
 */
helpers.injectStyles = function (el, urls) {

  let promise = null;

  for (let i = 0; i < urls.length; i++) {
    if (promise) {
      promise = promise.then(() => this.injectStyle(el, urls[i]));
    } else {
      promise = this.injectStyle(el, urls[i]);
    }
  }
  return promise;
}

/**
 * Inject a single stylesheet.
 *
 * @param {Element} el the root node where the script will be injected.
 * @param {string} url the stylesheet URL.
 * @return a {Promise<*>}.
 * @preserve The code is extracted from https://gist.github.com/james2doyle/28a59f8692cec6f334773007b31a1523.
 */
helpers.injectStyle = function (el, url) {
  return el ? new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.href = url;
    link.rel = 'stylesheet';
    el.appendChild(link);
    console.log('Stylesheet loaded : ' + url);
    resolve(url, link);
  }) : Promise.reject('invalid node');
}

/**
 * Chunk a list and gives the UI thread a chance to process any pending UI events between each chunk (keeps the UI active).
 *
 * @param {Array<Object>} array the array to chunk and process.
 * @param {function(Object, Object): void} callback the callback to call for each array element.
 * @param {Object} context misc. contextual information (optional).
 * @param {number} maxTimePerChunk the maximum time to spend (guidance) in the callback for each chunk (optional).
 *
 * @preserve The code is extracted from https://stackoverflow.com/a/10344560.
 */
helpers.forEach = function (array, callback, context, maxTimePerChunk) {

  array = array || [];
  context = context || {};
  callback = callback || function (item, context) {
  };
  maxTimePerChunk = maxTimePerChunk || 200;
  let index = 0;

  function now() {
    return new Date().getTime();
  }

  function doChunk() {

    const startTime = now();

    while (index < array.length && (now() - startTime) <= maxTimePerChunk) {
      callback(array[index], context);
      ++index;
    }
    if (index < array.length) {
      setTimeout(doChunk, 1);
    }
  }

  doChunk();
}

/**
 * Delay a javascript function call. Executes only the last call.
 *
 * @param func the function to execute.
 * @param timeout the delay before the function can be called.
 * @returns {function}
 */
helpers.debounceLast = function (func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

/**
 * Delay a javascript function call. Executes only the first call.
 *
 * @param func the function to execute.
 * @param timeout the delay before the function can be called again.
 * @returns {function}
 */
helpers.debounceFirst = function (func, timeout = 300) {
  let timer;
  return (...args) => {
    if (!timer) {
      func.apply(this, args);
    }
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
    }, timeout);
  };
}

/**
 * Download a JSON object or an array of JSON objects.
 *
 * @param filename the name of the downloaded file.
 * @param data the data to download.
 */
helpers.download = function (filename, data) {

  const blob = new Blob(JSON.stringify(data), {type: "application/json;charset=utf-8"});
  const isIE = false || !!document.documentMode;

  if (isIE) {
    window.navigator.msSaveBlob(blob, filename);
  } else {
    const url = window.URL || window.webkitURL;
    const link = url.createObjectURL(blob);
    const a = document.createElement("a");
    a.download = filename;
    a.href = link;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}