import * as Utils from './utilities.js'
import Assert from './assert.js'
import View from './view.js'
import Grid from './grid.js'
import { Snake, Entity, Food } from './elements.js'
import { Config } from './bootstrap.js'
import * as Keys from './keys.js'
import Player, { Players, Score } from './player.js'

export default class Game {
  /**
   * @param {String} elementId
   */
  constructor (elementId) {
    /**
     * @type {Boolean}
     */
    this.isRunning = false
    /**
     * @type {Number}
     */
    this.speed = 75
    /**
     * @type {Players}
     */
    this.players = new Players()

    this.init()
  }

  /**
   * @returns {Grid}
   */
  get grid () {
    return Config.gridInstance
  }

  /**
   * @returns {View}
   */
  get view () {
    return Config.viewInstance
  }

  /**
   * @param {Number} id
   */
  set intervalId (id) {
    Assert.number(id)
    clearInterval(this.intervalId)
    this._intervalId = id
  }

  /**
   * @returns {Number}
   */
  get intervalId () {
    return this._intervalId
  }

  /**
   * @param {{cb: (event: Event, player: Player)}} cb
   */
  set onMaxScore (cb) {
    Assert.function(cb)
    Utils.listen(Game.Events.MAX_SCORE, event => cb(event, event.detail.player))
  }

  /**
   * @param {{cb: (event: Event, player: Player)}} cb
   */
  set onBumpScore (cb) {
    Assert.function(cb)
    Utils.listen(Game.Events.BUMPED_SCORE, event => cb(event, event.detail.player))
  }

  /**
   * @param {{cb: (event: Event, player: Player)}} cb
   */
  set onPlayerJoined (cb) {
    Assert.function(cb)
    Utils.listen(Game.Events.PLAYER_JOINED, event => cb(event, event.detail.player))
  }

  /**
   * @param {{cb: (event: Event, player: Player)}} cb
   */
  set onPlayerLost (cb) {
    Assert.function(cb)
    Utils.listen(Game.Events.PLAYER_LOST, event => cb(event, event.detail.player))
  }

  /**
   * @param {{cb: (event: Event, player: Player)}} cb
   */
  set onEatFood (cb) {
    Assert.function(cb)
    Utils.listen(Game.Events.EAT_FOOD, event => cb(event, event.detail.player))
  }

  /**
   * @param {{cb: (event: Event, player: Player, entity: Entity)}} cb
   */
  set onBump (cb) {
    Assert.function(cb)
    Utils.listen(Game.Events.BUMP, event => cb(event, event.detail.player, event.detail.entity))
  }

  /**
   * @param {{cb: (event: Event, delay: Number)}} cb
   */
  set onPlay (cb) {
    Assert.function(cb)
    Utils.listen(Game.Events.PLAY, event => cb(event, event.detail.delay))
  }

  /**
   * @param {{cb: (event: Event, reason: ?String)}} cb
   */
  set onPause (cb) {
    Assert.function(cb)
    Utils.listen(Game.Events.PAUSED, event => cb(event, event.detail.reason))
  }

  /**
   * @param {{cb: (event: Event, key: Keys.EscapeKey)}} cb
   */
  set onEscapeKeyPress (cb) {
    Assert.function(cb)
    Utils.listen('keydown', e => {
      let escape = new Keys.EscapeKey()

      if (escape.keyName === e.key) cb(e, escape)
    })
  }

  /**
   * @param {{cb: (event: Event, key: Keys.EnterKey)}} cb
   */
  set onEnterKeyPress (cb) {
    Assert.function(cb)
    Utils.listen('keydown', e => {
      let enter = new Keys.EnterKey()

      if (enter.keyName === e.key) cb(e, enter)
    })
  }

  async init () {
    window.onerror = () => this.pause('Error occured')

    this.onPlayerJoined = (e, player) => this.view.drawScore()
    this.onBumpScore = (e, player) => this.view.drawScore()
    this.onMaxScore = (e, player) => this.pause('Max score reached')
    this.onEatFood = (e, player) => player.score.bump()
    this.onEatFood = (e, player) => this.food.reset()
    this.onEscapeKeyPress = (e, key) => this.pause('Escape key pressed')
    this.onBump = (e, player, entity) => this.pause('Bumped into something')

    if (Config.debug) this.debug()
  }

  debug () {
    this.onEatFood = (e, player) => Utils.notify(`Player "${player.username}" ate food`)
    this.onPlay = (e, delay) => Utils.notify(`Game started with delay of ${delay}s`)
    this.onPause = (e, reason) => Utils.notify(`Game paused with reason "${reason}"`)
    this.onPlayerJoined = (e, player) => Utils.notify(`Player "${player.username}" joined`)
    this.onPlayerLost = (e, player) => Utils.notify(`Player "${player.username}" lost!`)
    this.onMaxScore = (e, player) => Utils.notify(`Max score of "${player.score.maxScore}" reached by "${player.username}"`)
    this.onBumpScore = (e, player) => Utils.notify(`Score of "${player.username}" increased to ${player.score.current}!`)
    this.onBump = (e, player, entity) => Utils.notify(`"${player.username}" bumped into "${entity.constructor.name}"`)

    window.Game = this
  }

  /**
   * @param {Number} delay - Delay in seconds
   */
  play (delay = 0) {
    Assert.number(delay)
    if (!this.isRunning) {
      Utils.delay(delay).then(() => {
        this.isRunning = true
        this.intervalId = setInterval(() => this.loop(), this.speed)
        Utils.emit(Game.Events.PLAY, {
          delay: delay
        })
      })
    }
  }

  /**
   * @param {?String} [reason]
   */
  pause (reason) {
    if (this.isRunning) {
      clearInterval(this.intervalId)
      this.isRunning = false
      Utils.emit(Game.Events.PAUSED, {
        reason: reason
      })
    }
  }

  toggle () {
    this[!this.isRunning ? 'play' : 'pause']()
  }

  /**
   * Do loopy things
   */
  loop () {
    this.players.forEach(player => player.move())
  }
}

/**
 * @enum {String}
 */
Game.Color = {
  SNAKE: '#00ff00',
  FOOD: '#ff0000',
  BACKGROUND: '#000000',
  UI: '#666666',
  UI_TEXT: '#ffffff'
}

/**
 * @enum {String}
 */
Game.Events = {
  PLAY: 'play.snake',
  PAUSED: 'paused.snake',
  BUMPED_SCORE: 'bumpedScore.snake',
  MAX_SCORE: 'maxScore.snake',
  EAT_FOOD: 'eatFood.snake',
  BUMP: 'bump.snake',
  PLAYER_JOINED: 'playerJoined.snake',
  PLAYER_LOST: 'playerLost.snake'
}
