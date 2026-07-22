// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Ben Richardson — https://benrichardson.dev
// Additional terms under AGPL-3.0 section 7(b) apply; see ADDITIONAL-TERMS.md.
// ============ STAR TREK GAME ============

import { registerWindow, toggleWindow } from '../window-manager.js';

let trek = null;

function initTrek() {
    trek = {
        quadrant: { x: Math.floor(Math.random() * 8), y: Math.floor(Math.random() * 8) },
        sector: { x: Math.floor(Math.random() * 8), y: Math.floor(Math.random() * 8) },
        energy: 3000,
        shields: 0,
        torpedoes: 10,
        stardate: 0,
        maxStardate: 30,
        klingonsTotal: 0,
        basesTotal: 0,
        galaxy: [],
        sector_map: [],
        klingons: [],
        docked: false,
        gameOver: false,
        message: ''
    };

    for (let i = 0; i < 8; i++) {
        trek.galaxy[i] = [];
        for (let j = 0; j < 8; j++) {
            const k = Math.random() < 0.15 ? (Math.random() < 0.3 ? 2 : 1) : 0;
            const b = Math.random() < 0.08 ? 1 : 0;
            const s = Math.floor(Math.random() * 8) + 1;
            trek.galaxy[i][j] = { klingons: k, bases: b, stars: s, scanned: false };
            trek.klingonsTotal += k;
            trek.basesTotal += b;
        }
    }

    if (trek.klingonsTotal < 5) {
        trek.galaxy[0][0].klingons = 3;
        trek.klingonsTotal += 3;
    }
    if (trek.basesTotal < 1) {
        trek.galaxy[4][4].bases = 1;
        trek.basesTotal = 1;
    }

    trek.maxStardate = 25 + Math.floor(trek.klingonsTotal * 1.5);
    enterQuadrant();
}

function enterQuadrant() {
    const q = trek.galaxy[trek.quadrant.x][trek.quadrant.y];
    q.scanned = true;
    trek.klingons = [];
    trek.sector_map = [];

    for (let i = 0; i < 8; i++) {
        trek.sector_map[i] = [];
        for (let j = 0; j < 8; j++) {
            trek.sector_map[i][j] = '.';
        }
    }

    trek.sector_map[trek.sector.x][trek.sector.y] = 'E';

    for (let i = 0; i < q.klingons; i++) {
        let x, y;
        do {
            x = Math.floor(Math.random() * 8);
            y = Math.floor(Math.random() * 8);
        } while (trek.sector_map[x][y] !== '.');
        trek.sector_map[x][y] = 'K';
        trek.klingons.push({ x: x, y: y, energy: 200 + Math.floor(Math.random() * 200) });
    }

    for (let i = 0; i < q.bases; i++) {
        let x, y;
        do {
            x = Math.floor(Math.random() * 8);
            y = Math.floor(Math.random() * 8);
        } while (trek.sector_map[x][y] !== '.');
        trek.sector_map[x][y] = 'B';
    }

    for (let i = 0; i < q.stars; i++) {
        let x, y;
        do {
            x = Math.floor(Math.random() * 8);
            y = Math.floor(Math.random() * 8);
        } while (trek.sector_map[x][y] !== '.');
        trek.sector_map[x][y] = '*';
    }

    checkDocked();
}

function checkDocked() {
    const dirs = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
    trek.docked = false;
    for (const d of dirs) {
        const nx = trek.sector.x + d[0];
        const ny = trek.sector.y + d[1];
        if (nx >= 0 && nx < 8 && ny >= 0 && ny < 8 && trek.sector_map[nx][ny] === 'B') {
            trek.docked = true;
            trek.energy = 3000;
            trek.torpedoes = 10;
            break;
        }
    }
}

function getCondition() {
    if (trek.docked) return 'DOCKED';
    if (trek.klingons.length > 0) return '*RED*';
    if (trek.energy < 300) return 'YELLOW';
    return 'GREEN';
}

function getWelcome() {
    return 'STAR TREK\n' +
        '========================\n' +
        'DESTROY ' + trek.klingonsTotal + ' KLINGONS IN ' + trek.maxStardate + ' STARDATES\n' +
        'YOU HAVE ' + trek.basesTotal + ' STARBASE(S)\n\n' +
        'COMMANDS: NAV SRS LRS PHA TOR SHE';
}

