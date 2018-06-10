import * as Utils from './tools/utilities.js'
import Assert from './tools/assert.js'
import Game from './game.js'
import { Config } from './bootstrap.js'
import Grid from './grid.js'
import View from './view.js'
import { SpriteCoord, GridCoord, Coord } from './coords.js'
import * as Keys from './keys.js'
import { SpriteSegment, EmptySprite, FoodSprite, SnakeSprite, SnakeHeadSprite, SnakeTailSprite, SnakeBodySprite } from './sprite.js'
import Player, { System } from './player.js'

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
    this.owner = owner || System
    /**
     * @type {String}
     */
    this.angle = 'up'

    this.grid.set(this)
  }

  /**
   * @param {Keys.Direction|GridCoord} direction
   * @param {Boolean} [copy]
   *
   * @fires Game.Events.BUMP
   * @fires Game.Events.EAT_FOOD
   *
   * @returns {Entity}
   */
  move (direction, copy) {
    let coord

    if (direction instanceof GridCoord) {
      coord = direction
    } else {
      let x = this.coord.x + direction.movement[0]
      let y = this.coord.y + direction.movement[1]

      // * If snake is out of bounds, come out of opposite side
      if (x < 0) x = (this.grid.width - 1)
      if (x > (this.grid.width - 1)) x = 0
      if (y < 0) y = (this.grid.height - 1)
      if (y > (this.grid.height - 1)) y = 0

      coord = new GridCoord(x, y)
      this.angle = direction.name
    }

    if (Entity.exists(coord) && Entity.isNotFood(coord)) {
      Utils.emit(Game.Events.BUMP, {
        player: this.owner,
        entity: this.grid.get(coord)
      })

      return this
    } else if (Config.gridInstance.get(coord) instanceof Food) {
      Utils.emit(Game.Events.EAT_FOOD, {
        player: this.owner
      })
    }

    this.grid.move(this, coord, copy)

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
  static isNotFood (coord) {
    return !(Config.gridInstance.get(coord) instanceof Food)
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

export class Snake extends Set {
  /**
   * @param {Player} owner
   * @param {GridCoord} [coord]
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

  rearrangeSprites () {
    for (let piece of this.values()) {
      piece.sprite = SnakeBodySprite[piece.angle]()
    }
    this.head.sprite = SnakeHeadSprite[this.head.angle]()
    this.tail.sprite = SnakeTailSprite[this.tail.angle]()
  }

  /**
   * @param {SnakePiece} item
   * @returns {Snake}
   */
  add (item) {
    Assert.instance(item, SnakePiece)
    super.add(item)

    this.rearrangeSprites()

    return this
  }

  /**
   * @param {Number} index
   * @returns {SnakePiece}
   */
  get (index) {
    return Array.from(this.values())[index]
  }

  /**
   * @returns {SnakePiece}
   */
  get head () {
    return this.get(0)
  }

  /**
   * @returns {SnakePiece}
   */
  get tail () {
    return this.get(this.size - 1)
  }

  /**
   * @param {GridCoord|Keys.Direction} direction
   * @returns {Snake}
   */
  move (direction) {
    let prevDirection = direction
    let prevAngle = this.head.angle

    this.forEach(piece => {
      let currentCoord = piece.coord
      let currentAngle = piece.angle
      piece.angle = prevAngle
      piece.move(prevDirection)
      prevDirection = currentCoord
      prevAngle = currentAngle
    })

    if (this.maxSize > this.size) {
      let newPiece = new SnakePiece(this.owner, prevDirection)
      this.add(newPiece)
    }

    this.rearrangeSprites()

    return this
  }
}
