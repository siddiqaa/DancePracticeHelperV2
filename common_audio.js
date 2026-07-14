window.DanceAudio = {
    ctx: null,

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    },

    isReady() {
        return this.ctx !== null;
    },

    getCurrentTime() {
        return this.ctx ? this.ctx.currentTime : 0;
    },

    playChime(time) {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(987.77, time); // Crisp B5 pitch chime
        osc.frequency.exponentialRampToValueAtTime(800, time + 0.08);

        gain.gain.setValueAtTime(0.12, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(time);
        osc.stop(time + 0.08);
    },

    playSnare(time) {
        if (!this.ctx) return;
        const bufferSize = this.ctx.sampleRate * 0.1;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) { data[i] = Math.random() * 2 - 1; }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const noiseFilter = this.ctx.createBiquadFilter();
        noiseFilter.type = 'highpass';
        noiseFilter.frequency.value = 1000;

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.08, time);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(this.ctx.destination);
        noise.start(time);
    },

    playKick(time) {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(120, time);
        osc.frequency.exponentialRampToValueAtTime(40, time + 0.1);

        gain.gain.setValueAtTime(0.15, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(time);
        osc.stop(time + 0.1);
    },

    playBasicTone(time, isAccent, volume = 0.1) {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain); 
        gain.connect(this.ctx.destination);
        osc.frequency.value = isAccent ? 880 : 440;
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(volume, time + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
        osc.start(time); 
        osc.stop(time + 0.1);
    },

    // --- Style Specific Configurations ---

    playWCSBeat(time, beatNumber, beatsTotal, anchorAccentEnabled) {
        if (!this.ctx) return;
        
        // In WCS, anchor is typically the last two beats of a move (e.g., 5-6 of a 6-count move)
        const isAnchorBeat = anchorAccentEnabled && (beatNumber >= beatsTotal - 2);
        const isEven = (beatNumber + 1) % 2 === 0;

        if (isAnchorBeat) {
            this.playChime(time);
        }

        if (isEven) {
            this.playSnare(time);
        } else {
            this.playKick(time);
        }
    },

    playBachataBeat(time, beatNumber, anchorAccentEnabled) {
        if (!this.ctx) return;
        
        // Bachata accents the tap on beat 4 (which is index 3)
        const isAccent = (beatNumber === 3);

        if (isAccent && anchorAccentEnabled) {
            this.playChime(time);
            return;
        }

        const volume = isAccent ? 0.1 : 0.4;
        this.playBasicTone(time, isAccent, volume);
    },

    playSalsaBeat(time, beatNumber, anchorAccentEnabled) {
        if (!this.ctx) return;
        
        // Salsa On 1 typically accents the 1 and 5
        // beatNumber is 0-7 for an 8-beat phrase
        const isAccent = (beatNumber === 0 || beatNumber === 4);
        const isPause = (beatNumber === 3 || beatNumber === 7);

        if (isAccent && anchorAccentEnabled) {
            this.playChime(time);
            return;
        }

        if (isPause) {
            // Making the 4 and 8 clearly audible as requested
            this.playBasicTone(time, false, 0.25);
            return;
        }

        const volume = isAccent ? 0.5 : 0.3;
        this.playBasicTone(time, isAccent, volume);
    }
};
