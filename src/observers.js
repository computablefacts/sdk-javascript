'use strict'

/**
 * @module observers
 */
export const observers = {};

/**
 * The Subject type.
 *
 * The observer pattern is a software design pattern in which an object, named the subject,
 * maintains a list of its dependents, called observers, and notifies them automatically of
 * any state changes, usually by calling one of their methods.
 *
 * @memberOf module:observers
 * @constructor
 * @struct
 * @final
 */
observers.Subject = function () {

  const observers = {};

  /**
   * Returns the number of observers for a given message type.
   *
   * @param {string} message  the observed message.
   * @return {number} the number of observers.
   */
  this.numberOfObservers = function (message) {
    if (message) {
      return observers.hasOwnProperty(message) ? observers[message].length : 0;
    }
    let nbObservers = 0;
    for (const msg in observers) {
      nbObservers += observers[msg].length
    }
    return nbObservers;
  }

  /**
   * Register a callback for a given message type.
   *
   * @param {string} message the message to observe.
   * @param {Function} observer the callback to notify.
   */
  this.register = function (message, observer) {
    if (message && typeof message === 'string' && observer && observer
        instanceof Function) {
      if (!observers.hasOwnProperty(message)) {
        observers[message] = [];
      }
      observers[message].push(observer);
    }
  }

  /**
   * Unregister a callback for a given message type.
   *
   * @param {string} message the observed message.
   * @param {Function} observer the notified callback.
   */
  this.unregister = function (message, observer) {
    if (message && typeof message === 'string' && observer && observer
        instanceof Function && observers.hasOwnProperty(message)) {
      observers[message] = observers[message].filter(o => o !== observer);
    }
  }

  /**
   * Notify all observers listening to a given message type.
   *
   * @param {string} message the message type.
   * @param {arguments} args a list of arguments to pass to each callback.
   */
  this.notify = function (message, ...args) {
    if (message && typeof message === 'string' && args
        && observers.hasOwnProperty(message)) {
      observers[message].forEach(observer => observer(...args));
    }
  }
}
