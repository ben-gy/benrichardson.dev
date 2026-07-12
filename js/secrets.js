// ============ SECRETS / EASTER EGG DIRECTORY ============

import { closeAllDropdowns, showModal, hideModal, showAlert } from './utils.js';
import { bringToFront, makeDraggable } from './window-manager.js';
import { initAudioContext, playSound, isSoundEnabled } from './sound-manager.js';
import { showSadMac, shutDown } from './system.js';

// ============ DISCOVERY TRACKING ============

function getDiscoveredEggs() {
    try {
        return JSON.parse(localStorage.getItem('discoveredEggs') || '[]');
    } catch(e) { return []; }
}

export function discoverEgg(id) {
    const discovered = getDiscoveredEggs();
    if (!discovered.includes(id)) {
        discovered.push(id);
        localStorage.setItem('discoveredEggs', JSON.stringify(discovered));
        updateSecretsAccess();
    }
}

let secretsMenuAdded = false;

function updateSecretsAccess() {
    const discovered = getDiscoveredEggs();
    if (discovered.length > 0) {
        document.getElementById('secrets-menu-item').style.display = '';
        addSecretsMenu();
    }
}

function addSecretsMenu() {
    if (secretsMenuAdded) return;
    secretsMenuAdded = true;

    var menuBar = document.querySelector('ul[role="menu-bar"]');
    var secretsItem = document.createElement('li');
    secretsItem.setAttribute('role', 'menu-item');
    secretsItem.setAttribute('tabindex', '0');
    secretsItem.innerHTML = '<u>Secrets</u>';
    secretsItem.style.cursor = 'pointer';
    secretsItem.addEventListener('click', function() {
        toggleSecrets();
    });

    var soundItem = document.getElementById('menu-sound');
    if (soundItem) {
        menuBar.insertBefore(secretsItem, soundItem);
    } else {
        menuBar.appendChild(secretsItem);
    }
}

// ============ ALL SECRETS DEFINITION ============

const ALL_SECRETS = [
    { id: 'konami', name: 'Konami Code', hint: 'A famous cheat code from the NES era' },
    { id: 'sadmac', name: 'Sad Mac', hint: 'Ctrl+Shift+S crashes the system' },
    { id: 'stolen', name: 'Stolen From Apple', hint: 'Enter the wrong serial in Licence...' },
    { id: 'diskcrash', name: 'System Disk Crash', hint: 'Drag the floppy to the Trash' },
    { id: 'memoverflow', name: 'Memory Overflow', hint: 'Open too many windows at once' },
    { id: 'shutdown', name: 'Shut Down', hint: 'Apple menu > Shut Down' },
    { id: 'jan24', name: 'Macintosh Birthday', hint: 'Visit on January 24th' },
    { id: 'calcoverflow', name: 'Calculator Overflow', hint: 'Calculate a very large number' },
    { id: 'puzzlereverse', name: 'Reverse Puzzle', hint: 'Solve the 15-puzzle backwards (15 to 1)' },
    { id: 'sosumi', name: 'Sosumi', hint: 'Type a legendary sound name on the desktop' },
    { id: 'kobayashi', name: 'Kobayashi Maru', hint: 'Type a famous Star Trek command' },
    { id: 'pitboss', name: 'Pit Boss', hint: 'Win 5 Blackjack hands in a row' },
    { id: 'revolution', name: 'Revolution', hint: 'Be a terrible ruler in Hamurabi' },
    { id: 'notepadcmds', name: 'Notepad Commands', hint: 'Type HELP on a blank notepad page' },
    { id: 'triplecredits', name: 'Secret Credits', hint: 'Triple-click the Apple logo' },
    { id: 'hellopaint', name: 'MacPaint', hint: 'Type "hello" on the desktop' },
    { id: 'dtmf', name: 'Modem Dialing', hint: 'Browse the site with sound enabled' },
    { id: 'friday13', name: 'Friday the 13th', hint: 'Visit on a Friday the 13th' },
    { id: 'burnin', name: 'Screen Burn-In', hint: 'Leave the page open for 5+ minutes' },
    { id: 'iconarrange', name: 'Debug Mode', hint: 'Arrange all 4 icons in a 2x2 square' },
];

