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
    super('empty', '#000000')
  }
}

export class FoodSprite extends Sprite {
  constructor () {
    super('snake', '#00ff00')
  }
}

export class SnakeSprite extends Sprite {
  constructor () {
    super('snake', '#ff0000')
  }
}
