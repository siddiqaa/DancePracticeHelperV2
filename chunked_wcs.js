const LANDMARKS = [
    {
        title: "Basic + Variations",
        anchor: "Push → Passes x2 -> Whip",
        color: "#ef4444",
        moves: [
            { name: "Sugar Push", beats: 6, mastery: "mastered" },
            { name: "Left Side Pass", beats: 6, mastery: "mastered" },
            { name: "Right Side Pass with Turn", beats: 6, mastery: "familiar" },
            { name: "Sugar Tuck", beats: 6, mastery: "familiar" },
            { name: "Left Side Pass with Free Spin", beats: 6, mastery: "learning" },
            { name: "Right Side Pass with Outside Turn", beats: 6, mastery: "learning" },
            { name: "Sugar Tuck Elbow Catch", beats: 6, mastery: "learning" },
            { name: "Right Side Pass with Follow Hand on Leader Left Shoulder Turn 5&6", beats: 6, mastery: "learning" },
            { name: "Sugar Tuck with Both Hands", beats: 6, mastery: "learning" },
            { name: "Left Side Turning Pass Both Hands Led by Leader Left Hand", beats: 6, mastery: "learning" },
            { name: "Right side pass popout", beats: 6, mastery: "familiar" },
            { name: "Right turn catch and spin follow left arm", beats: 6, mastery: "learning" }
        ],
        links: ["https://youtu.be/vx1wmjgR124", "https://youtu.be/EvvVBMtRnLY", "https://youtu.be/YuIWjdriiq4", "https://www.youtube.com/watch?v=8b-S82Eio-4"]
    },
    {
        title: "Whips",
        anchor: "Reverse double whip - Basket whip",
        color: "#8b5cf6",
        moves: [
            { name: "Sugar Push", beats: 6, mastery: "mastered" },
            { name: "Basic Whip", beats: 8, mastery: "mastered" },
            { name: "Right Side Pass into Closed", beats: 6, mastery: "mastered" },
            { name: "Reverse Whip / Double Spin", beats: 8, mastery: "familiar" },
            { name: "Sugar Push", beats: 6, mastery: "mastered" },
            { name: "Basket Whip", beats: 8, mastery: "familiar" },
            { name: "Sugar Push", beats: 6, mastery: "mastered" },
            { name: "Whip With Lead Turn", beats: 8, mastery: "learning" },
            { name: "Roll into Sweetheart With Reverse Whip Exit", beats: 8, mastery: "learning" },
            { name: "Open Whip", beats: 8, mastery: "familiar" },
            { name: "Open Whip with Back to Back Turn", beats: 8, mastery: "learning" },
            { name: "Fakeout Whip into Sling Shot", beats: 6, mastery: "learning" },
            { name: "Sling Shot x 2 with Sugar Tuck Exit", beats: 10, mastery: "learning" },
            { name: "Side by side reverse whip", beats: 8, mastery: "learning" }
        ],
        links: ["https://youtube.com/shorts/4QJ0rxolzjA", "https://youtu.be/xnN3mVDTE90", "https://youtu.be/I8sCZE2OTJY", "https://youtu.be/wuyuGL2iE4U", "https://youtu.be/4sNSm3r2zAc"]
    },
    {
        title: "Roll-in and Outs",
        anchor: "Roll in and out -> Sway catch",
        color: "#10b981",
        moves: [
            { name: "Sugar Push", beats: 6, mastery: "mastered" },
            { name: "Left Side Roll-in / Out", beats: 6, mastery: "familiar" },
            { name: "Sway (Hand on Hip)", beats: 6, mastery: "familiar" },
            { name: "Inside Turn Exit", beats: 6, mastery: "familiar" },
            { name: "Sugar Push", beats: 6, mastery: "mastered" },
            { name: "Roll-in and Out into Hammerlock (Both Hands)", beats: 6, mastery: "learning" },
            { name: "Windmill into Side-to-Side Ring around Center", beats: 6, mastery: "learning" },
            { name: "Left Side Roll-in / Out", beats: 6, mastery: "familiar" },
            { name: "Hand over my head sugar push", beats: 6, mastery: "learning" },
            { name: "Roll in/out", beats: 6, mastery: "familiar" },
            { name: "Left side pass free-spin", beats: 6, mastery: "familiar" },
            { name: "Roll in/out by lowering right hand", beats: 6, mastery: "learning" }
        ],
        links: ["https://youtu.be/0RpK_Cm1sNk", "https://youtu.be/8A1IRTHhADo", "https://youtu.be/hFcQmH6ixEE"]
    },
    {
        title: "Slow Moves",
        anchor: "Slow Tuck Side Step",
        color: "#eab308",
        moves: [
            { name: "Sugar Push", beats: 6, mastery: "mastered" },
            { name: "Sugar Tuck Slow Step Side", beats: 8, mastery: "learning" }
        ],
        links: ["https://youtu.be/FdUcgrjn6Rs"]
    }
];

