/**
 * common_practice.js
 * Consolidated training state handlers, mastery mechanics, and syncing utilities.
 * Shared between West Coast Swing and Bachata.
 */

// Centralized configuration for mastery states
const MASTERY_CONFIG = {
    learning: {
        text: 'Learning',
        textColor: 'text-rose-900 font-black',
        badgeColor: 'bg-rose-400 border-2 border-[#1c1917] text-rose-950 shadow-[2px_2px_0px_#1c1917]',
        diffColor: 'text-rose-900 bg-rose-100 border-2 border-rose-300'
    },
    familiar: {
        text: 'Familiar',
        textColor: 'text-amber-900 font-black',
        badgeColor: 'bg-amber-300 border-2 border-[#1c1917] text-amber-950 shadow-[2px_2px_0px_#1c1917]',
        diffColor: 'text-amber-900 bg-amber-100 border-2 border-amber-300'
    },
    mastered: {
        text: 'Mastered',
        textColor: 'text-emerald-900 font-black',
        badgeColor: 'bg-emerald-400 border-2 border-[#1c1917] text-emerald-950 shadow-[2px_2px_0px_#1c1917]',
        diffColor: 'text-emerald-900 bg-emerald-100 border-2 border-emerald-300'
    }
};

/**
 * Calculates the current mastery percentage for a single landmark.
 * @param {Object} lm - The landmark object.
 * @returns {number} - Rounded mastery percentage.
 */
function getLandmarkMastery(lm) {
    if (!lm || !lm.moves || lm.moves.length === 0) return 0;
    let totalScore = 0;
    lm.moves.forEach(m => {
        const mastery = m.mastery || 'learning';
        if (mastery === 'mastered') totalScore += 100;
        else if (mastery === 'familiar') totalScore += 50;
    });
    return Math.round((totalScore / (lm.moves.length * 100)) * 100);
}

/**
 * Filter the landmark list based on active filter range.
 * @param {Array} landmarks - The full list of landmarks.
 * @param {string} activeFilter - 'all' | 'low' | 'med' | 'high'
 * @returns {Array<number>} - List of indices of the matching landmarks.
 */
function getFilteredLandmarkIndices(landmarks, activeFilter) {
    return landmarks.map((lm, idx) => {
        const mastery = getLandmarkMastery(lm);
        let range = 'low';
        if (mastery >= 75) range = 'high';
        else if (mastery >= 40) range = 'med';
        
        return { idx, range };
    }).filter(item => {
        if (activeFilter === 'all') return true;
        return item.range === activeFilter;
    }).map(item => item.idx);
}

/**
 * Persists the current mastery state of all landmarks to browser storage.
 * @param {string} localStorageKey - Key name in localStorage.
 * @param {Array} landmarks - The landmarks array.
 */
function saveMasteryState(localStorageKey, landmarks) {
    const state = {};
    landmarks.forEach((lm) => {
        state[lm.title] = lm.moves.map(m => m.mastery);
    });
    localStorage.setItem(localStorageKey, JSON.stringify(state));
}

/**
 * Loads and restores the mastery state from browser storage.
 * @param {string} localStorageKey - Key name in localStorage.
 * @param {Array} landmarks - The landmarks array to populate.
 */
function loadMasteryState(localStorageKey, landmarks) {
    const saved = localStorage.getItem(localStorageKey);
    if (saved) {
        try {
            const state = JSON.parse(saved);
            landmarks.forEach((lm) => {
                if (state[lm.title]) {
                    lm.moves.forEach((m, mIdx) => {
                        if (state[lm.title][mIdx]) {
                            m.mastery = state[lm.title][mIdx];
                        }
                    });
                }
            });
        } catch (e) {
            console.error("Error loading mastery state", e);
        }
    }
}

/**
 * Computes global mastery count statistics.
 * @param {Array} landmarks - The landmarks array.
 * @returns {Object} - { mastered, total }
 */
function getMasteryStats(landmarks) {
    let total = 0;
    let mastered = 0;
    landmarks.forEach(lm => {
        lm.moves.forEach(m => {
            total++;
            if (m.mastery === 'mastered') {
                mastered++;
            }
        });
    });
    return { mastered, total };
}

/**
 * Compares current landmarks with the original state to discover local progress changes.
 * @param {Array} landmarks - Current state of landmarks.
 * @param {Array} originalLandmarks - Original hardcoded state.
 * @returns {Array<Object>} - Differences array containing elements of shape:
 *                            { landmarkTitle, landmarkColor, moveName, from, to }
 */
function getDiffs(landmarks, originalLandmarks) {
    const diffs = [];
    landmarks.forEach((lm, lIdx) => {
        lm.moves.forEach((m, mIdx) => {
            const currentMastery = m.mastery || 'learning';
            const originalMastery = originalLandmarks[lIdx]?.moves?.[mIdx]?.mastery || 'learning';
            if (currentMastery !== originalMastery) {
                diffs.push({
                    landmarkTitle: lm.title,
                    landmarkColor: lm.color,
                    moveName: m.name,
                    from: originalMastery,
                    to: currentMastery
                });
            }
        });
    });
    return diffs;
}

// Make functions available globally for direct access in HTML script inclusions
window.MASTERY_CONFIG = MASTERY_CONFIG;
window.getLandmarkMastery = getLandmarkMastery;
window.getFilteredLandmarkIndices = getFilteredLandmarkIndices;
window.saveMasteryState = saveMasteryState;
window.loadMasteryState = loadMasteryState;
window.getMasteryStats = getMasteryStats;
window.getDiffs = getDiffs;

/**
 * DancePracticeTool
 * A class to manage the state and UI of a dance practice tool.
 * Consolidation of common logic from WCS, Bachata, and Salsa scripts.
 */
