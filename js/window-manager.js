// ============ WINDOW MANAGER ============

let maxZIndex = 10;

const windowConfigs = {};

export function bringToFront(windowEl) {
    maxZIndex++;
    windowEl.style.zIndex = maxZIndex;
}

export function centerWindow(windowEl) {
    const rect = windowEl.getBoundingClientRect();
    windowEl.style.margin = '0';
    windowEl.style.left = ((window.innerWidth - rect.width) / 2) + 'px';
    windowEl.style.top = (60 + (window.innerHeight - 60 - rect.height) / 3) + 'px';
}

export function checkMemory() {
    let count = 0;
    document.querySelectorAll('.window').forEach(function(w) {
        if (w.style.display !== 'none') count++;
    });

    if (count >= 5) {
        // Import dynamically to avoid circular deps
        const { showSadMac } = window._systemFns || {};
        if (showSadMac) showSadMac('0F0004', true);
        return false;
    }
    if (count === 4) {
        const { showAlert } = window._systemFns || {};
        if (showAlert) showAlert('Memory is getting low.\nClose some windows to continue.');
    }
    return true;
}

export function closeAllWindows() {
    const windowIds = Object.keys(windowConfigs);
    windowIds.forEach(function(id) {
        const win = document.getElementById(id);
        if (win) {
            win.style.display = 'none';
            win.style.width = '';
            win.style.height = '';
        }
    });
}

// Register a window with config: { x, y, onOpen, onClose }
export function registerWindow(windowId, config) {
    windowConfigs[windowId] = config;
}

// Generic toggle for any registered window
export function toggleWindow(windowId) {
    const config = windowConfigs[windowId];
    if (!config) {
        console.warn('Window not registered:', windowId);
        return;
    }

    const win = document.getElementById(windowId);
    if (!win) return;

    if (win.style.display === 'none') {
        if (!checkMemory()) return;
        win.style.display = 'block';
        win.style.left = (config.x || 100) + 'px';
        win.style.top = (config.y || 80) + 'px';
        bringToFront(win);
        if (config.onOpen) config.onOpen(win);
    } else {
        if (config.onClose) config.onClose(win);
        win.style.display = 'none';
    }
}

export function cleanUp() {
    const windowIds = Object.keys(windowConfigs);
    let offset = 0;
    windowIds.forEach(function(id) {
        const win = document.getElementById(id);
        if (win && win.style.display !== 'none') {
            win.style.transition = 'all 0.3s ease';
            centerWindow(win);
            win.style.top = (parseInt(win.style.top) + offset) + 'px';
            offset += 30;
            setTimeout(function() {
                win.style.transition = '';
            }, 300);
        }
    });

    // Reset desktop icons to original positions
    const iconPositions = {
        'hd-icon': { right: '10px', top: '10px', left: '', bottom: '' },
        'email-icon': { left: '10px', top: '10px', right: '', bottom: '' },
        'internet-icon': { left: '10px', top: '90px', right: '', bottom: '' },
        'tools-icon': { left: '10px', top: '170px', right: '', bottom: '' },
        'sites-icon': { left: '10px', top: '250px', right: '', bottom: '' },
        'linkedin-icon': { left: '10px', top: '330px', right: '', bottom: '' },
        'github-icon': { left: '10px', top: '410px', right: '', bottom: '' },
        'trash-icon': { right: '10px', bottom: '10px', left: '', top: '' }
    };
    Object.keys(iconPositions).forEach(function(id) {
        const icon = document.getElementById(id);
        if (icon) {
            icon.style.transition = 'all 0.3s ease';
            const pos = iconPositions[id];
            icon.style.left = pos.left;
            icon.style.right = pos.right;
            icon.style.top = pos.top;
            icon.style.bottom = pos.bottom;
            setTimeout(function() {
                icon.style.transition = '';
            }, 300);
        }
    });
}

export function makeDraggable(windowEl, handleEl) {
    let isDragging = false;
    let startX, startY, initialX, initialY;

    function startDrag(clientX, clientY) {
        isDragging = true;
        startX = clientX;
        startY = clientY;
        const rect = windowEl.getBoundingClientRect();
        initialX = rect.left;
        initialY = rect.top;
        windowEl.style.margin = '0';
        windowEl.style.transform = 'none';
        windowEl.style.left = initialX + 'px';
        windowEl.style.top = initialY + 'px';
    }

    function moveDrag(clientX, clientY) {
        if (!isDragging) return;
        const dx = clientX - startX;
        const dy = clientY - startY;
        windowEl.style.left = (initialX + dx) + 'px';
        windowEl.style.top = (initialY + dy) + 'px';
    }

    function endDrag() {
        isDragging = false;
    }

    windowEl.addEventListener('mousedown', function() {
        bringToFront(windowEl);
    });

    handleEl.addEventListener('mousedown', function(e) {
        if (e.target.classList.contains('close') || e.target.classList.contains('resize')) return;
        startDrag(e.clientX, e.clientY);
    });

    document.addEventListener('mousemove', function(e) {
        moveDrag(e.clientX, e.clientY);
    });

    document.addEventListener('mouseup', endDrag);

    handleEl.addEventListener('touchstart', function(e) {
        if (e.target.classList.contains('close') || e.target.classList.contains('resize')) return;
        const touch = e.touches[0];
        startDrag(touch.clientX, touch.clientY);
    }, { passive: true });

    document.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        e.preventDefault();
        const touch = e.touches[0];
        moveDrag(touch.clientX, touch.clientY);
    }, { passive: false });

    document.addEventListener('touchend', endDrag);

    handleEl.addEventListener('dblclick', function(e) {
        if (e.target.classList.contains('close') || e.target.classList.contains('resize')) return;
        windowEl.classList.toggle('collapsed');
    });
}

// Initialize dragging for all registered windows
export function initDraggable() {
    const pairs = [
        ['main-window', 'title-bar'],
        ['calculator-window', 'calc-title-bar'],
        ['puzzle-window', 'puzzle-title-bar'],
        ['notepad-window', 'notepad-title-bar'],
        ['email-window', 'email-title-bar'],
        ['search-window', 'search-title-bar'],
        ['licence-window', 'licence-title-bar'],
        ['trash-window', 'trash-title-bar'],
        ['lander-window', 'lander-title-bar'],
        ['startrek-window', 'startrek-title-bar'],
        ['blackjack-window', 'blackjack-title-bar'],
        ['mastermind-window', 'mastermind-title-bar'],
        ['hamurabi-window', 'hamurabi-title-bar'],
        ['macpaint-window', 'macpaint-title-bar'],
        ['eliza-window', 'eliza-title-bar'],
        ['alarmclock-window', 'alarmclock-title-bar'],
        ['scrapbook-window', 'scrapbook-title-bar'],
        ['keycaps-window', 'keycaps-title-bar'],
        ['oregon-window', 'oregon-title-bar'],
        ['breakout-window', 'breakout-title-bar'],
        ['snake-window', 'snake-title-bar'],
        ['hangman-window', 'hangman-title-bar'],
        ['adventure-window', 'adventure-title-bar'],
        ['minesweeper-window', 'minesweeper-title-bar'],
        ['reversi-window', 'reversi-title-bar'],
        ['munchers-window', 'munchers-title-bar'],
    ];
    pairs.forEach(function([winId, barId]) {
        const win = document.getElementById(winId);
        const bar = document.getElementById(barId);
        if (win && bar) makeDraggable(win, bar);
    });
}
