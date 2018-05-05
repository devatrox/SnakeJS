const image = new Image(50, 40)
image.src = './src/sprite.png'

/**
 * @namespace
 * @property {String} notify
 * @property {?Game} game
 * @property {?View} view
 * @property {?Grid} grid
 */
export const Config = {
  notify: 'console',
  spriteImage: image,
  game: null,
  view: null,
  grid: null
}

window.Config = Config