class DancePracticeTool {
    constructor(config) {
        this.landmarks = config.landmarks;
        this.originalLandmarks = config.originalLandmarks;
        this.storageKey = config.storageKey;
        this.danceType = config.danceType; // 'wcs', 'bachata', 'salsa'
        this.accentColor = config.accentColor || 'indigo';
        this.bpmSliderId = config.bpmSliderId || 'bpmSlider';
        
        // Audio callbacks
        this.onPlayBeat = config.onPlayBeat;
        
        // Initial state
        this.currentLandmarkIdx = 0;
        this.currentMoveIdx = 0;
        this.beatIdx = 0;
        this.phraseBeatIdx = 0; // Primarily for Salsa/Bachata 8-count
        this.isPaused = true;
        this.isRandomMode = false;
        this.isLoopMode = false;
        this.activeFilter = 'all';

        // Scheduler state
        this.schedulerIntervalId = null;
        this.schedLandmarkIdx = 0;
        this.schedMoveIdx = 0;
        this.schedBeatIdx = 0;
        this.schedPhraseBeatIdx = 0;
        this.nextBeatTime = 0.0;
        this.lookahead = 25.0;
        this.scheduleAheadTime = 0.1;
        this.schedHoldingForRandom = false;

        // Queues and Visuals
        this.beatsQueue = [];
        this.lastRenderedLandmarkIdx = -1;
        this.lastRenderedMoveIdx = -1;
        
        // Practice Session landmark selection state
        this.selectedLandmarkIndices = [];
        this.expandedLandmarks = new Set();
        this.searchQuery = '';
        
        // DOM Elements
        this.els = {
            landmarkList: document.getElementById('landmarkList'),
            moveSearchInput: document.getElementById('moveSearchInput'),
            clearSearchBtn: document.getElementById('clearSearchBtn'),
            startOverlay: document.getElementById('startOverlay'),
            overlayContent: document.getElementById('overlayContent'),
            countdownDisplay: document.getElementById('countdownDisplay'),
            timerCircle: document.getElementById('timerCircle'),
            landmarkHUD: document.getElementById('landmarkHUD'),
            tutorialLinks: document.getElementById('tutorialLinks'),
            currentMoveLabel: document.getElementById('currentMoveLabel'),
            nextMoveLabel: document.getElementById('nextMoveLabel'),
            masteryStatsCount: document.getElementById('masteryStatsCount'),
            bpmSlider: document.getElementById(this.bpmSliderId),
            bpmValue: document.getElementById('bpmValue'),
            bpmInput: document.getElementById('bpmInput'),
            playPauseBtn: document.getElementById('playPauseBtn'),
            modeToggle: document.getElementById('modeToggle'),
            loopToggle: document.getElementById('loopToggle'),
            panicBtn: document.getElementById('panicBtn'),
            collapseAllBtn: document.getElementById('collapseAllBtn'),
            // Modals
            resetModal: document.getElementById('resetModal'),
            syncModal: document.getElementById('syncModal'),
            rawCodeArea: document.getElementById('rawCodeArea'),
            changesList: document.getElementById('changesList'),
            landmarkTitle: document.getElementById('landmarkTitle'),
            // Mobile Tabs
            movesTabPanel: document.getElementById('movesTabPanel'),
            practiceTabPanel: document.getElementById('practiceTabPanel'),
            mobileTabPracticeBtn: document.getElementById('mobileTabPracticeBtn'),
            mobileTabMovesBtn: document.getElementById('mobileTabMovesBtn'),
            dailyMovesCount: document.getElementById('dailyMovesCount')
        };
    }

    init() {
        this.loadMasteryState();
        this.updateMasteryStats();
        this.updateDailyMovesUI();
        
        if (this.els.bpmInput && this.els.bpmSlider) {
            this.els.bpmInput.value = this.els.bpmSlider.value;
        }
        
        // Initialize practice selection checkboxes as empty (unchecked by default)
        this.selectedLandmarkIndices = [];

        this.updateHUD();
        this.renderSidebar();
        
        this.isPaused = true;
        this.selectMove(this.getFilteredLandmarkIndices()[0] || 0, 0, false);
        if (this.els.playPauseBtn) this.els.playPauseBtn.innerHTML = this.getPlayPauseBtnHtml(true);

        this.updateMoveDisplay(false);
        this.setupEventListeners();
        this.setupMobileTabs();

        if (window.ChunkSpeech && document.getElementById('ttsToggleBtn')) {
            window.ChunkSpeech.initUI('ttsToggleBtn');
        }

        requestAnimationFrame(() => this.draw());
    }

    // --- State Persistence ---
    loadMasteryState() {
        window.loadMasteryState(this.storageKey, this.landmarks);
    }

    saveMasteryState() {
        window.saveMasteryState(this.storageKey, this.landmarks);
    }

    // --- Daily Practice Counter ---
    getDailyMovesCount() {
        const today = new Date().toLocaleDateString('en-CA');
        const key = `dance_daily_moves_tracker_${this.danceType || 'general'}`;
        try {
            const saved = localStorage.getItem(key);
            if (saved) {
                const data = JSON.parse(saved);
                if (data && data.date === today && typeof data.count === 'number') {
                    return data.count;
                }
            }
        } catch (e) {
            console.warn('Error reading daily moves count', e);
        }
        return 0;
    }

    incrementDailyMovesCount() {
        const today = new Date().toLocaleDateString('en-CA');
        const key = `dance_daily_moves_tracker_${this.danceType || 'general'}`;
        let currentCount = this.getDailyMovesCount();
        currentCount++;
        try {
            localStorage.setItem(key, JSON.stringify({
                date: today,
                count: currentCount
            }));
        } catch (e) {
            console.warn('Error saving daily moves count', e);
        }
        this.updateDailyMovesUI(currentCount);
        return currentCount;
    }

    updateDailyMovesUI(count = null) {
        if (count === null) {
            count = this.getDailyMovesCount();
        }
        if (this.els.dailyMovesCount) {
            this.els.dailyMovesCount.textContent = count;
        }
    }

    // --- Filtering ---
    getFilteredLandmarkIndices() {
        const masteryFiltered = window.getFilteredLandmarkIndices(this.landmarks, this.activeFilter);
        return masteryFiltered.filter(idx => this.selectedLandmarkIndices.includes(idx));
    }

    applyFilter(filterVal) {
        this.activeFilter = filterVal;
        const btnPrefix = 'filter' + filterVal.charAt(0).toUpperCase() + filterVal.slice(1) + 'Btn';
        const buttons = ['filterAllBtn', 'filterLowBtn', 'filterMedBtn', 'filterHighBtn'];
        
        buttons.forEach(id => {
            const btn = document.getElementById(id);
            if (!btn) return;
            if (id === btnPrefix) {
                btn.className = `py-1 text-[9px] font-bold uppercase rounded transition-all bg-${this.accentColor}-600 text-white shadow-sm border border-${this.accentColor}-500/10`;
            } else {
                btn.className = "py-1 text-[9px] font-bold uppercase rounded transition-all text-slate-400 hover:text-slate-100 hover:bg-slate-900/40";
            }
        });

        // Reset the selection checkboxes as empty (unchecked after filter is changed)
        this.selectedLandmarkIndices = [];

        this.renderSidebar();
        const filtered = this.getFilteredLandmarkIndices();
        if (filtered.length > 0 && !filtered.includes(this.currentLandmarkIdx)) {
            this.selectMove(filtered[0], 0);
        }
    }

    // --- Scheduler & Audio ---
    startScheduler() {
        if (this.schedulerIntervalId) clearInterval(this.schedulerIntervalId);
        this.beatsQueue = [];
        this.schedHoldingForRandom = false;
        if (DanceAudio.isReady()) {
            this.nextBeatTime = DanceAudio.getCurrentTime() + 0.05;
        }
        this.schedulerIntervalId = setInterval(() => this.scheduler(), this.lookahead);
    }

    getBpm() {
        if (this.els.bpmInput && this.els.bpmInput.value !== '') {
            const parsed = parseInt(this.els.bpmInput.value, 10);
            if (!isNaN(parsed) && parsed > 0) {
                return parsed;
            }
        }
        if (this.els.bpmSlider && this.els.bpmSlider.value) {
            const parsed = parseInt(this.els.bpmSlider.value, 10);
            if (!isNaN(parsed) && parsed > 0) {
                return parsed;
            }
        }
        return 90;
    }

