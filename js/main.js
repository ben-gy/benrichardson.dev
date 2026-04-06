// ============ MAIN ENTRY POINT ============
// Imports all modules and exposes functions to window for onclick handlers

import { initAudioContext, toggleSound, playSound, stopSound } from './sound-manager.js';
import { initDraggable, closeAllWindows, cleanUp } from './window-manager.js';
import { closeAllDropdowns, showModal, hideModal, showAlert, showAboutMac, showFindDialog, doFind, zoomIn, zoomOut } from './utils.js';
import { initSystem, initStartup, showSadMac, hideSadMac, restartSystem, shutDown, showDate, hideDateModal, showMainWindow, showAboutBen, closeMainWindow, showLicence, toggleLicence, submitLicence, emptyTrash, updateClock } from './system.js';
import { initDesktop } from './desktop.js';

// Apps
import { initCalculator, toggleCalculator, calcInput, calcClear, calcBackspace, calcEquals } from './apps/calculator.js';
import { initNotepad, toggleNotePad, nextNotePage } from './apps/notepad.js';
import { initEmail, toggleEmail, copyEmailAddress, sendEmail } from './apps/email.js';
import { initSearch, toggleSearch, searchGoogle } from './apps/search.js';

// Games
import { initLanderApp, toggleLander, landerBurn } from './games/lander.js';
import { initStartrekApp, toggleStartrek, trekCommand } from './games/startrek.js';
import { initPuzzleApp, togglePuzzle, shufflePuzzle } from './games/puzzle.js';
import { initBlackjackApp, toggleBlackjack, bjNewGame, bjHit, bjStand } from './games/blackjack.js';
import { initMastermindApp, toggleMastermind, mmGuess } from './games/mastermind.js';
import { initHamurabiApp, toggleHamurabi, hamSubmit } from './games/hamurabi.js';

// ============ EXPOSE TO WINDOW (for onclick handlers in HTML) ============

// Provide system functions to window-manager for circular dep resolution
window._systemFns = { showSadMac, showAlert };

// Utils
window.closeAllDropdowns = closeAllDropdowns;
window.showModal = showModal;
window.hideModal = hideModal;
window.showAlert = showAlert;
window.showAboutMac = showAboutMac;
window.showFindDialog = showFindDialog;
window.doFind = doFind;
window.zoomIn = zoomIn;
window.zoomOut = zoomOut;

// System
window.showSadMac = showSadMac;
window.hideSadMac = hideSadMac;
window.restartSystem = restartSystem;
window.shutDown = shutDown;
window.showDate = showDate;
window.hideDateModal = hideDateModal;
window.showMainWindow = showMainWindow;
window.showAboutBen = showAboutBen;
window.closeMainWindow = closeMainWindow;
window.showLicence = showLicence;
window.toggleLicence = toggleLicence;
window.submitLicence = submitLicence;
window.emptyTrash = emptyTrash;
window.closeAllWindows = closeAllWindows;
window.cleanUp = cleanUp;

// Sound
window.toggleSound = toggleSound;

// Apps
window.toggleCalculator = toggleCalculator;
window.calcInput = calcInput;
window.calcClear = calcClear;
window.calcBackspace = calcBackspace;
window.calcEquals = calcEquals;
window.toggleNotePad = toggleNotePad;
window.nextNotePage = nextNotePage;
window.toggleEmail = toggleEmail;
window.copyEmailAddress = copyEmailAddress;
window.sendEmail = sendEmail;
window.toggleSearch = toggleSearch;
window.searchGoogle = searchGoogle;

// Games
window.toggleLander = toggleLander;
window.landerBurn = landerBurn;
window.toggleStartrek = toggleStartrek;
window.trekCommand = trekCommand;
window.togglePuzzle = togglePuzzle;
window.shufflePuzzle = shufflePuzzle;
window.toggleBlackjack = toggleBlackjack;
window.bjNewGame = bjNewGame;
window.bjHit = bjHit;
window.bjStand = bjStand;
window.toggleMastermind = toggleMastermind;
window.mmGuess = mmGuess;
window.toggleHamurabi = toggleHamurabi;
window.hamSubmit = hamSubmit;

// Enhancements (Browser API features)
import { initCRTFullscreen, toggleFullscreen } from './enhancements/crt-fullscreen.js';
import { initScreensaver } from './enhancements/screensaver.js';
import { initSystemProfiler } from './enhancements/system-profiler.js';
import { initFileDrop } from './enhancements/file-drop.js';
import { initAmbientGlow } from './enhancements/ambient-glow.js';
import { initImageWriterPrint, printWindow } from './enhancements/print-imagewriter.js';

window.toggleFullscreen = toggleFullscreen;
window.printWindow = printWindow;

// ============ INITIALIZATION ============

// Initialize audio on first interaction
document.addEventListener('mousedown', function() {
    initAudioContext();
}, { once: true });

// Initialize all modules
initSystem();
initCalculator();
initNotepad();
initEmail();
initSearch();
initLanderApp();
initStartrekApp();
initPuzzleApp();
initBlackjackApp();
initMastermindApp();
initHamurabiApp();
initDraggable();
initDesktop();

// Enhancements
initCRTFullscreen();
initScreensaver();
initSystemProfiler();
initFileDrop();
initAmbientGlow();
initImageWriterPrint();

// Startup sequence
window.addEventListener('load', function() {
    initStartup();
});

