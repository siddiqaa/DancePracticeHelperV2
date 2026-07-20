# Developer & Coding Instructions

## 1. Core Philosophy & Local-First Execution
- **Zero Server Dependencies**: The application is a static dashboard (`index.html`) linking to specialized, isolated practice tools (`/chunked_wcs.html`, `/chunked_bachata.html`). All files must remain **fully static, self-contained, and loadable directly on a local machine** (using the `file://` protocol in a browser) without requiring a running development/HTTP server.
- **No AJAX/Fetch on Local Resources**: Never use `fetch()` or `XMLHttpRequest` to load local `.json`, `.html`, or data files. Doing so will trigger CORS blocking in modern browsers when opened locally.
- **Inline Data Source**: All data arrays (landmark lists, tempos, metadata) must remain inline in JS variables/constants or bundled in imported scripts.
- **Allowed Asset Extraction**: JavaScript and CSS blocks can be extracted to separate files in the same root folder (e.g., `/chunked_bachata.js`, `/chunked_bachata.css`) to improve readability, as long as they are referenced cleanly via relative local paths.
- **Avoid External Local Assets**: All external assets (icons, fonts, CSS) must be loaded via public CDNs (e.g., Tailwind CDN, Google Fonts) or embedded directly (SVG paths).

## 2. Audio-Visual Decoupled Architecture (CRITICAL)
To ensure rock-solid metronome timing without UI jank, the application strictly decouples Web Audio scheduling from DOM rendering using a **Lookahead Scheduling Pattern**.

- **The Audio Scheduler (The Engine)**: A recurring `setInterval` loop (`scheduler()`) calculates upcoming beats using `DanceAudio.getCurrentTime()`. It schedules precise audio playback events into the future using the Web Audio API context.
- **The Event Queue (`beatsQueue`)**: As the audio scheduler pushes audio nodes into the future, it simultaneously pushes corresponding metadata (beat index, move name, timestamp) into a shared `beatsQueue` array.
- **The Visual Render Loop (The HUD)**: A separate `requestAnimationFrame` loop (`draw()`) continuously polls `DanceAudio.getCurrentTime()`. When the current time passes the scheduled `time` of the oldest item in `beatsQueue`, it pops the item and triggers DOM updates (`triggerVisualBeatFeedback()`).
- **Rule**: NEVER trigger visual UI updates directly from the audio `scheduler()`. Always push to `beatsQueue` and let `draw()` handle it.

## 3. Audio and HUD Synchronization Logic
- **Preemptive Next-Move Display**: The HUD updates to display the *next* move slightly before the current move finishes, providing advance warning for dancers to prepare.
- **Timing Windows (`triggerVisualBeatFeedback`)**: The display of the next move is triggered early based on the specific dance style's musicality:
  - **West Coast Swing (WCS)**: The HUD shifts on the anchor beats—specifically, when the audio engine reaches the **last 2 beats** of the current move (`playedBeat.beat >= playedBeat.beatsTotal - 2`). WCS also uses a chime accent on these anchor beats.
  - **Bachata**: The HUD shifts early on the characteristic "tap"—specifically, on **beat 4 or beat 8** of the musical phrase (`playedBeat.beat >= 3`). Bachata uses a chime accent on this tap beat.
- **Result**: This exact synchronization ensures the dancer hears the final resolving beats of their current sequence while simultaneously seeing the text/color for the upcoming sequence, enabling seamless mechanical transitions.

## 4. Randomized Drill Mode Mechanics
The application features a "Randomized Landmark Drills" mode (`isRandomMode`).
- **Completion Detection**: Inside `triggerVisualBeatFeedback()`, the app checks if the currently rendered beat is the absolute final beat of the final move of the current landmark.
- **Halt & Reset Pipeline**: If true, it triggers `triggerRandomCountdown()`. This immediately sets `isPaused = true`, clears the `scheduler` interval, empties the `beatsQueue`, and selects a random new landmark.
- **Visual Overlay**: It then un-hides the `countdownDisplay` overlay to give the user a 3-2-1 visual buffer before `startScheduler()` is recursively re-invoked for the new landmark.

## 5. Data Structure & State Persistence
- **The Data Truth (`LANDMARKS`)**: Each tool defines its entire structure inside a global `const LANDMARKS` array.
- **Mastery State Storage**: User progress (`mastered`, `familiar`, `learning`) is saved in the browser's `localStorage` under specific keys (e.g., `bachata_mastery_state`).
- **The Sync Modal Pattern**: Because the app runs locally without a database, saving progress back into the source code is handled via the "Sync" modal. It takes the merged `localStorage` state, serializes it back into a valid JavaScript `const LANDMARKS = [...]` text block, and allows the user to copy/paste it over the existing source code, hardcoding their progress.

## 6. UI & CSS Guidelines
- **Aesthetic Theme**: Maintain the "Slate Dark" aesthetic across all tools. Use Tailwind CSS utility classes, focusing heavily on `slate-950` backgrounds, `slate-850`/`slate-800` borders, and high-contrast text (`slate-100`/`slate-400`).
- **Visual Hierarchy & Mastery Configurations**: Use `MASTERY_CONFIG` (mapping 'learning' to `slate-400`, 'familiar' to `amber-400`, 'mastered' to `emerald-400`) to color-code UI text, borders, and progress bars.
- **Animations**: Prefer lightweight CSS transitions (`active-move-animate`, `bg-opacity` fades) for HUD updates. Avoid heavy JS-based animations.

## 7. Testing & Development Dependencies
- **Playwright**: Playwright is used for end-to-end testing and must be listed as a `devDependencies` in `package.json`.
- **Test Maintenance**: You must ensure that unit and E2E tests are updated after any modifications to the code.
- **Test Execution**: ONLY trigger running of the E2E tests upon explicit user instruction. Do not automatically run tests when making code changes unless asked.
- **Browser Binaries**: The browser binaries required for Playwright are installed automatically via the `postinstall` script in `package.json` (`npx playwright install`) at the start of container deployment.
