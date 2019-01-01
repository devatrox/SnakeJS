import * as Utils from './utilities'
import View from './view'
import Grid, { Coord } from './grid'
import { Snake, Entity, Food } from './elements'
import GameInit from './bootstrap'
import * as Keys from './keys'
import Player, { Players, Score } from './player'
import { Events } from './exports'

export default class Game {
  view: View = GameInit.view
  grid: Grid = GameInit.grid

  intervalId: number|undefined = undefined
  isRunning: boolean = false
  speed: number = 75
  players: Players = new Players()
  food: Food = new Food()

  constructor () {
    this.init()
  }

  set onMaxScore (cb: (event: CustomEvent<{player: Player}>, player: Player) => void) {
    window.addEventListener(Events.MAX_SCORE, (event: CustomEvent) => cb(event, event.detail.player))
  }

  set onBumpScore (cb: (event: CustomEvent, player: Player) => void) {
    window.addEventListener(Events.BUMPED_SCORE, event => cb(event, event.detail.player))
  }

  set onPlayerJoined (cb: (event: CustomEvent, player: Player) => void) {
    window.addEventListener(Events.PLAYER_JOINED, event => cb(event, event.detail.player))
  }

  set onPlayerLost (cb: (event: CustomEvent, player: Player) => void) {
    window.addEventListener(Events.PLAYER_LOST, event => cb(event, event.detail.player))
  }

  set onEatFood (cb: (event: CustomEvent, player: Player) => void) {
    window.addEventListener(Events.EAT_FOOD, event => cb(event, event.detail.player))
  }

  set onBump (cb: (event: CustomEvent, player: Player, entity: Entity) => void) {
    window.addEventListener(Events.BUMP, event => cb(event, event.detail.player, event.detail.entity))
  }

  set onPlay (cb: (event: CustomEvent, delay: number) => void) {
    window.addEventListener(Events.PLAY, event => cb(event, event.detail.delay))
  }

  set onPause (cb: (event: CustomEvent, reason?: string) => void) {
    window.addEventListener(Events.PAUSED, event => cb(event, event.detail.reason))
  }

  set onEscapeKeyPress (cb: (event: KeyboardEvent, key: Keys.EscapeKey) => void) {
    window.addEventListener('keydown', e => {
      let escape = new Keys.EscapeKey()

      if (escape.keyName === e.key) cb(e, escape)
    }, false)
  }

  set onEnterKeyPress (cb: (event: KeyboardEvent, key: Keys.EnterKey) => void) {
    window.addEventListener('keydown', e => {
      let enter = new Keys.EnterKey()

      if (enter.keyName === e.key) cb(e, enter)
    }, false)
  }

  init () {
    window.onerror = () => this.pause('Error occured')

    this.onPlayerJoined = (e, player) => this.view.drawScore()
    this.onBumpScore = (e, player) => this.view.drawScore()
    this.onMaxScore = (e, player) => this.pause('Max score reached')
    this.onEatFood = (e, player) => player.score.bump()
    this.onEatFood = (e, player) => this.food.reset()
    this.onEscapeKeyPress = (e, key) => this.pause('Escape key pressed')
    this.onBump = (e, player, entity) => this.pause('Bumped into something')

    this.debug()

    window.Game = this
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
  }

  play (delay: number = 0) {
    if (!this.isRunning) {
      Utils.delay(delay).then(() => {
        this.isRunning = true
        this.intervalId = setInterval(() => this.loop(), this.speed)
        Utils.emit(Events.PLAY, {
          delay: delay
        })
      })
    }
  }

  pause (reason?: string) {
    if (this.isRunning) {
      clearInterval(this.intervalId)
      this.isRunning = false
      Utils.emit(Events.PAUSED, {
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
    this.players.asArray.forEach(player => player.move())
  }
}