const ORIGINAL_LANDMARKS = JSON.parse(JSON.stringify(LANDMARKS));

// Centralized configuration for mastery states
const MASTERY_CONFIG = {
    learning: {
        text: 'Learning',
        textColor: 'text-red-400',
        badgeColor: 'bg-red-500/10 border-red-500/30 text-red-400',
        diffColor: 'text-red-400 bg-red-400/10 border-red-400/20'
    },
    familiar: {
        text: 'Familiar',
        textColor: 'text-amber-400',
        badgeColor: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
        diffColor: 'text-amber-400 bg-amber-400/10 border-amber-400/20'
    },
    mastered: {
        text: 'Mastered',
        textColor: 'text-emerald-400',
        badgeColor: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
        diffColor: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
    }
};

let currentLandmarkIdx = 0;
let lastLandmarkIdx = -1;
let currentMoveIdx = 0;
let beatIdx = 0;
let isPaused = true;
let isRandomMode = false;
let isShuffleMoves = false;
let isSpiralMode = false;
let spiralPhase = 'idle';
let spiralQueue = [];
let movePermutation = [];

// Scheduler state
let schedulerIntervalId = null;
let schedLandmarkIdx = 0;
let schedMoveIdx = 0;
let schedBeatIdx = 0;
let nextBeatTime = 0.0;
const lookahead = 25.0; // How frequently to call scheduler (ms)
const scheduleAheadTime = 0.1; // How far ahead to schedule audio (sec)
let schedHoldingForRandom = false;

// Queue of scheduled beats
let beatsQueue = [];

// Visual state
let currentVisualLandmarkIdx = 0;
let currentVisualMoveIdx = 0;
let currentVisualBeatIdx = 0;
let lastRenderedLandmarkIdx = -1;
let lastRenderedMoveIdx = -1;

const landmarkList = document.getElementById('landmarkList');
const startOverlay = document.getElementById('startOverlay');
const overlayContent = document.getElementById('overlayContent');
const countdownDisplay = document.getElementById('countdownDisplay');

function playScheduledBeat(num, time, landmarkIdx, moveIdx) {
    const currentMove = LANDMARKS[landmarkIdx].moves[moveIdx];
    DanceAudio.playWCSBeat(time, num, currentMove.beats, true);
}

function scheduler() {
    if (isPaused || schedHoldingForRandom) return;

    const bpm = parseInt(document.getElementById('speedSlider').value);
    const secondsPerBeat = 60.0 / bpm;

    while (nextBeatTime < DanceAudio.getCurrentTime() + scheduleAheadTime) {
        const actualMoveIdx = getActualMoveIdx(schedMoveIdx);
        const landmark = LANDMARKS[schedLandmarkIdx];
        const currentMove = landmark.moves[actualMoveIdx];

        scheduleBeat(schedBeatIdx, nextBeatTime, schedLandmarkIdx, actualMoveIdx);
        
        // Push the beat to visual queue
        beatsQueue.push({
            beat: schedBeatIdx,
            time: nextBeatTime,
            moveIdx: actualMoveIdx,
            logicalMoveIdx: schedMoveIdx,
            landmarkIdx: schedLandmarkIdx,
            landmarkColor: landmark.color,
            moveName: currentMove.name,
            beatsTotal: currentMove.beats
        });
        
        advanceBeat(secondsPerBeat);
    }
}

function scheduleBeat(beatNumber, time, landmarkIdx, moveIdx) {
    playScheduledBeat(beatNumber, time, landmarkIdx, moveIdx);
}

function advanceBeat(secondsPerBeat) {
    nextBeatTime += secondsPerBeat;
    
    schedBeatIdx++;
    const currentMove = LANDMARKS[schedLandmarkIdx].moves[getActualMoveIdx(schedMoveIdx)];
    if (schedBeatIdx >= currentMove.beats) {
        schedBeatIdx = 0;
        
        const landmark = LANDMARKS[schedLandmarkIdx];
        const movesCount = landmark.moves.length;

        if (schedMoveIdx >= movesCount - 1) {
            if (isSpiralMode) {
                advanceSpiral();
            } else if (isRandomMode) {
                schedHoldingForRandom = true;
            } else {
                schedLandmarkIdx = (schedLandmarkIdx + 1) % LANDMARKS.length;
                schedMoveIdx = 0;
                if (isShuffleMoves) generateMovePermutation(schedLandmarkIdx);
            }
        } else {
            schedMoveIdx++;
        }
    }
}

