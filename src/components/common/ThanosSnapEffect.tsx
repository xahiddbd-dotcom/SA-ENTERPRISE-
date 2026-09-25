import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { RotateCcw, Sparkles } from 'lucide-react';

// Custom event trigger helper
export const triggerThanosSnap = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('saiful-thanos-snap'));
  }
};

export const ThanosSnapEffect: React.FC = () => {
  const { language } = useLanguage();
  const [isSnapped, setIsSnapped] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [countdown, setCountdown] = useState(7);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Synthesize Thanos Snap and Cosmic Wind sound via Web Audio API
  const playSnapAudio = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      // 1. Sharp Snap Click (Transients)
      const snapOsc = ctx.createOscillator();
      const snapGain = ctx.createGain();
      snapOsc.type = 'triangle';
      snapOsc.frequency.setValueAtTime(3200, now);
      snapOsc.frequency.exponentialRampToValueAtTime(150, now + 0.08);
      snapGain.gain.setValueAtTime(0.7, now);
      snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      snapOsc.connect(snapGain);
      snapGain.connect(ctx.destination);
      snapOsc.start(now);
      snapOsc.stop(now + 0.12);

      // 2. Cosmic Thump & Sub Bass
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(160, now + 0.02);
      subOsc.frequency.exponentialRampToValueAtTime(35, now + 0.4);
      subGain.gain.setValueAtTime(0.5, now + 0.02);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      subOsc.connect(subGain);
      subGain.connect(ctx.destination);
      subOsc.start(now + 0.02);
      subOsc.stop(now + 0.5);

      // 3. Cosmic Dust Wind / Ash Disintegration Swoosh (White Noise)
      const bufferSize = ctx.sampleRate * 2.2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(800, now);
      noiseFilter.frequency.exponentialRampToValueAtTime(150, now + 2.0);
      noiseFilter.Q.setValueAtTime(3.0, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.01, now);
      noiseGain.gain.linearRampToValueAtTime(0.35, now + 0.2);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(now + 0.05);
      noise.stop(now + 2.3);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  };

  // Synthesize Time Stone Reversal Chime
  const playTimeStoneAudio = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      // Rewind mystical chime
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq * 0.7, now + i * 0.08);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + i * 0.08 + 0.4);
        gain.gain.setValueAtTime(0.18, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.6);
      });
    } catch (e) {
      // Audio fallback
    }
  };

  // Start Canvas Dust / Ash Particle Dispersion
  const startDustParticles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create 180 dust particles drifting and dissolving
    interface Particle {
      x: number;
      y: number;
      size: number;
      vx: number;
      vy: number;
      alpha: number;
      decay: number;
      color: string;
      rotation: number;
      vRot: number;
    }

    const particles: Particle[] = [];
    const colors = [
      '#a8a29e', // ash stone
      '#78716c', // dark dust
      '#d6d3d1', // light dust
      '#fbbf24', // ember gold
      '#f97316', // orange spark
      '#57534e'  // smoke
    ];

    for (let i = 0; i < 220; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 4 + 1.5,
        vx: (Math.random() - 0.2) * 5 + 1.5, // drift right and disperse
        vy: (Math.random() - 0.6) * 4 - 0.5, // float slightly upward
        alpha: Math.random() * 0.9 + 0.3,
        decay: Math.random() * 0.006 + 0.003,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.08
      });
    }

    let startTime = Date.now();

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const elapsed = Date.now() - startTime;

      let alive = false;
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vRot;
        p.alpha -= p.decay;

        if (p.alpha > 0) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * (1 + Math.sin(p.rotation) * 0.5));
          ctx.restore();
        }
      });

      if (alive && elapsed < 8000) {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    animFrameRef.current = requestAnimationFrame(render);
  };

  // Restore everything back
  const handleRestore = () => {
    setIsRestoring(true);
    playTimeStoneAudio();

    // Remove snap classes from elements
    document.body.classList.remove('thanos-snapped-body');
    const mainEl = document.querySelector('main');
    if (mainEl) {
      mainEl.classList.remove('thanos-disintegrated');
      mainEl.classList.add('thanos-reconstituting');
    }
    const headerEl = document.querySelector('header');
    if (headerEl) {
      headerEl.classList.remove('thanos-disintegrated');
      headerEl.classList.add('thanos-reconstituting');
    }
    const footerEl = document.querySelector('footer');
    if (footerEl) {
      footerEl.classList.remove('thanos-disintegrated');
      footerEl.classList.add('thanos-reconstituting');
    }

    setTimeout(() => {
      setIsSnapped(false);
      setIsRestoring(false);
      if (mainEl) mainEl.classList.remove('thanos-reconstituting');
      if (headerEl) headerEl.classList.remove('thanos-reconstituting');
      if (footerEl) footerEl.classList.remove('thanos-reconstituting');
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    }, 1000);
  };

  // Event listener for Thanos Snap
  useEffect(() => {
    const handleSnap = () => {
      if (isSnapped) return;
      playSnapAudio();
      setIsSnapped(true);
      setIsRestoring(false);
      setCountdown(7);

      // Apply disintegration effect to page
      document.body.classList.add('thanos-snapped-body');
      const mainEl = document.querySelector('main');
      if (mainEl) mainEl.classList.add('thanos-disintegrated');
      const headerEl = document.querySelector('header');
      if (headerEl) headerEl.classList.add('thanos-disintegrated');
      const footerEl = document.querySelector('footer');
      if (footerEl) footerEl.classList.add('thanos-disintegrated');

      // Start dust canvas
      setTimeout(() => {
        startDustParticles();
      }, 50);
    };

    window.addEventListener('saiful-thanos-snap', handleSnap);
    return () => {
      window.removeEventListener('saiful-thanos-snap', handleSnap);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isSnapped]);

  // Countdown timer to automatically restore
  useEffect(() => {
    let timer: any;
    if (isSnapped && !isRestoring && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleRestore();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isSnapped, isRestoring, countdown]);

  if (!isSnapped) return null;

  return (
    <div className="fixed inset-0 z-[99999] pointer-events-none flex flex-col items-center justify-between p-4 sm:p-6 overflow-hidden select-none">
      {/* Dust Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-10 w-full h-full"
      />

      {/* Thanos Flash Overlay */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 z-0 ${
          isRestoring
            ? 'bg-emerald-500/25 animate-pulse'
            : 'bg-gradient-to-b from-amber-950/30 via-stone-950/60 to-black/85 backdrop-blur-[2px]'
        }`}
      />

      {/* Top Banner Notice */}
      <div className="pointer-events-auto relative z-20 mt-4 sm:mt-6 animate-in slide-in-from-top-6 duration-500 max-w-lg w-full">
        <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900/95 border border-amber-500/50 shadow-2xl shadow-amber-950/80 backdrop-blur-xl text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <span className="text-3xl animate-bounce">🫰</span>
            <span className="text-2xl animate-pulse">💨</span>
            <div className="flex gap-1 ml-1">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-sm shadow-purple-400" title="Power" />
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm shadow-blue-400" title="Space" />
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm shadow-red-400" title="Reality" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-400" title="Soul" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-400 animate-pulse" title="Time" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 shadow-sm shadow-yellow-300" title="Mind" />
            </div>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-black text-amber-300 leading-tight">
              {language === 'bn'
                ? 'ওহ না! থ্যানোসের এক চুটকিতে সবকিছু ধূলিসাৎ হয়ে গেল...'
                : 'Snap! Thanos just turned the website into dust...'}
            </h3>
            <p className="text-xs text-neutral-300 mt-1">
              {language === 'bn'
                ? 'মাসের সেরা কর্মীর ছবিতে ক্লিক করায় ইনফিনিটি গাউনলেট সক্রিয় হয়েছে!'
                : 'Infinity Gauntlet activated by clicking the Employee of the Month photo!'}
            </p>
          </div>

          {/* Time Stone Interactive Restore Button */}
          <div className="pt-1 flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <button
              onClick={handleRestore}
              disabled={isRestoring}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 hover:brightness-110 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <RotateCcw className={`w-4 h-4 ${isRestoring ? 'animate-spin' : ''}`} />
              <span>
                {language === 'bn'
                  ? `টাইম স্টোন দিয়ে ফিরিয়ে আনুন (${countdown}s)`
                  : `Restore with Time Stone (${countdown}s)`}
              </span>
              <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
            </button>
          </div>
        </div>
      </div>

      {/* Floating dust indicator footer */}
      <div className="relative z-20 mb-4 text-[11px] font-mono text-neutral-400 bg-black/60 px-3 py-1 rounded-full border border-neutral-800">
        <span>{language === 'bn' ? '⏳ টাইম স্টোন সক্রিয়: স্বয়ংক্রিয়ভাবে ফিরে আসবে' : '⏳ Time Stone auto-reversal active'}</span>
      </div>
    </div>
  );
};
