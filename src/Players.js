import Player from './Player.js'
import * as Utils from './tools/utilities.js'
import Assert from './tools/Assert.js'
import Game from './Game.js'
import * as Keys from './keys.js'

export default class Players extends Set {
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
