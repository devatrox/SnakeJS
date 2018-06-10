import CanvasCoord from './CanvasCoord.js'
import { Config } from '../bootstrap.js'
import Coord from './BaseCoord.js'

export default class SpriteCoord extends Coord {
  constructor (x, y) {
    const scale = Config.spriteScale
    super(x, y, scale)
  }

  /**
   * @returns {CanvasCoord}
   */
  toCanvasCoord () {
    let scale = Config.canvasScale
    let [x, y] = this.toScaledArray(scale)
    return new CanvasCoord(x, y)
  }
}
