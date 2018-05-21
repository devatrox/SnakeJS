import Assert from './assert.js'
import { Config } from './bootstrap.js'
import { Entity } from './elements.js'

export class Coord {
  /**
   * @param {Number} x
   * @param {Number} y
   * @param {Number} [scale]
   */
  constructor (x, y, scale = 1) {
    /**
     * @type {Number}
     */
    this.x = x
    /**
     * @type {Number}
     */
    this.y = y
    /**
     * @type {Number}
     */
    this.scale = scale
  }

  /**
   * @param {Number} num
   */
  set x (num) {
    Assert.number(num)
    this._x = num
  }

  /**
   * @returns {Number}
   */
  get x () {
    return this._x
  }

  /**
   * @param {Number} num
   */
  set y (num) {
    Assert.number(num)
    this._y = num
  }

  /**
   * @returns {Number}
   */
  get y () {
    return this._y
  }

  /**
   * @param {Number} num
   */
  set scale (num) {
    Assert.number(num)
    this._scale = num
  }

  /**
   * @returns {Number}
   */
  get scale () {
    return this._scale
  }

  /**
   * @param {Number} scale
   * @returns {Number[]}
   */
  toScaledArray (scale) {
    Assert.number(scale)
    let x = this.x * this.scale / scale
    let y = this.y * this.scale / scale

    Assert.number(x)
    Assert.number(y)
    return [x, y]
  }
}

export class CanvasCoord extends Coord {
  constructor (x, y) {
    const scale = Config.canvasScale
    super(x, y, scale)
  }

  /**
   * @returns {GridCoord}
   */
  toGridCoord () {
    let scale = Config.gridScale
    let [x, y] = this.toScaledArray(scale)

    return new GridCoord(x, y, scale)
  }
}

export class SpriteCoord extends Coord {
  constructor (x, y) {
    const scale = Config.spriteScale
    super(x, y, scale)
  }

  /**
   * @returns {CanvasCoord}
   */
  toCanvasCoord () {
    let scale = Config.canvasScale
    let [x, y] = this.toScaledArray(scale)

    return new CanvasCoord(x, y, scale)
  }
}

export class GridCoord extends Coord {
  constructor (x, y) {
    const scale = Config.gridScale
    super(x, y, scale)
  }

  /**
   * @returns {GridCoord}
   */
  static random () {
    const saveArea = 2
    let x = _.random(saveArea, (Config.gridInstance.width - saveArea))
    let y = _.random(saveArea, (Config.gridInstance.height - saveArea))

    let coord = new GridCoord(x, y)

    if (Entity.exists(coord)) {
      return GridCoord.random()
    }

    return coord
  }

  /**
   * @returns {CanvasCoord}
   */
  toCanvasCoord () {
    let scale = Config.canvasScale
    let [x, y] = this.toScaledArray(scale)

    y = y + Config.viewInstance.uiHeight

    return new CanvasCoord(x, y, scale)
  }
}