    scheduler() {
        if (this.isPaused || this.schedHoldingForRandom) return;

        const bpm = this.getBpm();
        const secondsPerBeat = 60.0 / bpm;

        while (this.nextBeatTime < DanceAudio.getCurrentTime() + this.scheduleAheadTime) {
            const currentMove = this.landmarks[this.schedLandmarkIdx].moves[this.schedMoveIdx];
            
            // Audio trigger
            this.onPlayBeat(this.nextBeatTime, this.schedBeatIdx, this.schedPhraseBeatIdx, currentMove);

            // Visual queue
            this.beatsQueue.push({
                beat: this.schedBeatIdx,
                phraseBeat: this.schedPhraseBeatIdx,
                time: this.nextBeatTime,
                moveIdx: this.schedMoveIdx,
                landmarkIdx: this.schedLandmarkIdx,
                landmarkColor: this.landmarks[this.schedLandmarkIdx].color,
                moveName: currentMove.name,
                beatsTotal: currentMove.beats || 4
            });

            this.advanceBeat(secondsPerBeat);
        }
    }

    advanceBeat(secondsPerBeat) {
        this.nextBeatTime += secondsPerBeat;
        this.schedBeatIdx++;

        const currentMove = this.landmarks[this.schedLandmarkIdx].moves[this.schedMoveIdx];
        const beatsTotal = currentMove.beats || 4;
        
        if (this.schedBeatIdx >= beatsTotal) {
            this.schedBeatIdx = 0;
            if (this.schedMoveIdx >= this.landmarks[this.schedLandmarkIdx].moves.length - 1) {
                if (this.isRandomMode) {
                    this.schedHoldingForRandom = true;
                } else if (this.isLoopMode) {
                    this.schedMoveIdx = 0;
                } else {
                    const filtered = this.getFilteredLandmarkIndices();
                    const currentFilteredPos = filtered.indexOf(this.schedLandmarkIdx);
                    if (currentFilteredPos !== -1 && filtered.length > 0) {
                        this.schedLandmarkIdx = filtered[(currentFilteredPos + 1) % filtered.length];
                    } else if (filtered.length > 0) {
                        this.schedLandmarkIdx = filtered[0];
                    } else {
                        this.schedLandmarkIdx = (this.schedLandmarkIdx + 1) % this.landmarks.length;
                    }
                    this.schedMoveIdx = 0;
                }
            } else {
                this.schedMoveIdx++;
            }
        }

        // Salsa and Bachata use an 8-beat loop for phrasing.
        // The first move of every landmark starts with beat 1-4.
        // Even move indices start on 1-4 (0), odd move indices start on 5-8 (4).
        if (this.danceType === 'salsa' || this.danceType === 'bachata') {
            const isOddMove = (this.schedMoveIdx % 2 !== 0);
            this.schedPhraseBeatIdx = isOddMove ? (this.schedBeatIdx + 4) % 8 : this.schedBeatIdx % 8;
        }
    }

    // --- Visual Loop ---
    draw() {
        if (DanceAudio.isReady()) {
            const currentTime = DanceAudio.getCurrentTime();
            while (this.beatsQueue.length && this.beatsQueue[0].time <= currentTime) {
                const playedBeat = this.beatsQueue.shift();
                this.triggerVisualBeatFeedback(playedBeat);
            }
        }
        requestAnimationFrame(() => this.draw());
    }

    triggerVisualBeatFeedback(playedBeat) {
        this.beatIdx = playedBeat.beat;
        this.phraseBeatIdx = playedBeat.phraseBeat;

        // Daily moves counter increment logic:
        // WCS: increment after each move (last beat of move)
        // Bachata/Salsa: increment after each 8-beat pair (phraseBeat 7)
        if (this.danceType === 'wcs') {
            if (playedBeat.beat === playedBeat.beatsTotal - 1) {
                this.incrementDailyMovesCount();
            }
        } else {
            if (playedBeat.phraseBeat === 7) {
                this.incrementDailyMovesCount();
            }
        }

        let displayLIdx = playedBeat.landmarkIdx;
        let displayMIdx = playedBeat.moveIdx;

        // Preemptive move display logic
        let shouldPreempt = false;
        if (this.danceType === 'wcs') {
            shouldPreempt = playedBeat.beat >= playedBeat.beatsTotal - 2;
        } else if (this.danceType === 'bachata') {
            shouldPreempt = playedBeat.beat >= 3; // On the tap (beat 4)
        } else if (this.danceType === 'salsa') {
            shouldPreempt = (playedBeat.phraseBeat === 3 || playedBeat.phraseBeat === 7);
        }

        if (shouldPreempt) {
            const lm = this.landmarks[displayLIdx];
            if (displayMIdx < lm.moves.length - 1) {
                displayMIdx++;
            } else if (this.isLoopMode) {
                displayMIdx = 0;
            } else if (!this.isRandomMode) {
                const filtered = this.getFilteredLandmarkIndices();
                const pos = filtered.indexOf(displayLIdx);
                if (pos !== -1 && filtered.length > 0) {
                    displayLIdx = filtered[(pos + 1) % filtered.length];
                } else if (filtered.length > 0) {
                    displayLIdx = filtered[0];
                } else {
                    displayLIdx = (displayLIdx + 1) % this.landmarks.length;
                }
                displayMIdx = 0;
            }
        }

        if (displayMIdx !== this.lastRenderedMoveIdx || displayLIdx !== this.lastRenderedLandmarkIdx) {
            const isNewLandmark = (displayLIdx !== this.lastRenderedLandmarkIdx);
            this.lastRenderedMoveIdx = displayMIdx;
            this.lastRenderedLandmarkIdx = displayLIdx;
            this.currentLandmarkIdx = displayLIdx;
            this.currentMoveIdx = displayMIdx;

            this.updateHUD();
            this.renderSidebar();
            this.updateMoveDisplay(false);

            if (isNewLandmark && window.ChunkSpeech) {
                const lm = this.landmarks[displayLIdx];
                if (lm) window.ChunkSpeech.announceChunk(lm.title);
            }
        }

        // Random mode landmark completion
        const isLastMove = playedBeat.moveIdx === this.landmarks[playedBeat.landmarkIdx].moves.length - 1;
        const isLastBeatOfMove = playedBeat.beat === playedBeat.beatsTotal - 1;
        if (this.isRandomMode && isLastMove && isLastBeatOfMove) {
            this.triggerRandomCountdown();
        }
    }

