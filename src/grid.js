import * as Utils from './utilities.js'
import { Config } from './bootstrap.js'
import { EmptySpace, Point, Entity, Food, SnakePiece } from './elements.js'
import _range from '../node_modules/lodash-es/range.js'
import _random from '../node_modules/lodash-es/random.js'
import _isUndefined from '../node_modules/lodash-es/isUndefined.js'

export default class Grid {
  constructor () {
    /**
     * @type {View}
     */
    this.view = Config.view
    /**
     * @type {Array[]}
     */
    this.values = this.create()

    Config.grid = this
  }

  /**
   * @param {Array[]} values
   */
  set values (values) {
    Utils.assert(Array.isArray(values), 'Grid.values is not an array')
    this._values = values
  }

  /**
   * @returns {Array[]}
   */
  get values () {
    return this._values
  }

  /**
   * @returns {Array[]}
   */
  create () {
    let horizontal = _range(0, this.view.scaledWidth)
    let vertical = _range(0, this.view.scaledHeight)

    return vertical.map(y => horizontal.map(x => {
      let coord = new Coord(x, y)
      return new EmptySpace(coord)
    }))
  }

  /**
   * @param {Coord} coord
   * @returns {Point}
   */
  get (coord) {
    let { x, y } = coord
    return this.values[y][x]
  }

  /**
   * @param {Point} point
   * @returns {Grid}
   */
  set (point) {
    let { x, y } = point.coord

    this.view.context.fillStyle = point.sprite.color
    this.view.context.fillRect(x, y, 1, 1)

    this.values[y][x] = point

    return this
  }

  /**
   * @param {Point} point
   * @returns {Grid}
   */
  delete (point) {
    let empty = new EmptySpace(point.coord)

    this.set(empty)

    return this
  }

  /**
   * @param {Point} point
   * @param {Coord} coord
   * @returns {Grid}
   */
  move (point, coord) {
    this.delete(point)
    point.coord = coord
    this.set(point)

    return this
  }
}

export class Coord {
  /**
   * @param {Number} x
   * @param {Number} y
   */
  constructor (x, y) {
    /**
     * @type {Number}
     */
    this.x = x
    /**
     * @type {Number}
     */
    this.y = y
  }

  /**
   * @param {Number} num
   */
  set x (num) {
    Utils.assertIsOfType(num, 'number')
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
    Utils.assertIsOfType(num, 'number')
    this._y = num
  }

  /**
   * @returns {Number}
   */
  get y () {
    return this._y
  }

  /**
   * @returns {Number[]}
   */
  get toArray () {
    return [this.x, this.y]
  }

  /**
   * @returns {Coord}
   */
  static random () {
    let x = _random(2, (Config.view.scaledWidth - 2))
    let y = _random(2, (Config.view.scaledHeight - 2))

    let coord = new Coord(x, y)

    if (Entity.exists(coord)) {
      return Coord.random()
    }

    return coord
  }
}
