'use strict'

import {caches} from "./caches";
import {helpers} from "./helpers";

/**
 * @module promises
 */
export const promises = {};

/**
 * An object that has the ability to memoize promises returned by a given user-defined function.
 *
 * @param {number} maxCacheSize the maximum number of distinct calls to cache.
 * @param {Function} fn a user-defined function that returns a promise.
 * @memberOf module:promises
 * @constructor
 * @struct
 * @final
 */
promises.Memoize = function (maxCacheSize, fn) {

  // Stats
  let hit_ = 0;
  let miss_ = 0;

  // Cache
  const cache_ = new caches.Cache(maxCacheSize);
  const function_ = fn;

  /**
   * Either read the cache or call the user-defined function and get a new promise.
   *
   * @param {...*} args a list of arguments to pass to the user-defined function.
   * @return {Promise} a promise to be resolved at a later stage.
   * @suppress {checkTypes}
   */
  this.promise = function (...args) {

    const cacheKey = helpers.goodFastHash(Array.from(args), 123).toString(10);

    if (cache_.contains(cacheKey)) {
      hit_++;
      return cache_.get(cacheKey);
    }

    cache_.put(cacheKey, function_(...args).catch(err => {
      cache_.remove(cacheKey);
      throw err;
    }));

    miss_++;
    return cache_.get(cacheKey);
  }

  /**
   * Return the number of cache hits.
   *
   * @return {number} the number of hits.
   */
  this.hits = function () {
    return hit_;
  }

  /**
   * Return the number of cache misses.
   *
   * @return {number} the number of misses.
   */
  this.misses = function () {
    return miss_;
  }

  /**
   * Return the cache hit rate.
   *
   * @return {number} the hit rate.
   */
  this.hitRate = function () {
    return hit_ / (hit_ + miss_);
  }

  /**
   * Return the cache miss rate.
   *
   * @return {number} the miss rate.
   */
  this.missRate = function () {
    return miss_ / (hit_ + miss_);
  }
}
