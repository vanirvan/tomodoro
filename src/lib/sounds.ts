class SoundManager {
  private audioCache: Map<string, HTMLAudioElement> = new Map();
  private static instance: SoundManager;

  private constructor() {
    this.preloadSounds();
  }

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  private preloadSounds(): void {
    const soundFiles = [
      'bell',
      'chime',
      'ding',
      'gong',
      'notification'
    ];

    soundFiles.forEach(soundName => {
      try {
        const audio = new Audio(`/sounds/${soundName}.mp3`);
        audio.preload = 'auto';

        // Set some default audio properties
        audio.volume = 0.7;

        // Cache the audio element
        this.audioCache.set(soundName, audio);
      } catch (error) {
        console.warn(`Failed to preload sound: ${soundName}`, error);
      }
    });
  }

  public async playSound(soundName: string): Promise<void> {
    try {
      const audio = this.audioCache.get(soundName);

      if (!audio) {
        console.warn(`🔔 Sound not found: ${soundName} - Add ${soundName}.mp3 to /public/sounds/`);
        // Fallback: Create a simple beep using Web Audio API
        this.playFallbackBeep();
        return;
      }

      // Reset audio to start if it's already playing
      audio.currentTime = 0;

      // Play the sound
      await audio.play();
      console.log(`🔔 Playing sound: ${soundName}`);
    } catch (error) {
      console.warn(`Failed to play sound: ${soundName}`, error);
      // Fallback: Create a simple beep
      this.playFallbackBeep();
    }
  }

  private playFallbackBeep(): void {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);

      console.log('🔔 Playing fallback beep sound');
    } catch (error) {
      console.log('🔔 Sound would play here (no audio)');
    }
  }

  public setVolume(volume: number): void {
    // Ensure volume is between 0 and 1
    const normalizedVolume = Math.max(0, Math.min(1, volume));

    this.audioCache.forEach(audio => {
      audio.volume = normalizedVolume;
    });
  }

  public getAvailableSounds(): string[] {
    return Array.from(this.audioCache.keys());
  }

  public isSoundAvailable(soundName: string): boolean {
    return this.audioCache.has(soundName);
  }
}

export const soundManager = SoundManager.getInstance();
export type SoundType = 'bell' | 'chime' | 'ding' | 'gong' | 'notification';