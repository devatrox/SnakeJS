import { Config } from './bootstrap.js'
import Assert from './tools/Assert.js'

/**
 * @param {Number} seconds
 * @returns {Promise}
 */
export function delay (seconds) {
  Assert.number(seconds)
  let ms = seconds * 100

  return new Promise(resolve => window.setTimeout(resolve, ms))
}

/**
 * @param {String} message
 * @returns {String}
 */
export function notify (...message) {
  if (Config.notify === 'console') {
    console.info(...message)
  } else if (Config.notify === 'notification') {
    message = (message).join(' ')
    if (Notification.permission === 'granted') {
      // eslint-disable-next-line no-new
      new Notification(message)
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(() => new Notification(message))
    }
  }

  return message
}

/**
 * @param {String} name
 * @param {Function} cb
 * @param {EventTarget} [target]
 */
export function listen (name, cb, target = window) {
  Assert.string(name)
  Assert.function(cb)
  Assert.instance(target, EventTarget)

  target.addEventListener(name, cb, false)
}

/**
 * @param {String} name
 * @param {Object} details
 * @param {EventTarget} [target]
 */
export function emit (name, details = {}, target = window) {
  Assert.string(name)
  Assert.plainObject(details)
  Assert.instance(target, EventTarget)

  let event = new CustomEvent(name, {
    detail: details
  })
  target.dispatchEvent(event)
}
