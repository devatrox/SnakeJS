import * as Utils from './tools/utilities.js'
import Assert from './tools/assert.js'
import Game from './game.js'
import { Config } from './bootstrap.js'
import { Snake, Entity, Food } from './elements.js'
import * as Keys from './keys.js'

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
   * @param {String} value
   * @fires Game.Events.PLAYER_JOINED
   * @returns {this}
   */
  add (value) {
    Assert.string(value)
    if (this.size === this.maxPlayers) return

    let player = new Player(value)
    player.keySet = Keys.keySets[this.size]

    Utils.emit(Game.Events.PLAYER_JOINED, {
      player: player
    })

    return super.add(player)
  }

  /**
   * @param {Player} player
   * @returns {Boolean}
   */
  delete (player) {
    Assert.instance(player, Player)
    return super.delete(player)
  }

  /**
   * @param {Number} index
   * @returns {Player}
   */
  get (index) {
    return Array.from(this.values())[index]
  }
}

export class System {
  constructor () {
    /**
     * @type {String}
     */
    this.username = 'system'
  }
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
    Assert.instance(keySet, Keys.KeySet)
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
    Assert.instance(key, Keys.DirectionKey)
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
    Assert.number(lives)
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
   * @param {function(KeyboardEvent, Keys.DirectionKey)} cb
   */
  set onArrowKeyPress (cb) {
    Assert.function(cb)
    Utils.listen('keydown', _.debounce(e => {
      if (!this.keySet) return
      if (!Config.gameInstance.isRunning) return

      if (this.keySet.has(e.key)) {
        let key = this.keySet.get(e.key)

        cb(e, key)
      }
    }, 50))
  }

  /**
   * Check if player wants to do a 180° turn
   *
   * @param {Keys.DirectionKey} key
   * @returns {Boolean}
   */
  isTrying180 (key) {
    Assert.instance(key, Keys.DirectionKey)
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
    Assert.number(score)
    if (score > this.maxScore) {
      Utils.emit(Game.Events.MAX_SCORE, {
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