    triggerRandomCountdown() {
        this.isPaused = true;
        if (this.schedulerIntervalId) clearInterval(this.schedulerIntervalId);
        this.beatsQueue = [];
        this.schedHoldingForRandom = false;

        const filtered = this.getFilteredLandmarkIndices();
        if (filtered.length > 1) {
            let nextIdx;
            do {
                nextIdx = filtered[Math.floor(Math.random() * filtered.length)];
            } while (nextIdx === this.currentLandmarkIdx && filtered.length > 1);
            this.currentLandmarkIdx = nextIdx;
        } else if (filtered.length === 1) {
            this.currentLandmarkIdx = filtered[0];
        }

        this.currentMoveIdx = 0;
        this.beatIdx = 0;
        this.schedLandmarkIdx = this.currentLandmarkIdx;
        this.schedMoveIdx = 0;
        this.schedBeatIdx = 0;

        this.updateHUD();
        this.renderSidebar();
        this.updateMoveDisplay(false);

        if (window.ChunkSpeech) {
            const lm = this.landmarks[this.currentLandmarkIdx];
            if (lm) window.ChunkSpeech.announceChunk(lm.title);
        }

        this.els.startOverlay.classList.remove('hidden');
        if (this.els.overlayContent) this.els.overlayContent.classList.add('hidden');
        this.els.countdownDisplay.classList.remove('hidden');

        let count = 5;
        this.els.timerCircle.textContent = count;

        const cdInterval = setInterval(() => {
            count--;
            this.els.timerCircle.textContent = count;
            if (count <= 0) {
                clearInterval(cdInterval);
                this.els.startOverlay.classList.add('hidden');
                this.isPaused = false;
                this.startScheduler();
            }
        }, 1000);
    }

    // --- UI Rendering ---
    updateHUD() {
        const lm = this.landmarks[this.currentLandmarkIdx];
        if (this.els.landmarkHUD) this.els.landmarkHUD.style.borderColor = lm.color;
        if (this.els.landmarkTitle) this.els.landmarkTitle.textContent = lm.title;

        if (this.els.tutorialLinks) {
            const links = lm.links || [];
            if (links.length > 0) {
                this.els.tutorialLinks.innerHTML = links.map(link => `
                    <a href="${link.url}" target="_blank" class="flex items-center gap-1.5 px-3 py-1.5 bg-white text-stone-900 hover:bg-stone-100 text-[10px] font-black rounded-xl border-2 border-[#1c1917] uppercase transition-all shadow-[2px_2px_0px_#1c1917] active:scale-95">
                        🎬 ${link.label}
                    </a>
                `).join('');
            } else {
                this.els.tutorialLinks.innerHTML = `<span class="text-[10px] text-stone-600 font-mono italic">No video links for this chunk</span>`;
            }
        }
    }