// ============ SECRETS WINDOW ============

function renderSecretsList() {
    const discovered = getDiscoveredEggs();
    const list = document.getElementById('secrets-list');
    let html = '<div class="secrets-header">';
    html += '<strong>Easter Egg Directory</strong>';
    html += '<div class="secrets-progress">' + discovered.length + ' of ' + ALL_SECRETS.length + ' secrets found</div>';
    html += '</div>';

    ALL_SECRETS.forEach(function(secret) {
        const found = discovered.includes(secret.id);
        html += '<div class="secret-item">';
        html += '<span class="secret-check">' + (found ? '[x]' : '[ ]') + '</span>';
        html += '<div class="secret-info">';
        html += '<div class="secret-name">' + secret.name + '</div>';
        html += '<div class="secret-hint">' + secret.hint + '</div>';
        html += '</div>';
        html += '</div>';
    });

    list.innerHTML = html;
}

export function toggleSecrets() {
    closeAllDropdowns();
    const win = document.getElementById('secrets-window');
    if (win.style.display === 'none') {
        renderSecretsList();
        win.style.display = 'block';
        win.style.left = '80px';
        win.style.top = '60px';
        bringToFront(win);
    } else {
        win.style.display = 'none';
    }
}

function showSecretsWindow() {
    renderSecretsList();
    const win = document.getElementById('secrets-window');
    win.style.display = 'block';
    win.style.left = '80px';
    win.style.top = '60px';
    bringToFront(win);
}

// ============ SECRET CREDITS ============

export function showSecretCredits() {
    var overlay = document.getElementById('secret-credits-overlay');
    var scroll = document.getElementById('secret-credits-scroll');
    scroll.style.animation = 'none';
    scroll.offsetHeight; // Trigger reflow
    scroll.style.animation = 'scrollSecretCredits 45s linear forwards';
    overlay.classList.add('visible');
    setTimeout(function() { hideSecretCredits(); }, 45000);
}

export function hideSecretCredits() {
    document.getElementById('secret-credits-overlay').classList.remove('visible');
}

// ============ SOSUMI ============

let sosumiTyped = '';

function initSosumiTyping() {
    document.addEventListener('keydown', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        sosumiTyped += e.key.toLowerCase();
        if (sosumiTyped.length > 12) sosumiTyped = sosumiTyped.slice(-12);
        if (sosumiTyped.includes('sosumi')) {
            sosumiTyped = '';
            playSosumi();
        }
    });
}

function playSosumi() {
    discoverEgg('sosumi');
    initAudioContext();
    if (isSoundEnabled()) {
        // Synthesize Sosumi-like tone using Web Audio API
        try {
            var ctx = new (window.AudioContext || window.webkitAudioContext)();
            var notes = [880, 1047, 1175, 1319, 1397];
            notes.forEach(function(freq, i) {
                var osc = ctx.createOscillator();
                var gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.value = freq;
                gain.gain.value = 0.15;
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (i * 0.1) + 0.15);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(ctx.currentTime + i * 0.1);
                osc.stop(ctx.currentTime + (i * 0.1) + 0.2);
            });
        } catch(e) {}
    }
    setTimeout(function() { showModal('sosumi-modal'); }, 600);
}

// ============ HELLO -> MACPAINT ============

let helloTyped = '';

function initHelloEasterEgg() {
    document.addEventListener('keydown', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        helloTyped += e.key.toLowerCase();
        if (helloTyped.length > 10) helloTyped = helloTyped.slice(-10);
        if (helloTyped.includes('hello')) {
            helloTyped = '';
            discoverEgg('hellopaint');
            window.toggleMacpaint();
        }
    });
}

// ============ DTMF MODEM DIALING ============

