// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Ben Richardson — https://benrichardson.dev
// Additional terms under AGPL-3.0 section 7(b) apply; see ADDITIONAL-TERMS.md.
// ============ MACPAINT ============

import { registerWindow, toggleWindow } from '../window-manager.js';

const mp = {
    tool: 'pencil',
    size: 1,
    drawing: false,
    lastX: 0,
    lastY: 0,
    startX: 0,
    startY: 0,
    snapshot: null
};

function mpGetPos(e) {
    const canvas = document.getElementById('macpaint-canvas');
    const rect = canvas.getBoundingClientRect();
    return {
        x: (e.clientX - rect.left) * (canvas.width / rect.width),
        y: (e.clientY - rect.top) * (canvas.height / rect.height)
    };
}

function mpFloodFill(ctx, startX, startY, fillR, fillG, fillB) {
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;
    const sx = Math.floor(startX);
    const sy = Math.floor(startY);
    if (sx < 0 || sx >= w || sy < 0 || sy >= h) return;
    const idx = (sy * w + sx) * 4;
    const tR = data[idx], tG = data[idx+1], tB = data[idx+2];
    if (tR === fillR && tG === fillG && tB === fillB) return;
    const stack = [[sx, sy]];
    while (stack.length > 0) {
        const [cx, cy] = stack.pop();
        const ci = (cy * w + cx) * 4;
        if (cx < 0 || cx >= w || cy < 0 || cy >= h) continue;
        if (data[ci] !== tR || data[ci+1] !== tG || data[ci+2] !== tB) continue;
        data[ci] = fillR; data[ci+1] = fillG; data[ci+2] = fillB; data[ci+3] = 255;
        stack.push([cx+1, cy], [cx-1, cy], [cx, cy+1], [cx, cy-1]);
    }
    ctx.putImageData(imgData, 0, 0);
}

function mpInitCanvas() {
    const canvas = document.getElementById('macpaint-canvas');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    canvas.addEventListener('mousedown', function(e) {
        const pos = mpGetPos(e);
        mp.drawing = true;
        mp.lastX = pos.x; mp.lastY = pos.y;
        mp.startX = pos.x; mp.startY = pos.y;

        if (mp.tool === 'fill') {
            mpFloodFill(ctx, pos.x, pos.y, 0, 0, 0);
            mp.drawing = false; return;
        }
        if (mp.tool === 'pencil' || mp.tool === 'eraser') {
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, mp.size / 2, 0, Math.PI * 2);
            ctx.fillStyle = mp.tool === 'eraser' ? 'white' : 'black';
            ctx.fill();
        }
        if (mp.tool === 'line' || mp.tool === 'rect' || mp.tool === 'oval') {
            mp.snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
        }
    });

    canvas.addEventListener('mousemove', function(e) {
        if (!mp.drawing) return;
        const pos = mpGetPos(e);
        if (mp.tool === 'pencil' || mp.tool === 'eraser') {
            ctx.beginPath(); ctx.moveTo(mp.lastX, mp.lastY); ctx.lineTo(pos.x, pos.y);
            ctx.strokeStyle = mp.tool === 'eraser' ? 'white' : 'black';
            ctx.lineWidth = mp.size; ctx.lineCap = 'round'; ctx.stroke();
            mp.lastX = pos.x; mp.lastY = pos.y;
        } else if (mp.tool === 'line') {
            ctx.putImageData(mp.snapshot, 0, 0);
            ctx.beginPath(); ctx.moveTo(mp.startX, mp.startY); ctx.lineTo(pos.x, pos.y);
            ctx.strokeStyle = 'black'; ctx.lineWidth = mp.size; ctx.stroke();
        } else if (mp.tool === 'rect') {
            ctx.putImageData(mp.snapshot, 0, 0);
            ctx.strokeStyle = 'black'; ctx.lineWidth = mp.size;
            ctx.strokeRect(mp.startX, mp.startY, pos.x - mp.startX, pos.y - mp.startY);
        } else if (mp.tool === 'oval') {
            ctx.putImageData(mp.snapshot, 0, 0);
            const cx = (mp.startX + pos.x) / 2, cy = (mp.startY + pos.y) / 2;
            const rx = Math.abs(pos.x - mp.startX) / 2, ry = Math.abs(pos.y - mp.startY) / 2;
            ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
            ctx.strokeStyle = 'black'; ctx.lineWidth = mp.size; ctx.stroke();
        }
    });

    canvas.addEventListener('mouseup', function() { mp.drawing = false; mp.snapshot = null; });
    canvas.addEventListener('mouseleave', function() { mp.drawing = false; mp.snapshot = null; });
}

export function mpSetTool(tool) {
    mp.tool = tool;
    document.querySelectorAll('.macpaint-tool').forEach(function(b) { b.classList.remove('active'); });
    document.getElementById('mp-tool-' + tool).classList.add('active');
}

export function mpSetSize(size) {
    mp.size = size;
    document.querySelectorAll('.macpaint-size').forEach(function(b) { b.classList.remove('active'); });
    document.getElementById('mp-size-' + size).classList.add('active');
}

export function mpClear() {
    const canvas = document.getElementById('macpaint-canvas');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

export function toggleMacpaint() { toggleWindow('macpaint-window'); }

export function initMacpaintApp() {
    registerWindow('macpaint-window', {
        x: 40, y: 50,
        onOpen: function() { mpInitCanvas(); }
    });
}
