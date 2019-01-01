import Game from './game'
import { Color } from './exports'

export abstract class Sprite {
  name: string
  color: string

  constructor (name: string, color: string) {
    this.name = name
    this.color = color
  }
}

export class EmptySprite extends Sprite {
  constructor () {
    super('empty', Color.BACKGROUND)
  }
}

export class FoodSprite extends Sprite {
  constructor () {
    super('snake', Color.FOOD)
  }
}

export class SnakeSprite extends Sprite {
  constructor () {
    super('snake', Color.SNAKE)
  }
}
