import * as Utils from './tools/utilities.js'
import Assert from './tools/Assert.js'
import Game from './Game.js'
import Player from './Player.js'

export default class Score {
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

  /**
   * @fires Game.Events.BUMPED_SCORE
   */
  bump () {
    this.current++
    this.owner.snake.maxSize++
    Utils.emit(Game.Events.BUMPED_SCORE, {
      score: this.current,
      player: this.owner
    })
  }
}
