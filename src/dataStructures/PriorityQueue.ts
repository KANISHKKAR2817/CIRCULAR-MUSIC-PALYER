import { Song, PriorityLevel } from '../types';

export interface PriorityItem {
  song: Song;
  priority: number; // Higher number = higher priority
  priorityLevel: PriorityLevel;
  timestamp: number;
}

/**
 * Priority Queue Implementation (Max-Heap / Ordered List)
 * High Priority songs ("PLAY NEXT") are dequeued before normal queued songs.
 */
export class PriorityQueue {
  private items: PriorityItem[] = [];

  /**
   * Enqueues a song with priority.
   * HIGH = 2, NORMAL = 1
   * Time Complexity: O(N) or O(log N) insertion sorting
   */
  public enqueue(song: Song, priorityLevel: PriorityLevel = 'NORMAL'): void {
    const priority = priorityLevel === 'HIGH' ? 2 : 1;
    const newItem: PriorityItem = {
      song,
      priority,
      priorityLevel,
      timestamp: Date.now()
    };

    // Prevent duplicate entries of exact same song
    this.items = this.items.filter(item => item.song.id !== song.id);

    let added = false;
    for (let i = 0; i < this.items.length; i++) {
      if (newItem.priority > this.items[i].priority) {
        this.items.splice(i, 0, newItem);
        added = true;
        break;
      }
    }

    if (!added) {
      this.items.push(newItem);
    }
  }

  /**
   * Dequeues the highest priority song.
   * Time Complexity: O(1)
   */
  public dequeue(): PriorityItem | undefined {
    return this.items.shift();
  }

  /**
   * Peeks highest priority item.
   * Time Complexity: O(1)
   */
  public peek(): PriorityItem | undefined {
    return this.items[0];
  }

  /**
   * Returns items filtered by high priority vs normal priority.
   */
  public getGroupedItems(): { highPriority: PriorityItem[]; normalPriority: PriorityItem[] } {
    return {
      highPriority: this.items.filter(i => i.priorityLevel === 'HIGH'),
      normalPriority: this.items.filter(i => i.priorityLevel === 'NORMAL')
    };
  }

  public getItems(): PriorityItem[] {
    return [...this.items];
  }

  public size(): number {
    return this.items.length;
  }

  public remove(songId: string): boolean {
    const initialLen = this.items.length;
    this.items = this.items.filter(item => item.song.id !== songId);
    return this.items.length < initialLen;
  }

  public clear(): void {
    this.items = [];
  }
}