function initDTMF() {
    var origSearchGoogle = window.searchGoogle;
    if (!origSearchGoogle) return;
    window.searchGoogle = function() {
        var query = document.getElementById('search-input').value.trim();
        var digits = query.replace(/[\s\-\(\)\+]/g, '');
        if (/^\d{7,}$/.test(digits)) {
            discoverEgg('dtmf');
            playDTMF(digits);
            return;
        }
        origSearchGoogle();
    };
}

function playDTMF(digits) {
    var freqs = {
        '1': [697, 1209], '2': [697, 1336], '3': [697, 1477],
        '4': [770, 1209], '5': [770, 1336], '6': [770, 1477],
        '7': [852, 1209], '8': [852, 1336], '9': [852, 1477],
        '0': [941, 1336], '*': [941, 1209], '#': [941, 1477]
    };

    var searchOutput = document.getElementById('search-input');
    searchOutput.value = 'ATDT ' + digits;
    searchOutput.readOnly = true;

    var i = 0;
    function playNextTone() {
        if (i >= digits.length) {
            setTimeout(function() {
                searchOutput.value = 'NO CARRIER';
                setTimeout(function() {
                    searchOutput.value = '';
                    searchOutput.readOnly = false;
                }, 2000);
            }, 500);
            return;
        }

        var d = digits[i];
        var f = freqs[d];
        if (f && isSoundEnabled()) {
            try {
                var ctx = new (window.AudioContext || window.webkitAudioContext)();
                var osc1 = ctx.createOscillator();
                var osc2 = ctx.createOscillator();
                var gain = ctx.createGain();
                osc1.type = 'sine';
                osc2.type = 'sine';
                osc1.frequency.value = f[0];
                osc2.frequency.value = f[1];
                gain.gain.value = 0.1;
                osc1.connect(gain);
                osc2.connect(gain);
                gain.connect(ctx.destination);
                osc1.start();
                osc2.start();
                osc1.stop(ctx.currentTime + 0.1);
                osc2.stop(ctx.currentTime + 0.1);
            } catch(e) {}
        }

        searchOutput.value = 'ATDT ' + digits.substring(0, i + 1) + '_';
        i++;
        setTimeout(playNextTone, 150);
    }

    playNextTone();
}

// ============ SOUND DISCOVERY ============

function initSoundDiscovery() {
    var origPlaySound = window.playSound;
    if (!origPlaySound) return;
    window.playSound = function() {
        if (isSoundEnabled()) {
            discoverEgg('dtmf');
        }
        origPlaySound.apply(this, arguments);
    };
}

// ============ CALCULATOR OVERFLOW ============

function initCalcOverflow() {
    var origCalcEquals = window.calcEquals;
    if (!origCalcEquals) return;
    window.calcEquals = function() {
        // Get the current display value before calling original
        var display = document.querySelector('.calc-display');
        var valueBefore = display ? display.textContent : '';
        origCalcEquals();
        var valueAfter = display ? display.textContent : '';
        if (valueAfter === 'E') {
            discoverEgg('calcoverflow');
            var calcButtons = document.querySelector('.calc-buttons');
            if (calcButtons) {
                calcButtons.classList.add('calc-overflow');
                setTimeout(function() { calcButtons.classList.remove('calc-overflow'); }, 500);
            }
        }
    };
}

// ============ PUZZLE REVERSE ============

function initPuzzleReverse() {
    // Hook into puzzle win check - monkey-patch the global
    var origShufflePuzzle = window.shufflePuzzle;
    if (!origShufflePuzzle) return;

    // We need to check the puzzle state after each move
    // Hook into click events on puzzle tiles
    var puzzleContainer = document.getElementById('puzzle-tiles');
    if (puzzleContainer) {
        puzzleContainer.addEventListener('click', function() {
            // Check after a short delay to let the move complete
            setTimeout(checkPuzzleReverse, 100);
        });
    }
}

