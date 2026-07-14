const ORIGINAL_SALSA_LANDMARKS = JSON.parse(JSON.stringify(SALSA_LANDMARKS));

// Reference shared mastery config and filtering logic
// MASTERY_CONFIG is already globally declared in common_practice.js

let activeFilter = 'all';

function localGetLandmarkMastery(lm) {
    return window.getLandmarkMastery(lm);
}

function localGetFilteredLandmarkIndices() {
    return window.getFilteredLandmarkIndices(SALSA_LANDMARKS, activeFilter);
}

function applyFilter(filterVal) {
    activeFilter = filterVal;

    const buttons = {
        all: document.getElementById('filterAllBtn'),
        low: document.getElementById('filterLowBtn'),
        med: document.getElementById('filterMedBtn'),
        high: document.getElementById('filterHighBtn')
    };

    Object.keys(buttons).forEach(key => {
        const btn = buttons[key];
        if (!btn) return;
        if (key === filterVal) {
            btn.className = "py-1 text-[9px] font-bold uppercase rounded transition-all bg-red-600 text-white shadow-sm border border-red-500/10";
        } else {
            btn.className = "py-1 text-[9px] font-bold uppercase rounded transition-all text-slate-400 hover:text-slate-100 hover:bg-slate-900/40";
        }
    });

    renderSidebar();

    const filtered = localGetFilteredLandmarkIndices();
    if (filtered.length > 0) {
        if (!filtered.includes(currentLandmarkIdx)) {
            selectMove(filtered[0], 0);
        }
    }
}

let currentLandmarkIdx = 0;
let lastLandmarkIdx = -1;
let currentMoveIdx = 0;
let beatIdx = 0;
let isPaused = true;
let isRandomMode = false;
let isLoopMode = false;

// Scheduler state
let schedulerIntervalId = null;
let schedLandmarkIdx = 0;
let schedMoveIdx = 0;
let schedBeatIdx = 0;
let schedPhraseBeatIdx = 0; // 0-7 for the 8-beat loop
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
let visualPhraseBeatIdx = 0;
let lastRenderedLandmarkIdx = -1;
let lastRenderedMoveIdx = -1;

const landmarkList = document.getElementById('landmarkList');
const startOverlay = document.getElementById('startOverlay');

function scheduler() {
    if (isPaused || schedHoldingForRandom) return;

    const bpm = parseInt(document.getElementById('bpmSlider').value);
    const secondsPerBeat = 60.0 / bpm;

    while (nextBeatTime < DanceAudio.getCurrentTime() + scheduleAheadTime) {
        scheduleBeat(schedPhraseBeatIdx, nextBeatTime);

        const currentMove = SALSA_LANDMARKS[schedLandmarkIdx].moves[schedMoveIdx];
        // Push the beat to visual queue
        beatsQueue.push({
            beat: schedBeatIdx,
            phraseBeat: schedPhraseBeatIdx,
            time: nextBeatTime,
            moveIdx: schedMoveIdx,
            landmarkIdx: schedLandmarkIdx,
            landmarkColor: SALSA_LANDMARKS[schedLandmarkIdx].color,
            moveName: currentMove.name,
            beatsTotal: currentMove.beats || 4
        });

        advanceBeat(secondsPerBeat);
    }
}

function scheduleBeat(beatNumber, time) {
    DanceAudio.playSalsaBeat(time, beatNumber, true);
}

