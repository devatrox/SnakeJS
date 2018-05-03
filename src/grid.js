import * as Utils from './utilities.js'
import { Config } from './bootstrap.js'
import { EmptySpace, Point, Entity, Food, SnakePiece } from './elements.js'
import View from './view.js'

export default class Grid {
  constructor (scale) {
    /**
     * @type {View}
     */
    this.view = Config.view
    /**
     * @type {Number}
     */
    this.scale = scale
    /**
     * @type {Array[]}
     */
    this.values = this.create()

    Config.grid = this
  }

  /**
   * @param {Number} scale
   */
  set scale (scale) {
    Utils.assertIsOfType(scale, 'number')
    this._scale = scale
  }

  /**
   * @returns {Number}
   */
  get scale () {
    return this._scale
  }

  /**
   * @returns {Number}
   */
  get width () {
    return this.view.gameWidth / this.scale
  }

  /**
   * @returns {Number}
   */
  get height () {
    return this.view.gameHeight / this.scale
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
    let horizontal = _.range(0, this.width)
    let vertical = _.range(0, this.height)

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
    let canvasCoord = point.coord.toCanvasCoord()

    this.view.context.fillStyle = point.sprite.color
    this.view.context.fillRect(canvasCoord.x, canvasCoord.y, this.scale, this.scale)

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
   * @param {Boolean} [copy]
   * @returns {Grid}
   */
  move (point, coord, copy = false) {
    if (!copy) {
      this.delete(point)
    }
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
  toCanvasCoord () {
    let view = Config.view
    let grid = Config.grid
    let x = (this.x * grid.scale)
    let y = (this.y * grid.scale) + view.uiHeight
    let canvasCoord = new Coord(x, y)

    return canvasCoord
  }

  /**
   * @returns {Coord}
   */
  static random () {
    let x = _.random(2, (Config.grid.width - 2))
    let y = _.random(2, (Config.grid.height - 2))

    let coord = new Coord(x, y)

    if (Entity.exists(coord)) {
      return Coord.random()
    }

    return coord
  }
}
