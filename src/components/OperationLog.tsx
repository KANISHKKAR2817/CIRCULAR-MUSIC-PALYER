import React, { useState } from 'react';
import { LogEntry } from '../types';
import { Terminal, CheckCircle2, RefreshCw, Trash2, ArrowUpRight } from 'lucide-react';

interface OperationLogProps {
  logs: LogEntry[];
  onClearLogs: () => void;
}

export const OperationLog: React.FC<OperationLogProps> = ({ logs, onClearLogs }) => {
  const [filterType, setFilterType] = useState<string>('ALL');

  const filteredLogs = logs.filter(log => {
    if (filterType === 'ALL') return true;
    return log.type === filterType;
  });

  return (
    <div className="w-full glass-panel rounded-3xl p-6 border border-slate-800/80 space-y-4 font-mono">

      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-extrabold text-slate-100 uppercase tracking-wider">
            DSA Operation Console Log
          </h3>
          <span className="px-2 py-0.5 text-[10px] bg-slate-900 text-cyan-300 rounded-full border border-slate-800">
            {logs.length} Events
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Filters */}
          <div className="flex items-center space-x-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-[10px]">
            {['ALL', 'ENQUEUE', 'DEQUEUE', 'TRAVERSAL', 'STACK'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  filterType === type
                    ? 'bg-cyan-500 text-black shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <button
            onClick={onClearLogs}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors"
            title="Clear Console Logs"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Console Output Area */}
      <div className="h-52 overflow-y-auto space-y-1.5 p-3 rounded-2xl bg-slate-950/90 border border-slate-900 text-xs">
        {filteredLogs.length > 0 ? (
          filteredLogs.map(log => {
            const isWrap = log.type === 'TRAVERSAL' && log.message.includes('WRAP-AROUND');
            return (
              <div
                key={log.id}
                className={`flex items-start space-x-2 p-1.5 rounded-lg transition-colors ${
                  isWrap
                    ? 'bg-amber-950/40 text-amber-300 border border-amber-800/40'
                    : log.type === 'ENQUEUE'
                    ? 'text-cyan-300 hover:bg-slate-900/60'
                    : log.type === 'DEQUEUE'
                    ? 'text-pink-300 hover:bg-slate-900/60'
                    : log.type === 'STACK'
                    ? 'text-violet-300 hover:bg-slate-900/60'
                    : 'text-slate-300 hover:bg-slate-900/60'
                }`}
              >
                <span className="text-[10px] text-slate-500 shrink-0 select-none">
                  [{log.timestamp}]
                </span>

                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center space-x-1.5 font-bold">
                    <span>{log.message}</span>
                  </div>
                  {log.detail && (
                    <p className="text-[10px] text-slate-400 leading-tight font-normal">
                      {log.detail}
                    </p>
                  )}
                  {log.codeSnippet && (
                    <code className="block text-[10px] text-emerald-400 bg-slate-900 p-1 rounded border border-slate-800 mt-1">
                      {log.codeSnippet}
                    </code>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-slate-600 text-center py-16">
            Console ready. Perform playback or queue operations to inspect live log events.
          </div>
        )}
      </div>

    </div>
  );
};
