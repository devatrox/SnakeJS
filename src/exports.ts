/**
 * @enum {string}
 */
export const Color = {
  SNAKE: '#00ff00',
  FOOD: '#ff0000',
  BACKGROUND: '#000000',
  UI: '#666666',
  UI_TEXT: '#ffffff'
}

/**
 * @enum {string}
 */
export const Events = {
  PLAY: 'play.snake',
  PAUSED: 'paused.snake',
  BUMPED_SCORE: 'bumpedScore.snake',
  MAX_SCORE: 'maxScore.snake',
  EAT_FOOD: 'eatFood.snake',
  BUMP: 'bump.snake',
  PLAYER_JOINED: 'playerJoined.snake',
  PLAYER_LOST: 'playerLost.snake'
}