function shortRangeScan() {
    let out = '    0 1 2 3 4 5 6 7\n';
    out += '   +-+-+-+-+-+-+-+-+\n';
    for (let i = 0; i < 8; i++) {
        out += ' ' + i + ' |';
        for (let j = 0; j < 8; j++) {
            const c = trek.sector_map[i][j];
            out += c + '|';
        }
        out += '\n';
    }
    out += '   +-+-+-+-+-+-+-+-+\n';
    out += 'QUADRANT: ' + (trek.quadrant.x + 1) + ',' + (trek.quadrant.y + 1);
    out += '  SECTOR: ' + (trek.sector.x + 1) + ',' + (trek.sector.y + 1) + '\n';
    out += 'STARDATE: ' + trek.stardate + '/' + trek.maxStardate;
    out += '  COND: ' + getCondition() + '\n';
    out += 'ENERGY: ' + trek.energy + '  SHIELDS: ' + trek.shields + '\n';
    out += 'TORPEDOES: ' + trek.torpedoes + '  KLINGONS: ' + trek.klingonsTotal;
    return out;
}

function longRangeScan() {
    let out = 'LONG RANGE SCAN\n';
    out += '    ' + (trek.quadrant.y) + '   ' + (trek.quadrant.y + 1) + '   ' + (trek.quadrant.y + 2) + '\n';
    out += '  +---+---+---+\n';
    for (let dx = -1; dx <= 1; dx++) {
        const qx = trek.quadrant.x + dx;
        out += (trek.quadrant.x + dx + 1) + ' |';
        for (let dy = -1; dy <= 1; dy++) {
            const qy = trek.quadrant.y + dy;
            if (qx >= 0 && qx < 8 && qy >= 0 && qy < 8) {
                const q = trek.galaxy[qx][qy];
                q.scanned = true;
                out += '' + q.klingons + q.bases + q.stars + '|';
            } else {
                out += '***|';
            }
        }
        out += '\n';
    }
    out += '  +---+---+---+';
    return out;
}

function navigate(course, warp) {
    if (warp <= 0 || warp > 8) {
        return 'WARP FACTOR MUST BE 1-8';
    }
    const energy_needed = Math.floor(warp * 100);
    if (energy_needed > trek.energy) {
        return 'INSUFFICIENT ENERGY FOR WARP ' + warp;
    }

    const dx = [0, 0, -1, -1, -1, 0, 1, 1, 1];
    const dy = [0, 1, 1, 0, -1, -1, -1, 0, 1];
    const dir = Math.round(course);
    if (dir < 1 || dir > 8) {
        return 'COURSE MUST BE 1-8';
    }

    const sectors_to_move = Math.floor(warp * 8);
    let sx = trek.sector.x;
    let sy = trek.sector.y;
    let qx = trek.quadrant.x;
    let qy = trek.quadrant.y;

    trek.sector_map[trek.sector.x][trek.sector.y] = '.';

    for (let i = 0; i < sectors_to_move; i++) {
        const nx = sx + dx[dir];
        const ny = sy + dy[dir];

        if (nx < 0 || nx >= 8 || ny < 0 || ny >= 8) {
            qx += dx[dir];
            qy += dy[dir];
            if (qx < 0 || qx >= 8 || qy < 0 || qy >= 8) {
                qx = Math.max(0, Math.min(7, qx));
                qy = Math.max(0, Math.min(7, qy));
                break;
            }
            sx = (nx + 8) % 8;
            sy = (ny + 8) % 8;
            trek.quadrant.x = qx;
            trek.quadrant.y = qy;
            trek.sector.x = sx;
            trek.sector.y = sy;
            trek.stardate++;
            trek.energy -= energy_needed;
            enterQuadrant();
            let msg = 'ENTERING QUADRANT ' + (qx + 1) + ',' + (qy + 1);
            if (trek.klingons.length > 0) {
                msg += '\nCOMBAT AREA - ' + trek.klingons.length + ' KLINGON(S) DETECTED';
                msg += '\n' + klingonAttack();
            }
            return msg + '\n\n' + shortRangeScan();
        }

        if (trek.sector_map[nx][ny] !== '.') {
            break;
        }
        sx = nx;
        sy = ny;
    }

    trek.sector.x = sx;
    trek.sector.y = sy;
    trek.sector_map[sx][sy] = 'E';
    trek.energy -= energy_needed;
    checkDocked();

    let msg = '';
    if (trek.docked) {
        msg = 'DOCKED AT STARBASE - ENERGY AND TORPEDOES REPLENISHED\n\n';
    }
    if (trek.klingons.length > 0 && !trek.docked) {
        msg += klingonAttack() + '\n\n';
    }
    return msg + shortRangeScan();
}

