// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Ben Richardson — https://benrichardson.dev
// Additional terms under AGPL-3.0 section 7(b) apply; see ADDITIONAL-TERMS.md.
// ============ LUNAR LANDER GAME ============

import { registerWindow, toggleWindow } from '../window-manager.js';

let landerState = null;

function initLander() {
    landerState = {
        altitude: 500,
        velocity: 50,
        fuel: 200,
        gameOver: false,
        message: ''
    };
}

function updateLanderDisplay() {
    const output = document.getElementById('lander-output');
    let text = 'LUNAR LANDER\n';
    text += '====================\n\n';
    text += 'ALTITUDE: ' + landerState.altitude.toFixed(1) + ' MI\n';
    text += 'VELOCITY: ' + landerState.velocity.toFixed(1) + ' MI/S\n';
    text += 'FUEL:     ' + landerState.fuel.toFixed(0) + '\n\n';

    if (landerState.message) {
        text += landerState.message + '\n';
    }

    if (!landerState.gameOver) {
        text += 'BURN RATE? (0-30)';
    } else {
        text += '\n[OK TO PLAY AGAIN]';
    }

    output.textContent = text;
}

export function landerBurn() {
    if (landerState.gameOver) {
        initLander();
        updateLanderDisplay();
        document.getElementById('lander-input').value = '';
        return;
    }

    let burn = parseInt(document.getElementById('lander-input').value) || 0;
    burn = Math.max(0, Math.min(30, burn));

    if (burn > landerState.fuel) {
        burn = landerState.fuel;
    }

    const gravity = 1.6;
    const thrust = burn * 0.1;
    landerState.velocity += gravity - thrust;
    landerState.altitude -= landerState.velocity;
    landerState.fuel -= burn;

    if (landerState.velocity < 0) landerState.velocity = 0;

    if (landerState.altitude <= 0) {
        landerState.altitude = 0;
        if (landerState.velocity < 2) {
            landerState.message = '*** SAFE LANDING! ***\nFUEL LEFT: ' + landerState.fuel.toFixed(0);
        } else {
            landerState.message = '*** CRASH! ***\nTOO FAST: ' + landerState.velocity.toFixed(1);
        }
        landerState.gameOver = true;
    } else if (landerState.fuel <= 0) {
        landerState.message = 'OUT OF FUEL!';
    } else {
        landerState.message = '';
    }

    updateLanderDisplay();
    document.getElementById('lander-input').value = '';
    document.getElementById('lander-input').focus();
}

export function toggleLander() {
    toggleWindow('lander-window');
}

export function initLanderApp() {
    registerWindow('lander-window', {
        x: 120, y: 80,
        onOpen: function() {
            initLander();
            updateLanderDisplay();
            document.getElementById('lander-input').value = '';
            document.getElementById('lander-input').focus();
        }
    });

    document.getElementById('lander-input').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            landerBurn();
        }
    });
}
