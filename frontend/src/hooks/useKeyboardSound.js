import { useCallback } from "react";

/**
 * Custom hook to play keystroke sounds during typing.
 * Uses Web Audio API synthesizers so it works instantly without external audio files.
 */
export function useKeyboardSound() {
  const playRandomKeyStrokeSound = useCallback(() => {
    try {
      if (typeof window === "undefined") return;
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;

      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Random subtle frequency for realistic keystroke click feel
      const frequencies = [320, 360, 400, 440, 480];
      const randomFreq = frequencies[Math.floor(Math.random() * frequencies.length)];

      osc.type = "sine";
      osc.frequency.setValueAtTime(randomFreq, ctx.currentTime);

      // Fast decay for a clean mechanical click sound
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {
      // Audio playback blocked by browser autoplay policy
    }
  }, []);

  return { playRandomKeyStrokeSound };
}

export default useKeyboardSound;

