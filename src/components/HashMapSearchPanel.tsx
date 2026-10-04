import React from 'react';
import { Song, HashSearchResult } from '../types';
import { Search, Hash, Clock, CheckCircle2, Play } from 'lucide-react';

interface HashMapSearchPanelProps {
  searchResult: HashSearchResult | null;
  onPlaySong: (song: Song) => void;
  onEnqueueSong: (song: Song) => void;
}

export const HashMapSearchPanel: React.FC<HashMapSearchPanelProps> = ({
  searchResult,
  onPlaySong,
  onEnqueueSong
}) => {
  if (!searchResult || !searchResult.query) return null;

  return (
    <div className="w-full glass-panel rounded-3xl p-6 border border-cyan-500/40 shadow-xl shadow-cyan-950/20 space-y-4">

      {/* Header with O(1) Hash Map Metadata */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Hash className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-extrabold text-slate-100">
            HASH MAP LOOKUP RESULTS
          </span>
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800 rounded-full">
            "{searchResult.query}"
          </span>
        </div>

        {/* Algorithm Specs */}
        <div className="flex items-center space-x-3 text-[11px] font-mono text-slate-400">
          <span className="flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Time: {searchResult.lookupTimeMs} ms</span>
          </span>
          <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 font-bold rounded">
            {searchResult.timeComplexity}
          </span>
          <span className="text-slate-500">
            Bucket #{searchResult.bucketIndex}
          </span>
        </div>
      </div>

      {/* Results List */}
      {searchResult.matches.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {searchResult.matches.map(song => (
            <div
              key={`hash-match-${song.id}`}
              className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 transition-all"
            >
              <div className="flex items-center space-x-3 min-w-0">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${song.artworkGradient} flex items-center justify-center shrink-0`}>
                  <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-100 truncate">{song.title}</h4>
                  <p className="text-[10px] text-slate-400 truncate">{song.artist} • {song.album}</p>
                </div>
              </div>

              <div className="flex items-center space-x-1 shrink-0">
                <button
                  onClick={() => onPlaySong(song)}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-cyan-600 hover:bg-cyan-500 text-white transition-colors"
                >
                  PLAY
                </button>
                <button
                  onClick={() => onEnqueueSong(song)}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                >
                  + QUEUE
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-xs font-mono text-slate-500">
          No songs found in Hash Map bucket matching query.
        </div>
      )}

    </div>
  );
};
