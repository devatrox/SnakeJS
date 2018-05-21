import * as Utils from './utilities.js'
import { Config } from './bootstrap.js'

export default class Form {
  constructor () {
    this.usernameInput = document.getElementById('username')
    this.startBtn = document.getElementById('start')

    if (Config.debug) {
      this.usernameInput.setAttribute('disabled', 'disabled')
      this.startBtn.focus()
    } else {
      this.startBtn.setAttribute('disabled', 'disabled')
    }

    this.bind()
  }

  /**
   * @returns {Game}
   */
  get game () {
    return Config.gameInstance
  }

  bind () {
    this.game.onPlay = e => {
      this.usernameInput.setAttribute('disabled', 'disabled')
      this.startBtn.setAttribute('disabled', 'disabled')
    }

    this.game.onPause = e => {
      this.startBtn.removeAttribute('disabled')
      this.startBtn.focus()
    }

    Utils.listen('input', e => {
      if (e.target.checkValidity()) {
        this.startBtn.removeAttribute('disabled')
        e.target.classList.remove('is-invalid')
        e.target.classList.add('is-valid')
      } else {
        this.startBtn.setAttribute('disabled', 'disabled')
        e.target.classList.remove('is-valid')
        e.target.classList.add('is-invalid')
      }
    }, this.usernameInput)

    Utils.listen('click', e => {
      if (this.game.players.size === 0) this.game.players.add(this.usernameInput.value)
      this.game.play()
    }, this.startBtn)
  }
}
