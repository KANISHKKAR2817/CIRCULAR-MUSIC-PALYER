import React from 'react';
import { Song } from '../types';
import { PriorityQueue, PriorityItem } from '../dataStructures/PriorityQueue';
import { Zap, Play, Trash2, ArrowDown } from 'lucide-react';

interface PriorityQueuePanelProps {
  priorityQueue: PriorityQueue;
  onPlaySong: (song: Song) => void;
  onRemovePriority: (songId: string) => void;
}

export const PriorityQueuePanel: React.FC<PriorityQueuePanelProps> = ({
  priorityQueue,
  onPlaySong,
  onRemovePriority
}) => {
  const { highPriority, normalPriority } = priorityQueue.getGroupedItems();

  return (
    <div className="w-full glass-panel rounded-3xl p-6 border border-slate-800/80 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-amber-950/80 border border-amber-800/60 text-amber-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-100 flex items-center space-x-2">
              <span>PRIORITY QUEUE — "PLAY NEXT"</span>
              <span className="px-2 py-0.5 text-[10px] font-mono bg-amber-950 text-amber-400 border border-amber-800/60 rounded-full">
                {priorityQueue.size()} Songs Queued
              </span>
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              High Priority songs override normal queue playback order
            </p>
          </div>
        </div>
      </div>

      {/* Priority Visual Structure */}
      <div className="space-y-6">

        {/* HIGH PRIORITY SECTION */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-amber-400">
            <span className="flex items-center space-x-1.5">
              <Zap className="w-4 h-4 fill-amber-400" />
              <span>HIGH PRIORITY QUEUE (Level 2 - Preempts Normal Queue)</span>
            </span>
            <span>{highPriority.length} Items</span>
          </div>

          {highPriority.length > 0 ? (
            <div className="space-y-2">
              {highPriority.map((item) => (
                <div
                  key={`high-pri-${item.song.id}`}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/60 shadow-lg shadow-amber-500/10"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.song.artworkGradient} flex items-center justify-center shadow-md`}>
                      <Zap className="w-4 h-4 text-amber-300" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-100">{item.song.title}</h4>
                      <p className="text-xs text-slate-400">{item.song.artist}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onPlaySong(item.song)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black transition-all shadow-md shadow-amber-500/20"
                    >
                      PLAY NOW
                    </button>
                    <button
                      onClick={() => onRemovePriority(item.song.id)}
                      className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-dashed border-slate-800 text-xs font-mono text-slate-500 text-center">
              No High Priority songs queued. Click "Play Next" on any song to push into High Priority!
            </div>
          )}
        </div>

        {/* Separator Arrow */}
        <div className="flex items-center justify-center space-x-2 text-xs font-mono text-slate-600">
          <ArrowDown className="w-4 h-4 text-cyan-400" />
          <span>Falls back to Normal Circular Queue</span>
        </div>

        {/* NORMAL QUEUE SECTION */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-400">
            <span>NORMAL CIRCULAR QUEUE (Level 1)</span>
            <span>{normalPriority.length} Items</span>
          </div>

          {normalPriority.length > 0 ? (
            <div className="space-y-2">
              {normalPriority.map((item) => (
                <div
                  key={`norm-pri-${item.song.id}`}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/80 border border-slate-800"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.song.artworkGradient} flex items-center justify-center`}>
                      <Play className="w-3 h-3 text-white fill-white ml-0.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">{item.song.title}</h4>
                      <p className="text-[10px] text-slate-400">{item.song.artist}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">Normal Priority</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs font-mono text-slate-500 text-center">
              Normal queue items handled via Circular Queue ring.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
