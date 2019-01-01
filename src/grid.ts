import _range from 'lodash-es/range'
import _random from 'lodash-es/random'
import * as Utils from './utilities'
import GameInit from './bootstrap'
import { EmptySpace, Point, Entity, Food, SnakePiece } from './elements'
import View from './view'

export default class Grid {
  view: View = GameInit.view
  scale: number
  values: Point[][] = this.create()

  constructor (scale: number) {
    this.scale = scale
  }

  get width (): number {
    return this.view.gameWidth / this.scale
  }

  get height (): number {
    return this.view.gameHeight / this.scale
  }

  create (): Point[][] {
    let horizontal = _range(0, this.width)
    let vertical = _range(0, this.height)

    return vertical.map(y => horizontal.map(x => {
      let coord = new Coord(x, y)
      return new EmptySpace(coord)
    }))
  }

  get (coord: Coord): Point {
    let { x, y } = coord
    return this.values[y][x]
  }

  set (point: Point): Grid {
    let { x, y } = point.coord
    let canvasCoord = point.coord.toCanvasCoord()

    this.view.context.fillStyle = point.sprite.color
    this.view.context.fillRect(canvasCoord.x, canvasCoord.y, this.scale, this.scale)

    this.values[y][x] = point

    return this
  }

  delete (point: Point): Grid {
    let empty = new EmptySpace(point.coord)

    this.set(empty)

    return this
  }

  move (point: Point, coord: Coord, copy: boolean = false): Grid {
    if (!copy) {
      this.delete(point)
    }
    point.coord = coord
    this.set(point)

    return this
  }
}

export class Coord {
  x: number
  y: number

  constructor (x: number, y: number) {
    this.x = x
    this.y = y
  }

  get toArray (): number[] {
    return [this.x, this.y]
  }

  toCanvasCoord (): Coord {
    let view = GameInit.view
    let grid = GameInit.grid
    let x = (this.x * grid.scale)
    let y = (this.y * grid.scale) + view.uiHeight
    let canvasCoord = new Coord(x, y)

    return canvasCoord
  }

  static random (): Coord {
    let x = _random(2, (GameInit.grid.width - 2))
    let y = _random(2, (GameInit.grid.height - 2))

    let coord = new Coord(x, y)

    if (Entity.exists(coord)) {
      return Coord.random()
    }

    return coord
  }
}