    updateMoveDisplay(shouldRestart = true) {
        const lm = this.landmarks[this.currentLandmarkIdx];
        const move = lm.moves[this.currentMoveIdx];
        const mastery = move.mastery || 'learning';
        const config = MASTERY_CONFIG[mastery] || MASTERY_CONFIG.learning;

        // Custom label based on dance type
        let labelTag = '';
        if (this.danceType === 'wcs') {
            labelTag = `${move.beats}🥁`;
        } else {
            // Label is aligned with the displayed move index parity to keep 1-4 / 5-8 solid
            labelTag = (this.currentMoveIdx % 2 !== 0) ? "5-8" : "1-4";
        }

        let hintHtml = move.hint ? `<div class="text-xs sm:text-sm mt-2 text-center font-bold tracking-wider text-amber-300 bg-amber-950/60 border border-amber-500/30 px-3 py-1 rounded-xl shadow-lg">${move.hint}</div>` : '';

        let nextMoveHtml = "End of landmark list";
        if (this.currentMoveIdx < lm.moves.length - 1) {
            const next = lm.moves[this.currentMoveIdx + 1];
            const nextConf = MASTERY_CONFIG[next.mastery || 'learning'];
            nextMoveHtml = `<span class="${nextConf.textColor} font-bold">${next.name}</span>`;
        }

        if (this.els.currentMoveLabel) {
            const animClass = this.danceType === 'wcs' ? 'animate-label' : 'active-move-animate';
            this.els.currentMoveLabel.innerHTML = `
                <div class="${animClass} ${this.isPaused ? 'paused-anim' : ''} flex flex-col items-center justify-center gap-2">
                    <div class="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                        <span class="text-lg sm:text-xl md:text-2xl font-black px-3.5 py-1.5 rounded-2xl bg-white border-2 border-stone-900 text-stone-900 shadow-[3px_3px_0px_#1c1917] flex items-center gap-1 font-mono">${labelTag}</span>
                        <span class="text-lg sm:text-xl md:text-2xl font-black ${config.textColor} tracking-tight text-center leading-tight">${move.name}</span>
                    </div>
                    ${hintHtml}
                </div>
            `;
        }

        if (this.els.nextMoveLabel) {
            this.els.nextMoveLabel.innerHTML = `<span class="text-slate-500 font-extrabold text-[10px]">UP NEXT:</span> ${nextMoveHtml}`;
        }

        // Sidebar Sync
        document.querySelectorAll('.move-active').forEach(el => el.classList.remove('move-active'));
        const activeEl = document.getElementById(`m-${this.currentLandmarkIdx}-${this.currentMoveIdx}`);
        if (activeEl) {
            activeEl.classList.add('move-active');
            if (window.innerWidth >= 768) activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        if (shouldRestart && !this.isPaused) this.startScheduler();
    }

    renderSidebar() {
        if (!this.els.landmarkList) return;
        this.els.landmarkList.innerHTML = '';

        const query = (this.searchQuery || '').trim().toLowerCase();
        let visibleLandmarks = window.getFilteredLandmarkIndices(this.landmarks, this.activeFilter);

        if (query) {
            visibleLandmarks = visibleLandmarks.filter(lIdx => {
                const lm = this.landmarks[lIdx];
                return lm.moves.some(m => m.name.toLowerCase().includes(query));
            });
        }

        if (visibleLandmarks.length === 0) {
            this.els.landmarkList.innerHTML = `
                <div class="p-6 bg-[#fdfbf7] rounded-2xl border-2 border-[#1c1917] text-stone-700 text-center flex flex-col items-center justify-center gap-2 shadow-[4px_4px_0px_#1c1917]">
                    <p class="font-black text-xs text-stone-900">${query ? 'No moves matching "' + this.searchQuery + '"' : 'No chunks in this range!'}</p>
                </div>
            `;
            this.updateCollapseExpandBtn();
            return;
        }

        visibleLandmarks.forEach((lIdx, pos) => {
            const lm = this.landmarks[lIdx];
            const isFirst = (pos === 0);
            const isLast = (pos === visibleLandmarks.length - 1);

            if (query) {
                this.expandedLandmarks.add(lIdx);
            }

            const isSelected = this.selectedLandmarkIndices.includes(lIdx);
            const isCurrent = (lIdx === this.currentLandmarkIdx);
            const isExpanded = this.expandedLandmarks.has(lIdx);

            const section = document.createElement('div'); section.id = `lm-section-${lIdx}`;
            section.className = `rounded-2xl transition-all duration-200 overflow-hidden border-2 border-[#1c1917] shadow-[4px_4px_0px_#1c1917] ${
                isCurrent 
                    ? 'landmark-active bg-[#fff1f2]' 
                    : 'bg-[#ffffff] hover:bg-[#faedcd]'
            }`;
            section.style.color = lm.color;

            const masteryPct = window.getLandmarkMastery(lm);
            
            // Move rendering (Bachata groups by 2)
            let movesHtml = '';
            if (this.danceType === 'bachata') {
                for (let mIdx = 0; mIdx < lm.moves.length; mIdx += 2) {
                    const m1 = lm.moves[mIdx];
                    const m2 = lm.moves[mIdx + 1];
                    const m1Matches = !query || (m1 && m1.name.toLowerCase().includes(query));
                    const m2Matches = !query || (m2 && m2.name.toLowerCase().includes(query));
                    if (!m1Matches && !m2Matches) continue;

                    movesHtml += `<div class="border-2 border-[#1c1917] rounded-2xl p-1.5 mb-2 bg-[#fdfbf7] space-y-1.5 shadow-[2px_2px_0px_#1c1917]">
                        ${m1Matches ? this.renderMoveItem(lIdx, mIdx) : ''}
                        ${m2Matches ? this.renderMoveItem(lIdx, mIdx + 1) : ''}
                    </div>`;
                }
            } else {
                let moveItemsHtml = '';
                lm.moves.forEach((m, mIdx) => {
                    const matches = !query || m.name.toLowerCase().includes(query);
                    if (matches) {
                        moveItemsHtml += this.renderMoveItem(lIdx, mIdx);
                    }
                });
                movesHtml = `<div class="space-y-1.5 bg-[#fdfbf7] rounded-2xl p-1.5 mb-2 border-2 border-[#1c1917] shadow-[2px_2px_0px_#1c1917]">
                    ${moveItemsHtml}
                </div>`;
            }

            section.innerHTML = `
                <!-- Accordion Header Bar -->
                <div class="flex items-center justify-between p-2.5 sm:p-3 cursor-pointer select-none group/hdr bg-[#ffde59] hover:bg-[#ffc312]" data-action="toggle-accordion" data-lidx="${lIdx}">
                    <div class="flex items-center gap-2 flex-1 min-w-0 pr-1">
                        <!-- Custom Touch-optimized Checkbox Wrapper (44x44px min target area) -->
                        <div class="p-1 -m-1 flex items-center justify-center cursor-pointer select-none group/cb relative shrink-0" data-action="toggle-check" data-lidx="${lIdx}">
                            <input type="checkbox" 
                                   class="chunk-checkbox absolute opacity-0 cursor-pointer w-7 h-7 z-10" 
                                   data-lidx="${lIdx}" 
                                   ${isSelected ? 'checked' : ''}>
                            <div class="w-4 h-4 rounded border-2 border-[#1c1917] flex items-center justify-center transition-all duration-200 group-hover/cb:scale-110 ${isSelected ? 'bg-[#1c1917] text-white shadow-sm' : 'bg-white text-transparent'}">
                                <svg class="w-3 h-3 stroke-[3.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                        <!-- Chunk Title, Move Count & Mastery % -->
                        <div class="flex-1 min-w-0 flex items-center justify-between gap-1.5">
                            <span class="text-xs font-black text-[#1c1917] truncate group-hover/hdr:underline transition-colors">${lm.title}</span>
                            <div class="flex items-center gap-1.5 shrink-0">
                                <span class="text-[10px] font-black text-[#1c1917] bg-[#fdfbf7] px-1.5 py-0.5 rounded border-2 border-[#1c1917] uppercase tracking-wide shadow-[1px_1px_0px_#1c1917]">${lm.moves.length} moves</span>
                                <span class="text-[11px] font-mono font-black px-2 py-0.5 rounded-xl shrink-0 border-2 border-[#1c1917] shadow-[2px_2px_0px_#1c1917] ${masteryPct >= 75 ? 'bg-emerald-300 text-emerald-950' : masteryPct >= 40 ? 'bg-amber-300 text-amber-950' : 'bg-rose-300 text-rose-950'}">${masteryPct}%</span>
                            </div>
                        </div>
                    </div>
                    <!-- Up / Down Arrow Controls & Accordion Toggle Chevron -->
                    <div class="flex items-center gap-1 shrink-0 ml-1">
                        <button class="text-[#1c1917] hover:bg-white bg-[#fdfbf7] border-2 border-[#1c1917] rounded-lg p-1 transition-all shadow-[1.5px_1.5px_0px_#1c1917] active:scale-[0.95] ${isFirst ? 'opacity-40 cursor-not-allowed' : ''}" data-action="scroll-prev" data-lidx="${lIdx}" title="Previous chunk">
                            <svg class="w-3.5 h-3.5 stroke-[3.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"></path></svg>
                        </button>
                        <button class="text-[#1c1917] hover:bg-white bg-[#fdfbf7] border-2 border-[#1c1917] rounded-lg p-1 transition-all shadow-[1.5px_1.5px_0px_#1c1917] active:scale-[0.95] ${isLast ? 'opacity-40 cursor-not-allowed' : ''}" data-action="scroll-next" data-lidx="${lIdx}" title="Next chunk">
                            <svg class="w-3.5 h-3.5 stroke-[3.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path></svg>
                        </button>
                        <button class="text-[#1c1917] p-1 rounded-lg hover:bg-black/10 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}" data-action="toggle-accordion" data-lidx="${lIdx}" title="${isExpanded ? 'Collapse chunk' : 'Expand chunk'}">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Accordion Detail Panel (Moves) -->
                <div class="${isExpanded ? 'block' : 'hidden'} px-2.5 pb-2.5 pt-2 border-t-2 border-[#1c1917] space-y-2 bg-[#ffffff]">
                    ${movesHtml}
                </div>
            `;
            this.els.landmarkList.appendChild(section);
        });
        
        this.updateCollapseExpandBtn();
        this.updateSyncButtonState();
    }

    updateSyncButtonState() {
        let isDirty = false;
        for (let lIdx = 0; lIdx < this.landmarks.length; lIdx++) {
            const lm = this.landmarks[lIdx];
            for (let mIdx = 0; mIdx < lm.moves.length; mIdx++) {
                const mastery = lm.moves[mIdx].mastery || 'learning';
                const originalMastery = this.originalLandmarks[lIdx]?.moves?.[mIdx]?.mastery || 'learning';
                if (mastery !== originalMastery) {
                    isDirty = true;
                    break;
                }
            }
            if (isDirty) break;
        }

        const btn = document.getElementById('showDiffBtn');
        if (!btn) return;

        if (isDirty) {
            btn.innerHTML = `Sync Code<span class="inline-block w-1.5 h-1.5 rounded-full bg-white ml-1.5 shadow-[0_0_8px_rgba(255,255,255,0.8)] align-middle"></span>`;
        } else {
            btn.innerHTML = `Sync Code`;
        }
    }

    renderMoveItem(lIdx, mIdx) {
        const lm = this.landmarks[lIdx];
        const m = lm?.moves[mIdx];
        if (!m) return '';
        const mastery = m.mastery || 'learning';
        const config = MASTERY_CONFIG[mastery];
        const isCurrent = (lIdx === this.currentLandmarkIdx && mIdx === this.currentMoveIdx);
        
        const originalMastery = this.originalLandmarks[lIdx]?.moves?.[mIdx]?.mastery || 'learning';
        const isModified = mastery !== originalMastery;
        const modifiedBorderClass = isModified ? 'border-[2px] !border-white' : 'border';

        const tooltipHtml = m.hint ? `<div class="move-tooltip">${m.hint}</div>` : '';
        const tooltipClass = m.hint ? 'has-move-tooltip' : '';

        const moveLink = m.link ? (lm.links || []).find(l => l.id === m.link) : null;
        const movieLinkHtml = moveLink ? `<a href="${moveLink.url}" target="_blank" class="ml-1.5 px-1.5 py-0.5 bg-white text-stone-900 border-2 border-[#1c1917] rounded-md shadow-[1.5px_1.5px_0px_#1c1917] hover:scale-110 hover:bg-stone-100 active:scale-95 transition-all inline-flex items-center leading-none text-[10px]" title="Watch video" onclick="event.stopPropagation()">🎬</a>` : '';

        return `
            <div id="m-${lIdx}-${mIdx}" class="text-[11px] px-3 py-2 rounded-xl flex items-center justify-between gap-2.5 group cursor-pointer border-2 transition-all ${isCurrent ? 'move-active bg-[#fff1f2] text-slate-950 border-[#1c1917] shadow-[3px_3px_0px_#1c1917]' : 'bg-[#ffde59] text-stone-900 border-[#1c1917] hover:bg-[#ffc312] shadow-[2px_2px_0px_#1c1917]'} ${tooltipClass}" data-action="select" data-lidx="${lIdx}" data-midx="${mIdx}">
                <span class="truncate flex-1 py-0.5 font-black ${isCurrent ? 'text-slate-950' : 'text-stone-900'}" data-lidx="${lIdx}" data-midx="${mIdx}">
                    ${m.hint ? '<span class="bg-rose-500 border border-slate-900 px-1.5 py-0.5 rounded text-[9px] mr-1.5 text-white font-black shadow-[1px_1px_0px_#1c1917]">?</span>' : ''}${m.name} ${this.danceType === 'wcs' ? `<span class="${isCurrent ? 'bg-slate-950 text-white' : 'bg-[#1c1917] text-white'} px-1.5 py-0.5 rounded text-[9px] font-mono font-black ml-1.5">${m.beats}🥁</span>` : ''}${movieLinkHtml}
                </span>
                ${tooltipHtml}
                <button class="shrink-0 text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg ${modifiedBorderClass} ${config.badgeColor} hover:brightness-110 transition-all active:scale-[0.97]" data-action="cycle" data-lidx="${lIdx}" data-midx="${mIdx}">
                    ${config.text}
                </button>
            </div>
        `;
    }

    // --- Actions ---
    toggleAccordion(lIdx) {
        if (this.expandedLandmarks.has(lIdx)) {
            this.expandedLandmarks.delete(lIdx);
        } else {
            this.expandedLandmarks.add(lIdx);
            if (this.currentLandmarkIdx !== lIdx) {
                this.selectMove(lIdx, 0);
                return;
            }
        }
        this.renderSidebar();
    }

    toggleExpandCollapseAll() {
        const query = (this.searchQuery || '').trim().toLowerCase();
        let visibleLandmarks = window.getFilteredLandmarkIndices(this.landmarks, this.activeFilter);
        if (query) {
            visibleLandmarks = visibleLandmarks.filter(lIdx => {
                const lm = this.landmarks[lIdx];
                return lm.moves.some(m => m.name.toLowerCase().includes(query));
            });
        }

        const hasExpanded = visibleLandmarks.some(lIdx => this.expandedLandmarks.has(lIdx));

        if (hasExpanded) {
            this.expandedLandmarks.clear();
        } else {
            visibleLandmarks.forEach(lIdx => this.expandedLandmarks.add(lIdx));
        }
        this.renderSidebar();
    }

    updateCollapseExpandBtn() {
        if (!this.els.collapseAllBtn) return;
        const query = (this.searchQuery || '').trim().toLowerCase();
        let visibleLandmarks = window.getFilteredLandmarkIndices(this.landmarks, this.activeFilter);
        if (query) {
            visibleLandmarks = visibleLandmarks.filter(lIdx => {
                const lm = this.landmarks[lIdx];
                return lm.moves.some(m => m.name.toLowerCase().includes(query));
            });
        }

        const hasExpanded = visibleLandmarks.some(lIdx => this.expandedLandmarks.has(lIdx));

        if (hasExpanded) {
            this.els.collapseAllBtn.innerHTML = `
                <svg class="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 15l7-7 7 7"></path></svg>
                <span>Collapse All</span>
            `;
            this.els.collapseAllBtn.title = "Collapse all chunk accordions";
        } else {
            this.els.collapseAllBtn.innerHTML = `
                <svg class="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path></svg>
                <span>Expand All</span>
            `;
            this.els.collapseAllBtn.title = "Expand all chunk accordions";
        }
    }

    selectMove(lIdx, mIdx, expand = true) {
        const isNewLandmark = (this.currentLandmarkIdx !== lIdx);
        this.currentLandmarkIdx = lIdx;
        this.currentMoveIdx = mIdx;
        if (expand) {
            this.expandedLandmarks.add(lIdx);
        }
        this.beatIdx = 0;
        
        // Align starting phrase beat with move index parity (even move indices start on 0/1-4, odd on 4/5-8)
        const isOdd = (mIdx % 2 !== 0);
        this.phraseBeatIdx = isOdd ? 4 : 0;
        
        this.schedLandmarkIdx = lIdx;
        this.schedMoveIdx = mIdx;
        this.schedBeatIdx = 0;
        this.schedPhraseBeatIdx = isOdd ? 4 : 0;
        this.beatsQueue = [];
        if (DanceAudio.isReady()) this.nextBeatTime = DanceAudio.getCurrentTime();

        this.updateHUD();
        this.renderSidebar();
        this.updateMoveDisplay(true);
        if (this.switchToPracticeTab) this.switchToPracticeTab();

        if (window.ChunkSpeech && (isNewLandmark || mIdx === 0)) {
            const lm = this.landmarks[lIdx];
            if (lm) window.ChunkSpeech.announceChunk(lm.title);
        }
    }

    cycleMastery(lIdx, mIdx) {
        const move = this.landmarks[lIdx].moves[mIdx];
        if (move.mastery === 'mastered') move.mastery = 'learning';
        else if (move.mastery === 'familiar') move.mastery = 'mastered';
        else move.mastery = 'familiar';
        
        this.saveMasteryState();
        const visible = window.getFilteredLandmarkIndices(this.landmarks, this.activeFilter);
        if (visible.length === 0) {
            this.applyFilter('all');
        } else {
            const practiceFiltered = this.getFilteredLandmarkIndices();
            if (practiceFiltered.length > 0 && !practiceFiltered.includes(this.currentLandmarkIdx)) {
                this.selectMove(practiceFiltered[0], 0);
            } else {
                this.renderSidebar();
                this.updateMasteryStats();
            }
        }
    }

    toggleLandmarkSelection(lIdx, isChecked) {
        if (isChecked) {
            if (!this.selectedLandmarkIndices.includes(lIdx)) {
                this.selectedLandmarkIndices.push(lIdx);
            }
        } else {
            this.selectedLandmarkIndices = this.selectedLandmarkIndices.filter(idx => idx !== lIdx);
        }

        this.renderSidebar();

        const filtered = this.getFilteredLandmarkIndices();
        if (filtered.length > 0 && !filtered.includes(this.currentLandmarkIdx)) {
            this.selectMove(filtered[0], 0);
        }
    }

    updateMasteryStats() {
        const stats = window.getMasteryStats(this.landmarks);
        const percent = stats.total > 0 ? Math.round((stats.mastered / stats.total) * 100) : 0;
        if (this.els.masteryStatsCount) this.els.masteryStatsCount.textContent = `Mastered: ${stats.mastered}/${stats.total} (${percent}%)`;
    }

    // --- Event Listeners ---
    setupEventListeners() {
        this.els.playPauseBtn.onclick = (e) => {
            DanceAudio.init();
            this.isPaused = !this.isPaused;
            if (this.isPaused) {
                if (this.schedulerIntervalId) clearInterval(this.schedulerIntervalId);
                this.beatsQueue = [];
                if (window.ChunkSpeech) window.ChunkSpeech.cancel();
            } else {
                this.schedLandmarkIdx = this.currentLandmarkIdx;
                this.schedMoveIdx = this.currentMoveIdx;
                this.schedBeatIdx = this.beatIdx;
                this.schedPhraseBeatIdx = this.phraseBeatIdx;
                this.startScheduler();

                if (window.ChunkSpeech) {
                    const lm = this.landmarks[this.currentLandmarkIdx];
                    if (lm) window.ChunkSpeech.announceChunk(lm.title);
                }
            }
            e.currentTarget.innerHTML = this.getPlayPauseBtnHtml(this.isPaused);
        };

        this.els.panicBtn.onclick = () => {
            this.selectMove(this.currentLandmarkIdx, 0);
        };

        this.els.modeToggle.onclick = () => {
            this.isRandomMode = !this.isRandomMode;
            this.els.modeToggle.textContent = this.isRandomMode ? "Random" : "Sequential";
        };

        this.els.loopToggle.onchange = (e) => this.isLoopMode = e.target.checked;
        
        if (this.els.bpmSlider) {
            this.els.bpmSlider.oninput = (e) => {
                const val = e.target.value;
                if (this.els.bpmInput) this.els.bpmInput.value = val;
                if (this.els.bpmValue) this.els.bpmValue.textContent = val + ' BPM';
                if (!this.isPaused) this.startScheduler();
            };
        }

        if (this.els.bpmInput) {
            const handleBpmInput = (isBlurOrChange = false) => {
                let val = parseInt(this.els.bpmInput.value, 10);
                if (isNaN(val)) {
                    if (isBlurOrChange) {
                        val = this.els.bpmSlider ? parseInt(this.els.bpmSlider.value, 10) : 90;
                        this.els.bpmInput.value = val;
                    } else {
                        return;
                    }
                }

                if (this.els.bpmSlider) {
                    let minVal = parseInt(this.els.bpmSlider.min, 10) || 40;
                    let maxVal = parseInt(this.els.bpmSlider.max, 10) || 250;

                    if (isBlurOrChange) {
                        val = Math.max(30, Math.min(300, val));
                        this.els.bpmInput.value = val;
                    }

                    if (val < minVal && val >= 30) {
                        this.els.bpmSlider.min = val;
                    }
                    if (val > maxVal && val <= 300) {
                        this.els.bpmSlider.max = val;
                    }
                    if (val >= parseInt(this.els.bpmSlider.min, 10) && val <= parseInt(this.els.bpmSlider.max, 10)) {
                        this.els.bpmSlider.value = val;
                    }
                }

                if (this.els.bpmValue) this.els.bpmValue.textContent = val + ' BPM';
                if (!this.isPaused) this.startScheduler();
            };

            this.els.bpmInput.oninput = () => handleBpmInput(false);
            this.els.bpmInput.onchange = () => handleBpmInput(true);
            this.els.bpmInput.onblur = () => handleBpmInput(true);
            this.els.bpmInput.onfocus = () => this.els.bpmInput.select();
            this.els.bpmInput.onkeydown = (e) => {
                if (e.key === 'Enter') {
                    this.els.bpmInput.blur();
                }
            };
        }

        if (this.els.moveSearchInput) {
            this.els.moveSearchInput.oninput = (e) => {
                this.searchQuery = e.target.value.trim().toLowerCase();
                if (this.els.clearSearchBtn) {
                    if (this.searchQuery.length > 0) {
                        this.els.clearSearchBtn.classList.remove('hidden');
                    } else {
                        this.els.clearSearchBtn.classList.add('hidden');
                    }
                }
                this.renderSidebar();
            };
        }

        if (this.els.clearSearchBtn) {
            this.els.clearSearchBtn.onclick = () => {
                if (this.els.moveSearchInput) {
                    this.els.moveSearchInput.value = '';
                }
                this.searchQuery = '';
                this.els.clearSearchBtn.classList.add('hidden');
                this.renderSidebar();
            };
        }

        if (this.els.collapseAllBtn) {
            this.els.collapseAllBtn.onclick = () => this.toggleExpandCollapseAll();
        }

        // Filter Buttons
        ['filterAllBtn', 'filterLowBtn', 'filterMedBtn', 'filterHighBtn'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.onclick = () => this.applyFilter(id.replace('filter', '').replace('Btn', '').toLowerCase());
        });

        // Sidebar clicks
        this.els.landmarkList.onclick = (e) => {
            const checkbox = e.target.closest('.chunk-checkbox') || e.target.closest('[data-action="toggle-check"]');
            const cycle = e.target.closest('[data-action="cycle"]');
            const sPrev = e.target.closest('[data-action="scroll-prev"]');
            const sNext = e.target.closest('[data-action="scroll-next"]');
            const select = e.target.closest('[data-action="select"]');
            const toggleAcc = e.target.closest('[data-action="toggle-accordion"]');
            
            if (checkbox) {
                e.stopPropagation();
                const lIdx = parseInt(checkbox.dataset.lidx);
                this.toggleLandmarkSelection(lIdx, checkbox.checked);
                return;
            }
            if (cycle) { e.stopPropagation(); this.cycleMastery(parseInt(cycle.dataset.lidx), parseInt(cycle.dataset.midx)); return; }
            if (sPrev || sNext) {
                e.stopPropagation();
                const lIdx = parseInt((sPrev || sNext).dataset.lidx);
                const filtered = window.getFilteredLandmarkIndices(this.landmarks, this.activeFilter);
                const pos = filtered.indexOf(lIdx);
                let targetIdx = -1;
                if (sPrev && pos > 0) targetIdx = filtered[pos - 1];
                if (sNext && pos < filtered.length - 1) targetIdx = filtered[pos + 1];
                if (targetIdx !== -1) {
                    this.selectMove(targetIdx, 0);
                    document.getElementById(`lm-section-${targetIdx}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                return;
            }
            if (select) {
                e.stopPropagation();
                this.selectMove(parseInt(select.dataset.lidx), parseInt(select.dataset.midx));
                return;
            }
            if (toggleAcc) {
                e.stopPropagation();
                const lIdx = parseInt(toggleAcc.dataset.lidx);
                this.toggleAccordion(lIdx);
                return;
            }
        };

        // Modal triggers
        document.getElementById('resetMasteryBtn').onclick = () => this.els.resetModal.classList.remove('hidden');
        document.getElementById('showDiffBtn').onclick = () => {
            this.els.syncModal.classList.remove('hidden');
            this.generateSyncContent();
        };

        // Modal Close logic (using common classes)
        document.querySelectorAll('[data-action="close-modal"]').forEach(el => {
            el.onclick = () => {
                this.els.resetModal.classList.add('hidden');
                this.els.syncModal.classList.add('hidden');
            };
        });

        const resetBackdrop = document.getElementById('resetModalBackdrop');
        if (resetBackdrop) {
            resetBackdrop.onclick = () => {
                this.els.resetModal.classList.add('hidden');
            };
        }
        const syncBackdrop = document.getElementById('syncModalBackdrop');
        if (syncBackdrop) {
            syncBackdrop.onclick = () => {
                this.els.syncModal.classList.add('hidden');
            };
        }

        document.getElementById('confirmResetBtn').onclick = () => {
            localStorage.removeItem(this.storageKey);
            window.location.reload();
        };

        // Sync Modal view toggles
        const viewDiffBtn = document.getElementById('viewDiffBtn');
        const viewFullCodeBtn = document.getElementById('viewFullCodeBtn');
        if (viewDiffBtn) viewDiffBtn.onclick = () => this.toggleSyncView('diff');
        if (viewFullCodeBtn) viewFullCodeBtn.onclick = () => this.toggleSyncView('code');
        
        document.getElementById('copyCodeBtn').onclick = (e) => {
            navigator.clipboard.writeText(this.els.rawCodeArea.textContent).then(() => {
                const original = e.currentTarget.innerHTML;
                e.currentTarget.innerHTML = 'Copied!';
                setTimeout(() => e.currentTarget.innerHTML = original, 2000);
            });
        };
    }

    getPlayPauseBtnHtml(isPaused) {
        return isPaused ? 
            `<svg class="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path></svg> <span class="leading-none">Resume</span>` :
            `<svg class="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg> <span class="leading-none">Pause</span>`;
    }

    toggleSyncView(view) {
        const isDiff = view === 'diff';
        document.getElementById('viewDiffBtn').className = isDiff ? `px-3 py-1.5 text-xs font-bold rounded-lg bg-${this.accentColor}-600 text-white shadow` : "px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-800 text-slate-300";
        document.getElementById('viewFullCodeBtn').className = !isDiff ? `px-3 py-1.5 text-xs font-bold rounded-lg bg-${this.accentColor}-600 text-white shadow` : "px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-800 text-slate-300";
        document.getElementById('diffContent').classList.toggle('hidden', !isDiff);
        document.getElementById('codeContent').classList.toggle('hidden', isDiff);
    }

    generateSyncContent() {
        const diffs = window.getDiffs(this.landmarks, this.originalLandmarks);
        if (diffs.length === 0) {
            this.els.changesList.innerHTML = `<div class="p-6 text-center text-slate-400">All progress in sync!</div>`;
        } else {
            this.els.changesList.innerHTML = diffs.map(d => `
                <div class="p-3 bg-slate-950/40 border border-slate-850 rounded-xl flex justify-between items-center gap-3">
                    <div>
                        <div class="text-[10px] uppercase text-slate-400">${d.landmarkTitle}</div>
                        <div class="text-xs font-bold text-white">${d.moveName}</div>
                    </div>
                    <div class="flex items-center gap-2 text-[10px] font-mono">
                        <span class="px-2 py-0.5 rounded border ${MASTERY_CONFIG[d.from].diffColor}">${MASTERY_CONFIG[d.from].text}</span>
                        <span>&rarr;</span>
                        <span class="px-2 py-0.5 rounded border ${MASTERY_CONFIG[d.to].diffColor}">${MASTERY_CONFIG[d.to].text}</span>
                    </div>
                </div>
            `).join('');
        }
        this.els.rawCodeArea.textContent = `const LANDMARKS = ${JSON.stringify(this.landmarks, null, 4)};`;
    }

    setupMobileTabs() {
        if (!this.els.mobileTabPracticeBtn || !this.els.mobileTabMovesBtn) return;
        
        // Helper to switch to Practice Tab
        this.switchToPracticeTab = () => {
            if (this.els.practiceTabPanel.classList.contains('flex')) return; // Already on practice tab

            // Reset buttons styling (Assuming generic active classes, we need to toggle standard tailwind active/inactive styles)
            // But since buttons have custom color (indigo or red), we can just toggle opacity for inactive state
            this.els.mobileTabMovesBtn.style.opacity = '0.5';
            this.els.mobileTabMovesBtn.style.borderBottomColor = 'transparent';
            
            this.els.mobileTabPracticeBtn.style.opacity = '1';
            this.els.mobileTabPracticeBtn.style.borderBottomColor = 'currentColor';

            this.els.movesTabPanel.classList.remove('flex');
            this.els.movesTabPanel.classList.add('hidden');
            
            this.els.practiceTabPanel.classList.remove('hidden');
            this.els.practiceTabPanel.classList.add('flex');
        };

        // Helper to switch to Moves Tab
        this.switchToMovesTab = () => {
            if (this.els.movesTabPanel.classList.contains('flex')) return;

            this.els.mobileTabPracticeBtn.style.opacity = '0.5';
            this.els.mobileTabPracticeBtn.style.borderBottomColor = 'transparent';
            
            this.els.mobileTabMovesBtn.style.opacity = '1';
            this.els.mobileTabMovesBtn.style.borderBottomColor = 'currentColor';

            this.els.practiceTabPanel.classList.remove('flex');
            this.els.practiceTabPanel.classList.add('hidden');
            
            this.els.movesTabPanel.classList.remove('hidden');
            this.els.movesTabPanel.classList.add('flex');
        };

        this.els.mobileTabPracticeBtn.onclick = this.switchToPracticeTab;
        this.els.mobileTabMovesBtn.onclick = this.switchToMovesTab;
        
        // Initialize default view
        this.switchToPracticeTab();
    }
}

window.DancePracticeTool = DancePracticeTool;
