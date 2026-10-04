import React from 'react';
import {
  Music,
  ListMusic,
  History,
  Zap,
  HelpCircle,
  BarChart2,
  Bookmark,
  Layers,
  ArrowRightLeft
} from 'lucide-react';
import { ActiveTab, QueueState } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  queueState: QueueState;
  favoriteCount: number;
  stackCount: number;
  priorityCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  queueState,
  favoriteCount,
  stackCount,
  priorityCount
}) => {
  const navItems = [
    { id: 'player' as ActiveTab, label: 'Music Player', icon: Music, badge: null },
    { id: 'playlist' as ActiveTab, label: 'Circular Queue', icon: ListMusic, badge: `${queueState.size}/${queueState.capacity}` },
    { id: 'history' as ActiveTab, label: 'Recently Played', icon: History, badge: stackCount > 0 ? `${stackCount}` : null },
    { id: 'priority' as ActiveTab, label: 'Priority Queue', icon: Zap, badge: priorityCount > 0 ? `${priorityCount}` : null },
    { id: 'dsa' as ActiveTab, label: 'DSA Dashboard', icon: BarChart2, badge: 'O(1)' },
    { id: 'guide' as ActiveTab, label: 'How CQ Works', icon: HelpCircle, badge: 'VIVA' }
  ];

  return (
    <aside className="w-full lg:w-64 glass-panel border-r border-slate-800/80 flex flex-col justify-between p-4 shrink-0">
      <div className="space-y-6">

        {/* Navigation Heading */}
        <div>
          <h2 className="px-3 text-[11px] font-bold tracking-wider text-slate-400 uppercase font-mono">
            Navigation
          </h2>
          <nav className="mt-2 space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-md shadow-cyan-500/5'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 text-[10px] font-mono rounded-full ${
                        isActive
                          ? 'bg-cyan-400/20 text-cyan-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Live Queue Pointer Visualizer Box */}
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 font-mono flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              QUEUE STATE
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">
              {queueState.size === queueState.capacity ? 'FULL' : queueState.size === 0 ? 'EMPTY' : 'ACTIVE'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2 rounded-xl bg-slate-950/80 border border-cyan-500/30 flex flex-col items-center">
              <span className="text-[10px] text-cyan-400 font-bold">FRONT</span>
              <span className="text-sm font-extrabold text-cyan-300">
                {queueState.front === -1 ? 'N/A' : queueState.front}
              </span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/80 border border-pink-500/30 flex flex-col items-center">
              <span className="text-[10px] text-pink-400 font-bold">REAR</span>
              <span className="text-sm font-extrabold text-pink-300">
                {queueState.rear === -1 ? 'N/A' : queueState.rear}
              </span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col items-center">
              <span className="text-[10px] text-slate-400">SIZE</span>
              <span className="text-sm font-extrabold text-slate-200">{queueState.size}</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col items-center">
              <span className="text-[10px] text-slate-400">CAPACITY</span>
              <span className="text-sm font-extrabold text-slate-200">{queueState.capacity}</span>
            </div>
          </div>

          {/* Formula Peek */}
          <div className="p-2 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-[10px] font-mono text-cyan-300 text-center">
            <code>next = (idx + 1) % {queueState.capacity}</code>
          </div>
        </div>

      </div>

      {/* College Project Credit Footer */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 space-y-1">
        <div className="flex items-center space-x-1.5 font-bold text-slate-400">
          <ArrowRightLeft className="w-3.5 h-3.5 text-cyan-400" />
          <span>DSA Review Project</span>
        </div>
        <p className="text-[10px] text-slate-400">
          Circular Queue • Stack • Priority Queue • Hash Map
        </p>
      </div>
    </aside>
  );
};
