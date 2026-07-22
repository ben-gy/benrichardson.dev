// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Ben Richardson — https://benrichardson.dev
// Additional terms under AGPL-3.0 section 7(b) apply; see ADDITIONAL-TERMS.md.
// ============ 15-PUZZLE GAME ============

import { registerWindow, toggleWindow } from '../window-manager.js';
import { showModal } from '../utils.js';

let puzzleTiles = [];

function initPuzzle() {
    puzzleTiles = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];
    renderPuzzle();
}

function renderPuzzle() {
    const grid = document.getElementById('puzzle-grid');
    grid.innerHTML = '';
    puzzleTiles.forEach(function(tile, index) {
        const div = document.createElement('div');
        div.className = 'puzzle-tile' + (tile === 0 ? ' empty' : '');
        div.textContent = tile === 0 ? '' : tile;
        if (tile !== 0) {
            div.onclick = function() { moveTile(index); };
        }
        grid.appendChild(div);
    });
}

function moveTile(index) {
    const emptyIndex = puzzleTiles.indexOf(0);
    const validMoves = [index - 1, index + 1, index - 4, index + 4];

    if (validMoves.includes(emptyIndex)) {
        if ((index % 4 === 0 && emptyIndex === index - 1) ||
            (index % 4 === 3 && emptyIndex === index + 1)) {
            return;
        }
        puzzleTiles[emptyIndex] = puzzleTiles[index];
        puzzleTiles[index] = 0;
        renderPuzzle();
        checkPuzzleWin();
    }
}

export function shufflePuzzle() {
    for (let i = 0; i < 100; i++) {
        const emptyIndex = puzzleTiles.indexOf(0);
        const moves = [];
        if (emptyIndex >= 4) moves.push(emptyIndex - 4);
        if (emptyIndex < 12) moves.push(emptyIndex + 4);
        if (emptyIndex % 4 !== 0) moves.push(emptyIndex - 1);
        if (emptyIndex % 4 !== 3) moves.push(emptyIndex + 1);
        const randomMove = moves[Math.floor(Math.random() * moves.length)];
        puzzleTiles[emptyIndex] = puzzleTiles[randomMove];
        puzzleTiles[randomMove] = 0;
    }
    renderPuzzle();
}

function checkPuzzleWin() {
    const winning = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];
    if (puzzleTiles.every((tile, i) => tile === winning[i])) {
        setTimeout(function() {
            showModal('puzzle-win-modal');
        }, 300);
    }
}

export function togglePuzzle() {
    toggleWindow('puzzle-window');
}

export function initPuzzleApp() {
    registerWindow('puzzle-window', {
        x: 100, y: 80,
        onOpen: function() {
            if (puzzleTiles.length === 0) {
                initPuzzle();
                shufflePuzzle();
            }
        }
    });
}
