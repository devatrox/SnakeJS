import Game from './game.js'
import * as Utils from './utilities.js'
import { Config } from './bootstrap.js'
import Grid from './grid.js'

export default class View {
  /**
   * @param {String} elementId
   * @param {Number} [width=640]
   * @param {Number} [height=480]
   */
  constructor (elementId, width = 640, height = 480) {
    /**
     * @type {Element}
     */
    this.element = document.getElementById(elementId)
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
    this.uiHeight = 50
    /**
     * @type {HTMLCanvasElement}
     */
    this.canvas = document.createElement('canvas')

    this.element.appendChild(this.canvas)

    this.canvas.width = this.width
    this.canvas.height = this.height

    this.draw()

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
  get gameWidth () {
    return this.width
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
  get gameHeight () {
    return this.height - this.uiHeight
  }

  draw () {
    this.drawUi()

    this.context.fillStyle = Game.Color.BACKGROUND
    this.context.fillRect(0, this.uiHeight, this.width, this.height - this.uiHeight)
  }

  drawUi () {
    this.context.fillStyle = Game.Color.UI
    this.context.fillRect(0, 0, this.width, this.uiHeight)
  }

  drawScore () {
    this.drawUi()

    let players = Array.from(Config.game.players)

    let scores = players.map(player => `${player.username}: ${player.score.current}`)

    this.context.fillStyle = Game.Color.UI_TEXT
    this.context.font = '16px monospace'
    this.context.fillText(scores.join(' / '), 10, 40)
  }
}
