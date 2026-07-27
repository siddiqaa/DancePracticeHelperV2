/**
 * tts_announcer.js
 * Modular Web Text-to-Speech (TTS) manager for announcing dance practice chunks.
 * Handles Web Speech API synthesis, voice selection, state persistence, and UI integration.
 */

class ChunkTTSAnnouncer {
    constructor() {
        this.storageKey = 'dance_tts_enabled';
        // Default to true if not explicitly disabled in localStorage
        const savedState = localStorage.getItem(this.storageKey);
        this.enabled = savedState === null ? true : savedState === 'true';

        this.synth = (typeof window !== 'undefined' && 'speechSynthesis' in window) ? window.speechSynthesis : null;
        this.lastAnnouncedChunk = null;
        this.lastAnnouncedTime = 0;
        this.preferredVoice = null;
        this.rate = 1.0;
        this.pitch = 1.0;
        this.volume = 0.5;
        this.uiButton = null;

        if (this.synth) {
            if (typeof this.synth.onvoiceschanged !== 'undefined') {
                this.synth.onvoiceschanged = () => this.selectBestVoice();
            }
            this.selectBestVoice();
        }
    }

    selectBestVoice() {
        if (!this.synth) return;
        try {
            const voices = this.synth.getVoices();
            if (!voices || voices.length === 0) return;

            // Prefer high-quality English voices
            const englishVoices = voices.filter(v => v.lang && v.lang.startsWith('en'));
            const preferredKeywords = ['Google', 'Samantha', 'Alex', 'Daniel', 'Karen', 'Victoria', 'Natural', 'Enhanced', 'en-US', 'en-GB'];
            
            for (const keyword of preferredKeywords) {
                const found = englishVoices.find(v => v.name && v.name.includes(keyword));
                if (found) {
                    this.preferredVoice = found;
                    return;
                }
            }

            if (englishVoices.length > 0) {
                this.preferredVoice = englishVoices[0];
            } else {
                this.preferredVoice = voices[0];
            }
        } catch (e) {
            console.warn('TTS voice selection warning:', e);
        }
    }

    isEnabled() {
        return this.enabled && !!this.synth;
    }

    setEnabled(value) {
        this.enabled = !!value;
        try {
            localStorage.setItem(this.storageKey, this.enabled ? 'true' : 'false');
        } catch (e) {
            console.warn('Failed to save TTS preference to localStorage:', e);
        }
        if (!this.enabled) {
            this.cancel();
        }
        this.updateUI();
        return this.enabled;
    }

    toggle() {
        const newState = !this.enabled;
        this.setEnabled(newState);
        if (newState) {
            if (window.DanceAudio) {
                window.DanceAudio.init();
                window.DanceAudio.playChime(window.DanceAudio.getCurrentTime());
            }
        }
        return newState;
    }

    cancel() {
        if (this.synth) {
            try {
                this.synth.cancel();
            } catch (e) {
                console.warn('TTS cancel error:', e);
            }
        }
    }

    speak(text, force = false) {
        if (!this.synth) return;
        if (!this.enabled && !force) return;

        try {
            // Cancel existing utterance to prevent speech backlog
            this.synth.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = this.rate;
            utterance.pitch = this.pitch;
            utterance.volume = this.volume;

            if (this.preferredVoice) {
                utterance.voice = this.preferredVoice;
            }

            this.synth.speak(utterance);
        } catch (err) {
            console.error('Web Speech API speak error:', err);
        }
    }

    /**
     * Announces a chunk title using Web Text to Speech.
     * @param {string} chunkTitle - The title of the chunk to announce.
     * @param {boolean} force - Force play regardless of recent duplication filter.
     */
    announceChunk(chunkTitle, force = false) {
        if (!chunkTitle || typeof chunkTitle !== 'string') return;
        if (!this.enabled) return;

        const cleanTitle = chunkTitle.trim();
        const now = Date.now();

        // Avoid repeating the exact same announcement within 2 seconds unless forced
        if (!force && this.lastAnnouncedChunk === cleanTitle && (now - this.lastAnnouncedTime) < 2000) {
            return;
        }

        this.lastAnnouncedChunk = cleanTitle;
        this.lastAnnouncedTime = now;

        // Clean title for spoken output (strip emojis or technical punctuation)
        const textToSpeak = cleanTitle
            .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
            .trim();

        if (!textToSpeak) return;

        this.speak(textToSpeak);
    }

    /**
     * Attaches a DOM element (e.g., button) as the toggle control.
     * @param {HTMLElement|string} elementOrId 
     */
    initUI(elementOrId) {
        const el = typeof elementOrId === 'string' ? document.getElementById(elementOrId) : elementOrId;
        if (!el) return;

        this.uiButton = el;
        el.onclick = (e) => {
            e.preventDefault();
            this.toggle();
        };

        this.updateUI();
    }

    updateUI() {
        if (!this.uiButton) return;

        const isON = this.isEnabled();
        this.uiButton.setAttribute('title', isON ? 'Disable chunk voice announcements' : 'Enable chunk voice announcements');
        this.uiButton.setAttribute('aria-label', isON ? 'Disable chunk voice' : 'Enable chunk voice');

        if (isON) {
            this.uiButton.className = 'px-3 py-1.5 rounded-xl border-2 border-stone-900 transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#1c1917] active:scale-[0.98] bg-[#ffde59] text-stone-950 hover:bg-[#ffe885]';
            this.uiButton.innerHTML = `
                <svg class="w-4 h-4 text-stone-950 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>
                </svg>
                <span class="text-[10px] font-black uppercase tracking-wider">Voice ON</span>
            `;
        } else {
            this.uiButton.className = 'px-3 py-1.5 rounded-xl border-2 border-stone-900 transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#1c1917] active:scale-[0.98] bg-[#faedcd] text-stone-800 hover:bg-[#f4f1de]';
            this.uiButton.innerHTML = `
                <svg class="w-4 h-4 text-stone-800 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path>
                </svg>
                <span class="text-[10px] font-black uppercase tracking-wider">Voice OFF</span>
            `;
        }
    }
}

// Global instance
window.ChunkSpeech = new ChunkTTSAnnouncer();