function generateMovePermutation(lIdx) {
    const count = LANDMARKS[lIdx].moves.length;
    movePermutation = Array.from({length: count}, (_, i) => i);
    for (let i = count - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [movePermutation[i], movePermutation[j]] = [movePermutation[j], movePermutation[i]];
    }
}

function getActualMoveIdx(mIdx) {
    if (isShuffleMoves && movePermutation.length > 0) {
        return movePermutation[mIdx] ?? mIdx;
    }
    return mIdx;
}

function triggerVisualBeatFeedback(playedBeat) {
    currentVisualLandmarkIdx = playedBeat.landmarkIdx;
    currentVisualMoveIdx = playedBeat.moveIdx;
    currentVisualBeatIdx = playedBeat.beat;
    beatIdx = playedBeat.beat;

    let displayLandmarkIdx = playedBeat.landmarkIdx;
    let displayMoveIdx = playedBeat.moveIdx;
    let logicalMoveIdx = playedBeat.logicalMoveIdx;

    // Show next move early during the anchor (last 2 beats)
    if (playedBeat.beat >= playedBeat.beatsTotal - 2) {
        const lm = LANDMARKS[displayLandmarkIdx];
        if (logicalMoveIdx < lm.moves.length - 1) {
            displayMoveIdx = getActualMoveIdx(logicalMoveIdx + 1);
        } else if (!isRandomMode && !isSpiralMode) {
            displayLandmarkIdx = (displayLandmarkIdx + 1) % LANDMARKS.length;
            displayMoveIdx = 0;
        }
    }

    currentLandmarkIdx = displayLandmarkIdx;
    currentMoveIdx = displayMoveIdx;

    if (displayMoveIdx !== lastRenderedMoveIdx || displayLandmarkIdx !== lastRenderedLandmarkIdx) {
        lastRenderedMoveIdx = displayMoveIdx;
        lastRenderedLandmarkIdx = displayLandmarkIdx;
        
        updateHUD();
        renderSidebar();
        updateMoveDisplay(false);
    }

    // Check if we just completed the landmark
    const isLastMove = playedBeat.logicalMoveIdx === LANDMARKS[playedBeat.landmarkIdx].moves.length - 1;
    const isLastBeatOfMove = playedBeat.beat === playedBeat.beatsTotal - 1;

    if (isLastMove && isLastBeatOfMove) {
        if (isSpiralMode) {
            // Handled by advanceSpiral
        } else if (isRandomMode) {
            triggerRandomCountdown();
        }
    }
}

function draw() {
    if (DanceAudio.isReady()) {
        const currentTime = DanceAudio.getCurrentTime();
        while (beatsQueue.length && beatsQueue[0].time <= currentTime) {
            const playedBeat = beatsQueue.shift();
            triggerVisualBeatFeedback(playedBeat);
        }
    }
    requestAnimationFrame(draw);
}

function startSpiralRoutine() {
    isSpiralMode = true;
    isRandomMode = false;
    spiralPhase = 'retrieval';
    
    const mastered = [];
    const familiar = [];
    const learning = [];
    
    LANDMARKS.forEach((lm, idx) => {
        let score = 0;
        lm.moves.forEach(m => {
            if (m.mastery === 'mastered') score += 1;
            else if (m.mastery === 'familiar') score += 0.5;
        });
        const ratio = score / lm.moves.length;
        if (ratio > 0.8) mastered.push(idx);
        else if (ratio > 0.3) familiar.push(idx);
        else learning.push(idx);
    });

    spiralQueue = [];
    const shuffMastered = mastered.sort(() => Math.random() - 0.5).slice(0, 3);
    shuffMastered.forEach(idx => spiralQueue.push({lIdx: idx, phase: 'retrieval'}));
    
    const shuffFamiliar = familiar.sort(() => Math.random() - 0.5).slice(0, 2);
    shuffFamiliar.forEach(idx => spiralQueue.push({lIdx: idx, phase: 'consolidation'}));
    
    const shuffLearning = learning.sort(() => Math.random() - 0.5).slice(0, 1);
    shuffLearning.forEach(idx => spiralQueue.push({lIdx: idx, phase: 'encoding'}));

    if (spiralQueue.length === 0) {
        alert("Not enough mastery data to start spiral. Practice some moves first!");
        isSpiralMode = false;
        return;
    }

    document.getElementById('spiralBtn').classList.add('bg-indigo-600', 'text-white');
    document.getElementById('spiralBtn').classList.remove('bg-indigo-900/40', 'text-indigo-300');
    
    const first = spiralQueue.shift();
    spiralPhase = first.phase;
    selectMove(first.lIdx, 0);
    if (isShuffleMoves) generateMovePermutation(first.lIdx);
    
    isPaused = false;
    startScheduler();
}

