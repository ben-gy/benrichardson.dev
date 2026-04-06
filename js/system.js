// ============ SYSTEM (Startup, Shutdown, Sad Mac, Easter Eggs, Licence) ============

import { playSound } from './sound-manager.js';
import { registerWindow, toggleWindow, bringToFront, centerWindow } from './window-manager.js';
import { showModal, hideModal, showAlert } from './utils.js';

// ============ SAD MAC ============

let sadMacIsMemoryError = false;

export function showSadMac(errorCode, isMemoryError) {
    playSound('death');
    sadMacIsMemoryError = isMemoryError || false;
    document.getElementById('sad-mac-error').textContent = 'Error Code: ' + (errorCode || '0F0004');
    document.getElementById('sad-mac-screen').classList.add('visible');
}

export function hideSadMac() {
    if (sadMacIsMemoryError) {
        location.reload();
    } else {
        document.getElementById('sad-mac-screen').classList.remove('visible');
    }
}

// ============ TRASH ============

let trashHasItems = false;
let trashedIcons = [];

export function setTrashFull(isFull) {
    trashHasItems = isFull;
    const trashImg = document.getElementById('trash-img');
    if (isFull) {
        trashImg.src = 'icon/Trash full.png';
        document.getElementById('trash-icon').classList.add('has-items');
    } else {
        trashImg.src = 'icon/Trash empty.png';
        document.getElementById('trash-icon').classList.remove('has-items');
    }
}

export function addToTrash(iconId) {
    if (!trashedIcons.includes(iconId)) {
        trashedIcons.push(iconId);
    }
    setTrashFull(true);
}

export function emptyTrash() {
    if (trashHasItems) {
        const iconPositions = {
            'hd-icon': { right: '10px', top: '10px', left: '', bottom: '' },
            'email-icon': { left: '10px', top: '10px', right: '', bottom: '' },
            'internet-icon': { left: '10px', top: '90px', right: '', bottom: '' }
        };
        trashedIcons.forEach(function(iconId) {
            const icon = document.getElementById(iconId);
            if (icon && iconPositions[iconId]) {
                icon.style.display = '';
                icon.style.transition = 'all 0.3s ease';
                Object.keys(iconPositions[iconId]).forEach(function(key) {
                    icon.style[key] = iconPositions[iconId][key];
                });
                setTimeout(function() {
                    icon.style.transition = '';
                }, 300);
            }
        });
        if (trashedIcons.includes('hd-icon')) {
            showMainWindow();
        }
        trashedIcons = [];
        setTrashFull(false);
    } else {
        showAlert('The Trash is already empty.');
    }
}

// ============ MAIN WINDOW ============

export function closeMainWindow() {
    const win = document.getElementById('main-window');
    win.style.display = 'none';
}

export function showMainWindow() {
    const win = document.getElementById('main-window');
    win.style.display = 'block';
    win.classList.remove('collapsed');
    centerWindow(win);
}

export function showAboutBen(e) {
    e.preventDefault();
    showMainWindow();
}

// ============ LICENCE / STOLEN FROM APPLE ============

export function showLicence() {
    toggleLicence();
}

export function toggleLicence() {
    toggleWindow('licence-window');
}

export function submitLicence() {
    const serial = document.getElementById('licence-input').value;
    toggleLicence();
    if (serial === '4188A4' || serial === '40E118') {
        showAlert('Licence verified.\nThank you for your purchase!');
    } else {
        showStolenFromApple();
    }
}

function showStolenFromApple() {
    playSound('death');
    const stolen = document.createElement('div');
    stolen.id = 'stolen-screen';
    stolen.style.cssText = 'background:#000;color:#fff;font-family:Chicago,ChiKareGo2,monospace;position:fixed;top:0;left:0;padding:4px 8px;z-index:10002;cursor:pointer;font-size:12px;line-height:1.2;';
    stolen.innerHTML = `
        <div style="display:flex;align-items:flex-start;">
            <div style="display:flex;flex-direction:column;align-items:flex-start;">
                <div>STOLEN</div>
                <div>FROM</div>
                <div>APPLE</div>
                <div>COMPUTER</div>
            </div>
            <img src="icon/apple.svg" alt="Apple" style="width:24px;height:30px;filter:invert(1);margin-left:2px;margin-top:12px;">
        </div>
    `;
    stolen.onclick = function() { this.remove(); };
    document.body.appendChild(stolen);
}

// ============ RESTART / SHUTDOWN ============

