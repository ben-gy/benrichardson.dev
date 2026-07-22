// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Ben Richardson — https://benrichardson.dev
// Additional terms under AGPL-3.0 section 7(b) apply; see ADDITIONAL-TERMS.md.
// ============ KEY CAPS ============

import { registerWindow, toggleWindow } from '../window-manager.js';

const rows = [
    ['`','1','2','3','4','5','6','7','8','9','0','-','='],
    ['Q','W','E','R','T','Y','U','I','O','P','[',']','\\'],
    ['A','S','D','F','G','H','J','K','L',';','\''],
    ['Z','X','C','V','B','N','M',',','.','/']
];

function init() {
    const grid = document.getElementById('keycaps-grid');
    grid.innerHTML = '';
    rows.forEach(function(row) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'keycaps-row';
        row.forEach(function(key) {
            const btn = document.createElement('button');
            btn.className = 'keycaps-key';
            btn.textContent = key;
            btn.addEventListener('click', function() { document.getElementById('keycaps-output').textContent += key; });
            rowDiv.appendChild(btn);
        });
        grid.appendChild(rowDiv);
    });
    const spaceRow = document.createElement('div');
    spaceRow.className = 'keycaps-row';
    const spaceBtn = document.createElement('button');
    spaceBtn.className = 'keycaps-key wide';
    spaceBtn.textContent = 'Space';
    spaceBtn.addEventListener('click', function() { document.getElementById('keycaps-output').textContent += ' '; });
    spaceRow.appendChild(spaceBtn);
    const clearBtn = document.createElement('button');
    clearBtn.className = 'keycaps-key';
    clearBtn.textContent = '\u232b';
    clearBtn.style.width = '40px';
    clearBtn.addEventListener('click', function() {
        const el = document.getElementById('keycaps-output');
        el.textContent = el.textContent.slice(0, -1);
    });
    spaceRow.appendChild(clearBtn);
    grid.appendChild(spaceRow);
}

export function toggleKeyCaps() { toggleWindow('keycaps-window'); }

export function initKeyCapsApp() {
    registerWindow('keycaps-window', {
        x: 100, y: 80,
        onOpen: function() { document.getElementById('keycaps-output').textContent = ''; init(); }
    });
}