function advanceSpiral() {
    if (spiralQueue.length > 0) {
        schedHoldingForRandom = true;
        const next = spiralQueue.shift();
        spiralPhase = next.phase;
        triggerSpiralTransition(next.lIdx, next.phase);
    } else {
        isSpiralMode = false;
        isPaused = true;
        document.getElementById('spiralBtn').classList.remove('bg-indigo-600', 'text-white');
        document.getElementById('spiralBtn').classList.add('bg-indigo-900/40', 'text-indigo-300');
        alert("Retrieval Spiral Routine Completed!");
    }
}

function triggerSpiralTransition(lIdx, phase) {
    startOverlay.classList.remove('hidden');
    overlayContent.classList.add('hidden');
    countdownDisplay.classList.remove('hidden');

    const phaseNames = {
        retrieval: "Phase 1: Retrieval (Review)",
        consolidation: "Phase 2: Consolidation (Expansion)",
        encoding: "Phase 3: Encoding (New Chunks)"
    };

    const lm = LANDMARKS[lIdx];
    const nameEl = document.getElementById('nextChunkName');
    nameEl.textContent = lm.title;
    nameEl.style.color = lm.color;
    document.getElementById('nextChunkAnchor').textContent = `${phaseNames[phase]} | ${lm.anchor}`;

    let count = 5;
    const timerEl = document.getElementById('timerCircle');
    timerEl.textContent = count;

    const countInterval = setInterval(() => {
        count--;
        timerEl.textContent = count;
        if (count <= 0) {
            clearInterval(countInterval);
            startOverlay.classList.add('hidden');
            selectMove(lIdx, 0);
            if (isShuffleMoves) generateMovePermutation(lIdx);
            isPaused = false;
            startScheduler();
        }
    }, 1000);
}
function triggerRandomCountdown() {
    isPaused = true;
    if (schedulerIntervalId) clearInterval(schedulerIntervalId);
    beatsQueue = [];
    schedHoldingForRandom = false;

    // Defensive safeguard to prevent infinite loop if LANDMARKS length is 1
    if (LANDMARKS.length > 1) {
        lastLandmarkIdx = currentVisualLandmarkIdx;
        let nextIdx;
        do {
            nextIdx = Math.floor(Math.random() * LANDMARKS.length);
        } while (nextIdx === lastLandmarkIdx);
        currentVisualLandmarkIdx = nextIdx;
    } else {
        currentVisualLandmarkIdx = 0;
    }

    currentVisualMoveIdx = 0;
    currentVisualBeatIdx = 0;

    // Reset visual legacy globals immediately
    currentLandmarkIdx = currentVisualLandmarkIdx;
    currentMoveIdx = currentVisualMoveIdx;
    beatIdx = currentVisualBeatIdx;

    // Reset scheduler state to match
    schedLandmarkIdx = currentVisualLandmarkIdx;
    schedMoveIdx = currentVisualMoveIdx;
    schedBeatIdx = currentVisualBeatIdx;

    updateHUD();
    renderSidebar();
    updateMoveDisplay(false);

    startOverlay.classList.remove('hidden');
    overlayContent.classList.add('hidden');
    countdownDisplay.classList.remove('hidden');

    const lm = LANDMARKS[currentVisualLandmarkIdx];
    const nameEl = document.getElementById('nextChunkName');
    nameEl.textContent = lm.title;
    nameEl.style.color = lm.color;
    document.getElementById('nextChunkAnchor').textContent = lm.anchor;

    let count = 5;
    const timerEl = document.getElementById('timerCircle');
    timerEl.textContent = count;

    const countInterval = setInterval(() => {
        count--;
        timerEl.textContent = count;
        if (count <= 0) {
            clearInterval(countInterval);
            startOverlay.classList.add('hidden');
            isPaused = false;
            startScheduler();
        }
    }, 1000);
}

