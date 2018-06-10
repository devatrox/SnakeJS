import Assert from './tools/Assert.js'

export class Direction {
  constructor (movement) {
    /**
     * @type {Number[]}
     */
    this.movement = movement
    /**
     * @type {String}
     */
    this.name = 'up'
  }
}

export class DirectionLeft extends Direction {
  constructor () {
    super([-1, 0])

    /**
     * @type {String}
     */
    this.name = 'left'
  }
}

export class DirectionRight extends Direction {
  constructor () {
    super([1, 0])

    /**
     * @type {String}
     */
    this.name = 'right'
  }
}

export class DirectionUp extends Direction {
  constructor () {
    super([0, -1])

    /**
     * @type {String}
     */
    this.name = 'up'
  }
}

export class DirectionDown extends Direction {
  constructor () {
    super([0, 1])

    /**
     * @type {String}
     */
    this.name = 'down'
  }
}

export class Key {
  constructor (keyName) {
    /**
     * @type {String}
     */
    this.keyName = keyName
  }
}

export class EnterKey extends Key {
  constructor () {
    super('Enter')
  }
}

export class EscapeKey extends Key {
  constructor () {
    super('Escape')
  }
}

export class DirectionKey extends Key {
  /**
   * @param {String} keyName
   * @param {Direction} direction
   */
  constructor (keyName, direction) {
    super(keyName)
    /**
     * @type {Direction}
     */
    this.direction = new direction()
  }

  /**
   * @param {Direction} direction
   */
  set direction (direction) {
    Assert.instance(direction, Direction)
    this._direction = direction
  }

  /**
   * @returns {Direction}
   */
  get direction () {
    return this._direction
  }

  /**
   * @param {DirectionKey} key
   */
  set opposite (key) {
    Assert.instance(key, DirectionKey)
    this._opposite = key
  }

  /**
   * @returns {DirectionKey}
   */
  get opposite () {
    return this._opposite
  }
}

export class Left extends DirectionKey {
  constructor (key) {
    super(key, DirectionLeft)
  }
}

export class Right extends DirectionKey {
  constructor (key) {
    super(key, DirectionRight)
  }
}

export class Up extends DirectionKey {
  constructor (key) {
    super(key, DirectionUp)
  }
}

export class Down extends DirectionKey {
  constructor (key) {
    super(key, DirectionDown)
  }
}

export class KeySet {
  constructor (options) {
    this.left = new Left(options.left)
    this.right = new Right(options.right)
    this.up = new Up(options.up)
    this.down = new Down(options.down)

    this.left.opposite = this.right
    this.right.opposite = this.left
    this.up.opposite = this.down
    this.down.opposite = this.up
  }

  /**
   * @returns {DirectionKey[]}
   */
  getAll () {
    return Object.values(this)
  }

  /**
   * @param {String} keyName
   * @returns {DirectionKey}
   */
  get (keyName) {
    return this.getAll().filter(key => {
      return key.keyName === keyName
    })[0]
  }

  /**
   * @param {String} keyName
   * @returns {Boolean}
   */
  has (keyName) {
    return this.getAll().includes(this.get(keyName))
  }
}

export const keySets = [
  new KeySet({
    left: 'ArrowLeft',
    right: 'ArrowRight',
    up: 'ArrowUp',
    down: 'ArrowDown'
  }),
  new KeySet({
    left: 'a',
    right: 'd',
    up: 'w',
    down: 's'
  })
]
