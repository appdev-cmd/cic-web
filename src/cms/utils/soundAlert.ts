/**
 * Plays a subtle, pleasant 2-tone chime using Web Audio API.
 * Completely dependency-free and lightweight.
 */
export function playNotificationSound(): void {
  if (typeof window === 'undefined') return;

  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();

    // Create master gain
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.12, ctx.currentTime);
    masterGain.connect(ctx.destination);

    // Note 1: E6 (~1318.5 Hz) - bright and polite
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(1318.5, ctx.currentTime);
    gain1.gain.setValueAtTime(0.6, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc1.connect(gain1);
    gain1.connect(masterGain);

    // Note 2: B6 (~1975.5 Hz) - harmonic sparkle 80ms later
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1975.5, ctx.currentTime + 0.08);
    gain2.gain.setValueAtTime(0, ctx.currentTime);
    gain2.gain.setValueAtTime(0.5, ctx.currentTime + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc2.connect(gain2);
    gain2.connect(masterGain);

    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.36);

    osc2.start(ctx.currentTime + 0.08);
    osc2.stop(ctx.currentTime + 0.51);

    // Close context after playback completes
    setTimeout(() => {
      try {
        void ctx.close();
      } catch {
        // ignore
      }
    }, 600);
  } catch (err) {
    console.debug('[AudioChime] Audio playback suppressed or unsupported:', err);
  }
}
