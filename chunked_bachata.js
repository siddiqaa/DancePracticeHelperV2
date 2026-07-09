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
            { name: "My Inside Turn → Closed Position", beats: 4, mastery: "familiar" },
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

let currentLandmarkIdx = 0;
let currentMoveIdx = 0;
let beatIdx = 0;
let isPaused = true;
let isRandomMode = false;
let anchorAccentEnabled = true;
let intervalId = null;
let audioCtx = null;

const display = document.getElementById('displayContainer');
const dotContainer = document.getElementById('dotContainer');
const landmarkList = document.getElementById('landmarkList');
const startOverlay = document.getElementById('startOverlay');

function initAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
}

function playScheduledTone(time, isAccent) {
    if (isAccent && anchorAccentEnabled) {
        // High-pitched woodblock/bell chime for Tap Accent (Beat 4)
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(987.77, time); // Crisp B5 pitch chime
        osc.frequency.exponentialRampToValueAtTime(800, time + 0.08);

        gain.gain.setValueAtTime(0.12, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(time);
        osc.stop(time + 0.08);
        return;
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.frequency.value = isAccent ? 880 : 440;
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.1, time + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
    osc.start(time); osc.stop(time + 0.1);
}

function handleTick() {
    if (isPaused) return;

    // Accent logic (Beat 4 is index 3)
    const isAccent = (beatIdx === 3);
    playScheduledTone(audioCtx.currentTime, isAccent);

    // UI Synchronization
    const dots = dotContainer.querySelectorAll('.beat-dot');
    dots.forEach((d, i) => {
        if (i === beatIdx) {
            d.style.backgroundColor = LANDMARKS[currentLandmarkIdx].color;
            d.style.transform = 'scale(1.4)';
            d.style.opacity = '1';
        } else {
            d.style.backgroundColor = '#e2e8f0';
            d.style.transform = 'scale(1)';
            d.style.opacity = i === 3 ? '0.8' : '0.4';
        }
    });

    beatIdx++;

    if (beatIdx >= 4) {
        beatIdx = 0;
        // Move logic
        if (currentMoveIdx >= LANDMARKS[currentLandmarkIdx].moves.length - 1) {
            if (isRandomMode) {
                triggerRandomCountdown();
                return;
            } else {
                currentLandmarkIdx = (currentLandmarkIdx + 1) % LANDMARKS.length;
                currentMoveIdx = 0;
                updateHUD();
                renderSidebar();
            }
        } else {
            currentMoveIdx++;
        }
        updateMoveDisplay();
    }
}

function triggerRandomCountdown() {
    isPaused = true;
    clearInterval(intervalId);
    const lastIdx = currentLandmarkIdx;
    while (currentLandmarkIdx === lastIdx) {
        currentLandmarkIdx = Math.floor(Math.random() * LANDMARKS.length);
    }
    currentMoveIdx = 0;
    beatIdx = 0;

    startOverlay.classList.remove('hidden');
    document.getElementById('overlayContent').classList.add('hidden');
    const cdDisplay = document.getElementById('countdownDisplay');
    cdDisplay.classList.remove('hidden');

    const lm = LANDMARKS[currentLandmarkIdx];
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
            startTimer();
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
}

function updateMoveDisplay() {
    const landmark = LANDMARKS[currentLandmarkIdx];
    const move = landmark.moves[currentMoveIdx];
    const countLabel = (currentMoveIdx % 2 === 0) ? "1-4" : "5-8";
    
    const mastery = move.mastery || 'learning';
    let masteryColorClass = '';
    if (mastery === 'mastered') {
        masteryColorClass = 'text-emerald-400';
    } else if (mastery === 'familiar') {
        masteryColorClass = 'text-amber-400';
    } else {
        masteryColorClass = 'text-red-400';
    }

    let nextMoveNameHtml = "End of landmark list";

    if (currentMoveIdx < landmark.moves.length - 1) {
        const nextMove = landmark.moves[currentMoveIdx + 1];
        const nextMastery = nextMove.mastery || 'learning';
        let nextMasteryColorClass = '';
        if (nextMastery === 'mastered') {
            nextMasteryColorClass = 'text-emerald-400';
        } else if (nextMastery === 'familiar') {
            nextMasteryColorClass = 'text-amber-400';
        } else {
            nextMasteryColorClass = 'text-red-400';
        }
        nextMoveNameHtml = `<span class="${nextMasteryColorClass} font-bold">${nextMove.name}</span>`;
    }

    // Update Text Displays
    const currentLabelEl = document.getElementById('currentMoveLabel');
    const nextLabelEl = document.getElementById('nextMoveLabel');

    if (currentLabelEl && nextLabelEl) {
        currentLabelEl.innerHTML = `<div class="active-move-animate flex items-center justify-center gap-4">
            <span class="text-blue-400 font-black text-2xl md:text-3xl px-3 py-1 rounded bg-blue-950/40 border border-blue-900/30 flex items-center gap-1 font-mono">${countLabel}</span>
            <span class="text-3xl md:text-5xl font-black ${masteryColorClass} tracking-tight text-center">${move.name}</span>
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
    LANDMARKS.forEach((lm, lIdx) => {
        const section = document.createElement('div');
        section.className = `p-3 rounded-xl transition-all duration-300 ${lIdx === currentLandmarkIdx ? 'landmark-active' : 'opacity-30 hover:opacity-75'}`;
        section.style.color = lm.color;
        
        const movesHtml = lm.moves.map((m, mIdx) => {
            const mastery = m.mastery || 'learning';
            let badgeColor = '';
            let badgeText = '';
            let masteryTextColor = '';
            if (mastery === 'mastered') {
                badgeColor = 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
                badgeText = 'Mastered';
                masteryTextColor = 'text-emerald-400';
            } else if (mastery === 'familiar') {
                badgeColor = 'bg-amber-500/10 border-amber-500/30 text-amber-400';
                badgeText = 'Familiar';
                masteryTextColor = 'text-amber-400';
            } else {
                badgeColor = 'bg-red-500/10 border-red-500/30 text-red-400';
                badgeText = 'Learning';
                masteryTextColor = 'text-red-400';
            }
            
            const isCurrent = (lIdx === currentLandmarkIdx && mIdx === currentMoveIdx);
            
            return `
                <div id="m-${lIdx}-${mIdx}" class="text-[11px] px-2 py-1.5 rounded transition-all flex items-center justify-between gap-2 group ${isCurrent ? 'move-active' : 'hover:bg-slate-900/30'}">
                    <span class="truncate cursor-pointer flex-1 py-0.5 hover:brightness-125 font-bold ${masteryTextColor}" onclick="selectMove(${lIdx}, ${mIdx})">
                        ${m.name} <span class="opacity-60 text-[9px] font-mono">(${m.beats}🥁)</span>
                    </span>
                    <button onclick="cycleMastery(${lIdx}, ${mIdx}, event)" class="shrink-0 text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border ${badgeColor} hover:brightness-125 active:scale-95 transition-all">
                        ${badgeText}
                    </button>
                </div>
            `;
        }).join('');

        section.innerHTML = `
            <div class="text-[9px] font-black uppercase tracking-wider mb-1">${lIdx === currentLandmarkIdx ? '👉 Current ' : ''}Landmark ${lIdx + 1}</div>
            <div class="text-xs font-bold text-slate-200 mb-2 truncate">${lm.title}</div>
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
    renderSidebar();
    updateMasteryStats();
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

function startTimer() {
    if (intervalId) clearInterval(intervalId);
    const bpm = parseInt(document.getElementById('bpmSlider').value);
    const msPerBeat = 60000 / bpm;
    intervalId = setInterval(handleTick, msPerBeat);
}

document.getElementById('bigStartBtn').onclick = () => {
    initAudio();
    startOverlay.classList.add('hidden');
    isPaused = false;
    beatIdx = 0;
    currentMoveIdx = 0;
    updateHUD();
    renderSidebar();
    updateMoveDisplay();
    startTimer();
};

document.getElementById('playPauseBtn').onclick = (e) => {
    isPaused = !isPaused;
    
    // Simple text with appropriate icons if desired, or simple text string
    if (isPaused) {
        e.currentTarget.innerHTML = `
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path></svg>
            Resume
        `;
    } else {
        e.currentTarget.innerHTML = `
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
            Pause
        `;
    }
    
    if (isPaused) clearInterval(intervalId); else startTimer();
};

document.getElementById('panicBtn').onclick = () => {
    clearInterval(intervalId);
    beatIdx = 0;
    currentMoveIdx = 0;
    updateMoveDisplay();
    if (!isPaused) startTimer();
};

document.getElementById('modeToggle').onclick = () => {
    isRandomMode = !isRandomMode;
    document.getElementById('modeBadge').textContent = isRandomMode ? "Random" : "Sequential";
    document.getElementById('modeName').textContent = isRandomMode ? "Randomized Landmark Drills" : "Linear Sequence Training";
    document.getElementById('modeToggle').textContent = isRandomMode ? "Switch to Linear" : "Randomize Chunks";
};

document.getElementById('bpmSlider').oninput = (e) => {
    document.getElementById('bpmValue').textContent = e.target.value + ' BPM';
};

document.getElementById('bpmSlider').onchange = () => { if (!isPaused) startTimer(); };

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
    
    // Find differences
    const diffs = [];
    LANDMARKS.forEach((lm, lIdx) => {
        lm.moves.forEach((m, mIdx) => {
            const currentMastery = m.mastery || 'learning';
            const originalMastery = ORIGINAL_LANDMARKS[lIdx].moves[mIdx].mastery || 'learning';
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
        const masteryLabels = {
            learning: { text: "Learning", color: "text-red-400 bg-red-950/40 border-red-900/30" },
            familiar: { text: "Familiar", color: "text-amber-400 bg-amber-950/40 border-amber-900/30" },
            mastered: { text: "Mastered", color: "text-emerald-400 bg-emerald-950/40 border-emerald-900/30" }
        };
        
        changesList.innerHTML = diffs.map(d => {
            const fromLabel = masteryLabels[d.from] || { text: d.from, color: "text-slate-400 bg-slate-950/40 border-slate-900/30" };
            const toLabel = masteryLabels[d.to] || { text: d.to, color: "text-slate-400 bg-slate-950/40 border-slate-900/30" };
            
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
                        <span class="px-2 py-0.5 rounded border ${fromLabel.color}">${fromLabel.text}</span>
                        <span class="text-slate-500 font-bold">&rarr;</span>
                        <span class="px-2 py-0.5 rounded border ${toLabel.color} font-black">${toLabel.text}</span>
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
    dotContainer.innerHTML = Array(4).fill(0).map((_, i) => `<div class="beat-dot w-5 h-5 rounded-full bg-slate-800 shadow-inner border border-slate-700 ${i === 3 ? 'tap-dot' : ''}"></div>`).join('');
    loadMasteryState();
    updateMasteryStats();
    updateHUD();
    renderSidebar();
    updateMoveDisplay();
};