function firePhasers(energy) {
    if (energy <= 0) return 'PHASER ENERGY MUST BE > 0';
    if (energy > trek.energy) return 'INSUFFICIENT ENERGY';
    if (trek.klingons.length === 0) return 'NO KLINGONS IN THIS QUADRANT';

    trek.energy -= energy;
    const energy_per_klingon = energy / trek.klingons.length;
    let msg = 'PHASERS FIRE!\n';

    for (let i = trek.klingons.length - 1; i >= 0; i--) {
        const k = trek.klingons[i];
        const dist = Math.sqrt(Math.pow(trek.sector.x - k.x, 2) + Math.pow(trek.sector.y - k.y, 2));
        const damage = Math.floor(energy_per_klingon / (dist + 1) * (0.5 + Math.random() * 0.5));
        k.energy -= damage;
        msg += damage + ' DAMAGE TO KLINGON AT ' + (k.x + 1) + ',' + (k.y + 1);
        if (k.energy <= 0) {
            msg += ' - DESTROYED!';
            trek.sector_map[k.x][k.y] = '.';
            trek.klingons.splice(i, 1);
            trek.klingonsTotal--;
            trek.galaxy[trek.quadrant.x][trek.quadrant.y].klingons--;
        }
        msg += '\n';
    }

    if (trek.klingonsTotal === 0) {
        trek.gameOver = true;
        msg += '\n*** CONGRATULATIONS! ALL KLINGONS DESTROYED! ***';
        return msg;
    }

    if (trek.klingons.length > 0) {
        msg += '\n' + klingonAttack();
    }
    return msg;
}

function fireTorpedo(course) {
    if (trek.torpedoes <= 0) return 'NO TORPEDOES LEFT';
    const dir = Math.round(course);
    if (dir < 1 || dir > 8) return 'COURSE MUST BE 1-8';

    trek.torpedoes--;
    const dx = [0, 0, -1, -1, -1, 0, 1, 1, 1];
    const dy = [0, 1, 1, 0, -1, -1, -1, 0, 1];

    let tx = trek.sector.x;
    let ty = trek.sector.y;
    let msg = 'TORPEDO TRACK: ';

    for (let i = 0; i < 8; i++) {
        tx += dx[dir];
        ty += dy[dir];
        if (tx < 0 || tx >= 8 || ty < 0 || ty >= 8) {
            msg += 'MISSED - LEFT QUADRANT';
            break;
        }
        msg += '(' + (tx + 1) + ',' + (ty + 1) + ') ';
        const target = trek.sector_map[tx][ty];
        if (target === 'K') {
            msg += '\n*** KLINGON DESTROYED! ***';
            trek.sector_map[tx][ty] = '.';
            for (let j = 0; j < trek.klingons.length; j++) {
                if (trek.klingons[j].x === tx && trek.klingons[j].y === ty) {
                    trek.klingons.splice(j, 1);
                    break;
                }
            }
            trek.klingonsTotal--;
            trek.galaxy[trek.quadrant.x][trek.quadrant.y].klingons--;
            if (trek.klingonsTotal === 0) {
                trek.gameOver = true;
                msg += '\n*** CONGRATULATIONS! ALL KLINGONS DESTROYED! ***';
            }
            break;
        } else if (target === '*') {
            msg += '\nTORPEDO HIT STAR - ABSORBED';
            break;
        } else if (target === 'B') {
            msg += '\n*** STARBASE DESTROYED! ***';
            trek.sector_map[tx][ty] = '.';
            trek.basesTotal--;
            trek.galaxy[trek.quadrant.x][trek.quadrant.y].bases--;
            break;
        }
    }

    if (trek.klingons.length > 0 && !trek.gameOver) {
        msg += '\n\n' + klingonAttack();
    }
    return msg;
}

