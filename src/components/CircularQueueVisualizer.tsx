import React, { useMemo } from 'react';
import { Song, QueueState } from '../types';
import { Play, SkipForward, SkipBack, Trash2, Zap, Radio, CornerDownRight } from 'lucide-react';

interface CircularQueueVisualizerProps {
  queueArray: (Song | null)[];
  queueState: QueueState;
  currentSong: Song | null;
  onSelectNode: (index: number) => void;
  onRemoveNode: (index: number) => void;
  onPlayNextNode: (song: Song) => void;
}

export const CircularQueueVisualizer: React.FC<CircularQueueVisualizerProps> = ({
  queueArray,
  queueState,
  currentSong,
  onSelectNode,
  onRemoveNode,
  onPlayNextNode
}) => {
  const { capacity, front, rear, currentIndex, size } = queueState;

  // Calculate coordinates for nodes around the circular ring
  const nodes = useMemo(() => {
    const radius = 170; // Ring radius
    const centerX = 220;
    const centerY = 220;

    return queueArray.map((song, i) => {
      // Angle starting from top (-pi/2)
      const angle = (i * 2 * Math.PI) / capacity - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      // Arrow path destination to next node angle
      const nextAngle = ((i + 1) * 2 * Math.PI) / capacity - Math.PI / 2;
      const arrowStartX = centerX + (radius - 10) * Math.cos(angle + 0.22);
      const arrowStartY = centerY + (radius - 10) * Math.sin(angle + 0.22);
      const arrowEndX = centerX + (radius - 10) * Math.cos(nextAngle - 0.22);
      const arrowEndY = centerY + (radius - 10) * Math.sin(nextAngle - 0.22);

      return {
        index: i,
        song,
        x,
        y,
        angle,
        arrowStartX,
        arrowStartY,
        arrowEndX,
        arrowEndY,
        isFront: i === front,
        isRear: i === rear,
        isCurrent: i === currentIndex,
        isEmpty: song === null
      };
    });
  }, [queueArray, capacity, front, rear, currentIndex]);

  return (
    <div className="relative w-full glass-panel rounded-3xl p-6 border border-slate-800/80 flex flex-col items-center justify-center overflow-hidden min-h-[480px]">

      {/* Header Info */}
      <div className="absolute top-4 left-6 flex items-center space-x-2">
        <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
        <span className="text-xs font-mono font-bold tracking-wider text-slate-300 uppercase">
          Circular Queue Map ({size}/{capacity})
        </span>
      </div>

      {/* Front & Rear Pointer Badges at Top Right */}
      <div className="absolute top-4 right-6 flex items-center space-x-3 text-[11px] font-mono">
        <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-cyan-950/70 border border-cyan-500/40 rounded-full text-cyan-300 font-bold">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>FRONT: {front === -1 ? 'NONE' : front}</span>
        </div>
        <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-pink-950/70 border border-pink-500/40 rounded-full text-pink-300 font-bold">
          <span className="w-2 h-2 rounded-full bg-pink-400" />
          <span>REAR: {rear === -1 ? 'NONE' : rear}</span>
        </div>
      </div>

      {/* SVG Ring and Nodes */}
      <div className="relative w-[440px] h-[440px] flex items-center justify-center my-4">

        <svg className="w-full h-full absolute inset-0 pointer-events-none" viewBox="0 0 440 440">
          <defs>
            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#ec4899" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#818cf8" stopOpacity="0.4" />
            </linearGradient>
            <marker
              id="arrowhead"
              markerWidth="8"
              markerHeight="6"
              refX="6"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 8 3, 0 6" fill="#38bdf8" opacity="0.8" />
            </marker>
          </defs>

          {/* Background Circular Ring Track */}
          <circle
            cx="220"
            cy="220"
            r="170"
            fill="none"
            stroke="url(#ringGrad)"
            strokeWidth="3"
            strokeDasharray="6 6"
          />

          {/* Directional Connecting Arrows */}
          {nodes.map((node) => (
            <g key={`arrow-${node.index}`}>
              <line
                x1={node.arrowStartX}
                y1={node.arrowStartY}
                x2={node.arrowEndX}
                y2={node.arrowEndY}
                stroke="#38bdf8"
                strokeWidth="2"
                strokeOpacity={node.isEmpty ? "0.2" : "0.7"}
                markerEnd="url(#arrowhead)"
              />
            </g>
          ))}
        </svg>

        {/* Center Now Playing Core */}
        <div className="relative z-10 w-44 h-44 rounded-full bg-slate-950/90 border border-slate-800 flex flex-col items-center justify-center p-4 text-center shadow-2xl shadow-cyan-950/40">
          {currentSong ? (
            <>
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${currentSong.artworkGradient} flex items-center justify-center shadow-md mb-2 animate-pulse`}>
                <Play className="w-5 h-5 text-white fill-white ml-0.5" />
              </div>
              <p className="text-xs font-bold text-slate-100 truncate max-w-[130px]" title={currentSong.title}>
                {currentSong.title}
              </p>
              <p className="text-[10px] text-slate-400 truncate max-w-[120px]">
                {currentSong.artist}
              </p>
              <span className="mt-1.5 px-2 py-0.5 text-[9px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800/60 rounded-full">
                INDEX {currentIndex}
              </span>
            </>
          ) : (
            <div className="text-slate-500 text-xs font-mono">
              Queue Empty
            </div>
          )}
        </div>

        {/* Nodes Placed Around Ring */}
        {nodes.map((node) => {
          const isSelected = node.isCurrent;
          const bgGradient = node.song?.artworkGradient || 'from-slate-800 to-slate-900';

          return (
            <div
              key={`node-${node.index}`}
              style={{
                left: `${node.x}px`,
                top: `${node.y}px`,
                transform: 'translate(-50%, -50%)'
              }}
              className="absolute z-20 transition-all duration-500 ease-out group"
            >
              {/* Pointer Indicator Labels Above Node */}
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex items-center space-x-1 whitespace-nowrap pointer-events-none">
                {node.isFront && (
                  <span className="px-1.5 py-0.5 text-[9px] font-mono font-extrabold bg-cyan-400 text-black rounded shadow-md glow-cyan animate-bounce">
                    FRONT ↓
                  </span>
                )}
                {node.isRear && (
                  <span className="px-1.5 py-0.5 text-[9px] font-mono font-extrabold bg-pink-500 text-white rounded shadow-md glow-magenta">
                    REAR ↓
                  </span>
                )}
              </div>

              {/* Node Circular Button */}
              <button
                onClick={() => onSelectNode(node.index)}
                disabled={node.isEmpty}
                className={`relative flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 ${
                  node.isEmpty
                    ? 'bg-slate-900/60 border-2 border-dashed border-slate-700 text-slate-600 cursor-not-allowed'
                    : isSelected
                    ? `bg-gradient-to-br ${bgGradient} text-white shadow-xl shadow-cyan-500/40 ring-4 ring-cyan-400 scale-110 z-30`
                    : `bg-gradient-to-br ${bgGradient} text-slate-200 border border-slate-700 hover:scale-105 shadow-md`
                }`}
              >
                {/* Slot Index Badge */}
                <span
                  className={`absolute -bottom-1 -right-1 px-1.5 py-0.5 text-[9px] font-mono font-bold rounded-md shadow-sm ${
                    isSelected
                      ? 'bg-cyan-400 text-black'
                      : node.isEmpty
                      ? 'bg-slate-800 text-slate-500'
                      : 'bg-slate-950/90 text-slate-300 border border-slate-700'
                  }`}
                >
                  [{node.index}]
                </span>

                {node.song ? (
                  <div className="flex flex-col items-center text-center p-1">
                    <span className="text-[10px] font-bold truncate max-w-[48px] leading-tight">
                      {node.song.title}
                    </span>
                  </div>
                ) : (
                  <span className="text-[10px] font-mono font-medium">EMPTY</span>
                )}
              </button>

              {/* Hover Quick Actions Menu */}
              {!node.isEmpty && node.song && (
                <div className="absolute top-16 left-1/2 -translate-x-1/2 hidden group-hover:flex items-center space-x-1 p-1 bg-slate-900/95 border border-slate-700 rounded-xl shadow-xl z-40">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectNode(node.index);
                    }}
                    title="Play Now"
                    className="p-1.5 rounded-lg bg-cyan-600/80 hover:bg-cyan-500 text-white transition-colors"
                  >
                    <Play className="w-3 h-3 fill-white" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlayNextNode(node.song!);
                    }}
                    title="Play Next (Priority Queue)"
                    className="p-1.5 rounded-lg bg-amber-600/80 hover:bg-amber-500 text-white transition-colors"
                  >
                    <Zap className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveNode(node.index);
                    }}
                    title="Remove from Circular Queue"
                    className="p-1.5 rounded-lg bg-rose-600/80 hover:bg-rose-500 text-white transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              )}

            </div>
          );
        })}

      </div>

      {/* Footer Visual Circular Traversal Formula */}
      <div className="w-full mt-2 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-slate-400">
        <div className="flex items-center space-x-2">
          <CornerDownRight className="w-3.5 h-3.5 text-cyan-400" />
          <span>CIRCULAR TRAVERSAL:</span>
          <span className="text-cyan-300 font-bold">
            Song 0 → Song 1 → ... → Song {capacity - 1} → Song 0
          </span>
        </div>
        <div className="text-slate-400 text-[10px]">
          Formula: <code className="text-emerald-400 font-bold">(curr + 1) % {capacity}</code>
        </div>
      </div>

    </div>
  );
};
