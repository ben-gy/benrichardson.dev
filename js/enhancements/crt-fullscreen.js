// ============ CRT FULLSCREEN MODE (Fullscreen API + CSS) ============
// Enter fullscreen to transform the browser into a 1984 Macintosh CRT monitor
// with scanlines, vignette, rounded corners, and beige casing.

let isFullscreen = false;
let crtOverlay = null;

function createCRTOverlay() {
    if (crtOverlay) return;

    crtOverlay = document.createElement('div');
    crtOverlay.id = 'crt-overlay';
    crtOverlay.innerHTML = `
        <div class="crt-scanlines"></div>
        <div class="crt-vignette"></div>
    `;
    document.body.appendChild(crtOverlay);

    // Inject CRT styles
    const style = document.createElement('style');
    style.id = 'crt-styles';
    style.textContent = `
        body.crt-mode {
            background: #c0b090;
            border: 24px solid #c0b090;
            border-radius: 16px;
            box-sizing: border-box;
            overflow: hidden;
        }

        body.crt-mode::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border-radius: 12px;
            pointer-events: none;
            z-index: 9998;
            box-shadow: inset 0 0 80px rgba(0,0,0,0.3);
        }

        #crt-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9997;
        }

        body.crt-mode #crt-overlay {
            display: block;
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

        /* CRT power-on flicker */
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

    if (isFullscreen) {
        createCRTOverlay();
        document.body.classList.add('crt-mode', 'crt-enter');
        setTimeout(() => document.body.classList.remove('crt-enter'), 500);
    } else {
        document.body.classList.remove('crt-mode', 'crt-enter');
    }
}

export function initCRTFullscreen() {
    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onFullscreenChange);
    createCRTOverlay();
}
