import Game from './game.js'
export class Sprite {
  /**
   * @param {String} name
   * @param {String} color
   */
  constructor (name, color) {
    /**
     * @type {String}
     */
    this.name = name
    /**
     * @type {String}
     */
    this.color = color
  }
}

export class EmptySprite extends Sprite {
  constructor () {
    super('empty', Game.Color.BACKGROUND)
  }
}

export class FoodSprite extends Sprite {
  constructor () {
    super('snake', Game.Color.FOOD)
  }
}

export class SnakeSprite extends Sprite {
  constructor () {
    super('snake', Game.Color.SNAKE)
  }
}
