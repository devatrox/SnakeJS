import * as Utils from './tools/utilities.js'
import Assert from './tools/assert.js'
import Game from './game.js'
import { Config } from './bootstrap.js'
import Grid from './grid.js'
import { SpriteCoord, GridCoord } from './coords.js'
import View from './view.js'

export class Sprite {
  constructor () {
    /**
     * @type {HTMLImageElement}
     */
    this.image = new Image()
  }

  /**
   * @param {String} path
   * @returns {Promise}
   */
  load (path) {
    return new Promise((resolve, reject) => {
      this.path = path

      this.image.onload = e => resolve(this)
      this.image.onabort = e => reject(e)

      this.image.src = this.path
    })
  }

  /**
   * @param {String} path
   */
  set path (path) {
    Assert.string(path)
    this._path = path
  }

  /**
   * @returns {String}
   */
  get path () {
    return this._path
  }
}

export class SpriteSegment {
  /**
   * @param {Number} x
   * @param {Number} y
   */
  constructor (x = 0, y = 0) {
    /**
     * @type {SpriteCoord}
     */
    this.coord = new SpriteCoord(x, y)
  }

  /**
   * @returns {View}
   */
  get view () {
    return Config.viewInstance
  }

  /**
   * @returns {Sprite}
   */
  get spriteImage () {
    return Config.spriteImage
  }

  /**
   * @returns {Number}
   */
  get size () {
    return Config.spriteScale
  }

  /**
   * @param {SpriteCoord} coord
   */
  set coord (coord) {
    Assert.instance(coord, SpriteCoord)
    this._coord = coord
  }

  /**
   * @returns {SpriteCoord}
   */
  get coord () {
    return this._coord
  }

  /**
   * @param {GridCoord} gridCoord
   */
  draw (gridCoord) {
    let scaledGridCoord = gridCoord.toCanvasCoord()
    let spriteCoord = this.coord.toCanvasCoord()

    this.view.context.fillStyle = Game.Color.BACKGROUND
    this.view.context.fillRect(scaledGridCoord.x, scaledGridCoord.y, this.size, this.size)

    this.view.context.drawImage(this.spriteImage.image, spriteCoord.x, spriteCoord.y, this.size, this.size, scaledGridCoord.x, scaledGridCoord.y, this.size, this.size)
  }
}

export class EmptySprite extends SpriteSegment {
  constructor (x = 4, y = 1) {
    super(x, y)
  }
}

export class FoodSprite extends SpriteSegment {
  constructor (x = 4, y = 0) {
    super(x, y)
  }
}

export class SnakeSprite extends SpriteSegment {
  constructor (x = 3, y = 0) {
    super(x, y)
  }
}

export class SnakeHeadSprite extends SpriteSegment {
  /**
   * @returns {SnakeHeadSprite}
   */
  static right () {
    return new SnakeHeadSprite(0, 3)
  }

  /**
   * @returns {SnakeHeadSprite}
   */
  static left () {
    return new SnakeHeadSprite(0, 2)
  }

  /**
   * @returns {SnakeHeadSprite}
   */
  static up () {
    return new SnakeHeadSprite(0, 0)
  }

  /**
   * @returns {SnakeHeadSprite}
   */
  static down () {
    return new SnakeHeadSprite(0, 1)
  }
}

export class SnakeCurveSprite extends SpriteSegment {
  /**
   * @returns {SnakeCurveSprite}
   */
  static se () {
    return new SnakeCurveSprite(2, 0)
  }

  /**
   * @returns {SnakeCurveSprite}
   */
  static en () {
    return new SnakeCurveSprite(2, 1)
  }

  /**
   * @returns {SnakeCurveSprite}
   */
  static wn () {
    return new SnakeCurveSprite(2, 2)
  }

  /**
   * @returns {SnakeCurveSprite}
   */
  static sw () {
    return new SnakeCurveSprite(2, 3)
  }
}

export class SnakeTailSprite extends SpriteSegment {
  /**
   * @returns {SnakeTailSprite}
   */
  static left () {
    return new SnakeTailSprite(1, 3)
  }

  /**
   * @returns {SnakeTailSprite}
   */
  static right () {
    return new SnakeTailSprite(1, 2)
  }

  /**
   * @returns {SnakeTailSprite}
   */
  static down () {
    return new SnakeTailSprite(1, 0)
  }

  /**
   * @returns {SnakeTailSprite}
   */
  static up () {
    return new SnakeTailSprite(1, 1)
  }
}

export class SnakeBodySprite extends SpriteSegment {
  /**
   * @returns {SnakeBodySprite}
   */
  static up () {
    return new SnakeBodySprite(3, 1)
  }

  /**
   * @returns {SnakeBodySprite}
   */
  static down () {
    return SnakeBodySprite.up()
  }

  /**
   * @returns {SnakeBodySprite}
   */
  static right () {
    return new SnakeBodySprite(3, 0)
  }

  /**
   * @returns {SnakeBodySprite}
   */
  static left () {
    return SnakeBodySprite.right()
  }
}