function checkPuzzleReverse() {
    var tiles = document.querySelectorAll('.puzzle-tile');
    if (tiles.length !== 16) return;
    // Extract tile values in order
    var values = [];
    tiles.forEach(function(tile) {
        var val = tile.textContent.trim();
        values.push(val === '' ? 0 : parseInt(val));
    });
    // Check reverse: 15,14,...,1,0
    var reverse = [15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
    if (values.every(function(v, i) { return v === reverse[i]; })) {
        discoverEgg('puzzlereverse');
        setTimeout(function() { showModal('puzzle-reverse-modal'); }, 300);
    }
}

// ============ KOBAYASHI MARU ============

function initKobayashi() {
    var origTrekCommand = window.trekCommand;
    if (!origTrekCommand) return;
    window.trekCommand = function() {
        var input = document.getElementById('startrek-input');
        if (!input) return origTrekCommand();
        var cmd = input.value.toUpperCase().trim();
        if (cmd === 'KOBAYASHI' || cmd === 'KOBAYASHI MARU') {
            discoverEgg('kobayashi');
            input.value = '';
            var output = document.getElementById('startrek-output');
            if (output) {
                output.textContent +=
                    '\nTHE KOBAYASHI MARU\n' +
                    '========================\n\n' +
                    'YOU HAVE ENTERED AN UNWINNABLE\n' +
                    'SCENARIO. KLINGON WARBIRDS\n' +
                    'DECLOAK ON ALL SIDES.\n\n' +
                    'SHIELDS FAILING...\n' +
                    'HULL BREACH ON DECKS 4-7...\n' +
                    'WARP CORE CONTAINMENT AT 12%...\n\n' +
                    '========================\n\n' +
                    'A NO-WIN SCENARIO.\n\n' +
                    'HOW YOU DEAL WITH DEFEAT IS\n' +
                    'AS IMPORTANT AS HOW YOU DEAL\n' +
                    'WITH VICTORY.\n\n' +
                    '   -- JAMES T. KIRK, 2285\n\n' +
                    '[ENTER ANY COMMAND TO CONTINUE]\n';
                output.scrollTop = output.scrollHeight;
            }
            return;
        }
        origTrekCommand();
    };
}

// ============ BLACKJACK PIT BOSS ============

let bjConsecutiveWins = 0;

function initPitBoss() {
    var origBjStand = window.bjStand;
    if (!origBjStand) return;
    window.bjStand = function() {
        // Track wins by checking score display before/after
        var winsEl = document.getElementById('bj-wins');
        var prevWins = winsEl ? parseInt(winsEl.textContent) || 0 : 0;
        origBjStand();
        var newWins = winsEl ? parseInt(winsEl.textContent) || 0 : 0;
        if (newWins > prevWins) {
            bjConsecutiveWins++;
            if (bjConsecutiveWins >= 5) {
                bjConsecutiveWins = 0;
                discoverEgg('pitboss');
                setTimeout(function() {
                    showAlert('SECURITY ALERT\n\nThe pit boss has noticed your\nwinning streak. You have been\nasked to leave the table.');
                    setTimeout(function() { window.toggleBlackjack(); }, 1500);
                }, 800);
            }
        } else {
            bjConsecutiveWins = 0;
        }
    };

    var origBjHit = window.bjHit;
    if (!origBjHit) return;
    window.bjHit = function() {
        var lossesEl = document.getElementById('bj-losses');
        var prevLosses = lossesEl ? parseInt(lossesEl.textContent) || 0 : 0;
        origBjHit();
        var newLosses = lossesEl ? parseInt(lossesEl.textContent) || 0 : 0;
        if (newLosses > prevLosses) {
            bjConsecutiveWins = 0;
        }
    };
}

// ============ HAMURABI REVOLUTION ============

function initRevolution() {
    var origHamSubmit = window.hamSubmit;
    if (!origHamSubmit) return;
    // We hook hamSubmit and check population starvation after
    window.hamSubmit = function() {
        origHamSubmit();
        // Check if game over text contains revolution-like messages
        var output = document.getElementById('hamurabi-output');
        if (output && output.textContent.includes('STARVED')) {
            discoverEgg('revolution');
        }
    };
}

// ============ NOTEPAD COMMANDS ============

function initNotepadCommands() {
    var textarea = document.getElementById('notepad-textarea');
    if (!textarea) return;

    textarea.addEventListener('keydown', function(e) {
        if (e.key !== 'Enter') return;
        var text = this.value.trim().toUpperCase();
        var response = null;

        if (text === 'HELP') {
            response = 'NOTEPAD SECRET COMMANDS\n' +
                '=======================\n\n' +
                'HELP  - This help text\n' +
                'ABOUT - About the author\n' +
                'DIR   - File directory\n' +
                'DATE  - Current date/time\n' +
                'VER   - System version\n';
        } else if (text === 'ABOUT') {
            response = '    _______________\n' +
                '   |  ___________  |\n' +
                '   | |           | |\n' +
                '   | |   BEN R.  | |\n' +
                '   | |___________| |\n' +
                '   |___ _______ ___|\n' +
                '       |_______|\n\n' +
                'Ben Richardson\n' +
                'Indie hacker, aerospace\n' +
                'engineer, full-stack founder\n' +
                'Canberra/Melbourne, AU\n\n' +
                'hi@benrichardson.dev\n';
        } else if (text === 'DIR') {
            response = ' Volume: Apple OS 2\n' +
                ' Directory of A:\\\n\n' +
                ' SYSTEM   SYS    42K\n' +
                ' FINDER   APP    56K\n' +
                ' CALC     APP     4K\n' +
                ' NOTEPAD  APP     3K\n' +
                ' PUZZLE   APP     5K\n' +
                ' EMAIL    APP     3K\n' +
                ' LANDER   APP     8K\n' +
                ' STARTREK APP    16K\n' +
                ' BLACKJCK APP     6K\n' +
                ' MASTRMND APP     5K\n' +
                ' HAMURABI APP     7K\n' +
                ' MACPAINT APP     9K\n' +
                ' SECRETS  DAT     2K\n' +
                '  13 file(s)   166K\n' +
                '   0 dir(s)    -38K free\n';
        } else if (text === 'DATE') {
            var d = new Date();
            response = d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) + '\n' + d.toLocaleTimeString() + '\n';
        } else if (text === 'VER') {
            response = 'Ben Richardson OS 1.0\n' +
                'System Software 2.0\n' +
                'Macintosh 128K\n' +
                '(c) 2025 Ben Richardson\n';
        }

        if (response) {
            e.preventDefault();
            discoverEgg('notepadcmds');
            this.value = response;
        }
    });
}

