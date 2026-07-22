// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Ben Richardson — https://benrichardson.dev
// Additional terms under AGPL-3.0 section 7(b) apply; see ADDITIONAL-TERMS.md.
// ============ UTILITY FUNCTIONS ============

import { playSound } from './sound-manager.js';
import { bringToFront } from './window-manager.js';

export function closeAllDropdowns() {
    if (document.activeElement) {
        document.activeElement.blur();
    }
    document.querySelectorAll('ul[role="menu-bar"] > [role="menu-item"]').forEach(function(item) {
        item.classList.remove('menu-open');
        item.blur();
    });
    document.body.focus();
}

// ============ MODAL FUNCTIONS ============

export function showModal(id) {
    document.getElementById(id).classList.add('visible');
}

export function hideModal(id) {
    document.getElementById(id).classList.remove('visible');
}

export function showAlert(message) {
    playSound('beep');
    document.getElementById('alert-text').textContent = message;
    showModal('alert-modal');
}

export function showAboutMac(e) {
    e.preventDefault();
    e.stopPropagation();
    showModal('about-mac-modal');
}

// ============ FIND ============

let lastFindQuery = '';
let findHighlights = [];

export function showFindDialog() {
    showModal('find-modal');
    document.getElementById('find-input').focus();
}

export function doFind() {
    const query = document.getElementById('find-input').value.trim();
    if (!query) {
        hideModal('find-modal');
        return;
    }

    clearFindHighlights();

    const windows = document.querySelectorAll('.window');
    let foundCount = 0;

    windows.forEach(function(win) {
        if (win.style.display === 'none') return;

        const pane = win.querySelector('.window-pane');
        if (!pane) return;

        const walker = document.createTreeWalker(
            pane,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        const textNodes = [];
        while (walker.nextNode()) {
            textNodes.push(walker.currentNode);
        }

        textNodes.forEach(function(node) {
            const text = node.nodeValue;
            const lowerText = text.toLowerCase();
            const lowerQuery = query.toLowerCase();
            let index = lowerText.indexOf(lowerQuery);

            if (index !== -1) {
                const span = document.createElement('span');
                span.className = 'find-highlight';
                span.style.cssText = 'background: black; color: white;';

                const before = text.substring(0, index);
                const match = text.substring(index, index + query.length);
                const after = text.substring(index + query.length);

                const parent = node.parentNode;
                const beforeNode = document.createTextNode(before);
                span.textContent = match;
                const afterNode = document.createTextNode(after);

                parent.insertBefore(beforeNode, node);
                parent.insertBefore(span, node);
                parent.insertBefore(afterNode, node);
                parent.removeChild(node);

                findHighlights.push(span);
                foundCount++;

                if (foundCount === 1) {
                    span.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    bringToFront(win);
                }
            }
        });
    });

    lastFindQuery = query;
    hideModal('find-modal');

    if (foundCount === 0) {
        showAlert('"' + query + '" not found.');
    } else {
        showAlert('Found ' + foundCount + ' match' + (foundCount > 1 ? 'es' : '') + '.');
    }
}

export function clearFindHighlights() {
    findHighlights.forEach(function(span) {
        if (span.parentNode) {
            const text = span.textContent;
            const textNode = document.createTextNode(text);
            span.parentNode.replaceChild(textNode, span);
        }
    });
    findHighlights = [];
}

// ============ ZOOM FUNCTIONS ============

let currentZoom = 1;

export function zoomIn() {
    currentZoom = Math.min(currentZoom + 0.1, 2);
    applyZoom();
}

export function zoomOut() {
    currentZoom = Math.max(currentZoom - 0.1, 0.5);
    applyZoom();
}

function applyZoom() {
    document.querySelectorAll('.window').forEach(function(w) {
        w.style.transform = 'scale(' + currentZoom + ')';
    });
}
