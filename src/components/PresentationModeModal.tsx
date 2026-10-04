import React from 'react';
import { QueueState, DSAMathStep, Song } from '../types';
import { GraduationCap, X, SkipForward, SkipBack, Play, Cpu, Sparkles, CheckCircle2 } from 'lucide-react';

interface PresentationModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  queueState: QueueState;
  currentSong: Song | null;
  lastMathStep: DSAMathStep | null;
  onNext: () => void;
  onPrevious: () => void;
  onTogglePlay: () => void;
  isPlaying: boolean;
}

export const PresentationModeModal: React.FC<PresentationModeModalProps> = ({
  isOpen,
  onClose,
  queueState,
  currentSong,
  lastMathStep,
  onNext,
  onPrevious,
  onTogglePlay,
  isPlaying
}) => {
  if (!isOpen) return null;

  const { front, rear, size, capacity, currentIndex } = queueState;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-xl">
      <div className="w-full max-w-4xl glass-panel rounded-3xl p-6 sm:p-10 border-2 border-amber-500/60 shadow-2xl space-y-8 animate-in zoom-in-95 duration-200">

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-amber-500 text-black shadow-lg shadow-amber-500/30">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-amber-300">
                🎓 COLLEGE VIVA PRESENTATION MODE
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Data Structures & Algorithms Viva Review Visualizer
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Viva Main Stats Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-center">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400">DATA STRUCTURE</span>
            <p className="text-sm font-extrabold text-cyan-400">Circular Queue</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400">CURRENT OPERATION</span>
            <p className="text-sm font-extrabold text-emerald-400">
              {lastMathStep?.operation || 'PLAYBACK'}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400">TIME COMPLEXITY</span>
            <p className="text-sm font-extrabold text-amber-400">O(1) Constant</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400">SPACE COMPLEXITY</span>
            <p className="text-sm font-extrabold text-cyan-400">O(N) Fixed</p>
          </div>
        </div>

        {/* Live Index Arithmetic Equation Box */}
        <div className="p-6 rounded-3xl bg-slate-950 border border-amber-500/40 space-y-4 font-mono">
          <div className="flex items-center justify-between text-xs font-bold text-amber-400">
            <span>MATHEMATICAL INDEX FORMULA</span>
            <span>MODULO ARITHMETIC</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <span className="text-xs text-slate-400 block mb-1">FORMULA EVALUATION</span>
              <p className="text-lg sm:text-xl font-extrabold text-cyan-300">
                {lastMathStep?.formula || `(${currentIndex} + 1) % ${capacity} = ${(currentIndex + 1) % capacity}`}
              </p>
            </div>
            <div className="px-4 py-2 rounded-xl bg-cyan-950 border border-cyan-700 text-cyan-300 font-extrabold text-sm">
              NEW INDEX = #{lastMathStep?.resultIndex ?? ((currentIndex + 1) % capacity)}
            </div>
          </div>

          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            {lastMathStep?.description || "Circular traversal computes the next index using modulo arithmetic, ensuring zero array shifts."}
          </p>
        </div>

        {/* Queue Pointers Status */}
        <div className="grid grid-cols-4 gap-3 font-mono text-center text-xs">
          <div className="p-3 rounded-xl bg-slate-900 border border-cyan-500/40 text-cyan-300">
            <span className="text-[10px] text-slate-400 block">FRONT POINTER</span>
            <span className="text-lg font-bold">{front}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-pink-500/40 text-pink-300">
            <span className="text-[10px] text-slate-400 block">REAR POINTER</span>
            <span className="text-lg font-bold">{rear}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200">
            <span className="text-[10px] text-slate-400 block">QUEUE SIZE</span>
            <span className="text-lg font-bold">{size}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200">
            <span className="text-[10px] text-slate-400 block">CAPACITY</span>
            <span className="text-lg font-bold">{capacity}</span>
          </div>
        </div>

        {/* Live Presentation Step Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <div className="flex items-center space-x-2">
            <button
              onClick={onPrevious}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-mono text-xs font-bold flex items-center space-x-1.5"
            >
              <SkipBack className="w-4 h-4" />
              <span>PREVIOUS ((idx - 1 + cap) % cap)</span>
            </button>
            <button
              onClick={onNext}
              className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold flex items-center space-x-1.5 shadow-lg shadow-cyan-600/30"
            >
              <SkipForward className="w-4 h-4" />
              <span>NEXT ((idx + 1) % cap)</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition-all shadow-lg shadow-amber-500/20"
          >
            EXIT VIVA MODE
          </button>
        </div>

      </div>
    </div>
  );
};
