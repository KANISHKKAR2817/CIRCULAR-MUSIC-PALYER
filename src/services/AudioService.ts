import { Song } from '../types';

export class AudioService {
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private synthOscillator: OscillatorNode | null = null;
  private isPlaying: boolean = false;
  private volume: number = 0.8;
  private currentTime: number = 0;
  private duration: number = 200;
  private timer: number | null = null;
  private currentSong: Song | null = null;
  private onEndedCallback: (() => void) | null = null;
  private onTimeUpdateCallback: ((currentTime: number) => void) | null = null;

  constructor() {
    // Lazy initialize AudioContext on user interaction
  }

  private initAudioContext(): void {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioContextClass();

      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);

      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 64;

      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.audioCtx.destination);
    }

    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public play(song: Song): void {
    this.initAudioContext();
    this.currentSong = song;
    this.duration = song.duration || 200;

    // Stop current synth oscillator if playing
    this.stopSynth();

    this.isPlaying = true;

    // Create melodic ambient synth node
    if (this.audioCtx && this.masterGain) {
      const freq = song.synthFrequency || 440;
      this.synthOscillator = this.audioCtx.createOscillator();

      // Set oscillator waveform based on pattern
      if (song.synthPattern === 'chill') {
        this.synthOscillator.type = 'triangle';
      } else if (song.synthPattern === 'upbeat') {
        this.synthOscillator.type = 'sawtooth';
      } else if (song.synthPattern === 'ambient') {
        this.synthOscillator.type = 'sine';
      } else {
        this.synthOscillator.type = 'square';
      }

      this.synthOscillator.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      // Low pass filter for warm cyber music sound
      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, this.audioCtx.currentTime);

      this.synthOscillator.connect(filter);
      filter.connect(this.masterGain);
      this.synthOscillator.start();
    }

    // Start timer incrementing playback position
    if (this.timer) clearInterval(this.timer);
    this.timer = window.setInterval(() => {
      if (this.isPlaying) {
        this.currentTime += 1;
        if (this.onTimeUpdateCallback) {
          this.onTimeUpdateCallback(this.currentTime);
        }

        if (this.currentTime >= this.duration) {
          this.currentTime = 0;
          if (this.onEndedCallback) {
            this.onEndedCallback();
          }
        }
      }
    }, 1000);
  }

  public pause(): void {
    this.isPlaying = false;
    this.stopSynth();
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  public stopSynth(): void {
    if (this.synthOscillator) {
      try {
        this.synthOscillator.stop();
        this.synthOscillator.disconnect();
      } catch {
        // ignore if already stopped
      }
      this.synthOscillator = null;
    }
  }

  public seek(seconds: number): void {
    this.currentTime = Math.max(0, Math.min(seconds, this.duration));
    if (this.onTimeUpdateCallback) {
      this.onTimeUpdateCallback(this.currentTime);
    }
  }

  public setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentTime(): number {
    return this.currentTime;
  }

  public getDuration(): number {
    return this.duration;
  }

  public setOnEnded(callback: () => void): void {
    this.onEndedCallback = callback;
  }

  public setOnTimeUpdate(callback: (currentTime: number) => void): void {
    this.onTimeUpdateCallback = callback;
  }

  public resetTime(): void {
    this.currentTime = 0;
  }

  /**
   * Returns frequency data array for visualizer animation.
   */
  public getFrequencyData(): Uint8Array {
    if (!this.analyser || !this.isPlaying) {
      return new Uint8Array(16).fill(10);
    }
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    return dataArray;
  }
}
