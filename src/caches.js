'use strict'

/**
 * @module caches
 */
export const caches = {};

/**
 * A very minimal cache. When the maximum size is reached, the oldest entry is removed from the cache.
 *
 * @param {number} maxSize the maximum number of entries to keep.
 * @memberOf module:caches
 * @constructor
 * @struct
 * @final
 */
caches.Cache = function (maxSize) {

  const maxSize_ = maxSize ? maxSize : 100;
  let queue_ = [];
  let map_ = {};

  /**
   * Returns the number of cached objects.
   *
   * @return {number} the number of cached objects.
   */
  this.size = function () {
    return Object.keys(map_).length;
  }

  /**
   * Check if a key has already been added to the cache.
   *
   * @param {string} key the key to check.
   * @return {boolean} true iif the key already exists, false otherwise.
   */
  this.contains = function (key) {
    return map_.hasOwnProperty(key);
  }

  /**
   * Adds a single cache entry.
   *
   * @param {string} key the entry key.
   * @param {*} value the entry value.
   * @return {*|null} the values previously associated with the given key.
   */
  this.put = function (key, value) {
    const prev = this.get(key);
    if (queue_.length >= maxSize_) {
      this.remove(queue_[0].key);
    }
    map_[key] = value;
    queue_.push({key: key, value: value});
    return prev;
  }

  /**
   * Returns a single cache entry.
   *
   * @param {string} key the key to get.
   * @return {*|null} the value associated with the given key.
   */
  this.get = function (key) {
    return this.contains(key) ? map_[key] : null;
  }

  /**
   * Returns a single cache entry or a default value if the cache key does not belong to the cache.
   *
   * @param {string} key the key to get.
   * @param {*|null} defaultValue the default value to return.
   */
  this.getOrDefault = function (key, defaultValue) {
    return this.contains(key) ? this.get(key) : defaultValue;
  }

  /**
   * Returns a single cache entry or add a new one if the cache key does not belong to the cache.
   *
   * @param key the key to get.
   * @param defaultValue the default to add to the cache.
   * @return {*|null}
   */
  this.getOrPut = function (key, defaultValue) {
    if (!this.contains(key)) {
      this.put(key, defaultValue);
    }
    return this.get(key);
  }

  /**
   * Removes a single cache entry.
   *
   * @param {string} key the key to evict.
   * @return {*|null} the value previously associated with the given key.
   */
  this.remove = function (key) {
    if (this.contains(key)) {
      const prev = this.get(key);
      queue_ = queue_.filter(entry => entry.key !== key);
      delete map_[key];
      return prev;
    }
    return null;
  }

  /**
   * Removes all cache entries.
   */
  this.invalidate = function () {
    map_ = {};
    queue_ = [];
  }
}