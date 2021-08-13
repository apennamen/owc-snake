import { List } from 'immutable';

/**
 * Represents the Snake of the Game
 */
export class Snake {
  constructor({ startIndex, length, direction }) {
    const parts = [];
    for (let i = 0; i < length; i += 1) {
      parts.push(startIndex + i);
    }
    // The first element of the queue holds current direction
    this.directionQueue = List([direction]);
    this.parts = List(parts);
  }

  getHeadIndex() {
    // Head is at the last index of array
    return this.parts.slice(-1).get(0);
  }

  getTailIndex() {
    // tail is the first index of array
    return this.parts.get(0);
  }

  getBodyIndexes() {
    // body includes tails but not head
    return this.parts.slice(0, -1);
  }

  popNextDirection() {
    if (this.directionQueue.size > 1) {
      this.directionQueue = this.directionQueue.shift();
    }

    return this.directionQueue.get(0);
  }

  queueDirection(newDirection) {
    // Case 1. Check last direction in queue
    const lastDirectionInQueue = this.directionQueue.slice(-1).get(0);
    if (
      lastDirectionInQueue === newDirection ||
      lastDirectionInQueue + newDirection === 0
    ) {
      // Case 1.A new direction = current queued direction
      // Case 1.B new direction = opposite queued direction
      return;
    }

    // Case 2. max 3 directions ahead
    if (this.directionQueue.size === 4) return;

    // FIXME: Mutex needed on directionQueue
    this.directionQueue = this.directionQueue.push(newDirection);
  }

  moveTo(headIndex) {
    // remove tail
    this.parts = this.parts.shift();

    this.parts = this.parts.push(headIndex);
  }

  growTo(headIndex) {
    this.parts = this.parts.push(headIndex);
  }
}
