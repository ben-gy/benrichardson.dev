// ============ DARK MODE TOGGLE ============
// Adds a sun/moon icon to the menu bar for toggling dark mode.
// Dark mode inverts the classic Mac aesthetic.

let darkMode = false;

export function toggleDarkMode() {
    darkMode = !darkMode;
    document.body.classList.toggle('dark-mode', darkMode);

    const icon = document.getElementById('darkmode-icon');
    if (icon) {
        icon.textContent = darkMode ? '\u263e' : '\u2600';
        icon.title = darkMode ? 'Light Mode' : 'Dark Mode';
    }

    // Persist preference
    localStorage.setItem('darkMode', darkMode ? '1' : '0');
}

export function initDarkMode() {
    // Inject dark mode styles
    const style = document.createElement('style');
    style.id = 'dark-mode-styles';
    style.textContent = `
        .menu-darkmode {
            padding: 4px 6px;
            cursor: pointer;
            display: flex;
            align-items: center;
            font-size: 16px;
            line-height: 1;
            image-rendering: pixelated;
        }

        body.dark-mode {
            background-color: #1a1a1a;
            filter: invert(1);
        }

        /* Un-invert images and icons so they look correct */
        body.dark-mode img,
        body.dark-mode .desktop-icon img,
        body.dark-mode .startup-icon,
        body.dark-mode .about-mac-icon,
        body.dark-mode .sad-mac-screen img,
        body.dark-mode #crt-overlay,
        body.dark-mode .about-mac-bar-fill {
            filter: invert(1);
        }

        /* Keep screensaver correct */
        body.dark-mode #screensaver {
            filter: invert(1);
        }
    `;
    document.head.appendChild(style);

    // Restore saved preference
    const saved = localStorage.getItem('darkMode');
    if (saved === '1') {
        darkMode = true;
        document.body.classList.add('dark-mode');
    }

    // Update icon to match state
    const icon = document.getElementById('darkmode-icon');
    if (icon) {
        icon.textContent = darkMode ? '\u263e' : '\u2600';
        icon.title = darkMode ? 'Light Mode' : 'Dark Mode';
    }
}
