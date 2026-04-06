// ============ SYSTEM PROFILER (Battery API + Navigator APIs) ============
// Enhances the "About This Mac" dialog with real device info styled as retro specs.

export function initSystemProfiler() {
    updateSystemInfo();
    // Refresh periodically for battery updates
    setInterval(updateSystemInfo, 30000);
}

async function updateSystemInfo() {
    const container = document.getElementById('about-mac-info');
    if (!container) return;

    const rows = [];

    // Device memory (show as kilobytes for comedy)
    if (navigator.deviceMemory) {
        const kb = navigator.deviceMemory * 1024 * 1024;
        rows.push(makeRow('Memory', formatKB(kb) + 'K'));
    }

    // CPU cores
    if (navigator.hardwareConcurrency) {
        rows.push(makeRow('Processors', navigator.hardwareConcurrency + ' cores'));
    }

    // Network status
    if (navigator.onLine !== undefined) {
        const status = navigator.onLine ? 'Connected' : 'Disconnected';
        rows.push(makeRow('AppleTalk', status));
    }

    // Connection type
    if (navigator.connection) {
        const type = navigator.connection.effectiveType || 'unknown';
        rows.push(makeRow('Network', type.toUpperCase()));
    }

    // Battery
    try {
        if (navigator.getBattery) {
            const battery = await navigator.getBattery();
            const level = Math.round(battery.level * 100);
            const charging = battery.charging ? ' (AC Adapter)' : ' (Battery)';
            rows.push(makeRow('Power', level + '%' + charging));

            // Update memory bar to show battery level
            const barFill = document.querySelector('.about-mac-bar-fill');
            if (barFill) {
                barFill.style.width = level + '%';
            }
        }
    } catch (e) {
        // Battery API not available
    }

    // Screen resolution
    rows.push(makeRow('Display', window.screen.width + ' x ' + window.screen.height));

    // Language
    rows.push(makeRow('System', navigator.language || 'en'));

    // Only update if we have data
    if (rows.length > 0) {
        // Find or create the system info section
        let sysInfo = document.getElementById('system-profiler-info');
        if (!sysInfo) {
            sysInfo = document.createElement('div');
            sysInfo.id = 'system-profiler-info';
            sysInfo.style.cssText = 'font-size: 0.85rem; margin-bottom: 0.5rem;';

            const divider = document.createElement('div');
            divider.className = 'about-mac-divider';

            // Insert before the credits section
            const credits = container.closest('.about-mac-contents')?.querySelector('.about-mac-credits');
            if (credits) {
                credits.parentNode.insertBefore(divider, credits);
                credits.parentNode.insertBefore(sysInfo, credits);
            }
        }

        sysInfo.innerHTML = '<div style="margin-bottom: 4px; font-weight: bold;">System Profiler</div>' + rows.join('');
    }
}

function makeRow(label, value) {
    return `<div class="about-mac-row"><span>${label}:</span><span>${value}</span></div>`;
}

function formatKB(kb) {
    if (kb >= 1000000) return (kb / 1000000).toFixed(0) + ',000';
    if (kb >= 1000) return Math.round(kb).toLocaleString();
    return Math.round(kb).toString();
}
