// ============ SYSTEM PROFILER (Battery API + Navigator APIs) ============
// Updates the "About This Mac" memory bars in real-time based on actual
// open windows and system state. Bars animate to reflect current usage.

let updateInterval = null;
let battery = null;

export function initSystemProfiler() {
    // Try to get battery reference once
    if (navigator.getBattery) {
        navigator.getBattery().then(b => {
            battery = b;
            // Update on battery events
            b.addEventListener('levelchange', updateSystemInfo);
            b.addEventListener('chargingchange', updateSystemInfo);
        }).catch(() => {});
    }

    // Update every second for real-time memory bars
    updateSystemInfo();
    updateInterval = setInterval(updateSystemInfo, 1000);
}

function updateSystemInfo() {
    // Count open windows as "memory usage"
    let openWindows = 0;
    document.querySelectorAll('.window').forEach(w => {
        if (w.style.display !== 'none' && w.id) openWindows++;
    });

    const totalMem = 128; // 128K total (authentic Mac 128K)
    const systemMem = 24 + (openWindows * 6); // Base 24K + 6K per window
    const finderMem = 32 + (openWindows * 8); // Base 32K + 8K per window
    const usedMem = systemMem + finderMem;
    const freeMem = Math.max(0, totalMem - usedMem);

    // Update the existing About Mac elements
    const totalEl = document.getElementById('about-total-mem');
    const systemMemEl = document.getElementById('about-system-mem');
    const finderMemEl = document.getElementById('about-finder-mem');
    const freeMemEl = document.getElementById('about-free-mem');
    const systemBar = document.getElementById('about-system-bar');
    const finderBar = document.getElementById('about-finder-bar');

    if (totalEl) totalEl.textContent = totalMem + 'K';
    if (systemMemEl) systemMemEl.textContent = systemMem + 'K';
    if (finderMemEl) finderMemEl.textContent = finderMem + 'K';
    if (freeMemEl) freeMemEl.textContent = freeMem + 'K';

    if (systemBar) {
        systemBar.style.transition = 'width 0.5s ease';
        systemBar.style.width = Math.round((systemMem / totalMem) * 100) + '%';
    }
    if (finderBar) {
        finderBar.style.transition = 'width 0.5s ease';
        finderBar.style.width = Math.round((finderMem / totalMem) * 100) + '%';
    }

    // Add real device info below the memory section
    updateDeviceInfo();
}

function updateDeviceInfo() {
    let sysInfo = document.getElementById('system-profiler-info');

    // Only create once
    if (!sysInfo) {
        sysInfo = document.createElement('div');
        sysInfo.id = 'system-profiler-info';
        sysInfo.style.cssText = 'font-size: 0.85rem;';

        const divider = document.createElement('div');
        divider.className = 'about-mac-divider';

        const credits = document.querySelector('.about-mac-credits');
        if (credits) {
            credits.parentNode.insertBefore(divider, credits);
            credits.parentNode.insertBefore(sysInfo, credits);
        }
    }

    const rows = [];

    // Real device memory in retro KB
    if (navigator.deviceMemory) {
        const kb = navigator.deviceMemory * 1024 * 1024;
        rows.push(makeRow('Real RAM', formatKB(kb) + 'K'));
    }

    // CPU cores
    if (navigator.hardwareConcurrency) {
        rows.push(makeRow('Processors', navigator.hardwareConcurrency));
    }

    // Network
    const status = navigator.onLine ? 'Connected' : 'Disconnected';
    rows.push(makeRow('AppleTalk', status));

    // Battery (uses cached reference)
    if (battery) {
        const level = Math.round(battery.level * 100);
        const charging = battery.charging ? ' (AC)' : ' (Batt)';
        rows.push(makeRow('Power', level + '%' + charging));
    }

    // Display
    rows.push(makeRow('Display', window.screen.width + '\u00d7' + window.screen.height));

    sysInfo.innerHTML = rows.join('');
}

function makeRow(label, value) {
    return '<div class="about-mac-row"><span>' + label + ':</span><span>' + value + '</span></div>';
}

function formatKB(kb) {
    if (kb >= 1000000) return Math.round(kb / 1000000).toLocaleString() + ',000';
    return Math.round(kb).toLocaleString();
}
