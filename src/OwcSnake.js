import { LitElement, html, css } from 'lit-element';
import './owc-board.js';
// eslint-disable-next-line import/extensions
import { SnakeEngine, DIRECTIONS } from './engine';

export class OwcSnake extends LitElement {
  static get styles() {
    return css`
      :host {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        font-size: calc(10px + 2vmin);
        color: #1a2b42;
        max-width: 960px;
        margin: 0 auto;
        text-align: center;
        background-color: var(--owc-snake-background-color);
      }

      main {
        flex-grow: 1;
      }
    `;
  }

  static get properties() {
    return {
      score: { type: Number },
      isGameOver: { type: Boolean },
      level: { type: Number },
    };
  }

  firstUpdated() {
    const board = this.shadowRoot.getElementById('board');
    const connect = state => {
      board.cells = [...state.getIn(['BOARD', 'cells'])];
      this.score = state.getIn(['GAME', 'score']);
      this.isGameOver = state.getIn(['GAME', 'isGameOver']);
      this.level = state.getIn(['GAME', 'level']);
    };
    this.engine = new SnakeEngine(connect);
    this.engine.start();

    window.addEventListener('keydown', ({ code }) => {
      const transco = {
        ArrowDown: DIRECTIONS.DOWN,
        ArrowUp: DIRECTIONS.UP,
        ArrowLeft: DIRECTIONS.LEFT,
        ArrowRight: DIRECTIONS.RIGHT,
      };

      if (transco[code]) this.engine.queueSnakeDirection(transco[code]);
    });
  }

  _play() {
    this.engine.start();
  }

  render() {
    const message = this.isGameOver ? 'Game OVER !' : 'Game on :)';
    const playButton = this.isGameOver
      ? html`<button @click="${this._play}">Play again</button>`
      : null;
    return html`
      <main>
        <h1>🐍 Ssssssn8ke 🐍</h1>
        <div>Score: ${this.score} - Speed: ${this.level}</div>
        <div>${message}</div>
        <owc-board id="board"></owc-board>
        ${playButton}
      </main>
    `;
  }
}
