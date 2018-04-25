import * as Utils from './utilities.js'
import View from './view.js'
import Grid, { Coord } from './grid.js'
import { Snake, Entity, Food } from './elements.js'
import { Config } from './bootstrap.js'
import * as Keys from './keys.js'

export default class Game {
  /**
   * @param {Number} [width=640]
   * @param {Number} [height=480]
   * @param {Number} [scale=10]
   */
  constructor (width = 640, height = 480, scale = 10) {
    /**
     * @type {View}
     */
    this.view = new View(width, height, scale)
    /**
     * @type {Grid}
     */
    this.grid = new Grid()
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
    this.speed = 500
    /**
     * @type {Players}
     */
    this.players = new Players()

    this.debug = {
      eatFood: () => Utils.emit(Game.Events.EAT_FOOD, {
        player: this.getPlayer(0)
      }),
      playerLost: () => Utils.emit(Game.Events.PLAYER_LOST, {
        player: this.getPlayer(0)
      })
    }

    this.init()
  }

  set onStarted (cb) {
    window.addEventListener(Game.Events.STARTED, event => cb(event))
  }

  set onMaxScore (cb) {
    window.addEventListener(Game.Events.MAX_SCORE, event => cb(event, event.detail.player))
  }

  set onPlayerJoined (cb) {
    window.addEventListener(Game.Events.PLAYER_JOINED, event => cb(event, event.detail.player))
  }

  set onPlayerLost (cb) {
    window.addEventListener(Game.Events.PLAYER_LOST, event => cb(event, event.detail.player))
  }

  set onEatFood (cb) {
    window.addEventListener(Game.Events.EAT_FOOD, event => cb(event, event.detail.player))
  }

  set onBump (cb) {
    window.addEventListener(Game.Events.BUMP, event => cb(event, event.detail.entity))
  }

  init () {
    this.onStarted = (e) => Utils.notify('Game started')
    this.onPlayerJoined = (e, player) => Utils.notify(`Player "${player.name}" joined`, player)
    this.onPlayerLost = (e, player) => Utils.notify(`Player "${player.name}" lost!`)
    this.onMaxScore = (e, player) => Utils.notify(`Max score of "${Config.Score.maxScore}" reached by "${player.name}"`)
    this.onMaxScore = (e, player) => this.pause()
    this.onEatFood = (e, player) => Config.Score.current++
    this.onEatFood = (e, player) => new Food()
    this.onBump = (e, player) => Utils.notify(`"${player.name}" bumped into something`)

    window.Game = this
  }

  /**
   * @param {String} name
   */
  addPlayer (name) {
    let player = new Player(name)
    player.keySet = Keys.keySets[this.players.size]

    this.players.add(player)
  }

  /**
   * @param {Player} player
   */
  deletePlayer (player) {
    this.players.delete(player)
  }

  /**
   * @param {Number} num
   * @returns {Player}
   */
  getPlayer (num) {
    return Array.from(this.players)[num]
  }

  /**
   * @fires Game.Events.STARTED
   */
  start () {
    let food = new Food()

    this.bindKeys()

    Utils.emit(Game.Events.STARTED)
  }

  /**
   * @param {Number} delay - Delay in seconds
   */
  play (delay = 0) {
    Utils.countDown(delay, num => console.info(`Starting in ${num} ...`)).then(() => {
      this.intervalId = setInterval(this.loop.bind(this), this.speed)
      this.isRunning = true
    })
  }

  pause () {
    clearInterval(this.intervalId)
    this.isRunning = false
  }

  bindKeys () {
    window.addEventListener('keydown', e => {
      let key = e.key
      let escape = new Keys.EscapeKey()
      let enter = new Keys.EnterKey()

      switch (key) {
        case escape.name:
          console.log(escape)
          this.pause()
          break
        case enter.name:
          console.log(enter)
          if (!this.isRunning) {
            this.play(5000)
          }
          break
      }
    }, false)
  }

