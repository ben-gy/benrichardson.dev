// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Ben Richardson — https://benrichardson.dev
// Additional terms under AGPL-3.0 section 7(b) apply; see ADDITIONAL-TERMS.md.
// ============ DARK MODE TOGGLE ============
// Sets CSS custom properties directly on documentElement to override system.css.

let darkMode = false;

// Inject all dark mode styles via JS to avoid CSS caching issues
const styleEl = document.createElement('style');
styleEl.textContent = `
    /* Base dark mode toggle icon */
    .menu-darkmode {
        padding: 4px 8px;
        cursor: pointer;
        display: flex;
        align-items: center;
        font-size: 14px;
        line-height: 1;
    }
    /* Dark mode theme */
    .dark-mode body {
        background: linear-gradient(90deg, #000 21px, transparent 1%) center,
                    linear-gradient(#000 21px, transparent 1%) center, #222;
        background-size: 22px 22px;
        background-attachment: fixed;
        color: #ccc;
    }
    .dark-mode .window-pane,
    .dark-mode .window-pane p,
    .dark-mode .window-pane strong,
    .dark-mode .title-bar .title,
    .dark-mode .modal-contents,
    .dark-mode .modal-contents p,
    .dark-mode .alert-contents,
    .dark-mode .alert-text {
        color: #ccc !important;
    }
    .dark-mode .window-pane a {
        color: #999 !important;
    }
    .dark-mode .desktop-icon img {
        filter: invert(1);
    }
    .dark-mode .desktop-icon span {
        color: #ccc;
    }
    .dark-mode .desktop-icon:hover {
        background: rgba(255,255,255,0.1);
    }
    .dark-mode .desktop-icon.selected {
        background: #ccc;
        color: #000;
    }
    .dark-mode .desktop-icon.selected img {
        filter: none;
    }
    .dark-mode .trash-item img {
        filter: invert(1);
    }
    .dark-mode .trash-item span,
    .dark-mode .trash-status {
        color: #ccc;
    }
    .dark-mode .trash-item:hover {
        background: rgba(255,255,255,0.1);
    }
    .dark-mode .menu-sound img,
    .dark-mode .menu-darkmode img,
    .dark-mode .apple-logo {
        filter: invert(1);
    }
    .dark-mode .about-mac-bar-fill {
        background: repeating-linear-gradient(90deg, #ccc 0px, #ccc 2px, #000 2px, #000 4px);
    }
    .dark-mode .about-mac-credits {
        color: #888;
    }

    /* Form inputs and textareas */
    .dark-mode input,
    .dark-mode textarea,
    .dark-mode .calc-display,
    .dark-mode .notepad-textarea {
        background: #222 !important;
        color: #ccc !important;
        border-color: #555 !important;
    }
    .dark-mode .email-window input[readonly] {
        background: #333 !important;
    }

    /* Modal dialogs and alerts */
    .dark-mode .modal-dialog,
    .dark-mode .alert-box {
        background: #111 !important;
        color: #ccc !important;
    }
    .dark-mode .inner-border,
    .dark-mode .outer-border {
        border-color: #555 !important;
    }
    .dark-mode .about-mac-contents {
        color: #ccc;
    }
    .dark-mode .about-mac-header {
        border-bottom-color: #555;
    }
    .dark-mode .about-mac-icon {
        filter: invert(1);
    }
    .dark-mode .about-mac-divider {
        border-top-color: #555;
    }
    .dark-mode .about-mac-bar {
        border-color: #555;
        background: #222;
    }
    .dark-mode .about-mac-row span {
        color: #ccc;
    }
    .dark-mode .about-mac-credits a {
        color: #888 !important;
    }

    /* Puzzle tiles */
    .dark-mode .puzzle-grid {
        background: #555;
    }
    .dark-mode .puzzle-tile {
        background: #222 !important;
        color: #ccc !important;
        border-color: #555 !important;
    }
    .dark-mode .puzzle-tile:hover {
        background: #333 !important;
    }
    .dark-mode .puzzle-tile.empty {
        background: #111 !important;
    }

    /* Game outputs */
    .dark-mode .lander-output,
    .dark-mode .startrek-output,
    .dark-mode .blackjack-output,
    .dark-mode .mastermind-output,
    .dark-mode .hamurabi-output {
        background: #111 !important;
        color: #ccc !important;
        border-color: #555 !important;
    }

    /* Scrollbar in dark mode */
    .dark-mode .credits-container {
        border-color: #555;
    }

    /* Page number text */
    .dark-mode .notepad-page-num {
        color: #ccc;
    }

    /* Menu dropdowns */
    .dark-mode ul[role="menu"] li.divider {
        border-color: #555;
    }
`;
document.head.appendChild(styleEl);

const darkVars = {
    '--sys-color-white': '#000',
    '--sys-color-black': '#ccc',
    '--sys-color-grey': '#444',
    '--sys-color-darkgrey': '#333',
    '--primary': '#000',
    '--secondary': '#ccc',
    '--tertiary': '#444',
    '--disabled': '#333',
};

const lightVars = {
    '--sys-color-white': '#FFFFFF',
    '--sys-color-black': '#000000',
    '--sys-color-grey': '#A5A5A5',
    '--sys-color-darkgrey': '#B6B7B8',
    '--primary': '',
    '--secondary': '',
    '--tertiary': '',
    '--disabled': '',
};

function applyTheme(isDark) {
    const vars = isDark ? darkVars : lightVars;
    const el = document.documentElement;
    for (const [key, value] of Object.entries(vars)) {
        if (value) {
            el.style.setProperty(key, value);
        } else {
            el.style.removeProperty(key);
        }
    }
    el.classList.toggle('dark-mode', isDark);
}

function updateToggleIcon() {
    const icon = document.getElementById('darkmode-icon');
    if (icon) {
        icon.src = darkMode ? 'icon/moon.svg' : 'icon/sun.svg';
        icon.title = darkMode ? 'Light Mode' : 'Dark Mode';
    }
}

export function toggleDarkMode() {
    darkMode = !darkMode;
    applyTheme(darkMode);
    updateToggleIcon();
    localStorage.setItem('darkMode', darkMode ? '1' : '0');
}

export function initDarkMode() {
    const saved = localStorage.getItem('darkMode');
    if (saved === '1') {
        darkMode = true;
        applyTheme(true);
    }
    updateToggleIcon();
}
