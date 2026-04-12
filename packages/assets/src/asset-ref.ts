import type { AssetType, AssetState } from './types';

/**
 * Asset reference handle.
 * Carries reference count and resource metadata.
 */
export class AssetRef<T = unknown> {
  /** Resource unique identifier */
  readonly key: string;

  /** Resource original URL */
  readonly url: string;

  /** Resource type */
  readonly type: AssetType;

  /** Resource data (Texture, Spritesheet, etc.) */
  data!: T;

  /** Current lifecycle state */
  state: AssetState = 'pending' as AssetState;

  /** Reference count */
  refCount = 0;

  /** Estimated size in bytes */
  size = 0;

  /** Load completion timestamp */
  loadedAt = 0;

  /** Last error, null if no error */
  error: Error | null = null;

  constructor(key: string, url: string, type: AssetType) {
    this.key = key;
    this.url = url;
    this.type = type;
  }

  /**
   * Increment reference count.
   */
  retain(): void {
    this.refCount++;
  }

  /**
   * Decrement reference count.
   * @returns New reference count
   */
  release(): number {
    this.refCount = Math.max(0, this.refCount - 1);
    return this.refCount;
  }

  /**
   * Whether the resource has no active references.
   */
  get isUnreferenced(): boolean {
    return this.refCount <= 0;
  }

  /**
   * Whether the resource is in a usable state.
   */
  get isReady(): boolean {
    return this.state === ('loaded' as AssetState);
  }
}
