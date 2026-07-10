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
