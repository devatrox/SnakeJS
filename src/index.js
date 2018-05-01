import Game from './game.js'
import { keySets } from './keys.js'

const game = new Game(640, 480)
game.players.add('Rosie', keySets[0])
game.play()
