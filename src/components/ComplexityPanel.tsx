import React from 'react';
import { Cpu, Zap, Layers, Hash, Sparkles } from 'lucide-react';

export const ComplexityPanel: React.FC = () => {
  return (
    <div className="w-full glass-panel rounded-3xl p-6 border border-slate-800/80 space-y-4">

      <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
        <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-extrabold text-slate-100 uppercase tracking-wider">
            ALGORITHM TIME & SPACE COMPLEXITY
          </h3>
          <p className="text-xs text-slate-400 font-mono">
            College Presentation Viva Reference Matrix
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">

        {/* Circular Queue */}
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between font-bold text-cyan-400">
            <span className="flex items-center space-x-1.5">
              <Cpu className="w-3.5 h-3.5" />
              <span>CIRCULAR QUEUE</span>
            </span>
            <span className="text-emerald-400">O(1)</span>
          </div>
          <div className="space-y-1 text-slate-300">
            <div className="flex justify-between"><span>Enqueue:</span><span className="text-emerald-400 font-bold">O(1)</span></div>
            <div className="flex justify-between"><span>Dequeue:</span><span className="text-emerald-400 font-bold">O(1)</span></div>
            <div className="flex justify-between"><span>Next / Prev:</span><span className="text-emerald-400 font-bold">O(1)</span></div>
            <div className="flex justify-between"><span>Peek:</span><span className="text-emerald-400 font-bold">O(1)</span></div>
            <div className="flex justify-between border-t border-slate-800 pt-1 text-[10px] text-slate-400"><span>Space:</span><span className="text-cyan-300">O(N) Fixed</span></div>
          </div>
        </div>

        {/* Stack */}
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between font-bold text-violet-400">
            <span className="flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>STACK</span>
            </span>
            <span className="text-emerald-400">O(1)</span>
          </div>
          <div className="space-y-1 text-slate-300">
            <div className="flex justify-between"><span>Push:</span><span className="text-emerald-400 font-bold">O(1)</span></div>
            <div className="flex justify-between"><span>Pop:</span><span className="text-emerald-400 font-bold">O(1)</span></div>
            <div className="flex justify-between"><span>Peek:</span><span className="text-emerald-400 font-bold">O(1)</span></div>
            <div className="flex justify-between border-t border-slate-800 pt-1 text-[10px] text-slate-400"><span>Space:</span><span className="text-violet-300">O(M) History</span></div>
          </div>
        </div>

        {/* Priority Queue */}
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between font-bold text-amber-400">
            <span className="flex items-center space-x-1.5">
              <Zap className="w-3.5 h-3.5" />
              <span>PRIORITY QUEUE</span>
            </span>
            <span className="text-amber-300">O(log N)</span>
          </div>
          <div className="space-y-1 text-slate-300">
            <div className="flex justify-between"><span>Insert:</span><span className="text-amber-400 font-bold">O(log N)</span></div>
            <div className="flex justify-between"><span>Remove Max:</span><span className="text-emerald-400 font-bold">O(1)</span></div>
            <div className="flex justify-between"><span>Peek Top:</span><span className="text-emerald-400 font-bold">O(1)</span></div>
            <div className="flex justify-between border-t border-slate-800 pt-1 text-[10px] text-slate-400"><span>Space:</span><span className="text-amber-300">O(K) Priority</span></div>
          </div>
        </div>

        {/* Hash Map */}
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between font-bold text-cyan-400">
            <span className="flex items-center space-x-1.5">
              <Hash className="w-3.5 h-3.5" />
              <span>HASH MAP</span>
            </span>
            <span className="text-emerald-400">O(1) Avg</span>
          </div>
          <div className="space-y-1 text-slate-300">
            <div className="flex justify-between"><span>Hash Lookup:</span><span className="text-emerald-400 font-bold">O(1) Avg</span></div>
            <div className="flex justify-between"><span>Insert Song:</span><span className="text-emerald-400 font-bold">O(1)</span></div>
            <div className="flex justify-between"><span>Worst Case:</span><span className="text-slate-400">O(N) Collision</span></div>
            <div className="flex justify-between border-t border-slate-800 pt-1 text-[10px] text-slate-400"><span>Hash Buckets:</span><span className="text-cyan-300">31 Buckets</span></div>
          </div>
        </div>

      </div>

    </div>
  );
};
