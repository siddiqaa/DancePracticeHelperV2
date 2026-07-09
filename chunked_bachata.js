const LANDMARKS = [
    {
        title: "Warm-Up Loop",
        anchor: "Double basic → inside (repeat) → catch and reverse",
        color: "#10b981",
        moves: [
            { name: "Basic", beats: 4, mastery: "mastered" },
            { name: "Basic", beats: 4, mastery: "mastered" },
            { name: "Inside Turn", beats: 4, mastery: "mastered" },
            { name: "Basic", beats: 4, mastery: "mastered" },
            { name: "Basic", beats: 4, mastery: "mastered" },
            { name: "Inside Turn", beats: 4, mastery: "mastered" },
            { name: "Basic", beats: 4, mastery: "mastered" },
            { name: "Inside Turn Catch & Reverse", beats: 4, mastery: "familiar" },
            { name: "Inside Turn", beats: 4, mastery: "mastered" },
            { name: "Basic", beats: 4, mastery: "mastered" },
            { name: "Star hands", beats: 4, mastery: "familiar" },
            { name: "Hip lead inside turn", beats: 4, mastery: "learning" }
        ],
        links: ["https://youtu.be/XfWSKuzRVCM?t=289"]
    },
    {
        title: "Hammerlocks",
        anchor: "Hammerlock → handsweep into hammerlock",
        color: "#3b82f6",
        moves: [
            { name: "Basic", beats: 4, mastery: "mastered" },
            { name: "Basic", beats: 4, mastery: "mastered" },
            { name: "Enter hammerlock", beats: 4, mastery: "familiar" },
            { name: "Exit hammerlock", beats: 4, mastery: "familiar" },
            { name: "Basic", beats: 4, mastery: "mastered" },
            { name: "My Inside Turn → Closed Position", beats: 4, mastery: "familiar", hint: "put her right hand on your left shoulder and let it slide across your neck" },
            { name: "Basic", beats: 4, mastery: "mastered" },
            { name: "Basic", beats: 4, mastery: "mastered" },
            { name: "Basic with hand sweep", beats: 4, mastery: "learning" },
            { name: "Right arm flip → hammerlock", beats: 4, mastery: "learning" },
            { name: "Unwind hammerlock (R hand)", beats: 4, mastery: "familiar" },
            { name: "Hairbrush using my right hand to closed", beats: 4, mastery: "learning" },
            { name: "Basic", beats: 4, mastery: "mastered" },
            { name: "Basic", beats: 4, mastery: "mastered" },
            { name: "Basic", beats: 4, mastery: "mastered" },
            { name: "Inside turn both hands connected", beats: 4, mastery: "learning" },
            { name: "Flip her left hand, catch and send back in hammerlock", beats: 4, mastery: "learning" },
            { name: "Unwind hammer lock", beats: 4, mastery: "familiar" }
        ],
        links: ["https://www.youtube.com/watch?v=3yEgyHaMExc", "https://www.instagram.com/reel/DUvvacfjvh-/", "https://youtu.be/XfWSKuzRVCM?t=153", "https://youtu.be/XfWSKuzRVCM?t=289"]
    },
    {
        title: "Pretzels",
        anchor: "Pretzel 1 → pretzel 2",
        color: "#8b5cf6",
        moves: [
            { name: "Basic", beats: 4, mastery: "mastered" },
            { name: "Basic", beats: 4, mastery: "mastered" },
            { name: "Basic", beats: 4, mastery: "mastered" },
            { name: "Enter pretzel (Var 1)", beats: 4, mastery: "learning" },
            { name: "Pretzel Var 1 exit", beats: 4, mastery: "learning" },
            { name: "Inside turn (L lead on R shoulder)", beats: 4, mastery: "familiar" },
            { name: "Basic", beats: 4, mastery: "mastered" },
            { name: "Basic", beats: 4, mastery: "mastered" },
            { name: "Basic", beats: 4, mastery: "mastered" },
            { name: "Enter pretzel (Var 2)", beats: 4, mastery: "learning" },
            { name: "Switch follower R → L", beats: 4, mastery: "learning" },
            { name: "Awkward hand hold", beats: 4, mastery: "familiar" },
            { name: "Basic (awkward hold)", beats: 4, mastery: "learning" },
            { name: "Leader inside turn → exit awkward", beats: 4, mastery: "learning" }
        ],
        links: ["https://youtu.be/1VzipnwNFXo?si=zLRSU7oRBSfUs_6m", "https://www.youtube.com/watch?v=XfWSKuzRVCM"]
    },
    {
        title: "Closed Slow Control",
        anchor: "Closed → slow → 360 → out",
        color: "#f59e0b",
        moves: [
            { name: "Basic", beats: 4, mastery: "mastered" },
            { name: "Basic", beats: 4, mastery: "mastered" },
            { name: "Basic", beats: 4, mastery: "mastered" },
            { name: "My Inside Turn → Closed Position", beats: 4, mastery: "familiar" },
            { name: "Closed basic", beats: 4, mastery: "mastered" },
            { name: "Closed basic", beats: 4, mastery: "mastered" },
            { name: "Closed 360", beats: 4, mastery: "learning" },
            { name: "Close basic", beats: 4, mastery: "mastered" },
            { name: "Hesitation slide", beats: 4, mastery: "learning" },
            { name: "Hesitation slide", beats: 4, mastery: "learning" },
            { name: "Hesitation slide", beats: 4, mastery: "learning" },
            { name: "Hesitation slide", beats: 4, mastery: "learning" },
            { name: "Exit closed → basic", beats: 4, mastery: "familiar" },
            { name: "Basic", beats: 4, mastery: "mastered" }
        ],
        links: []
    },
    {
        title: "Madrid Maze",
        anchor: "Madrids",
        color: "#f97316",
        moves: [
            { name: "Basic (Open Hold)", beats: 4, mastery: "mastered" },
            { name: "Basic (Open Hold)", beats: 4, mastery: "mastered" },
            { name: "Madrid Step Forward", beats: 4, mastery: "learning" },
            { name: "Madrid Step Back", beats: 4, mastery: "learning" }
        ],
        links: ["https://www.youtube.com/watch?v=Ti4qjrRqyAo"]
    },
    {
        title: "Frontal and Shadow Waves",
        anchor: "Vertical S-Wave → Lateral → Shadow Roll",
        color: "#ef4444",
        moves: [
            { name: "Basic", beats: 4, mastery: "mastered" },
            { name: "Basic", beats: 4, mastery: "mastered" },
            { name: "The 'S' Wave (Vertical)", beats: 4, mastery: "learning" },
            { name: "Lateral Wave (Side-to-Side)", beats: 4, mastery: "learning" },
            { name: "Inside Turn to Closed Position", beats: 4, mastery: "familiar" },
            { name: "Frontal Body Roll (Closed)", beats: 4, mastery: "learning" },
            { name: "Lead into shadow position", beats: 4, mastery: "familiar" },
            { name: "Shadow Body Roll", beats: 4, mastery: "learning" },
            { name: "Exit Shadow → Inside turn", beats: 4, mastery: "familiar" },
            { name: "Basic", beats: 4, mastery: "mastered" },
            { name: "Basic", beats: 4, mastery: "mastered" }
        ],
        links: []
    },
    {
        title: "Shoulder Blade Finale",
        anchor: "Hammerlock → Switch → Shoulder blades → overhead → turn",
        color: "#1e293b",
        moves: [
            { name: "Basic", beats: 4, mastery: "mastered" },
            { name: "Basic", beats: 4, mastery: "mastered" },
            { name: "Inside turn → hammerlock", beats: 4, mastery: "familiar" },
            { name: "Switch places", beats: 4, mastery: "familiar" },
            { name: "Hands to shoulder blades", beats: 4, mastery: "learning" },
            { name: "Raise hands overhead", beats: 4, mastery: "learning" },
            { name: "Inside turn led from hip", beats: 4, mastery: "learning" },
            { name: "Basic handhold back", beats: 4, mastery: "familiar" }
        ],
        links: ["https://youtu.be/Vx3AWpgnoVQ?si=pZlZTw1V6d322ON-&t=221"]
    }
];

