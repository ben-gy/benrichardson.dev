// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Ben Richardson — https://benrichardson.dev
// Additional terms under AGPL-3.0 section 7(b) apply; see ADDITIONAL-TERMS.md.
// ============ DESKTOP FILE DROP (Drag and Drop API + File API) ============
// Drag real files from your computer onto the virtual desktop.
// They appear as retro document icons. Double-click shows "Get Info."

const droppedFiles = [];

function createDropZone() {
    const desktop = document.getElementById('desktop-grid');
    if (!desktop) return;

    // Prevent default drag behavior on the whole page
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(event => {
        document.body.addEventListener(event, function(e) {
            e.preventDefault();
            e.stopPropagation();
        });
    });

    // Visual feedback when dragging over desktop
    document.body.addEventListener('dragenter', function() {
        desktop.classList.add('drop-target');
    });

    document.body.addEventListener('dragleave', function(e) {
        if (!e.relatedTarget || e.relatedTarget === document.documentElement) {
            desktop.classList.remove('drop-target');
        }
    });

    document.body.addEventListener('drop', function(e) {
        desktop.classList.remove('drop-target');

        const files = e.dataTransfer.files;
        if (files.length === 0) return;

        for (let i = 0; i < files.length; i++) {
            addFileIcon(files[i], e.clientX, e.clientY + (i * 90));
        }
    });

    // Inject styles
    const style = document.createElement('style');
    style.textContent = `
        .desktop-grid.drop-target {
            background: rgba(0, 0, 0, 0.05);
            outline: 2px dashed rgba(0, 0, 0, 0.3);
            outline-offset: -4px;
        }

        .dropped-file-icon {
            position: absolute;
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
            padding: 0.5rem;
            user-select: none;
            width: 80px;
            height: 80px;
            pointer-events: auto;
            box-sizing: border-box;
            z-index: 2;
        }

        .dropped-file-icon:hover {
            background: rgba(0,0,0,0.1);
        }

        .dropped-file-icon.selected {
            background: black;
            color: white;
        }

        .dropped-file-icon .file-icon-img {
            width: 48px;
            height: 48px;
            image-rendering: pixelated;
        }

        .dropped-file-icon span {
            font-family: 'ChicagoFLF', 'ChiKareGo2', monospace;
            font-size: 10px;
            margin-top: 2px;
            text-align: center;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: 76px;
        }

        .file-info-window {
            font-family: Chicago_12, 'ChiKareGo2', monospace;
            font-size: 12px;
        }

        .file-info-window .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 4px;
        }

        .file-info-window .info-label {
            font-weight: bold;
        }
    `;
    document.head.appendChild(style);
}

function addFileIcon(file, clientX, clientY) {
    const desktop = document.getElementById('desktop-grid');
    const gridRect = desktop.getBoundingClientRect();

    // Snap to grid
    const GRID_SIZE = 80;
    const GRID_PADDING = 10;
    let x = Math.round(((clientX - gridRect.left) - GRID_PADDING) / GRID_SIZE) * GRID_SIZE + GRID_PADDING;
    let y = Math.round(((clientY - gridRect.top) - GRID_PADDING) / GRID_SIZE) * GRID_SIZE + GRID_PADDING;

    // Keep in bounds
    x = Math.max(GRID_PADDING, Math.min(x, gridRect.width - GRID_SIZE - GRID_PADDING));
    y = Math.max(GRID_PADDING, Math.min(y, gridRect.height - GRID_SIZE - GRID_PADDING));

    const icon = document.createElement('div');
    icon.className = 'dropped-file-icon';
    icon.style.left = x + 'px';
    icon.style.top = y + 'px';

    // Truncate filename
    const name = file.name.length > 12 ? file.name.substring(0, 10) + '...' : file.name;

    icon.innerHTML = `
        <img class="file-icon-img" src="icon/document.svg" alt="File">
        <span title="${file.name}">${name}</span>
    `;

    // Store file info
    const fileInfo = {
        name: file.name,
        size: file.size,
        type: file.type || 'unknown',
        lastModified: new Date(file.lastModified),
        file: file
    };
    droppedFiles.push(fileInfo);

    // Click to select
    icon.addEventListener('click', function(e) {
        e.stopPropagation();
        document.querySelectorAll('.dropped-file-icon, .desktop-icon').forEach(i => i.classList.remove('selected'));
        icon.classList.add('selected');
    });

    // Double-click for Get Info
    icon.addEventListener('dblclick', function(e) {
        e.stopPropagation();
        showFileInfo(fileInfo);
    });

    desktop.appendChild(icon);
}

function showFileInfo(fileInfo) {
    const { showAlert } = window._systemFns || {};

    const sizeStr = formatFileSize(fileInfo.size);
    const dateStr = fileInfo.lastModified.toLocaleDateString('en-US', {
        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
    });

    const msg = `Get Info: ${fileInfo.name}\n` +
                `Size: ${sizeStr}\n` +
                `Type: ${fileInfo.type}\n` +
                `Modified: ${dateStr}`;

    if (showAlert) {
        showAlert(msg);
    }
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 bytes';
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export function initFileDrop() {
    createDropZone();
}
