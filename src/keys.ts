export class Direction {
  x: number
  y: number

  constructor (x: number, y: number) {
    this.x = x
    this.y = y
  }
}

export class DirectionLeft extends Direction {
  constructor () {
    super(-1, 0)
  }
}

export class DirectionRight extends Direction {
  constructor () {
    super(1, 0)
  }
}

export class DirectionUp extends Direction {
  constructor () {
    super(0, -1)
  }
}

export class DirectionDown extends Direction {
  constructor () {
    super(0, 1)
  }
}

export class Key {
  keyName: string

  constructor (keyName: string) {
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
  direction: Direction
  opposite: DirectionKey

  constructor (keyName: string, opposite: DirectionKey, direction: Direction) {
    super(keyName)

    this.opposite = opposite
    this.direction = new direction()
  }
}

export class Left extends DirectionKey {
  constructor (key: string) {
    super(key, Right, DirectionLeft)
  }
}

export class Right extends DirectionKey {
  constructor (key: string) {
    super(key, Left, DirectionRight)
  }
}

export class Up extends DirectionKey {
  constructor (key: string) {
    super(key, Down, DirectionUp)
  }
}

export class Down extends DirectionKey {
  constructor (key: string) {
    super(key, Up, DirectionDown)
  }
}

type KeySetOptions = {
  left: string,
  right: string,
  up: string,
  down: string
}

export class KeySet {
  left: Left
  right: Right
  up: Up
  down: Down

  constructor (options: KeySetOptions) {
    this.left = new Left(options.left)
    this.right = new Right(options.right)
    this.up = new Up(options.up)
    this.down = new Down(options.down)

    this.left.opposite = this.right
    this.right.opposite = this.left
    this.up.opposite = this.down
    this.down.opposite = this.up
  }

  getAll (): DirectionKey[] {
    return Object.values(this)
  }

  get (keyName: string): DirectionKey {
    return this.getAll().filter(key => {
      return key.keyName === keyName
    })[0]
  }

  has (keyName: string): boolean {
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
