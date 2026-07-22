// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Ben Richardson — https://benrichardson.dev
// Additional terms under AGPL-3.0 section 7(b) apply; see ADDITIONAL-TERMS.md.
// ============ EMAIL ============

import { registerWindow, toggleWindow } from '../window-manager.js';
import { closeAllDropdowns, showAlert } from '../utils.js';

export function copyEmailAddress() {
    navigator.clipboard.writeText('hi@benrichardson.dev');
    showAlert('Email copied to clipboard!');
}

export function sendEmail() {
    const subject = encodeURIComponent(document.getElementById('email-subject').value);
    const body = encodeURIComponent(document.getElementById('email-body').value);
    window.location.href = 'mailto:hi@benrichardson.dev?subject=' + subject + '&body=' + body;
    toggleEmail();
}

export function toggleEmail() {
    closeAllDropdowns();
    toggleWindow('email-window');
}

export function initEmail() {
    registerWindow('email-window', {
        x: 80, y: 90,
        onOpen: function() {
            document.getElementById('email-subject').value = '';
            document.getElementById('email-body').value = '';
            document.getElementById('email-subject').focus();
        }
    });

    document.getElementById('email-subject').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('email-body').focus();
        }
    });
}
