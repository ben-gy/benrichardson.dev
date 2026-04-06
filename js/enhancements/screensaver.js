// ============ SCREENSAVER (Page Visibility API + Canvas) ============
// When the user switches tabs for 60+ seconds, a classic bouncing "hello"
// screensaver activates. On return: brief phosphor-decay green fade.

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

    // Phosphor decay overlay
    const decay = document.createElement('div');
    decay.id = 'phosphor-decay';
    decay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        z-index: 9991; display: none; pointer-events: none;
        background: #00ff00; opacity: 0; transition: opacity 0.8s ease-out;
    `;
    document.body.appendChild(decay);

    // Inject styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes phosphor-fade {
            0% { opacity: 0.3; }
            100% { opacity: 0; }
        }
        #phosphor-decay.active {
            display: block;
            animation: phosphor-fade 0.8s ease-out forwards;
        }
    `;
    document.head.appendChild(style);
}

function startScreensaver() {
    if (screensaverActive || !screensaverCanvas) return;
    screensaverActive = true;
    screensaverCanvas.style.display = 'block';

    const canvas = screensaverCanvas;
    const ctx = canvas.getContext('2d');

    // Size canvas to window
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Bouncing text state
    const text = 'hello';
    const fontSize = Math.max(48, Math.floor(canvas.width / 12));
    ctx.font = fontSize + 'px ChicagoFLF, ChiKareGo2, monospace';
    const textWidth = ctx.measureText(text).width;

    let x = Math.random() * (canvas.width - textWidth);
    let y = Math.random() * (canvas.height - fontSize) + fontSize;
    let dx = 1.5;
    let dy = 1;

    // Trail effect - array of previous positions with fading
    const trails = [];
    const MAX_TRAILS = 12;

    function animate() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw trail
        trails.push({ x, y });
        if (trails.length > MAX_TRAILS) trails.shift();

        trails.forEach((t, i) => {
            const alpha = (i / trails.length) * 0.4;
            ctx.fillStyle = `rgba(0, 255, 0, ${alpha})`;
            ctx.font = fontSize + 'px ChicagoFLF, ChiKareGo2, monospace';
            ctx.fillText(text, t.x, t.y);
        });

        // Draw main text
        ctx.fillStyle = '#00ff00';
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

    // Clear canvas fully first
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    animate();
}

function stopScreensaver() {
    if (!screensaverActive) return;
    screensaverActive = false;
    if (animFrame) cancelAnimationFrame(animFrame);

    screensaverCanvas.style.display = 'none';

    // Phosphor decay effect
    const decay = document.getElementById('phosphor-decay');
    if (decay) {
        decay.classList.add('active');
        setTimeout(() => decay.classList.remove('active'), 1000);
    }
}

export function initScreensaver() {
    createScreensaver();

    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // Start timer when tab becomes hidden
            screensaverTimeout = setTimeout(startScreensaver, IDLE_TIME);
        } else {
            // Cancel timer and stop screensaver when tab becomes visible
            if (screensaverTimeout) {
                clearTimeout(screensaverTimeout);
                screensaverTimeout = null;
            }
            stopScreensaver();
        }
    });

    // Also dismiss screensaver on any interaction
    ['click', 'keydown', 'mousemove', 'touchstart'].forEach(event => {
        document.addEventListener(event, function() {
            if (screensaverActive) stopScreensaver();
        }, { passive: true });
    });
}
