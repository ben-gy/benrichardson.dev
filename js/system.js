// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Ben Richardson — https://benrichardson.dev
// Additional terms under AGPL-3.0 section 7(b) apply; see ADDITIONAL-TERMS.md.
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

// Artemis lives in the Trash permanently, so the can is never empty.
// Desktop icons dragged onto the Trash join it and can be put back
// by double-clicking them in the Trash window.
const TRASH_RESIDENTS = [
    { id: 'artemis', name: 'Artemis', img: 'icon/Artemis.png', url: 'https://artemistracker.benrichardson.dev' }
];

const DESKTOP_ICON_POSITIONS = {
    'hd-icon': { right: '10px', top: '10px', left: '', bottom: '' },
    'email-icon': { left: '10px', top: '10px', right: '', bottom: '' },
    'internet-icon': { left: '10px', top: '90px', right: '', bottom: '' },
    'tools-icon': { left: '10px', top: '170px', right: '', bottom: '' },
    'sites-icon': { left: '10px', top: '250px', right: '', bottom: '' },
    'linkedin-icon': { left: '10px', top: '330px', right: '', bottom: '' },
    'github-icon': { left: '10px', top: '410px', right: '', bottom: '' }
};

let trashedIcons = [];

export function setTrashFull(isFull) {
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
    renderTrash();
}

function restoreFromTrash(iconId) {
    trashedIcons = trashedIcons.filter(function(id) { return id !== iconId; });
    const icon = document.getElementById(iconId);
    const pos = DESKTOP_ICON_POSITIONS[iconId];
    if (icon && pos) {
        icon.style.display = '';
        icon.style.transition = 'all 0.3s ease';
        Object.keys(pos).forEach(function(key) {
            icon.style[key] = pos[key];
        });
        setTimeout(function() {
            icon.style.transition = '';
        }, 300);
    }
    playSound('click');
    renderTrash();
}

function makeTrashItem(name, imgSrc, onOpen) {
    const item = document.createElement('div');
    item.className = 'trash-item';
    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = name;
    const label = document.createElement('span');
    label.textContent = name;
    item.appendChild(img);
    item.appendChild(label);
    item.addEventListener('dblclick', onOpen);
    return item;
}

function renderTrash() {
    const container = document.getElementById('trash-items');
    if (!container) return;
    container.innerHTML = '';

    TRASH_RESIDENTS.forEach(function(resident) {
        container.appendChild(makeTrashItem(resident.name, resident.img, function() {
            window.open(resident.url, '_blank');
        }));
    });

    trashedIcons.forEach(function(iconId) {
        const icon = document.getElementById(iconId);
        if (!icon) return;
        const img = icon.querySelector('img');
        const label = icon.querySelector('span');
        container.appendChild(makeTrashItem(
            label ? label.textContent : iconId,
            img ? img.getAttribute('src') : 'icon/document.svg',
            function() { restoreFromTrash(iconId); }
        ));
    });

    const count = TRASH_RESIDENTS.length + trashedIcons.length;
    const status = document.getElementById('trash-status');
    if (status) {
        status.textContent = count + (count === 1 ? ' item' : ' items');
    }
}

export function toggleTrash() {
    toggleWindow('trash-window');
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
        // Any key to restart from Sad Mac (must return early to avoid triggering other shortcuts)
        if (document.getElementById('sad-mac-screen').classList.contains('visible')) {
            e.preventDefault();
            hideSadMac();
            return;
        }

        // ESC to close the topmost open window or modal
        if (e.code === 'Escape') {
            // First check for visible modals
            var visibleModal = document.querySelector('.modal-overlay.visible');
            if (visibleModal) {
                visibleModal.classList.remove('visible');
                return;
            }
            // Then close the topmost visible window
            var topWindow = null;
            var topZ = -1;
            document.querySelectorAll('.window').forEach(function(win) {
                if (win.style.display !== 'none') {
                    var z = parseInt(win.style.zIndex) || 0;
                    if (z > topZ) {
                        topZ = z;
                        topWindow = win;
                    }
                }
            });
            if (topWindow) {
                topWindow.style.display = 'none';
            }
            return;
        }

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

        // Sad Mac trigger: Ctrl+Shift+S
        if (e.ctrlKey && e.shiftKey && e.code === 'KeyS') {
            e.preventDefault();
            showSadMac('0F0003');
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

    registerWindow('trash-window', {
        x: 120, y: 100,
        onOpen: function() {
            renderTrash();
        }
    });

    // Artemis is already in the Trash, so the can starts full
    setTrashFull(true);

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
