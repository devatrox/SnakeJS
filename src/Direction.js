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
