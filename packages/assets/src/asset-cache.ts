import { AssetRef } from './asset-ref';
import type { AssetState } from './types';

/**
 * Asset cache with reference counting.
 * Tracks all loaded assets and manages their lifecycle.
 */
export class AssetCache {
  private cache = new Map<string, AssetRef>();

  /**
   * Store an asset reference.
   */
  set(key: string, ref: AssetRef): void {
    this.cache.set(key, ref);
  }

  /**
   * Get an asset reference by key.
   */
  get<T = unknown>(key: string): AssetRef<T> | undefined {
    return this.cache.get(key) as AssetRef<T> | undefined;
  }

  /**
   * Check if an asset exists in cache.
   */
  has(key: string): boolean {
    return this.cache.has(key);
  }

  /**
   * Delete an asset reference from cache.
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Get all cached assets.
   */
  getAll(): AssetRef[] {
    return [...this.cache.values()];
  }

  /**
   * Get all assets that are unreferenced (refCount === 0) and loaded.
   */
  getUnreferenced(): AssetRef[] {
    return this.getAll().filter(
      (ref) => ref.isUnreferenced && ref.state === ('loaded' as AssetState),
    );
  }

  /**
   * Get total estimated memory usage in bytes.
   */
  getTotalSize(): number {
    return this.getAll().reduce((sum, ref) => sum + ref.size, 0);
  }

  /**
   * Clear all cached assets.
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache size.
   */
  get size(): number {
    return this.cache.size;
  }
}
