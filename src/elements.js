import * as Utils from './utilities.js'
import Game from './game.js'
import { Config } from './bootstrap.js'
import { Coord } from './grid.js'
import _random from '../node_modules/lodash-es/random.js'
import _isUndefined from '../node_modules/lodash-es/isUndefined.js'
import { Sprite, EmptySprite, FoodSprite, SnakeSprite } from './sprite.js'

export class Point {
  /**
   * @param {Coord} coord
   * @param {Sprite} sprite
   */
  constructor (coord, sprite) {
    this.coord = coord

    this.sprite = sprite
    /**
     * @type {Grid}
     */
    this.grid = Config.Grid
  }

  /**
   * @param {Coord} coord
   */
  set coord (coord) {
    Utils.assertIsInstanceOf(coord, Coord)
    this._coord = coord
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
   * @param {Coord} [coord]
   */
  constructor (sprite, coord) {
    if (_isUndefined(coord)) {
      return Entity.random(sprite)
    }

    super(coord, sprite)

    this.grid.set(this)
  }

  /**
   * @param {Coord} coord
   * @returns {Boolean}
   */
  static exists (coord) {
    return Config.Grid.get(coord) instanceof Entity
  }

  /**
   * @param {String} sprite
   * @returns {Entity}
   */
  static random (sprite) {
    let x = _random(2, (Config.View.scaledWidth - 2))
    let y = _random(2, (Config.View.scaledHeight - 2))

    let coord = new Coord(x, y)

    if (Entity.exists(coord)) {
      return Entity.random(sprite)
    }

    return new Entity(sprite, coord)
  }

  /**
   * @param {Game.Direction|Coord} direction
   * @fires Game.Events.BUMP
   * @returns {Entity}
   */
  move (direction) {
    let coord

    if (direction instanceof Coord) {
      coord = direction
    } else {
      let x = this.coord.x + direction[0]
      let y = this.coord.y + direction[1]

      coord = new Coord(x, y)
    }

    if (Entity.exists(coord)) {
      return Utils.emit(Game.Events.BUMP, {
        entity: this.grid.get(coord)
      })
    }

    this.grid.delete(this.coord)
    return new Entity(this.sprite, coord)
  }
}

export class Food extends Entity {
  /**
   * @param {Coord} [coord]
   */
  constructor (coord) {
    super(new FoodSprite(), coord)
  }
}

export class SnakePiece extends Entity {
  /**
   * @param {Coord} [coord]
   */
  constructor (coord) {
    super(new SnakeSprite(), coord)
  }
}

export class Snake extends Set {
  /**
   * @param {Coord} [coord]
   */
  constructor (coord) {
    super()

    this.add(new SnakePiece(coord))
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
   * @returns {SnakePiece}
   */
  removeTail () {
    let tail = this.tail
    this.delete(this.tail)

    return tail
  }

  /**
   * @param {Game.Direction} direction
   */
  move (direction) {
    let prevCoord = direction

    /** @param {SnakePiece} piece */
    this.forEach(piece => {
      let tmpPrevCoord = piece.coord
      piece.move(prevCoord)
      prevCoord = tmpPrevCoord
    })
  }
}
