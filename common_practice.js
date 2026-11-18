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
 * Filter the landmark list based on active move mastery filter.
 * @param {Array} landmarks - The full list of landmarks.
 * @param {string} activeFilter - 'all' | 'learning' | 'familiar' | 'mastered'
 * @returns {Array<number>} - List of indices of landmarks containing at least one matching move.
 */
function getFilteredLandmarkIndices(landmarks, activeFilter) {
    if (!activeFilter || activeFilter === 'all') {
        return landmarks.map((_, idx) => idx);
    }
    return landmarks.map((lm, idx) => {
        const hasMatch = Boolean(lm.moves && lm.moves.some(m => (m.mastery || 'learning') === activeFilter));
        return { idx, hasMatch };
    }).filter(item => item.hasMatch).map(item => item.idx);
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
        
        // Practice Session selection state
        this.selectedMoveKeys = new Set();
        this.expandedLandmarks = new Set();
        this.searchQuery = '';

        // Move of the Day (MotD) state
        this.activeMotd = null; // { category, lIdx, mIdx, sequence, currentSlotIdx, schedSlotIdx, lastRenderedSlotIdx }
        this.preMotdState = null;
        this.motdNoticeTimer = null;
        
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
            // MotD Controls
            learningMotdBtn: document.getElementById('learningMotdBtn'),
            familiarMotdBtn: document.getElementById('familiarMotdBtn'),
            motdBanner: document.getElementById('motdBanner'),
            motdBadge: document.getElementById('motdBadge'),
            motdSourceLabel: document.getElementById('motdSourceLabel'),
            motdRerollBtn: document.getElementById('motdRerollBtn'),
            motdExitBtn: document.getElementById('motdExitBtn'),
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

    isMoveActive(move) {
        return !move || move.status !== 'inactive';
    }

    findNextActiveMoveIdx(lIdx, startMIdx = 0) {
        const lm = this.landmarks[lIdx];
        if (!lm || !lm.moves) return -1;
        for (let i = startMIdx; i < lm.moves.length; i++) {
            if (this.isMoveActive(lm.moves[i])) {
                return i;
            }
        }
        return -1;
    }

    init() {
        this.loadMasteryState();
        this.updateMasteryStats();
        this.updateDailyMovesUI();
        
        if (this.els.bpmInput && this.els.bpmSlider) {
            this.els.bpmInput.value = this.els.bpmSlider.value;
        }
        
        // Initialize practice selection checkboxes as empty (unchecked by default)
        this.selectedMoveKeys.clear();

        this.updateHUD();
        this.renderSidebar();
        
        this.isPaused = true;
        const initialLIdx = this.getFilteredLandmarkIndices()[0] || 0;
        const initialMIdx = this.findNextActiveMoveIdx(initialLIdx, 0);
        this.selectMove(initialLIdx, initialMIdx !== -1 ? initialMIdx : 0, false);
        if (this.els.playPauseBtn) this.els.playPauseBtn.innerHTML = this.getPlayPauseBtnHtml(true);

        this.updateMoveDisplay(false);
        this.setupEventListeners();
        this.setupMobileTabs();

        if (window.ChunkSpeech && document.getElementById('ttsToggleBtn')) {
            window.ChunkSpeech.initUI('ttsToggleBtn');
        }

        requestAnimationFrame(() => this.draw());
    }

    // --- Selection & Sequence Helpers ---
    get selectedLandmarkIndices() {
        const set = new Set();
        if (this.selectedMoveKeys) {
            this.selectedMoveKeys.forEach(key => {
                const [lIdx] = key.split('-').map(Number);
                set.add(lIdx);
            });
        }
        return Array.from(set);
    }

    set selectedLandmarkIndices(arr) {
        if (!this.selectedMoveKeys) return;
        this.selectedMoveKeys.clear();
        if (Array.isArray(arr) && arr.length > 0) {
            arr.forEach(lIdx => {
                const lm = this.landmarks?.[lIdx];
                if (lm && lm.moves) {
                    lm.moves.forEach((m, mIdx) => {
                        if (this.isMoveActive(m)) {
                            this.selectedMoveKeys.add(`${lIdx}-${mIdx}`);
                        }
                    });
                }
            });
        }
    }

    isMoveActive(m) {
        return m && m.status !== 'inactive';
    }

    doesMoveMatchFilter(m) {
        if (!m) return false;
        if (!this.activeFilter || this.activeFilter === 'all') return true;
        return (m.mastery || 'learning') === this.activeFilter;
    }

    doesMoveMatchQuery(m) {
        if (!m) return false;
        const query = (this.searchQuery || '').trim().toLowerCase();
        return !query || m.name.toLowerCase().includes(query);
    }

    doesMoveMatchSidebar(m) {
        return this.doesMoveMatchFilter(m) && this.doesMoveMatchQuery(m);
    }

    findNextPracticeMoveIdx(lIdx, startMIdx = 0) {
        const lm = this.landmarks[lIdx];
        if (!lm || !lm.moves) return -1;
        for (let i = startMIdx; i < lm.moves.length; i++) {
            if (this.isMoveActive(lm.moves[i]) && this.doesMoveMatchFilter(lm.moves[i])) {
                return i;
            }
        }
        return -1;
    }

    getVisibleLandmarkIndices() {
        let visibleLandmarks = window.getFilteredLandmarkIndices(this.landmarks, this.activeFilter);
        const query = (this.searchQuery || '').trim().toLowerCase();
        if (query) {
            visibleLandmarks = visibleLandmarks.filter(lIdx => {
                const lm = this.landmarks[lIdx];
                return lm.moves.some(m => this.doesMoveMatchSidebar(m));
            });
        }
        return visibleLandmarks;
    }

    getPracticeSequence() {
        if (this.activeMotd && Array.isArray(this.activeMotd.sequence) && this.activeMotd.sequence.length > 0) {
            return this.activeMotd.sequence;
        }

        const filteredLandmarkIndices = window.getFilteredLandmarkIndices(this.landmarks, this.activeFilter);
        const sequence = [];
        const hasSelections = this.selectedMoveKeys.size > 0;

        filteredLandmarkIndices.forEach(lIdx => {
            const lm = this.landmarks[lIdx];
            if (!lm || !lm.moves) return;

            lm.moves.forEach((m, mIdx) => {
                if (this.isMoveActive(m) && this.doesMoveMatchFilter(m)) {
                    const key = `${lIdx}-${mIdx}`;
                    if (!hasSelections || this.selectedMoveKeys.has(key)) {
                        sequence.push({ lIdx, mIdx, move: m });
                    }
                }
            });
        });

        return sequence;
    }

    getNextPracticeItem(currentLIdx, currentMIdx) {
        if (this.activeMotd && Array.isArray(this.activeMotd.sequence) && this.activeMotd.sequence.length > 0) {
            const nextSlotIdx = (this.activeMotd.currentSlotIdx + 1) % this.activeMotd.sequence.length;
            return this.activeMotd.sequence[nextSlotIdx];
        }

        const seq = this.getPracticeSequence();
        if (seq.length === 0) return null;

        const currSeqIdx = seq.findIndex(item => item.lIdx === currentLIdx && item.mIdx === currentMIdx);

        if (currSeqIdx !== -1) {
            const nextSeqIdx = (currSeqIdx + 1) % seq.length;
            return seq[nextSeqIdx];
        } else {
            const afterItem = seq.find(item => item.lIdx > currentLIdx || (item.lIdx === currentLIdx && item.mIdx > currentMIdx));
            return afterItem || seq[0];
        }
    }

    // --- Move of the Day (MotD) Helpers ---
    getMotdStorageKey() {
        return `dance_motd_${this.danceType || 'general'}`;
    }

    isPrepMoveName(name) {
        if (!name) return false;
        const n = name.trim().toLowerCase();
        if (this.danceType === 'wcs') {
            return n === 'sugar push';
        }
        if (this.danceType === 'bachata') {
            return n === 'basic' || n === 'closed basic' || n === 'open basic' || n === 'basic (open hold)';
        }
        if (this.danceType === 'salsa') {
            return n === 'basic' || n.startsWith('basic (');
        }
        return false;
    }

    getMotdCandidates(category) {
        const all = [];
        const nonPrep = [];
        this.landmarks.forEach((lm, lIdx) => {
            if (!lm || !lm.moves) return;
            lm.moves.forEach((move, mIdx) => {
                if (this.isMoveActive(move) && (move.mastery || 'learning') === category) {
                    const entry = { lIdx, mIdx, move };
                    all.push(entry);
                    if (!this.isPrepMoveName(move.name)) {
                        nonPrep.push(entry);
                    }
                }
            });
        });
        return nonPrep.length > 0 ? nonPrep : all;
    }

    findPrepMoveRef(preferredNames = []) {
        for (const targetName of preferredNames) {
            const lowerTarget = targetName.toLowerCase();
            for (let lIdx = 0; lIdx < this.landmarks.length; lIdx++) {
                const lm = this.landmarks[lIdx];
                if (!lm || !lm.moves) continue;
                for (let mIdx = 0; mIdx < lm.moves.length; mIdx++) {
                    const m = lm.moves[mIdx];
                    if (m && m.name && m.name.trim().toLowerCase() === lowerTarget) {
                        return { lIdx, mIdx, move: m };
                    }
                }
            }
        }
        return null;
    }

    findSalsaPair(lIdx, mIdx) {
        const lm = this.landmarks[lIdx];
        if (!lm || !lm.moves) return null;
        const move = lm.moves[mIdx];
        if (!move || this.isPrepMoveName(move.name)) return null;

        const name = move.name.trim();
        const lower = name.toLowerCase();
        const isStartLike = lower.endsWith('setup') || lower.endsWith('(start)') || lower === 'enchufla';
        const isFinishLike = lower.endsWith('finish') || lower.endsWith('(finish)');

        if (isStartLike && mIdx + 1 < lm.moves.length) {
            const next = lm.moves[mIdx + 1];
            if (next && this.isMoveActive(next)) {
                const nextLower = next.name.trim().toLowerCase();
                if (nextLower.endsWith('finish') || nextLower.endsWith('(finish)')) {
                    return [mIdx, mIdx + 1];
                }
            }
        }

        if (isFinishLike && mIdx - 1 >= 0) {
            const prev = lm.moves[mIdx - 1];
            if (prev && this.isMoveActive(prev)) {
                const prevLower = prev.name.trim().toLowerCase();
                if (prevLower.endsWith('setup') || prevLower.endsWith('(start)') || prevLower === 'enchufla') {
                    return [mIdx - 1, mIdx];
                }
            }
        }

        // Consecutive identical two-part Salsa move (e.g., "CBL With Leader Spin" x 2)
        if (mIdx + 1 < lm.moves.length) {
            const next = lm.moves[mIdx + 1];
            if (next && this.isMoveActive(next) && next.name.trim().toLowerCase() === lower) {
                return [mIdx, mIdx + 1];
            }
        }
        if (mIdx - 1 >= 0) {
            const prev = lm.moves[mIdx - 1];
            if (prev && this.isMoveActive(prev) && prev.name.trim().toLowerCase() === lower) {
                return [mIdx - 1, mIdx];
            }
        }

        // Symmetric 8-count pairs aligned to phrase boundary (e.g., Mambo (Front)/(Back), Left Turn (Lead)/(Follow))
        const symmetricPairs = [
            ['(front)', '(back)'],
            ['(left)', '(right)'],
            ['(lead)', '(follow)']
        ];
        for (const [firstTag, secondTag] of symmetricPairs) {
            if (lower.endsWith(firstTag) && mIdx % 2 === 0 && mIdx + 1 < lm.moves.length) {
                const next = lm.moves[mIdx + 1];
                if (next && this.isMoveActive(next)) {
                    const base = lower.slice(0, -firstTag.length).trim();
                    const nextLower = next.name.trim().toLowerCase();
                    if (nextLower.endsWith(secondTag) && nextLower.slice(0, -secondTag.length).trim() === base) {
                        return [mIdx, mIdx + 1];
                    }
                }
            }
            if (lower.endsWith(secondTag) && mIdx % 2 === 1 && mIdx - 1 >= 0) {
                const prev = lm.moves[mIdx - 1];
                if (prev && this.isMoveActive(prev)) {
                    const base = lower.slice(0, -secondTag.length).trim();
                    const prevLower = prev.name.trim().toLowerCase();
                    if (prevLower.endsWith(firstTag) && prevLower.slice(0, -firstTag.length).trim() === base) {
                        return [mIdx - 1, mIdx];
                    }
                }
            }
        }

        return null;
    }

    buildMotdSequence(lIdx, mIdx) {
        const lm = this.landmarks[lIdx];
        const targetMove = lm?.moves?.[mIdx];
        if (!targetMove) return [];

        if (this.danceType === 'wcs') {
            const prep = this.findPrepMoveRef(['Sugar Push']) || {
                lIdx: 0,
                mIdx: 0,
                move: { name: 'Sugar Push', beats: 6, mastery: 'mastered' }
            };
            return [
                { lIdx: prep.lIdx, mIdx: prep.mIdx, move: prep.move, motdSlotIdx: 0, isPrep: true, isTarget: false },
                { lIdx, mIdx, move: targetMove, motdSlotIdx: 1, isPrep: false, isTarget: true }
            ];
        }

        if (this.danceType === 'bachata') {
            const basicRef = this.findPrepMoveRef(['Basic']) || {
                lIdx: 0,
                mIdx: 0,
                move: { name: 'Basic', beats: 4, mastery: 'mastered' }
            };
            const pairStart = mIdx - (mIdx % 2);
            const mA = lm.moves[pairStart];
            const mB = lm.moves[pairStart + 1];
            const isBachataPair = Boolean(
                mA && mB &&
                this.isMoveActive(mA) && this.isMoveActive(mB) &&
                !this.isPrepMoveName(mA.name) && !this.isPrepMoveName(mB.name)
            );

            if (isBachataPair) {
                return [
                    { lIdx: basicRef.lIdx, mIdx: basicRef.mIdx, move: basicRef.move, motdSlotIdx: 0, isPrep: true, isTarget: false },
                    { lIdx: basicRef.lIdx, mIdx: basicRef.mIdx, move: basicRef.move, motdSlotIdx: 1, isPrep: true, isTarget: false },
                    { lIdx, mIdx: pairStart, move: mA, motdSlotIdx: 2, isPrep: false, isTarget: pairStart === mIdx },
                    { lIdx, mIdx: pairStart + 1, move: mB, motdSlotIdx: 3, isPrep: false, isTarget: pairStart + 1 === mIdx }
                ];
            }

            return [
                { lIdx: basicRef.lIdx, mIdx: basicRef.mIdx, move: basicRef.move, motdSlotIdx: 0, isPrep: true, isTarget: false },
                { lIdx: basicRef.lIdx, mIdx: basicRef.mIdx, move: basicRef.move, motdSlotIdx: 1, isPrep: true, isTarget: false },
                { lIdx, mIdx, move: targetMove, motdSlotIdx: 2, isPrep: false, isTarget: true },
                { lIdx: basicRef.lIdx, mIdx: basicRef.mIdx, move: basicRef.move, motdSlotIdx: 3, isPrep: true, isTarget: false }
            ];
        }

        // Salsa (default 8-count prep + move)
        const basicFront = this.findPrepMoveRef(['Basic (Front Part)', 'Basic (Front)', 'Basic']) || {
            lIdx: 0,
            mIdx: 0,
            move: { name: 'Basic (Front)', beats: 4, mastery: 'mastered' }
        };
        const basicBack = this.findPrepMoveRef(['Basic (Back Part)', 'Basic (Back)', 'Basic']) || {
            lIdx: 0,
            mIdx: 1,
            move: { name: 'Basic (Back)', beats: 4, mastery: 'mastered' }
        };

        const salsaPair = this.findSalsaPair(lIdx, mIdx);
        if (salsaPair) {
            const [p1, p2] = salsaPair;
            return [
                { lIdx: basicFront.lIdx, mIdx: basicFront.mIdx, move: basicFront.move, motdSlotIdx: 0, isPrep: true, isTarget: false },
                { lIdx: basicBack.lIdx, mIdx: basicBack.mIdx, move: basicBack.move, motdSlotIdx: 1, isPrep: true, isTarget: false },
                { lIdx, mIdx: p1, move: lm.moves[p1], motdSlotIdx: 2, isPrep: false, isTarget: p1 === mIdx },
                { lIdx, mIdx: p2, move: lm.moves[p2], motdSlotIdx: 3, isPrep: false, isTarget: p2 === mIdx }
            ];
        }

        return [
            { lIdx: basicFront.lIdx, mIdx: basicFront.mIdx, move: basicFront.move, motdSlotIdx: 0, isPrep: true, isTarget: false },
            { lIdx: basicBack.lIdx, mIdx: basicBack.mIdx, move: basicBack.move, motdSlotIdx: 1, isPrep: true, isTarget: false },
            { lIdx, mIdx, move: targetMove, motdSlotIdx: 2, isPrep: false, isTarget: true },
            { lIdx: basicBack.lIdx, mIdx: basicBack.mIdx, move: basicBack.move, motdSlotIdx: 3, isPrep: true, isTarget: false }
        ];
    }

    loadSavedMotdEntry() {
        const today = new Date().toLocaleDateString('en-CA');
        try {
            const raw = localStorage.getItem(this.getMotdStorageKey());
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed && parsed.date === today) {
                    return parsed;
                }
            }
        } catch (e) {
            console.warn('Error reading MotD state', e);
        }
        return { date: today, learning: null, familiar: null };
    }

    saveMotdEntry(category, lIdx, mIdx) {
        const entry = this.loadSavedMotdEntry();
        entry[category] = { lIdx, mIdx };
        try {
            localStorage.setItem(this.getMotdStorageKey(), JSON.stringify(entry));
        } catch (e) {
            console.warn('Error saving MotD state', e);
        }
    }

    resolveMotdTarget(category, forceReroll = false) {
        const candidates = this.getMotdCandidates(category);
        if (candidates.length === 0) return null;

        if (!forceReroll) {
            const saved = this.loadSavedMotdEntry();
            const pick = saved[category];
            if (pick && typeof pick.lIdx === 'number' && typeof pick.mIdx === 'number') {
                const stillValid = candidates.find(c => c.lIdx === pick.lIdx && c.mIdx === pick.mIdx);
                if (stillValid) {
                    return stillValid;
                }
            }
        }

        let pool = candidates;
        if (forceReroll && this.activeMotd && this.activeMotd.category === category && candidates.length > 1) {
            const filteredPool = candidates.filter(c => !(c.lIdx === this.activeMotd.lIdx && c.mIdx === this.activeMotd.mIdx));
            if (filteredPool.length > 0) {
                pool = filteredPool;
            }
        }

        const chosen = pool[Math.floor(Math.random() * pool.length)];
        this.saveMotdEntry(category, chosen.lIdx, chosen.mIdx);
        return chosen;
    }

    showMotdEmptyNotice(category) {
        if (!this.els.motdBanner) return;
        if (this.motdNoticeTimer) clearTimeout(this.motdNoticeTimer);

        this.els.motdBanner.classList.remove('hidden');
        if (this.els.motdBadge) {
            const label = category === 'learning' ? 'Learning MotD' : 'Familiar MotD';
            const cls = category === 'learning'
                ? 'bg-rose-400 text-rose-950'
                : 'bg-amber-300 text-amber-950';
            this.els.motdBadge.className = `px-2 py-0.5 rounded-lg border-2 border-stone-900 text-[10px] font-black uppercase tracking-wider shrink-0 ${cls}`;
            this.els.motdBadge.textContent = label;
        }
        if (this.els.motdSourceLabel) {
            this.els.motdSourceLabel.textContent = `No active ${category} moves available!`;
        }
        if (this.els.motdRerollBtn) {
            this.els.motdRerollBtn.classList.add('hidden');
        }

        this.motdNoticeTimer = setTimeout(() => {
            if (!this.activeMotd) {
                this.updateMotdUI();
            }
        }, 3500);
    }

    activateMotd(category, forceReroll = false) {
        if (!forceReroll && this.activeMotd && this.activeMotd.category === category) {
            this.exitMotd(true);
            return;
        }

        const target = this.resolveMotdTarget(category, forceReroll);
        if (!target) {
            this.showMotdEmptyNotice(category);
            return;
        }

        if (this.motdNoticeTimer) {
            clearTimeout(this.motdNoticeTimer);
            this.motdNoticeTimer = null;
        }

        if (!this.activeMotd) {
            this.preMotdState = {
                lIdx: this.currentLandmarkIdx,
                mIdx: this.currentMoveIdx
            };
        }

        const sequence = this.buildMotdSequence(target.lIdx, target.mIdx);
        if (sequence.length === 0) return;

        this.activeMotd = {
            category,
            lIdx: target.lIdx,
            mIdx: target.mIdx,
            sequence,
            currentSlotIdx: 0,
            schedSlotIdx: 0,
            lastRenderedSlotIdx: 0
        };

        const firstSlot = sequence[0];
        this.currentLandmarkIdx = firstSlot.lIdx;
        this.currentMoveIdx = firstSlot.mIdx;
        this.beatIdx = 0;
        this.phraseBeatIdx = 0;
        this.schedLandmarkIdx = firstSlot.lIdx;
        this.schedMoveIdx = firstSlot.mIdx;
        this.schedBeatIdx = 0;
        this.schedPhraseBeatIdx = 0;
        this.beatsQueue = [];
        if (DanceAudio.isReady()) this.nextBeatTime = DanceAudio.getCurrentTime();

        this.updateMotdUI();
        this.updateHUD();
        this.renderSidebar();
        this.updateMoveDisplay(true, false);

        if (window.ChunkSpeech) {
            window.ChunkSpeech.announceChunk(target.move.name);
        }
    }

    exitMotd(restoreSelection = true) {
        if (this.motdNoticeTimer) {
            clearTimeout(this.motdNoticeTimer);
            this.motdNoticeTimer = null;
        }

        const wasActive = Boolean(this.activeMotd);
        this.activeMotd = null;
        this.updateMotdUI();

        if (!wasActive) return;

        if (restoreSelection) {
            let nextL = this.preMotdState ? this.preMotdState.lIdx : 0;
            let nextM = this.preMotdState ? this.preMotdState.mIdx : 0;
            const seq = this.getPracticeSequence();
            if (seq.length > 0 && !seq.some(item => item.lIdx === nextL && item.mIdx === nextM)) {
                nextL = seq[0].lIdx;
                nextM = seq[0].mIdx;
            }
            this.preMotdState = null;
            this.selectMove(nextL, nextM, false, false);
        } else {
            this.preMotdState = null;
        }
    }

    updateMotdUI() {
        const learningBtn = this.els.learningMotdBtn;
        const familiarBtn = this.els.familiarMotdBtn;

        const activeCategory = this.activeMotd ? this.activeMotd.category : null;

        if (learningBtn) {
            if (activeCategory === 'learning') {
                learningBtn.className = 'px-3 py-1.5 bg-rose-400 text-rose-950 border-2 border-stone-900 rounded-xl text-xs font-black transition-all shadow-[2px_2px_0px_#1c1917] active:scale-[0.97] whitespace-nowrap cursor-pointer ring-2 ring-white/80';
                learningBtn.setAttribute('aria-pressed', 'true');
            } else {
                learningBtn.className = 'px-3 py-1.5 bg-[#fefae0] text-stone-900 border-2 border-stone-900 rounded-xl text-xs font-black hover:bg-[#ffe4e6] transition-all shadow-[2px_2px_0px_#1c1917] active:scale-[0.97] whitespace-nowrap cursor-pointer';
                learningBtn.setAttribute('aria-pressed', 'false');
            }
        }

        if (familiarBtn) {
            if (activeCategory === 'familiar') {
                familiarBtn.className = 'px-3 py-1.5 bg-amber-300 text-amber-950 border-2 border-stone-900 rounded-xl text-xs font-black transition-all shadow-[2px_2px_0px_#1c1917] active:scale-[0.97] whitespace-nowrap cursor-pointer ring-2 ring-white/80';
                familiarBtn.setAttribute('aria-pressed', 'true');
            } else {
                familiarBtn.className = 'px-3 py-1.5 bg-[#fefae0] text-stone-900 border-2 border-stone-900 rounded-xl text-xs font-black hover:bg-[#fef3c7] transition-all shadow-[2px_2px_0px_#1c1917] active:scale-[0.97] whitespace-nowrap cursor-pointer';
                familiarBtn.setAttribute('aria-pressed', 'false');
            }
        }

        if (this.els.motdBanner) {
            if (this.activeMotd) {
                const lm = this.landmarks[this.activeMotd.lIdx];
                const move = lm?.moves?.[this.activeMotd.mIdx];
                const isLearning = this.activeMotd.category === 'learning';

                this.els.motdBanner.classList.remove('hidden');
                if (this.els.motdBadge) {
                    this.els.motdBadge.className = `px-2 py-0.5 rounded-lg border-2 border-stone-900 text-[10px] font-black uppercase tracking-wider shrink-0 ${isLearning ? 'bg-rose-400 text-rose-950' : 'bg-amber-300 text-amber-950'}`;
                    this.els.motdBadge.textContent = isLearning ? 'Learning MotD' : 'Familiar MotD';
                }
                if (this.els.motdSourceLabel) {
                    this.els.motdSourceLabel.textContent = move ? `${move.name} · ${lm.title}` : lm?.title || '';
                }
                if (this.els.motdRerollBtn) {
                    this.els.motdRerollBtn.classList.remove('hidden');
                }
            } else {
                this.els.motdBanner.classList.add('hidden');
            }
        }
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
        if (this.activeMotd) {
            this.exitMotd(false);
        }
        this.activeFilter = filterVal;
        const btnMap = {
            all: { id: 'filterAllBtn', activeClass: 'bg-stone-900 text-white border-stone-900 shadow-sm' },
            learning: { id: 'filterLearningBtn', activeClass: 'bg-rose-400 text-rose-950 border-stone-900 shadow-sm' },
            familiar: { id: 'filterFamiliarBtn', activeClass: 'bg-amber-300 text-amber-950 border-stone-900 shadow-sm' },
            mastered: { id: 'filterMasteredBtn', activeClass: 'bg-emerald-400 text-emerald-950 border-stone-900 shadow-sm' }
        };

        Object.entries(btnMap).forEach(([key, cfg]) => {
            const btn = document.getElementById(cfg.id);
            if (!btn) return;
            if (key === filterVal) {
                btn.className = `py-1.5 px-1 text-[10px] font-black uppercase rounded-lg transition-all border ${cfg.activeClass}`;
            } else {
                btn.className = 'py-1.5 px-1 text-[10px] font-bold uppercase rounded-lg transition-all text-stone-800 hover:text-stone-950 hover:bg-[#fefae0] border border-transparent';
            }
        });

        // Reset the selection checkboxes as empty (unchecked after filter is changed)
        this.selectedMoveKeys.clear();

        this.renderSidebar();

        const seq = this.getPracticeSequence();
        if (seq.length > 0) {
            const isCurrentInSeq = seq.some(item => item.lIdx === this.currentLandmarkIdx && item.mIdx === this.currentMoveIdx);
            if (!isCurrentInSeq) {
                this.selectMove(seq[0].lIdx, seq[0].mIdx, false, false);
            } else {
                this.updateMoveDisplay(false, false);
            }
        } else {
            const visible = window.getFilteredLandmarkIndices(this.landmarks, this.activeFilter);
            if (visible.length > 0) {
                const lm = this.landmarks[visible[0]];
                const firstMatchMIdx = lm.moves.findIndex(m => this.doesMoveMatchFilter(m));
                this.selectMove(visible[0], firstMatchMIdx !== -1 ? firstMatchMIdx : 0, false, false);
            } else {
                this.updateMoveDisplay(false, false);
            }
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
            if (this.activeMotd && Array.isArray(this.activeMotd.sequence) && this.activeMotd.sequence.length > 0) {
                const slotIdx = this.activeMotd.schedSlotIdx % this.activeMotd.sequence.length;
                const slotItem = this.activeMotd.sequence[slotIdx];
                const currentMove = slotItem.move;

                this.onPlayBeat(this.nextBeatTime, this.schedBeatIdx, this.schedPhraseBeatIdx, currentMove);

                this.beatsQueue.push({
                    beat: this.schedBeatIdx,
                    phraseBeat: this.schedPhraseBeatIdx,
                    time: this.nextBeatTime,
                    moveIdx: slotItem.mIdx,
                    landmarkIdx: slotItem.lIdx,
                    motdSlotIdx: slotIdx,
                    landmarkColor: this.landmarks[this.activeMotd.lIdx]?.color || this.landmarks[slotItem.lIdx]?.color,
                    moveName: currentMove.name,
                    beatsTotal: currentMove.beats || 4
                });

                this.advanceBeat(secondsPerBeat);
                continue;
            }

            // Ensure schedMoveIdx points to an active, filter-matching move
            const schedCandMove = this.landmarks[this.schedLandmarkIdx]?.moves?.[this.schedMoveIdx];
            if (!this.isMoveActive(schedCandMove) || !this.doesMoveMatchFilter(schedCandMove)) {
                const nextActiveMIdx = this.findNextPracticeMoveIdx(this.schedLandmarkIdx, this.schedMoveIdx);
                if (nextActiveMIdx !== -1) {
                    this.schedMoveIdx = nextActiveMIdx;
                } else {
                    this.advanceLandmarkInScheduler();
                    if (this.schedHoldingForRandom) break;
                    continue;
                }
            }
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

        if (this.activeMotd && Array.isArray(this.activeMotd.sequence) && this.activeMotd.sequence.length > 0) {
            const currentSlot = this.activeMotd.sequence[this.activeMotd.schedSlotIdx];
            const beatsTotal = currentSlot?.move?.beats || 4;
            if (this.schedBeatIdx >= beatsTotal) {
                this.schedBeatIdx = 0;
                if (!this.isLoopMode) {
                    this.activeMotd.schedSlotIdx = (this.activeMotd.schedSlotIdx + 1) % this.activeMotd.sequence.length;
                    const nextSlot = this.activeMotd.sequence[this.activeMotd.schedSlotIdx];
                    this.schedLandmarkIdx = nextSlot.lIdx;
                    this.schedMoveIdx = nextSlot.mIdx;
                }
            }
            if (this.danceType === 'salsa' || this.danceType === 'bachata') {
                const isOddSlot = (this.activeMotd.schedSlotIdx % 2 !== 0);
                this.schedPhraseBeatIdx = isOddSlot ? (this.schedBeatIdx + 4) % 8 : this.schedBeatIdx % 8;
            }
            return;
        }

        const currentMove = this.landmarks[this.schedLandmarkIdx].moves[this.schedMoveIdx];
        const beatsTotal = currentMove.beats || 4;
        
        if (this.schedBeatIdx >= beatsTotal) {
            this.schedBeatIdx = 0;
            if (this.isLoopMode) {
                // Loop current move
            } else {
                const nextItem = this.getNextPracticeItem(this.schedLandmarkIdx, this.schedMoveIdx);
                if (nextItem) {
                    const seq = this.getPracticeSequence();
                    const currSeqIdx = seq.findIndex(item => item.lIdx === this.schedLandmarkIdx && item.mIdx === this.schedMoveIdx);
                    const isLastInSeq = (currSeqIdx === seq.length - 1);

                    if (this.isRandomMode && !this.selectedMoveKeys.size && isLastInSeq) {
                        this.schedHoldingForRandom = true;
                    } else {
                        this.schedLandmarkIdx = nextItem.lIdx;
                        this.schedMoveIdx = nextItem.mIdx;
                    }
                } else {
                    this.advanceLandmarkInScheduler();
                }
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

    advanceLandmarkInScheduler() {
        const filtered = this.getFilteredLandmarkIndices();
        const currentFilteredPos = filtered.indexOf(this.schedLandmarkIdx);
        let nextLIdx = -1;
        let nextMIdx = -1;

        if (filtered.length > 0) {
            let startPos = currentFilteredPos !== -1 ? currentFilteredPos : 0;
            for (let i = 1; i <= filtered.length; i++) {
                const candLIdx = filtered[(startPos + i) % filtered.length];
                const candMIdx = this.findNextPracticeMoveIdx(candLIdx, 0);
                if (candMIdx !== -1) {
                    nextLIdx = candLIdx;
                    nextMIdx = candMIdx;
                    break;
                }
            }
        }

        if (nextLIdx === -1) {
            for (let i = 1; i <= this.landmarks.length; i++) {
                const candLIdx = (this.schedLandmarkIdx + i) % this.landmarks.length;
                const candMIdx = this.findNextActiveMoveIdx(candLIdx, 0);
                if (candMIdx !== -1) {
                    nextLIdx = candLIdx;
                    nextMIdx = candMIdx;
                    break;
                }
            }
        }

        if (nextLIdx !== -1) {
            this.schedLandmarkIdx = nextLIdx;
            this.schedMoveIdx = nextMIdx;
        } else {
            this.schedHoldingForRandom = true;
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

        if (this.activeMotd && typeof playedBeat.motdSlotIdx === 'number') {
            let displaySlotIdx = playedBeat.motdSlotIdx;
            if (shouldPreempt && !this.isLoopMode) {
                displaySlotIdx = (displaySlotIdx + 1) % this.activeMotd.sequence.length;
            }

            if (displaySlotIdx !== this.activeMotd.lastRenderedSlotIdx) {
                this.activeMotd.lastRenderedSlotIdx = displaySlotIdx;
                this.activeMotd.currentSlotIdx = displaySlotIdx;
                const slotItem = this.activeMotd.sequence[displaySlotIdx];
                this.currentLandmarkIdx = slotItem.lIdx;
                this.currentMoveIdx = slotItem.mIdx;

                this.updateHUD();
                this.renderSidebar();
                this.updateMoveDisplay(false, false);
            }
            return;
        }

        if (shouldPreempt) {
            if (this.isLoopMode) {
                // Keep displayMIdx
            } else {
                const nextItem = this.getNextPracticeItem(displayLIdx, displayMIdx);
                if (nextItem) {
                    displayLIdx = nextItem.lIdx;
                    displayMIdx = nextItem.mIdx;
                }
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

        // Random mode landmark completion (only when no custom move/chunk selections exist)
        const isLastActiveMove = (this.findNextPracticeMoveIdx(playedBeat.landmarkIdx, playedBeat.moveIdx + 1) === -1);
        const isLastBeatOfMove = playedBeat.beat === playedBeat.beatsTotal - 1;
        if (this.isRandomMode && !this.selectedMoveKeys.size && isLastActiveMove && isLastBeatOfMove) {
            this.triggerRandomCountdown();
        }
    }

    triggerRandomCountdown() {
        this.isPaused = true;
        if (this.schedulerIntervalId) clearInterval(this.schedulerIntervalId);
        this.beatsQueue = [];
        this.schedHoldingForRandom = false;

        const filtered = this.selectedMoveKeys.size > 0
            ? this.getFilteredLandmarkIndices()
            : window.getFilteredLandmarkIndices(this.landmarks, this.activeFilter);
        const validFiltered = filtered.filter(lIdx => this.findNextPracticeMoveIdx(lIdx, 0) !== -1);

        if (validFiltered.length > 1) {
            let nextIdx;
            do {
                nextIdx = validFiltered[Math.floor(Math.random() * validFiltered.length)];
            } while (nextIdx === this.currentLandmarkIdx && validFiltered.length > 1);
            this.currentLandmarkIdx = nextIdx;
        } else if (validFiltered.length === 1) {
            this.currentLandmarkIdx = validFiltered[0];
        }

        const firstActive = this.findNextPracticeMoveIdx(this.currentLandmarkIdx, 0);
        this.currentMoveIdx = firstActive !== -1 ? firstActive : 0;
        this.beatIdx = 0;
        this.schedLandmarkIdx = this.currentLandmarkIdx;
        this.schedMoveIdx = this.currentMoveIdx;
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
        const hudLIdx = this.activeMotd ? this.activeMotd.lIdx : this.currentLandmarkIdx;
        const lm = this.landmarks[hudLIdx];
        if (!lm) return;
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

    updateMoveDisplay(shouldRestart = true, autoScroll = true) {
        let move;
        let slotIdx = null;
        if (this.activeMotd && Array.isArray(this.activeMotd.sequence) && this.activeMotd.sequence.length > 0) {
            slotIdx = this.activeMotd.currentSlotIdx % this.activeMotd.sequence.length;
            move = this.activeMotd.sequence[slotIdx].move;
        } else {
            const lm = this.landmarks[this.currentLandmarkIdx];
            move = lm.moves[this.currentMoveIdx];
        }

        const mastery = move.mastery || 'learning';
        const config = MASTERY_CONFIG[mastery] || MASTERY_CONFIG.learning;
        const isInactive = (move.status === 'inactive');
        const nameTextColor = isInactive ? 'text-stone-400 font-medium' : config.textColor;

        // Custom label based on dance type
        let labelTag = '';
        if (this.danceType === 'wcs') {
            labelTag = `${move.beats}🥁`;
        } else {
            // In MotD mode, align 1-4 / 5-8 with the MotD sequence slot index
            const effectiveIdx = slotIdx !== null ? slotIdx : this.currentMoveIdx;
            labelTag = (effectiveIdx % 2 !== 0) ? "5-8" : "1-4";
        }

        let hintHtml = move.hint ? `<div class="text-xs sm:text-sm mt-2 text-center font-bold tracking-wider text-amber-300 bg-amber-950/60 border border-amber-500/30 px-3 py-1 rounded-xl shadow-lg">${move.hint}</div>` : '';

        let nextMoveHtml = "End of practice sequence";
        const nextItem = this.getNextPracticeItem(this.currentLandmarkIdx, this.currentMoveIdx);
        if (nextItem) {
            const nextLm = this.landmarks[nextItem.lIdx];
            const next = nextItem.move || nextLm?.moves?.[nextItem.mIdx];
            if (next) {
                const nextConf = MASTERY_CONFIG[next.mastery || 'learning'] || MASTERY_CONFIG.learning;
                const nextIsInactive = (next.status === 'inactive');
                const nextTextColor = nextIsInactive ? 'text-stone-400' : nextConf.textColor;
                const chunkTag = (!this.activeMotd && nextItem.lIdx !== this.currentLandmarkIdx) ? `<span class="text-[10px] text-stone-500 font-normal">(${nextLm.title})</span> ` : '';
                nextMoveHtml = `${chunkTag}<span class="${nextTextColor} font-bold">${next.name}</span>`;
            }
        }

        if (this.els.currentMoveLabel) {
            const animClass = this.danceType === 'wcs' ? 'animate-label' : 'active-move-animate';
            this.els.currentMoveLabel.innerHTML = `
                <div class="${animClass} ${this.isPaused ? 'paused-anim' : ''} flex flex-col items-center justify-center gap-2">
                    <div class="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                        <span class="text-lg sm:text-xl md:text-2xl font-black px-3.5 py-1.5 rounded-2xl bg-white border-2 border-stone-900 text-stone-900 shadow-[3px_3px_0px_#1c1917] flex items-center gap-1 font-mono">${labelTag}</span>
                        <span class="text-lg sm:text-xl md:text-2xl font-black ${nameTextColor} tracking-tight text-center leading-tight">${move.name}</span>
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
            if (autoScroll && !this.activeMotd && window.innerWidth >= 768) activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        if (shouldRestart && !this.isPaused) this.startScheduler();
    }

    renderSidebar() {
        if (!this.els.landmarkList) return;
        this.els.landmarkList.innerHTML = '';

        const query = (this.searchQuery || '').trim().toLowerCase();
        const isFiltered = Boolean(query || (this.activeFilter && this.activeFilter !== 'all'));
        const visibleLandmarks = this.getVisibleLandmarkIndices();

        if (visibleLandmarks.length === 0) {
            const emptyMsg = query
                ? `No moves matching "${this.searchQuery}"`
                : (this.activeFilter && this.activeFilter !== 'all' ? `No ${this.activeFilter} moves found!` : 'No chunks found!');
            this.els.landmarkList.innerHTML = `
                <div class="p-6 bg-[#fdfbf7] rounded-2xl border-2 border-[#1c1917] text-stone-700 text-center flex flex-col items-center justify-center gap-2 shadow-[4px_4px_0px_#1c1917]">
                    <p class="font-black text-xs text-stone-900">${emptyMsg}</p>
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

            const matchingMovesCount = lm.moves.filter(m => this.doesMoveMatchSidebar(m)).length;
            const activeMatchingMoves = lm.moves.filter(m => this.isMoveActive(m) && this.doesMoveMatchSidebar(m));
            const selectedActiveCount = lm.moves.filter((m, mIdx) => this.isMoveActive(m) && this.doesMoveMatchSidebar(m) && this.selectedMoveKeys.has(`${lIdx}-${mIdx}`)).length;

            const isSelected = activeMatchingMoves.length > 0 && selectedActiveCount === activeMatchingMoves.length;
            const isSomeSelected = selectedActiveCount > 0 && selectedActiveCount < activeMatchingMoves.length;
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
            const movesCountLabel = isFiltered ? `${matchingMovesCount}/${lm.moves.length} moves` : `${lm.moves.length} moves`;
            
            // Move rendering (Bachata groups by 2)
            let movesHtml = '';
            if (this.danceType === 'bachata') {
                for (let mIdx = 0; mIdx < lm.moves.length; mIdx += 2) {
                    const m1 = lm.moves[mIdx];
                    const m2 = lm.moves[mIdx + 1];
                    const m1Matches = this.doesMoveMatchSidebar(m1);
                    const m2Matches = this.doesMoveMatchSidebar(m2);
                    if (!m1Matches && !m2Matches) continue;

                    movesHtml += `<div class="border-2 border-[#1c1917] rounded-2xl p-1.5 mb-2 bg-[#fdfbf7] space-y-1.5 shadow-[2px_2px_0px_#1c1917]">
                        ${m1Matches ? this.renderMoveItem(lIdx, mIdx) : ''}
                        ${m2Matches ? this.renderMoveItem(lIdx, mIdx + 1) : ''}
                    </div>`;
                }
            } else {
                let moveItemsHtml = '';
                lm.moves.forEach((m, mIdx) => {
                    if (this.doesMoveMatchSidebar(m)) {
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
                            <div class="w-4 h-4 rounded border-2 border-[#1c1917] flex items-center justify-center transition-all duration-200 group-hover/cb:scale-110 ${isSelected || isSomeSelected ? 'bg-[#1c1917] text-white shadow-sm' : 'bg-white text-transparent'}">
                                <svg class="w-3 h-3 stroke-[3.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    ${isSomeSelected ? '<path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />' : '<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />'}
                                </svg>
                            </div>
                        </div>
                        <!-- Chunk Title, Move Count & Mastery % -->
                        <div class="flex-1 min-w-0 flex items-center justify-between gap-1.5">
                            <span class="text-xs font-black text-[#1c1917] truncate group-hover/hdr:underline transition-colors">${lm.title}</span>
                            <div class="flex items-center gap-1.5 shrink-0">
                                <span class="text-[10px] font-black text-[#1c1917] bg-[#fdfbf7] px-1.5 py-0.5 rounded border-2 border-[#1c1917] uppercase tracking-wide shadow-[1px_1px_0px_#1c1917]">${movesCountLabel}</span>
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
        const isInactive = (m.status === 'inactive');
        const key = `${lIdx}-${mIdx}`;
        const isMoveSelected = this.selectedMoveKeys.has(key);
        
        const originalMastery = this.originalLandmarks[lIdx]?.moves?.[mIdx]?.mastery || 'learning';
        const isModified = mastery !== originalMastery;
        const modifiedBorderClass = isModified ? 'border-[2px] !border-white' : 'border';

        const tooltipHtml = m.hint ? `<div class="move-tooltip">${m.hint}</div>` : '';
        const tooltipClass = m.hint ? 'has-move-tooltip' : '';

        const moveLink = m.link ? (lm.links || []).find(l => l.id === m.link) : null;
        const movieLinkHtml = moveLink ? `<a href="${moveLink.url}" target="_blank" rel="noopener noreferrer" class="shrink-0 px-1.5 py-0.5 bg-white text-stone-900 border-2 border-[#1c1917] rounded-md shadow-[1.5px_1.5px_0px_#1c1917] hover:scale-110 hover:bg-stone-100 active:scale-95 transition-all inline-flex items-center leading-none text-[10px]" title="Watch video${moveLink.label ? ': ' + moveLink.label : ''}" onclick="event.stopPropagation()">🎬</a>` : '';

        const stepCountHtml = (this.danceType === 'wcs' && m.beats)
            ? `<span class="shrink-0 min-w-[20px] text-center ${isCurrent ? 'bg-slate-950 text-white' : 'bg-[#1c1917] text-white'} px-1.5 py-0.5 rounded text-[11px] font-mono font-black leading-none shadow-[1px_1px_0px_#1c1917]" title="${m.beats} counts">${m.beats}</span>`
            : '';

        const hintBadgeHtml = m.hint ? `<span class="shrink-0 bg-rose-500 border border-slate-900 px-1.5 py-0.5 rounded text-[9px] text-white font-black shadow-[1px_1px_0px_#1c1917]" title="Hint available">?</span>` : '';

        const nameColorClass = isInactive ? 'text-stone-400 font-medium' : (isCurrent ? 'text-slate-950 font-black' : 'text-stone-900 font-black');

        return `
            <div id="m-${lIdx}-${mIdx}" class="text-[11px] px-3 py-2 rounded-xl flex items-center justify-between gap-2.5 group cursor-pointer border-2 transition-all ${isCurrent ? 'move-active bg-[#fff1f2] text-slate-950 border-[#1c1917] shadow-[3px_3px_0px_#1c1917]' : 'bg-[#ffde59] text-stone-900 border-[#1c1917] hover:bg-[#ffc312] shadow-[2px_2px_0px_#1c1917]'} ${tooltipClass}" data-action="select" data-lidx="${lIdx}" data-midx="${mIdx}">
                <div class="p-1 -m-1 flex items-center justify-center cursor-pointer select-none group/mcb relative shrink-0" data-action="toggle-move-check" data-lidx="${lIdx}" data-midx="${mIdx}" title="Select for practice">
                    <input type="checkbox" 
                           class="move-checkbox absolute opacity-0 cursor-pointer w-6 h-6 z-10" 
                           data-lidx="${lIdx}" 
                           data-midx="${mIdx}"
                           ${isMoveSelected ? 'checked' : ''}>
                    <div class="w-3.5 h-3.5 rounded border-2 border-[#1c1917] flex items-center justify-center transition-all duration-200 group-hover/mcb:scale-110 ${isMoveSelected ? 'bg-[#1c1917] text-white shadow-sm' : 'bg-white text-transparent'}">
                        <svg class="w-2.5 h-2.5 stroke-[3.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>
                <div class="flex items-center gap-1.5 flex-1 min-w-0" data-lidx="${lIdx}" data-midx="${mIdx}">
                    ${stepCountHtml}
                    ${movieLinkHtml}
                    ${hintBadgeHtml}
                    <span class="truncate flex-1 py-0.5 ${nameColorClass}" data-lidx="${lIdx}" data-midx="${mIdx}">${m.name}</span>
                </div>
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
                const firstMatchIdx = this.findNextPracticeMoveIdx(lIdx, 0);
                this.selectMove(lIdx, firstMatchIdx !== -1 ? firstMatchIdx : 0);
                return;
            }
        }
        this.renderSidebar();
    }

    toggleExpandCollapseAll() {
        const visibleLandmarks = this.getVisibleLandmarkIndices();
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
        const visibleLandmarks = this.getVisibleLandmarkIndices();
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

    selectMove(lIdx, mIdx, expand = true, autoScroll = true) {
        if (this.activeMotd) {
            this.exitMotd(false);
        }
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
        const activeSchedMIdx = this.findNextPracticeMoveIdx(lIdx, mIdx);
        this.schedMoveIdx = activeSchedMIdx !== -1 ? activeSchedMIdx : mIdx;
        this.schedBeatIdx = 0;
        this.schedPhraseBeatIdx = (this.schedMoveIdx % 2 !== 0) ? 4 : 0;
        this.beatsQueue = [];
        if (DanceAudio.isReady()) this.nextBeatTime = DanceAudio.getCurrentTime();

        this.updateHUD();
        this.renderSidebar();
        this.updateMoveDisplay(true, autoScroll);

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

        if (!this.doesMoveMatchFilter(move)) {
            this.selectedMoveKeys.delete(`${lIdx}-${mIdx}`);
        }
        
        this.saveMasteryState();
        const visible = window.getFilteredLandmarkIndices(this.landmarks, this.activeFilter);
        if (visible.length === 0) {
            this.applyFilter('all');
        } else {
            const seq = this.getPracticeSequence();
            const isCurrentInSeq = seq.some(item => item.lIdx === this.currentLandmarkIdx && item.mIdx === this.currentMoveIdx);
            if (seq.length > 0 && !isCurrentInSeq) {
                this.selectMove(seq[0].lIdx, seq[0].mIdx, false, false);
            } else {
                this.renderSidebar();
                this.updateMasteryStats();
                this.updateMoveDisplay(false, false);
            }
        }
    }

    toggleLandmarkSelection(lIdx) {
        const lm = this.landmarks[lIdx];
        if (!lm || !lm.moves) return;

        const activeMoves = lm.moves.filter(m => this.isMoveActive(m) && this.doesMoveMatchSidebar(m));
        const selectedActiveCount = lm.moves.filter((m, mIdx) => this.isMoveActive(m) && this.doesMoveMatchSidebar(m) && this.selectedMoveKeys.has(`${lIdx}-${mIdx}`)).length;

        const shouldCheckAll = selectedActiveCount < activeMoves.length;

        lm.moves.forEach((m, mIdx) => {
            if (this.isMoveActive(m) && this.doesMoveMatchSidebar(m)) {
                if (shouldCheckAll) {
                    this.selectedMoveKeys.add(`${lIdx}-${mIdx}`);
                } else {
                    this.selectedMoveKeys.delete(`${lIdx}-${mIdx}`);
                }
            }
        });

        this.onSelectionChanged();
    }

    toggleMoveSelection(lIdx, mIdx) {
        const key = `${lIdx}-${mIdx}`;
        if (this.selectedMoveKeys.has(key)) {
            this.selectedMoveKeys.delete(key);
        } else {
            this.selectedMoveKeys.add(key);
        }

        this.onSelectionChanged();
    }

    onSelectionChanged() {
        if (this.activeMotd) {
            this.exitMotd(false);
        }
        this.renderSidebar();

        const seq = this.getPracticeSequence();
        if (seq.length > 0) {
            const isCurrentInSeq = seq.some(item => item.lIdx === this.currentLandmarkIdx && item.mIdx === this.currentMoveIdx);
            if (!isCurrentInSeq) {
                this.selectMove(seq[0].lIdx, seq[0].mIdx, false);
            } else {
                this.updateMoveDisplay(false);
            }
        } else {
            this.updateMoveDisplay(false);
        }
    }

    updateMasteryStats() {
        const stats = window.getMasteryStats(this.landmarks);
        const percent = stats.total > 0 ? Math.round((stats.mastered / stats.total) * 100) : 0;
        if (this.els.masteryStatsCount) this.els.masteryStatsCount.textContent = `Mastered: ${stats.mastered}/${stats.total} (${percent}%)`;
    }

    // --- Event Listeners ---
    setupEventListeners() {
        if (this.els.learningMotdBtn) {
            this.els.learningMotdBtn.onclick = () => this.activateMotd('learning', false);
        }
        if (this.els.familiarMotdBtn) {
            this.els.familiarMotdBtn.onclick = () => this.activateMotd('familiar', false);
        }
        if (this.els.motdRerollBtn) {
            this.els.motdRerollBtn.onclick = () => {
                if (this.activeMotd) {
                    this.activateMotd(this.activeMotd.category, true);
                }
            };
        }
        if (this.els.motdExitBtn) {
            this.els.motdExitBtn.onclick = () => this.exitMotd(true);
        }

        this.els.playPauseBtn.onclick = (e) => {
            DanceAudio.init();
            this.isPaused = !this.isPaused;
            if (this.isPaused) {
                if (this.schedulerIntervalId) clearInterval(this.schedulerIntervalId);
                this.beatsQueue = [];
                if (window.ChunkSpeech) window.ChunkSpeech.cancel();
            } else {
                if (this.activeMotd && Array.isArray(this.activeMotd.sequence) && this.activeMotd.sequence.length > 0) {
                    this.activeMotd.schedSlotIdx = this.activeMotd.currentSlotIdx;
                    const slotItem = this.activeMotd.sequence[this.activeMotd.schedSlotIdx];
                    this.schedLandmarkIdx = slotItem.lIdx;
                    this.schedMoveIdx = slotItem.mIdx;
                    this.schedBeatIdx = this.beatIdx;
                    if (this.danceType === 'salsa' || this.danceType === 'bachata') {
                        const isOddSlot = (this.activeMotd.schedSlotIdx % 2 !== 0);
                        this.schedPhraseBeatIdx = isOddSlot ? (this.schedBeatIdx + 4) % 8 : this.schedBeatIdx % 8;
                    }
                } else {
                    this.schedLandmarkIdx = this.currentLandmarkIdx;
                    this.schedMoveIdx = this.currentMoveIdx;
                    this.schedBeatIdx = this.beatIdx;
                    this.schedPhraseBeatIdx = this.phraseBeatIdx;
                }
                this.startScheduler();

                if (window.ChunkSpeech) {
                    const lm = this.landmarks[this.activeMotd ? this.activeMotd.lIdx : this.currentLandmarkIdx];
                    if (lm) window.ChunkSpeech.announceChunk(lm.title);
                }
            }
            e.currentTarget.innerHTML = this.getPlayPauseBtnHtml(this.isPaused);
        };

        this.els.panicBtn.onclick = () => {
            if (this.activeMotd && Array.isArray(this.activeMotd.sequence) && this.activeMotd.sequence.length > 0) {
                this.activeMotd.currentSlotIdx = 0;
                this.activeMotd.schedSlotIdx = 0;
                this.activeMotd.lastRenderedSlotIdx = 0;
                const firstSlot = this.activeMotd.sequence[0];
                this.currentLandmarkIdx = firstSlot.lIdx;
                this.currentMoveIdx = firstSlot.mIdx;
                this.beatIdx = 0;
                this.phraseBeatIdx = 0;
                this.schedLandmarkIdx = firstSlot.lIdx;
                this.schedMoveIdx = firstSlot.mIdx;
                this.schedBeatIdx = 0;
                this.schedPhraseBeatIdx = 0;
                this.beatsQueue = [];
                if (DanceAudio.isReady()) this.nextBeatTime = DanceAudio.getCurrentTime();
                this.updateHUD();
                this.renderSidebar();
                this.updateMoveDisplay(true, false);
                return;
            }
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
        [
            { id: 'filterAllBtn', val: 'all' },
            { id: 'filterLearningBtn', val: 'learning' },
            { id: 'filterFamiliarBtn', val: 'familiar' },
            { id: 'filterMasteredBtn', val: 'mastered' }
        ].forEach(({ id, val }) => {
            const btn = document.getElementById(id);
            if (btn) btn.onclick = () => this.applyFilter(val);
        });

        // Sidebar clicks
        this.els.landmarkList.onclick = (e) => {
            const moveCheckbox = e.target.closest('.move-checkbox') || e.target.closest('[data-action="toggle-move-check"]');
            const checkbox = e.target.closest('.chunk-checkbox') || e.target.closest('[data-action="toggle-check"]');
            const cycle = e.target.closest('[data-action="cycle"]');
            const sPrev = e.target.closest('[data-action="scroll-prev"]');
            const sNext = e.target.closest('[data-action="scroll-next"]');
            const select = e.target.closest('[data-action="select"]');
            const toggleAcc = e.target.closest('[data-action="toggle-accordion"]');
            
            if (moveCheckbox) {
                e.stopPropagation();
                const lIdx = parseInt(moveCheckbox.dataset.lidx);
                const mIdx = parseInt(moveCheckbox.dataset.midx);
                this.toggleMoveSelection(lIdx, mIdx);
                return;
            }
            if (checkbox) {
                e.stopPropagation();
                const lIdx = parseInt(checkbox.dataset.lidx);
                this.toggleLandmarkSelection(lIdx);
                return;
            }
            if (cycle) { e.stopPropagation(); this.cycleMastery(parseInt(cycle.dataset.lidx), parseInt(cycle.dataset.midx)); return; }
            if (sPrev || sNext) {
                e.stopPropagation();
                const lIdx = parseInt((sPrev || sNext).dataset.lidx);
                const filtered = this.getVisibleLandmarkIndices();
                const pos = filtered.indexOf(lIdx);
                let targetIdx = -1;
                if (sPrev && pos > 0) targetIdx = filtered[pos - 1];
                if (sNext && pos < filtered.length - 1) targetIdx = filtered[pos + 1];
                if (targetIdx !== -1) {
                    const firstMatchIdx = this.findNextPracticeMoveIdx(targetIdx, 0);
                    this.selectMove(targetIdx, firstMatchIdx !== -1 ? firstMatchIdx : 0);
                    document.getElementById(`lm-section-${targetIdx}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                return;
            }
            if (select) {
                e.stopPropagation();
                this.selectMove(parseInt(select.dataset.lidx), parseInt(select.dataset.midx), true, false);
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
