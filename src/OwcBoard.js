import { LitElement, html, css } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';

// eslint-disable-next-line import/extensions
import { CELL_TYPES } from './engine';

const cellClasses = cell => {
  switch (cell) {
    case CELL_TYPES.SNAKE_BODY:
      return { cell: true, snakeBody: true };
    case CELL_TYPES.SNAKE_HEAD:
      return { cell: true, snakeHead: true };
    case CELL_TYPES.BONUS:
      return { cell: true, bonus: true };
    default:
      return { cell: true, empty: true };
  }
};

export class OwcBoard extends LitElement {
  static get properties() {
    return {
      cells: { type: Array },
    };
  }

  set cells(value) {
    const oldValue = this._cells;
    this._cells = value;
    this.style.setProperty('--owc-snake-grid-size', this.gridSize());
    // retrieve the old property value and store the new one
    this.requestUpdate('cells', oldValue);
  }

  get cells() {
    return this._cells;
  }

  static get styles() {
    return css`
      :host {
        --owc-snake-grid-size: 0;
        --owc-snake-cell-size: 15px;
        --owc-snake-body-cell-color: #1a2b42;
        --owc-snake-head-cell-color: yellowGreen;
        --owc-snake-empty-color: white;
        --owc-snake-bonus-color: darkorange;
      }

      #wrapper {
        display: grid;
        margin: auto;
        width: calc(var(--owc-snake-grid-size) * var(--owc-snake-cell-size));
        grid-template-columns: repeat(var(--owc-snake-grid-size), 1fr);
        background-color: var(--owc-snake-empty-color);
      }

      .cell {
        width: var(--owc-snake-cell-size);
        height: var(--owc-snake-cell-size);
      }

      .snakeBody {
        border-radius: calc(var(--owc-snake-cell-size) * 2);
        background-color: var(--owc-snake-body-cell-color);
      }

      .snakeHead {
        border-radius: calc(var(--owc-snake-cell-size) * 2);
        background-color: var(--owc-snake-head-cell-color);
      }

      .empty {
        background-color: var(--owc-snake-empty-color);
      }

      .bonus {
        background-color: var(--owc-snake-bonus-color);
      }
    `;
  }

  gridSize() {
    return Math.sqrt(this.cells.length);
  }

  render() {
    return html`
      <div id="wrapper">
        ${this.cells.map(
          c => html`<div class=${classMap(cellClasses(c))}></div>`
        )}
      </div>
    `;
  }
}
