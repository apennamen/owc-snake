import { List } from 'immutable';
import { CELL_TYPES } from './CELL_TYPES.js';
import { DIRECTIONS } from './DIRECTIONS.js';

/**
 * Represents the board of the game
 */
export class Board {
  constructor({ size }) {
    this.size = size;
    this.empty();
  }

  paintSnake(snake) {
    snake.getBodyIndexes().forEach(partIndex => {
      this.cells = this.cells.set(partIndex, CELL_TYPES.SNAKE_BODY);
    });
    this.cells = this.cells.set(snake.getHeadIndex(), CELL_TYPES.SNAKE_HEAD);
  }

  paintBonuses(bonusGen) {
    const bonuses = bonusGen.getBonuses();
    bonuses.forEach(bonusIndex => {
      this.cells = this.cells.set(bonusIndex, CELL_TYPES.BONUS);
    });
  }

  getCells() {
    return this.cells;
  }

  getEmptyCellsIndexes() {
    const result = [];
    this.cells.forEach((v, i) => {
      if (v === undefined) result.push(i);
    });
    return List(result);
  }

  empty() {
    this.cells = List(Array.from(Array(this.size * this.size)));
  }

  /**
   * Computes following cell index in given direction
   * @param {Number} index - current cell index
   * @param {Number} direction - search direction
   * @returns index of the next cell
   */
  computeNextCellIndex(index, direction) {
    let row = this._indexToRow(index);
    let col = this._indexToCol(index);
    switch (direction) {
      case DIRECTIONS.RIGHT:
        col = (col + 1) % this.size;
        break;
      case DIRECTIONS.LEFT:
        col -= 1;
        if (col < 0) col = this.size - 1;
        break;
      case DIRECTIONS.UP:
        row -= 1;
        if (row < 0) row = this.size - 1;
        break;
      case DIRECTIONS.DOWN:
        row = (row + 1) % this.size;
        break;
      default:
        break;
    }
    return this._columnRowToIndex(col, row);
  }

  /**
   * Computes row number of "index" given a 0 based grid
   * @param {Number} index - cell index
   * @returns row number for index
   */
  _indexToRow(index) {
    if (this.size === 0) return 0;
    return Math.floor(index / this.size);
  }

  /**
   * Computes col number of "index" given a 0 based grid
   * @param {Number} index - cell index
   * @returns col number for index
   */
  _indexToCol(index) {
    return index % this.size;
  }

  /**
   * Computes index from col and row num
   * @param {Number} col - column number
   * @param {Number} row - row number
   * @returns cell index for col and row num
   */
  _columnRowToIndex(col, row) {
    return row * this.size + col;
  }
}
