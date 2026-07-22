// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Ben Richardson — https://benrichardson.dev
// Additional terms under AGPL-3.0 section 7(b) apply; see ADDITIONAL-TERMS.md.
// ============ ALARM CLOCK ============

import { registerWindow, toggleWindow } from '../window-manager.js';

let alarmTime = null;
let alarmInterval = null;
let alarmActive = false;

function update() {
    const now = new Date();
    let h = now.getHours(), m = now.getMinutes(), s = now.getSeconds();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    document.getElementById('alarmclock-display').textContent = h + ':' + String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0') + ' ' + ampm;
    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    document.getElementById('alarmclock-date').textContent = days[now.getDay()] + ', ' + months[now.getMonth()] + ' ' + now.getDate() + ', ' + now.getFullYear();
    if (alarmActive && alarmTime) {
        const nowTime = String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0');
        if (nowTime === alarmTime && now.getSeconds() === 0) {
            const { showAlert } = window._systemFns || {};
            if (showAlert) showAlert('ALARM!');
            alarmActive = false;
            document.getElementById('alarmclock-alarm-display').textContent = 'Alarm: OFF';
        }
    }
}

export function alarmToggle() {
    const timeInput = document.getElementById('alarmclock-time');
    if (!alarmActive && timeInput.value) {
        alarmTime = timeInput.value; alarmActive = true;
        const parts = alarmTime.split(':');
        let h = parseInt(parts[0]), m = parts[1];
        const ampm = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12;
        document.getElementById('alarmclock-alarm-display').textContent = 'Alarm: ' + h + ':' + m + ' ' + ampm;
    } else { alarmActive = false; document.getElementById('alarmclock-alarm-display').textContent = 'Alarm: OFF'; }
}

export function toggleAlarmClock() { toggleWindow('alarmclock-window'); }

export function initAlarmClockApp() {
    registerWindow('alarmclock-window', {
        x: 140, y: 80,
        onOpen: function() {
            if (alarmInterval) clearInterval(alarmInterval);
            update(); alarmInterval = setInterval(update, 1000);
        },
        onClose: function() {
            if (alarmInterval) { clearInterval(alarmInterval); alarmInterval = null; }
        }
    });
}
