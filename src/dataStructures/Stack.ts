import { Song } from '../types';

/**
 * Authentic Stack Data Structure (LIFO - Last In, First Out)
 * Used for managing the Recently Played song history.
 */
export class Stack<T = Song> {
  private items: T[] = [];
  private maxSize: number;

  constructor(maxSize: number = 20) {
    this.maxSize = maxSize;
  }

  /**
   * Pushes an item onto the top of the stack.
   * Time Complexity: O(1)
   */
  public push(item: T): void {
    // If item already exists at top, prevent exact consecutive duplicate
    if (this.items.length > 0 && JSON.stringify(this.items[this.items.length - 1]) === JSON.stringify(item)) {
      return;
    }

    this.items.push(item);
    if (this.items.length > this.maxSize) {
      this.items.shift(); // remove oldest from bottom if max capacity reached
    }
  }

  /**
   * Pops the top item off the stack.
   * Time Complexity: O(1)
   */
  public pop(): T | undefined {
    return this.items.pop();
  }

  /**
   * Returns top item without removing it.
   * Time Complexity: O(1)
   */
  public peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  /**
   * Checks if stack is empty.
   */
  public isEmpty(): boolean {
    return this.items.length === 0;
  }

  /**
   * Returns total items in stack.
   */
  public size(): number {
    return this.items.length;
  }

  /**
   * Clears stack.
   */
  public clear(): void {
    this.items = [];
  }

  /**
   * Returns stack items formatted with top-first for display.
   */
  public getItemsTopFirst(): T[] {
    return [...this.items].reverse();
  }

  /**
   * Returns internal raw stack array (bottom to top).
   */
  public getRawItems(): T[] {
    return [...this.items];
  }
}
