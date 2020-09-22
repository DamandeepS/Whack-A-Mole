
  (() => {
    const newGame = new WhackAMole();

    const gameContainerEl = document.querySelector('.game-c');
    const highScoreEl = gameContainerEl.querySelector('.game-js__high-score');
    const currentScoreEl = gameContainerEl.querySelector('.game-js__current-score');
    const timerEl = gameContainerEl.querySelector('.game-js__timer');
    const playGroundEl = gameContainerEl.querySelector('.game-js__playground');
    const restartButtonEl = gameContainerEl.querySelector('.game-js__restart-control');
    const pauseButtonEl = gameContainerEl.querySelector('.game-js__pause-control');
    const startOverlayEl = gameContainerEl.querySelector('.game-c__start-overlay')
    const startOverlayHighScoreEl = startOverlayEl.querySelector('.game-js__high-score')
    const startControlButtonEls = startOverlayEl.querySelectorAll('.game-js__start-controls');
    const endScreenEl = gameContainerEl.querySelector('.game-js__end-screen');
    const endScreenScoreEl = endScreenEl.querySelector('.game-js__current-score');
    const endScreenHighScoreEl = endScreenEl.querySelector('.game-js__high-score');
    const endScreenReplayControlEl = endScreenEl.querySelector('.game-js__replay-control');


    const _orientationChanged = () => {
      gameContainerEl.classList.remove('game-c--landscape')
      if (Math.abs(window.orientation) == 90) {
        gameContainerEl.classList.add('game-c--landscape')
      }
    }

    const restartGame = () => {
      newGame.resetGame();
      endScreenEl.classList.remove('game-c__end-screen--active');
      startOverlayEl.classList.add('game-c__start-overlay--active');
    }


    highScoreEl.textContent = newGame.highScore;
    startOverlayHighScoreEl.textContent = newGame.highScore;

    // Events
    Array.prototype.forEach.call(startControlButtonEls, button => {
      button.addEventListener('click', () => {
        const difficulty = button.dataset['difficulty'] || 'easy';
        newGame.handleStartControl(difficulty);
      })
    });


    window.addEventListener('orientationchange', _orientationChanged);
    _orientationChanged();



    pauseButtonEl.addEventListener('click', newGame.togglePause);

    restartButtonEl.addEventListener('click', restartGame);

    endScreenReplayControlEl.addEventListener('click', restartGame);

    document.addEventListener('game-update-telemetry', () => {
      timerEl.textContent = newGame.totalTime;
      currentScoreEl.textContent = newGame.score;
    });

    document.addEventListener('game-ended', () => {
      endScreenEl.classList.add('game-c__end-screen--active');

      endScreenScoreEl.innerText = newGame.score;
      highScoreEl.textContent = newGame.highScore;
      currentScoreEl.textContent = newGame.score;
      endScreenHighScoreEl.textContent = newGame.highScore;
      

      newGame.resetGame();

      setTimeout(() => {
        if (window.confirm('Game Over!!!')) {
          endScreenEl.classList.remove('game-c__end-screen--active');
          startOverlayEl.classList.add('game-c__start-overlay--active');
        }
      }, 0);
    });

    document.addEventListener('game-reset', () => {
      currentScoreEl.textContent = 0;
      timerEl.textContent = newGame.totalTime;
      pauseButtonEl.textContent = 'Pause';
      while(playGroundEl.lastChild) {
        playGroundEl.removeChild(playGroundEl.firstChild);
      }
    });

    document.addEventListener('tiles-prepared', e => {
      const size = e.detail.size;
      startOverlayEl.classList.remove('game-c__start-overlay--active');
      const fragement = document.createDocumentFragment();
      newGame.tiles.forEach(tile => fragement.appendChild(tile));

      playGroundEl.classList.remove('game-c__playground-3');
      playGroundEl.classList.remove('game-c__playground-4');
      playGroundEl.classList.remove('game-c__playground-6');
      playGroundEl.classList.add(`game-c__playground-${size}`);

      playGroundEl.appendChild(fragement);
    });

    document.addEventListener('game-paused', () => {
      if (newGame.gamePaused) {
        pauseButtonEl.textContent = 'Resume';
        gameContainerEl.classList.add('game-c--paused');
      } else {
        pauseButtonEl.textContent = 'Pause';
        gameContainerEl.classList.remove('game-c--paused');
      }
    })
    
  })();