// ============ DATE-BASED EGGS ============

function initDateEggs() {
    var now = new Date();

    // January 24 - Macintosh Birthday
    if (now.getMonth() === 0 && now.getDate() === 24) {
        discoverEgg('jan24');
        var startupText = document.querySelector('.startup-text');
        if (startupText) {
            startupText.innerHTML = 'Welcome to Macintosh.<br><span style="font-size:12px;">Happy Birthday, Macintosh! Born January 24, 1984.</span>';
        }
    }

    // After Hours (late night or dark mode) - kept as ambient effect, not tracked

    // Friday the 13th
    if (now.getDay() === 5 && now.getDate() === 13) {
        discoverEgg('friday13');
        setInterval(function() {
            if (Math.random() < 0.05) {
                var clock = document.getElementById('menu-clock');
                if (clock) {
                    clock.textContent = '13:13 PM';
                    setTimeout(function() { window.updateClock && window.updateClock(); }, 300);
                }
            }
        }, 2000);
    }
}

// ============ SCREEN BURN-IN ============

function initBurnIn() {
    var pageOpenTime = 0;
    var burnInShown = false;

    setInterval(function() {
        if (document.visibilityState === 'visible') {
            pageOpenTime++;
        }
        if (pageOpenTime >= 300 && !burnInShown) {
            burnInShown = true;
            discoverEgg('burnin');
            showBurnIn();
        }
    }, 1000);

    function showBurnIn() {
        var overlay = document.getElementById('burn-in-overlay');
        var menuBar = document.querySelector('ul[role="menu-bar"]');
        if (menuBar) {
            var clone = menuBar.cloneNode(true);
            clone.style.pointerEvents = 'none';
            clone.style.position = 'fixed';
            clone.style.top = '0';
            clone.style.left = '0';
            clone.style.width = '100%';
            clone.style.opacity = '1';
            overlay.appendChild(clone);
        }
        overlay.classList.add('visible');

        document.addEventListener('click', function dismissBurnIn() {
            overlay.style.transition = 'opacity 3s ease';
            overlay.style.opacity = '0';
            setTimeout(function() {
                overlay.classList.remove('visible');
                overlay.innerHTML = '';
                overlay.style.opacity = '';
                overlay.style.transition = '';
            }, 3000);
            document.removeEventListener('click', dismissBurnIn);
        });
    }
}

