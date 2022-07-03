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
 * A simple 53-bits hashing algorithm with good enough distribution.
 *
 * @param {*} obj the value to hash.
 * @param {number} seed a seed.
 * @return {number} the hashed value.
 * @memberOf module:helpers
 * @preserve The code is (mostly) extracted from https://stackoverflow.com/a/52171480.
 */
helpers.goodFastHash = function (obj, seed) {

  const newStr = obj ? JSON.stringify(obj) : ''; // ensure newStr is a string, never a number
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