const ORIGINAL_LANDMARKS = JSON.parse(JSON.stringify(LANDMARKS));

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

let activeFilter = 'all';

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

function getFilteredLandmarkIndices() {
    return LANDMARKS.map((lm, idx) => {
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
            btn.className = "py-1 text-[9px] font-bold uppercase rounded transition-all bg-blue-600 text-white shadow-sm border border-blue-500/10";
        } else {
            btn.className = "py-1 text-[9px] font-bold uppercase rounded transition-all text-slate-400 hover:text-slate-100 hover:bg-slate-900/40";
        }
    });

    renderSidebar();

    const filtered = getFilteredLandmarkIndices();
    if (filtered.length > 0) {
        if (!filtered.includes(currentLandmarkIdx)) {
            selectMove(filtered[0], 0);
        }
    }
}

let currentLandmarkIdx = 0;
let currentMoveIdx = 0;
let beatIdx = 0;
let isPaused = true;
let isRandomMode = false;

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

function scheduler() {
    if (isPaused || schedHoldingForRandom) return;

    const bpm = parseInt(document.getElementById('bpmSlider').value);
    const secondsPerBeat = 60.0 / bpm;

    while (nextBeatTime < DanceAudio.getCurrentTime() + scheduleAheadTime) {
        scheduleBeat(schedBeatIdx, nextBeatTime);
        
        // Push the beat to visual queue
        beatsQueue.push({
            beat: schedBeatIdx,
            time: nextBeatTime,
            moveIdx: schedMoveIdx,
            landmarkIdx: schedLandmarkIdx,
            landmarkColor: LANDMARKS[schedLandmarkIdx].color,
            moveName: LANDMARKS[schedLandmarkIdx].moves[schedMoveIdx].name,
            beatsTotal: LANDMARKS[schedLandmarkIdx].moves[schedMoveIdx].beats || 4
        });
        
        advanceBeat(secondsPerBeat);
    }
}

