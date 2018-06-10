import { Config } from '../bootstrap.js'
import Assert from './assert.js'

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
 * @param {*[]} message
 * @returns {String}
 */
export function notify (...message) {
  let joinedMessage = (message).join(' ')

  if (Config.notify === 'console') {
    console.info(...message)
  } else if (Config.notify === 'notification') {
    Notification.requestPermission().then(() => new Notification(joinedMessage))
  }

  return joinedMessage
}

/**
 * @param {String} name
 * @param {function(CustomEvent)} cb
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
