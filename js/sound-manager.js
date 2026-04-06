// ============ SOUND MANAGER (Web Audio API) ============

let audioContext = null;
const audioBuffers = {};
const activeSources = {};
let soundEnabled = false;

export function initAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        loadSound('beep', 'sounds/beep.wav');
        loadSound('startup', 'sounds/startup.wav');
        loadSound('death', 'sounds/death.wav');
        loadSound('dialup', 'sounds/dialup.wav');
    }
}

async function loadSound(name, url) {
    try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        audioBuffers[name] = await audioContext.decodeAudioData(arrayBuffer);
    } catch (e) {
        console.warn('Failed to load sound:', name, e);
    }
}

export function playSound(name) {
    if (!soundEnabled || !audioContext || !audioBuffers[name]) return;

    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffers[name];
    source.connect(audioContext.destination);
    source.start(0);

    activeSources[name] = source;
}

export function stopSound(name) {
    if (activeSources[name]) {
        try {
            activeSources[name].stop();
        } catch (e) {}
        delete activeSources[name];
    }
}

export function toggleSound() {
    soundEnabled = !soundEnabled;
    const icon = document.getElementById('sound-icon');
    icon.src = soundEnabled ? 'icon/sound-on.svg' : 'icon/sound-off.svg';
    if (!soundEnabled) {
        Object.keys(activeSources).forEach(name => stopSound(name));
    }
}

export function isSoundEnabled() {
    return soundEnabled;
}
