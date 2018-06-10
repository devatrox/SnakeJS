import { Sprite } from './sprite.js'
import Assert from './tools/assert.js'
import View from './view.js'
import Grid from './grid.js'
import Game from './game.js'
import Form from './form.js'
import { Food } from './elements.js'

/**
 * @namespace
 * @property {Boolean} debug
 * @property {String} notify
 * @property {Number} gridScale
 * @property {Number} canvasScale
 * @property {Number} spriteScale
 * @property {Game} gameInstance
 * @property {View} viewInstance
 * @property {Grid} gridInstance
 */
export const Config = {
  debug: true,
  notify: 'console',
  width: 640,
  height: 480,
  gridScale: 10,
  canvasScale: 1,
  spriteScale: 10,
  spriteImagePath: './src/sprite.png',
  spriteImage: new Sprite()
}

export default class Bootstrap {
  /**
   * @returns {Promise}
   */
  static async init () {
    Config.viewInstance = new View('game')
    Config.gridInstance = new Grid()
    Config.gameInstance = new Game()
    await Config.spriteImage.load(Config.spriteImagePath)
    await Config.gridInstance.createGrid()
    Config.gameInstance.food = new Food()

    let form = new Form()

    return Promise.resolve(Config.gameInstance)
  }
}

Assert.true(Config.width % Config.gridScale === 0, `width must be a multiple of ${Config.gridScale}`)
Assert.true(Config.height % Config.gridScale === 0, `height must be a multiple of ${Config.gridScale}`)
Assert.true(Config.height > 300, `height must be at least 300`)

if (Config.debug) window.Config = Config
