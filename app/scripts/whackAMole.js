
class WhackAMole {
    constructor() {
        this.highScore = localStorage.getItem('game-highscore') ? parseInt(localStorage.getItem('game-highscore')) : 0;
        this.gamePaused = false;

        // Events
        document.addEventListener('game__tile-clicked', e => {
            const selectedTile = e.detail;
            if (this.selectionEnabled && this._randomTile === selectedTile) {
                this.score++;
            } else if (this.selectionEnabled) {
                this.score--;
            }
            document.dispatchEvent(new CustomEvent('game-update-telemetry'));
            this.selectionEnabled = false; // Disabled till next Randomization
        });

    }

    startGame = (difficulty) => {
        this._initGrid(difficulty);
        // initialize the game randomization till 120 seconnds
        this.interval = window.setInterval(() => {
            if (this.gamePaused) {
                this.selectionEnabled = false;
                return;
            }
            if (this.totalTime > 0) {
                this._randomizeHighlightedTile();
                document.dispatchEvent(new CustomEvent('game-update-telemetry'));
                this.selectionEnabled = true;
            } else {
                window.clearInterval(this.interval);
                this.selectionEnabled = false;
                this.gameEnded();
            }
            this.totalTime--;
        }, 1000);
    };

    togglePause = () => {
        this.gamePaused = !this.gamePaused;
        document.dispatchEvent(new CustomEvent('game-paused'));
        if (this.gamePaused) {
            this.selectionPrevState = this.selectionEnabled;
            this.selectionEnabled = false;
        } else {
            this.selectionEnabled = this.selectionPrevState;
        }
    };

    _initGrid = (difficulty) => {
        this.resetGame();
        let gridSize;
        switch (difficulty) {
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
    };

    _randomizeHighlightedTile = () => {
        const randomIndex = Math.max(0, Math.min(this.tiles.length - 1, Math.round(Math.random() * this.tiles.length - 1)));
        this._randomTile = this.tiles[randomIndex];
        this.tiles.forEach(tile => {
            tile.classList.remove('game-c__game-tile--highlighted');
            tile.classList.remove('game-c__game-tile--incorrect');
            if (this._randomTile === tile) {
                setTimeout(() => tile.classList.add('game-c__game-tile--highlighted'), 50);
            }
        });
    };


    _drawGrid = size => {
        const totalTiles = size * size;
        while (this.tiles.length < totalTiles) {
            const tile = document.createElement('div');
            tile.classList.add('game-c__game-tile');
            tile.addEventListener('click', e => {
                e.preventDefault();
                e.stopPropagation();
                document.dispatchEvent(new CustomEvent('game__tile-clicked', {
                    detail: tile,
                }));
            });

            tile.addEventListener('keydown', e => {
                if (e.code == 'Enter' || e.code == 'Space') {
                    document.dispatchEvent(new CustomEvent('game__tile-clicked', {
                        detail: tile,
                    }));
                }
            });
            tile.setAttribute('role', 'button');
            tile.setAttribute('tabindex', '0');
            this.tiles.push(tile);
        }

        document.dispatchEvent(new CustomEvent('tiles-prepared', {
            detail: {
                size,
            }
        }));
    };

    gameEnded = () => {
        if (this.score > this.highScore) {
            this.highScore = this.score;
            window.localStorage.setItem('game-highscore', `${this.score}`);
        }

        document.dispatchEvent(new CustomEvent('game-ended'));

    };

    resetGame = () => {
        this.score = 0;
        this.tiles = [];
        this.gamePaused = false;
        this.totalTime = 20;
        this.selectionEnabled = true;
        this.selectionPrevState = true;
        window.clearInterval(this.interval);
        this.selectionEnabled = false;
        document.dispatchEvent(new CustomEvent('game-reset'));
    };

}

window.WhackAMole = WhackAMole;