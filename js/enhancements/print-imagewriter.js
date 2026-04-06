// ============ PRINT TO "IMAGEWRITER" (Print API + CSS @media print) ============
// Triggers window.print() with custom print styles that simulate
// a dot-matrix ImageWriter printout.

export function printWindow() {
    window.print();
}

export function initImageWriterPrint() {
    const style = document.createElement('style');
    style.textContent = `
        @media print {
            /* Hide everything except the topmost visible window */
            body {
                background: white !important;
                margin: 0 !important;
                padding: 0 !important;
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

            /* Style visible windows for printing */
            .window {
                position: relative !important;
                left: auto !important;
                top: auto !important;
                margin: 1rem auto !important;
                width: 100% !important;
                max-width: 600px !important;
                resize: none !important;
                box-shadow: none !important;
                page-break-inside: avoid;
            }

            /* Hide windows that aren't visible */
            .window[style*="display: none"] {
                display: none !important;
            }

            /* Dot-matrix effect on text */
            .window-pane {
                font-family: 'Courier New', monospace !important;
                letter-spacing: 0.5px;
                max-height: none !important;
                overflow: visible !important;
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

            /* Tractor feed perforations */
            @page {
                margin: 1.5cm;
            }
        }
    `;
    document.head.appendChild(style);
}
