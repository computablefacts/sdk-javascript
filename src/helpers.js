'use strict'

export const helpers = {};

/**
 * Converts a Javascript value to a base-64 encoded string.
 *
 * @param {*} obj a Javascript value, usually an object or array, to be converted.
 * @return {string} a base-64 encoded string.
 */
helpers.toBase64 = function (obj) {
  return btoa(JSON.stringify(obj));
}

/**
 * Convert a base-64 encoded string to a Javascript value.
 *
 * @param {string} str a base-64 encoded string.
 * @return {*} a Javascript value.
 */
helpers.fromBase64 = function (str) {
  return JSON.parse(atob(str));
}