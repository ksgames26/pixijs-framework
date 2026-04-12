/**
 * Generic object pool for frequently created/destroyed display objects.
 * Satisfies Constitution I: "Object Pool MUST be used for frequently
 * created/destroyed display objects (particles, bullets, effects)."
 *
 * Pure logic - no platform API dependencies.
 */
export class ObjectPool<T> {
  private pool: T[] = [];
  private factory: () => T;
  private reset: (obj: T) => void;
  private active = 0;

  /**
   * @param factory Function to create a new object
   * @param reset Function to reset an object when returned to pool
   * @param initialSize Number of objects to pre-create
   */
  constructor(factory: () => T, reset: (obj: T) => void, initialSize = 0) {
    this.factory = factory;
    this.reset = reset;

    if (initialSize > 0) {
      this.prewarm(initialSize);
    }
  }

  /**
   * Number of objects available in the pool.
   */
  get size(): number {
    return this.pool.length;
  }

  /**
   * Number of currently active (borrowed) objects.
   */
  get activeCount(): number {
    return this.active;
  }

  /**
   * Acquire an object from the pool.
   * Creates a new one if the pool is empty.
   */
  acquire(): T {
    this.active++;
    if (this.pool.length > 0) {
      return this.pool.pop()!;
    }
    return this.factory();
  }

  /**
   * Release an object back to the pool.
   * The reset function is called to prepare the object for reuse.
   */
  release(obj: T): void {
    this.reset(obj);
    this.pool.push(obj);
    this.active = Math.max(0, this.active - 1);
  }

  /**
   * Pre-warm the pool by creating objects upfront.
   * Useful to avoid allocation spikes at runtime.
   */
  prewarm(count: number): void {
    for (let i = 0; i < count; i++) {
      this.pool.push(this.factory());
    }
  }

  /**
   * Drain all objects from the pool.
   */
  drain(): void {
    this.pool.length = 0;
  }
}
