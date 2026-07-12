# Dance Practice Helper

An interactive, offline-first tool for memorizing dance landmarks and timing, specifically designed for **Bachata** and **West Coast Swing (WCS)**.

## 🚀 Deployed Application
The application is deployed and available to use at:
👉 **[https://siddiqaa.github.io/DancePracticeHelperV2/](https://siddiqaa.github.io/DancePracticeHelperV2/)**

---

## 🎨 Design Philosophy
The Dance Practice Helper is designed with a cohesive **Slate Dark** aesthetic:
- **High-contrast, eye-safe palette**: Utilizes deep gray and charcoal backgrounds (`slate-950`, `slate-900`) combined with high-contrast text (`slate-100`, `slate-400`) and modern colored indicators.
- **Intentional Mastery Themes**: Clear visual feedback of progress status using specific color mappings:
  - 🔴 **Learning**: Muted slate gray (`slate-400`)
  - 🟡 **Familiar**: Warm amber (`amber-400`)
  - 🟢 **Mastered**: Vibrant emerald (`emerald-400`)

---

## ⚡ Core Features
1. **Isolated Practice Tools**:
   - Includes a centralized static dashboard linking to specialized chunked practice modules:
     - **West Coast Swing Chunked Practice (`/chunked_wcs.html`)**
     - **Bachata Chunked Practice (`/chunked_bachata.html`)**
2. **Audio-Visual Decoupled Architecture**:
   - Implements a robust **Lookahead Scheduling Pattern** with the Web Audio API to schedule rock-solid metronome and chime beats in advance, decoupling audio scheduling from DOM repaint frequencies to prevent visual stutter.
3. **Advance Timing HUD HUD**:
   - Seamless mechanical transition preparation. Shows the text/color of the *next* move slightly before the current sequence ends:
     - **WCS**: Shits visual HUD warning on anchor beats (last 2 beats of the pattern) accompanied by chime accents.
     - **Bachata**: Shifts visual warning early on the characteristic "tap" (beat 4 and 8) with accent chimes.
4. **Randomized Drill Mode**:
   - Triggers dynamic landmark practicing with an automated, smooth 3-2-1 buffer countdown overlay between transition sequences to keep drills engaging.
5. **No-Database Sync & State Persistence**:
   - Mastery states are persisted locally in `localStorage`. 
   - A custom **Sync Modal Pattern** allows users to serialize their current configuration back to a code-ready format to hardcode progress directly in their local files.

---

## 🛠️ Local Development & Technical Compliance
The codebase maintains **strict zero-server local-first compliance**:
- **CORS-Free Execution**: No dynamic network requests are made; all assets are loaded via CDNs and data structures are statically stored inline, enabling the app to run completely from a local directory under the `file://` protocol.
- **Testing**: Built-in end-to-end tests using **Playwright**.

### Running Tests
To run the automated tests locally:
```bash
# Install dependencies
npm install

# Install Playwright browser binaries
npx playwright install

# Run the test suite
npm test
```
