'use strict'

export const json = {};

/**
 * Converts a Javascript value to a base-64 encoded string.
 *
 * @param {*} obj a Javascript value, usually an object or array, to be converted.
 * @return {string} a base-64 encoded string.
 */
json.toBase64 = function (obj) {
  return btoa(JSON.stringify(obj));
}

/**
 * Convert a base-64 encoded string to a Javascript value.
 *
 * @param {string} str a base-64 encoded string.
 * @return {*} a Javascript value.
 */
json.fromBase64 = function (str) {
  return JSON.parse(atob(str));
}