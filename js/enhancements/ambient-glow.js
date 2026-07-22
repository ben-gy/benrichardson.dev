// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Ben Richardson — https://benrichardson.dev
// Additional terms under AGPL-3.0 section 7(b) apply; see ADDITIONAL-TERMS.md.
// ============ AMBIENT CRT GLOW (prefers-color-scheme) ============
// In dark mode, adds a subtle CRT monitor glow that simulates
// the way a real CRT illuminates a dark room.

export function initAmbientGlow() {
    const style = document.createElement('style');
    style.textContent = `
        @media (prefers-color-scheme: dark) {
            body {
                background-color: #1a1a1a;
            }

            /* CRT glow effect around the desktop */
            body::after {
                content: '';
                position: fixed;
                top: 28px;
                left: 0;
                right: 0;
                bottom: 0;
                pointer-events: none;
                z-index: 0;
                box-shadow:
                    0 0 60px 20px rgba(255, 255, 255, 0.06),
                    0 0 120px 40px rgba(200, 220, 255, 0.03);
                border-radius: 4px;
            }

            /* Subtle screen flicker */
            @keyframes crt-subtle-flicker {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.995; }
            }

            ul[role="menu-bar"],
            .window,
            .desktop-grid {
                animation: crt-subtle-flicker 4s ease-in-out infinite;
            }
        }
    `;
    document.head.appendChild(style);
}
