import { Assets, Texture } from 'pixi.js';
import type { AssetType } from './types';

/**
 * Asset loading strategy wrapping PixiJS v8 Assets API.
 * Handles single and bundle loading with deduplication.
 */
export class AssetLoader {
  /**
   * Load a single asset by URL using PixiJS Assets.
   */
  async load<T = unknown>(key: string, url: string, _type?: AssetType): Promise<T> {
    // Register asset alias if not already registered
    const resolver = Assets.resolver as unknown as { hasAsset: (key: string) => boolean };
    if (!resolver.hasAsset(key)) {
      Assets.add({ alias: key, src: url });
    }

    const data = await Assets.load<T>(key);
    return data;
  }

  /**
   * Unload a single asset by key.
   */
  async unload(key: string): Promise<void> {
    await Assets.unload(key);
  }

  /**
   * Load multiple assets as a bundle.
   * @param manifest Array of {key, url} pairs
   * @param onProgress Progress callback (0-100)
   */
  async loadBundle<T = unknown>(
    manifest: Array<{ key: string; url: string }>,
    onProgress?: (percent: number) => void,
  ): Promise<Map<string, T>> {
    const results = new Map<string, T>();
    const total = manifest.length;
    let loaded = 0;

    const resolver = Assets.resolver as unknown as { hasAsset: (key: string) => boolean };

    // Register all assets first
    for (const { key, url } of manifest) {
      if (!resolver.hasAsset(key)) {
        Assets.add({ alias: key, src: url });
      }
    }

    // Load individually to track progress
    for (const { key } of manifest) {
      const data = await Assets.load<T>(key);
      results.set(key, data);
      loaded++;
      onProgress?.(Math.round((loaded / total) * 100));
    }

    return results;
  }

  /**
   * Resolve the asset type based on URL extension.
   */
  resolveType(url: string): AssetType {
    const ext = url.split('.').pop()?.toLowerCase() ?? '';
    switch (ext) {
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'webp':
      case 'avif':
        return 'texture' as AssetType;
      case 'json':
        return 'json' as AssetType;
      case 'atlas':
      case 'skel':
        return 'spine' as AssetType;
      default:
        return 'other' as AssetType;
    }
  }

  /**
   * Estimate asset size in bytes.
   */
  estimateSize<T>(data: T): number {
    if (data instanceof Texture) {
      const source = data.source;
      return source.width * source.height * 4; // RGBA
    }
    if (typeof data === 'object' && data !== null) {
      return JSON.stringify(data).length;
    }
    return 0;
  }
}
