# SnakeJS 🐍

A simple game of Snake written in ES6 without any frameworks.

As of right now, it does not have any UI besides showing the score and it looks ugly as shit but I made this to learn the basics of game development and I will continue improving this.

## How to start

ES6 modules work in Chrome 61+ out of the box. In Firefox 54+ you have to activate the `dom.moduleScripts.enabled` flag

Tested in Chrome 66 and Firefox 59

Make sure you have npm 5.x. Install the dependencies and run `npm start`

You can add a second player by running `Config.game.players.add('NAME')` (he will use the WASD keys) in the browser console but as soon as they bump into each other, the game just pauses since two-player mode is not done yet :p

Ideas and code suggestions are welcome!