// ============ DEBUG MODE (ICON ARRANGEMENT) ============

let debugMenuAdded = false;

function checkIconArrangement() {
    if (debugMenuAdded) return;

    var icons = ['hd-icon', 'email-icon', 'internet-icon', 'tools-icon'];
    var positions = [];
    var GRID_SIZE = 80;

    for (var i = 0; i < icons.length; i++) {
        var icon = document.getElementById(icons[i]);
        if (!icon || icon.style.display === 'none') return;
        var left = parseFloat(icon.style.left);
        var top = parseFloat(icon.style.top);
        if (isNaN(left) || isNaN(top)) return;
        positions.push({ x: Math.round(left / GRID_SIZE), y: Math.round(top / GRID_SIZE) });
    }

    if (positions.length === 4) {
        var xs = positions.map(function(p) { return p.x; }).sort();
        var ys = positions.map(function(p) { return p.y; }).sort();
        var uniqueX = [...new Set(xs)];
        var uniqueY = [...new Set(ys)];

        if (uniqueX.length === 2 && uniqueY.length === 2 &&
            Math.abs(uniqueX[1] - uniqueX[0]) === 1 &&
            Math.abs(uniqueY[1] - uniqueY[0]) === 1) {
            discoverEgg('iconarrange');
            addDebugMenu();
        }
    }
}

function addDebugMenu() {
    if (debugMenuAdded) return;
    debugMenuAdded = true;

    var menuBar = document.querySelector('ul[role="menu-bar"]');
    var debugItem = document.createElement('li');
    debugItem.setAttribute('role', 'menu-item');
    debugItem.setAttribute('tabindex', '0');
    debugItem.setAttribute('aria-haspopup', 'true');
    debugItem.innerHTML = '<u>Debug</u>' +
        '<ul role="menu">' +
        '<li role="menu-item"><a href="#" onclick="showDebugInfo(); return false;">System Info</a></li>' +
        '<li role="menu-item"><a href="#" onclick="showHeapDisplay(); return false;">Heap Display</a></li>' +
        '<li role="menu-item"><a href="#" onclick="showClipboardViewer(); return false;">Clipboard</a></li>' +
        '<li role="menu-item"><a href="#" onclick="showMacsBug(); return false;">MacsBug</a></li>' +
        '<li role="menu-item"><a href="#" onclick="playBeepCodes(); return false;">Beep Codes</a></li>' +
        '<li class="divider"></li>' +
        '<li role="menu-item"><a href="#" onclick="localStorage.clear(); showAlert(\'Storage cleared.\'); return false;">Reset Storage</a></li>' +
        '<li role="menu-item"><a href="#" onclick="showSadMac(\'0FDEAD\'); return false;">Force Crash</a></li>' +
        '</ul>';

    var soundItem = document.getElementById('menu-sound');
    if (soundItem) {
        menuBar.insertBefore(debugItem, soundItem);
    } else {
        menuBar.appendChild(debugItem);
    }

    menuBar.style.background = 'black';
    setTimeout(function() { menuBar.style.background = ''; }, 200);
    playSound('beep');
}

// ============ DEBUG FEATURES ============

