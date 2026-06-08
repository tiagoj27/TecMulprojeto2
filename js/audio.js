var AudioJogo = (function() {
    var ctx = null;
    var master = null;
    var musicGain = null;
    var sfxGain = null;
    var musicTimer = null;
    var started = false;
    var muted = false;

    var notas = {
        C4: 261.63, D4: 293.66, E4: 329.63, G4: 392.00, A4: 440.00,
        C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99
    };

    function getCtx() {
        if (ctx) return ctx;
        var AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return null;
        ctx = new AudioCtx();
        master = ctx.createGain();
        musicGain = ctx.createGain();
        sfxGain = ctx.createGain();
        master.gain.value = muted ? 0 : 0.75;
        musicGain.gain.value = 0.18;
        sfxGain.gain.value = 0.55;
        musicGain.connect(master);
        sfxGain.connect(master);
        master.connect(ctx.destination);
        return ctx;
    }

    function ensure() {
        var c = getCtx();
        if (!c) return null;
        if (c.state === 'suspended') c.resume();
        return c;
    }

    function envGain(dest, start, attack, decay, peak, end) {
        var c = ensure();
        if (!c) return null;
        var g = c.createGain();
        g.gain.setValueAtTime(0.0001, start);
        g.gain.exponentialRampToValueAtTime(Math.max(0.0001, peak), start + attack);
        g.gain.exponentialRampToValueAtTime(0.0001, start + attack + decay);
        g.connect(dest || sfxGain);
        setTimeout(function() { try { g.disconnect(); } catch (e) {} }, Math.ceil((end - c.currentTime + 0.2) * 1000));
        return g;
    }

    function tone(freq, dur, opts) {
        var c = ensure();
        if (!c) return;
        opts = opts || {};
        var start = c.currentTime + (opts.delay || 0);
        var osc = c.createOscillator();
        var gain = envGain(opts.dest || sfxGain, start, opts.attack || 0.01, opts.decay || dur, opts.volume || 0.28, start + dur);
        if (!gain) return;
        osc.type = opts.type || 'sine';
        osc.frequency.setValueAtTime(freq, start);
        if (opts.to) osc.frequency.exponentialRampToValueAtTime(opts.to, start + dur);
        osc.connect(gain);
        osc.start(start);
        osc.stop(start + dur + 0.03);
    }

    function noise(dur, opts) {
        var c = ensure();
        if (!c) return;
        opts = opts || {};
        var size = Math.max(1, Math.floor(c.sampleRate * dur));
        var buffer = c.createBuffer(1, size, c.sampleRate);
        var data = buffer.getChannelData(0);
        for (var i = 0; i < size; i++) data[i] = Math.random() * 2 - 1;
        var src = c.createBufferSource();
        var filter = c.createBiquadFilter();
        filter.type = opts.filter || 'bandpass';
        filter.frequency.value = opts.freq || 700;
        filter.Q.value = opts.q || 0.8;
        var start = c.currentTime + (opts.delay || 0);
        var gain = envGain(sfxGain, start, opts.attack || 0.005, opts.decay || dur, opts.volume || 0.18, start + dur);
        if (!gain) return;
        src.buffer = buffer;
        src.connect(filter);
        filter.connect(gain);
        src.start(start);
        src.stop(start + dur);
    }

    function arpeggio(seq, step, volume, type) {
        for (var i = 0; i < seq.length; i++) {
            tone(seq[i], 0.12, { delay: i * step, volume: volume || 0.18, type: type || 'triangle' });
        }
    }

    function startMusic() {
        var c = ensure();
        if (!c || musicTimer) return;
        var melodia = [notas.C5, notas.E5, notas.G5, notas.E5, notas.D5, notas.G4, notas.A4, notas.C5];
        var baixo = [notas.C4, notas.C4, notas.G4, notas.G4, notas.A4, notas.A4, notas.G4, notas.G4];
        var passo = 0;

        function beat() {
            if (!ctx || muted) {
                musicTimer = setTimeout(beat, 260);
                return;
            }
            var m = melodia[passo % melodia.length];
            var b = baixo[passo % baixo.length];
            tone(m, 0.22, { type: 'triangle', volume: 0.08, dest: musicGain });
            if (passo % 2 === 0) tone(b, 0.32, { type: 'sine', volume: 0.06, dest: musicGain });
            if (passo % 8 === 7) tone(notas.E5, 0.14, { delay: 0.13, type: 'triangle', volume: 0.055, dest: musicGain });
            passo++;
            musicTimer = setTimeout(beat, 360);
        }
        beat();
    }

    function sfx(nome) {
        if (muted) return;
        ensure();
        if (nome === 'click') return tone(620, 0.05, { to: 460, type: 'square', volume: 0.08 });
        if (nome === 'start') return arpeggio([notas.C4, notas.E4, notas.G4, notas.C5], 0.055, 0.16);
        if (nome === 'move') return tone(130, 0.045, { to: 95, type: 'sawtooth', volume: 0.045 });
        if (nome === 'plant') return arpeggio([220, 330, 440], 0.035, 0.12, 'triangle');
        if (nome === 'harvest') return arpeggio([523.25, 659.25, 783.99, 1046.5], 0.045, 0.16, 'triangle');
        if (nome === 'water') { noise(0.18, { freq: 1450, q: 2.2, volume: 0.12 }); return tone(760, 0.09, { to: 520, type: 'sine', volume: 0.08 }); }
        if (nome === 'fertilizer') return arpeggio([392, 523.25, 659.25], 0.04, 0.12);
        if (nome === 'buy') return arpeggio([392, 493.88, 659.25], 0.055, 0.15);
        if (nome === 'error') return tone(160, 0.16, { to: 95, type: 'sawtooth', volume: 0.12 });
        if (nome === 'day') return arpeggio([261.63, 392, 523.25, 659.25], 0.075, 0.13);
        if (nome === 'transition') return arpeggio([293.66, 440, 587.33], 0.055, 0.12);
        if (nome === 'animal') return arpeggio([349.23, 392, 523.25], 0.04, 0.12);
    }

    function start() {
        if (started) return;
        started = true;
        ensure();
        startMusic();
    }

    function bindUnlock() {
        var unlock = function() {
            start();
            window.removeEventListener('pointerdown', unlock);
            window.removeEventListener('keydown', unlock);
        };
        window.addEventListener('pointerdown', unlock);
        window.addEventListener('keydown', unlock);
    }

    return {
        bindUnlock: bindUnlock,
        start: start,
        sfx: sfx,
        setMuted: function(v) {
            muted = !!v;
            if (master) master.gain.value = muted ? 0 : 0.75;
        },
        toggleMuted: function() {
            this.setMuted(!muted);
            return muted;
        }
    };
})();
