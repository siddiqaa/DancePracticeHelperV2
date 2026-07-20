/**
 * common_practice.js
 * Consolidated training state handlers, mastery mechanics, and syncing utilities.
 * Shared between West Coast Swing and Bachata.
 */

// Centralized configuration for mastery states
const MASTERY_CONFIG = {
    learning: {
        text: 'Learning',
        textColor: 'text-red-400',
        badgeColor: 'bg-red-500/10 border-red-500/30 text-red-400',
        diffColor: 'text-red-400 bg-red-950/40 border-red-900/30'
    },
    familiar: {
        text: 'Familiar',
        textColor: 'text-amber-400',
        badgeColor: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
        diffColor: 'text-amber-400 bg-amber-950/40 border-amber-900/30'
    },
    mastered: {
        text: 'Mastered',
        textColor: 'text-emerald-400',
        badgeColor: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
        diffColor: 'text-emerald-400 bg-emerald-950/40 border-emerald-900/30'
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
        
        // DOM Elements
        this.els = {
            landmarkList: document.getElementById('landmarkList'),
            startOverlay: document.getElementById('startOverlay'),
            overlayContent: document.getElementById('overlayContent'),
            countdownDisplay: document.getElementById('countdownDisplay'),
            timerCircle: document.getElementById('timerCircle'),
            landmarkHUD: document.getElementById('landmarkHUD'),
            tutorialLinks: document.getElementById('tutorialLinks'),
            sessionProgressPct: document.getElementById('sessionProgressPct'),
            sessionProgressBar: document.getElementById('sessionProgressBar'),
            currentMoveLabel: document.getElementById('currentMoveLabel'),
            nextMoveLabel: document.getElementById('nextMoveLabel'),
            masteryStatsCount: document.getElementById('masteryStatsCount'),
            bpmSlider: document.getElementById(this.bpmSliderId),
            bpmValue: document.getElementById('bpmValue'),
            playPauseBtn: document.getElementById('playPauseBtn'),
            modeBadge: document.getElementById('modeBadge'),
            modeName: document.getElementById('modeName'),
            modeToggle: document.getElementById('modeToggle'),
            loopToggle: document.getElementById('loopToggle'),
            panicBtn: document.getElementById('panicBtn'),
            bigStartBtn: document.getElementById('bigStartBtn'),
            // Modals
            resetModal: document.getElementById('resetModal'),
            syncModal: document.getElementById('syncModal'),
            rawCodeArea: document.getElementById('rawCodeArea'),
            changesList: document.getElementById('changesList'),
            landmarkTitle: document.getElementById('landmarkTitle')
        };
    }

    init() {
        this.loadMasteryState();
        this.updateMasteryStats();
        
        // Initialize practice selection checkboxes as empty (unchecked by default)
        this.selectedLandmarkIndices = [];

        this.updateHUD();
        this.renderSidebar();
        this.updateMoveDisplay(false);
        this.setupEventListeners();
        requestAnimationFrame(() => this.draw());
    }

    // --- State Persistence ---
    loadMasteryState() {
        window.loadMasteryState(this.storageKey, this.landmarks);
    }

    saveMasteryState() {
        window.saveMasteryState(this.storageKey, this.landmarks);
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

    scheduler() {
        if (this.isPaused || this.schedHoldingForRandom) return;

        const bpm = parseInt(this.els.bpmSlider.value);
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
            this.lastRenderedMoveIdx = displayMIdx;
            this.lastRenderedLandmarkIdx = displayLIdx;
            this.currentLandmarkIdx = displayLIdx;
            this.currentMoveIdx = displayMIdx;

            this.updateHUD();
            this.renderSidebar();
            this.updateMoveDisplay(false);
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
            this.els.tutorialLinks.innerHTML = (lm.links || []).map(link => `
                <a href="${link.url}" target="_blank" class="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950/50 hover:bg-slate-900/50 text-slate-300 hover:text-white text-[10px] font-bold rounded-lg border border-slate-800 uppercase transition-colors">
                    ${link.label}
                </a>
            `).join('');
        }
        this.updateMasteryProgress();
    }

    updateMasteryProgress() {
        const lm = this.landmarks[this.currentLandmarkIdx];
        if (!lm) return;
        const stats = window.getLandmarkMastery(lm);
        
        if (this.els.sessionProgressPct) this.els.sessionProgressPct.textContent = `${stats}%`;
        if (this.els.sessionProgressBar) {
            this.els.sessionProgressBar.style.width = `${stats}%`;
            const color2 = this.danceType === 'salsa' ? '#fca5a5' : '#a78bfa';
            this.els.sessionProgressBar.style.backgroundImage = `linear-gradient(to right, ${lm.color}, ${color2})`;
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
                        <span class="text-lg sm:text-xl md:text-2xl font-black px-3 py-1 rounded bg-${this.accentColor}-950/40 border border-${this.accentColor}-900/30 text-${this.accentColor}-400 flex items-center gap-1 font-mono">${labelTag}</span>
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
        const visibleLandmarks = window.getFilteredLandmarkIndices(this.landmarks, this.activeFilter);

        if (visibleLandmarks.length === 0) {
            this.els.landmarkList.innerHTML = `
                <div class="p-6 bg-slate-950/45 rounded-xl border border-slate-850 text-slate-400 text-center flex flex-col items-center justify-center gap-2">
                    <p class="font-bold text-slate-300">No chunks in this range!</p>
                </div>
            `;
            return;
        }

        this.landmarks.forEach((lm, lIdx) => {
            if (!visibleLandmarks.includes(lIdx)) return;

            const isSelected = this.selectedLandmarkIndices.includes(lIdx);
            const isCurrent = (lIdx === this.currentLandmarkIdx);

            const section = document.createElement('div'); section.id = `lm-section-${lIdx}`;
            section.className = `p-3 rounded-xl transition-all duration-300 ${isCurrent ? 'landmark-active' : isSelected ? 'opacity-90 hover:opacity-100' : 'opacity-40 hover:opacity-60'}`;
            section.style.color = lm.color;

            const masteryPct = window.getLandmarkMastery(lm);
            
            // Move rendering (Bachata groups by 2)
            let movesHtml = '';
            if (this.danceType === 'bachata') {
                for (let mIdx = 0; mIdx < lm.moves.length; mIdx += 2) {
                    movesHtml += `<div class="border border-slate-800/80 rounded-lg p-0.5 mb-2 bg-slate-900/40 space-y-0.5">
                        ${this.renderMoveItem(lIdx, mIdx)}
                        ${this.renderMoveItem(lIdx, mIdx + 1)}
                    </div>`;
                }
            } else {
                movesHtml = `<div class="space-y-0.5 bg-slate-900/40 rounded-lg p-0.5 mb-2 border border-slate-800/80">
                    ${lm.moves.map((_, mIdx) => this.renderMoveItem(lIdx, mIdx)).join('')}
                </div>`;
            }

            section.innerHTML = `
                <div class="flex items-center justify-between mb-2 gap-2">
                    <div class="flex items-center gap-2 flex-1 min-w-0">
                        <!-- Custom Touch-optimized Checkbox Wrapper (44x44px min target area) -->
                        <div class="p-2 -m-2 flex items-center justify-center cursor-pointer select-none group/cb relative shrink-0" data-action="toggle-check" data-lidx="${lIdx}">
                            <input type="checkbox" 
                                   class="chunk-checkbox absolute opacity-0 cursor-pointer w-8 h-8 z-10" 
                                   data-lidx="${lIdx}" 
                                   ${isSelected ? 'checked' : ''}>
                            <div class="w-5 h-5 rounded-md border-2 border-slate-800 bg-slate-950 flex items-center justify-center transition-all duration-200 group-hover/cb:border-${this.accentColor}-500/50 ${isSelected ? `bg-${this.accentColor}-600/20 border-${this.accentColor}-500 text-${this.accentColor}-400 shadow-[0_0_10px_rgba(99,102,241,0.2)]` : 'text-transparent'}">
                                <svg class="w-3.5 h-3.5 stroke-[3.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                        <div class="cursor-pointer flex-1 min-w-0 pl-1" data-action="select" data-lidx="${lIdx}" data-midx="0">
                            <div class="text-xs font-bold text-slate-200 flex flex-col gap-1">
                                <span class="truncate max-w-[150px] sm:max-w-[180px]">${lm.title}</span>
                                <span class="self-start text-[9px] font-mono px-1.5 py-0.5 rounded ${masteryPct >= 75 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : masteryPct >= 40 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}">${masteryPct}% Mastery</span>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col gap-1 shrink-0">
                        <button class="text-slate-500 hover:text-white bg-slate-950/50 hover:bg-slate-800 border border-slate-800 rounded px-2 py-1" data-action="scroll-prev" data-lidx="${lIdx}"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 15l7-7 7 7"></path></svg></button>
                        <button class="text-slate-500 hover:text-white bg-slate-950/50 hover:bg-slate-800 border border-slate-800 rounded px-2 py-1" data-action="scroll-next" data-lidx="${lIdx}"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7"></path></svg></button>
                    </div>
                </div>
                ${movesHtml}
            `;
            this.els.landmarkList.appendChild(section);
        });
    }

    renderMoveItem(lIdx, mIdx) {
        const lm = this.landmarks[lIdx];
        const m = lm?.moves[mIdx];
        if (!m) return '';
        const mastery = m.mastery || 'learning';
        const config = MASTERY_CONFIG[mastery];
        const isCurrent = (lIdx === this.currentLandmarkIdx && mIdx === this.currentMoveIdx);
        
        const tooltipHtml = m.hint ? `<div class="move-tooltip">${m.hint}</div>` : '';
        const tooltipClass = m.hint ? 'has-move-tooltip' : '';

        const moveLink = m.link ? (lm.links || []).find(l => l.id === m.link) : null;
        const movieLinkHtml = moveLink ? `<a href="${moveLink.url}" target="_blank" class="ml-1 hover:scale-110 transition-transform inline-block" onclick="event.stopPropagation()">🎬</a>` : '';

        return `
            <div id="m-${lIdx}-${mIdx}" class="text-[11px] px-2 py-1.5 rounded flex items-center justify-between gap-2 group ${isCurrent ? 'move-active' : 'hover:bg-slate-900/30'} ${tooltipClass}">
                <span class="truncate flex-1 py-0.5 font-bold ${config.textColor}" data-lidx="${lIdx}" data-midx="${mIdx}">
                    ${m.hint ? '<span class="text-white mr-1">?</span>' : ''}${m.name} ${this.danceType === 'wcs' ? `<span class="opacity-60 text-[9px] font-mono">(${m.beats}🥁)</span>` : ''}${movieLinkHtml}
                </span>
                ${tooltipHtml}
                <button class="shrink-0 text-[9px] font-black uppercase tracking-wider px-2 py-1.5 sm:py-1 rounded border ${config.badgeColor} hover:brightness-125 transition-all shadow-sm active:scale-[0.97]" data-action="cycle" data-lidx="${lIdx}" data-midx="${mIdx}">
                    ${config.text}
                </button>
            </div>
        `;
    }

    // --- Actions ---
    selectMove(lIdx, mIdx) {
        this.currentLandmarkIdx = lIdx;
        this.currentMoveIdx = mIdx;
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
                this.updateMasteryProgress();
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
        if (this.els.masteryStatsCount) this.els.masteryStatsCount.textContent = `Mastered: ${stats.mastered}/${stats.total}`;
    }

    // --- Event Listeners ---
    setupEventListeners() {
        this.els.bigStartBtn.onclick = () => {
            DanceAudio.init();
            this.els.startOverlay.classList.add('hidden');
            this.isPaused = true;
            this.selectMove(this.getFilteredLandmarkIndices()[0] || 0, 0);
            if (this.els.playPauseBtn) this.els.playPauseBtn.innerHTML = this.getPlayPauseBtnHtml(true);
        };

        this.els.playPauseBtn.onclick = (e) => {
            DanceAudio.init();
            this.isPaused = !this.isPaused;
            if (this.isPaused) {
                if (this.schedulerIntervalId) clearInterval(this.schedulerIntervalId);
                this.beatsQueue = [];
            } else {
                this.schedLandmarkIdx = this.currentLandmarkIdx;
                this.schedMoveIdx = this.currentMoveIdx;
                this.schedBeatIdx = this.beatIdx;
                this.schedPhraseBeatIdx = this.phraseBeatIdx;
                this.startScheduler();
            }
            e.currentTarget.innerHTML = this.getPlayPauseBtnHtml(this.isPaused);
        };

        this.els.panicBtn.onclick = () => {
            this.selectMove(this.currentLandmarkIdx, 0);
        };

        this.els.modeToggle.onclick = () => {
            this.isRandomMode = !this.isRandomMode;
            this.els.modeBadge.textContent = this.isRandomMode ? "Random" : "Sequential";
            this.els.modeName.textContent = this.isRandomMode ? "Randomized Landmark Drills" : "Linear Sequence Training";
            this.els.modeToggle.textContent = this.isRandomMode ? "Switch to Linear" : "Randomize Chunks";
        };

        this.els.loopToggle.onchange = (e) => this.isLoopMode = e.target.checked;
        this.els.bpmSlider.oninput = (e) => {
            if (this.els.bpmValue) this.els.bpmValue.textContent = e.target.value + ' BPM';
            if (!this.isPaused) this.startScheduler();
        };

        // Filter Buttons
        ['filterAllBtn', 'filterLowBtn', 'filterMedBtn', 'filterHighBtn'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.onclick = () => this.applyFilter(id.replace('filter', '').replace('Btn', '').toLowerCase());
        });

        // Sidebar clicks
        this.els.landmarkList.onclick = (e) => {
            const checkbox = e.target.closest('.chunk-checkbox');
            const select = e.target.closest('[data-action="select"]');
            const cycle = e.target.closest('[data-action="cycle"]');
            const sPrev = e.target.closest('[data-action="scroll-prev"]');
            const sNext = e.target.closest('[data-action="scroll-next"]');
            
            if (checkbox) {
                e.stopPropagation();
                const lIdx = parseInt(checkbox.dataset.lidx);
                this.toggleLandmarkSelection(lIdx, checkbox.checked);
                return;
            }
            if (select) this.selectMove(parseInt(select.dataset.lidx), parseInt(select.dataset.midx));
            if (cycle) { e.stopPropagation(); this.cycleMastery(parseInt(cycle.dataset.lidx), parseInt(cycle.dataset.midx)); }
            if (sPrev || sNext) {
                e.stopPropagation();
                const lIdx = parseInt((sPrev || sNext).dataset.lidx);
                const filtered = window.getFilteredLandmarkIndices(this.landmarks, this.activeFilter);
                const pos = filtered.indexOf(lIdx);
                let targetIdx = -1;
                if (sPrev && pos > 0) targetIdx = filtered[pos - 1];
                if (sNext && pos < filtered.length - 1) targetIdx = filtered[pos + 1];
                if (targetIdx !== -1) document.getElementById(`lm-section-${targetIdx}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
            `<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path></svg> Resume` :
            `<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg> Pause`;
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
}

window.DancePracticeTool = DancePracticeTool;
