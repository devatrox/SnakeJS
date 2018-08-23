import CanvasCoord from './CanvasCoord.js'
import { Config } from '../bootstrap.js'
import { Entity } from '../elements.js'
import Coord from './BaseCoord.js'

export default class GridCoord extends Coord {
  constructor (x, y) {
    const scale = Config.gridScale
    super(x, y, scale)
  }

  /**
   * @returns {GridCoord}
   */
  static random () {
    const saveArea = 2
    let x = _.random(saveArea, (Config.gridInstance.width - saveArea))
    let y = _.random(saveArea, (Config.gridInstance.height - saveArea))
    let coord = new GridCoord(x, y)

    if (Entity.exists(coord)) {
      return GridCoord.random()
    }
    return coord
  }

  /**
   * @returns {CanvasCoord}
   */
  toCanvasCoord () {
    let scale = Config.canvasScale
    let [x, y] = this.toScaledArray(scale)
    y = y + Config.viewInstance.uiHeight
    return new CanvasCoord(x, y)
  }
}
