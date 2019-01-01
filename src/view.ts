import Game from './game'
import * as Utils from './utilities'
import GameInit from './bootstrap'
import Grid from './grid'
import { Color } from './exports'

export default class View {
  element: HTMLElement
  width: number
  height: number
  uiHeight: number = 50
  canvas: HTMLCanvasElement = document.createElement('canvas')

  constructor (elementId: string, width: number = 640, height: number = 480) {
    this.element = <HTMLElement>document.getElementById(elementId)
    this.width = width
    this.height = height

    this.element.appendChild(this.canvas)

    this.canvas.width = this.width
    this.canvas.height = this.height

    this.draw()
  }

  get context (): CanvasRenderingContext2D {
    return <CanvasRenderingContext2D>this.canvas.getContext('2d')
  }

  get gameWidth (): number {
    return this.width
  }

  get gameHeight (): number {
    return this.height - this.uiHeight
  }

  draw () {
    this.drawUi()

    this.context.fillStyle = Color.BACKGROUND
    this.context.fillRect(0, this.uiHeight, this.width, this.height - this.uiHeight)
  }

  drawUi () {
    this.context.fillStyle = Color.UI
    this.context.fillRect(0, 0, this.width, this.uiHeight)
  }

  drawScore () {
    this.drawUi()

    let players = GameInit.game.players

    let scores = players.asArray.map(player => `${player.username}: ${player.score.current}`)

    this.context.fillStyle = Color.UI_TEXT
    this.context.font = '16px monospace'
    this.context.fillText(scores.join(' / '), 10, 40)
  }
}