function advanceBeat(secondsPerBeat) {
    nextBeatTime += secondsPerBeat;

    schedBeatIdx++;
    schedPhraseBeatIdx = (schedPhraseBeatIdx + 1) % 8;

    const currentMove = SALSA_LANDMARKS[schedLandmarkIdx].moves[schedMoveIdx];
    const beatsTotal = currentMove.beats || 4;
    if (schedBeatIdx >= beatsTotal) {
        schedBeatIdx = 0;

        if (schedMoveIdx >= SALSA_LANDMARKS[schedLandmarkIdx].moves.length - 1) {
            if (isRandomMode) {
                schedHoldingForRandom = true;
            } else if (isLoopMode) {
                schedMoveIdx = 0;
            } else {
                const filtered = localGetFilteredLandmarkIndices();
                const currentFilteredPos = filtered.indexOf(schedLandmarkIdx);
                if (currentFilteredPos !== -1 && filtered.length > 0) {
                    const nextFilteredPos = (currentFilteredPos + 1) % filtered.length;
                    schedLandmarkIdx = filtered[nextFilteredPos];
                } else if (filtered.length > 0) {
                    schedLandmarkIdx = filtered[0];
                } else {
                    schedLandmarkIdx = (schedLandmarkIdx + 1) % SALSA_LANDMARKS.length;
                }
                schedMoveIdx = 0;
            }
        } else {
            schedMoveIdx++;
        }
    }
}

