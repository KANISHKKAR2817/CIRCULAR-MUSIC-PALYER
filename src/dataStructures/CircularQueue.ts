import { Song, QueueState } from '../types';

/**
 * Authentic Circular Queue Implementation for Music Playlist Management.
 * Uses index arithmetic:
 *   next = (index + 1) % capacity
 *   previous = (index - 1 + capacity) % capacity
 */
export class CircularQueue {
  private array: (Song | null)[];
  private front: number = -1;
  private rear: number = -1;
  private size: number = 0;
  private capacity: number;
  private currentIndex: number = -1;

  constructor(capacity: number = 8) {
    this.capacity = capacity;
    this.array = new Array(capacity).fill(null);
  }

  public getCapacity(): number {
    return this.capacity;
  }

  public getSize(): number {
    return this.size;
  }

  public getFront(): number {
    return this.front;
  }

  public getRear(): number {
    return this.rear;
  }

  public getCurrentIndex(): number {
    return this.currentIndex;
  }

  public setCurrentIndex(index: number): boolean {
    if (index < 0 || index >= this.capacity || this.array[index] === null) {
      return false;
    }
    this.currentIndex = index;
    return true;
  }

  public isEmpty(): boolean {
    return this.size === 0;
  }

  public isFull(): boolean {
    return this.size === this.capacity;
  }

  /**
   * Enqueues a song to the rear of the circular queue.
   * Time Complexity: O(1)
   */
  public enqueue(song: Song): { success: boolean; index: number; wrapped: boolean } {
    if (this.isFull()) {
      return { success: false, index: -1, wrapped: false };
    }

    let wrapped = false;
    if (this.isEmpty()) {
      this.front = 0;
      this.rear = 0;
    } else {
      const prevRear = this.rear;
      this.rear = (this.rear + 1) % this.capacity;
      if (this.rear < prevRear) {
        wrapped = true;
      }
    }

    this.array[this.rear] = song;
    this.size++;

    // If no song was selected as current, select this first song
    if (this.currentIndex === -1 || this.array[this.currentIndex] === null) {
      this.currentIndex = this.front;
    }

    return { success: true, index: this.rear, wrapped };
  }

  /**
   * Dequeues the song at the front of the circular queue.
   * Time Complexity: O(1)
   */
  public dequeue(): { song: Song | null; dequeuedIndex: number; wrapped: boolean } {
    if (this.isEmpty()) {
      return { song: null, dequeuedIndex: -1, wrapped: false };
    }

    const dequeuedIndex = this.front;
    const removedSong = this.array[this.front];
    this.array[this.front] = null;
    let wrapped = false;

    if (this.size === 1) {
      this.front = -1;
      this.rear = -1;
      this.currentIndex = -1;
    } else {
      const prevFront = this.front;
      this.front = (this.front + 1) % this.capacity;
      if (this.front < prevFront) {
        wrapped = true;
      }
      // If current song was dequeued, move current index to new front
      if (this.currentIndex === dequeuedIndex) {
        this.currentIndex = this.front;
      }
    }

    this.size--;
    return { song: removedSong, dequeuedIndex, wrapped };
  }

  /**
   * Moves current index to next song in circular order.
   * Index formula: nextIndex = (currentIndex + 1) % capacity
   * Returns metadata indicating if wrap-around occurred.
   */
  public next(): { nextSong: Song | null; nextIndex: number; wrapped: boolean; formula: string } {
    if (this.isEmpty()) {
      return { nextSong: null, nextIndex: -1, wrapped: false, formula: 'Queue is empty' };
    }

    let start = this.currentIndex === -1 ? this.front : this.currentIndex;
    let nextIdx = (start + 1) % this.capacity;
    let wrapped = nextIdx < start;

    // Search for next non-null slot in circular fashion
    let count = 0;
    while (this.array[nextIdx] === null && count < this.capacity) {
      const prev = nextIdx;
      nextIdx = (nextIdx + 1) % this.capacity;
      if (nextIdx < prev) wrapped = true;
      count++;
    }

    if (this.array[nextIdx] !== null) {
      this.currentIndex = nextIdx;
      const formula = `(${start} + 1) % ${this.capacity} = ${nextIdx}`;
      return { nextSong: this.array[nextIdx], nextIndex: nextIdx, wrapped, formula };
    }

    return { nextSong: null, nextIndex: -1, wrapped: false, formula: 'No song available' };
  }

  /**
   * Moves current index to previous song in circular order.
   * Index formula: prevIndex = (currentIndex - 1 + capacity) % capacity
   */
  public previous(): { prevSong: Song | null; prevIndex: number; wrapped: boolean; formula: string } {
    if (this.isEmpty()) {
      return { prevSong: null, prevIndex: -1, wrapped: false, formula: 'Queue is empty' };
    }

    let start = this.currentIndex === -1 ? this.front : this.currentIndex;
    let prevIdx = (start - 1 + this.capacity) % this.capacity;
    let wrapped = prevIdx > start;

    // Search for previous non-null slot in circular fashion
    let count = 0;
    while (this.array[prevIdx] === null && count < this.capacity) {
      const p = prevIdx;
      prevIdx = (prevIdx - 1 + this.capacity) % this.capacity;
      if (prevIdx > p) wrapped = true;
      count++;
    }

    if (this.array[prevIdx] !== null) {
      this.currentIndex = prevIdx;
      const formula = `(${start} - 1 + ${this.capacity}) % ${this.capacity} = ${prevIdx}`;
      return { prevSong: this.array[prevIdx], prevIndex: prevIdx, wrapped, formula };
    }

    return { prevSong: null, prevIndex: -1, wrapped: false, formula: 'No song available' };
  }

