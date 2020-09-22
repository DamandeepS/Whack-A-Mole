(() => {
  console.log(..."Dance Monkey!".split(``));
})();

(() => {
  class WhackAMole {

    constructor(gameContainer) {
      this.highScore = localStorage.getItem('game-highscore') ? parseInt(localStorage.getItem('game-highscore')) : 0;
      this.gamePaused = false;

      this.gameContainerEl = gameContainer || document.querySelector('.game-c');
      this.highScoreEl = this.gameContainerEl.querySelector('.game-js__high-score');
      this.currentScoreEl = this.gameContainerEl.querySelector('.game-js__current-score');
      this.timerEl = this.gameContainerEl.querySelector('.game-js__timer');
      this.playGroundEl = this.gameContainerEl.querySelector('.game-js__playground');
      this.restartButtonEl = this.gameContainerEl.querySelector('.game-js__restart-control');
      this.pauseButtonEl = this.gameContainerEl.querySelector('.game-js__pause-control');
      this.startOverlayEl = this.gameContainerEl.querySelector('.game-c__start-overlay')
      this.startControlButtonEls = this.gameContainerEl.querySelectorAll('.game-js__start-controls');
      this.endScreenEl = this.gameContainerEl.querySelector('.game-js__end-screen');
      this.endScreenScoreEl = this.endScreenEl.querySelector('.game-js__current-score');
      this.endScreenHighScoreEl = this.endScreenEl.querySelector('.game-js__high-score');
      this.endScreenReplayControlEl = this.endScreenEl.querySelector('.game-js__replay-control');

      this.highScoreEl.textContent = this.highScore;

      // Events
      document.addEventListener('game__tile-clicked', e => {
        const selectedTile = e.detail;
        if (this.selectionEnabled && this.randomTile === selectedTile) {
          this.score++;
        } else if (this.selectionEnabled){
          this.score--;
        }
        this.selectionEnabled = false; // Disabled till next Randomization
      });

      Array.prototype.forEach.call(this.startControlButtonEls, button => {
        button.addEventListener('click', () => {
          this.difficulty = button.dataset['difficulty'] || 'easy';
          this.initGrid();
          // initialize the game randomization till 120 seconnds
          this.interval = window.setInterval(() => {
            if (this.gamePaused) {
              this.selectionEnabled = false;
              return;
            }
            if (this.totalTime-- > 0) {
              this._randomizeHighlightedTile();
              this._updateScores();
              this.selectionEnabled = true;
            } else {
              window.clearInterval(this.interval);
              this.selectionEnabled = false;
              this.showEndScreen();
            }
          }, 1000);
        })
      });

      this.pauseButtonEl.addEventListener('click', this.togglePause);

      this.restartButtonEl.addEventListener('click', this.restartGame);

      this.endScreenReplayControlEl.addEventListener('click', this.restartGame);

      window.addEventListener('orientationchange', this._orientationChanged);
      this._orientationChanged();
    }

    _orientationChanged = () => {
      this.gameContainerEl.classList.remove('game-c--landscape')
      if (Math.abs(window.orientation) == 90) {
        this.gameContainerEl.classList.add('game-c--landscape')
      }
    }

    _updateScores = () => {
      // console.log(this.score);
      this.timerEl.textContent = this.totalTime;
      this.currentScoreEl.textContent = this.score;
    }

    togglePause = () => {
      this.gamePaused = !this.gamePaused;
      if (this.gamePaused) {
        this.selectionPrevState = this.selectionEnabled;
        this.selectionEnabled = false;
        this.pauseButtonEl.textContent = 'Resume';
        this.gameContainerEl.classList.add('game-c--paused');
      } else {
        this.selectionEnabled = this.selectionPrevState;
        this.pauseButtonEl.textContent = 'Pause';
        this.gameContainerEl.classList.remove('game-c--paused');
      }
    }

    initGrid = () => {
      
      this.resetGame();

      let gridSize = 3;
      switch (this.difficulty) {
        case 'easy':
        default:
          gridSize = 3;
          break;
        case 'medium':
          gridSize = 4;
          break;
        case 'hard':
          gridSize = 6;
          break;
      }
      this.startOverlayEl.classList.remove('game-c__start-overlay--active');
      this._drawGrid(gridSize);
    }

    _randomizeHighlightedTile = () => {
      const randomIndex = Math.max(0, Math.min(this.tiles.length - 1, Math.round(Math.random() * this.tiles.length - 1)));
      this.randomTile = this.tiles[randomIndex];
      this.tiles.forEach(tile => {
        tile.classList.remove('game-c__game-tile--highlighted');
        tile.classList.remove('game-c__game-tile--incorrect');
        if (this.randomTile === tile) {
          setTimeout(() => tile.classList.add('game-c__game-tile--highlighted'), 50);
        }
      });
    }


    _drawGrid = size => {
      const totalTiles = size*size;
      const fragement = document.createDocumentFragment();
      while (this.tiles.length < totalTiles) {
        const tile = document.createElement('div');
        tile.classList.add('game-c__game-tile');
        tile.addEventListener('click', e => {
          e.preventDefault();
          e.stopPropagation();
          document.dispatchEvent(new CustomEvent('game__tile-clicked', {
            detail: tile
          }));
        });

        tile.addEventListener('keydown', e => {
          console.log(e);
          if (e.code == 'Enter' || e.code == 'Space') {
            document.dispatchEvent(new CustomEvent('game__tile-clicked', {
              detail: tile
            }));
          }
        })
        tile.setAttribute('role', 'button');
        tile.setAttribute('tabindex', '0');
        this.tiles.push(tile);
        fragement.appendChild(tile);
      };

      this.playGroundEl.classList.remove('game-c__playground-3');
      this.playGroundEl.classList.remove('game-c__playground-4');
      this.playGroundEl.classList.remove('game-c__playground-6');
      this.playGroundEl.classList.add(`game-c__playground-${size}`);
      this.playGroundEl.appendChild(fragement);
    } 

    showEndScreen = () => {
      this.endScreenEl.classList.add('game-c__end-screen--active');

      this.endScreenScoreEl.innerText = this.score;
      if (this.score > this.highScore) {
        this.highScore = this.score
        this.highScoreEl.textContent = this.score;
        this.currentScoreEl.textContent = this.score;
        window.localStorage.setItem('game-highscore', `${this.score}`)
      }

      this.endScreenHighScoreEl.textContent = this.highScore;

      this.resetGame();

      setTimeout(() => {
        window.confirm('Game Over!!!') &&
        this.endScreenEl.classList.remove('game-c__end-screen--active');
        this.startOverlayEl.classList.add('game-c__start-overlay--active');
      }, 0)
    }

    resetGame = () => {
      this.score = 0;
      this.tiles = [];
      this.gamePaused = false;
      this.totalTime = 12;
      this.selectionEnabled = true;
      this.selectionPrevState = true;
      this.currentScoreEl.textContent = 0;
      this.timerEl.textContent = this.totalTime;

      this.pauseButtonEl.textContent = 'Pause';
      while(this.playGroundEl.lastChild) {
        this.playGroundEl.removeChild(this.playGroundEl.firstChild);
      }

      window.clearInterval(this.interval);
      this.selectionEnabled = false;
    }

    restartGame = () => {
      this.resetGame();
      this.endScreenEl.classList.remove('game-c__end-screen--active') &&
      this.startOverlayEl.classList.add('game-c__start-overlay--active');
    }

  }

  new WhackAMole();
})()