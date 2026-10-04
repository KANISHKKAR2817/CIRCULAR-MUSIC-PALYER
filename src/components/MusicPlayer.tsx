import React, { useEffect, useState } from 'react';
import { Song, QueueState } from '../types';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  Heart,
  Disc,
  Zap
} from 'lucide-react';
import { AudioService } from '../services/AudioService';

interface MusicPlayerProps {
  currentSong: Song | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrevious: () => void;
  isShuffle: boolean;
  onToggleShuffle: () => void;
  repeatMode: 'off' | 'song' | 'queue';
  onCycleRepeat: () => void;
  isFavorite: boolean;
  onToggleFavorite: (song: Song) => void;
  onPlayNext: (song: Song) => void;
  audioService: AudioService;
  queueState: QueueState;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  currentSong,
  isPlaying,
  onTogglePlay,
  onNext,
  onPrevious,
  isShuffle,
  onToggleShuffle,
  repeatMode,
  onCycleRepeat,
  isFavorite,
  onToggleFavorite,
  onPlayNext,
  audioService,
  queueState
}) => {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [spectrumData, setSpectrumData] = useState<Uint8Array>(new Uint8Array(16).fill(10));

  // Update playback time and spectrum visualizer
  useEffect(() => {
    audioService.setOnTimeUpdate((time) => {
      setCurrentTime(time);
    });

    const animInterval = setInterval(() => {
      if (isPlaying) {
        setSpectrumData(audioService.getFrequencyData());
      } else {
        setSpectrumData(new Uint8Array(16).fill(6));
      }
    }, 100);

    return () => clearInterval(animInterval);
  }, [audioService, isPlaying]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setCurrentTime(val);
    audioService.seek(val);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
    audioService.setVolume(val);
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      audioService.setVolume(volume || 0.8);
    } else {
      setIsMuted(true);
      audioService.setVolume(0);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const duration = currentSong?.duration || 200;

  return (
    <div className="relative w-full glass-panel rounded-3xl p-6 lg:p-8 border border-slate-800/80 flex flex-col justify-between space-y-6">

      {/* Top Song Header Info */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-1 text-[10px] font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 rounded-full">
            CURRENT POS: #{queueState.currentIndex === -1 ? '0' : queueState.currentIndex}
          </span>
          {currentSong?.priority === 'HIGH' && (
            <span className="flex items-center space-x-1 px-2.5 py-1 text-[10px] font-mono font-bold bg-amber-950/80 text-amber-300 border border-amber-700/60 rounded-full glow-amber">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>HIGH PRIORITY</span>
            </span>
          )}
        </div>

        {currentSong && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPlayNext(currentSong)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 hover:bg-slate-800 transition-colors text-xs font-semibold flex items-center space-x-1"
              title="Add to Priority Queue"
            >
              <Zap className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Play Next</span>
            </button>
            <button
              onClick={() => onToggleFavorite(currentSong)}
              className={`p-2 rounded-xl border transition-colors ${
                isFavorite
                  ? 'bg-rose-950/60 text-rose-400 border-rose-800/60'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-400' : ''}`} />
            </button>
          </div>
        )}
      </div>

      {/* Central Hero Disc & Visualizer */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 py-4">

        {/* Animated Rotating Vinyl Album Artwork */}
        <div className="relative group">
          {/* Audio Pulsing Wave Outer Aura */}
          <div
            className={`absolute -inset-4 rounded-full bg-gradient-to-tr ${
              currentSong?.artworkGradient || 'from-cyan-500 to-indigo-600'
            } opacity-20 blur-xl transition-all duration-700 ${
              isPlaying ? 'scale-110 animate-pulse-ring' : 'scale-95'
            }`}
          />

          <div
            className={`relative w-44 h-44 sm:w-52 sm:h-52 rounded-full p-2 bg-slate-950 border-4 border-slate-800 shadow-2xl flex items-center justify-center transition-transform ${
              isPlaying ? 'animate-spin-vinyl' : 'animate-spin-paused'
            }`}
          >
            <div
              className={`w-full h-full rounded-full bg-gradient-to-br ${
                currentSong?.artworkGradient || 'from-cyan-500 via-blue-600 to-indigo-900'
              } flex items-center justify-center border-2 border-slate-900/60 shadow-inner relative overflow-hidden`}
            >
              {/* Vinyl Grooves */}
              <div className="absolute inset-0 border-[8px] border-black/20 rounded-full" />
              <div className="absolute inset-4 border-[6px] border-black/15 rounded-full" />
              <div className="absolute inset-8 border-[4px] border-black/10 rounded-full" />

              {/* Center Vinyl Hole */}
              <div className="w-12 h-12 rounded-full bg-slate-950 border-4 border-slate-800 flex items-center justify-center z-10 shadow-lg">
                <Disc className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Song Details & Animated Frequency Spectrum Bars */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-3 max-w-md">
          {currentSong ? (
            <>
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100">
                  {currentSong.title}
                </h2>
                <p className="text-sm sm:text-base font-semibold text-cyan-400 mt-0.5">
                  {currentSong.artist}
                </p>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Album: {currentSong.album} • {currentSong.genre}
                </p>
              </div>

              {/* Spectrum Visualizer Frequency Bars */}
              <div className="flex items-end space-x-1 h-8 pt-2">
                {Array.from(spectrumData.slice(0, 16)).map((val, idx) => {
                  const heightPct = Math.max(15, Math.min(100, (val / 255) * 100));
                  return (
                    <div
                      key={`bar-${idx}`}
                      style={{ height: `${heightPct}%` }}
                      className="w-1.5 rounded-full bg-gradient-to-t from-cyan-500 to-blue-400 transition-all duration-75"
                    />
                  );
                })}
              </div>
            </>
          ) : (
            <div className="text-slate-500 font-mono text-sm py-6">
              No song selected in Circular Queue.
            </div>
          )}
        </div>

      </div>

      {/* Progress Bar & Seek Slider */}
      <div className="space-y-1.5 w-full">
        <div className="relative group">
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
          />
        </div>
        <div className="flex justify-between text-xs font-mono text-slate-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-800/80">

        {/* Shuffle & Repeat Toggles */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleShuffle}
            className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
              isShuffle
                ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50 glow-cyan'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
            title="Shuffle Circular Queue"
          >
            <Shuffle className="w-4 h-4" />
          </button>
          <button
            onClick={onCycleRepeat}
            className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
              repeatMode !== 'off'
                ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50 glow-cyan'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
            title={`Repeat Mode: ${repeatMode}`}
          >
            {repeatMode === 'song' ? (
              <Repeat1 className="w-4 h-4 text-cyan-400" />
            ) : (
              <Repeat className={`w-4 h-4 ${repeatMode === 'queue' ? 'text-cyan-400' : ''}`} />
            )}
          </button>
        </div>

        {/* Main Playback Transport Buttons */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onPrevious}
            className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-all hover:scale-105 active:scale-95"
            title="Previous ( (curr - 1 + cap) % cap )"
          >
            <SkipBack className="w-5 h-5 fill-slate-200" />
          </button>

          <button
            onClick={onTogglePlay}
            disabled={!currentSong}
            className="p-4 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black shadow-xl shadow-cyan-500/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-black" />
            ) : (
              <Play className="w-6 h-6 fill-black ml-0.5" />
            )}
          </button>

          <button
            onClick={onNext}
            className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-all hover:scale-105 active:scale-95"
            title="Next ( (curr + 1) % cap )"
          >
            <SkipForward className="w-5 h-5 fill-slate-200" />
          </button>
        </div>

        {/* Volume Slider Control */}
        <div className="flex items-center space-x-2">
          <button onClick={toggleMute} className="text-slate-400 hover:text-slate-200">
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-20 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

      </div>

    </div>
  );
};
