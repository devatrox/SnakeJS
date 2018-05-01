import * as Utils from './utilities.js'
import View from './view.js'
import Grid, { Coord } from './grid.js'
import { Snake, Entity, Food } from './elements.js'
import { Config } from './bootstrap.js'
import * as Keys from './keys.js'
import Player, { Players, Score } from './player.js'

export default class Game {
  /**
   * @param {Number} [width=640]
   * @param {Number} [height=480]
   * @param {Number} [scale=10]
   */
  constructor (width = 640, height = 480, scale = 10) {
    Utils.assert(width % scale === 0, `width must be a multiple of ${scale}`)
    Utils.assert(height % scale === 0, `height must be a multiple of ${scale}`)
    /**
     * @type {View}
     */
    this.view = new View(width, height)
    /**
     * @type {Grid}
     */
    this.grid = new Grid(scale)
    /**
     * @type {?Number}
     */
    this.intervalId = null
    /**
     * @type {Boolean}
     */
    this.isRunning = false
    /**
     * @type {Number}
     */
    this.speed = 100
    /**
     * @type {Players}
     */
    this.players = new Players()
    /**
     * @type {Food}
     */
    this.food = new Food()

    Config.game = this

    this.init()
  }

  /**
   * @param {{cb: (event: Event, player: Player)}} cb
   */
  set onMaxScore (cb) {
    window.addEventListener(Game.Events.MAX_SCORE, event => cb(event, event.detail.player))
  }

  /**
   * @param {{cb: (event: Event, player: Player)}} cb
   */
  set onBumpScore (cb) {
    window.addEventListener(Game.Events.BUMPED_SCORE, event => cb(event, event.detail.player))
  }

  /**
   * @param {{cb: (event: Event, player: Player)}} cb
   */
  set onPlayerJoined (cb) {
    window.addEventListener(Game.Events.PLAYER_JOINED, event => cb(event, event.detail.player))
  }

  /**
   * @param {{cb: (event: Event, player: Player)}} cb
   */
  set onPlayerLost (cb) {
    window.addEventListener(Game.Events.PLAYER_LOST, event => cb(event, event.detail.player))
  }

  /**
   * @param {{cb: (event: Event, player: Player)}} cb
   */
  set onEatFood (cb) {
    window.addEventListener(Game.Events.EAT_FOOD, event => cb(event, event.detail.player))
  }

  /**
   * @param {{cb: (event: Event, player: Player, entity: Entity)}} cb
   */
  set onBump (cb) {
    window.addEventListener(Game.Events.BUMP, event => cb(event, event.detail.player, event.detail.entity))
  }

  /**
   * @param {{cb: (event: Event, delay: Number)}} cb
   */
  set onPlay (cb) {
    window.addEventListener(Game.Events.PLAY, event => cb(event, event.detail.delay))
  }

  /**
   * @param {{cb: (event: Event, reason: ?String)}} cb
   */
  set onPause (cb) {
    window.addEventListener(Game.Events.PAUSED, event => cb(event, event.detail.reason))
  }

  /**
   * @param {{cb: (event: Event, key: Keys.EscapeKey)}} cb
   */
  set onEscapeKeyPress (cb) {
    window.addEventListener('keydown', e => {
      let escape = new Keys.EscapeKey()

      if (escape.keyName === e.key) cb(e, escape)
    }, false)
  }

  /**
   * @param {{cb: (event: Event, key: Keys.EnterKey)}} cb
   */
  set onEnterKeyPress (cb) {
    window.addEventListener('keydown', e => {
      let enter = new Keys.EnterKey()

      if (enter.keyName === e.key) cb(e, enter)
    }, false)
  }

  init () {
    window.onerror = () => this.pause('Error occured')

    this.onMaxScore = (e, player) => this.pause('Max score reached')
    this.onEatFood = (e, player) => player.score.current++
    this.onEatFood = (e, player) => this.food.reset()
    this.onEnterKeyPress = (e, key) => this.play(10)
    this.onEscapeKeyPress = (e, key) => this.pause('Escape key pressed')
    this.onBump = (e, player, entity) => this.pause('Bumped into something')

    this.debug()

    window.Game = this
  }

  debug () {
    this.onPlay = (e, delay) => Utils.notify(`Game started with delay of ${delay}s`)
    this.onPause = (e, reason) => Utils.notify(`Game paused with reason "${reason}"`)
    this.onPlayerJoined = (e, player) => Utils.notify(`Player "${player.username}" joined`)
    this.onPlayerLost = (e, player) => Utils.notify(`Player "${player.username}" lost!`)
    this.onMaxScore = (e, player) => Utils.notify(`Max score of "${player.score.maxScore}" reached by "${player.username}"`)
    this.onBumpScore = (e, player) => Utils.notify(`Score of "${player.username}" increased to ${player.score.current}!`)
    this.onBump = (e, player, entity) => Utils.notify(`"${player.username}" bumped into "${entity.constructor.name}"`)
  }

  /**
   * @param {Number} delay - Delay in seconds
   */
  play (delay = 0) {
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
  SNAKE: '#ffffff',
  FOOD: '#ff0000',
  BACKGROUND: '#000000'
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

Game.Entities = {
  Snake: {
    NAME: 'snake',
    COLOR: Game.Color.SNAKE
  },
  Food: {
    NAME: 'food',
    COLOR: Game.Color.FOOD
  }
}

/**
 * @callback generalCallback
 * @param {CustomEvent} event
 */

/**
 * @callback playerCallback
 * @param {CustomEvent} event
 * @param {Player} player
 */

/**
 * @callback keyPressCallback
 * @param {KeyboardEvent} event
 * @param {Key} key
 */