function renderSidebar() {
    landmarkList.innerHTML = '';
    LANDMARKS.forEach((lm, lIdx) => {
        const section = document.createElement('div');
        section.id = `lm-section-${lIdx}`;
        section.className = `p-3 rounded-xl transition-all duration-300 ${lIdx === currentLandmarkIdx ? 'landmark-active' : 'opacity-30 hover:opacity-75'}`;
        section.style.color = lm.color;
        
        const movesHtml = lm.moves.map((m, mIdx) => {
            const mastery = m.mastery || 'learning';
            const config = MASTERY_CONFIG[mastery] || MASTERY_CONFIG.learning;
            
            const isCurrent = (lIdx === currentLandmarkIdx && mIdx === currentMoveIdx);
            const hintTooltip = m.hint ? `title="${m.hint}"` : '';
            
            return `
                <div id="m-${lIdx}-${mIdx}" class="text-[11px] px-2 py-1.5 rounded transition-all flex items-center justify-between gap-2 group ${isCurrent ? 'move-active' : 'hover:bg-slate-900/30'}">
                    <span class="truncate flex-1 py-0.5 font-bold ${config.textColor}" data-lidx="${lIdx}" data-midx="${mIdx}" ${hintTooltip}>
                        ${m.name} <span class="opacity-60 text-[9px] font-mono">(${m.beats}🥁)</span>
                    </span>
                    <button class="shrink-0 text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border ${config.badgeColor} hover:brightness-125 active:scale-95 transition-all" data-action="cycle" data-lidx="${lIdx}" data-midx="${mIdx}">
                        ${config.text}
                    </button>
                </div>
            `;
        }).join('');

        section.innerHTML = `
            <div class="flex items-start justify-between mb-2">
                <div class="cursor-pointer group-hover/lm:brightness-125 flex-1" data-action="select" data-lidx="${lIdx}" data-midx="0">
                    <div class="text-[9px] font-black uppercase tracking-wider mb-1">${lIdx === currentLandmarkIdx ? '👉 Current ' : ''}Landmark ${lIdx + 1}</div>
                    <div class="text-xs font-bold text-slate-200 pr-2">${lm.title}</div>
                </div>
                <div class="flex flex-col gap-1 shrink-0">
                    <button class="text-slate-500 hover:text-white bg-slate-950/50 hover:bg-slate-800 border border-slate-800 rounded px-2 py-1 transition-colors" data-action="scroll-prev" data-lidx="${lIdx}" title="Scroll to previous landmark">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 15l7-7 7 7"></path></svg>
                    </button>
                    <button class="text-slate-500 hover:text-white bg-slate-950/50 hover:bg-slate-800 border border-slate-800 rounded px-2 py-1 transition-colors" data-action="scroll-next" data-lidx="${lIdx}" title="Scroll to next landmark">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                </div>
            </div>
            <div class="space-y-0.5">
                ${movesHtml}
            </div>
        `;
        landmarkList.appendChild(section);
    });
}

function selectMove(lIdx, mIdx) {
    currentLandmarkIdx = lIdx;
    currentMoveIdx = mIdx;
    beatIdx = 0;

    schedLandmarkIdx = lIdx;
    schedMoveIdx = mIdx;
    schedBeatIdx = 0;
    beatsQueue = [];
    if (DanceAudio.isReady()) nextBeatTime = DanceAudio.getCurrentTime();

    updateHUD();
    renderSidebar();
    updateMoveDisplay(true);
}

function cycleMastery(lIdx, mIdx, event) {
    if (event) event.stopPropagation();
    const move = LANDMARKS[lIdx].moves[mIdx];
    if (move.mastery === 'mastered') {
        move.mastery = 'learning';
    } else if (move.mastery === 'familiar') {
        move.mastery = 'mastered';
    } else {
        move.mastery = 'familiar';
    }
    saveMasteryState();
    renderSidebar();
    updateMasteryStats();
    updateMasteryProgress();
}

function saveMasteryState() {
    const state = {};
    LANDMARKS.forEach((lm) => {
        state[lm.title] = lm.moves.map(m => m.mastery);
    });
    localStorage.setItem('wcs_mastery_state', JSON.stringify(state));
}

