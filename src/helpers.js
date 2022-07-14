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

  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13),
      3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13),
      3266489909);

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