'use strict'

/**
 * @module dates
 */
export const dates = {};

/**
 * Initializes a javascript {@link Date} from a string or number formatted as YYYYMMDD.
 *
 * @param {string|number} str a string or number formatted as YYYYMMDD.
 * @return {?Date} a javascript {@link Date}.
 * @memberOf module:dates
 */
dates.yyyyMmDdToDate = function (str) {
  str = str ? '' + str.trim() : '';
  if (str.length === 8) {
    const year = parseInt(str.substring(0, 4), 10);
    const month = parseInt(str.substring(4, 6), 10);
    const day = parseInt(str.substring(6, 8), 10);
    return new Date(year, month - 1, day);
  }
  return null;
}

/**
 * Initializes a javascript {@link Date} from a string or number formatted as DDMMYYYY.
 *
 * @param {string|number} str a string or number formatted as DDMMYYYY.
 * @return {?Date} a javascript {@link Date}.
 * @memberOf module:dates
 */
dates.ddMmYyyyToDate = function (str) {
  str = str ? '' + str.trim() : '';
  if (str.length === 8) {
    const day = parseInt(str.substring(0, 2), 10);
    const month = parseInt(str.substring(2, 4), 10);
    const year = parseInt(str.substring(4, 8), 10);
    return new Date(year, month - 1, day);
  }
  return null;
}

/**
 * Formats a javascript {@link Date} to a string formatted as YYYY-MM-DD.
 *
 * @param {Date} date a javascript {@link Date}.
 * @param {?string} separator a separator that will be inserted between the date parts.
 * @return {?string} a string formatted as YYYY-MM-DD.
 * @memberOf module:dates
 */
dates.dateToYyyyMmDd = function (date, separator) {
  separator = separator || separator === '' ? separator : '-';
  return date instanceof Date ? date.getFullYear() + separator
      + (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1) + separator
      + (date.getDate() < 10 ? '0' : '') + date.getDate() : null;
}

/**
 * Formats a javascript {@link Date} to a string formatted as DD-MM-YYYY.
 *
 * @param {Date} date a javascript {@link Date}.
 * @param {?string} separator a separator that will be inserted between the date parts.
 * @return {?string} a string formatted as DD-MM-YYYY.
 * @memberOf module:dates
 */
dates.dateToDdMmYyyy = function (date, separator) {
  separator = separator || separator === '' ? separator : '-';
  return date instanceof Date ? (date.getDate() < 10 ? '0' : '')
      + date.getDate() + separator + (date.getMonth() < 9 ? '0' : '')
      + (date.getMonth() + 1) + separator + date.getFullYear() : null;
}