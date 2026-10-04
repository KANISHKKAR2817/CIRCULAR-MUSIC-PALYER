import React from 'react';
import { Song } from '../types';
import { Stack } from '../dataStructures/Stack';
import { History, Layers, ArrowUp, Trash2, Play } from 'lucide-react';

interface StackPanelProps {
  stack: Stack<Song>;
  onPlaySong: (song: Song) => void;
  onPopStack: () => void;
  onClearStack: () => void;
}

export const StackPanel: React.FC<StackPanelProps> = ({
  stack,
  onPlaySong,
  onPopStack,
  onClearStack
}) => {
  const items = stack.getItemsTopFirst();

  return (
    <div className="w-full glass-panel rounded-3xl p-6 border border-slate-800/80 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-violet-950/80 border border-violet-800/60 text-violet-400">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-100 flex items-center space-x-2">
              <span>RECENTLY PLAYED — STACK (LIFO)</span>
              <span className="px-2 py-0.5 text-[10px] font-mono bg-violet-950 text-violet-400 border border-violet-800/60 rounded-full">
                Stack Size: {stack.size()}
              </span>
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Last In, First Out data structure tracking playback history
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onPopStack}
            disabled={stack.isEmpty()}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-slate-900 border border-slate-800 hover:border-slate-700 disabled:opacity-40 text-slate-300 transition-all"
          >
            <ArrowUp className="w-3.5 h-3.5 text-violet-400" />
            <span>POP TOP</span>
          </button>
          <button
            onClick={onClearStack}
            disabled={stack.isEmpty()}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-rose-800 disabled:opacity-40 text-slate-400 hover:text-rose-400 transition-all"
            title="Clear History Stack"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Visual Stack Box */}
      <div className="space-y-4">

        {/* DSA Operations Badge */}
        <div className="flex items-center justify-between text-xs font-mono p-3 rounded-2xl bg-slate-950 border border-slate-800">
          <div className="flex items-center space-x-4">
            <span className="text-slate-400 font-bold">OPERATIONS:</span>
            <span className="text-violet-400 font-bold">PUSH O(1)</span>
            <span className="text-violet-400 font-bold">POP O(1)</span>
            <span className="text-violet-400 font-bold">PEEK O(1)</span>
          </div>
          <span className="text-emerald-400 font-bold hidden sm:inline">
            TOP = {stack.peek() ? `"${stack.peek()?.title}"` : 'EMPTY'}
          </span>
        </div>

        {/* Stack Items Rendering (Top item highlighted) */}
        {items.length > 0 ? (
          <div className="flex flex-col space-y-2 relative">

            {/* TOP Indicator Arrow */}
            <div className="flex items-center space-x-2 text-xs font-mono font-bold text-violet-400 px-2 py-1">
              <ArrowUp className="w-4 h-4 text-violet-400 animate-bounce" />
              <span>STACK TOP (Most Recently Played)</span>
            </div>

            {items.map((song, idx) => {
              const isTop = idx === 0;

              return (
                <div
                  key={`stack-item-${song.id}-${idx}`}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                    isTop
                      ? 'bg-violet-950/60 border-violet-500/80 shadow-lg shadow-violet-500/10 ring-1 ring-violet-500/40'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-3.5">
                    <span className="text-xs font-mono font-bold text-slate-500 w-6">
                      #{items.length - idx}
                    </span>

                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${song.artworkGradient} flex items-center justify-center shadow-md`}>
                      <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-bold text-slate-100">{song.title}</h4>
                        {isTop && (
                          <span className="px-1.5 py-0.5 text-[9px] font-mono font-extrabold bg-violet-400 text-black rounded">
                            TOP
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">{song.artist}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onPlaySong(song)}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-violet-600/30 hover:bg-violet-600/50 text-violet-300 border border-violet-500/30 transition-all"
                  >
                    <Play className="w-3 h-3 fill-violet-300" />
                    <span>Replay</span>
                  </button>
                </div>
              );
            })}

            {/* STACK BOTTOM */}
            <div className="text-center py-2 text-[10px] font-mono text-slate-600 border-t border-slate-800/60">
              ─── STACK BOTTOM ───
            </div>

          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-slate-800 rounded-3xl space-y-2">
            <Layers className="w-8 h-8 text-slate-600" />
            <p className="text-xs font-mono text-slate-400">
              Stack is currently empty. Play songs to push onto the history stack.
            </p>
          </div>
        )}

      </div>

    </div>
  );
};