function scheduleBeat(beatNumber, time) {
    DanceAudio.playBachataBeat(time, beatNumber, true);
}

function advanceBeat(secondsPerBeat) {
    nextBeatTime += secondsPerBeat;
    
    schedBeatIdx++;
    if (schedBeatIdx >= 4) {
        schedBeatIdx = 0;
        
        if (schedMoveIdx >= LANDMARKS[schedLandmarkIdx].moves.length - 1) {
            if (isRandomMode) {
                schedHoldingForRandom = true;
            } else {
                const filtered = getFilteredLandmarkIndices();
                const currentFilteredPos = filtered.indexOf(schedLandmarkIdx);
                if (currentFilteredPos !== -1 && filtered.length > 0) {
                    const nextFilteredPos = (currentFilteredPos + 1) % filtered.length;
                    schedLandmarkIdx = filtered[nextFilteredPos];
                } else if (filtered.length > 0) {
                    schedLandmarkIdx = filtered[0];
                } else {
                    schedLandmarkIdx = (schedLandmarkIdx + 1) % LANDMARKS.length;
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
    beatIdx = playedBeat.beat;

    let displayLandmarkIdx = playedBeat.landmarkIdx;
    let displayMoveIdx = playedBeat.moveIdx;

    // Show next move early on the tap (beat index 3)
    if (playedBeat.beat >= playedBeat.beatsTotal - 2) {
        const lm = LANDMARKS[displayLandmarkIdx];
        if (displayMoveIdx < lm.moves.length - 1) {
            displayMoveIdx++;
        } else if (!isRandomMode) {
            const filtered = getFilteredLandmarkIndices();
            const currentFilteredPos = filtered.indexOf(displayLandmarkIdx);
            if (currentFilteredPos !== -1 && filtered.length > 0) {
                const nextFilteredPos = (currentFilteredPos + 1) % filtered.length;
                displayLandmarkIdx = filtered[nextFilteredPos];
            } else if (filtered.length > 0) {
                displayLandmarkIdx = filtered[0];
            } else {
                displayLandmarkIdx = (displayLandmarkIdx + 1) % LANDMARKS.length;
            }
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

    // Check if we just completed the landmark in random mode!
    const isLastMove = playedBeat.moveIdx === LANDMARKS[playedBeat.landmarkIdx].moves.length - 1;
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
    const filtered = getFilteredLandmarkIndices();
    if (filtered.length > 1) {
        const lastIdx = currentVisualLandmarkIdx;
        let nextIdx = currentVisualLandmarkIdx;
        while (nextIdx === lastIdx) {
            const randPos = Math.floor(Math.random() * filtered.length);
            nextIdx = filtered[randPos];
        }
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
    updateMoveDisplay();

    startOverlay.classList.remove('hidden');
    document.getElementById('overlayContent').classList.add('hidden');
    const cdDisplay = document.getElementById('countdownDisplay');
    cdDisplay.classList.remove('hidden');

    const lm = LANDMARKS[currentVisualLandmarkIdx];
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

    const links = document.getElementById('tutorialLinks');
    links.innerHTML = lm.links.map((url, i) => `
        <a href="${url}" target="_blank" class="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded-lg border border-slate-200 uppercase">
            Tutorial ${i + 1}
        </a>
    `).join('');

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

function updateMoveDisplay() {
    const landmark = LANDMARKS[currentLandmarkIdx];
    const move = landmark.moves[currentMoveIdx];
    const countLabel = (currentMoveIdx % 2 === 0) ? "1-4" : "5-8";
    
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
        currentLabelEl.innerHTML = `<div class="active-move-animate flex flex-col items-center justify-center gap-1">
            <div class="flex items-center gap-4">
                <span class="text-blue-400 font-black text-2xl md:text-3xl px-3 py-1 rounded bg-blue-950/40 border border-blue-900/30 flex items-center gap-1 font-mono">${countLabel}</span>
                <span class="text-3xl font-black ${config.textColor} tracking-tight text-center">${move.name}</span>
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
}

function renderSidebar() {
    landmarkList.innerHTML = '';
    const filteredIndices = getFilteredLandmarkIndices();
    
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

    LANDMARKS.forEach((lm, lIdx) => {
        if (!filteredIndices.includes(lIdx)) return;
        
        const section = document.createElement('div');
        section.id = `lm-section-${lIdx}`;
        section.className = `p-3 rounded-xl transition-all duration-300 ${lIdx === currentLandmarkIdx ? 'landmark-active' : 'opacity-30 hover:opacity-75'}`;
        section.style.color = lm.color;
        
        const masteryPct = getLandmarkMastery(lm);
        
        let movesHtml = '';
        for (let mIdx = 0; mIdx < lm.moves.length; mIdx += 2) {
            const m1 = lm.moves[mIdx];
            const m2 = lm.moves[mIdx + 1];

            const renderMove = (m, idx) => {
                if (!m) return '';
                const mastery = m.mastery || 'learning';
                const config = MASTERY_CONFIG[mastery] || MASTERY_CONFIG.learning;
                const isCurrent = (lIdx === currentLandmarkIdx && idx === currentMoveIdx);
                const hintTooltip = m.hint ? `title="${m.hint}"` : '';
                return `
                    <div id="m-${lIdx}-${idx}" class="text-[11px] px-2 py-1.5 rounded transition-all flex items-center justify-between gap-2 group ${isCurrent ? 'move-active' : 'hover:bg-slate-900/30'}">
                        <span class="truncate flex-1 py-0.5 font-bold ${config.textColor}" data-lidx="${lIdx}" data-midx="${idx}" ${hintTooltip}>
                            ${m.name}
                        </span>
                        <button class="shrink-0 text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border ${config.badgeColor} hover:brightness-125 active:scale-95 transition-all" data-action="cycle" data-lidx="${lIdx}" data-midx="${idx}">
                            ${config.text}
                        </button>
                    </div>
                `;
            };

            movesHtml += `
                <div class="border border-slate-800/80 rounded-lg p-0.5 mb-2 bg-slate-900/40 space-y-0.5">
                    ${renderMove(m1, mIdx)}
                    ${renderMove(m2, mIdx + 1)}
                </div>
            `;
        }

        section.innerHTML = `
            <div class="flex items-start justify-between mb-2">
                <div class="cursor-pointer group-hover/lm:brightness-125 flex-1" data-action="select" data-lidx="${lIdx}" data-midx="0">
                    <div class="text-[9px] font-black uppercase tracking-wider mb-1">${lIdx === currentLandmarkIdx ? '👉 Current ' : ''}Landmark ${lIdx + 1}</div>
                    <div class="text-xs font-bold text-slate-200 pr-2 flex flex-col gap-1">
                        <span class="truncate max-w-[180px]">${lm.title}</span>
                        <span class="self-start text-[9px] font-mono px-1.5 py-0.5 rounded ${
                            masteryPct >= 75 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
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
    updateMoveDisplay();
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
    
    let filtered = getFilteredLandmarkIndices();
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

function saveMasteryState() {
    const state = {};
    LANDMARKS.forEach((lm) => {
        state[lm.title] = lm.moves.map(m => m.mastery);
    });
    localStorage.setItem('bachata_mastery_state', JSON.stringify(state));
}

function loadMasteryState() {
    const saved = localStorage.getItem('bachata_mastery_state');
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
    
    const filtered = getFilteredLandmarkIndices();
    const startLIdx = filtered.length > 0 ? filtered[0] : 0;
    currentLandmarkIdx = startLIdx;

    schedBeatIdx = 0;
    schedMoveIdx = 0;
    schedLandmarkIdx = startLIdx;
    beatsQueue = [];

    updateHUD();
    renderSidebar();
    updateMoveDisplay();
    startScheduler();
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
    updateMoveDisplay();
    if (!isPaused) startScheduler();
};

document.getElementById('modeToggle').onclick = () => {
    isRandomMode = !isRandomMode;
    document.getElementById('modeBadge').textContent = isRandomMode ? "Random" : "Sequential";
    document.getElementById('modeName').textContent = isRandomMode ? "Randomized Landmark Drills" : "Linear Sequence Training";
    document.getElementById('modeToggle').textContent = isRandomMode ? "Switch to Linear" : "Randomize Chunks";
};

document.getElementById('bpmSlider').oninput = (e) => {
    document.getElementById('bpmValue').textContent = e.target.value + ' BPM';
    if (!isPaused) startScheduler();
};

// Reset Mastery Stats Handler
const resetMasteryBtn = document.getElementById('resetMasteryBtn');
if (resetMasteryBtn) {
    resetMasteryBtn.onclick = () => {
        if (confirm("Reset all mastery levels back to default hardcoded values?")) {
            localStorage.removeItem('bachata_mastery_state');
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
        viewDiffBtn.className = "px-3 py-1.5 text-xs font-bold rounded-lg bg-blue-600 text-white shadow transition";
        viewFullCodeBtn.className = "px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-750 hover:text-white transition";
        diffContent.classList.remove('hidden');
        codeContent.classList.add('hidden');
    };
    
    viewFullCodeBtn.onclick = () => {
        viewFullCodeBtn.className = "px-3 py-1.5 text-xs font-bold rounded-lg bg-blue-600 text-white shadow transition";
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
    updateMoveDisplay();
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
                const filtered = getFilteredLandmarkIndices();
                const currentPos = filtered.indexOf(lIdx);
                if (currentPos > 0) {
                    const prevLIdx = filtered[currentPos - 1];
                    const prevEl = document.getElementById(`lm-section-${prevLIdx}`);
                    if (prevEl) prevEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            } else if (scrollNext) {
                e.stopPropagation();
                const lIdx = parseInt(scrollNext.dataset.lidx, 10);
                const filtered = getFilteredLandmarkIndices();
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
