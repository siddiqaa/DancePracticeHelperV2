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

let currentLandmarkIdx = 0;
let lastLandmarkIdx = -1;
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
const overlayContent = document.getElementById('overlayContent');
const countdownDisplay = document.getElementById('countdownDisplay');

function initAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
}

function playBeat(num) {
    if (!audioCtx || isPaused) return;
    const isEven = (num + 1) % 2 === 0;

    const currentMove = LANDMARKS[currentLandmarkIdx].moves[currentMoveIdx];
    const isAnchorBeat = anchorAccentEnabled && (num >= currentMove.beats - 2);

    if (isAnchorBeat) {
        // High-pitched woodblock/bell accent for Anchor (beats 5-6 or 7-8)
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(987.77, audioCtx.currentTime); // Crisp B5 pitch chime
        osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.08);

        gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.08);
    }

    if (isEven) {
        // Snare Sound (Even Beats)
        const bufferSize = audioCtx.sampleRate * 0.1;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) { data[i] = Math.random() * 2 - 1; }

        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;
        const noiseFilter = audioCtx.createBiquadFilter();
        noiseFilter.type = 'highpass';
        noiseFilter.frequency.value = 1000;

        const noiseGain = audioCtx.createGain();
        noiseGain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(audioCtx.destination);
        noise.start();
    } else {
        // Kick Sound (Odd Beats)
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(120, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.1);

        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
    }
}

function triggerRandomCountdown() {
    isPaused = true;
    clearInterval(intervalId);

    lastLandmarkIdx = currentLandmarkIdx;
    let nextIdx;
    do {
        nextIdx = Math.floor(Math.random() * LANDMARKS.length);
    } while (nextIdx === lastLandmarkIdx && LANDMARKS.length > 1);

    currentLandmarkIdx = nextIdx;
    currentMoveIdx = 0;
    beatIdx = 0;

    updateHUD();
    renderSidebar();
    updateMoveDisplay();

    startOverlay.classList.remove('hidden');
    overlayContent.classList.add('hidden');
    countdownDisplay.classList.remove('hidden');

    const lm = LANDMARKS[currentLandmarkIdx];
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
            startTimer();
        }
    }, 1000);
}

