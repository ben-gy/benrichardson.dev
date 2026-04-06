// ============ NOTE PAD ============

import { registerWindow, toggleWindow } from '../window-manager.js';
import { closeAllDropdowns } from '../utils.js';

let notepadPages = ['', '', '', '', '', '', '', ''];
let currentNotePage = 0;

function saveCurrentNotePage() {
    notepadPages[currentNotePage] = document.getElementById('notepad-textarea').value;
    localStorage.setItem('notepadPages', JSON.stringify(notepadPages));
}

function loadNotepadFromStorage() {
    const saved = localStorage.getItem('notepadPages');
    if (saved) {
        notepadPages = JSON.parse(saved);
    }
}

function updateNotepadDisplay() {
    document.getElementById('notepad-textarea').value = notepadPages[currentNotePage];
    document.getElementById('notepad-page-num').textContent = currentNotePage + 1;
}

export function nextNotePage() {
    saveCurrentNotePage();
    currentNotePage = (currentNotePage + 1) % notepadPages.length;
    updateNotepadDisplay();
}

export function toggleNotePad() {
    closeAllDropdowns();
    toggleWindow('notepad-window');
}

export function initNotepad() {
    registerWindow('notepad-window', {
        x: 150, y: 120,
        onOpen: function() {
            loadNotepadFromStorage();
            updateNotepadDisplay();
        },
        onClose: function() {
            saveCurrentNotePage();
        }
    });

    // Auto-save on input
    document.getElementById('notepad-textarea').addEventListener('input', function() {
        notepadPages[currentNotePage] = this.value;
        localStorage.setItem('notepadPages', JSON.stringify(notepadPages));
    });
}
