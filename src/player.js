import * as Utils from './utilities.js'
import Game from './game.js'
import { Config } from './bootstrap.js'
import { Snake, Entity, Food } from './elements.js'
import * as Keys from './keys.js'
import _debounce from '../node_modules/lodash-es/debounce.js'

export class Players extends Set {
  /**
   * @param {Number} [maxPlayers]
   */
  constructor (maxPlayers = 2) {
    super()
    /**
     * @type {Number}
     */
    this.maxPlayers = maxPlayers
  }
  /**
   * @param {String} username
   * @fires Game.Events.PLAYER_JOINED
   * @returns {Players}
   */
  add (username) {
    if (this.size === this.maxPlayers) return

    let player = new Player(username)
    player.keySet = Keys.keySets[this.size]

    super.add(player)

    Utils.emit(Game.Events.PLAYER_JOINED, {
      player: player
    })

    return this
  }

  /**
   * @param {Player} player
   * @returns {Players}
   */
  delete (player) {
    super.delete(player)

    return this
  }

  /**
   * @param {Number} num
   * @returns {Player}
   */
  get (num) {
    let player = Array.from(this.entries())[num]
    return super.get(player)
  }
}

export const System = {
  username: 'system'
}

export default class Player {
  /**
   * @param {String} username
   */
  constructor (username) {
    /**
     * @type {String}
     */
    this.username = username
    /**
     * @type {Snake}
     */
    this.snake = new Snake(this)
    /**
     * @type {Score}
     */
    this.score = new Score(this)

    this.bindKeys()
  }

  /**
   * @param {Keys.KeySet} keySet
   */
  set keySet (keySet) {
    Utils.assertIsInstanceOf(keySet, Keys.KeySet)
    this._keySet = keySet
  }

  /**
   * @returns {Keys.KeySet}
   */
  get keySet () {
    return this._keySet
  }

  /**
   * @param {Keys.DirectionKey} key
   */
  set currentDirectionKey (key) {
    Utils.assertIsInstanceOf(key, Keys.DirectionKey)
    this._currentDirectionKey = key
  }

  /**
   * @returns {Keys.DirectionKey}
   */
  get currentDirectionKey () {
    return this._currentDirectionKey || this.keySet.up
  }

  /**
   * @param {Number} lives
   * @fires Game.Events.PLAYER_LOST
   */
  set lives (lives) {
    if (lives <= 0) {
      Utils.emit(Game.Events.PLAYER_LOST, {
        player: this
      })
    }
    this._lives = lives
  }

  /**
   * @returns {Number}
   */
  get lives () {
    return this._lives || 0
  }

  /**
   * @param {{cb: (event: Event, key: Keys.DirectionKey)}} cb
   */
  set onArrowKeyPress (cb) {
    window.addEventListener('keydown', _debounce(e => {
      if (!this.keySet) return
      if (!Config.game.isRunning) return

      if (this.keySet.has(e.key)) {
        let key = this.keySet.get(e.key)

        cb(e, key)
      }
    }, 50), false)
  }

  /**
   * Check if player wants to do a 180° turn
   *
   * @param {Keys.DirectionKey} key
   * @returns {Boolean}
   */
  isTrying180 (key) {
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
  /**
   * @param {Player} owner
   * @param {Number} [max]
   */
  constructor (owner, max = Infinity) {
    /**
     * @type {Player}
     */
    this.owner = owner
    /**
     * @type {Number}
     */
    this.maxScore = max
  }

  /**
   * @param {Number} score
   * @fires Game.Events.MAX_SCORE
   * @fires Game.Events.BUMPED_SCORE
   */
  set current (score) {
    if (score > this.maxScore) {
      return Utils.emit(Game.Events.MAX_SCORE, {
        player: this.owner
      })
    }
    this._current = score
  }

  /**
   * @returns {Number}
   */
  get current () {
    return this._current || 1
  }

  bump () {
    this.current++

    this.owner.snake.maxSize++

    Utils.emit(Game.Events.BUMPED_SCORE, {
      score: this.current,
      player: this.owner
    })
  }
}
