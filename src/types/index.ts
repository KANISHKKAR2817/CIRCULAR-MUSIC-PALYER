export type PriorityLevel = 'NORMAL' | 'HIGH';

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  artworkGradient: string;
  genre: string;
  synthFrequency?: number; // base frequency for synthesized preview
  synthPattern?: 'chill' | 'upbeat' | 'synthwave' | 'ambient';
  priority?: PriorityLevel;
  isFavorite?: boolean;
}

export interface QueueState {
  front: number;
  rear: number;
  size: number;
  capacity: number;
  currentIndex: number;
}

export interface DSAMathStep {
  operation: 'NEXT' | 'PREVIOUS' | 'ENQUEUE' | 'DEQUEUE' | 'WRAP_AROUND';
  formula: string;
  variables: Record<string, number | string>;
  resultIndex: number;
  description: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  type: 'ENQUEUE' | 'DEQUEUE' | 'TRAVERSAL' | 'STACK' | 'PRIORITY' | 'SEARCH' | 'SYSTEM';
  message: string;
  detail?: string;
  codeSnippet?: string;
}

export interface HashSearchResult {
  query: string;
  matches: Song[];
  hashKey: number;
  lookupTimeMs: number;
  timeComplexity: string;
  bucketIndex: number;
}

export type ActiveTab = 'player' | 'playlist' | 'dsa' | 'history' | 'priority' | 'guide';
