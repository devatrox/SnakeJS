import Game from './game.js'
import { Config } from './bootstrap.js'
import Grid from './grid.js'
import View from './view.js'
export class Sprite {
  /**
   * @param {String} name
   * @param {Number[]} spritePos
   */
  constructor (name, spritePos = [0, 0]) {
    /**
     * @type {String}
     */
    this.name = name
    /**
     * @type {Number[]}
     */
    this.spritePos = spritePos
    /**
     * @type {View}
     */
    this.view = Config.view
    /**
     * @type {Grid}
     */
    this.grid = Config.grid
  }

  /**
   * @returns {Number}
   */
  get x () {
    return this.spritePos[0]
  }

  /**
   * @returns {Number}
   */
  get y () {
    return this.spritePos[1]
  }

  /**
   * @returns {Number}
   */
  get size () {
    return this.grid.cellSize
  }

  /**
   * @returns {HTMLImageElement}
   */
  get image () {
    return Config.spriteImage
  }

  /**
   * @param {Number} x - The x coordinate of the canvas
   * @param {Number} y - The y coordinate of the canvas
   */
  draw (x, y) {
    this.view.context.fillStyle = Game.Color.BACKGROUND
    this.view.context.fillRect(x, y, this.grid.cellSize, this.grid.cellSize)

    this.view.context.drawImage(this.image, this.x, this.y, this.size, this.size, x, y, this.size, this.size)
  }
}

export class EmptySprite extends Sprite {
  constructor () {
    super('empty', [0, 30])
  }
}

export class FoodSprite extends Sprite {
  constructor () {
    super('snake', [30, 10])
  }
}

export class SnakeSprite extends Sprite {
  constructor () {
    super('snake', [0, 0])
  }
}
