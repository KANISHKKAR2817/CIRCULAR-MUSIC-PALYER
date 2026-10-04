import React, { useState, useEffect, useRef, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { Song, QueueState, DSAMathStep, LogEntry, ActiveTab, PriorityLevel } from './types';
import { CircularQueue } from './dataStructures/CircularQueue';
import { Stack } from './dataStructures/Stack';
import { PriorityQueue } from './dataStructures/PriorityQueue';
import { SongHashMap } from './dataStructures/SongHashMap';
import { SAMPLE_SONGS } from './data/sampleSongs';
import { AudioService } from './services/AudioService';
import { StorageService } from './services/StorageService';

import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MusicPlayer } from './components/MusicPlayer';
import { CircularQueueVisualizer } from './components/CircularQueueVisualizer';
import { DSAModePanel } from './components/DSAModePanel';
import { Playlist } from './components/Playlist';
import { StackPanel } from './components/StackPanel';
import { PriorityQueuePanel } from './components/PriorityQueuePanel';
import { HashMapSearchPanel } from './components/HashMapSearchPanel';
import { OperationLog } from './components/OperationLog';
import { ComplexityPanel } from './components/ComplexityPanel';
import { AddSongModal } from './components/AddSongModal';
import { HowItWorksGuide } from './components/HowItWorksGuide';
import { PresentationModeModal } from './components/PresentationModeModal';
import { ToastContainer, ToastMessage } from './components/ToastContainer';

