import Game from './game.js'
import { keySets } from './keys.js'

const game = new Game(640, 480)
game.addPlayer('Rosie', keySets[0])
game.start()
