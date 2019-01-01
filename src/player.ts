import _debounce from 'lodash-es/debounce'
import * as Utils from './utilities'
import Game from './game'
import GameInit from './bootstrap'
import { Snake, Entity, Food } from './elements'
import * as Keys from './keys'
import { Events } from './exports'

export class Players {
  maxPlayers: number

  private _items: Set<Player> = new Set();

  constructor (maxPlayers: number = 2) {
    this.maxPlayers = maxPlayers
  }

  get size(): number {
    return this.size
  }

  get asArray(): Player[] {
    return Array.from(this._items)
  }

  /**
   * @fires Events.PLAYER_JOINED
   */
  add (username: string): Players {
    if (this.size === this.maxPlayers) return this

    let player = new Player(username)
    player.keySet = Keys.keySets[this.size]

    this._items.add(player)

    Utils.emit(Events.PLAYER_JOINED, {
      player: player
    })

    return this
  }

  delete (player: Player): Players {
    this._items.delete(player)

    return this
  }

  get (num: number): Player {
    return this.asArray[num]
  }
}

export abstract class AbstractPlayer {
  abstract username: string
}

export class System extends AbstractPlayer {
  username = 'system'
}

export default class Player extends AbstractPlayer {
  private _lives: number = 0

  username: string
  keySet: Keys.KeySet

  currentDirectionKey: Keys.DirectionKey = this.keySet.up
  snake: Snake = new Snake(this)
  score: Score = new Score(this)

  constructor (username: string) {
    super()

    this.username = username

    this.bindKeys()
  }

  /**
   * @fires Events.PLAYER_LOST
   */
  set lives (lives: number) {
    if (lives <= 0) {
      Utils.emit(Events.PLAYER_LOST, {
        player: this
      })
    } else {
      this._lives = lives
    }
  }

  get lives (): number {
    return this._lives
  }

  set onArrowKeyPress (cb: (event: KeyboardEvent, key: Keys.DirectionKey) => void) {
    window.addEventListener('keydown', _debounce((e: KeyboardEvent) => {
      if (!this.keySet) return
      if (!GameInit.game.isRunning) return

      if (this.keySet.has(e.key)) {
        let key = this.keySet.get(e.key)

        cb(e, key)
      }
    }, 50), false)
  }

  /**
   * Check if player wants to do a 180° turn
   */
  isTrying180 (key: Keys.DirectionKey): boolean {
    return key.keyName === this.currentDirectionKey.opposite.keyName
  }

  move () {
    this.snake.move(this.currentDirectionKey.direction)
  }

  bindKeys () {
    this.onArrowKeyPress = (e, key) => {
      if (!this.isTrying180(key)) {
        this.currentDirectionKey = key
      }
    }
  }
}

export class Score {
  private _current: number = 1

  owner: Player
  maxScore: number

  constructor (owner: Player, max: number = Infinity) {
    this.owner = owner
    this.maxScore = max
  }

  /**
   * @fires Events.MAX_SCORE
   * @fires Events.BUMPED_SCORE
   */
  set current (score: number) {
    if (score > this.maxScore) {
      Utils.emit(Events.MAX_SCORE, {
        player: this.owner
      })
    } else {
      this._current = score
    }
  }

  get current (): number {
    return this._current
  }

  bump () {
    this.current++

    this.owner.snake.maxSize++

    Utils.emit(Events.BUMPED_SCORE, {
      score: this.current,
      player: this.owner
    })
  }
}
