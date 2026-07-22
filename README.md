# Ben Richardson OS

A personal website styled as a classic 1984 Macintosh operating system, built with [system.css](https://github.com/sakofchit/system.css). Zero dependencies. Vanilla JS. 14 games. 9 apps. Easter eggs.

**Live site:** [benrichardson.dev](https://benrichardson.dev)

## Features at a Glance

- Pixel-perfect recreation of Apple Macintosh System 1 (1984)
- Draggable, resizable windows with classic Mac window chrome
- 9 desk accessories including MacPaint, ELIZA, Key Caps, and Scrapbook
- 14 playable games spanning 1960s mainframe classics to 1990s favorites
- Dark mode, CRT fullscreen, screensaver, ambient glow, and file drop enhancements
- Easter eggs triggered by keyboard shortcuts, drag-and-drop, and licence serials
- Authentic sound effects (startup chime, Chimes of Death, dial-up modem, and more)
- Responsive design — full desktop experience on large screens, adapted layout on mobile
- Modular ES6 architecture — no frameworks, no build step

## Menu Bar

| Menu | Items |
|------|-------|
| **Apple** | About This Mac, Licence..., Secrets..., Restart, Shut Down |
| **File** | About Ben..., Email..., Print..., Close All Windows |
| **Edit** | Copy Email, Find... |
| **View** | Read Me, Zoom In / Zoom Out, Refresh, Clean Up, Screensaver, Full Screen |
| **Sites** | GitHub, LinkedIn, Artemis Tracker |
| **Apps** | Calculator, Note Pad, Email, Internet, MacPaint, Eliza, Alarm Clock, Scrapbook, Key Caps |
| **Games** | Lunar Lander, Star Trek, Puzzle, Blackjack, Mastermind, Hamurabi, Oregon Trail, Breakout, Snake, Hangman, Adventure, Minesweeper, Reversi, Number Munchers |

The menu bar also includes a sound toggle, dark mode toggle, and a real-time clock display on the right side.

## Desktop Icons

| Icon | Name | Action |
|------|------|--------|
| Floppy disk | Apple OS 2 | Opens main window (personal info and links) |
| Envelope | Email | Opens email compose window |
| Globe | Internet | Opens Internet search window |
| Wrench | Tools | Opens the [hub tools directory](https://hub.benrichardson.dev/?type=tool) in a new tab |
| Windows | Sites | Opens the [hub sites directory](https://hub.benrichardson.dev/?type=web) in a new tab |
| "in" tile | LinkedIn | Opens LinkedIn profile in a new tab |
| Octocat | GitHub | Opens GitHub profile in a new tab |
| Trash can | Trash | Double-click to open the Trash window; drag desktop icons here to delete them |

All icons are draggable and snap to an 80x80 grid. Drag an icon over the Trash to remove it from the desktop. The Trash window lists what's inside — Artemis (the satellite) lives there permanently and double-clicking it opens [Artemis Tracker](https://artemistracker.benrichardson.dev); double-click any other trashed icon to put it back on the desktop.

## Apps (Desk Accessories)

| App | Description |
|-----|-------------|
| **Calculator** | Fully functional arithmetic calculator with safe expression evaluation |
| **Note Pad** | Multi-page text editor with 8 pages and localStorage persistence |
| **Email** | Compose window that opens a `mailto:` link to send a real email |
| **Internet Search** | Google search interface with dial-up modem sound effect |
| **MacPaint** | Drawing canvas with pencil, line, and flood fill tools plus adjustable brush size. Inspired by the original MacPaint by **Bill Atkinson** (1984) |
| **Eliza** | The classic 1966 chatbot by **Joseph Weizenbaum** — a Rogerian psychotherapist simulation with pattern matching and reflection |
| **Alarm Clock** | Real-time clock display with date and configurable alarm |
| **Scrapbook** | Multi-page clipboard manager — paste from and copy to your system clipboard |
| **Key Caps** | Virtual QWERTY keyboard for character input |

## Games

### Classic Era (1960s–1970s)

| Game | Based On | Description |
|------|----------|-------------|
| **Lunar Lander** | 1969 game by **Jim Storer** | Text-based moon landing simulation. Manage your fuel and thrust to land safely. One of the earliest computer games ever written |
| **Star Trek** | 1971 BASIC game by **Mike Mayfield** | Command the USS Enterprise against Klingon warships across an 8x8 galaxy. Text-based strategy with commands: `NAV`, `SRS`, `LRS`, `PHA`, `TOR`, `SHE` |
| **Hamurabi** | 1968 game by **Doug Dyment** | Resource management simulation — rule ancient Sumeria, balancing land, grain, and population. Originally written in FOCAL as "The Sumer Game" |
| **Mastermind** | 1970 board game by **Mordecai Meirowitz** | Code-breaking challenge — guess the hidden sequence using feedback from each attempt. Published by Invicta |
| **Adventure** | 1976 game by **Will Crowther & Don Woods** | Text-based exploration of Colossal Cave. Collect items, solve puzzles, and navigate by compass directions. The game that launched the adventure genre |

### Arcade & Board Games

| Game | Based On | Description |
|------|----------|-------------|
| **Puzzle** | Classic 15-puzzle (1874, **Noyes Chapman**) | Sliding tile puzzle — arrange numbered tiles 1–15 in order |
| **Blackjack** | Traditional casino card game | Play against the dealer with Hit, Stand, and Deal |
| **Breakout** | 1976 arcade game by **Steve Wozniak & Steve Jobs** (Atari) | Brick-breaking arcade game with paddle physics and scoring |
| **Snake** | 1976 arcade game **Blockade** (Gremlin Industries) | Guide a growing snake to eat food without hitting walls or yourself |
| **Hangman** | Traditional word game | Guess the hidden word letter by letter before the gallows drawing completes |
| **Minesweeper** | 1989 game by **Robert Donner & Curt Johnson** | 9x9 grid with 10 hidden mines. Click to reveal, right-click to flag |
| **Reversi** | 1883 board game (also known as **Othello**) | Classic strategy game on an 8x8 board against an AI opponent |
| **Number Munchers** | 1986 game by **MECC** | Educational math game — munch the correct numbers while avoiding Troggles. Modes: multiples, primes, factors |
| **Oregon Trail** | 1971 game by **Don Rawitsch, Bill Heinemann & Paul Dillenberger** (MECC) | Lead your wagon party from Missouri to Oregon. Manage supplies, hunt, trade, and survive random events |

## System Enhancements

| Enhancement | Description |
|-------------|-------------|
| **Dark Mode** | System-wide dark theme toggle from the menu bar |
| **CRT Fullscreen** | Fullscreen mode with authentic CRT scanline effect |
| **Screensaver** | Animated starfield screensaver, accessible from the View menu |
| **Ambient Glow** | Subtle background glow effect |
| **File Drop** | Drag and drop files onto the desktop |
| **System Profiler** | Dynamic memory bars in About This Mac based on open windows, with Battery API integration |
| **ImageWriter Print** | Print any window with a retro dot-matrix style |

## Sound Effects

| Sound | File | Trigger |
|-------|------|---------|
| Startup chime | `startup.wav` | Page load |
| Click | `click.wav` | UI interactions (buttons, menus, windows) |
| Key press | `key.wav` | Typing in text fields |
| System alert | `beep.wav` | Error dialogs and alerts |
| Dial-up modem | `dialup.wav` | Opening Internet search |
| Chimes of Death | `death.wav` | Sad Mac crash screen |

Toggle sounds on or off from the menu bar sound icon.

## Easter Eggs

There are **26 hidden easter eggs** to discover. The built-in Secrets Directory tracks your progress and provides hints for each one. Access it from the Apple menu (Secrets...) or the View menu (Read Me).

### Hints (No Spoilers)

| Category | What to Try |
|----------|-------------|
| **Keyboard** | The Konami Code, Ctrl+Shift combinations |
| **Drag & Drop** | Drag the floppy disk to unexpected places |
| **Click Tricks** | Rapid-click or triple-click the Apple logo |
| **Date & Time** | Visit on January 24th, Friday the 13th, late at night, or leave the page open for 30+ minutes |
| **Games** | Hidden commands in Star Trek, winning streaks in Blackjack, bad governance in Hamurabi, creative puzzle solutions, calculator extremes |
| **Typing** | Type "hello" on the desktop, use commands in Note Pad, search for a phone number |
| **System** | Wrong licence serial, opening too many windows, Shut Down, About This Mac |
| **Developer** | View Source, open DevTools, arrange all 4 icons in a 2x2 grid |

<details>
<summary><strong>Complete Easter Egg Guide (SPOILERS)</strong></summary>

### Keyboard Shortcuts

| # | Name | How to Trigger | What Happens |
|---|------|----------------|--------------|
| 1 | Konami Code | Press Up, Up, Down, Down, Left, Right, Left, Right, B, A | Opens the Secrets Directory |
| 2 | Bomb Dialog | Press Ctrl+Shift+B | Shows the classic Mac "Bomb" system error dialog |
| 3 | Sad Mac Crash | Press Ctrl+Shift+S | Displays the Sad Mac screen with error code 0F0003 |
| 4 | After Hours | Visit between 12 AM and 5 AM | Startup text changes to "Working late?" |

### Drag & Drop

| # | Name | How to Trigger | What Happens |
|---|------|----------------|--------------|
| 5 | System Disk Crash | Drag the floppy disk icon to the Trash | Triggers a Sad Mac crash with error code 0F0001 |
| 6 | Floppy Eject | Drag the floppy disk to the bottom edge of the screen | Floppy ejects with animation, then "Please insert a disk" prompt appears |
| 7 | Debug Mode | Arrange all 4 desktop icons into a 2x2 square grid | Unlocks a hidden "Debug" menu in the menu bar |

### Click Tricks

| # | Name | How to Trigger | What Happens |
|---|------|----------------|--------------|
| 8 | Sosumi Sound | Rapidly click the Apple logo 7 times | Plays the classic Sosumi alert sound with a modal |
| 9 | Secret Credits | Triple-click the Apple logo | Shows a scrolling credits sequence overlay |
| 10 | Console Greeting | Open the browser Developer Tools (F12) | ASCII art welcome message appears in the console |

### Date & Time

| # | Name | How to Trigger | What Happens |
|---|------|----------------|--------------|
| 11 | Macintosh Birthday | Visit on January 24th | Startup text reads "Happy Birthday, Macintosh! Born January 24, 1984" and the Apple logo briefly turns rainbow |
| 12 | Friday the 13th | Visit on any Friday the 13th | The clock randomly glitches to display "13:13 PM" |
| 13 | Screen Burn-In | Leave the page open and visible for 30+ minutes | A ghost/burn-in effect of the menu bar appears as an overlay |

### Game-Related

| # | Name | How to Trigger | What Happens |
|---|------|----------------|--------------|
| 14 | Calculator Overflow | Compute a very large number (e.g., 99999999 x 99999999) | Display shows "E" and the calculator buttons flash |
| 15 | Reverse Puzzle | Solve the 15-puzzle in reverse order (15, 14, 13... 1) | Displays a special congratulations modal |
| 16 | Pit Boss | Win 5 Blackjack hands in a row | A security alert: "The pit boss has noticed your winning streak." Blackjack closes |
| 17 | Revolution | Let more than 45% of the population starve in Hamurabi | The people revolt against your rule |
| 18 | Kobayashi Maru | Type `KOBAYASHI` or `KOBAYASHI MARU` in Star Trek | Triggers the famous no-win scenario message |

### Typing Commands

| # | Name | How to Trigger | What Happens |
|---|------|----------------|--------------|
| 19 | MacPaint Hello | Type "hello" anywhere on the desktop (not in an input field) | MacPaint opens and draws "hello" in calligraphic style |
| 20 | Notepad Commands | Type `HELP`, `ABOUT`, `DIR`, `DATE`, or `VER` in Note Pad | Displays system information responses |
| 21 | DTMF Dialing | Type a phone number (7+ digits) in the Internet search box | Synthesizes DTMF tones and shows an "ATDT" modem dialing sequence, followed by "NO CARRIER" |

### System & Menu

| # | Name | How to Trigger | What Happens |
|---|------|----------------|--------------|
| 22 | Stolen From Apple | Enter the wrong serial number in Apple menu > Licence | Displays a "STOLEN FROM APPLE COMPUTER" message |
| 23 | Shut Down | Select Apple menu > Shut Down | Shows a shutdown sequence and blanks the screen |
| 24 | Scrolling Credits | Select Apple menu > About This Mac | Shows system information modal with credits |
| 25 | Memory Overflow | Open too many windows at once | Triggers a Sad Mac crash with error code 0F0004 |

### Meta

| # | Name | How to Trigger | What Happens |
|---|------|----------------|--------------|
| 26 | View Source | View the page source code (Ctrl+U / Cmd+Option+U) | Hidden ASCII art easter egg in the HTML comments |

</details>

## File Structure

```
benrichardson.dev/
├── index.html                  # HTML structure (windows, modals, menus)
├── style.css                   # system.css base styles
├── app.css                     # Application styles (windows, games, enhancements)
├── legal.css                   # Shared styles for privacy and support pages
├── CNAME                       # GitHub Pages custom domain
├── LICENSE                     # GNU AGPL v3.0 or later
├── favicon.ico / favicon.svg   # Browser favicons
├── apple-touch-icon.png/.svg   # iOS home screen icons
├── fonts/
│   ├── ChicagoFLF.*            # Classic Mac system font
│   ├── ChiKareGo2.*            # Pixel font
│   ├── FindersKeepers.*        # Display font
│   └── monaco.*                # Monaco monospace font
├── icon/
│   ├── apple.svg               # Apple logo (menu bar)
│   ├── Floppy.png              # Floppy disk (desktop)
│   ├── Mail.png                # Email (desktop)
│   ├── Safari.png              # Internet (desktop)
│   ├── Artemis.svg/.png        # Artemis satellite (lives in the Trash)
│   ├── Tools.png               # Tools wrench (desktop)
│   ├── Sites.png               # Sites windows (desktop)
│   ├── LinkedIn.png            # LinkedIn tile (desktop)
│   ├── GitHub.png              # GitHub octocat (desktop)
│   ├── Trash empty.png         # Empty trash
│   ├── Trash full.png          # Full trash
│   ├── sad-mac.svg             # Sad Mac easter egg
│   ├── sound-on/off.svg        # Sound toggle icons
│   ├── sun.svg / moon.svg      # Dark mode toggle icons
│   ├── mac-hd.svg              # Hard drive icon
│   ├── button*.svg             # Button border images
│   └── (+ document, email, floppy, internet, person, trash SVGs)
├── sounds/
│   ├── startup.wav             # Mac startup chime
│   ├── click.wav               # Mouse/UI click
│   ├── key.wav                 # Keyboard press
│   ├── beep.wav                # System alert
│   ├── dialup.wav              # Modem handshake
│   └── death.wav               # Chimes of Death
├── js/
│   ├── main.js                 # Entry point — imports and initializes all modules
│   ├── system.js               # Sad Mac, Trash, Licence, Restart, Shutdown, Clock
│   ├── desktop.js              # Desktop initialization and draggable setup
│   ├── window-manager.js       # Window positioning, z-index, memory checking
│   ├── sound-manager.js        # Web Audio API integration
│   ├── utils.js                # Modals, alerts, Find, Zoom, menus
│   ├── secrets.js              # 26 easter eggs, Secrets Directory, discovery tracking
│   ├── apps/
│   │   ├── calculator.js       # Arithmetic calculator
│   │   ├── notepad.js          # Multi-page notepad with localStorage
│   │   ├── email.js            # Email composer (mailto:)
│   │   ├── search.js           # Google search interface
│   │   ├── macpaint.js         # Drawing canvas with tools
│   │   ├── eliza.js            # ELIZA chatbot
│   │   ├── alarmclock.js       # Clock and alarm
│   │   ├── scrapbook.js        # Clipboard manager
│   │   └── keycaps.js          # Virtual keyboard
│   ├── games/
│   │   ├── lander.js           # Lunar Lander
│   │   ├── startrek.js         # Star Trek
│   │   ├── puzzle.js           # 15-Puzzle
│   │   ├── blackjack.js        # Blackjack
│   │   ├── mastermind.js       # Mastermind
│   │   ├── hamurabi.js         # Hamurabi
│   │   ├── oregon.js           # Oregon Trail
│   │   ├── breakout.js         # Breakout
│   │   ├── snake.js            # Snake
│   │   ├── hangman.js          # Hangman
│   │   ├── adventure.js        # Colossal Cave Adventure
│   │   ├── minesweeper.js      # Minesweeper
│   │   ├── reversi.js          # Reversi / Othello
│   │   └── munchers.js         # Number Munchers
│   └── enhancements/
│       ├── dark-mode.js        # Dark theme toggle
│       ├── crt-fullscreen.js   # CRT scanline fullscreen
│       ├── screensaver.js      # Starfield screensaver
│       ├── ambient-glow.js     # Background glow effect
│       ├── file-drop.js        # Drag-and-drop file support
│       ├── system-profiler.js  # About This Mac system info
│       └── print-imagewriter.js # Retro print functionality
├── splash/
│   ├── iphone-8.png            # iOS splash screen
│   ├── iphone-12.png
│   ├── iphone-14-pro.png
│   └── iphone-14-pro-max.png
├── privacy/
│   └── index.html              # Privacy policy page
└── support/
    └── index.html              # Support page
```

All fonts are served in `.woff` and `.woff2` formats.

## Technical Details

### Architecture

The application follows a modular ES6 architecture:

- **`index.html`** — Pure HTML structure (~900 lines): windows, modals, menus, desktop icons
- **`app.css`** — All application styling (windows, games, dark mode, enhancements)
- **`style.css`** — system.css base framework
- **`js/main.js`** — Entry point that imports and initializes all modules, exposes functions to `window` for `onclick` handlers
- **`js/system.js`** — Core system features (Sad Mac, Trash, Licence, clock, easter eggs)
- **`js/window-manager.js`** — Window lifecycle, positioning, z-index stacking, memory management (Sad Mac at 5+ windows)
- **`js/sound-manager.js`** — Web Audio API with deferred context initialization
- **`js/apps/`** — Each desk accessory as an isolated module
- **`js/games/`** — Each game as an isolated module
- **`js/enhancements/`** — Optional features (dark mode, CRT, screensaver, etc.)

### Stack

- **Vanilla HTML, CSS, and JavaScript** — no frameworks, no bundler, no build step
- **ES6 modules** with `<script type="module">` entry point
- **system.css** for the Macintosh System 1 UI foundation
- **Web Audio API** for sound effects
- **Canvas API** for graphical games (Breakout, Snake, Minesweeper, Hangman, MacPaint)
- **localStorage** for notepad persistence and clipboard management
- **Battery API** for system profiler (where supported)
- **Static hosting** on GitHub Pages with a custom domain via CNAME

### Responsive Design

- **Desktop:** Full experience with draggable/resizable windows and desktop icons
- **Mobile (< 480px):** Windows expand to full width, desktop icons hidden for usability

### Additional Pages

- `/privacy/` — Privacy policy (styled with `legal.css`)
- `/support/` — Support page (styled with `legal.css`)

Both are standalone HTML pages for App Store compliance.

## Development

This is a static site. To run locally:

```bash
git clone https://github.com/ben-gy/benrichardson.dev.git
cd benrichardson.dev
python -m http.server 8000
```

Or with Node.js:

```bash
npx serve .
```

Then open [http://localhost:8000](http://localhost:8000).

**Note:** ES6 modules require a local server — opening `index.html` directly via `file://` will not work due to CORS restrictions on module imports.

## Credits & Attributions

### Framework & UI

- **[system.css](https://github.com/sakofchit/system.css)** by Sakun Acharige ([@sakofchit](https://github.com/sakofchit)) — Macintosh System 1 CSS framework
- **Original Macintosh icons** by Susan Kare (1984)

### Game Origins

| Game | Original Creator(s) | Year | Notes |
|------|---------------------|------|-------|
| Lunar Lander | Jim Storer | 1969 | One of the earliest computer games |
| Star Trek | Mike Mayfield | 1971 | Originally written in BASIC |
| Hamurabi | Doug Dyment | 1968 | Originally "The Sumer Game" in FOCAL |
| Mastermind | Mordecai Meirowitz | 1970 | Board game, published by Invicta |
| Adventure | Will Crowther & Don Woods | 1976 | Colossal Cave, the first text adventure |
| Oregon Trail | Don Rawitsch, Bill Heinemann & Paul Dillenberger | 1971 | Published by MECC |
| Breakout | Steve Wozniak & Steve Jobs | 1976 | Atari arcade game |
| Snake | Gremlin Industries (Blockade) | 1976 | Arcade game |
| Minesweeper | Robert Donner & Curt Johnson | 1989 | Bundled with Windows 3.1 |
| Reversi | Lewis Waterman & John Mollett | 1883 | Also known as Othello |
| Number Munchers | MECC | 1986 | Educational math game |
| 15-Puzzle | Noyes Chapman | 1874 | Classic sliding tile puzzle |
| Hangman | Traditional | — | Word guessing game |
| Blackjack | Traditional | — | Casino card game |

### App Origins

| App | Original Creator | Year | Notes |
|-----|-----------------|------|-------|
| MacPaint | Bill Atkinson | 1984 | Bundled with the original Macintosh |
| ELIZA | Joseph Weizenbaum | 1966 | MIT, one of the first chatbots |
| Scrapbook | Apple Computer | 1984 | Original Mac desk accessory |
| Key Caps | Apple Computer | 1984 | Original Mac desk accessory |
| Alarm Clock | Apple Computer | 1984 | Original Mac desk accessory |
| Calculator | Apple Computer | 1984 | Original Mac desk accessory |
| Note Pad | Apple Computer | 1984 | Original Mac desk accessory |

### Fonts

- **ChicagoFLF** — Recreation of the classic Macintosh system font designed by Susan Kare
- **ChiKareGo2** — Pixel font for retro aesthetic
- **FindersKeepers** — Display font
- **Monaco** — Monospace font used in terminal-style interfaces

### Sound Effects

Public domain recordings of classic Macintosh sounds.

### Special Thanks

Susan Kare, Bill Atkinson, Andy Hertzfeld, and Steve Jobs — for creating the original Macintosh that inspired this project.

### Tools

Created with assistance from [Claude Code](https://claude.ai/code) by Anthropic.

### Author

Created by **Ben Richardson** — [benrichardson.dev](https://benrichardson.dev)

## license

[GNU Affero General Public License v3.0 or later](./LICENSE), with an attribution
requirement added under section 7(b) — see
[ADDITIONAL-TERMS.md](./ADDITIONAL-TERMS.md).

In short: you may run, modify, redistribute and even sell this, but if you
distribute it — or run a modified version where other people can reach it — you
have to publish your source under the same licence and keep the attribution. A
separate commercial licence without those obligations is available on request:
<hi@ben.gy>.

Third-party components keep their own licences — see
[THIRD-PARTY-NOTICES.md](./THIRD-PARTY-NOTICES.md).
