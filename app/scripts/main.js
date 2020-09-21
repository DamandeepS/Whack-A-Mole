(() => {
  console.log(..."Dance Monkey!".split(``));
})();

(() => {
  class WhackAMole {

    constructor(gameContainer) {
      this.highScore = localStorage.getItem('game-highscore') ? parseInt(localStorage.getItem('game-highscore')) : 0;
      this.score = 0;
      this.tiles = [];
      this.gamePaused = false;
      this.totalTime = 120;
      this.selectionEnabled = true;
      this.selectionPrevState = true;

      this.gameContainerEl = gameContainer || document.querySelector('.game-c');
      this.highScoreEl = this.gameContainerEl.querySelector('.game-js__highscore');
      this.timerEl = this.gameContainerEl.querySelector('.game-js__timer');
      this.playGroundEl = this.gameContainerEl.querySelector('.game-js__playground');
      this.pauseButtonEl = this.gameContainerEl.querySelector('.game-js__pause-control');
      this.enterButtonEl = this.gameContainerEl.querySelector('.game-js__enter-control');
      this.startOverlayEl = this.gameContainerEl.querySelector('.game-c__start-overlay')
      this.startControlButtonEls = this.gameContainerEl.querySelectorAll('.game-js__start-controls');
      this.endScreenEl = this.gameContainerEl.querySelector('.game-js__end-screen');
      this.endScreenScoreEl = this.endScreenEl.querySelector('.game-c__current-score');

      this.highScoreEl = this.highScore;

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

      this.enterButtonEl.addEventListener('click', () => {
        this.startOverlayEl.classList.add('game-c__start-overlay--active');
        this.enterButtonEl.classList.add('game-u--hidden');
      });

      this.startControlButtonEls.forEach(button => {
        button.addEventListener('click', () => {
          if (this.gameInitialized) {
            return;
          }
          this.difficulty = button.dataset['difficulty'] || 'easy';
          this.initGrid();
          // initialize the game randomization till 120 seconnds
          const interval = window.setInterval(() => {
            if (this.gamePaused) {
              this.selectionEnabled = false;
              return;
            }
            if (this.totalTime-- > 0) {
              this._randomizeHighlightedTile();
              this._updateScores();
              this.selectionEnabled = true;
            } else {
              window.clearInterval(interval);
              this.selectionEnabled = false;
              this.showEndScreen();
            }
          }, 1000);

          this.gameInitialized = true;
        })
      });

      this.pauseButtonEl.addEventListener('click', this.togglePause);
    }

    _updateScores = () => {
      // console.log(this.score);
      this.timerEl.textContent = this.totalTime;
    }

    togglePause = () => {
      this.gamePaused = !this.gamePaused;
      if (this.gamePaused) {
        this.selectionPrevState = this.selectionEnabled;
        this.selectionEnabled = false;
        this.pauseButtonEl.textContent = 'Resume';
      } else {
        this.selectionEnabled = this.selectionPrevState;
        this.pauseButtonEl.textContent = 'Pause';
      }

    }

    initGrid = () => {
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
      this._drawGrid(gridSize);
    }


    _randomizeHighlightedTile = () => {
      const randomIndex = Math.round(Math.random() * this.tiles.length - 1);
      this.randomTile = this.tiles[randomIndex];
      this.tiles.forEach(tile => {
        tile.classList.remove('game-c__game-tile--highlighted');
        tile.classList.remove('game-c__game-tile--incorrect');
        if (this.randomTile === tile) {
          tile.classList.add('game-c__game-tile--highlighted');
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
        this.tiles.push(tile);
        fragement.append(tile);
      };

      while(this.playGroundEl.lastChild) {
        this.playGroundEl.firstChild.remove();
      }

      this.playGroundEl.append(fragement);
    } 

    showEndScreen = () => {
      this.gameInitialized = false;
      // todo
      this.endScreenEl.classList.add('game-c__end-screen--active');
      this.endScreenScoreEl.innerText = this.score;
      if(this.score > this.highScore) {
        this.highScore = this.score
        this.highScoreEl.textContent = this.score;
        window.localStorage.setItem('game-highscore', `${this.score}`)
      }
    }

  }

  new WhackAMole();
})()