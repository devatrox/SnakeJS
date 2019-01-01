import * as Utils from './utilities'
import Game from './game'
import View from './view'
import Grid from './grid'

export default class GameInit {
  static notify: string = 'console'
  static game: Game = new Game()
  static view: View
  static grid: Grid

  constructor(elementId: string, width: number = 640, height: number = 480, scale: number = 10) {
    Utils.assert(width % scale === 0, `width must be a multiple of ${scale}`)
    Utils.assert(height % scale === 0, `height must be a multiple of ${scale}`)
    Utils.assert(height > 300, `height must be at least 300`)

    console.log(GameInit.game)
    GameInit.view = new View(elementId, width, height)
    GameInit.grid = new Grid(scale)
  }
}