export function restartSystem() {
    hideModal('bomb-modal');
    document.body.classList.add('fade-out');
    setTimeout(function() {
        location.reload();
    }, 500);
}

export function shutDown() {
    playSound('click');
    const shutdownScreen = document.createElement('div');
    shutdownScreen.id = 'shutdown-screen';
    shutdownScreen.style.cssText = 'background:black;color:white;font-family:Chicago_12,ChiKareGo2,monospace;padding:2rem;text-align:center;position:fixed;top:0;left:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:2rem;z-index:10001;cursor:pointer;';
    shutdownScreen.innerHTML = '<div>It is now safe to turn off<br>your computer.</div><div style="font-size:12px;">(press any key or click to restart)</div>';

    function restartOnInteraction() {
        location.reload();
    }

    shutdownScreen.onclick = restartOnInteraction;
    document.addEventListener('keydown', restartOnInteraction);
    document.body.appendChild(shutdownScreen);
}

// ============ CLOCK ============

export function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    document.getElementById('menu-clock').textContent = hours + ':' + minutes + ' ' + ampm;
}

let dateModalInterval = null;

export function showDate() {
    updateDateModal();
    showModal('date-modal');
    dateModalInterval = setInterval(updateDateModal, 1000);
}

export function hideDateModal() {
    hideModal('date-modal');
    if (dateModalInterval) {
        clearInterval(dateModalInterval);
        dateModalInterval = null;
    }
}

function updateDateModal() {
    const now = new Date();

    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const timeStr = hours + ':' + minutes + ':' + seconds + ' ' + ampm;

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateStr = now.toLocaleDateString('en-US', options);

    const tzOffset = -now.getTimezoneOffset();
    const tzHours = Math.floor(Math.abs(tzOffset) / 60);
    const tzMinutes = Math.abs(tzOffset) % 60;
    const tzSign = tzOffset >= 0 ? '+' : '-';
    const tzStr = 'UTC' + tzSign + tzHours.toString().padStart(2, '0') + ':' + tzMinutes.toString().padStart(2, '0');

    let tzName = '';
    try {
        tzName = Intl.DateTimeFormat().resolvedOptions().timeZone;
        tzName = ' (' + tzName + ')';
    } catch(e) {}

    document.getElementById('date-modal-time').textContent = timeStr;
    document.getElementById('date-modal-date').textContent = dateStr;
    document.getElementById('date-modal-timezone').textContent = tzStr + tzName;
}

// ============ EASTER EGGS ============

const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
let konamiIndex = 0;

export function initEasterEggs() {
    document.addEventListener('keydown', function(e) {
        // Konami code
        if (e.code === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                showModal('konami-modal');
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }

        // Secret bomb trigger: Ctrl+Shift+B
        if (e.ctrlKey && e.shiftKey && e.code === 'KeyB') {
            showModal('bomb-modal');
        }

        // Sad Mac trigger: Ctrl+Shift+S
        if (e.ctrlKey && e.shiftKey && e.code === 'KeyS') {
            e.preventDefault();
            showSadMac('0F0003');
        }

        // Any key to restart from Sad Mac
        if (document.getElementById('sad-mac-screen').classList.contains('visible')) {
            e.preventDefault();
            hideSadMac();
        }
    });

    // Click outside to close modals
    document.querySelectorAll('.modal-overlay').forEach(function(overlay) {
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                overlay.classList.remove('visible');
            }
        });
    });
}

// ============ STARTUP ============

export function initStartup() {
    playSound('startup');
    setTimeout(function() {
        document.getElementById('startup-screen').classList.add('fade-out');
        setTimeout(function() {
            document.getElementById('startup-screen').classList.add('hidden');
            centerWindow(document.getElementById('main-window'));
        }, 500);
    }, 1200);
}

// ============ SYSTEM INIT ============

export function initSystem() {
    // Register main window and licence window
    registerWindow('main-window', {
        x: 100, y: 80,
        onOpen: function(win) {
            win.classList.remove('collapsed');
            centerWindow(win);
        }
    });

    registerWindow('licence-window', {
        x: 100, y: 80,
        onOpen: function() {
            document.getElementById('licence-input').value = '';
            document.getElementById('licence-input').focus();
        }
    });

    // Licence enter key
    document.getElementById('licence-input').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            submitLicence();
        }
    });

    // Clock
    updateClock();
    setInterval(updateClock, 1000);

    // Easter eggs
    initEasterEggs();
}
