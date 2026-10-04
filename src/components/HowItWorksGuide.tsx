import React from 'react';
import { HelpCircle, ArrowRight, RotateCw, Play, Sparkles, CheckCircle2 } from 'lucide-react';

interface HowItWorksGuideProps {
  onRunDemoFlow: () => void;
}

export const HowItWorksGuide: React.FC<HowItWorksGuideProps> = ({ onRunDemoFlow }) => {
  return (
    <div className="w-full glass-panel rounded-3xl p-6 border border-slate-800/80 space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-800/60 text-cyan-400">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-100">
              HOW CIRCULAR QUEUE WORKS — EDUCATIONAL GUIDE
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              College Project Review & Viva Concepts
            </p>
          </div>
        </div>

        <button
          onClick={onRunDemoFlow}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl font-bold text-xs bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-lg shadow-amber-500/20 hover:scale-105 transition-all"
        >
          <Sparkles className="w-4 h-4 fill-black" />
          <span>RUN VIVA DEMO FLOW</span>
        </button>
      </div>

      {/* Linear vs Circular Queue Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">

        {/* Linear Queue */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between font-bold text-rose-400">
            <span>LINEAR QUEUE (Standard Array)</span>
            <span className="text-slate-500 text-[10px]">No Wraparound</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center space-x-2 text-slate-400">
            <span className="p-1.5 bg-slate-800 rounded">Song A</span>
            <ArrowRight className="w-3 h-3 text-slate-600" />
            <span className="p-1.5 bg-slate-800 rounded">Song B</span>
            <ArrowRight className="w-3 h-3 text-slate-600" />
            <span className="p-1.5 bg-slate-800 rounded">Song C</span>
            <ArrowRight className="w-3 h-3 text-slate-600" />
            <span className="p-1.5 bg-rose-950 text-rose-400 border border-rose-800 rounded">END</span>
          </div>

          <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
            In a standard Linear Queue, once the pointer reaches the end of the array, playback stops or requires shifting all elements. Space at the front of the array is wasted after dequeue.
          </p>
        </div>

        {/* Circular Queue */}
        <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/40 space-y-3">
          <div className="flex items-center justify-between font-bold text-cyan-300">
            <span>CIRCULAR QUEUE (Smart Music Player)</span>
            <span className="text-emerald-400 text-[10px]">Continuous Loop</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-cyan-800/60 flex items-center justify-center space-x-2 text-cyan-300 font-bold">
            <span className="p-1.5 bg-cyan-950 border border-cyan-700 rounded">Song A</span>
            <ArrowRight className="w-3 h-3 text-cyan-400" />
            <span className="p-1.5 bg-cyan-950 border border-cyan-700 rounded">Song B</span>
            <ArrowRight className="w-3 h-3 text-cyan-400" />
            <span className="p-1.5 bg-cyan-950 border border-cyan-700 rounded">Song C</span>
            <RotateCw className="w-4 h-4 text-emerald-400 animate-spin-slow ml-1" />
          </div>

          <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
            In a Circular Queue, the last element links directly back to the first element using modulo arithmetic <code className="text-cyan-300 font-mono">(curr + 1) % capacity</code>. Playback is infinite and space is reused efficiently!
          </p>
        </div>

      </div>

      {/* College Project Viva Demonstration Steps */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 font-mono">
        <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span>COLLEGE VIVA DEMO FLOW SEQUENCE</span>
        </h4>

        <ol className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px]">
          <li className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
            <span className="text-cyan-400 font-bold">STEP 1:</span> Enqueue songs into circular queue positions 0, 1, 2...
          </li>
          <li className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
            <span className="text-cyan-400 font-bold">STEP 2:</span> Play song and click NEXT to increment FRONT pointer.
          </li>
          <li className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
            <span className="text-emerald-400 font-bold">STEP 3:</span> Reach last song index and click NEXT to demonstrate <span className="text-cyan-300 font-bold">WRAP-AROUND → INDEX 0</span>.
          </li>
        </ol>
      </div>

    </div>
  );
};
