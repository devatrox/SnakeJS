import * as Utils from './tools/utilities.js'
import Assert from './tools/Assert.js'
import Game from './Game.js'
import { Config } from './bootstrap.js'
import Grid from './Grid.js'
import View from './View.js'
import Coord from './coords/BaseCoord.js'
import GridCoord from './coords/GridCoord.js'
import Direction from './Direction.js'
import { SpriteSegment, EmptySprite, FoodSprite, SnakeSprite, SnakeHeadSprite, SnakeTailSprite, SnakeBodySprite, SnakeCurveSprite } from './sprite.js'
import Player, { System } from './Player.js'

export class Point {
  /**
   * @param {GridCoord} coord
   * @param {SpriteSegment} sprite
   */
  constructor (coord, sprite) {
    /**
     * @type {GridCoord}
     */
    this.coord = coord
    /**
     * @type {SpriteSegment}
     */
    this.sprite = sprite
  }

  /**
   * @returns {Grid}
   */
  get grid () {
    return Config.gridInstance
  }

  /**
   * @returns {View}
   */
  get view () {
    return Config.viewInstance
  }

  /**
   * @param {GridCoord} coord
   */
  set coord (coord) {
    this._coord = coord || GridCoord.random()
    this._coord.scale = Config.gridScale
  }

  /**
   * @returns {GridCoord}
   */
  get coord () {
    return this._coord
  }

  /**
   * @param {SpriteSegment} sprite
   */
  set sprite (sprite) {
    Assert.instance(sprite, SpriteSegment)
    sprite.draw(this.coord)
    this._sprite = sprite
  }

  /**
   * @returns {SpriteSegment}
   */
  get sprite () {
    return this._sprite
  }

  draw () {
    this.sprite.draw(this.coord)
  }
}

export class EmptySpace extends Point {
  /**
   * @param {GridCoord} coord
   */
  constructor (coord) {
    super(coord, new EmptySprite())
  }
}

export class Entity extends Point {
  /**
   * @param {SpriteSegment} sprite
   * @param {Player} [owner]
   * @param {GridCoord} [coord]
   */
  constructor (sprite, owner, coord) {
    super(coord, sprite)
    /**
     * @type {Player|System}
     */
    this.owner = owner || new System()
    /**
     * @type {String}
     */
    this.angle = 'up'

    this.grid.set(this)
  }

  /**
   * @param {(Direction|GridCoord)} directionOrCoord
   *
   * @fires Game.Events.BUMP
   * @fires Game.Events.EAT_FOOD
   *
   * @returns {Entity}
   * TODO: Something's not right
   */
  move (directionOrCoord) {
    let direction = directionOrCoord

    if (directionOrCoord instanceof GridCoord) {
      direction = directionOrCoord.difference(this.coord)
    }

    let coord = this.coord.move(direction, GridCoord)
    this.angle = direction.name
    console.log(this.angle)

    if (Entity.exists(coord) && !Entity.isFood(coord)) {
      Utils.emit(Game.Events.BUMP, {
        player: this.owner,
        entity: this.grid.get(coord)
      })

      return this
    } else if (Entity.isFood(coord)) {
      Utils.emit(Game.Events.EAT_FOOD, {
        player: this.owner
      })
    }

    this.grid.move(this, coord)

    this.coord = coord

    return this
  }

  /**
   * @returns {Object}
   */
  nearby () {
    const grid = Config.gridInstance
    const x = this.coord.x
    const y = this.coord.y

    return {
      right: grid.get(new Coord(x + 1, y)),
      left: grid.get(new Coord(x - 1, y)),
      up: grid.get(new Coord(x, y + 1)),
      down: grid.get(new Coord(x, y - 1))
    }
  }

  /**
   * @param {GridCoord} coord
   * @returns {Boolean}
   */
  static exists (coord) {
    return Config.gridInstance.get(coord) instanceof Entity
  }

  /**
   * @param {GridCoord} coord
   * @returns {Boolean}
   */
  static isFood (coord) {
    return (Config.gridInstance.get(coord) instanceof Food)
  }
}

export class Food extends Entity {
  /**
   * @param {GridCoord} [coord]
   */
  constructor (coord) {
    super(new FoodSprite(), null, coord)
  }

  reset () {
    this.move(GridCoord.random())
  }
}

export class SnakePiece extends Entity {
  /**
   * @param {Player} owner
   * @param {GridCoord} [coord]
   */
  constructor (owner, coord) {
    super(new SnakeSprite(), owner, coord)
  }
}

export class SnakeBody extends Entity {
  /**
   * @param {String} angle
   * @param {Player} owner
   * @param {GridCoord} [coord]
   */
  constructor (angle, owner, coord) {
    super(SnakeBodySprite[angle](), owner, coord)
  }
}

export class SnakeHead extends Entity {
  /**
   * @param {String} angle
   * @param {Player} owner
   * @param {GridCoord} [coord]
   */
  constructor (angle, owner, coord) {
    super(SnakeHeadSprite[angle](), owner, coord)
  }
}

export class SnakeTail extends Entity {
  /**
   * @param {String} angle
   * @param {Player} owner
   * @param {GridCoord} [coord]
   */
  constructor (angle, owner, coord) {
    super(SnakeTailSprite[angle](), owner, coord)
  }
}

export class SnakeCurve extends Entity {
  /**
   * @param {String} angle
   * @param {Player} owner
   * @param {GridCoord} [coord]
   */
  constructor (angle, owner, coord) {
    super(SnakeCurveSprite[angle](), owner, coord)
  }
}

export class Snake {
  /**
   * @param {Player} owner
   * @param {GridCoord} [coord]
   */
  constructor (owner, coord) {
    /**
     * @type {Entity[]}
     */
    this.list = [new SnakeHead('up', owner, coord)]
    /**
     * @type {Player}
     */
    this.owner = owner
    /**
     * @type {Number}
     */
    this.maxSize = 2

    this.move(Direction.up())
  }

  /**
   * @param {Entity} item
   * @returns {this}
   */
  add (item) {
    Assert.instance(item, Entity)
    this.list.push(item)

    this.rearrangeSprites()

    return this
  }

  /**
   * @returns {Entity}
   */
  get head () {
    return _.head(this.list)
  }

  /**
   * @returns {Entity}
   */
  get tail () {
    return _.last[this.list]
  }

  /**
   * @param {GridCoord|Direction} direction
   * @returns {Snake}
   * TODO: Something's not right
   */
  move (direction) {
    let prevDirection = direction
    let prevAngle = this.head.angle

    this.list = this.list.map((piece, i) => {
      let currentCoord = piece.coord
      let currentAngle = piece.angle
      piece.angle = prevAngle
      console.log(prevAngle, piece.angle, piece.angle)
      piece = piece.move(prevDirection)
      prevDirection = currentCoord
      prevAngle = currentAngle

      return piece
    })

    if (this.maxSize > this.length) {
      let newPiece = new SnakePiece(this.owner, prevDirection)
      this.add(newPiece)
    }

    this.rearrangeSprites()

    return this
  }

  rearrangeSprites () {
    this.list.forEach((piece, i) => {
      switch (i) {
        case 0:
          this.list[i] = new SnakeHead(piece.angle, piece.owner, piece.coord)
          break
        case this.length - 1:
          this.list[i] = new SnakeTail(piece.angle, piece.owner, piece.coord)
          break
        default:
          this.list[i] = new SnakeBody(piece.angle, piece.owner, piece.coord)
      }
    })
  }
}
