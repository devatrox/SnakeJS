import Game from './game.js'

const game = new Game('game', 640, 480)

let usernameInput = document.getElementById('username')
let startBtn = document.getElementById('start')

startBtn.setAttribute('disabled', 'disabled')

game.onPlay = e => {
  usernameInput.setAttribute('disabled', 'disabled')
  startBtn.setAttribute('disabled', 'disabled')
}

game.onPause = e => {
  startBtn.removeAttribute('disabled')
  startBtn.focus()
}

usernameInput.addEventListener('input', e => {
  if (e.target.checkValidity()) {
    startBtn.removeAttribute('disabled')
    e.target.classList.remove('is-invalid')
    e.target.classList.add('is-valid')
  } else {
    startBtn.setAttribute('disabled', 'disabled')
    e.target.classList.remove('is-valid')
    e.target.classList.add('is-invalid')
  }
}, false)

startBtn.addEventListener('click', e => {
  if (game.players.size === 0) game.players.add(usernameInput.value)
  game.play()
}, false)
