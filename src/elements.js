import * as Utils from './utilities.js'
import Game from './game.js'
import { Config } from './bootstrap.js'
import Grid, { Coord } from './grid.js'
import * as Keys from './keys.js'
import { Sprite, EmptySprite, FoodSprite, SnakeSprite } from './sprite.js'
import Player, { System } from './player.js'

export class Point {
  /**
   * @param {Coord} coord
   * @param {Sprite} sprite
   */
  constructor (coord, sprite) {
    /**
     * @type {Coord}
     */
    this.coord = coord
    /**
     * @type {Sprite}
     */
    this.sprite = sprite
    /**
     * @type {Grid}
     */
    this.grid = Config.grid
  }

  /**
   * @param {Coord} coord
   */
  set coord (coord) {
    this._coord = coord || Coord.random()
  }

  /**
   * @returns {Coord}
   */
  get coord () {
    return this._coord
  }

  /**
   * @param {Sprite} sprite
   */
  set sprite (sprite) {
    Utils.assertIsInstanceOf(sprite, Sprite)
    this._sprite = sprite
  }

  /**
   * @returns {Sprite}
   */
  get sprite () {
    return this._sprite
  }
}

export class EmptySpace extends Point {
  /**
   * @param {Coord} coord
   */
  constructor (coord) {
    super(coord, new EmptySprite())
  }
}

export class Entity extends Point {
  /**
   * @param {Sprite} sprite
   * @param {Player} [owner]
   * @param {Coord} [coord]
   */
  constructor (sprite, owner, coord) {
    super(coord, sprite)
    /**
     * @type {Player|System}
     */
    this.owner = owner || System

    this.grid.set(this)
  }

  /**
   * @param {Game.Direction|Coord} direction
   * @param {Boolean} [copy]
   *
   * @fires Game.Events.BUMP
   * @fires Game.Events.EAT_FOOD
   *
   * @returns {Entity}
   */
  move (direction, copy) {
    let coord

    if (direction instanceof Coord) {
      coord = direction
    } else {
      let x = this.coord.x + direction.movement[0]
      let y = this.coord.y + direction.movement[1]

      // If snake is out of bounds, come out of opposite side
      if (x < 0) x = (this.grid.width - 1)
      if (x > (this.grid.width - 1)) x = 0
      if (y < 0) y = (this.grid.height - 1)
      if (y > (this.grid.height - 1)) y = 0

      coord = new Coord(x, y)
    }

    if (Entity.exists(coord) && Entity.isNotFood(coord)) {
      return Utils.emit(Game.Events.BUMP, {
        player: this.owner,
        entity: this.grid.get(coord)
      })
    } else if (Config.grid.get(coord) instanceof Food) {
      Utils.emit(Game.Events.EAT_FOOD, {
        player: this.owner
      })
    }

    this.grid.move(this, coord, copy)
  }

  /**
   * @param {Coord} coord
   * @returns {Boolean}
   */
  static exists (coord) {
    return Config.grid.get(coord) instanceof Entity
  }

  /**
   * @param {Coord} coord
   * @returns {Boolean}
   */
  static isNotFood (coord) {
    return !(Config.grid.get(coord) instanceof Food)
  }
}

export class Food extends Entity {
  /**
   * @param {Coord} [coord]
   */
  constructor (coord) {
    super(new FoodSprite(), null, coord)
  }

  reset () {
    this.move(Coord.random())
  }
}

export class SnakePiece extends Entity {
  /**
   * @param {Player} owner
   * @param {Coord} [coord]
   */
  constructor (owner, coord) {
    super(new SnakeSprite(), owner, coord)
  }
}

export class Snake extends Set {
  /**
   * @param {Player} owner
   * @param {Coord} [coord]
   */
  constructor (owner, coord) {
    super()

    /**
     * @type {Player}
     */
    this.owner = owner
    /**
     * @type {Number}
     */
    this.maxSize = 2

    this.add(new SnakePiece(owner, coord)).move(new Keys.DirectionUp())
  }

  /**
   * @returns {SnakePiece}
   */
  get head () {
    return this.getNum(this.size)
  }

  /**
   * @returns {SnakePiece}
   */
  get tail () {
    return this.getNum(0)
  }

  /**
   * @param {Number} index
   * @returns {SnakePiece}
   */
  getNum (index) {
    return Array.from(this.entries())[index]
  }

  /**
   * @param {Coord|Keys.Direction} direction
   * @returns {Snake}
   */
  move (direction) {
    let prevDirection = direction

    this.forEach(piece => {
      let tmpPrevCoord = piece.coord
      piece.move(prevDirection)
      prevDirection = tmpPrevCoord
    })

    if (this.maxSize > this.size) {
      this.add(new SnakePiece(this.owner, prevDirection))
    }

    return this
  }
}
