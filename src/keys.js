import Direction from './Direction.js'
import Assert from './tools/Assert.js'

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
   * @param {String} direction
   */
  constructor (keyName, direction = 'up') {
    super(keyName)
    /**
     * @type {Direction}
     */
    this.direction = Direction[direction]()
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
    super(key, 'left')
  }
}

export class Right extends DirectionKey {
  constructor (key) {
    super(key, 'right')
  }
}

export class Up extends DirectionKey {
  constructor (key) {
    super(key, 'up')
  }
}

export class Down extends DirectionKey {
  constructor (key) {
    super(key, 'down')
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
