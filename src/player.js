import * as Utils from './tools/utilities.js'
import Assert from './tools/Assert.js'
import Game from './Game.js'
import { Config } from './bootstrap.js'
import { Snake } from './elements.js'
import * as Keys from './keys.js'
import Score from './Score.js'

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
      if (!this.keySet) { return }
      if (!Config.gameInstance.isRunning) { return }
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

export class System {
  constructor () {
    /**
     * @type {String}
     */
    this.username = 'system'
  }
}
