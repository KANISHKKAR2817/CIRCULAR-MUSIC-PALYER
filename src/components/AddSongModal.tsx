import React, { useState } from 'react';
import { Song, PriorityLevel } from '../types';
import { X, PlusCircle, Zap, Music, Heart } from 'lucide-react';

interface AddSongModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnqueue: (song: Song, priority: PriorityLevel) => void;
  onAddFavorite: (song: Song) => void;
}

const ARTWORK_THEMES = [
  { label: 'Cyan Cyber', gradient: 'from-cyan-500 via-blue-600 to-indigo-900', freq: 440, pattern: 'synthwave' },
  { label: 'Midnight Purple', gradient: 'from-violet-600 via-purple-700 to-slate-900', freq: 523, pattern: 'chill' },
  { label: 'Solar Amber', gradient: 'from-amber-500 via-rose-600 to-purple-900', freq: 329, pattern: 'ambient' },
  { label: 'Emerald Synth', gradient: 'from-emerald-500 via-teal-700 to-slate-950', freq: 587, pattern: 'upbeat' },
  { label: 'Rose Neon', gradient: 'from-fuchsia-600 via-pink-600 to-blue-900', freq: 392, pattern: 'synthwave' }
];

export const AddSongModal: React.FC<AddSongModalProps> = ({
  isOpen,
  onClose,
  onEnqueue,
  onAddFavorite
}) => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [album, setAlbum] = useState('');
  const [duration, setDuration] = useState(210);
  const [genre, setGenre] = useState('Electronic');
  const [selectedThemeIndex, setSelectedThemeIndex] = useState(0);

  if (!isOpen) return null;

  const handleSubmit = (priority: PriorityLevel) => {
    if (!title.trim() || !artist.trim()) return;

    const theme = ARTWORK_THEMES[selectedThemeIndex];
    const newSong: Song = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      artist: artist.trim(),
      album: album.trim() || 'Custom Single',
      duration: Number(duration) || 180,
      genre: genre.trim() || 'Electronic',
      artworkGradient: theme.gradient,
      synthFrequency: theme.freq,
      synthPattern: theme.pattern as any,
      priority
    };

    onEnqueue(newSong, priority);
    setTitle('');
    setArtist('');
    setAlbum('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-lg glass-panel rounded-3xl p-6 border border-slate-700 shadow-2xl space-y-6 animate-in fade-in zoom-in duration-200">

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <PlusCircle className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-extrabold text-slate-100">
              ENQUEUE NEW SONG TO CIRCULAR QUEUE
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inputs Form */}
        <div className="space-y-4 text-xs font-mono">
          <div>
            <label className="block text-slate-400 mb-1">SONG TITLE *</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Cybernetic Starlight"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500 font-sans"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">ARTIST *</label>
              <input
                type="text"
                value={artist}
                onChange={e => setArtist(e.target.value)}
                placeholder="e.g. Kairo"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500 font-sans"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">ALBUM</label>
              <input
                type="text"
                value={album}
                onChange={e => setAlbum(e.target.value)}
                placeholder="e.g. Horizon 2099"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500 font-sans"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">GENRE</label>
              <input
                type="text"
                value={genre}
                onChange={e => setGenre(e.target.value)}
                placeholder="e.g. Synthwave"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500 font-sans"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">DURATION (SECS)</label>
              <input
                type="number"
                value={duration}
                onChange={e => setDuration(Number(e.target.value))}
                min="30"
                max="600"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Theme Gradient Picker */}
          <div>
            <label className="block text-slate-400 mb-2">ARTWORK THEME & SOUND WAVE</label>
            <div className="grid grid-cols-5 gap-2">
              {ARTWORK_THEMES.map((theme, idx) => (
                <button
                  key={theme.label}
                  type="button"
                  onClick={() => setSelectedThemeIndex(idx)}
                  className={`h-10 rounded-xl bg-gradient-to-br ${theme.gradient} border-2 transition-all ${
                    selectedThemeIndex === idx
                      ? 'border-cyan-400 ring-2 ring-cyan-400/50 scale-105'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                  title={theme.label}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-4 border-t border-slate-800">
          <button
            onClick={() => handleSubmit('NORMAL')}
            disabled={!title.trim() || !artist.trim()}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white transition-all shadow-md shadow-cyan-600/20"
          >
            ADD TO QUEUE
          </button>
          <button
            onClick={() => handleSubmit('HIGH')}
            disabled={!title.trim() || !artist.trim()}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white transition-all shadow-md shadow-amber-600/20 flex items-center justify-center space-x-1"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>PLAY NEXT (HIGH PRIORITY)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
