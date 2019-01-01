import GameInit from './bootstrap'

window.requestAnimationFrame(() => {
  const init = new GameInit('game', 640, 480)

  let usernameInput = <HTMLInputElement>document.getElementById('username')
  let startBtn = <HTMLButtonElement>document.getElementById('start')

  if (usernameInput && startBtn) {
    startBtn.setAttribute('disabled', 'disabled')

    GameInit.game.onPlay = e => {
      usernameInput.setAttribute('disabled', 'disabled')
      startBtn.setAttribute('disabled', 'disabled')
    }

    GameInit.game.onPause = e => {
      startBtn.removeAttribute('disabled')
      startBtn.focus()
    }

    usernameInput.addEventListener('input', (e) => {
      const target = (<HTMLButtonElement>e.target)

      if (target.checkValidity()) {
        startBtn.removeAttribute('disabled')
        target.classList.remove('is-invalid')
        target.classList.add('is-valid')
      } else {
        startBtn.setAttribute('disabled', 'disabled')
        target.classList.remove('is-valid')
        target.classList.add('is-invalid')
      }
    }, false)

    startBtn.addEventListener('click', e => {
      if (GameInit.game.players.size === 0) GameInit.game.players.add(usernameInput.value)
      GameInit.game.play()
    }, false)
  }
})
