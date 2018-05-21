import 'https://cdn.jsdelivr.net/npm/lodash@4'
import Bootstrap, { Config } from './bootstrap.js'

Bootstrap.init().then(game => {
  if (Config.debug) game.players.add('devatrox')
}).catch(console.error)
