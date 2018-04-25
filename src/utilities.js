import { Config } from './bootstrap.js'

/**
 * @param {Number} seconds
 * @param {Function} fn
 * @returns {Promise}
 */
export function countDown (seconds, fn) {
  let arr = Array.from(Array(seconds).keys())

  return Promise.all(arr.map(number => {
    return new Promise(resolve => {
      fn(number)
      setTimeout(resolve, 1000)
    })
  }))
}

/**
 * @param {String} message
 * @returns {String}
 */
export function notify (...message) {
  if (Config.notify === 'console') {
    console.info(...message)
  } else if (Config.notify === 'notification') {
    if (Notification.permission === 'granted') {
      // eslint-disable-next-line no-new
      new Notification((message).join(' '))
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(notify)
    }
  }

  return message
}

/**
 * @param {String} name
 * @param {Object} details
 */
export function emit (name, details = {}) {
  let event = new CustomEvent(name, {
    detail: details
  })
  window.dispatchEvent(event)
}

/**
 * @param {Bool} condition
 * @param {String} message
 * @throws {Error}
 */
export function assert (condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed')
  }
}

/**
 * @param {*} thing
 * @param {Object} constructor
 * @throws {Error}
 */
export function assertIsInstanceOf (thing, constructor) {
  assert(thing instanceof constructor, `${thing} is not an instance of ${constructor.name}`)
}

/**
 * @param {*} thing
 * @param {String} type
 * @throws {Error}
 */
export function assertIsOfType (thing, type) {
  // eslint-disable-next-line valid-typeof
  assert(typeof thing === type, `${thing} is not of type ${type}`)
}
