import * as Utils from './utilities.js'
import Assert from './assert.js'
import { Config } from './bootstrap.js'
import { GridCoord } from './coords.js'
import { EmptySpace, Point, Entity, Food, SnakePiece } from './elements.js'
import View from './view.js'

export default class Grid {
  /**
   * @returns {View}
   */
  get view () {
    return Config.viewInstance
  }

  /**
   * @returns {Number}
   */
  get width () {
    return this.view.gameWidth / Config.gridScale
  }

  /**
   * @returns {Number}
   */
  get height () {
    return this.view.gameHeight / Config.gridScale
  }

  /**
   * @param {Array[]} values
   */
  set values (values) {
    Assert.array(values)
    this._values = values
  }

  /**
   * @returns {Array[]}
   */
  get values () {
    return this._values || [[]]
  }

  /**
   * @returns {Array[]}
   */
  createGrid () {
    let horizontal = _.range(0, this.width)
    let vertical = _.range(0, this.height)

    this.values = vertical.map(y => horizontal.map(x => {
      let coord = new GridCoord(x, y)
      return new EmptySpace(coord)
    }))

    return Promise.all(this.values)
  }

  /**
   * @param {GridCoord} coord
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
    Assert.instance(point, Point)
    let { x, y } = point.coord
    point.draw()

    this.values[y][x] = point

    return this
  }

  /**
   * @param {Point} point
   * @returns {Grid}
   */
  delete (point) {
    Assert.instance(point, Point)
    let empty = new EmptySpace(point.coord)

    this.set(empty)

    return this
  }

  /**
   * @param {Point} point
   * @param {GridCoord} coord
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
