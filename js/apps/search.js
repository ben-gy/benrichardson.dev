// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Ben Richardson — https://benrichardson.dev
// Additional terms under AGPL-3.0 section 7(b) apply; see ADDITIONAL-TERMS.md.
// ============ INTERNET SEARCH ============

import { registerWindow, toggleWindow } from '../window-manager.js';
import { closeAllDropdowns } from '../utils.js';
import { playSound, stopSound } from '../sound-manager.js';

export function searchGoogle() {
    const query = document.getElementById('search-input').value;
    if (query.trim()) {
        window.open('https://www.google.com/search?q=' + encodeURIComponent(query), '_blank');
        toggleSearch();
    }
}

export function toggleSearch() {
    closeAllDropdowns();
    toggleWindow('search-window');
}

export function initSearch() {
    registerWindow('search-window', {
        x: 100, y: 130,
        onOpen: function() {
            playSound('dialup');
            document.getElementById('search-input').value = '';
            document.getElementById('search-input').focus();
        },
        onClose: function() {
            stopSound('dialup');
        }
    });

    document.getElementById('search-input').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            searchGoogle();
        }
    });
}
