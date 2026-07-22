// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Ben Richardson — https://benrichardson.dev
// Additional terms under AGPL-3.0 section 7(b) apply; see ADDITIONAL-TERMS.md.
// ============ CRT EFFECT + FULLSCREEN MODE ============
// CRT scanlines and vignette are always active.
// Fullscreen mode just goes edge-to-edge (no browser chrome).

let isFullscreen = false;

function createCRTOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'crt-overlay';
    overlay.innerHTML = `
        <div class="crt-scanlines"></div>
        <div class="crt-vignette"></div>
    `;
    document.body.appendChild(overlay);

    const style = document.createElement('style');
    style.id = 'crt-styles';
    style.textContent = `
        /* CRT overlay — always visible */
        #crt-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9997;
        }

        .crt-scanlines {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: repeating-linear-gradient(
                0deg,
                transparent,
                transparent 1px,
                rgba(0, 0, 0, 0.03) 1px,
                rgba(0, 0, 0, 0.03) 2px
            );
            pointer-events: none;
        }

        .crt-vignette {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(
                ellipse at center,
                transparent 60%,
                rgba(0, 0, 0, 0.15) 100%
            );
            pointer-events: none;
        }

        /* CRT power-on flicker on page load */
        @keyframes crt-flicker {
            0% { opacity: 0; }
            10% { opacity: 1; }
            12% { opacity: 0.8; }
            15% { opacity: 1; }
            100% { opacity: 1; }
        }

        body.crt-enter {
            animation: crt-flicker 0.4s ease-out;
        }
    `;
    document.head.appendChild(style);
}

export function toggleFullscreen() {
    if (!document.fullscreenEnabled && !document.webkitFullscreenEnabled) return;

    if (!isFullscreen) {
        const el = document.documentElement;
        const request = el.requestFullscreen || el.webkitRequestFullscreen;
        if (request) request.call(el);
    } else {
        const exit = document.exitFullscreen || document.webkitExitFullscreen;
        if (exit) exit.call(document);
    }
}

function onFullscreenChange() {
    isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement);
}

export function initCRTFullscreen() {
    createCRTOverlay();

    // Flicker on load
    document.body.classList.add('crt-enter');
    setTimeout(() => document.body.classList.remove('crt-enter'), 500);

    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onFullscreenChange);
}
