import React from 'react';
import { Play, Search, PlusCircle, GraduationCap, Cpu, Music, Sparkles } from 'lucide-react';
import { QueueState } from '../types';

interface NavbarProps {
  queueState: QueueState;
  isDsaMode: boolean;
  setIsDsaMode: (val: boolean) => void;
  isVivaMode: boolean;
  setIsVivaMode: (val: boolean) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  onOpenAddModal: () => void;
  onRunDemoFlow: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  queueState,
  isDsaMode,
  setIsDsaMode,
  isVivaMode,
  setIsVivaMode,
  searchQuery,
  setSearchQuery,
  onOpenAddModal,
  onRunDemoFlow
}) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">

        {/* Logo & Project Title */}
        <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
              <Play className="w-5 h-5 text-black fill-black ml-0.5" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-cyan-400 via-sky-200 to-blue-400 bg-clip-text text-transparent">
                  SMART CIRCULAR PLAYER
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800/60 rounded-full">
                  DSA v2.0
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">
                Circular Queue Playlist & Data Structure Visualizer
              </p>
            </div>
          </div>

          {/* Mobile Add button */}
          <button
            onClick={onOpenAddModal}
            className="md:hidden p-2 rounded-lg bg-cyan-600 text-white hover:bg-cyan-500 transition-colors"
          >
            <PlusCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Center Search Bar (Hash Map Search) */}
        <div className="relative w-full md:w-72 lg:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Hash Search (O(1)) Title, Artist..."
            className="w-full bg-slate-900/90 text-sm text-slate-200 placeholder-slate-500 rounded-xl pl-9 pr-24 py-2 border border-slate-800 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono font-semibold px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded">
            O(1) Map
          </span>
        </div>

        {/* Mode Switchers & Actions */}
        <div className="flex items-center space-x-2 w-full md:w-auto justify-end overflow-x-auto pb-1 md:pb-0">

          {/* Mode Toggles */}
          <div className="flex items-center p-1 bg-slate-900/90 rounded-xl border border-slate-800">
            <button
              onClick={() => setIsDsaMode(false)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                !isDsaMode
                  ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Music className="w-3.5 h-3.5" />
              <span>MUSIC</span>
            </button>
            <button
              onClick={() => setIsDsaMode(true)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isDsaMode
                  ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>DSA MODE</span>
            </button>
          </div>

          {/* Viva Presentation Mode Button */}
          <button
            onClick={() => setIsVivaMode(!isVivaMode)}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
              isVivaMode
                ? 'bg-amber-500 text-black border-amber-400 shadow-lg shadow-amber-500/20'
                : 'bg-amber-950/40 text-amber-300 border-amber-700/50 hover:bg-amber-900/50'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span className="hidden sm:inline">🎓 VIVA MODE</span>
          </button>

          {/* Demo Walkthrough Button */}
          <button
            onClick={onRunDemoFlow}
            className="flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-medium bg-indigo-950/50 text-indigo-300 border border-indigo-700/40 hover:bg-indigo-900/60 transition-all"
            title="Run College Demo Presentation Steps"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden lg:inline">DEMO FLOW</span>
          </button>

          {/* Add Song Button */}
          <button
            onClick={onOpenAddModal}
            className="hidden md:flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white transition-all shadow-md shadow-cyan-600/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>ENQUEUE</span>
          </button>
        </div>

      </div>
    </header>
  );
};
