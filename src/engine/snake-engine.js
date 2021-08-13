import { Map, fromJS } from 'immutable';

import { Board } from './board.js';
import { Snake } from './snake.js';
import { BonusGenerator } from './bonus-generator.js';
import { DIRECTIONS } from './DIRECTIONS.js';

const INITIAL_STATE = {
  GAME: {
    score: 0,
    isGameOver: false,
    level: 1,
  },
  BOARD: {
    cells: [],
  },
};

const INIT_PARAMETERS = Map({
  BOARD: { size: 15 },
  SNAKE: {
    // second line of the board
    startIndex: 15 * 2,
    length: 4,
    direction: DIRECTIONS.RIGHT,
  },
  GAME: {
    maxBonusNb: 3,
  },
});

// Associative array Score / Speed
const LEVELS = Map({
  0: 400,
  3: 350,
  6: 320,
  9: 300,
  12: 280,
  15: 250,
});

/**
 * Game engine for the Snake, holds the state of the game.
 * Deplacement Engine + Render Engine + collision Engine
 */
export class SnakeEngine {
  /**
   *
   * @param {function} cb called with new state available
   */
  constructor(cb) {
    this.cb = cb || (() => null);
  }

  start() {
    this.state = fromJS(INITIAL_STATE);

    this.board = new Board({ ...INIT_PARAMETERS.get('BOARD') });

    this.snake = new Snake({ ...INIT_PARAMETERS.get('SNAKE') });

    this.bonusGen = new BonusGenerator({ ...INIT_PARAMETERS.get('GAME') });

    // Holds the intervals id for game events
    this.intervals = {};
    this.intervals.bonusInterval = setInterval(
      () => this._generateBonuses(),
      3000
    );
    this.intervals.mainInterval = setInterval(
      () => this._tick(),
      LEVELS.get('0')
    );
    this.board.paintSnake(this.snake);

    this.state = this.state.updateIn(['BOARD', 'cells'], () =>
      this.board.getCells()
    );
    this._notify();
  }

  queueSnakeDirection(newDirection) {
    this.snake.queueDirection(newDirection);
  }

  _notify() {
    this.cb(this.state);
  }

  _tick() {
    // Compute new snake head position
    const index = this.snake.getHeadIndex();
    const direction = this.snake.popNextDirection();
    const newSnakeHeadIndex = this.board.computeNextCellIndex(index, direction);

    // Collision Engine
    const hasBodyCollision = this._checkSnakeCollision(newSnakeHeadIndex);
    const hasBonusCollision = this._checkBonusCollision(newSnakeHeadIndex);

    // Movement engine
    if (hasBonusCollision) {
      this.bonusGen.removeBonus(newSnakeHeadIndex);
      this.snake.growTo(newSnakeHeadIndex);
      this.state = this.state.updateIn(['GAME', 'score'], value => value + 1);
      this._updateLevel();
    } else if (hasBodyCollision) {
      this.snake.moveTo(newSnakeHeadIndex);
      this.state = this.state.updateIn(['GAME', 'isGameOver'], () => true);
      this._stop();
    } else {
      this.snake.moveTo(newSnakeHeadIndex);
    }

    // Render Engine
    this.board.empty();
    this.board.paintSnake(this.snake);
    this.board.paintBonuses(this.bonusGen);
    this.state = this.state.updateIn(['BOARD', 'cells'], () =>
      this.board.getCells()
    );

    // Propagate state
    this._notify();
  }

  _updateLevel() {
    const score = this.state.getIn(['GAME', 'score']);
    const newSpeed = LEVELS.get(`${score}`);

    if (newSpeed) {
      clearInterval(this.intervals.mainInterval);
      this.intervals.mainInterval = setInterval(() => this._tick(), newSpeed);
      this.state = this.state.updateIn(['GAME', 'level'], value => value + 1);
    }
  }

  _generateBonuses() {
    const availableIndexes = this.board.getEmptyCellsIndexes();
    return this.bonusGen.generateBonuses(availableIndexes);
  }

  /**
   *
   * @param {Number} newSnakeHeadIndex
   * @returns true if snake head will collide with snake body
   */
  _checkSnakeCollision(newSnakeHeadIndex) {
    if (this.snake.getTailIndex() === newSnakeHeadIndex) return false;

    return this.snake.getBodyIndexes().indexOf(newSnakeHeadIndex) >= 0;
  }

  /**
   *
   * @param {Number} newSnakeHeadIndex
   * @returns true if snake head will collide with a bonus
   */
  _checkBonusCollision(newSnakeHeadIndex) {
    return this.bonusGen.getBonuses().indexOf(newSnakeHeadIndex) >= 0;
  }

  _stop() {
    clearInterval(this.intervals.bonusInterval);
    clearInterval(this.intervals.mainInterval);

    this.intervals = {};
  }
}
