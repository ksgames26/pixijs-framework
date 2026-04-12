import { Module } from '@ksgames26/core';
import { GameEvents } from '@ksgames26/core';
import { AssetRef } from './asset-ref';
import { AssetCache } from './asset-cache';
import { AssetLoader } from './asset-loader';
import type { AssetType, AssetState, LoadOptions } from './types';

/**
 * Asset manager module.
 * Provides unified loading, caching, reference counting, and unloading.
 */
export class AssetManager extends Module {
  readonly name = 'assets';
  readonly version = '0.1.0';

  private cache = new AssetCache();
  private loader = new AssetLoader();
  private loadingPromises = new Map<string, Promise<AssetRef>>();

  /**
   * Load a single asset.
   * Deduplicates concurrent loads for the same key.
   */
  async load<T = unknown>(key: string, url: string, options?: LoadOptions): Promise<AssetRef<T>> {
    // Return cached if already loaded
    const cached = this.cache.get<T>(key);
    if (cached && cached.state === ('loaded' as AssetState)) {
      cached.retain();
      return cached;
    }

    // Deduplicate concurrent loads
    const existing = this.loadingPromises.get(key);
    if (existing) {
      return existing as Promise<AssetRef<T>>;
    }

    const type = options?.type ?? this.loader.resolveType(url);
    const ref = new AssetRef<T>(key, url, type);
    ref.state = 'loading' as AssetState;
    this.cache.set(key, ref);

    const loadPromise = this.doLoad<T>(ref, url);
    this.loadingPromises.set(key, loadPromise as Promise<AssetRef>);

    try {
      const result = await loadPromise;
      return result;
    } finally {
      this.loadingPromises.delete(key);
    }
  }

  /**
   * Load multiple assets with progress tracking.
   */
  async loadBundle(
    manifest: Array<{ key: string; url: string }>,
    onProgress?: (percent: number) => void,
  ): Promise<AssetRef[]> {
    const total = manifest.length;
    let loaded = 0;
    const refs: AssetRef[] = [];

    for (const { key, url } of manifest) {
      const ref = await this.load(key, url);
      refs.push(ref);
      loaded++;
      onProgress?.(Math.round((loaded / total) * 100));
    }

    return refs;
  }

  /**
   * Get a cached asset reference.
   */
  get<T = unknown>(key: string): AssetRef<T> | undefined {
    return this.cache.get<T>(key);
  }

  /**
   * Increment reference count for an asset.
   */
  retain(key: string): void {
    const ref = this.cache.get(key);
    ref?.retain();
  }

  /**
   * Release reference (refCount -1). Auto-unloads when count reaches 0.
   */
  release(key: string): void {
    const ref = this.cache.get(key);
    if (!ref) return;
    const count = ref.release();
    if (count <= 0) {
      this.doUnload(key);
    }
  }

  /**
   * Force unload regardless of reference count.
   */
  forceUnload(key: string): void {
    this.doUnload(key);
  }

  /**
   * Get debug information for all assets.
   */
  getDebugInfo(): AssetDebugInfo[] {
    return this.cache.getAll().map((ref) => ({
      key: ref.key,
      type: ref.type,
      state: ref.state,
      refCount: ref.refCount,
      size: ref.size,
      loadedAt: ref.loadedAt,
      url: ref.url,
    }));
  }

  /**
   * Internal load implementation.
   */
  private async doLoad<T>(ref: AssetRef<T>, url: string): Promise<AssetRef<T>> {
    try {
      const data = await this.loader.load<T>(ref.key, url, ref.type);
      ref.data = data;
      ref.state = 'loaded' as AssetState;
      ref.size = this.loader.estimateSize(data);
      ref.loadedAt = Date.now();
      ref.retain();
      this.app?.events.emit(GameEvents.ASSET_LOADED, ref.key);
    } catch (error) {
      ref.state = 'error' as AssetState;
      ref.error = error instanceof Error ? error : new Error(String(error));
      this.app?.events.emit(GameEvents.ASSET_ERROR, ref.key, ref.error);
    }
    return ref;
  }

  /**
   * Internal unload implementation.
   */
  private async doUnload(key: string): Promise<void> {
    const ref = this.cache.get(key);
    if (!ref || ref.state === ('unloaded' as AssetState)) return;

    ref.state = 'unloading' as AssetState;

    try {
      await this.loader.unload(key);
      ref.state = 'unloaded' as AssetState;
      ref.data = null as never;
      this.cache.delete(key);
      this.app?.events.emit(GameEvents.ASSET_UNLOADED, key);
    } catch {
      // Silently handle unload errors
      ref.state = 'error' as AssetState;
    }
  }

  override onDestroy(): void {
    // Unload all cached assets
    for (const key of [...this.cache.getAll().map((r) => r.key)]) {
      this.forceUnload(key);
    }
    this.cache.clear();
    super.onDestroy();
  }
}

export interface AssetDebugInfo {
  key: string;
  type: AssetType;
  state: AssetState;
  refCount: number;
  size: number;
  loadedAt: number;
  url: string;
}
