import Assert from '../tools/Assert.js'
import Direction from '../Direction.js'
import { Config } from '../bootstrap.js'

export default class BaseCoord {
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
   * @returns {Grid}
   */
  get grid () {
    return Config.gridInstance
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

  /**
   * @param {Coord} coord
   * @returns {Direction}
   */
  difference (coord) {
    let x = -Math.abs(this.x - coord.x)
    let y = -Math.abs(this.y - coord.y)

    return new Direction([x, y])
  }

  /**
   * @param {Direction} direction
   * @param {BaseCoord} type
   *
   * @fires Game.Events.BUMP
   * @fires Game.Events.EAT_FOOD
   *
   * @returns {Entity}
   */
  move (direction, type = BaseCoord) {
    let x = this.x + direction.x
    let y = this.y + direction.y

    // * If out of bounds, come out of opposite side
    if (x < 0) x = (this.grid.width - 1)
    if (x > (this.grid.width - 1)) x = 0
    if (y < 0) y = (this.grid.height - 1)
    if (y > (this.grid.height - 1)) y = 0

    return new type(x, y)
  }
}
