import * as Utils from './utilities'
import Game from './game'
import GameInit from './bootstrap'
import Grid, { Coord } from './grid'
import * as Keys from './keys'
import { Sprite, EmptySprite, FoodSprite, SnakeSprite } from './sprite'
import Player, { AbstractPlayer, System } from './player'
import { Events } from './exports'

export abstract class Point {
  grid: Grid = GameInit.grid
  coord: Coord
  sprite: Sprite

  constructor (coord?: Coord, sprite: Sprite) {
    this.coord = coord || Coord.random()
    this.sprite = sprite
  }
}

export class EmptySpace extends Point {
  constructor (coord: Coord) {
    super(coord, new EmptySprite())
  }
}

export class Entity extends Point {
  owner: AbstractPlayer

  constructor (sprite: Sprite, owner?: Player, coord?: Coord) {
    super(coord, sprite)
    this.owner = owner || new System()

    if (this.grid) this.grid.set(this)
  }

  /**
   * @fires Events.BUMP
   * @fires Events.EAT_FOOD
   */
  move (direction: Keys.Direction|Coord, copy?: boolean): Entity {
    let coord

    if (direction instanceof Coord) {
      coord = direction
    } else {
      let x = this.coord.x + direction.x
      let y = this.coord.y + direction.y

      // If snake is out of bounds, come out of opposite side
      if (x < 0) x = (this.grid.width - 1)
      if (x > (this.grid.width - 1)) x = 0
      if (y < 0) y = (this.grid.height - 1)
      if (y > (this.grid.height - 1)) y = 0

      coord = new Coord(x, y)
    }

    if (Entity.exists(coord) && Entity.isNotFood(coord)) {
      Utils.emit(Events.BUMP, {
        player: this.owner,
        entity: this.grid.get(coord)
      })
      return this
    } else if (GameInit.grid.get(coord) instanceof Food) {
      Utils.emit(Events.EAT_FOOD, {
        player: this.owner
      })
    }

    this.grid.move(this, coord, copy)

    return this
  }

  static exists (coord: Coord): boolean {
    return GameInit.grid.get(coord) instanceof Entity
  }

  static isNotFood (coord: Coord): boolean {
    return !(GameInit.grid.get(coord) instanceof Food)
  }
}

export class Food extends Entity {
  constructor (coord?: Coord) {
    super(new FoodSprite(), undefined, coord)
  }

  reset () {
    this.move(Coord.random())
  }
}

export class SnakePiece extends Entity {
  constructor (owner: Player, coord?: Coord) {
    super(new SnakeSprite(), owner, coord)
  }
}

export class Snake extends Set {
  owner: Player

  private _items: Set<SnakePiece> = new Set()
  maxSize: number = 2

  constructor (owner: Player, coord?: Coord) {
    super()

    this.owner = owner

    this._items.add(new SnakePiece(owner, coord))
    this.move(new Keys.DirectionUp())
  }

  get size(): number {
    return this._items.size
  }

  get asArray(): SnakePiece[] {
    return Array.from(this._items)
  }

  get head (): SnakePiece {
    return this.getNum(this.size)
  }

  get tail (): SnakePiece {
    return this.getNum(0)
  }

  getNum (index: number): SnakePiece {
    return this.asArray[index]
  }

  move (direction: Coord|Keys.Direction): Snake {
    let prevDirection = direction

    this.asArray.forEach(piece => {
      let tmpPrevCoord = piece.coord
      piece.move(prevDirection)
      prevDirection = tmpPrevCoord
    })

    if (this.maxSize > this.size) {
      this._items.add(new SnakePiece(this.owner, prevDirection))
    }

    return this
  }
}
