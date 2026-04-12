import type { Module } from '@ksgames26/core';

/**
 * Resource inspector for debug mode.
 * Provides detailed inspection of loaded assets: type, size, ref count, load time.
 */
export class ResourceInspector {
  /**
   * Inspect all resources from the AssetManager module.
   */
  inspectAll(assetManager: Module | undefined): ResourceInspectionResult[] {
    if (!assetManager || typeof (assetManager as unknown as Record<string, unknown>).getDebugInfo !== 'function') {
      return [];
    }

    const debugInfo = (assetManager as unknown as Record<string, () => unknown[]>).getDebugInfo() as Array<{
      key: string;
      type: string;
      state: string;
      refCount: number;
      size: number;
      loadedAt: number;
      url: string;
    }>;

    return debugInfo.map((info) => ({
      key: info.key,
      type: info.type,
      state: info.state,
      refCount: info.refCount,
      sizeBytes: info.size,
      sizeKB: Math.round(info.size / 1024 * 10) / 10,
      loadedAt: info.loadedAt,
      url: info.url,
      isLeak: info.refCount > 0 && (info.state === 'unloaded' || info.state === 'unloading'),
    }));
  }

  /**
   * Detect potential resource leaks.
   * A leak is a resource with non-zero refCount that is marked for unloading.
   */
  detectLeaks(assetManager: Module | undefined): ResourceInspectionResult[] {
    return this.inspectAll(assetManager).filter((r) => r.isLeak);
  }
}

export interface ResourceInspectionResult {
  key: string;
  type: string;
  state: string;
  refCount: number;
  sizeBytes: number;
  sizeKB: number;
  loadedAt: number;
  url: string;
  /** Whether this resource appears to be leaked */
  isLeak: boolean;
}
