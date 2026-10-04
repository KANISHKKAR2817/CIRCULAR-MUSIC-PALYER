import React from 'react';
import { Song, QueueState } from '../types';
import { Play, Trash2, Zap, Heart, PlusCircle, ListMusic } from 'lucide-react';

interface PlaylistProps {
  queueArray: (Song | null)[];
  queueState: QueueState;
  onSelectSong: (index: number) => void;
  onRemoveSong: (index: number) => void;
  onPlayNext: (song: Song) => void;
  onToggleFavorite: (song: Song) => void;
  favoriteIds: string[];
  onOpenAddModal: () => void;
}

export const Playlist: React.FC<PlaylistProps> = ({
  queueArray,
  queueState,
  onSelectSong,
  onRemoveSong,
  onPlayNext,
  onToggleFavorite,
  favoriteIds,
  onOpenAddModal
}) => {
  const { front, rear, currentIndex, size, capacity } = queueState;

  // Filter active songs with index metadata
  const activeEntries = queueArray
    .map((song, index) => ({ song, index }))
    .filter(entry => entry.song !== null) as { song: Song; index: number }[];

  return (
    <div className="w-full glass-panel rounded-3xl p-6 border border-slate-800/80 space-y-6">

      {/* Playlist Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-800/60 text-cyan-400">
            <ListMusic className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-100 flex items-center space-x-2">
              <span>CIRCULAR QUEUE PLAYLIST</span>
              <span className="px-2 py-0.5 text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800/60 rounded-full">
                {size} / {capacity} Songs
              </span>
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Songs ordered in active circular queue positions
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAddModal}
          disabled={size >= capacity}
          className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white transition-all shadow-md shadow-cyan-600/20"
        >
          <PlusCircle className="w-4 h-4" />
          <span>ENQUEUE SONG</span>
        </button>
      </div>

      {/* Songs List */}
      {activeEntries.length > 0 ? (
        <div className="space-y-2">
          {activeEntries.map(({ song, index }) => {
            const isFront = index === front;
            const isRear = index === rear;
            const isCurrent = index === currentIndex;
            const isFav = favoriteIds.includes(song.id);

            return (
              <div
                key={`song-row-${song.id}-${index}`}
                className={`flex items-center justify-between p-3 sm:p-4 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'bg-cyan-950/60 border-cyan-400/80 shadow-md shadow-cyan-500/10 ring-1 ring-cyan-500/30'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                {/* Left Info: Index, Artwork, Title, Artist */}
                <div className="flex items-center space-x-3.5 min-w-0">

                  {/* Slot Index Badge */}
                  <div className="flex flex-col items-center justify-center w-8 text-center shrink-0">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      [{index}]
                    </span>
                  </div>

                  {/* Artwork Gradient */}
                  <div
                    onClick={() => onSelectSong(index)}
                    className={`w-11 h-11 rounded-xl bg-gradient-to-br ${song.artworkGradient} flex items-center justify-center cursor-pointer shadow-md shrink-0 relative group`}
                  >
                    <Play className="w-4 h-4 text-white fill-white opacity-90 group-hover:scale-110 transition-transform ml-0.5" />
                  </div>

                  {/* Song & Artist details */}
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4
                        onClick={() => onSelectSong(index)}
                        className={`text-sm font-bold truncate cursor-pointer hover:underline ${
                          isCurrent ? 'text-cyan-300' : 'text-slate-100'
                        }`}
                      >
                        {song.title}
                      </h4>

                      {/* Pointer Tags */}
                      {isFront && (
                        <span className="px-1.5 py-0.5 text-[9px] font-mono font-extrabold bg-cyan-400 text-black rounded">
                          FRONT
                        </span>
                      )}
                      {isRear && (
                        <span className="px-1.5 py-0.5 text-[9px] font-mono font-extrabold bg-pink-500 text-white rounded">
                          REAR
                        </span>
                      )}
                      {song.priority === 'HIGH' && (
                        <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800 rounded">
                          HIGH
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 truncate">
                      {song.artist} • <span className="font-mono text-slate-500">{song.album}</span>
                    </p>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center space-x-2 shrink-0">
                  <span className="text-xs font-mono text-slate-400 hidden md:inline pr-2">
                    {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                  </span>

                  <button
                    onClick={() => onPlayNext(song)}
                    title="Play Next (Priority Queue)"
                    className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-amber-400 hover:border-amber-700/50 transition-colors"
                  >
                    <Zap className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onToggleFavorite(song)}
                    title="Toggle Favorite"
                    className={`p-2 rounded-xl border transition-colors ${
                      isFav
                        ? 'bg-rose-950/60 text-rose-400 border-rose-800/60'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-rose-400'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-400' : ''}`} />
                  </button>

                  <button
                    onClick={() => onRemoveSong(index)}
                    title="Dequeue / Remove from Circular Queue"
                    className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-800/60 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-800 rounded-3xl space-y-4">
          <div className="p-4 rounded-full bg-slate-900 text-slate-500">
            <ListMusic className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-300">
              No songs in the Circular Queue
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Enqueue songs to populate your circular playlist.
            </p>
          </div>
          <button
            onClick={onOpenAddModal}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white transition-all shadow-md shadow-cyan-600/20"
          >
            ADD FIRST SONG
          </button>
        </div>
      )}

    </div>
  );
};
