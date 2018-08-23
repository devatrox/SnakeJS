import Assert from './tools/Assert.js'
import Game from './Game.js'
import { Config } from './bootstrap.js'

export default class View {
  /**
   * @param {String} elementId
   */
  constructor (elementId) {
    /**
     * @type {String}
     */
    this.elementId = elementId
    /**
     * @type {Number}
     */
    this.uiHeight = 50
    /**
     * @type {HTMLCanvasElement}
     */
    this.canvas = document.createElement('canvas')

    this.element.appendChild(this.canvas)
  }

  /**
   * @param {HTMLCanvasElement} canvasElement
   */
  set canvas (canvasElement) {
    Assert.instance(canvasElement, HTMLCanvasElement)

    canvasElement.width = Config.width
    canvasElement.height = Config.height

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
   * @returns {Element}
   */
  get element () {
    let element = document.getElementById(this.elementId)
    Assert.exists(element)
    Assert.instance(element, HTMLElement)
    return element
  }

  /**
   * @returns {Number}
   */
  get gameWidth () {
    return Config.width
  }

  /**
   * @returns {Number}
   */
  get gameHeight () {
    return Config.height - this.uiHeight
  }

  draw () {
    this.drawUi()

    this.context.fillStyle = Game.Color.BACKGROUND
    this.context.fillRect(0, this.uiHeight, Config.width, Config.height - this.uiHeight)
  }

  drawUi () {
    this.context.fillStyle = Game.Color.UI
    this.context.fillRect(0, 0, Config.width, this.uiHeight)
  }

  drawScore () {
    this.drawUi()

    let players = Array.from(Config.gameInstance.players)

    let scores = players.map(player => `${player.username}: ${player.score.current}`)

    this.context.fillStyle = Game.Color.UI_TEXT
    this.context.font = '16px monospace'
    this.context.fillText(scores.join(' / '), 10, 40)
  }
}
