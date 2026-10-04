import React from 'react';
import { RotateCw, CheckCircle2, AlertCircle, Info, Zap } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'wrap' | 'enqueue' | 'dequeue' | 'priority' | 'favorite' | 'info';
  title: string;
  detail?: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none">
      {toasts.map(t => {
        const isWrap = t.type === 'wrap';
        return (
          <div
            key={t.id}
            onClick={() => onDismiss(t.id)}
            className={`pointer-events-auto flex items-start space-x-3 p-3.5 rounded-2xl border shadow-xl backdrop-blur-xl transition-all animate-in slide-in-from-bottom-5 duration-300 cursor-pointer ${
              isWrap
                ? 'bg-amber-950/90 text-amber-200 border-amber-500/80 shadow-amber-500/20 ring-2 ring-amber-500/50'
                : t.type === 'enqueue'
                ? 'bg-cyan-950/90 text-cyan-200 border-cyan-500/60 shadow-cyan-500/10'
                : t.type === 'priority'
                ? 'bg-purple-950/90 text-purple-200 border-purple-500/60'
                : 'bg-slate-900/90 text-slate-100 border-slate-800'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isWrap ? (
                <RotateCw className="w-5 h-5 text-amber-400 animate-spin-slow" />
              ) : t.type === 'enqueue' ? (
                <CheckCircle2 className="w-5 h-5 text-cyan-400" />
              ) : t.type === 'priority' ? (
                <Zap className="w-5 h-5 text-purple-400" />
              ) : (
                <Info className="w-5 h-5 text-blue-400" />
              )}
            </div>

            <div className="flex-1 text-xs font-mono">
              <h5 className="font-bold leading-snug">{t.title}</h5>
              {t.detail && (
                <p className="text-[11px] opacity-80 mt-0.5 leading-tight font-sans">
                  {t.detail}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
