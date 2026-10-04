import { Song, HashSearchResult } from '../types';

/**
 * Hash Map Implementation for Fast Song Search (O(1) average lookup time)
 * Maps hash keys generated from Title, Artist, Album to song buckets.
 */
export class SongHashMap {
  private buckets: Map<number, Song[]>;
  private songIdMap: Map<string, Song>;
  private numBuckets: number = 31;

  constructor() {
    this.buckets = new Map();
    this.songIdMap = new Map();
  }

  /**
   * Polynomial Rolling Hash Function for String Key
   */
  private hashString(key: string): number {
    const p = 31;
    let hash = 0;
    const cleanKey = key.toLowerCase().trim();
    for (let i = 0; i < cleanKey.length; i++) {
      hash = (hash * p + cleanKey.charCodeAt(i)) % 1000000007;
    }
    return Math.abs(hash);
  }

  /**
   * Indexes a song into the Hash Map.
   */
  public insert(song: Song): void {
    this.songIdMap.set(song.id, song);

    // Index by title, artist, album words
    const keywords = [
      song.title,
      song.artist,
      song.album,
      song.genre,
      ...song.title.split(' '),
      ...song.artist.split(' ')
    ];

    keywords.forEach(word => {
      if (!word || word.length < 2) return;
      const key = word.toLowerCase().trim();
      const hashKey = this.hashString(key);
      const bucketIdx = hashKey % this.numBuckets;

      if (!this.buckets.has(bucketIdx)) {
        this.buckets.set(bucketIdx, []);
      }

      const bucket = this.buckets.get(bucketIdx)!;
      if (!bucket.some(s => s.id === song.id)) {
        bucket.push(song);
      }
    });
  }

  /**
   * Performs an O(1) average hash lookup.
   */
  public search(query: string): HashSearchResult {
    const startTime = performance.now();
    const cleanQuery = query.toLowerCase().trim();

    if (!cleanQuery) {
      return {
        query: '',
        matches: [],
        hashKey: 0,
        lookupTimeMs: 0,
        timeComplexity: 'O(1)',
        bucketIndex: 0
      };
    }

    const hashKey = this.hashString(cleanQuery);
    const bucketIndex = hashKey % this.numBuckets;
    const bucket = this.buckets.get(bucketIndex) || [];

    // Filter candidate matches from target hash bucket
    const matches = bucket.filter(song =>
      song.title.toLowerCase().includes(cleanQuery) ||
      song.artist.toLowerCase().includes(cleanQuery) ||
      song.album.toLowerCase().includes(cleanQuery) ||
      song.genre.toLowerCase().includes(cleanQuery)
    );

    // Fallback: check all stored songs if bucket miss occurs due to partial prefix search
    let finalMatches = matches;
    if (finalMatches.length === 0) {
      finalMatches = Array.from(this.songIdMap.values()).filter(song =>
        song.title.toLowerCase().includes(cleanQuery) ||
        song.artist.toLowerCase().includes(cleanQuery) ||
        song.album.toLowerCase().includes(cleanQuery)
      );
    }

    const endTime = performance.now();

    return {
      query,
      matches: finalMatches,
      hashKey,
      lookupTimeMs: +(endTime - startTime).toFixed(3),
      timeComplexity: 'O(1) avg',
      bucketIndex
    };
  }

  public clear(): void {
    this.buckets.clear();
    this.songIdMap.clear();
  }
}