function triggerVisualBeatFeedback(playedBeat) {
    currentVisualLandmarkIdx = playedBeat.landmarkIdx;
    currentVisualMoveIdx = playedBeat.moveIdx;
    currentVisualBeatIdx = playedBeat.beat;
    visualPhraseBeatIdx = playedBeat.phraseBeat;
    beatIdx = playedBeat.beat;

    let displayLandmarkIdx = playedBeat.landmarkIdx;
    let displayMoveIdx = playedBeat.moveIdx;

    // Show next move early on the "anchor" beats (Beat 4 or 8)
    const isPreemptiveBeat = (playedBeat.phraseBeat === 3 || playedBeat.phraseBeat === 7);
    
    if (isPreemptiveBeat) {
        const lm = SALSA_LANDMARKS[displayLandmarkIdx];
        if (displayMoveIdx < lm.moves.length - 1) {
            displayMoveIdx++;
        } else if (isLoopMode) {
            displayMoveIdx = 0;
        } else if (!isRandomMode) {
            const filtered = localGetFilteredLandmarkIndices();
            const currentFilteredPos = filtered.indexOf(displayLandmarkIdx);
            if (currentFilteredPos !== -1 && filtered.length > 0) {
                const nextFilteredPos = (currentFilteredPos + 1) % filtered.length;
                displayLandmarkIdx = filtered[nextFilteredPos];
            } else if (filtered.length > 0) {
                displayLandmarkIdx = filtered[0];
            } else {
                displayLandmarkIdx = (displayLandmarkIdx + 1) % SALSA_LANDMARKS.length;
            }
            displayMoveIdx = 0;
        }
    }

    if (displayMoveIdx !== lastRenderedMoveIdx || displayLandmarkIdx !== lastRenderedLandmarkIdx) {
        lastRenderedMoveIdx = displayMoveIdx;
        lastRenderedLandmarkIdx = displayLandmarkIdx;

        // Update globals so HUD and other components reflect the displayed move
        currentLandmarkIdx = displayLandmarkIdx;
        currentMoveIdx = displayMoveIdx;

        updateHUD();
        renderSidebar();
        // Pass the preemptive info to updateMoveDisplay
        const preemptivePhraseBeat = isPreemptiveBeat ? (playedBeat.phraseBeat === 3 ? 4 : 0) : playedBeat.phraseBeat;
        updateMoveDisplay(false, displayLandmarkIdx, displayMoveIdx, preemptivePhraseBeat);
    }

    // Check if we just completed the landmark in random mode!
    const isLastMove = playedBeat.moveIdx === SALSA_LANDMARKS[playedBeat.landmarkIdx].moves.length - 1;
    const isLastBeatOfMove = playedBeat.beat === playedBeat.beatsTotal - 1;
    if (isRandomMode && isLastMove && isLastBeatOfMove) {
        triggerRandomCountdown();
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

function triggerRandomCountdown() {
    isPaused = true;
    if (schedulerIntervalId) clearInterval(schedulerIntervalId);
    beatsQueue = [];
    schedHoldingForRandom = false;

    // Defensive safeguard to select from filtered landmarks list
    const filtered = localGetFilteredLandmarkIndices();
    if (filtered.length > 1) {
        lastLandmarkIdx = currentVisualLandmarkIdx;
        let nextIdx;
        do {
            const randPos = Math.floor(Math.random() * filtered.length);
            nextIdx = filtered[randPos];
        } while (nextIdx === lastLandmarkIdx && filtered.length > 1);
        currentVisualLandmarkIdx = nextIdx;
    } else if (filtered.length === 1) {
        currentVisualLandmarkIdx = filtered[0];
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

    // Render HUD and Sidebar so user sees what is coming next!
    updateHUD();
    renderSidebar();
    updateMoveDisplay(false);

    startOverlay.classList.remove('hidden');
    document.getElementById('overlayContent').classList.add('hidden');
    const cdDisplay = document.getElementById('countdownDisplay');
    cdDisplay.classList.remove('hidden');

    const lm = SALSA_LANDMARKS[currentVisualLandmarkIdx];
    document.getElementById('nextChunkName').textContent = lm.title;
    document.getElementById('nextChunkName').style.color = lm.color;
    document.getElementById('nextChunkAnchor').textContent = lm.anchor;

    let count = 5;
    const timerEl = document.getElementById('timerCircle');
    timerEl.textContent = count;

    const cdInterval = setInterval(() => {
        count--;
        timerEl.textContent = count;
        if (count <= 0) {
            clearInterval(cdInterval);
            startOverlay.classList.add('hidden');
            isPaused = false;
            startScheduler();
        }
    }, 1000);
}

function updateHUD() {
    const lm = SALSA_LANDMARKS[currentLandmarkIdx];
    const hud = document.getElementById('landmarkHUD');
    hud.style.borderColor = lm.color;
    const tag = document.getElementById('landmarkTag');
    tag.style.backgroundColor = lm.color;
    tag.textContent = `L-${currentLandmarkIdx + 1}`;
    document.getElementById('landmarkTitle').textContent = lm.title;
    const anchor = document.getElementById('landmarkAnchor');
    anchor.textContent = lm.anchor;
    anchor.style.color = lm.color;

    const links = document.getElementById('tutorialLinks');
    links.innerHTML = (lm.links || []).map(([url, label]) => `
        <a href="${url}" target="_blank" class="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded-lg border border-slate-200 uppercase">
            ${label}
        </a>
    `).join('');

    updateMasteryProgress();
}

function updateMasteryProgress() {
    const lm = SALSA_LANDMARKS[currentLandmarkIdx];
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
        progressBar.style.backgroundImage = `linear-gradient(to right, ${lm.color}, #fca5a5)`;
    }
}

function updateMoveDisplay(shouldRestartInterval = true, lIdx = currentLandmarkIdx, mIdx = currentMoveIdx, phraseBeat = visualPhraseBeatIdx) {
    const landmark = SALSA_LANDMARKS[lIdx];
    const move = landmark.moves[mIdx];
    const countLabel = phraseBeat < 4 ? "1-4" : "5-8";

    const mastery = move.mastery || 'learning';
    const config = MASTERY_CONFIG[mastery] || MASTERY_CONFIG.learning;

    let hintHtml = move.hint ? `<div class="text-xs sm:text-sm mt-2 text-center font-bold tracking-wider sm:tracking-widest text-amber-300 bg-amber-950/60 border border-amber-500/30 px-3 py-1 sm:px-4 sm:py-1.5 rounded-xl shadow-lg shadow-amber-900/20" style="font-variant: small-caps;">${move.hint}</div>` : '';

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
        currentLabelEl.innerHTML = `<div class="active-move-animate flex flex-col items-center justify-center gap-2">
            <div class="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                <span class="text-red-400 font-black text-xl sm:text-2xl md:text-3xl px-3 py-1 rounded bg-red-950/40 border border-red-900/30 flex items-center gap-1 font-mono">${countLabel}</span>
                <span class="text-xl sm:text-2xl md:text-3xl font-black ${config.textColor} tracking-tight text-center leading-tight">${move.name}</span>
            </div>
            ${hintHtml}
        </div>`;

        nextLabelEl.className = "text-xs md:text-sm font-bold text-slate-400 mt-4 uppercase tracking-wider px-4 py-2 rounded-xl bg-slate-950/60 border border-slate-850/80 shadow-sm flex items-center gap-2";
        nextLabelEl.innerHTML = `<span class="text-slate-500 font-extrabold text-[10px]">UP NEXT:</span> ${nextMoveNameHtml}`;
    }

    // Sidebar syncing without full re-render
    document.querySelectorAll('.move-active').forEach(el => el.classList.remove('move-active'));
    const activeId = `m-${currentLandmarkIdx}-${currentMoveIdx}`;
    const activeEl = document.getElementById(activeId);
    if (activeEl) {
        activeEl.classList.add('move-active');
        if (window.innerWidth >= 768) {
            activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    if (shouldRestartInterval && !isPaused) startScheduler();
}

function renderSidebar() {
    landmarkList.innerHTML = '';
    const filteredIndices = localGetFilteredLandmarkIndices();

    if (filteredIndices.length === 0) {
        landmarkList.innerHTML = `
            <div class="p-6 bg-slate-950/45 rounded-xl border border-slate-850 text-slate-400 text-center flex flex-col items-center justify-center gap-2">
                <svg class="w-8 h-8 text-amber-500/80 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <p class="font-bold text-slate-300">No chunks in this range!</p>
                <p class="text-[10px] text-slate-500">No landmarks match the selected mastery range.</p>
            </div>
        `;
        return;
    }

    SALSA_LANDMARKS.forEach((lm, lIdx) => {
        if (!filteredIndices.includes(lIdx)) return;

        const section = document.createElement('div');
        section.id = `lm-section-${lIdx}`;
        section.className = `p-3 rounded-xl transition-all duration-300 ${lIdx === currentLandmarkIdx ? 'landmark-active' : 'opacity-30 hover:opacity-75'}`;
        section.style.color = lm.color;

        const masteryPct = localGetLandmarkMastery(lm);

        const movesHtml = lm.moves.map((m, mIdx) => {
            const mastery = m.mastery || 'learning';
            const config = MASTERY_CONFIG[mastery] || MASTERY_CONFIG.learning;
            const isCurrent = (lIdx === currentLandmarkIdx && mIdx === currentMoveIdx);
            const hintTooltip = m.hint ? `title="${m.hint}"` : '';
            return `
                <div id="m-${lIdx}-${mIdx}" class="text-[11px] px-2 py-1.5 rounded transition-all flex items-center justify-between gap-2 group ${isCurrent ? 'move-active' : 'hover:bg-slate-900/30'}">
                    <span class="truncate flex-1 py-0.5 font-bold ${config.textColor}" data-lidx="${lIdx}" data-midx="${mIdx}" ${hintTooltip}>
                        ${m.name}
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
                    <div class="text-xs font-bold text-slate-200 pr-2 flex flex-col gap-1">
                        <span class="truncate max-w-[180px]">${lm.title}</span>
                        <span class="self-start text-[9px] font-mono px-1.5 py-0.5 rounded ${masteryPct >= 75 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                masteryPct >= 40 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    'bg-red-500/10 text-red-400 border border-red-500/20'
            }">${masteryPct}% Mastery</span>
                    </div>
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
            <div class="space-y-0.5 bg-slate-900/40 rounded-lg p-0.5 mb-2 border border-slate-800/80">
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
    visualPhraseBeatIdx = 0; // Reset to 1-4 part when selected

    schedLandmarkIdx = lIdx;
    schedMoveIdx = mIdx;
    schedBeatIdx = 0;
    schedPhraseBeatIdx = 0;
    beatsQueue = [];
    if (DanceAudio.isReady()) nextBeatTime = DanceAudio.getCurrentTime();

    updateHUD();
    renderSidebar();
    updateMoveDisplay(true);
}

function cycleMastery(lIdx, mIdx, event) {
    if (event) event.stopPropagation();
    const move = SALSA_LANDMARKS[lIdx].moves[mIdx];
    if (move.mastery === 'mastered') {
        move.mastery = 'learning';
    } else if (move.mastery === 'familiar') {
        move.mastery = 'mastered';
    } else {
        move.mastery = 'familiar';
    }
    localSaveMasteryState();

    let filtered = localGetFilteredLandmarkIndices();
    if (filtered.length === 0) {
        applyFilter('all');
    } else if (!filtered.includes(currentLandmarkIdx)) {
        selectMove(filtered[0], 0);
    } else {
        renderSidebar();
        updateMasteryStats();
        updateMasteryProgress();
    }
}

function localSaveMasteryState() {
    window.saveMasteryState('salsa_mastery_state', SALSA_LANDMARKS);
}

function localLoadMasteryState() {
    window.loadMasteryState('salsa_mastery_state', SALSA_LANDMARKS);
}

function updateMasteryStats() {
    const stats = window.getMasteryStats(SALSA_LANDMARKS);
    const statsEl = document.getElementById('masteryStatsCount');
    if (statsEl) {
        statsEl.textContent = `Mastered: ${stats.mastered}/${stats.total}`;
    }
}

window.selectMove = selectMove;
window.cycleMastery = cycleMastery;

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
    isPaused = true;
    beatIdx = 0;
    currentMoveIdx = 0;

    const filtered = localGetFilteredLandmarkIndices();
    const startLIdx = filtered.length > 0 ? filtered[0] : 0;
    currentLandmarkIdx = startLIdx;

    schedBeatIdx = 0;
    schedPhraseBeatIdx = 0;
    schedMoveIdx = 0;
    schedLandmarkIdx = startLIdx;
    beatsQueue = [];

    updateHUD();
    renderSidebar();
    updateMoveDisplay(false);

    // Ensure play/pause button matches the paused state
    const playPauseBtn = document.getElementById('playPauseBtn');
    if (playPauseBtn) {
        playPauseBtn.innerHTML = `
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path></svg>
            Resume
        `;
    }
};

document.getElementById('playPauseBtn').onclick = (e) => {
    DanceAudio.init();
    isPaused = !isPaused;

    if (isPaused) {
        e.currentTarget.innerHTML = `
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path></svg>
            Resume
        `;
        if (schedulerIntervalId) clearInterval(schedulerIntervalId);
        beatsQueue = [];
    } else {
        e.currentTarget.innerHTML = `
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
            Pause
        `;
        schedLandmarkIdx = currentLandmarkIdx;
        schedMoveIdx = currentMoveIdx;
        schedBeatIdx = beatIdx;
        startScheduler();
    }
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

document.getElementById('modeToggle').onclick = () => {
    isRandomMode = !isRandomMode;
    document.getElementById('modeBadge').textContent = isRandomMode ? "Random" : "Sequential";
    document.getElementById('modeName').textContent = isRandomMode ? "Randomized Landmark Drills" : "Linear Sequence Training";
    document.getElementById('modeToggle').textContent = isRandomMode ? "Switch to Linear" : "Randomize Chunks";
};

document.getElementById('loopToggle').onchange = (e) => {
    isLoopMode = e.target.checked;
};

document.getElementById('bpmSlider').oninput = (e) => {
    document.getElementById('bpmValue').textContent = e.target.value + ' BPM';
    if (!isPaused) startScheduler();
};

// Reset Mastery Stats Handler
const resetMasteryBtn = document.getElementById('resetMasteryBtn');
const resetModal = document.getElementById('resetModal');
const closeResetModalBtn = document.getElementById('closeResetModalBtn');
const cancelResetBtn = document.getElementById('cancelResetBtn');
const confirmResetBtn = document.getElementById('confirmResetBtn');
const resetModalBackdrop = document.getElementById('resetModalBackdrop');

function closeResetModal() {
    if (resetModal) resetModal.classList.add('hidden');
}

if (resetMasteryBtn && resetModal) {
    resetMasteryBtn.onclick = () => {
        resetModal.classList.remove('hidden');
    };

    [closeResetModalBtn, cancelResetBtn, resetModalBackdrop].forEach(el => {
        if (el) el.onclick = closeResetModal;
    });

    if (confirmResetBtn) {
        confirmResetBtn.onclick = () => {
            localStorage.removeItem('salsa_mastery_state');
            window.location.reload();
        };
    }
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
        viewDiffBtn.className = "px-3 py-1.5 text-xs font-bold rounded-lg bg-red-600 text-white shadow transition";
        viewFullCodeBtn.className = "px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-750 hover:text-white transition";
        diffContent.classList.remove('hidden');
        codeContent.classList.add('hidden');
    };

    viewFullCodeBtn.onclick = () => {
        viewFullCodeBtn.className = "px-3 py-1.5 text-xs font-bold rounded-lg bg-red-600 text-white shadow transition";
        viewDiffBtn.className = "px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-750 hover:text-white transition";
        codeContent.classList.remove('hidden');
        diffContent.classList.add('hidden');
    };
}

function generateDiffAndCode() {
    if (!changesList || !rawCodeArea) return;

    // Find differences using optional chaining for defensive coding
    const diffs = window.getDiffs(SALSA_LANDMARKS, ORIGINAL_SALSA_LANDMARKS);

    // Render diff list
    if (diffs.length === 0) {
        changesList.innerHTML = `
            <div class="p-6 bg-slate-950/50 rounded-xl border border-slate-850 text-slate-400 text-center flex flex-col items-center justify-center gap-2">
                <svg class="w-8 h-8 text-emerald-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p class="font-bold text-slate-200">All progress in sync with code!</p>
                <p class="text-[10px] text-slate-400">Your browser's mastery stats match the defaults in the JavaScript file exactly.</p>
            </div>
        `;
    } else {
        changesList.innerHTML = diffs.map(d => {
            const fromConfig = MASTERY_CONFIG[d.from] || MASTERY_CONFIG.learning;
            const toConfig = MASTERY_CONFIG[d.to] || MASTERY_CONFIG.learning;

            return `
                <div class="p-3 bg-slate-950/40 border border-slate-850 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div class="space-y-0.5">
                        <div class="flex items-center gap-2">
                            <span class="w-1.5 h-1.5 rounded-full" style="background-color: ${d.landmarkColor}"></span>
                            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">${d.landmarkTitle}</span>
                        </div>
                        <div class="text-xs font-bold text-slate-200">${d.moveName}</div>
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
    const formattedCode = `const SALSA_LANDMARKS = ${JSON.stringify(SALSA_LANDMARKS, null, 4)};`;
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

    localLoadMasteryState();
    updateMasteryStats();
    updateHUD();
    renderSidebar();
    updateMoveDisplay(false);
    requestAnimationFrame(draw);

    // Wire up filter buttons
    const filterAllBtn = document.getElementById('filterAllBtn');
    const filterLowBtn = document.getElementById('filterLowBtn');
    const filterMedBtn = document.getElementById('filterMedBtn');
    const filterHighBtn = document.getElementById('filterHighBtn');

    if (filterAllBtn) filterAllBtn.onclick = () => applyFilter('all');
    if (filterLowBtn) filterLowBtn.onclick = () => applyFilter('low');
    if (filterMedBtn) filterMedBtn.onclick = () => applyFilter('med');
    if (filterHighBtn) filterHighBtn.onclick = () => applyFilter('high');

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
                const filtered = localGetFilteredLandmarkIndices();
                const currentPos = filtered.indexOf(lIdx);
                if (currentPos > 0) {
                    const prevLIdx = filtered[currentPos - 1];
                    const prevEl = document.getElementById(`lm-section-${prevLIdx}`);
                    if (prevEl) prevEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            } else if (scrollNext) {
                e.stopPropagation();
                const lIdx = parseInt(scrollNext.dataset.lidx, 10);
                const filtered = localGetFilteredLandmarkIndices();
                const currentPos = filtered.indexOf(lIdx);
                if (currentPos !== -1 && currentPos < filtered.length - 1) {
                    const nextLIdx = filtered[currentPos + 1];
                    const nextEl = document.getElementById(`lm-section-${nextLIdx}`);
                    if (nextEl) nextEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    }
};
