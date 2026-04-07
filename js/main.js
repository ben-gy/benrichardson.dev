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

// New Apps
import { initMacpaintApp, toggleMacpaint, mpSetTool, mpSetSize, mpClear } from './apps/macpaint.js';
import { initElizaApp, toggleEliza, elizaSend } from './apps/eliza.js';
import { initAlarmClockApp, toggleAlarmClock, alarmToggle } from './apps/alarmclock.js';
import { initScrapbookApp, toggleScrapbook, scrapbookPrev, scrapbookNext, scrapbookAdd, scrapbookCopy, scrapbookClear } from './apps/scrapbook.js';
import { initKeyCapsApp, toggleKeyCaps } from './apps/keycaps.js';

// New Games
import { initOregonApp, toggleOregon, oregonSubmit } from './games/oregon.js';
import { initBreakoutApp, toggleBreakout, breakoutStart } from './games/breakout.js';
import { initSnakeApp, toggleSnake, snakeStart } from './games/snake.js';
import { initHangmanApp, toggleHangman, hangmanGuess, hangmanNew } from './games/hangman.js';
import { initAdventureApp, toggleAdventure, advCmd } from './games/adventure.js';
import { initMinesweeperApp, toggleMinesweeper, minesNew } from './games/minesweeper.js';
import { initReversiApp, toggleReversi, reversiNew } from './games/reversi.js';
import { initMunchersApp, toggleMunchers } from './games/munchers.js';

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

// New Apps
window.toggleMacpaint = toggleMacpaint;
window.mpSetTool = mpSetTool;
window.mpSetSize = mpSetSize;
window.mpClear = mpClear;
window.toggleEliza = toggleEliza;
window.elizaSend = elizaSend;
window.toggleAlarmClock = toggleAlarmClock;
window.alarmToggle = alarmToggle;
window.toggleScrapbook = toggleScrapbook;
window.scrapbookPrev = scrapbookPrev;
window.scrapbookNext = scrapbookNext;
window.scrapbookAdd = scrapbookAdd;
window.scrapbookCopy = scrapbookCopy;
window.scrapbookClear = scrapbookClear;
window.toggleKeyCaps = toggleKeyCaps;

// New Games
window.toggleOregon = toggleOregon;
window.oregonSubmit = oregonSubmit;
window.toggleBreakout = toggleBreakout;
window.breakoutStart = breakoutStart;
window.toggleSnake = toggleSnake;
window.snakeStart = snakeStart;
window.toggleHangman = toggleHangman;
window.hangmanGuess = hangmanGuess;
window.hangmanNew = hangmanNew;
window.toggleAdventure = toggleAdventure;
window.advCmd = advCmd;
window.toggleMinesweeper = toggleMinesweeper;
window.minesNew = minesNew;
window.toggleReversi = toggleReversi;
window.reversiNew = reversiNew;
window.toggleMunchers = toggleMunchers;

// Enhancements (Browser API features)
import { initCRTFullscreen, toggleFullscreen } from './enhancements/crt-fullscreen.js';
import { initScreensaver, startScreensaver } from './enhancements/screensaver.js';
import { initSystemProfiler } from './enhancements/system-profiler.js';
import { initFileDrop } from './enhancements/file-drop.js';
import { initAmbientGlow } from './enhancements/ambient-glow.js';
import { initImageWriterPrint, printWindow } from './enhancements/print-imagewriter.js';
import { initDarkMode, toggleDarkMode } from './enhancements/dark-mode.js';

// Secrets / Easter Egg Directory
import { initSecrets, toggleSecrets, triggerSecret, discoverEgg, showSecretCredits, hideSecretCredits, showDebugInfo } from './secrets.js';

window.toggleFullscreen = toggleFullscreen;
window.printWindow = printWindow;
window.toggleDarkMode = toggleDarkMode;
window.startScreensaver = startScreensaver;

// Secrets
window.toggleSecrets = toggleSecrets;
window.triggerSecret = triggerSecret;
window.discoverEgg = discoverEgg;
window.showSecretCredits = showSecretCredits;
window.hideSecretCredits = hideSecretCredits;
window.showDebugInfo = showDebugInfo;

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
initMacpaintApp();
initElizaApp();
initAlarmClockApp();
initScrapbookApp();
initKeyCapsApp();
initOregonApp();
initBreakoutApp();
initSnakeApp();
initHangmanApp();
initAdventureApp();
initMinesweeperApp();
initReversiApp();
initMunchersApp();
initDraggable();
initDesktop();

// Enhancements
initCRTFullscreen();
initScreensaver();
initSystemProfiler();
initFileDrop();
initAmbientGlow();
initDarkMode();
initImageWriterPrint();

// Secrets (must be last - hooks into other modules)
initSecrets();

// Startup sequence
window.addEventListener('load', function() {
    initStartup();
});

