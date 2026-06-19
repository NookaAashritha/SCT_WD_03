import { useCallback, useRef } from 'react';

// Create audio context lazily
const getAudioContext = () => {
  if (typeof window !== 'undefined' && 'AudioContext' in window) {
    return new AudioContext();
  }
  return null;
};

export function useSound() {
  const audioContextRef = useRef<AudioContext | null>(null);

  const playSound = useCallback((type: 'move' | 'win' | 'draw') => {
    // Initialize audio context on first use
    if (!audioContextRef.current) {
      audioContextRef.current = getAudioContext();
    }

    const ctx = audioContextRef.current;
    if (!ctx) return;

    // Resume if suspended (browser autoplay policy)
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sine';

    switch (type) {
      case 'move':
        // Short, crisp click sound
        oscillator.frequency.setValueAtTime(800, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.1);
        break;

      case 'win':
        // Triumphant ascending melody
        const playWinNote = (freq: number, startTime: number, duration: number) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);
          gain.gain.setValueAtTime(0.3, ctx.currentTime + startTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + startTime + duration);
          osc.start(ctx.currentTime + startTime);
          osc.stop(ctx.currentTime + startTime + duration);
        };
        playWinNote(523.25, 0, 0.2);    // C5
        playWinNote(659.25, 0.15, 0.2); // E5
        playWinNote(783.99, 0.3, 0.3);  // G5
        break;

      case 'draw':
        // Neutral descending sound
        oscillator.frequency.setValueAtTime(400, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.3);
        gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.3);
        break;
    }
  }, []);

  return { playSound };
}
