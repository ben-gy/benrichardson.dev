// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Ben Richardson — https://benrichardson.dev
// Additional terms under AGPL-3.0 section 7(b) apply; see ADDITIONAL-TERMS.md.
// ============ PRINT TO "IMAGEWRITER" (Print API + CSS @media print) ============
// Triggers window.print() with custom print styles that simulate
// a dot-matrix ImageWriter printout. Always prints the About Ben content.

export function printWindow() {
    // Ensure main window is visible before printing
    const mainWindow = document.getElementById('main-window');
    const wasHidden = mainWindow && mainWindow.style.display === 'none';
    if (wasHidden) {
        mainWindow.style.display = 'block';
    }

    window.print();

    // Restore if it was hidden
    if (wasHidden) {
        mainWindow.style.display = 'none';
    }
}

export function initImageWriterPrint() {
    const style = document.createElement('style');
    style.textContent = `
        @media print {
            body {
                background: white !important;
                margin: 0 !important;
                padding: 0 !important;
                filter: none !important;
            }

            /* Hide non-content elements */
            #startup-screen,
            .sad-mac-screen,
            .desktop-grid,
            ul[role="menu-bar"],
            .modal-overlay,
            #crt-overlay,
            #screensaver,
            #phosphor-decay {
                display: none !important;
            }

            /* Always show main window for printing */
            #main-window {
                display: block !important;
                position: relative !important;
                left: auto !important;
                top: auto !important;
                margin: 2rem auto !important;
                width: 100% !important;
                max-width: 600px !important;
                resize: none !important;
                box-shadow: none !important;
                border: 2px solid #000 !important;
            }

            /* Hide other windows */
            .window:not(#main-window) {
                display: none !important;
            }

            /* Clean up content for print */
            #main-window .window-pane {
                font-family: 'Courier New', monospace !important;
                letter-spacing: 0.5px;
                max-height: none !important;
                overflow: visible !important;
                padding: 1.5rem !important;
            }

            #main-window .title-bar {
                border-bottom: 2px solid #000;
                padding: 0.5rem;
            }

            #main-window .title-bar .close,
            #main-window .title-bar .hidden {
                display: none !important;
            }

            /* ImageWriter footer */
            body::after {
                content: 'Printed on Apple ImageWriter II';
                display: block;
                text-align: center;
                font-family: 'Courier New', monospace;
                font-size: 9px;
                color: #999;
                margin-top: 2rem;
                padding-top: 1rem;
                border-top: 1px dotted #ccc;
            }

            @page {
                margin: 1.5cm;
            }
        }
    `;
    document.head.appendChild(style);
}
