# Ben Richardson OS

Indie hacker, aerospace engineer, full-stack founder.

A personal website styled as a classic 1984 Macintosh operating system, built with [system.css](https://github.com/sakofchit/system.css).

**Live site:** [benrichardson.dev](https://benrichardson.dev)

## Overview

This is a single-page website that recreates the look and feel of the original Apple Macintosh System 1 (1984). It features draggable windows, working desk accessories, easter eggs, and a fully functional menu bar.

## File Structure

```
benrichardson.dev/
├── index.html          # Main application (~1600 lines)
├── style.css           # system.css base styles
├── CNAME               # GitHub Pages custom domain
├── LICENSE             # MIT License
├── fonts/
│   ├── ChicagoFLF.*    # Classic Mac system font
│   ├── ChiKareGo2.*    # Pixel font for retro look
│   ├── FindersKeepers.*
│   └── monaco.*        # Monaco monospace font
└── icon/
    ├── apple.svg       # Apple logo for menu bar
    ├── mac-hd.svg      # Macintosh HD desktop icon
    ├── trash.svg       # Trash can icon
    ├── email.svg       # Email desktop icon
    ├── internet.svg    # Internet/globe icon
    ├── document.svg    # Document icon
    ├── person.svg      # Person/contact icon
    ├── sad-mac.svg     # Sad Mac easter egg
    ├── button.svg      # Button border image
    └── button-default.svg
```

## Features

### Menu Bar

| Menu | Items |
|------|-------|
| **Apple** | About This Mac, Restart, Shut Down |
| **File** | About Ben, Email, WhatsApp, Print, Close All Windows |
| **Edit** | Copy Email, Find |
| **View** | View Source, Zoom In/Out, Refresh, Clean Up |
| **Sites** | GitHub, LinkedIn |
| **Apps** | Calculator, Puzzle, Note Pad, Email, WhatsApp, Internet, Lunar Lander |

### Windows

All windows are draggable (desktop and touch), closeable, and support the classic Mac window chrome.

- **Main Window** - Personal info and links
- **Calculator** - Fully functional calculator
- **Puzzle** - 15-puzzle sliding tile game
- **Note Pad** - Multi-page text editor with page navigation
- **Email** - Compose window (opens mailto: link)
- **WhatsApp** - Secret contact feature with encrypted phone number
- **Internet Search** - Google search in new tab
- **Lunar Lander** - Text-based game (1976 style)

### Desktop Icons

Draggable icons with 80x80 grid snapping:
- **Macintosh HD** (top-right) - Opens main window
- **Email** (top-left) - Opens email compose
- **Internet** (left) - Opens search window
- **Trash** (bottom-right) - Empties when double-clicked

### Easter Eggs

| Trigger | Effect |
|---------|--------|
| Konami Code | ↑↑↓↓←→←→BA - Shows alert |
| Ctrl+Shift+B | Bomb dialog (system error) |
| Ctrl+Shift+S | Sad Mac screen |
| Shut Down | "Safe to turn off" screen |

### Games

**Lunar Lander** - A faithful recreation of the 1976 text-based game:
- Turn-based physics simulation
- Control fuel burn rate (0-30) each turn
- Land safely with velocity < 2 MI/S
- Starting conditions: 120 MI altitude, 1600 fuel

## Technical Details

### Architecture

The entire application is contained in `index.html`:
- **Lines 1-370**: Embedded CSS (custom styles on top of system.css)
- **Lines 371-750**: HTML structure (windows, modals, menus)
- **Lines 751-1646**: JavaScript (all interactivity)

### Key JavaScript Functions

```javascript
// Window management
toggleCalculator(), togglePuzzle(), toggleNotePad()
toggleEmail(), toggleWhatsApp(), toggleSearch(), toggleLander()
closeAllWindows(), cleanUp()

// Desktop icons
makeDraggable(element, handle)  // Enables window/icon dragging
snapToGrid(value)               // 80px grid snapping for icons

// Games
initLander(), landerBurn(), updateLanderDisplay()
initPuzzle(), moveTile(), checkWin()

// Utilities
showModal(id), hideModal(id), showAlert(message)
centerWindow(windowEl)
```

### CSS Classes

| Class | Purpose |
|-------|---------|
| `.window` | Base window container |
| `.title-bar` | Draggable window header |
| `.window-pane` | Scrollable content area |
| `.desktop-icon` | Desktop icon container |
| `.desktop-grid` | Fixed container for icons |
| `.modal-overlay` | Dialog backdrop |
| `.btn`, `.btn-default` | Button styles |

### Responsive Design

- Desktop: Full experience with draggable windows and icons
- Mobile (<480px): Windows full-width, desktop icons hidden

## Credits

- **system.css** by [@sakofchit](https://github.com/sakofchit/system.css)
- **Original Macintosh icons** by Susan Kare (1984)
- **Lunar Lander** based on the 1976 text game by Jim Storer
- **Created by** Ben Richardson

## Development

This is a static site hosted on GitHub Pages. To run locally:

```bash
# Clone the repo
git clone https://github.com/ben-gy/benrichardson.dev.git
cd benrichardson.dev

# Serve locally (Python 3)
python -m http.server 8000

# Or use any static file server
npx serve
```

## License

MIT License - see [LICENSE](LICENSE)
