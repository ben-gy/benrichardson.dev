# Ben Richardson OS

A personal website styled as a classic 1984 Macintosh operating system, built with [system.css](https://github.com/sakofchit/system.css).

**Live site:** [benrichardson.dev](https://benrichardson.dev)

## Overview

This is a single-page website that recreates the look and feel of the original Apple Macintosh System 1 (1984). It features draggable and resizable windows, working desk accessories, classic sound effects, easter eggs, and a fully functional menu bar.

## Features

### Menu Bar

| Menu | Items |
|------|-------|
| **Apple** | About This Mac, Licence..., Restart, Shut Down |
| **File** | About Ben, Email, Print, Close All Windows |
| **Edit** | Copy Email, Find |
| **View** | View Source, Zoom In/Out, Refresh, Clean Up, Sound Toggle |
| **Sites** | GitHub, LinkedIn |
| **Apps** | Calculator, Note Pad, Email, Internet |
| **Games** | Lunar Lander, Star Trek, Puzzle, Blackjack, Mastermind, Hamurabi |

### Windows

All windows are draggable, resizable, closeable, and support the classic Mac window chrome.

- **Main Window** - Personal info and links
- **Calculator** - Fully functional calculator
- **Note Pad** - Multi-page text editor with page navigation
- **Email** - Compose window (opens mailto: link)
- **Internet Search** - Google search in new tab

### Games

| Game | Description |
|------|-------------|
| **Lunar Lander** | Classic 1969 moon landing simulation. Control thrust to land safely! |
| **Star Trek** | 1971 BASIC game. Command the Enterprise against Klingons across an 8x8 galaxy |
| **Puzzle** | 15-puzzle sliding tile game |
| **Blackjack** | Classic casino card game against the dealer |
| **Mastermind** | Code-breaking game - guess the 4-color secret code |
| **Hamurabi** | 1968 resource management game - rule ancient Sumeria for 10 years |

### Desktop Icons

Draggable icons with 80x80 grid snapping:
- **Apple OS 2** (floppy disk, top-right) - Opens main window
- **Email** (top-left) - Opens email compose
- **Internet** (left) - Opens search window
- **Trash** (bottom-right) - Drag icons here to delete them

### Sound Effects

Classic Macintosh sounds triggered by various actions:
- **Startup chime** - On page load
- **Click** - UI interactions
- **Beep** - Alerts and errors
- **Dial-up modem** - Internet icon double-click
- **Chimes of Death** - Sad Mac screen

Toggle sounds from View menu.

### Easter Eggs

| Trigger | Effect |
|---------|--------|
| Konami Code | Up Up Down Down Left Right Left Right B A |
| Ctrl+Shift+B | Bomb dialog (system error) |
| Ctrl+Shift+S | Sad Mac screen |
| Drag floppy to Trash | Sad Mac (ejecting system disk!) |
| Open 5+ windows | Sad Mac (out of memory) |
| Shut Down | "Safe to turn off" screen |
| Licence... (wrong serial) | "STOLEN FROM APPLE COMPUTER" |

## File Structure

```
benrichardson.dev/
├── index.html          # Main application
├── style.css           # system.css base styles
├── CNAME               # GitHub Pages custom domain
├── LICENSE             # MIT License
├── fonts/
│   ├── ChicagoFLF.*    # Classic Mac system font
│   ├── ChiKareGo2.*    # Pixel font for retro look
│   ├── FindersKeepers.*
│   └── monaco.*        # Monaco monospace font
├── icon/
│   ├── apple.svg       # Apple logo for menu bar
│   ├── floppy.svg      # Floppy disk (system disk)
│   ├── trash.svg       # Trash can icon
│   ├── email.svg       # Email desktop icon
│   ├── internet.svg    # Internet/globe icon
│   ├── document.svg    # Document icon
│   ├── person.svg      # Person/contact icon
│   ├── sad-mac.svg     # Sad Mac easter egg
│   └── button*.svg     # Button border images
└── sounds/
    ├── startup.mp3     # Mac startup chime
    ├── click.mp3       # Mouse/UI click
    ├── beep.mp3        # System alert
    ├── dialup.mp3      # Modem handshake
    └── death.mp3       # Chimes of Death
```

## Technical Details

### Architecture

The entire application is contained in `index.html`:
- Embedded CSS (custom styles on top of system.css)
- HTML structure (windows, modals, menus)
- JavaScript (all interactivity, games, sound)

### Responsive Design

- Desktop: Full experience with draggable/resizable windows and icons
- Mobile (<480px): Windows full-width, desktop icons hidden

## Credits

- **system.css** by [@sakofchit](https://github.com/sakofchit/system.css)
- **Original Macintosh icons** by Susan Kare (1984)
- **Lunar Lander** based on the 1969 game by Jim Storer
- **Star Trek** based on the 1971 BASIC game by Mike Mayfield
- **Hamurabi** based on the 1968 game by Doug Dyment
- **Mastermind** based on the 1970 game by Mordecai Meirowitz
- **Sound effects** from various public domain sources
- **Created with assistance from** Claude Code by Anthropic
- **Created by** Ben Richardson

## Development

This is a static site hosted on GitHub Pages. To run locally:

```bash
git clone https://github.com/ben-gy/benrichardson.dev.git
cd benrichardson.dev
python -m http.server 8000
```

## License

MIT License - see [LICENSE](LICENSE)