export function showHeapDisplay() {
    var windowCount = 0;
    document.querySelectorAll('.window').forEach(function(w) {
        if (w.style.display !== 'none') windowCount++;
    });
    var discovered = getDiscoveredEggs();
    var used = 42 + (windowCount * 6) + (discovered.length * 2);
    var total = 128;
    var free = total - used;
    var barLen = 20;
    var filledLen = Math.round((used / total) * barLen);
    var bar = '';
    for (var i = 0; i < barLen; i++) {
        bar += i < filledLen ? '#' : '.';
    }

    showAlert(
        'HEAP DISPLAY\n\n' +
        'Total:  ' + total + 'K\n' +
        'Used:   ' + used + 'K\n' +
        'Free:   ' + free + 'K\n\n' +
        '[' + bar + ']\n\n' +
        'Windows: ' + windowCount + ' x 6K\n' +
        'Secrets: ' + discovered.length + ' x 2K\n' +
        'System:  42K'
    );
}

export function showClipboardViewer() {
    if (navigator.clipboard && navigator.clipboard.readText) {
        navigator.clipboard.readText().then(function(text) {
            if (!text) text = '<empty>';
            if (text.length > 200) text = text.substring(0, 200) + '...';
            showAlert(
                'CLIPBOARD VIEWER\n\n' +
                'Type: TEXT\n' +
                'Size: ' + text.length + ' bytes\n\n' +
                '------------------------\n' +
                text + '\n' +
                '------------------------'
            );
        }).catch(function() {
            showAlert(
                'CLIPBOARD VIEWER\n\n' +
                'Error: Cannot read clipboard.\n' +
                'Permission denied.'
            );
        });
    } else {
        showAlert(
            'CLIPBOARD VIEWER\n\n' +
            'Error: Clipboard API\n' +
            'not available.'
        );
    }
}

export function showMacsBug() {
    var pc = Math.floor(Math.random() * 0xFFFFFF);
    var sp = Math.floor(Math.random() * 0xFFFF) + 0x1000;
    var lines = '';
    for (var i = 0; i < 8; i++) {
        var addr = (pc + i * 16).toString(16).toUpperCase().padStart(6, '0');
        var hex = '';
        for (var j = 0; j < 8; j++) {
            hex += Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase().padStart(4, '0') + ' ';
        }
        lines += addr + '  ' + hex.trim() + '\n';
    }

    showAlert(
        'MacsBug 6.5.4a6\n' +
        '========================\n\n' +
        'Bus Error at ' + pc.toString(16).toUpperCase().padStart(8, '0') + '\n' +
        'PC = ' + pc.toString(16).toUpperCase().padStart(8, '0') +
        '  SP = 00' + sp.toString(16).toUpperCase().padStart(4, '0') + '\n\n' +
        lines + '\n' +
        'Type G to continue'
    );
}

export function playBeepCodes() {
    initAudioContext();
    if (!isSoundEnabled()) {
        showAlert('BEEP CODES\n\nSound is off.\nEnable sound to hear\ndiagnostic beeps.');
        return;
    }

    var patterns = [
        { name: 'RAM OK', seq: [200] },
        { name: 'ROM Test', seq: [100, 100, 300] },
        { name: 'Bus Error', seq: [300, 100, 100, 100] },
        { name: 'All Clear', seq: [150, 150, 150, 400] },
    ];
    var pattern = patterns[Math.floor(Math.random() * patterns.length)];

    showAlert('BEEP CODES\n\nRunning: ' + pattern.name + '\n\nListening...');

    var offset = 0;
    pattern.seq.forEach(function(duration) {
        setTimeout(function() {
            try {
                var ctx = new (window.AudioContext || window.webkitAudioContext)();
                var osc = ctx.createOscillator();
                var gain = ctx.createGain();
                osc.type = 'square';
                osc.frequency.value = 800;
                gain.gain.value = 0.12;
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + duration / 1000);
            } catch(e) {}
        }, offset);
        offset += duration + 100;
    });
}

// ============ HOOK EXISTING FUNCTIONS FOR DISCOVERY ============

