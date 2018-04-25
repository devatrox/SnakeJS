import View from './view.js'
import { Score } from './game.js'
import Grid from './grid.js'

/**
 * @namespace
 * @property {String} notify
 * @property {?View} View
 * @property {?Grid} Grid
 */
export const Config = {
  notify: 'console',
  View: null,
  Grid: null
}

window.Config = Config