  /**
   * @todo Rebuild
   */
  loop () {
    const move = Game.Direction[this.currentArrowKey]
    const lastPos = this.snakePos[this.snakePos.length - 1]
    let newPos = lastPos.move(move[0], move[1])

    this.drawSnake(newPos)
  }

  /**
   * @param {Point} pixel
   * @todo Rebuild
   */
  drawSnake (pixel) {
    const ctx = this.gameContext

    // If snake is out of bounds, come out of opposite side
    if (pixel.x < 0) pixel.x = this.width
    if (pixel.x > this.width) pixel.x = 0
    if (pixel.y < 0) pixel.y = this.height
    if (pixel.y > this.height) pixel.y = 0

    ctx.fillStyle = Game.Color.SNAKE
    ctx.fillRect(pixel.x, pixel.y, 1, 1)

    this.snakePos.push(pixel)

    // Remove last pixel of snake
    if (this.snakePos.length >= this.snakeLength) {
      let removed = this.snakePos.splice(0, 1)[0]
      ctx.fillStyle = Game.Color.BACKGROUND
      ctx.fillRect(removed.x, removed.y, 1, 1)
    }

    // Eat food, respawn food
    if (pixel.isEqual(this.foodPos)) {
      this.snakeLength += 5
      this.setScore()
      // console.log(this.score)
      this.drawFood(this.randomPosition())
    }
  }

  /**
   * @param {Point} pixel
   * @todo Rebuild
   */
  drawFood (pixel) {
    const ctx = this.gameContext

    ctx.fillStyle = Game.Color.FOOD
    ctx.fillRect(pixel.x, pixel.y, 1, 1)

    this.foodPos = pixel
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
  STARTED: 'started.snake',
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

class Players extends Set {}

class Player {
  /**
   * @param {String} name
   * @fires Game.Events.PLAYER_JOINED
   */
  constructor (name) {
    /**
     * @type {String}
     */
    this.name = name
    /**
     * @type {Snake}
     */
    this.snake = new Snake()
    /**
     * @type {Score}
     */
    this.score = new Score(this)

    this.bindKeys()

    Utils.emit(Game.Events.PLAYER_JOINED, {
      player: this
    })
  }

  /**
   * @param {Keys.KeySet} keySet
   */
  set keySet (keySet) {
    this._keySet = keySet
  }

  /**
   * @returns {Keys.KeySet}
   */
  get keySet () {
    return this._keySet
  }

  /**
   * @param {Keys.PlayerDirectionKey} key
   */
  set currentDirection (key) {
    Utils.assertIsInstanceOf(key, Keys.PlayerDirectionKey)
    this.currentDirection = key
  }

  /**
   * @returns {Keys.PlayerDirectionKey}
   */
  get currentDirection () {
    return this._currentDirection || this.keySet.up
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
   * @param {Keys.PlayerDirectionKey} key
   * @returns {Boolean}
   */
  isKeyAllowed (key) {
    console.log('current', this.currentDirection)
    console.log('new', key)
    return key.name === this.currentDirection.name
  }

  bindKeys () {
    window.addEventListener('keydown', e => {
      if (!this.keySet) return

      if (this.keySet.has(e.key)) {
        let key = this.keySet.get(e.key)
        console.log(key)
        // No 180° turns allowed
        if (this.isKeyAllowed(key)) {
          this.currentDirection = key.direction
        }
      }
    }, false)
  }
}

export class Score {
  /**
   * @param {Player} player
   * @param {Number} [max = 10]
   */
  constructor (player, max = 10) {
    /**
     * @type {Player}
     */
    this.player = player
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
    if (score > this.maxScore) {
      Utils.emit(Game.Events.MAX_SCORE, {
        player: this.player
      })

      return
    }
    this._current = score
  }

  /**
   * @returns {Number}
   */
  get current () {
    return this._current || 0
  }
}