function hookExistingEggs() {
    // Hook showSadMac
    var origShowSadMac = window.showSadMac;
    if (origShowSadMac) {
        window.showSadMac = function(code, isMem) {
            if (code === '0F0003') discoverEgg('sadmac');
            if (code === '0F0001') discoverEgg('diskcrash');
            if (code === '0F0004') discoverEgg('memoverflow');
            origShowSadMac(code, isMem);
        };
    }

    // Hook showModal
    var origShowModal = window.showModal;
    if (origShowModal) {
        window.showModal = function(id) {
            origShowModal(id);
        };
    }

    // Hook shutDown
    var origShutDown = window.shutDown;
    if (origShutDown) {
        window.shutDown = function() {
            discoverEgg('shutdown');
            origShutDown();
        };
    }

    // Hook submitLicence to discover stolen egg on wrong serial
    var origSubmitLicence = window.submitLicence;
    if (origSubmitLicence) {
        window.submitLicence = function() {
            var serial = document.getElementById('licence-input').value;
            if (serial !== '4188A4' && serial !== '40E118') {
                discoverEgg('stolen');
            }
            origSubmitLicence();
        };
    }

    // Hook Konami modal to open secrets
    var konamiModal = document.getElementById('konami-modal');
    if (konamiModal) {
        var btn = konamiModal.querySelector('.btn');
        if (btn) {
            btn.onclick = function() {
                hideModal('konami-modal');
                discoverEgg('konami');
                setTimeout(showSecretsWindow, 300);
            };
        }
    }

    // Apple logo triple-click for secret credits
    var appleLogo = document.querySelector('.apple-logo');
    if (appleLogo) {
        appleLogo.addEventListener('click', function(e) {
            if (e.detail === 3) {
                discoverEgg('triplecredits');
                showSecretCredits();
            }
        });
    }

    // Icon drop check for debug mode
    document.addEventListener('mouseup', function() {
        setTimeout(checkIconArrangement, 100);
    });
    document.addEventListener('touchend', function() {
        setTimeout(checkIconArrangement, 100);
    });
}

// ============ CONSOLE GREETING ============

function initConsoleGreeting() {
    console.log('%c' +
        '    ____________________\n' +
        '   |  ________________  |\n' +
        '   | |                | |\n' +
        '   | |  Hello!        | |\n' +
        '   | |________________| |\n' +
        '   |   __ ________ __   |\n' +
        '   |  |  |        |  |  |\n' +
        '   |__|__|________|__|__|\n',
        'font-family: monospace; font-size: 12px; color: black; background: white;'
    );
    console.log('%cWelcome to Ben Richardson OS 1.0', 'font-family: monospace; font-size: 16px; font-weight: bold;');
    console.log('%cBuilt with vanilla HTML, CSS & JS. No frameworks were harmed.', 'font-family: monospace; font-size: 11px; color: #666;');
    console.log('%chi@benrichardson.dev', 'font-family: monospace; font-size: 11px; color: blue; text-decoration: underline;');
}

// ============ INIT ============

export function showDebugInfo() {
    var windowCount = 0;
    document.querySelectorAll('.window').forEach(function(w) {
        if (w.style.display !== 'none') windowCount++;
    });
    var discovered = getDiscoveredEggs();
    var uptime = Math.floor(performance.now() / 1000);
    var min = Math.floor(uptime / 60);
    var sec = uptime % 60;

    showAlert(
        'SYSTEM INFO\n\n' +
        'Windows Open: ' + windowCount + '\n' +
        'Eggs Found: ' + discovered.length + '/' + ALL_SECRETS.length + '\n' +
        'Uptime: ' + min + 'm ' + sec + 's'
    );
}

export function initSecrets() {
    // Make secrets window draggable
    makeDraggable(
        document.getElementById('secrets-window'),
        document.getElementById('secrets-title-bar')
    );

    // Check access on load
    updateSecretsAccess();

    // Init all easter egg hooks
    hookExistingEggs();
    initHelloEasterEgg();
    initSosumiTyping();
    initDTMF();
    initSoundDiscovery();
    initCalcOverflow();
    initPuzzleReverse();
    initKobayashi();
    initPitBoss();
    initRevolution();
    initNotepadCommands();
    initDateEggs();
    initBurnIn();
    initConsoleGreeting();
}
