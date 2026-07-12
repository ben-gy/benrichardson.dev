// ============ DESKTOP ICON SELECTION & DRAGGING ============

import { playSound } from './sound-manager.js';
import { showSadMac, addToTrash } from './system.js';

const GRID_SIZE = 80;
const GRID_PADDING = 10;

function snapToGrid(value) {
    return Math.round((value - GRID_PADDING) / GRID_SIZE) * GRID_SIZE + GRID_PADDING;
}

function checkTrashCollision(icon) {
    if (icon.id === 'trash-icon') return false;

    const iconRect = icon.getBoundingClientRect();
    const trashRect = document.getElementById('trash-icon').getBoundingClientRect();

    const overlap = !(iconRect.right < trashRect.left ||
                     iconRect.left > trashRect.right ||
                     iconRect.bottom < trashRect.top ||
                     iconRect.top > trashRect.bottom);

    if (overlap) {
        if (icon.id === 'hd-icon') {
            icon.style.display = 'none';
            addToTrash(icon.id);
            playSound('beep');
            setTimeout(function() {
                showSadMac('0F0001', true);
            }, 300);
            return true;
        }
        playSound('beep');
        icon.style.display = 'none';
        addToTrash(icon.id);
        return true;
    }
    return false;
}

export function initDesktop() {
    document.querySelectorAll('.desktop-icon').forEach(function(icon) {
        let isDragging = false;
        let hasMoved = false;
        let startX, startY, iconStartX, iconStartY;

        icon.addEventListener('mousedown', function(e) {
            if (e.button !== 0) return;
            e.preventDefault();

            const rect = icon.getBoundingClientRect();
            const gridRect = document.getElementById('desktop-grid').getBoundingClientRect();

            startX = e.clientX;
            startY = e.clientY;
            iconStartX = rect.left - gridRect.left;
            iconStartY = rect.top - gridRect.top;

            icon.style.left = iconStartX + 'px';
            icon.style.top = iconStartY + 'px';
            icon.style.right = '';
            icon.style.bottom = '';

            isDragging = true;
            hasMoved = false;
            icon.classList.add('dragging');
        });

        icon.addEventListener('click', function(e) {
            if (hasMoved) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }
            document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
            this.classList.add('selected');
        });

        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;

            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;

            if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
                hasMoved = true;
            }

            const gridRect = document.getElementById('desktop-grid').getBoundingClientRect();
            let newX = iconStartX + deltaX;
            let newY = iconStartY + deltaY;

            newX = Math.max(GRID_PADDING, Math.min(newX, gridRect.width - GRID_SIZE - GRID_PADDING));
            newY = Math.max(GRID_PADDING, Math.min(newY, gridRect.height - GRID_SIZE - GRID_PADDING));

            icon.style.left = newX + 'px';
            icon.style.top = newY + 'px';
        });

        document.addEventListener('mouseup', function(e) {
            if (!isDragging) return;
            isDragging = false;
            icon.classList.remove('dragging');

            if (hasMoved) {
                if (checkTrashCollision(icon)) return;

                let currentX = parseFloat(icon.style.left);
                let currentY = parseFloat(icon.style.top);

                icon.style.left = snapToGrid(currentX) + 'px';
                icon.style.top = snapToGrid(currentY) + 'px';
            }
        });

        // Touch support
        icon.addEventListener('touchstart', function(e) {
            const touch = e.touches[0];
            isDragging = true;
            hasMoved = false;
            icon.classList.add('dragging');

            const rect = icon.getBoundingClientRect();
            const gridRect = document.getElementById('desktop-grid').getBoundingClientRect();

            startX = touch.clientX;
            startY = touch.clientY;
            iconStartX = rect.left - gridRect.left;
            iconStartY = rect.top - gridRect.top;

            icon.style.left = iconStartX + 'px';
            icon.style.top = iconStartY + 'px';
            icon.style.right = '';
            icon.style.bottom = '';
        }, { passive: true });

        icon.addEventListener('touchmove', function(e) {
            if (!isDragging) return;
            const touch = e.touches[0];

            const deltaX = touch.clientX - startX;
            const deltaY = touch.clientY - startY;

            if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
                hasMoved = true;
            }

            const gridRect = document.getElementById('desktop-grid').getBoundingClientRect();
            let newX = iconStartX + deltaX;
            let newY = iconStartY + deltaY;

            newX = Math.max(GRID_PADDING, Math.min(newX, gridRect.width - GRID_SIZE - GRID_PADDING));
            newY = Math.max(GRID_PADDING, Math.min(newY, gridRect.height - GRID_SIZE - GRID_PADDING));

            icon.style.left = newX + 'px';
            icon.style.top = newY + 'px';
        }, { passive: true });

        icon.addEventListener('touchend', function(e) {
            if (!isDragging) return;
            isDragging = false;
            icon.classList.remove('dragging');

            if (hasMoved) {
                if (checkTrashCollision(icon)) return;

                let currentX = parseFloat(icon.style.left);
                let currentY = parseFloat(icon.style.top);

                icon.style.left = snapToGrid(currentX) + 'px';
                icon.style.top = snapToGrid(currentY) + 'px';
            }
        });
    });

    document.addEventListener('click', function(e) {
        if (!e.target.closest('.desktop-icon')) {
            document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
        }
    });

    // Mobile menu handling
    initMobileMenu();
}

function initMobileMenu() {
    const menuItems = document.querySelectorAll('ul[role="menu-bar"] > [role="menu-item"][aria-haspopup="true"]');

    function closeAllMenus() {
        menuItems.forEach(function(item) {
            item.classList.remove('menu-open');
        });
    }

    document.querySelectorAll('ul[role="menu"] a').forEach(function(link) {
        link.addEventListener('click', function() {
            const parentMenuItem = this.closest('ul[role="menu-bar"] > [role="menu-item"]');
            if (parentMenuItem) {
                parentMenuItem.blur();
            }
            closeAllMenus();
        });
    });

    menuItems.forEach(function(menuItem) {
        menuItem.addEventListener('click', function(e) {
            if (e.target.closest('ul[role="menu"] a')) {
                closeAllMenus();
                return;
            }

            e.preventDefault();
            e.stopPropagation();

            const isOpen = this.classList.contains('menu-open');
            closeAllMenus();

            if (!isOpen) {
                this.classList.add('menu-open');
            }
        });
    });

    document.addEventListener('click', function(e) {
        if (!e.target.closest('ul[role="menu-bar"]')) {
            closeAllMenus();
        }
    });

    document.addEventListener('touchstart', function(e) {
        if (!e.target.closest('ul[role="menu-bar"]')) {
            closeAllMenus();
        }
    }, { passive: true });
}
