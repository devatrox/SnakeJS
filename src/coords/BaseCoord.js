import Assert from '../tools/Assert.js'

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
