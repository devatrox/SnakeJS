import Assert from './tools/Assert.js'

export default class Direction {
  /**
   * @param {Number[]} movement
   * @param {String} name
   */
  constructor (movement, name = 'up') {
    /**
     * @type {Number[]}
     */
    this.movement = movement
    /**
     * @type {String}
     */
    this.name = name
  }

  /**
   * @param {Number[]} movement
   */
  set movement (movement) {
    Assert.array(movement)
    Assert.true(movement.length = 2)
    Assert.number(movement[0])
    Assert.number(movement[1])

    this._movement = movement
  }

  /**
   * @returns {Number[]}
   */
  get movement () {
    return this._movement
  }

  /**
   * @returns {Number}
   */
  get x () {
    return this._movement[0]
  }

  /**
   * @returns {Number}
   */
  get y () {
    return this._movement[1]
  }

  /**
   * @returns {Direction}
   */
  static up () {
    return new Direction([0, -1], 'up')
  }

  /**
   * @returns {Direction}
   */
  static down () {
    return new Direction([0, 1], 'down')
  }

  /**
   * @returns {Direction}
   */
  static left () {
    return new Direction([-1, 0], 'left')
  }

  /**
   * @returns {Direction}
   */
  static right () {
    return new Direction([1, 0], 'right')
  }
}
