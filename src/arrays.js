'use strict'

/**
 * @module arrays
 */
export const arrays = {};

/**
 * Removes {@link undefined} elements from an array of strings or numbers and returns distinct values.
 * This function does not preserve the elements order.
 *
 * @param {Array<string|number>} array an array of strings.
 * @return {Array<string|number>} an array of distinct strings.
 * @memberOf module:arrays
 */
arrays.distinct = function (array) {
  return array instanceof Array ? Array.from(new Set(array.filter(el => el !== undefined))) : [];
}

/**
 * Removes {@link undefined} elements from an array of objects and return distinct objects i.e. unique by all properties.
 * This function does not preserve the elements order.
 *
 * @param {Array<Object>} array an array of objects.
 * @return {Array<Object>} an array of distinct objects.
 * @memberOf module:arrays
 */
arrays.distinctObjects = function (array) {
  return array instanceof Array ? array
  .filter(el => el !== undefined)
  .filter((el1, index, self) => self.findIndex(el2 => (JSON.stringify(el2) === JSON.stringify(el1))) === index) : [];
}

/**
 * Computes the intersection of two arrays of strings or numbers.
 *
 * @param {Array<string|number>} array1 the first array.
 * @param {Array<string|number>} array2 the second array.
 * @return {Array<string|number>} the intersection of the two arrays.
 * @memberOf module:arrays
 */
arrays.intersect = function (array1, array2) {
  return array1 instanceof Array && array2 instanceof Array ? array1.filter(el => array2.includes(el)) : [];
}