export const App: React.FC = () => {
  // Persistent Singletons / Refs
  const audioService = useRef(new AudioService()).current;
  const cqRef = useRef(new CircularQueue(StorageService.getCapacity()));
  const stackRef = useRef(new Stack<Song>(20));
  const pqRef = useRef(new PriorityQueue());
  const hashMapRef = useRef(new SongHashMap());

  // Reactive State
  const [activeTab, setActiveTab] = useState<ActiveTab>('player');
  const [isDsaMode, setIsDsaMode] = useState<boolean>(false);
  const [isVivaMode, setIsVivaMode] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  const [queueState, setQueueState] = useState<QueueState>(cqRef.current.getState());
  const [queueArray, setQueueArray] = useState<(Song | null)[]>(cqRef.current.getArray());
  const [currentSong, setCurrentSong] = useState<Song | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'song' | 'queue'>('queue');
  const [isShuffle, setIsShuffle] = useState<boolean>(false);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [lastMathStep, setLastMathStep] = useState<DSAMathStep | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<string[]>(StorageService.getFavorites());

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Initialize Data Structures on mount
  useEffect(() => {
    const savedSongs = StorageService.getQueueSongs();
    const songsToLoad = savedSongs && savedSongs.length > 0 ? savedSongs : SAMPLE_SONGS.slice(0, 8);

    cqRef.current.loadSongs(songsToLoad);

    // Index all sample songs into Hash Map
    SAMPLE_SONGS.forEach(song => hashMapRef.current.insert(song));

    // Restore history stack
    const savedHistory = StorageService.getRecentlyPlayed();
    savedHistory.forEach(s => stackRef.current.push(s));

    updateAllStates();

    const initialCurrent = cqRef.current.getCurrentSong();
    if (initialCurrent) {
      setCurrentSong(initialCurrent);
    }

    addLog('SYSTEM', 'Smart Circular Queue Music Player initialized.', `Capacity: ${cqRef.current.getCapacity()} slots.`);
  }, []);

  // Synchronize state with data structures
  const updateAllStates = () => {
    setQueueState(cqRef.current.getState());
    setQueueArray(cqRef.current.getArray());
  };

  // Logging & Toast Helpers
  const addLog = (
    type: LogEntry['type'],
    message: string,
    detail?: string,
    codeSnippet?: string
  ) => {
    const newLog: LogEntry = {
      id: `log-${Date.now()}-${Math.random()}`,
      timestamp: new Date().toLocaleTimeString(),
      type,
      message,
      detail,
      codeSnippet
    };
    setLogs(prev => [newLog, ...prev.slice(0, 49)]);
  };

  const addToast = (type: ToastMessage['type'], title: string, detail?: string) => {
    const id = `toast-${Date.now()}`;
    const newToast: ToastMessage = { id, type, title, detail };
    setToasts(prev => [...prev.slice(-3), newToast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  // Audio Playback & Auto-Advance On Song End
  useEffect(() => {
    audioService.setOnEnded(() => {
      if (repeatMode === 'song' && currentSong) {
        audioService.play(currentSong);
      } else {
        handleNext(true);
      }
    });
  }, [currentSong, repeatMode]);

  // Handle Playback Toggle
  const handleTogglePlay = () => {
    if (!currentSong) {
      const first = cqRef.current.getCurrentSong();
      if (first) {
        setCurrentSong(first);
        audioService.play(first);
        setIsPlaying(true);
        stackRef.current.push(first);
      }
      return;
    }

    if (isPlaying) {
      audioService.pause();
      setIsPlaying(false);
      addLog('TRAVERSAL', `Paused playback`, `Song: "${currentSong.title}"`);
    } else {
      audioService.play(currentSong);
      setIsPlaying(true);
      stackRef.current.push(currentSong);
      addLog('TRAVERSAL', `Started playback`, `Song: "${currentSong.title}"`);
    }
  };

  // Handle NEXT operation (Priority Queue -> Circular Queue (curr + 1) % cap)
  const handleNext = (autoTriggered: boolean = false) => {
    // 1. Check Priority Queue first! High Priority songs override standard queue order
    const priorityItem = pqRef.current.dequeue();
    if (priorityItem) {
      const pSong = priorityItem.song;
      setCurrentSong(pSong);
      audioService.play(pSong);
      setIsPlaying(true);
      stackRef.current.push(pSong);

      addLog(
        'PRIORITY',
        `⚡ Played High Priority Song`,
        `"${pSong.title}" preempted normal circular queue order.`,
        `priorityQueue.dequeue() -> "${pSong.title}"`
      );
      addToast('priority', 'Playing High Priority Song', `"${pSong.title}" from Priority Queue`);
      updateAllStates();
      return;
    }

    // 2. Normal Circular Queue Traversal
    const res = cqRef.current.next();
    if (res.nextSong) {
      setCurrentSong(res.nextSong);
      if (isPlaying || autoTriggered) {
        audioService.play(res.nextSong);
        setIsPlaying(true);
      }

      stackRef.current.push(res.nextSong);

      const mathStep: DSAMathStep = {
        operation: res.wrapped ? 'WRAP_AROUND' : 'NEXT',
        formula: `nextIndex = (currentIndex + 1) % capacity`,
        variables: { currentIndex: cqRef.current.getCurrentIndex(), capacity: cqRef.current.getCapacity() },
        resultIndex: res.nextIndex,
        description: res.wrapped
          ? `Queue wrapped around from last slot back to index #${res.nextIndex}!`
          : `Advanced to index #${res.nextIndex} using index arithmetic.`
      };
      setLastMathStep(mathStep);

      addLog(
        res.wrapped ? 'TRAVERSAL' : 'TRAVERSAL',
        res.wrapped ? `🔄 WRAP-AROUND! Next index wrapped to #${res.nextIndex}` : `✓ NEXT → Index #${res.nextIndex}`,
        `Now Playing: "${res.nextSong.title}" by ${res.nextSong.artist}`,
        `nextIndex = ${res.formula}`
      );

      if (res.wrapped) {
        addToast(
          'wrap',
          'Queue wrapped around → returning to first song',
          `Index wrapped to #0. Continuous circular playback demonstrated!`
        );
        // Trigger celebratory confetti for Viva wrap-around wow moment!
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
      }

      updateAllStates();
    }
  };

  // Handle PREVIOUS operation ((curr - 1 + cap) % cap)
  const handlePrevious = () => {
    const res = cqRef.current.previous();
    if (res.prevSong) {
      setCurrentSong(res.prevSong);
      if (isPlaying) {
        audioService.play(res.prevSong);
      }

      stackRef.current.push(res.prevSong);

      const mathStep: DSAMathStep = {
        operation: 'PREVIOUS',
        formula: `prevIndex = (currentIndex - 1 + capacity) % capacity`,
        variables: { currentIndex: cqRef.current.getCurrentIndex(), capacity: cqRef.current.getCapacity() },
        resultIndex: res.prevIndex,
        description: `Moved backward to index #${res.prevIndex}.`
      };
      setLastMathStep(mathStep);

      addLog(
        'TRAVERSAL',
        `✓ PREVIOUS → Index #${res.prevIndex}`,
        `Now Playing: "${res.prevSong.title}"`,
        `prevIndex = ${res.formula}`
      );

      updateAllStates();
    }
  };

  // Enqueue Song
  const handleEnqueue = (song: Song, priority: PriorityLevel = 'NORMAL') => {
    if (priority === 'HIGH') {
      pqRef.current.enqueue(song, 'HIGH');
      addLog('PRIORITY', `⚡ Enqueued to High Priority Queue`, `Song: "${song.title}"`);
      addToast('priority', 'Added to Priority Queue', `"${song.title}" will play next`);
    } else {
      const res = cqRef.current.enqueue(song);
      if (res.success) {
        hashMapRef.current.insert(song);
        StorageService.saveQueueSongs(cqRef.current.getActiveQueue().map(i => i.song));

        addLog(
          'ENQUEUE',
          `✓ ENQUEUE → "${song.title}" at Index #${res.index}`,
          `Rear updated to #${res.index}, Queue Size: ${cqRef.current.getSize()}/${cqRef.current.getCapacity()}`,
          `rear = (rear + 1) % capacity`
        );
        addToast('enqueue', 'Song Enqueued to Circular Queue', `"${song.title}" placed at index #${res.index}`);
      } else {
        addToast('info', 'Circular Queue Full', `Cannot enqueue. Maximum capacity (${cqRef.current.getCapacity()}) reached.`);
      }
    }

    updateAllStates();
  };

  // Dequeue / Remove Song
  const handleRemoveSong = (index: number) => {
    const res = cqRef.current.removeAtIndex(index);
    if (res.success && res.song) {
      StorageService.saveQueueSongs(cqRef.current.getActiveQueue().map(i => i.song));

      addLog(
        'DEQUEUE',
        `✓ DEQUEUE / REMOVE → "${res.song.title}" from Index #${index}`,
        `Queue Size updated to ${cqRef.current.getSize()}/${cqRef.current.getCapacity()}`
      );
      addToast('dequeue', 'Song Dequeued', `Removed "${res.song.title}" from slot #${index}`);

      if (cqRef.current.isEmpty()) {
        setCurrentSong(null);
        audioService.pause();
        setIsPlaying(false);
      } else {
        const curr = cqRef.current.getCurrentSong();
        if (curr) setCurrentSong(curr);
      }
    }
    updateAllStates();
  };

  // Jump directly to node index
  const handleSelectNode = (index: number) => {
    if (cqRef.current.setCurrentIndex(index)) {
      const song = cqRef.current.getCurrentSong();
      if (song) {
        setCurrentSong(song);
        audioService.play(song);
        setIsPlaying(true);
        stackRef.current.push(song);
        addLog('TRAVERSAL', `Jumped to Index #${index}`, `Now Playing: "${song.title}"`);
      }
      updateAllStates();
    }
  };

  // Shuffle Queue
  const handleShuffle = () => {
    cqRef.current.shuffleActive();
    setIsShuffle(!isShuffle);
    addLog('SYSTEM', '🔀 Circular Queue Shuffled', 'Circular Queue integrity preserved — playback order randomized.');
    addToast('info', 'Circular Queue Shuffled', 'Playback order randomized while preserving circular structure.');
    updateAllStates();
  };

  // Capacity Resize
  const handleResizeCapacity = (newCap: number) => {
    if (cqRef.current.resizeCapacity(newCap)) {
      StorageService.saveCapacity(newCap);
      addLog('SYSTEM', `Capacity Resized to ${newCap}`, `1D Array memory expanded to ${newCap} slots.`);
      addToast('info', 'Capacity Updated', `Circular Queue capacity changed to ${newCap}`);
      updateAllStates();
    }
  };

  // Toggle Favorite
  const handleToggleFavorite = (song: Song) => {
    setFavoriteIds(prev => {
      const exists = prev.includes(song.id);
      const updated = exists ? prev.filter(id => id !== song.id) : [...prev, song.id];
      StorageService.saveFavorites(updated);
      addToast('favorite', exists ? 'Removed from Favorites' : 'Added to Favorites', song.title);
      return updated;
    });
  };

  // Run College Presentation Demo Flow Sequence
  const handleRunDemoFlow = () => {
    addToast('wrap', '🎓 Starting College Presentation Demo Flow!', 'Auto-executing circular queue traversal...');

    // Load standard 4 demo songs
    cqRef.current.resizeCapacity(8);
    cqRef.current.loadSongs(SAMPLE_SONGS.slice(0, 4));
    updateAllStates();

    // Step 1: Select first song
    handleSelectNode(0);

    // Step 2: Step Next twice
    setTimeout(() => handleNext(true), 1200);
    setTimeout(() => handleNext(true), 2400);

    // Step 3: Step Next -> WRAP AROUND!
    setTimeout(() => {
      handleNext(true);
      setIsVivaMode(true);
    }, 3600);
  };

  // Hash Search Results
  const searchResult = useMemo(() => {
    if (!searchQuery) return null;
    return hashMapRef.current.search(searchQuery);
  }, [searchQuery]);

  // Keyboard Shortcuts Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrevious();
      } else if (e.code === 'KeyD') {
        setIsDsaMode(prev => !prev);
      } else if (e.code === 'KeyP') {
        setIsVivaMode(prev => !prev);
      } else if (e.code === 'KeyF' && currentSong) {
        handleToggleFavorite(currentSong);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSong, isPlaying]);

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">

      {/* Top Navigation */}
      <Navbar
        queueState={queueState}
        isDsaMode={isDsaMode}
        setIsDsaMode={setIsDsaMode}
        isVivaMode={isVivaMode}
        setIsVivaMode={setIsVivaMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onRunDemoFlow={handleRunDemoFlow}
      />

      {/* Main Grid Content */}
      <div className="flex-1 flex flex-col lg:flex-row w-full max-w-[1600px] mx-auto p-4 lg:p-6 gap-6">

        {/* Left Sidebar Menu */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          queueState={queueState}
          favoriteCount={favoriteIds.length}
          stackCount={stackRef.current.size()}
          priorityCount={pqRef.current.size()}
        />

        {/* Main Central View Dashboard */}
        <main className="flex-1 flex flex-col space-y-6 min-w-0">

          {/* Hash Map Search Panel (if search query active) */}
          {searchQuery && (
            <HashMapSearchPanel
              searchResult={searchResult}
              onPlaySong={song => {
                cqRef.current.enqueue(song);
                const idx = cqRef.current.getRear();
                handleSelectNode(idx);
                setSearchQuery('');
              }}
              onEnqueueSong={song => {
                handleEnqueue(song, 'NORMAL');
                setSearchQuery('');
              }}
            />
          )}

          {/* DSA Mode Educational Overview */}
          {isDsaMode && (
            <DSAModePanel
              queueArray={queueArray}
              queueState={queueState}
              lastMathStep={lastMathStep}
              onResizeCapacity={handleResizeCapacity}
              onSelectIndex={handleSelectNode}
            />
          )}

          {/* View Tab Routing */}
          {activeTab === 'player' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Music Player Hero (7 cols) */}
              <div className="lg:col-span-6 xl:col-span-5">
                <MusicPlayer
                  currentSong={currentSong}
                  isPlaying={isPlaying}
                  onTogglePlay={handleTogglePlay}
                  onNext={() => handleNext()}
                  onPrevious={handlePrevious}
                  isShuffle={isShuffle}
                  onToggleShuffle={handleShuffle}
                  repeatMode={repeatMode}
                  onCycleRepeat={() => {
                    const modes: ('off' | 'song' | 'queue')[] = ['off', 'song', 'queue'];
                    const nextMode = modes[(modes.indexOf(repeatMode) + 1) % modes.length];
                    setRepeatMode(nextMode);
                  }}
                  isFavorite={currentSong ? favoriteIds.includes(currentSong.id) : false}
                  onToggleFavorite={handleToggleFavorite}
                  onPlayNext={song => handleEnqueue(song, 'HIGH')}
                  audioService={audioService}
                  queueState={queueState}
                />
              </div>

              {/* Circular Queue Centerpiece Visualizer (5 cols) */}
              <div className="lg:col-span-6 xl:col-span-7">
                <CircularQueueVisualizer
                  queueArray={queueArray}
                  queueState={queueState}
                  currentSong={currentSong}
                  onSelectNode={handleSelectNode}
                  onRemoveNode={handleRemoveSong}
                  onPlayNextNode={song => handleEnqueue(song, 'HIGH')}
                />
              </div>
            </div>
          )}

          {activeTab === 'playlist' && (
            <Playlist
              queueArray={queueArray}
              queueState={queueState}
              onSelectSong={handleSelectNode}
              onRemoveSong={handleRemoveSong}
              onPlayNext={song => handleEnqueue(song, 'HIGH')}
              onToggleFavorite={handleToggleFavorite}
              favoriteIds={favoriteIds}
              onOpenAddModal={() => setIsAddModalOpen(true)}
            />
          )}

          {activeTab === 'history' && (
            <StackPanel
              stack={stackRef.current}
              onPlaySong={song => {
                cqRef.current.enqueue(song);
                const idx = cqRef.current.getRear();
                handleSelectNode(idx);
              }}
              onPopStack={() => {
                stackRef.current.pop();
                updateAllStates();
                addToast('info', 'Popped Top Song from History Stack');
              }}
              onClearStack={() => {
                stackRef.current.clear();
                updateAllStates();
              }}
            />
          )}

          {activeTab === 'priority' && (
            <PriorityQueuePanel
              priorityQueue={pqRef.current}
              onPlaySong={song => {
                setCurrentSong(song);
                audioService.play(song);
                setIsPlaying(true);
                stackRef.current.push(song);
              }}
              onRemovePriority={id => {
                pqRef.current.remove(id);
                updateAllStates();
              }}
            />
          )}

          {activeTab === 'dsa' && (
            <div className="space-y-6">
              <ComplexityPanel />
              <OperationLog logs={logs} onClearLogs={() => setLogs([])} />
            </div>
          )}

          {activeTab === 'guide' && (
            <HowItWorksGuide onRunDemoFlow={handleRunDemoFlow} />
          )}

          {/* Bottom Shared Panels for Player Tab */}
          {activeTab === 'player' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <OperationLog logs={logs} onClearLogs={() => setLogs([])} />
              <ComplexityPanel />
            </div>
          )}

        </main>
      </div>

      {/* Add Song Modal */}
      <AddSongModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onEnqueue={handleEnqueue}
        onAddFavorite={handleToggleFavorite}
      />

      {/* Presentation Mode Viva Overlay */}
      <PresentationModeModal
        isOpen={isVivaMode}
        onClose={() => setIsVivaMode(false)}
        queueState={queueState}
        currentSong={currentSong}
        lastMathStep={lastMathStep}
        onNext={() => handleNext()}
        onPrevious={handlePrevious}
        onTogglePlay={handleTogglePlay}
        isPlaying={isPlaying}
      />

      {/* Dynamic Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={id => setToasts(prev => prev.filter(t => t.id !== id))} />

    </div>
  );
};
