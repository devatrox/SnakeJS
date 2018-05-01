import Game from './game.js'
import * as Utils from './utilities.js'
import { Config } from './bootstrap.js'
import Grid from './grid.js'

export default class View {
  /**
   * @param {Number} [width=640]
   * @param {Number} [height=480]
   * @param {Number} [scale=10]
   */
  constructor (width = 640, height = 480, scale = 10) {
    Utils.assert(width % scale === 0, `width must be a multiple of ${scale}`)
    Utils.assert(height % scale === 0, `height must be a multiple of ${scale}`)
    /**
     * @type {Number}
     */
    this.width = width
    /**
     * @type {Number}
     */
    this.height = height
    /**
     * @type {Number}
     */
    this.scale = scale
    /**
     * @type {HTMLCanvasElement}
     */
    this.canvas = document.createElement('canvas')

    document.body.appendChild(this.canvas)

    this.canvas.width = this.width
    this.canvas.height = this.height

    this.context.scale(this.scale, this.scale)
    this.context.fillStyle = Game.Color.BACKGROUND
    this.context.fillRect(0, 0, this.scaledWidth, (this.scaledHeight))

    Config.view = this
  }

  /**
   * @param {HTMLCanvasElement} canvasElement
   */
  set canvas (canvasElement) {
    Utils.assertIsInstanceOf(canvasElement, HTMLCanvasElement)
    this._canvas = canvasElement
  }

  /**
   * @returns {HTMLCanvasElement}
   */
  get canvas () {
    return this._canvas
  }

  /**
   * @returns {CanvasRenderingContext2D}
   */
  get context () {
    return this.canvas.getContext('2d')
  }

  /**
   * @param {Number} scale
   */
  set scale (scale) {
    Utils.assertIsOfType(scale, 'number')
    this._scale = scale
  }

  /**
   * @returns {Number}
   */
  get scale () {
    return this._scale
  }

  /**
   * @param {Number} width
   */
  set width (width) {
    Utils.assertIsOfType(width, 'number')
    this._width = width
  }

  /**
   * @returns {Number}
   */
  get width () {
    return this._width
  }

  /**
   * @returns {Number}
   */
  get scaledWidth () {
    return this.width / this.scale
  }

  /**
   * @param {Number} height
   */
  set height (height) {
    Utils.assertIsOfType(height, 'number')
    this._height = height
  }

  /**
   * @returns {Number}
   */
  get height () {
    return this._height
  }

  /**
   * @returns {Number}
   */
  get scaledHeight () {
    return this.height / this.scale
  }
}
