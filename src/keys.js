export class Direction {
  constructor (movement) {
    /**
     * @type {Number[]}
     */
    this.movement = movement
  }
}

export class DirectionLeft extends Direction {
  constructor () {
    super([1, 0])
  }
}

export class DirectionRight extends Direction {
  constructor () {
    super([-1, 0])
  }
}

export class DirectionUp extends Direction {
  constructor () {
    super([0, -1])
  }
}

export class DirectionDown extends Direction {
  constructor () {
    super([0, 1])
  }
}

export class Key {
  constructor (name) {
    /**
     * @type {String}
     */
    this.name = name
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

export class PlayerKey extends Key {}

export class PlayerDirectionKey extends PlayerKey {
  /**
   * @param {String} name
   * @param {PlayerDirectionKey} opposite
   * @param {Direction} direction
   */
  constructor (name, opposite, direction) {
    super(name)
    /**
     * @type {PlayerDirectionKey}
     */
    this.opposite = opposite
    /**
     * @type {Direction}
     */
    this.direction = new direction()
  }

  /**
   * @param {PlayerDirectionKey} key
   */
  set opposite (key) {
    this._opposite = key
  }

  /**
   * @returns {PlayerDirectionKey}
   */
  get opposite () {
    return this._opposite
  }

  /**
   * @param {PlayerDirectionKey} key
   * @returns {Boolean}
   */
  isOppositeOf (key) {
    let result = key === this.name
    if (result) console.log(`${this.name} isOppositeOf ${key}`)
    return result
  }
}

export class Left extends PlayerDirectionKey {
  constructor (key) {
    super(key, Right, DirectionLeft)
  }
}

export class Right extends PlayerDirectionKey {
  constructor (key) {
    super(key, Left, DirectionRight)
  }
}

export class Up extends PlayerDirectionKey {
  constructor (key) {
    super(key, Down, DirectionUp)
  }
}

export class Down extends PlayerDirectionKey {
  constructor (key) {
    super(key, Up, DirectionDown)
  }
}

export class KeySet {
  constructor (options) {
    this.left = new Left(options.left)
    this.right = new Right(options.right)
    this.up = new Up(options.up)
    this.down = new Down(options.down)
  }

  /**
   * @returns {PlayerDirectionKey[]}
   */
  getAll () {
    return Object.values(this)
  }

  /**
   * @param {String} name
   * @returns {PlayerDirectionKey}
   */
  get (name) {
    return this.getAll().filter(key => {
      return key.name === name
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