function handleTick() {
    if (isPaused) return;

    const currentMove = LANDMARKS[currentLandmarkIdx].moves[currentMoveIdx];
    const dots = dotContainer.querySelectorAll('.beat-dot');

    // 1. Audio and Visual Feedback for the CURRENT beat
    playBeat(beatIdx);

    dots.forEach((d, i) => {
        if (i === beatIdx) {
            d.style.backgroundColor = LANDMARKS[currentLandmarkIdx].color;
            d.style.borderColor = LANDMARKS[currentLandmarkIdx].color;
            d.style.transform = 'scale(1.35)';
            d.style.opacity = '1';
            d.style.boxShadow = `0 0 15px ${LANDMARKS[currentLandmarkIdx].color}`;
        } else {
            d.style.backgroundColor = '#1e293b'; // slate-800
            d.style.borderColor = '#334155'; // slate-700
            d.style.transform = 'scale(1)';
            d.style.opacity = '0.4';
            d.style.boxShadow = 'none';
        }
    });

    // 2. Prep for Next Beat
    beatIdx++;

    // 3. Move/Landmark Transition logic
    if (beatIdx >= currentMove.beats) {
        beatIdx = 0;

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

        // Update dots on next layout cycle to ensure the "last beat" dot visibility is seen
        setTimeout(() => {
            updateMoveDisplay(false);
        }, 50);
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
}

function updateMoveDisplay(shouldRestartInterval = true) {
    const landmark = LANDMARKS[currentLandmarkIdx];
    const move = landmark.moves[currentMoveIdx];

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

    // Update dots
    dotContainer.innerHTML = Array(move.beats).fill(0).map(() =>
        `<div class="beat-dot w-4.5 h-4.5 rounded-full bg-slate-950 border border-slate-850 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.8)]"></div>`
    ).join('');

    // Update Text Displays
    const currentLabelEl = document.getElementById('currentMoveLabel');
    const nextLabelEl = document.getElementById('nextMoveLabel');

    if (currentLabelEl && nextLabelEl) {
        currentLabelEl.innerHTML = `<span class="animate-label ${isPaused ? 'paused-anim' : ''} flex items-center justify-center gap-4">
    <span class="text-purple-400 font-black text-2xl md:text-3xl px-3 py-1 rounded bg-purple-950/40 border border-purple-900/30 flex items-center gap-1">${move.beats}🥁</span>
    <span class="text-3xl md:text-5xl font-black ${masteryColorClass} tracking-tight">${move.name}</span>
</span>`;

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

    if (shouldRestartInterval && !isPaused) startTimer();
}

function startTimer() {
    if (intervalId) clearInterval(intervalId);
    const bpm = parseInt(document.getElementById('speedSlider').value);
    const beatInterval = 60000 / bpm;

    handleTick();
    intervalId = setInterval(handleTick, beatInterval);
}

document.getElementById('bigStartBtn').onclick = () => {
    initAudio();
    startOverlay.classList.add('hidden');
    isPaused = false;
    updateHUD();
    updateMoveDisplay();
};

document.getElementById('modeToggle').onclick = () => {
    isRandomMode = !isRandomMode;
    document.getElementById('modeBadge').textContent = isRandomMode ? "Random" : "Sequential";
    document.getElementById('modeName').textContent = isRandomMode ? "Randomized Landmark Drills" : "Linear Sequence Training";
    document.getElementById('modeToggle').textContent = isRandomMode ? "Switch to Linear" : "Randomize Chunks";
    if (isRandomMode && !isPaused) triggerRandomCountdown();
};

document.getElementById('playPauseBtn').onclick = (e) => {
    isPaused = !isPaused;
    e.target.textContent = isPaused ? "Resume" : "Pause";
    if (isPaused) {
        clearInterval(intervalId);
    } else {
        initAudio();
        startTimer();
    }
    updateMoveDisplay(false);
};

document.getElementById('panicBtn').onclick = () => {
    beatIdx = 0;
    currentMoveIdx = 0;
    updateMoveDisplay();
};

document.getElementById('speedSlider').oninput = (e) => {
    document.getElementById('bpmValue').textContent = e.target.value + ' BPM';
};

document.getElementById('speedSlider').onchange = () => {
    if (!isPaused) startTimer();
};

// Anchor Accent Sound Toggle
const anchorSoundBtn = document.getElementById('anchorSoundBtn');
if (anchorSoundBtn) {
    anchorSoundBtn.onclick = () => {
        anchorAccentEnabled = !anchorAccentEnabled;
        if (anchorAccentEnabled) {
            anchorSoundBtn.innerHTML = `<span id="anchorSoundStatusDot" class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Anchor Accent Sound: ON`;
            anchorSoundBtn.className = "col-span-2 py-3 bg-slate-950 hover:bg-slate-900 text-slate-300 hover:text-white font-bold rounded-xl shadow-md border border-slate-850/60 transition flex items-center justify-center gap-2.5 text-xs uppercase tracking-wider active:scale-[0.98]";
        } else {
            anchorSoundBtn.innerHTML = `<span id="anchorSoundStatusDot" class="w-2 h-2 rounded-full bg-slate-600"></span> Anchor Accent Sound: OFF`;
            anchorSoundBtn.className = "col-span-2 py-3 bg-slate-950/40 hover:bg-slate-950 text-slate-500 hover:text-slate-400 font-bold rounded-xl shadow-md border border-slate-850/40 transition flex items-center justify-center gap-2.5 text-xs uppercase tracking-wider active:scale-[0.98]";
        }
    };
}

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
        viewFullCodeBtn.className = "px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition";
        diffContent.classList.remove('hidden');
        codeContent.classList.add('hidden');
    };
    
    viewFullCodeBtn.onclick = () => {
        viewFullCodeBtn.className = "px-3 py-1.5 text-xs font-bold rounded-lg bg-purple-600 text-white shadow transition";
        viewDiffBtn.className = "px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition";
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
            <div class="p-6 bg-slate-950/45 rounded-xl border border-slate-850 text-slate-400 text-center flex flex-col items-center justify-center gap-2">
                <svg class="w-8 h-8 text-emerald-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p class="font-bold text-slate-300">All progress in sync with code!</p>
                <p class="text-[10px] text-slate-500">Your browser's mastery stats match the defaults in the JavaScript file exactly.</p>
            </div>
        `;
    } else {
        const masteryLabels = {
            learning: { text: "Learning", color: "text-red-400 bg-red-400/10 border-red-400/20" },
            familiar: { text: "Familiar", color: "text-amber-400 bg-amber-400/10 border-amber-400/20" },
            mastered: { text: "Mastered", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" }
        };
        
        changesList.innerHTML = diffs.map(d => {
            const fromLabel = masteryLabels[d.from] || { text: d.from, color: "text-slate-400" };
            const toLabel = masteryLabels[d.to] || { text: d.to, color: "text-slate-400" };
            
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
    loadMasteryState();
    updateMasteryStats();
    updateHUD();
    renderSidebar();
    updateMoveDisplay(false);
};
