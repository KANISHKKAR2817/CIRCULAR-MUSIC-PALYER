import { Song } from '../types';

const STORAGE_KEYS = {
  QUEUE_SONGS: 'smart_cq_songs',
  QUEUE_CAPACITY: 'smart_cq_capacity',
  FAVORITES: 'smart_cq_favorites',
  RECENTLY_PLAYED: 'smart_cq_recent',
  VOLUME: 'smart_cq_volume',
  REPEAT_MODE: 'smart_cq_repeat',
  SHUFFLE_STATE: 'smart_cq_shuffle'
};

export class StorageService {
  public static saveQueueSongs(songs: Song[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.QUEUE_SONGS, JSON.stringify(songs));
    } catch {
      // Ignore storage errors
    }
  }

  public static getQueueSongs(): Song[] | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUEUE_SONGS);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  public static saveCapacity(capacity: number): void {
    try {
      localStorage.setItem(STORAGE_KEYS.QUEUE_CAPACITY, capacity.toString());
    } catch {
      // Ignore
    }
  }

  public static getCapacity(): number {
    try {
      const cap = localStorage.getItem(STORAGE_KEYS.QUEUE_CAPACITY);
      return cap ? parseInt(cap, 10) : 8;
    } catch {
      return 8;
    }
  }

  public static saveFavorites(favoriteIds: string[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favoriteIds));
    } catch {
      // Ignore
    }
  }

  public static getFavorites(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public static saveRecentlyPlayed(songs: Song[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.RECENTLY_PLAYED, JSON.stringify(songs));
    } catch {
      // Ignore
    }
  }

  public static getRecentlyPlayed(): Song[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RECENTLY_PLAYED);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }
}