function adjustShields(amount) {
    const total = trek.energy + trek.shields;
    if (amount < 0 || amount > total) {
        return 'INVALID SHIELD AMOUNT (0-' + total + ')';
    }
    trek.shields = amount;
    trek.energy = total - amount;
    return 'SHIELDS SET TO ' + trek.shields + ', ENERGY: ' + trek.energy;
}

function klingonAttack() {
    if (trek.klingons.length === 0 || trek.docked) return '';
    let msg = 'KLINGON ATTACK!\n';
    let total_damage = 0;

    for (const k of trek.klingons) {
        const dist = Math.sqrt(Math.pow(trek.sector.x - k.x, 2) + Math.pow(trek.sector.y - k.y, 2));
        const damage = Math.floor((k.energy / (dist + 1)) * (0.3 + Math.random() * 0.4));
        total_damage += damage;
        msg += damage + ' DAMAGE FROM KLINGON AT ' + (k.x + 1) + ',' + (k.y + 1) + '\n';
    }

    if (trek.shields >= total_damage) {
        trek.shields -= total_damage;
        msg += 'SHIELDS ABSORB HIT. SHIELDS: ' + trek.shields;
    } else {
        total_damage -= trek.shields;
        trek.shields = 0;
        trek.energy -= total_damage;
        msg += 'DAMAGE! ENERGY: ' + trek.energy + ' SHIELDS: 0';
        if (trek.energy <= 0) {
            trek.gameOver = true;
            msg += '\n*** ENTERPRISE DESTROYED! ***';
        }
    }
    return msg;
}

function trekOutput(text) {
    const output = document.getElementById('startrek-output');
    output.textContent = text;
    output.scrollTop = output.scrollHeight;
}

export function trekCommand() {
    if (trek.gameOver) {
        initTrek();
        trekOutput(getWelcome() + '\n\n' + shortRangeScan());
        document.getElementById('startrek-input').value = '';
        return;
    }

    const input = document.getElementById('startrek-input').value.toUpperCase().trim();
    document.getElementById('startrek-input').value = '';
    const parts = input.split(/\s+/);
    const cmd = parts[0];
    let result = '';

    if (trek.stardate >= trek.maxStardate) {
        trek.gameOver = true;
        trekOutput('*** TIME EXPIRED! KLINGONS CONQUER FEDERATION! ***');
        return;
    }

    switch (cmd) {
        case 'NAV':
            if (parts.length < 3) {
                result = 'NAV <course 1-8> <warp 1-8>\nCOURSE: 1=E 2=NE 3=N 4=NW 5=W 6=SW 7=S 8=SE';
            } else {
                result = navigate(parseFloat(parts[1]), parseFloat(parts[2]));
            }
            break;
        case 'SRS':
            result = shortRangeScan();
            break;
        case 'LRS':
            result = longRangeScan();
            break;
        case 'PHA':
            if (parts.length < 2) {
                result = 'PHA <energy>\nENERGY AVAILABLE: ' + trek.energy;
            } else {
                result = firePhasers(parseInt(parts[1]));
            }
            break;
        case 'TOR':
            if (parts.length < 2) {
                result = 'TOR <course 1-8>\nCOURSE: 1=E 2=NE 3=N 4=NW 5=W 6=SW 7=S 8=SE';
            } else {
                result = fireTorpedo(parseFloat(parts[1]));
            }
            break;
        case 'SHE':
            if (parts.length < 2) {
                result = 'SHE <amount>\nCURRENT: ' + trek.shields + ' MAX: ' + (trek.energy + trek.shields);
            } else {
                result = adjustShields(parseInt(parts[1]));
            }
            break;
        default:
            result = 'COMMANDS:\nNAV <course> <warp> - Navigate\nSRS - Short Range Scan\nLRS - Long Range Scan\nPHA <energy> - Fire Phasers\nTOR <course> - Fire Torpedo\nSHE <amount> - Set Shields';
    }

    trekOutput(result);
}

export function toggleStartrek() {
    toggleWindow('startrek-window');
}

export function initStartrekApp() {
    registerWindow('startrek-window', {
        x: 60, y: 60,
        onOpen: function() {
            initTrek();
            trekOutput(getWelcome() + '\n\n' + shortRangeScan());
            document.getElementById('startrek-input').value = '';
            document.getElementById('startrek-input').focus();
        }
    });

    document.getElementById('startrek-input').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            trekCommand();
        }
    });
}
