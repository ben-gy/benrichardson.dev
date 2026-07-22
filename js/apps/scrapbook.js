// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Ben Richardson — https://benrichardson.dev
// Additional terms under AGPL-3.0 section 7(b) apply; see ADDITIONAL-TERMS.md.
// ============ SCRAPBOOK ============

import { registerWindow, toggleWindow } from '../window-manager.js';

const sb = { pages: ['Welcome to Scrapbook!\n\nPaste text here to save clippings.'], currentPage: 0 };

function render() {
    document.getElementById('scrapbook-content').textContent = sb.pages[sb.currentPage] || '';
    document.getElementById('scrapbook-page').textContent = (sb.currentPage + 1) + ' of ' + sb.pages.length;
}

export function scrapbookPrev() { if (sb.currentPage > 0) { sb.currentPage--; render(); } }
export function scrapbookNext() { if (sb.currentPage < sb.pages.length - 1) { sb.currentPage++; render(); } }

export function scrapbookAdd() {
    navigator.clipboard.readText().then(function(text) {
        if (text) { sb.pages.push(text); sb.currentPage = sb.pages.length - 1; render(); }
        else { const { showAlert } = window._systemFns || {}; if (showAlert) showAlert('Clipboard is empty.'); }
    }).catch(function() {
        sb.pages.push('(New page)'); sb.currentPage = sb.pages.length - 1; render();
    });
}

export function scrapbookCopy() {
    navigator.clipboard.writeText(sb.pages[sb.currentPage] || '').then(function() {
        const { showAlert } = window._systemFns || {};
        if (showAlert) showAlert('Copied to clipboard!');
    });
}

export function scrapbookClear() { sb.pages[sb.currentPage] = ''; render(); }

export function toggleScrapbook() { toggleWindow('scrapbook-window'); }

export function initScrapbookApp() {
    registerWindow('scrapbook-window', {
        x: 130, y: 90,
        onOpen: function() { render(); }
    });
}
