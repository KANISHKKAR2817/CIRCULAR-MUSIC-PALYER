import React from 'react';
import { Song, QueueState, DSAMathStep } from '../types';
import { Cpu, ArrowRight, CornerDownLeft, Sliders, Hash, CheckCircle } from 'lucide-react';

interface DSAModePanelProps {
  queueArray: (Song | null)[];
  queueState: QueueState;
  lastMathStep: DSAMathStep | null;
  onResizeCapacity: (newCap: number) => void;
  onSelectIndex: (index: number) => void;
}

export const DSAModePanel: React.FC<DSAModePanelProps> = ({
  queueArray,
  queueState,
  lastMathStep,
  onResizeCapacity,
  onSelectIndex
}) => {
  const { capacity, front, rear, currentIndex, size } = queueState;

  return (
    <div className="w-full glass-panel rounded-3xl p-6 border border-slate-800/80 space-y-6">

      {/* Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-800/60 text-cyan-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-100 flex items-center space-x-2">
              <span>CIRCULAR QUEUE — 1D ARRAY MEMORY VIEW</span>
              <span className="px-2 py-0.5 text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800/60 rounded-full">
                O(1) Memory
              </span>
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Physical fixed array storage with index wrap-around arithmetic
            </p>
          </div>
        </div>

        {/* Capacity Resizer Slider */}
        <div className="flex items-center space-x-3 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-400">CAPACITY:</span>
          <span className="font-extrabold text-cyan-300">{capacity}</span>
          <div className="flex items-center space-x-1 pl-2">
            <button
              onClick={() => onResizeCapacity(Math.max(4, capacity - 1))}
              disabled={capacity <= 4 || size > capacity - 1}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-200"
            >
              -
            </button>
            <button
              onClick={() => onResizeCapacity(Math.min(16, capacity + 1))}
              disabled={capacity >= 16}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-200"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* 1D Array Cells Visualizer */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span>ARRAY MEMORY SLOTS [0 .. {capacity - 1}]</span>
          <span className="text-cyan-400 font-bold">
            front = {front}, rear = {rear}
          </span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
          {queueArray.map((song, i) => {
            const isFront = i === front;
            const isRear = i === rear;
            const isCurrent = i === currentIndex;
            const isEmpty = song === null;

            return (
              <div
                key={`array-slot-${i}`}
                onClick={() => !isEmpty && onSelectIndex(i)}
                className={`relative flex flex-col items-center justify-between p-3 rounded-2xl border transition-all duration-300 ${
                  isEmpty
                    ? 'bg-slate-950/60 border-dashed border-slate-800 text-slate-600'
                    : isCurrent
                    ? 'bg-cyan-950/70 border-cyan-400 text-cyan-200 glow-cyan ring-2 ring-cyan-500/40 cursor-pointer'
                    : 'bg-slate-900/90 border-slate-700/80 text-slate-300 hover:border-slate-500 cursor-pointer'
                }`}
              >
                {/* Slot Index Tag at Top Left */}
                <span className="absolute top-1.5 left-2 text-[9px] font-mono font-bold text-slate-500">
                  [{i}]
                </span>

                {/* Pointer Indicators */}
                <div className="flex flex-col items-center space-y-0.5 min-h-[22px] pt-1">
                  {isFront && (
                    <span className="px-1 py-0.2 text-[8px] font-mono font-extrabold bg-cyan-400 text-black rounded">
                      FRONT
                    </span>
                  )}
                  {isRear && (
                    <span className="px-1 py-0.2 text-[8px] font-mono font-extrabold bg-pink-500 text-white rounded">
                      REAR
                    </span>
                  )}
                </div>

                {/* Cell Contents */}
                <div className="my-2 text-center">
                  {song ? (
                    <span className="text-xs font-bold truncate max-w-[60px] block" title={song.title}>
                      {song.title}
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-600">NULL</span>
                  )}
                </div>

                {/* Status indicator */}
                <div className="w-full flex justify-center pt-1 border-t border-slate-800/60 text-[9px] font-mono">
                  {isCurrent ? (
                    <span className="text-emerald-400 font-bold">ACTIVE</span>
                  ) : song ? (
                    <span className="text-slate-400">QUEUED</span>
                  ) : (
                    <span className="text-slate-700">FREE</span>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Live Formula Step Evaluation Box */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-slate-300 flex items-center space-x-2">
            <Hash className="w-4 h-4 text-cyan-400" />
            <span>LIVE INDEX ARITHMETIC FORMULA</span>
          </span>
          {lastMathStep && (
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800/60 rounded-full">
              {lastMathStep.operation}
            </span>
          )}
        </div>

        {lastMathStep ? (
          <div className="space-y-2 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-cyan-300 font-bold">
              <span>{lastMathStep.formula}</span>
              <span className="text-emerald-400 font-extrabold">
                Result Index: #{lastMathStep.resultIndex}
              </span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              {lastMathStep.description}
            </p>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-xs font-mono text-slate-500">
            Click NEXT or PREVIOUS to evaluate circular queue index formulas live.
          </div>
        )}
      </div>

      {/* Index Equations Cheat Sheet */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span className="text-cyan-400 font-bold">Next Index Formula:</span>
          <p className="text-slate-300"><code>nextIndex = (currentIndex + 1) % capacity</code></p>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span className="text-pink-400 font-bold">Previous Index Formula:</span>
          <p className="text-slate-300"><code>prevIndex = (currentIndex - 1 + capacity) % capacity</code></p>
        </div>
      </div>

    </div>
  );
};
