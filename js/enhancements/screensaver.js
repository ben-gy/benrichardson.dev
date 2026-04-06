// ============ SCREENSAVER (Page Visibility API + Canvas) ============
// Classic Mac-style bouncing "hello" screensaver in black and white.
// Activates after 60s tab-away, or manually via View > Screensaver.

let screensaverTimeout = null;
let screensaverCanvas = null;
let screensaverActive = false;
let animFrame = null;

const IDLE_TIME = 60000; // 60 seconds

function createScreensaver() {
    screensaverCanvas = document.createElement('canvas');
    screensaverCanvas.id = 'screensaver';
    screensaverCanvas.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        z-index: 9990; display: none; cursor: none; background: #000;
    `;
    document.body.appendChild(screensaverCanvas);
}

export function startScreensaver() {
    if (screensaverActive || !screensaverCanvas) return;
    screensaverActive = true;
    screensaverCanvas.style.display = 'block';

    const canvas = screensaverCanvas;
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const text = 'hello';
    const fontSize = Math.max(48, Math.floor(canvas.width / 12));
    ctx.font = fontSize + 'px ChicagoFLF, ChiKareGo2, monospace';
    const textWidth = ctx.measureText(text).width;

    let x = Math.random() * (canvas.width - textWidth);
    let y = Math.random() * (canvas.height - fontSize) + fontSize;
    let dx = 1.5;
    let dy = 1;

    function animate() {
        // Fade trail — black with slight transparency for ghosting
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw text in white (classic Mac style)
        ctx.fillStyle = '#ffffff';
        ctx.font = fontSize + 'px ChicagoFLF, ChiKareGo2, monospace';
        ctx.fillText(text, x, y);

        // Move
        x += dx;
        y += dy;

        // Bounce
        if (x <= 0 || x + textWidth >= canvas.width) dx = -dx;
        if (y - fontSize <= 0 || y >= canvas.height) dy = -dy;

        if (screensaverActive) {
            animFrame = requestAnimationFrame(animate);
        }
    }

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    animate();
}

function stopScreensaver() {
    if (!screensaverActive) return;
    screensaverActive = false;
    if (animFrame) cancelAnimationFrame(animFrame);
    screensaverCanvas.style.display = 'none';
}

export function initScreensaver() {
    createScreensaver();

    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            screensaverTimeout = setTimeout(startScreensaver, IDLE_TIME);
        } else {
            if (screensaverTimeout) {
                clearTimeout(screensaverTimeout);
                screensaverTimeout = null;
            }
            stopScreensaver();
        }
    });

    // Dismiss screensaver on any interaction
    ['click', 'keydown', 'mousemove', 'touchstart'].forEach(event => {
        document.addEventListener(event, function() {
            if (screensaverActive) stopScreensaver();
        }, { passive: true });
    });
}
