// Thunder Loop - Web Audio API Procedural Chiptune & Sound Effects Engine
// Completely self-contained: No external audio files or network requests needed.

class SoundEngine {
    constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.sfxGain = null;
        this.musicGain = null;
        this.musicMuted = false;
        this.sfxMuted = false;
        this.masterVolume = 0.7;
        this.sfxVolume = 0.8;
        this.musicVolume = 0.5;

        // Music playback state
        this.currentTrack = null;
        this.musicTimer = null;
        this.musicStep = 0;
        this.musicBpm = 130;
        this.isBossPhase3 = false;
        this.noiseBuffer = null;
        this.laserNode = null;
    }

    init() {
        if (this.ctx) {
            if (this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
            return;
        }

        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;

        this.ctx = new AudioContextClass();

        // Master and bus gains
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
        this.sfxGain.connect(this.masterGain);

        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
        this.musicGain.connect(this.masterGain);

        this.createNoiseBuffer();
    }

    createNoiseBuffer() {
        if (!this.ctx) return;
        const bufferSize = this.ctx.sampleRate * 2; // 2 seconds of noise
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        this.noiseBuffer = buffer;
    }

    resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    setVolumes(master, sfx, music) {
        this.masterVolume = master;
        this.sfxVolume = sfx;
        this.musicVolume = music;
        if (this.masterGain && this.ctx) {
            this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
        }
        if (this.sfxGain && this.ctx) {
            this.sfxGain.gain.setValueAtTime(this.sfxMuted ? 0 : this.sfxVolume, this.ctx.currentTime);
        }
        if (this.musicGain && this.ctx) {
            this.musicGain.gain.setValueAtTime(this.musicMuted ? 0 : this.musicVolume, this.ctx.currentTime);
        }
    }

    toggleMute() {
        this.musicMuted = !this.musicMuted;
        this.sfxMuted = this.musicMuted;
        this.setVolumes(this.masterVolume, this.sfxVolume, this.musicVolume);
        return this.musicMuted;
    }

    // --- SFX GENERATORS ---

    // 1. Vulcan Cannon (Crisp pulse attack)
    playVulcan() {
        if (!this.ctx || this.sfxMuted) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.06);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.06);
    }

    // 2. Piercing Laser (High resonant sweep with zap)
    playLaser() {
        if (!this.ctx || this.sfxMuted) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.linearRampToValueAtTime(320, now + 0.12);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.12);
    }

    // 3. Homing Missile Launch (Whoosh + rocket thrust)
    playMissile() {
        if (!this.ctx || this.sfxMuted) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(740, now + 0.15);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.15);
    }

    // 4. Enemy Hit (Clink)
    playEnemyHit() {
        if (!this.ctx || this.sfxMuted) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1400, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.03);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.03);
    }

    // 5. Explosions (Small, Medium, Heavy Boss)
    playExplosion(type = 'small') {
        if (!this.ctx || this.sfxMuted || !this.noiseBuffer) return;
        const now = this.ctx.currentTime;
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.noiseBuffer;

        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        let duration = 0.25;
        let startFreq = 800;
        let endFreq = 60;
        let startGain = 0.3;

        if (type === 'medium') {
            duration = 0.45;
            startFreq = 600;
            endFreq = 40;
            startGain = 0.45;
        } else if (type === 'boss' || type === 'heavy') {
            duration = 0.85;
            startFreq = 450;
            endFreq = 20;
            startGain = 0.65;
        }

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(startFreq, now);
        filter.frequency.exponentialRampToValueAtTime(endFreq, now + duration);

        gain.gain.setValueAtTime(startGain, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);

        // Add low thud sub-oscillator for heavy/boss explosion
        if (type === 'medium' || type === 'boss' || type === 'heavy') {
            const sub = this.ctx.createOscillator();
            const subGain = this.ctx.createGain();
            sub.type = 'sine';
            sub.frequency.setValueAtTime(type === 'boss' ? 120 : 160, now);
            sub.frequency.exponentialRampToValueAtTime(30, now + duration);

            subGain.gain.setValueAtTime(0.5, now);
            subGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

            sub.connect(subGain);
            subGain.connect(this.sfxGain);
            sub.start(now);
            sub.stop(now + duration);
        }

        noise.start(now);
        noise.stop(now + duration);
    }

    // 6. Gold Medal Pickup Chime (Ascends in pitch with unbroken streak)
    playMedalChime(streakIndex = 0) {
        if (!this.ctx || this.sfxMuted) return;
        const now = this.ctx.currentTime;
        // Pentatonic / high crystalline scale steps
        const scale = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50, 1174.66, 1318.51, 1567.98];
        const baseFreq = scale[Math.min(streakIndex, scale.length - 1)];

        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(baseFreq, now);

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(baseFreq * 2, now);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.sfxGain);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.28);
        osc2.stop(now + 0.28);
    }

    // 7. Powerup Upgrade Pickup
    playPowerup() {
        if (!this.ctx || this.sfxMuted) return;
        const now = this.ctx.currentTime;
        const notes = [440, 554.37, 659.25, 880];
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const noteStart = now + idx * 0.05;

            osc.type = 'square';
            osc.frequency.setValueAtTime(freq, noteStart);

            gain.gain.setValueAtTime(0.18, noteStart);
            gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.08);

            osc.connect(gain);
            gain.connect(this.sfxGain);

            osc.start(noteStart);
            osc.stop(noteStart + 0.08);
        });
    }

    // 8. Super Bomb Blast (Realistic Thermobaric Shockwave & Seismic Detonation)
    playBomb() {
        if (!this.ctx || this.sfxMuted || !this.noiseBuffer) return;
        const now = this.ctx.currentTime;

        // 1. Initial Supersonic Shockwave Crack / Slap
        const crack = this.ctx.createBufferSource();
        crack.buffer = this.noiseBuffer;
        const crackFilter = this.ctx.createBiquadFilter();
        const crackGain = this.ctx.createGain();

        crackFilter.type = 'bandpass';
        crackFilter.frequency.setValueAtTime(2400, now);
        crackFilter.frequency.exponentialRampToValueAtTime(350, now + 0.08);
        crackFilter.Q.setValueAtTime(2.5, now);

        crackGain.gain.setValueAtTime(0.8, now);
        crackGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        crack.connect(crackFilter);
        crackFilter.connect(crackGain);
        crackGain.connect(this.sfxGain);
        crack.start(now);
        crack.stop(now + 0.12);

        // 2. High-Energy EMP Pulse Sweep
        const emp = this.ctx.createOscillator();
        const empGain = this.ctx.createGain();
        emp.type = 'sawtooth';
        emp.frequency.setValueAtTime(1400, now);
        emp.frequency.exponentialRampToValueAtTime(120, now + 0.25);

        empGain.gain.setValueAtTime(0.35, now);
        empGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

        emp.connect(empGain);
        empGain.connect(this.sfxGain);
        emp.start(now);
        emp.stop(now + 0.28);

        // 3. Heavy Sub-Bass Seismic Boom (Dual Detuned Low Sine Oscillators)
        [42, 38].forEach((baseFreq) => {
            const sub = this.ctx.createOscillator();
            const subGain = this.ctx.createGain();
            sub.type = 'sine';
            sub.frequency.setValueAtTime(130, now + 0.02);
            sub.frequency.exponentialRampToValueAtTime(baseFreq, now + 0.4);
            sub.frequency.linearRampToValueAtTime(18, now + 1.8);

            subGain.gain.setValueAtTime(0.85, now + 0.02);
            subGain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);

            sub.connect(subGain);
            subGain.connect(this.sfxGain);
            sub.start(now + 0.02);
            sub.stop(now + 2.0);
        });

        // 4. Rolling Volumetric Fireball Thunder Noise (Cascading low-pass rumble)
        const rumble = this.ctx.createBufferSource();
        rumble.buffer = this.noiseBuffer;
        const rumbleFilter = this.ctx.createBiquadFilter();
        const rumbleGain = this.ctx.createGain();

        rumbleFilter.type = 'lowpass';
        rumbleFilter.frequency.setValueAtTime(800, now + 0.05);
        rumbleFilter.frequency.exponentialRampToValueAtTime(45, now + 2.4);

        rumbleGain.gain.setValueAtTime(0.9, now + 0.05);
        rumbleGain.gain.linearRampToValueAtTime(0.4, now + 0.8);
        rumbleGain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

        rumble.connect(rumbleFilter);
        rumbleFilter.connect(rumbleGain);
        rumbleGain.connect(this.sfxGain);

        rumble.start(now + 0.05);
        rumble.stop(now + 2.5);
    }

    // 9. Boss Warning Siren (Oscillating klaxon)
    playWarningSiren() {
        if (!this.ctx || this.sfxMuted) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        for (let i = 0; i < 3; i++) {
            const t = now + i * 0.4;
            osc.frequency.setValueAtTime(450, t);
            osc.frequency.linearRampToValueAtTime(800, t + 0.2);
            osc.frequency.linearRampToValueAtTime(450, t + 0.4);
        }

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.linearRampToValueAtTime(0.25, now + 1.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.25);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 1.25);
    }

    // 10. Player Death (Crunch drop)
    playPlayerDeath() {
        if (!this.ctx || this.sfxMuted) return;
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(500, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.6);

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + 0.6);

        this.playExplosion('heavy');
    }

    // 11. Enemy Bullet Fired
    playEnemyShot() {
        if (!this.ctx || this.sfxMuted) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(420, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.05);

        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + 0.05);
    }

    // 12. 1UP Extra Life Fanfare
    playExtraLife() {
        if (!this.ctx || this.sfxMuted) return;
        const now = this.ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
        notes.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const t = now + i * 0.06;
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, t);
            gain.gain.setValueAtTime(0.25, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
            osc.connect(gain);
            gain.connect(this.sfxGain);
            osc.start(t);
            osc.stop(t + 0.12);
        });
    }

    // --- PROCEDURAL CHIPTUNE MUSIC SYSTEM ---
    // Generates pulse wave melodies, bass, arpeggios, and rhythmic noise drums per stage

    startStageMusic(stageNumber) {
        this.stopMusic();
        this.currentTrack = stageNumber;
        this.musicStep = 0;
        this.isBossPhase3 = false;
        this.musicBpm = 136 + (stageNumber % 4) * 4;
        this.scheduleMusicTick();
    }

    startBossMusic() {
        this.stopMusic();
        this.currentTrack = 'boss';
        this.musicStep = 0;
        this.isBossPhase3 = false;
        this.musicBpm = 144;
        this.scheduleMusicTick();
    }

    setBossDesperation(isPhase3) {
        this.isBossPhase3 = isPhase3;
        if (isPhase3 && this.currentTrack === 'boss') {
            this.musicBpm = 168; // Intense tempo shift!
        }
    }

    stopMusic() {
        if (this.musicTimer) {
            clearTimeout(this.musicTimer);
            this.musicTimer = null;
        }
        this.currentTrack = null;
    }

    scheduleMusicTick() {
        if (!this.currentTrack || !this.ctx) return;

        const stepDuration = (60 / this.musicBpm) / 4; // 16th note in seconds
        this.playMusicStep(this.musicStep, this.currentTrack);
        this.musicStep = (this.musicStep + 1) % 64; // 4-bar loop

        this.musicTimer = setTimeout(() => {
            this.scheduleMusicTick();
        }, stepDuration * 1000);
    }

    playMusicStep(step, track) {
        if (this.musicMuted || !this.ctx) return;
        const now = this.ctx.currentTime;

        // Stage-specific musical scales & progressions
        // Base roots: Stage 1 (A minor), Stage 2 (D minor), Stage 3 (F minor), Stage 4 (E minor)...
        const rootFreqs = {
            1: 220.00, // A3
            2: 146.83, // D3
            3: 174.61, // F3
            4: 164.81, // E3
            5: 130.81, // C3
            6: 196.00, // G3
            7: 246.94, // B3
            8: 220.00, // A3
            'boss': 164.81 // E3 (High tension)
        };

        const root = rootFreqs[track] || 220.00;

        // Bassline (Step pattern on beats 0, 3, 6, 8, 10, 12, 14)
        if (step % 2 === 0) {
            const bassOffsets = [1, 1, 1.2, 1, 1.334, 1.2, 1.5, 1.2];
            const octaveFactor = (step >= 32 && track === 'boss') ? 0.75 : 0.5;
            const bassFreq = root * octaveFactor * bassOffsets[(Math.floor(step / 2)) % bassOffsets.length];

            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = track === 'boss' ? 'sawtooth' : 'triangle';
            osc.frequency.setValueAtTime(bassFreq, now);

            gain.gain.setValueAtTime(0.18, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

            osc.connect(gain);
            gain.connect(this.musicGain);
            osc.start(now);
            osc.stop(now + 0.1);
        }

        // Drums (Synthesized snare and kick)
        if (step % 4 === 0) {
            // Kick drum on 0, 4, 8, 12...
            const kickOsc = this.ctx.createOscillator();
            const kickGain = this.ctx.createGain();
            kickOsc.type = 'sine';
            kickOsc.frequency.setValueAtTime(140, now);
            kickOsc.frequency.exponentialRampToValueAtTime(35, now + 0.08);

            kickGain.gain.setValueAtTime(0.25, now);
            kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

            kickOsc.connect(kickGain);
            kickGain.connect(this.musicGain);
            kickOsc.start(now);
            kickOsc.stop(now + 0.08);
        } else if (step % 8 === 4 && this.noiseBuffer) {
            // Snare on 4, 12, 20...
            const snare = this.ctx.createBufferSource();
            snare.buffer = this.noiseBuffer;
            const snareFilter = this.ctx.createBiquadFilter();
            const snareGain = this.ctx.createGain();

            snareFilter.type = 'highpass';
            snareFilter.frequency.setValueAtTime(1000, now);

            snareGain.gain.setValueAtTime(0.18, now);
            snareGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

            snare.connect(snareFilter);
            snareFilter.connect(snareGain);
            snareGain.connect(this.musicGain);
            snare.start(now);
            snare.stop(now + 0.12);
        }

        // Melody / Lead Arpeggio
        const melNotes = [1, 1.2, 1.334, 1.5, 1.667, 1.5, 1.334, 1.2];
        if (step % 2 === 1 || this.isBossPhase3) {
            const noteMult = melNotes[(step + (track === 'boss' ? 2 : 0)) % melNotes.length];
            const leadFreq = root * (this.isBossPhase3 ? 2.5 : 2) * noteMult;

            const leadOsc = this.ctx.createOscillator();
            const leadGain = this.ctx.createGain();
            leadOsc.type = 'square';
            leadOsc.frequency.setValueAtTime(leadFreq, now);

            leadGain.gain.setValueAtTime(this.isBossPhase3 ? 0.12 : 0.08, now);
            leadGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

            leadOsc.connect(leadGain);
            leadGain.connect(this.musicGain);
            leadOsc.start(now);
            leadOsc.stop(now + 0.09);
        }
    }
}

// Global audio engine instance
window.audio = new SoundEngine();
