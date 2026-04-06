// ============ DARK MODE TOGGLE ============
// Sets CSS custom properties directly on documentElement to override system.css.

let darkMode = false;

// Inject dark mode styles that need to override system.css
const styleEl = document.createElement('style');
styleEl.textContent = `
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
    .dark-mode .menu-sound img,
    .dark-mode .apple-logo {
        filter: invert(1);
    }
    .dark-mode .about-mac-bar-fill {
        background: repeating-linear-gradient(90deg, #ccc 0px, #ccc 2px, #000 2px, #000 4px);
    }
    .dark-mode .about-mac-credits {
        color: #888;
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

export function toggleDarkMode() {
    darkMode = !darkMode;
    applyTheme(darkMode);

    const icon = document.getElementById('darkmode-icon');
    if (icon) {
        icon.textContent = darkMode ? '\u263e' : '\u2600';
        icon.title = darkMode ? 'Light Mode' : 'Dark Mode';
    }

    localStorage.setItem('darkMode', darkMode ? '1' : '0');
}

export function initDarkMode() {
    const saved = localStorage.getItem('darkMode');
    if (saved === '1') {
        darkMode = true;
        applyTheme(true);
    }

    const icon = document.getElementById('darkmode-icon');
    if (icon) {
        icon.textContent = darkMode ? '\u263e' : '\u2600';
        icon.title = darkMode ? 'Light Mode' : 'Dark Mode';
    }
}
