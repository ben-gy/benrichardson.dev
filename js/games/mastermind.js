// ============ MASTERMIND GAME ============

import { registerWindow, toggleWindow } from '../window-manager.js';

let mm = null;

function initMastermind() {
    mm = {
        secret: '',
        guesses: [],
        gameOver: false,
        won: false,
        gamesPlayed: 0,
        gamesWon: 0,
        totalGuesses: 0
    };
    mm.secret = '';
    for (let i = 0; i < 5; i++) {
        mm.secret += Math.floor(Math.random() * 8).toString();
    }
    mm.guesses = [];
    mm.gameOver = false;
    mm.won = false;
}

function mmUpdateDisplay(message) {
    let out = '      MASTERMIND\n';
    out += '  ====================\n';
    out += '  GUESS A 5-DIGIT CODE\n';
    out += '  USING DIGITS 0-7\n\n';
    out += '  + = RIGHT PLACE\n';
    out += '  - = WRONG PLACE\n\n';

    if (mm.guesses.length > 0) {
        out += '  # | GUESS | RESULT\n';
        out += '  --+-------+-------\n';
        for (let i = 0; i < mm.guesses.length; i++) {
            const g = mm.guesses[i];
            const num = (i + 1).toString().padStart(2, '0');
            out += '  ' + num + '| ' + g.guess + ' | ' + g.result + '\n';
        }
        out += '\n';
    }

    if (message) {
        out += '  ' + message + '\n';
    }

    if (mm.gameOver) {
        out += '\n  [OK] FOR NEW GAME';
    }

    if (mm.gamesPlayed > 0) {
        const avg = (mm.totalGuesses / mm.gamesWon).toFixed(1);
        out += '\n\n  WON: ' + mm.gamesWon + '/' + mm.gamesPlayed;
        if (mm.gamesWon > 0) out += ' AVG: ' + avg;
    }

    document.getElementById('mastermind-output').textContent = out;
}

export function mmGuess() {
    if (!mm) initMastermind();

    if (mm.gameOver) {
        initMastermind();
        mmUpdateDisplay();
        document.getElementById('mastermind-input').value = '';
        document.getElementById('mastermind-input').focus();
        return;
    }

    const input = document.getElementById('mastermind-input').value.trim();
    document.getElementById('mastermind-input').value = '';

    if (input.length !== 5 || !/^[0-7]+$/.test(input)) {
        mmUpdateDisplay('USE 5 DIGITS (0-7 ONLY)');
        document.getElementById('mastermind-input').focus();
        return;
    }

    let exact = 0;
    let close = 0;
    const secretArr = mm.secret.split('');
    const guessArr = input.split('');
    const secretUsed = [false, false, false, false, false];
    const guessUsed = [false, false, false, false, false];

    for (let i = 0; i < 5; i++) {
        if (guessArr[i] === secretArr[i]) {
            exact++;
            secretUsed[i] = true;
            guessUsed[i] = true;
        }
    }

    for (let i = 0; i < 5; i++) {
        if (guessUsed[i]) continue;
        for (let j = 0; j < 5; j++) {
            if (secretUsed[j]) continue;
            if (guessArr[i] === secretArr[j]) {
                close++;
                secretUsed[j] = true;
                break;
            }
        }
    }

    let result = '+'.repeat(exact) + '-'.repeat(close);
    if (result === '') result = '(none)';

    mm.guesses.push({ guess: input, result: result, exact: exact, close: close });

    if (exact === 5) {
        mm.gameOver = true;
        mm.won = true;
        mm.gamesPlayed++;
        mm.gamesWon++;
        mm.totalGuesses += mm.guesses.length;
        mmUpdateDisplay('*** YOU WIN! ***');
    } else if (mm.guesses.length >= 10) {
        mm.gameOver = true;
        mm.gamesPlayed++;
        mmUpdateDisplay('GAME OVER! Code: ' + mm.secret);
    } else {
        mmUpdateDisplay();
        document.getElementById('mastermind-input').focus();
    }
}

export function toggleMastermind() {
    toggleWindow('mastermind-window');
}

export function initMastermindApp() {
    registerWindow('mastermind-window', {
        x: 100, y: 80,
        onOpen: function() {
            initMastermind();
            mmUpdateDisplay();
            document.getElementById('mastermind-input').value = '';
            document.getElementById('mastermind-input').focus();
        }
    });

    document.getElementById('mastermind-input').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            mmGuess();
        }
    });
}