function loadMasteryState() {
    const saved = localStorage.getItem('wcs_mastery_state');
    if (saved) {
        try {
            const state = JSON.parse(saved);
            LANDMARKS.forEach((lm) => {
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

function updateMasteryStats() {
    let total = 0;
    let mastered = 0;
    LANDMARKS.forEach(lm => {
        lm.moves.forEach(m => {
            total++;
            if (m.mastery === 'mastered') {
                mastered++;
            }
        });
    });
    const statsEl = document.getElementById('masteryStatsCount');
    if (statsEl) {
        statsEl.textContent = `Mastered: ${mastered}/${total}`;
    }
}

window.selectMove = selectMove;
window.cycleMastery = cycleMastery;

function updateHUD() {
    const lm = LANDMARKS[currentLandmarkIdx];
    const hud = document.getElementById('landmarkHUD');
    hud.style.borderColor = lm.color;

    const tag = document.getElementById('landmarkTag');
    tag.style.backgroundColor = lm.color;
    tag.textContent = `L-${currentLandmarkIdx + 1}`;

    document.getElementById('landmarkTitle').textContent = lm.title;

    const anchor = document.getElementById('landmarkAnchor');
    anchor.textContent = lm.anchor;
    anchor.style.color = lm.color;

    const linkContainer = document.getElementById('tutorialLinks');
    linkContainer.innerHTML = '';
    if (lm.links && lm.links.length > 0) {
        lm.links.forEach((url, i) => {
            const a = document.createElement('a');
            a.href = url;
            a.target = "_blank";
            a.className = "flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 hover:bg-slate-900 text-slate-300 hover:text-white text-[10px] font-bold rounded-lg transition-colors border border-slate-850/80 uppercase shadow-sm";
            a.innerHTML = `
                <svg class="w-3 h-3 text-purple-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"></path></svg>
                Tutorial ${i + 1}
            `;
            linkContainer.appendChild(a);
        });
    }

    updateMasteryProgress();
}

function updateMasteryProgress() {
    const lm = LANDMARKS[currentLandmarkIdx];
    if (!lm) return;
    let totalScore = 0;
    lm.moves.forEach(m => {
        const mastery = m.mastery || 'learning';
        if (mastery === 'mastered') totalScore += 100;
        else if (mastery === 'familiar') totalScore += 50;
    });
    const maxScore = lm.moves.length * 100;
    const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
    
    const progressPct = document.getElementById('sessionProgressPct');
    const progressBar = document.getElementById('sessionProgressBar');
    if (progressPct && progressBar) {
        progressPct.textContent = `${percentage}%`;
        progressBar.style.width = `${percentage}%`;
        progressBar.style.backgroundImage = `linear-gradient(to right, ${lm.color}, #a78bfa)`;
    }
}

function updateMoveDisplay(shouldRestartInterval = true) {
    const landmark = LANDMARKS[currentLandmarkIdx];
    const move = landmark.moves[currentMoveIdx];

    const mastery = move.mastery || 'learning';
    const config = MASTERY_CONFIG[mastery] || MASTERY_CONFIG.learning;

    let hintHtml = move.hint ? `<div class="text-xl mt-2 text-center font-bold tracking-widest text-amber-300 bg-amber-950/60 border border-amber-500/30 px-4 py-1.5 rounded-xl shadow-lg shadow-amber-900/20" style="font-variant: small-caps;">${move.hint}</div>` : '';

    let nextMoveNameHtml = "End of landmark list";

    if (currentMoveIdx < landmark.moves.length - 1) {
        const nextMove = landmark.moves[currentMoveIdx + 1];
        const nextMastery = nextMove.mastery || 'learning';
        const nextConfig = MASTERY_CONFIG[nextMastery] || MASTERY_CONFIG.learning;
        nextMoveNameHtml = `<span class="${nextConfig.textColor} font-bold">${nextMove.name}</span>`;
    }

    

    // Update Text Displays
    const currentLabelEl = document.getElementById('currentMoveLabel');
    const nextLabelEl = document.getElementById('nextMoveLabel');

    if (currentLabelEl && nextLabelEl) {
        currentLabelEl.innerHTML = `<div class="animate-label ${isPaused ? 'paused-anim' : ''} flex flex-col items-center justify-center gap-1">
            <div class="flex items-center gap-4">
                <span class="text-purple-400 font-black text-2xl md:text-3xl px-3 py-1 rounded bg-purple-950/40 border border-purple-900/30 flex items-center gap-1">${move.beats}🥁</span>
                <span class="text-3xl md:text-5xl font-black ${config.textColor} tracking-tight text-center">${move.name}</span>
            </div>
            ${hintHtml}
        </div>`;

        nextLabelEl.className = "text-xs md:text-sm font-bold text-slate-400 mt-4 uppercase tracking-wider px-4 py-2 rounded-xl bg-slate-950/60 border border-slate-850/80 shadow-sm flex items-center gap-2";
        nextLabelEl.innerHTML = `<span class="text-slate-500 font-extrabold text-[10px]">UP NEXT:</span> ${nextMoveNameHtml}`;
    }

    // Set animation speed and active sidebar state
    const bpm = parseInt(document.getElementById('speedSlider').value);
    const beatInterval = 60000 / bpm;
    document.documentElement.style.setProperty('--anim-speed', (beatInterval * move.beats) + 'ms');

    document.querySelectorAll('.move-active').forEach(el => el.classList.remove('move-active'));
    const activeEl = document.getElementById(`m-${currentLandmarkIdx}-${currentMoveIdx}`);
    if (activeEl) {
        activeEl.classList.add('move-active');
        if (window.innerWidth >= 768) { // Only scroll on desktop (md breakpoint)
            activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    if (shouldRestartInterval && !isPaused) startScheduler();
}

function startScheduler() {
    if (schedulerIntervalId) clearInterval(schedulerIntervalId);
    beatsQueue = [];
    schedHoldingForRandom = false;
    if (DanceAudio.isReady()) {
        nextBeatTime = DanceAudio.getCurrentTime() + 0.05;
    }
    schedulerIntervalId = setInterval(scheduler, lookahead);
}

document.getElementById('bigStartBtn').onclick = () => {
    DanceAudio.init();
    startOverlay.classList.add('hidden');
    isPaused = false;
    beatIdx = 0;
    currentMoveIdx = 0;
    currentLandmarkIdx = 0;

    schedBeatIdx = 0;
    schedMoveIdx = 0;
    schedLandmarkIdx = 0;
    beatsQueue = [];

    updateHUD();
    renderSidebar();
    updateMoveDisplay(true);
};

document.getElementById('modeToggle').onclick = () => {
    isRandomMode = !isRandomMode;
    document.getElementById('modeBadge').textContent = isRandomMode ? "Random" : "Sequential";
    document.getElementById('modeName').textContent = isRandomMode ? "Randomized Landmark Drills" : "Linear Sequence Training";
    document.getElementById('modeToggle').textContent = isRandomMode ? "Switch to Linear" : "Randomize Chunks";
};

document.getElementById('playPauseBtn').onclick = (e) => {
    DanceAudio.init();
    isPaused = !isPaused;
    e.target.textContent = isPaused ? "Resume" : "Pause";
    if (isPaused) {
        if (schedulerIntervalId) clearInterval(schedulerIntervalId);
        beatsQueue = [];
    } else {
        schedLandmarkIdx = currentLandmarkIdx;
        schedMoveIdx = currentMoveIdx;
        schedBeatIdx = beatIdx;
        startScheduler();
    }
    updateMoveDisplay(false);
};

document.getElementById('panicBtn').onclick = () => {
    if (schedulerIntervalId) clearInterval(schedulerIntervalId);
    beatIdx = 0;
    currentMoveIdx = 0;
    schedBeatIdx = 0;
    schedMoveIdx = 0;
    beatsQueue = [];
    if (DanceAudio.isReady()) nextBeatTime = DanceAudio.getCurrentTime();
    updateMoveDisplay(true);
};

document.getElementById('shuffleToggle').onchange = (e) => {
    isShuffleMoves = e.target.checked;
    if (isShuffleMoves) generateMovePermutation(schedLandmarkIdx);
};

document.getElementById('spiralBtn').onclick = () => {
    if (isSpiralMode) {
        isSpiralMode = false;
        document.getElementById('spiralBtn').classList.remove('bg-indigo-600', 'text-white');
        document.getElementById('spiralBtn').classList.add('bg-indigo-900/40', 'text-indigo-300');
    } else {
        DanceAudio.init();
        startSpiralRoutine();
    }
};

document.getElementById('speedSlider').oninput = (e) => {
    document.getElementById('bpmValue').textContent = e.target.value + ' BPM';
    if (!isPaused) startScheduler();
};


// Reset Mastery Stats Handler
const resetMasteryBtn = document.getElementById('resetMasteryBtn');
if (resetMasteryBtn) {
    resetMasteryBtn.onclick = () => {
        if (confirm("Reset all mastery levels back to default hardcoded values?")) {
            localStorage.removeItem('wcs_mastery_state');
            window.location.reload();
        }
    };
}

// Sync Code Modal Management
const syncModal = document.getElementById('syncModal');
const showDiffBtn = document.getElementById('showDiffBtn');
const closeSyncModalBtn = document.getElementById('closeSyncModalBtn');
const closeSyncModalBtn2 = document.getElementById('closeSyncModalBtn2');
const syncModalBackdrop = document.getElementById('syncModalBackdrop');
const viewDiffBtn = document.getElementById('viewDiffBtn');
const viewFullCodeBtn = document.getElementById('viewFullCodeBtn');
const diffContent = document.getElementById('diffContent');
const codeContent = document.getElementById('codeContent');
const changesList = document.getElementById('changesList');
const rawCodeArea = document.getElementById('rawCodeArea');
const copyCodeBtn = document.getElementById('copyCodeBtn');

function openSyncModal() {
    if (!syncModal) return;
    syncModal.classList.remove('hidden');
    generateDiffAndCode();
}

function closeSyncModal() {
    if (!syncModal) return;
    syncModal.classList.add('hidden');
}

if (showDiffBtn) showDiffBtn.onclick = openSyncModal;
if (closeSyncModalBtn) closeSyncModalBtn.onclick = closeSyncModal;
if (closeSyncModalBtn2) closeSyncModalBtn2.onclick = closeSyncModal;
if (syncModalBackdrop) syncModalBackdrop.onclick = closeSyncModal;

if (viewDiffBtn && viewFullCodeBtn && diffContent && codeContent) {
    viewDiffBtn.onclick = () => {
        viewDiffBtn.className = "px-3 py-1.5 text-xs font-bold rounded-lg bg-purple-600 text-white shadow transition";
        viewFullCodeBtn.className = "px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-750 hover:text-white transition";
        diffContent.classList.remove('hidden');
        codeContent.classList.add('hidden');
    };
    
    viewFullCodeBtn.onclick = () => {
        viewFullCodeBtn.className = "px-3 py-1.5 text-xs font-bold rounded-lg bg-purple-600 text-white shadow transition";
        viewDiffBtn.className = "px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-750 hover:text-white transition";
        codeContent.classList.remove('hidden');
        diffContent.classList.add('hidden');
    };
}

function generateDiffAndCode() {
    if (!changesList || !rawCodeArea) return;
    
    // Find differences using optional chaining for defensive coding
    const diffs = [];
    LANDMARKS.forEach((lm, lIdx) => {
        lm.moves.forEach((m, mIdx) => {
            const currentMastery = m.mastery || 'learning';
            const originalMastery = ORIGINAL_LANDMARKS[lIdx]?.moves?.[mIdx]?.mastery || 'learning';
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
    
    // Render diff list
    if (diffs.length === 0) {
        changesList.innerHTML = `
            <div class="p-6 bg-slate-950/45 rounded-xl border border-slate-850 text-slate-400 text-center flex flex-col items-center justify-center gap-2">
                <svg class="w-8 h-8 text-emerald-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p class="font-bold text-slate-300">All progress in sync with code!</p>
                <p class="text-[10px] text-slate-500">Your browser's mastery stats match the defaults in the JavaScript file exactly.</p>
            </div>
        `;
    } else {
        changesList.innerHTML = diffs.map(d => {
            const fromConfig = MASTERY_CONFIG[d.from] || MASTERY_CONFIG.learning;
            const toConfig = MASTERY_CONFIG[d.to] || MASTERY_CONFIG.learning;
            
            return `
                <div class="p-3 bg-slate-950/40 border border-slate-850/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div class="space-y-0.5">
                        <div class="flex items-center gap-2">
                            <span class="w-1.5 h-1.5 rounded-full" style="background-color: ${d.landmarkColor}"></span>
                            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">${d.landmarkTitle}</span>
                        </div>
                        <div class="text-xs font-bold text-white">${d.moveName}</div>
                    </div>
                    <div class="flex items-center gap-2 text-[10px] font-mono shrink-0">
                        <span class="px-2 py-0.5 rounded border ${fromConfig.diffColor}">${fromConfig.text}</span>
                        <span class="text-slate-500 font-bold">&rarr;</span>
                        <span class="px-2 py-0.5 rounded border ${toConfig.diffColor} font-black">${toConfig.text}</span>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    // Generate raw formatted code
    const formattedCode = `const LANDMARKS = ${JSON.stringify(LANDMARKS, null, 4)};`;
    rawCodeArea.textContent = formattedCode;
}

if (copyCodeBtn && rawCodeArea) {
    copyCodeBtn.onclick = () => {
        navigator.clipboard.writeText(rawCodeArea.textContent).then(() => {
            const originalHTML = copyCodeBtn.innerHTML;
            copyCodeBtn.innerHTML = `
                <svg class="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                Copied!
            `;
            setTimeout(() => {
                copyCodeBtn.innerHTML = originalHTML;
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    };
}


window.onload = () => {
    loadMasteryState();
    updateMasteryStats();
    updateHUD();
    renderSidebar();
    updateMoveDisplay(false);
    requestAnimationFrame(draw);

    // Event Delegation for Landmark List
    if (landmarkList) {
        landmarkList.addEventListener('click', (e) => {
            const selectTarget = e.target.closest('[data-action="select"]');
            const cycleTarget = e.target.closest('[data-action="cycle"]');
            const scrollPrev = e.target.closest('[data-action="scroll-prev"]');
            const scrollNext = e.target.closest('[data-action="scroll-next"]');
            
            if (selectTarget) {
                const lIdx = parseInt(selectTarget.dataset.lidx, 10);
                const mIdx = parseInt(selectTarget.dataset.midx, 10);
                selectMove(lIdx, mIdx);
            } else if (cycleTarget) {
                e.stopPropagation();
                const lIdx = parseInt(cycleTarget.dataset.lidx, 10);
                const mIdx = parseInt(cycleTarget.dataset.midx, 10);
                cycleMastery(lIdx, mIdx);
            } else if (scrollPrev) {
                e.stopPropagation();
                const lIdx = parseInt(scrollPrev.dataset.lidx, 10);
                if (lIdx > 0) {
                    const prevEl = document.getElementById(`lm-section-${lIdx - 1}`);
                    if (prevEl) prevEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            } else if (scrollNext) {
                e.stopPropagation();
                const lIdx = parseInt(scrollNext.dataset.lidx, 10);
                if (lIdx < LANDMARKS.length - 1) {
                    const nextEl = document.getElementById(`lm-section-${lIdx + 1}`);
                    if (nextEl) nextEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    }
};
