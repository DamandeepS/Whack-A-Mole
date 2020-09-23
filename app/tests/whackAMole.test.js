import test from 'ava';
import { pause } from 'browser-sync';
require('../scripts/whackAMole.js');


test.beforeEach(t => {
    window.localStorage.setItem('game-highscore', '25');
    const newGame = new window.WhackAMole();
    t.context = {
        newGame
    }
});

test('highscore is being read from localStorage', t => {
    t.is(t.context.newGame.highScore, 25);
})


function properTilesMacro(t, input, expected) {
    t.context.newGame.startGame(input);
    t.is(t.context.newGame.tiles.length, expected);
}

properTilesMacro.title = (providedTitle = ``, input, expected) => `${providedTitle} Having ${expected} number of tiles for ${input} level`.trim();

test(properTilesMacro, 'easy', 3*3);
test(properTilesMacro, 'medium', 4*4);
test(properTilesMacro, 'hard', 6*6);

test(`Random tile changes`, async t => {
    const newGame = t.context.newGame;
    newGame.startGame('easy');
    let iteration = 0;
    await new Promise((resolve, rejecet) => {
        let prevIndex;
        const timer = setInterval(() => {
            if (iteration < 5) {
                const currentIndex = newGame.tiles.indexOf(newGame._randomTile);

                if (typeof prevIndex !== 'undefined' && currentIndex !== prevIndex) {
                    t.pass();
                    resolve();
                }
                prevIndex = currentIndex;
                iteration++;
            } else {
                clearInterval(timer);
                t.fail();
                resolve();
            }
        }, 1000)
    });
});

test('Game is Pausing', async t => {
    const game = t.context.newGame;

    game.startGame('easy');
    
    await new Promise((resolve, reeject) => {
        game.togglePause(); //Pausing the game
        const timeAtPause = game.totalTime;
        setTimeout(() => {
            if (timeAtPause === game.totalTime) {
                t.pass();
            } else {
                t.fail();
            }
            resolve();
        }, 5000);
    });
});

test('Resets Stops the Game (Primes for startGame)', t => {
    const game = t.context.newGame;
    game.startGame('easy');
    game.resetGame();
    t.is(game.tiles.length, 0);
});

test('Reset game can be started again, resetting easy level and starting hard', t => {

    const game = t.context.newGame;
    game.startGame('easy');
    game.resetGame();
    game.startGame('hard');
    t.is(game.tiles.length, 6*6);
});