  /**
   * Returns song at front without removing.
   * Time Complexity: O(1)
   */
  public peek(): Song | null {
    if (this.isEmpty() || this.front === -1) return null;
    return this.array[this.front];
  }

  /**
   * Returns song at rear without removing.
   * Time Complexity: O(1)
   */
  public peekRear(): Song | null {
    if (this.isEmpty() || this.rear === -1) return null;
    return this.array[this.rear];
  }

  /**
   * Returns current playing song.
   */
  public getCurrentSong(): Song | null {
    if (this.currentIndex === -1 || this.array[this.currentIndex] === null) {
      return this.peek();
    }
    return this.array[this.currentIndex];
  }

  /**
   * Returns direct access array for visual inspection.
   */
  public getArray(): (Song | null)[] {
    return [...this.array];
  }

  /**
   * Returns active items in logical queue order from FRONT to REAR.
   */
  public getActiveQueue(): { song: Song; index: number; isFront: boolean; isRear: boolean; isCurrent: boolean }[] {
    if (this.isEmpty()) return [];

    const items: { song: Song; index: number; isFront: boolean; isRear: boolean; isCurrent: boolean }[] = [];
    let curr = this.front;
    let processed = 0;

    while (processed < this.size) {
      if (this.array[curr] !== null) {
        items.push({
          song: this.array[curr]!,
          index: curr,
          isFront: curr === this.front,
          isRear: curr === this.rear,
          isCurrent: curr === this.currentIndex
        });
      }
      curr = (curr + 1) % this.capacity;
      processed++;
    }

    return items;
  }

  /**
   * Removes a specific song by index.
   */
  public removeAtIndex(targetIndex: number): { success: boolean; song: Song | null } {
    if (targetIndex < 0 || targetIndex >= this.capacity || this.array[targetIndex] === null) {
      return { success: false, song: null };
    }

    const removedSong = this.array[targetIndex];

    if (this.size === 1) {
      this.array[targetIndex] = null;
      this.front = -1;
      this.rear = -1;
      this.currentIndex = -1;
      this.size = 0;
      return { success: true, song: removedSong };
    }

    if (targetIndex === this.front) {
      return { success: true, song: this.dequeue().song };
    }

    // If removing at targetIndex, clear slot and adjust pointers if needed
    this.array[targetIndex] = null;
    this.size--;

    // If target index was rear, move rear backward to last non-null
    if (targetIndex === this.rear) {
      let newRear = (this.rear - 1 + this.capacity) % this.capacity;
      while (this.array[newRear] === null && newRear !== this.front) {
        newRear = (newRear - 1 + this.capacity) % this.capacity;
      }
      this.rear = newRear;
    }

    if (this.currentIndex === targetIndex) {
      this.currentIndex = this.front;
    }

    return { success: true, song: removedSong };
  }

  /**
   * Shuffles active songs preserving circular queue indexes.
   */
  public shuffleActive(): void {
    const active = this.getActiveQueue().map(entry => entry.song);
    if (active.length <= 1) return;

    // Fisher-Yates shuffle algorithm
    for (let i = active.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [active[i], active[j]] = [active[j], active[i]];
    }

    // Place shuffled songs back into active queue slots starting from front
    let curr = this.front;
    for (let i = 0; i < active.length; i++) {
      this.array[curr] = active[i];
      curr = (curr + 1) % this.capacity;
    }
  }

  /**
   * Resizes capacity of the queue while preserving song ordering.
   */
  public resizeCapacity(newCapacity: number): boolean {
    if (newCapacity < this.size || newCapacity < 4 || newCapacity > 16) {
      return false; // Cannot resize smaller than current size
    }

    const activeSongs = this.getActiveQueue().map(item => item.song);
    this.capacity = newCapacity;
    this.array = new Array(newCapacity).fill(null);

    if (activeSongs.length === 0) {
      this.front = -1;
      this.rear = -1;
      this.size = 0;
      this.currentIndex = -1;
    } else {
      this.front = 0;
      this.rear = activeSongs.length - 1;
      this.size = activeSongs.length;
      for (let i = 0; i < activeSongs.length; i++) {
        this.array[i] = activeSongs[i];
      }
      this.currentIndex = 0;
    }

    return true;
  }

  /**
   * Export queue state summary.
   */
  public getState(): QueueState {
    return {
      front: this.front,
      rear: this.rear,
      size: this.size,
      capacity: this.capacity,
      currentIndex: this.currentIndex
    };
  }

  /**
   * Load raw songs array into queue.
   */
  public loadSongs(songs: Song[]): void {
    this.array = new Array(this.capacity).fill(null);
    this.size = 0;
    this.front = -1;
    this.rear = -1;
    this.currentIndex = -1;

    for (const song of songs) {
      if (this.isFull()) break;
      this.enqueue(song);
    }
  }
}
