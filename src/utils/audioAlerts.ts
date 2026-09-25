// High-fidelity Web Audio API & Web Speech API Sound and TTS Alert Engine
// Specially engineered for Saiful Enterprise staff alerts

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Prime and unlock browser audio policies on any user interaction
 */
export function unlockAudioEngine(): boolean {
  try {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume();
    }
    // Also prime SpeechSynthesis if supported
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    }
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Plays crisp, professional musical chimes synthesized in pure Web Audio API
 */
export function playChime(
  type: 'order' | 'assistance' | 'gentle' | 'test' = 'order',
  volume: number = 0.9
): Promise<void> {
  return new Promise((resolve) => {
    try {
      const ctx = getAudioContext();
      if (!ctx) {
        resolve();
        return;
      }

      const now = ctx.currentTime;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(Math.max(0.01, Math.min(1.0, volume)), now);
      masterGain.connect(ctx.destination);

      if (type === 'order') {
        // Melodic 3-tone ascending chord: C5 (523Hz), E5 (659Hz), G5 (784Hz)
        const notes = [
          { freq: 523.25, start: 0, dur: 0.28 },
          { freq: 659.25, start: 0.12, dur: 0.35 },
          { freq: 783.99, start: 0.26, dur: 0.65 }
        ];

        notes.forEach(({ freq, start, dur }) => {
          const osc = ctx.createOscillator();
          const noteGain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + start);

          // Smooth bell envelope
          noteGain.gain.setValueAtTime(0.0001, now + start);
          noteGain.gain.exponentialRampToValueAtTime(0.4, now + start + 0.02);
          noteGain.gain.exponentialRampToValueAtTime(0.0001, now + start + dur);

          osc.connect(noteGain);
          noteGain.connect(masterGain);

          osc.start(now + start);
          osc.stop(now + start + dur + 0.05);
        });

        setTimeout(resolve, 850);
      } else if (type === 'assistance') {
        // Attention-grabbing double high-alert chime: A5 (880Hz) -> D6 (1174Hz) x2
        const pings = [
          { freq: 880, start: 0, dur: 0.22 },
          { freq: 1174.66, start: 0.14, dur: 0.4 },
          { freq: 880, start: 0.36, dur: 0.22 },
          { freq: 1174.66, start: 0.5, dur: 0.55 }
        ];

        pings.forEach(({ freq, start, dur }) => {
          const osc = ctx.createOscillator();
          const noteGain = ctx.createGain();

          osc.type = 'triangle'; // Crisp, penetrative tone
          osc.frequency.setValueAtTime(freq, now + start);

          noteGain.gain.setValueAtTime(0.0001, now + start);
          noteGain.gain.exponentialRampToValueAtTime(0.45, now + start + 0.02);
          noteGain.gain.exponentialRampToValueAtTime(0.0001, now + start + dur);

          osc.connect(noteGain);
          noteGain.connect(masterGain);

          osc.start(now + start);
          osc.stop(now + start + dur + 0.05);
        });

        setTimeout(resolve, 1100);
      } else {
        // Simple crisp confirmation bell
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(659.25, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);

        noteGain.gain.setValueAtTime(0.0001, now);
        noteGain.gain.exponentialRampToValueAtTime(0.4, now + 0.02);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

        osc.connect(noteGain);
        noteGain.connect(masterGain);

        osc.start(now);
        osc.stop(now + 0.5);

        setTimeout(resolve, 550);
      }
    } catch (err) {
      console.warn('Audio chime playback error:', err);
      resolve();
    }
  });
}

/**
 * Text-to-Speech synthesis runner with queue & voice selection
 */
let isSpeakingNow = false;
const speechQueue: Array<{
  text: string;
  lang: string;
  volume: number;
  rate: number;
  pitch: number;
  onEnd?: () => void;
}> = [];

function processSpeechQueue() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  if (isSpeakingNow || speechQueue.length === 0) return;

  const item = speechQueue.shift();
  if (!item) return;

  isSpeakingNow = true;

  try {
    const utterance = new SpeechSynthesisUtterance(item.text);
    utterance.volume = Math.max(0.1, Math.min(1.0, item.volume));
    utterance.rate = Math.max(0.5, Math.min(1.8, item.rate));
    utterance.pitch = Math.max(0.5, Math.min(1.5, item.pitch));
    utterance.lang = item.lang;

    // Pick best available voice matching requested language
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      if (item.lang.startsWith('bn')) {
        const bnVoice = voices.find(
          v => v.lang.toLowerCase().includes('bn') || v.name.toLowerCase().includes('bangla') || v.name.toLowerCase().includes('bengali')
        );
        if (bnVoice) {
          utterance.voice = bnVoice;
        }
      } else {
        const enVoice = voices.find(
          v => (v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Premium'))) ||
               v.lang === 'en-US' ||
               v.lang === 'en-GB'
        ) || voices.find(v => v.lang.startsWith('en'));
        if (enVoice) {
          utterance.voice = enVoice;
        }
      }
    }

    const finish = () => {
      isSpeakingNow = false;
      if (item.onEnd) item.onEnd();
      setTimeout(processSpeechQueue, 150);
    };

    utterance.onend = finish;
    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      finish();
    };

    // Chrome speech timeout safeguard
    const safetyTimeout = setTimeout(() => {
      if (isSpeakingNow) {
        window.speechSynthesis.cancel();
        finish();
      }
    }, 15000);

    const origEnd = utterance.onend;
    utterance.onend = (e) => {
      clearTimeout(safetyTimeout);
      if (typeof origEnd === 'function') origEnd.call(utterance, e);
    };

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.error('Failed to speak utterance:', err);
    isSpeakingNow = false;
    processSpeechQueue();
  }
}

/**
 * Queue a speech utterance
 */
export function queueSpeech(
  text: string,
  options: {
    lang?: string;
    volume?: number;
    rate?: number;
    pitch?: number;
    onEnd?: () => void;
  } = {}
) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  speechQueue.push({
    text,
    lang: options.lang || 'bn-BD',
    volume: options.volume ?? 0.9,
    rate: options.rate ?? 0.95,
    pitch: options.pitch ?? 1.0,
    onEnd: options.onEnd
  });
  processSpeechQueue();
}

/**
 * Stop any current speech and clear queue
 */
export function stopAllSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}
  }
  speechQueue.length = 0;
  isSpeakingNow = false;
}

/**
 * Clean Bangla digits into readable words or clear strings
 */
export function formatAmountForSpeech(amount: number): string {
  return `${amount}`;
}

/**
 * Clean Order Number for clear spoken output (e.g. "SE-2026-00001" -> "SE 0 0 0 0 1")
 */
export function formatOrderNumberForSpeech(orderNumber: string): string {
  // If order number is like SE-2026-00005, extract the last numeric segment
  const parts = orderNumber.split('-');
  if (parts.length > 2) {
    const lastDigits = parts[parts.length - 1].replace(/^0+/, '') || '0';
    return `${parts[0]} ${lastDigits}`;
  }
  return orderNumber;
}
