import { Config } from '../bootstrap.js'
import Coord from './BaseCoord.js'
import GridCoord from './GridCoord.js'

export default class CanvasCoord extends Coord {
  constructor (x, y) {
    const scale = Config.canvasScale
    super(x, y, scale)
  }

  /**
   * @returns {GridCoord}
   */
  toGridCoord () {
    let scale = Config.gridScale
    let [x, y] = this.toScaledArray(scale)
    return new GridCoord(x, y)
  }
}
