import * as Utils from './utilities.js'
import { Config } from './bootstrap.js'
import { EmptySpace, Point } from './elements.js'
import _range from '../node_modules/lodash-es/range.js'

export default class Grid {
  constructor () {
    /**
     * @type {View}
     */
    this.view = Config.View
    /**
     * @type {CanvasRenderingContext2D}
     */
    this.context = this.view.gameContext
    /**
     * @type {Array[]}
     */
    this.values = this.create()

    Config.Grid = this
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
   * @param {Coord} coord
   * @returns {Grid}
   */
  set (point) {
    let { x, y } = point.coord

    this.context.fillStyle = point.sprite.color
    this.context.fillRect(x, y, 1, 1)

    this.values[y][x] = point

    return this
  }

  /**
   * @param {Coord} coord
   * @returns {Grid}
   */
  delete (coord) {
    let empty = new EmptySpace(coord)
    let { x, y } = empty.coord

    this.context.fillStyle = empty.sprite.color
    this.context.fillRect(x, y, 1, 1)

    this.set(empty)

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
}
