/**
 * AssetPack integration.
 * Provides resource bundling and on-demand download support.
 *
 * Note: Actual @pixi/assetpack is a build-time tool.
 * This module provides runtime support for loading AssetPack outputs.
 */
export class AssetPackIntegration {
  /**
   * Load an AssetPack manifest and register all its assets.
   * @param manifestUrl URL to the assetpack manifest JSON
   */
  async loadManifest(manifestUrl: string): Promise<AssetPackManifest> {
    const response = await fetch(manifestUrl);
    const manifest: AssetPackManifest = await response.json();
    return manifest;
  }

  /**
   * Parse an AssetPack manifest into individual asset entries.
   */
  parseEntries(manifest: AssetPackManifest): Array<{ key: string; url: string }> {
    const entries: Array<{ key: string; url: string }> = [];
    for (const [key, value] of Object.entries(manifest.assets ?? {})) {
      if (typeof value === 'string') {
        entries.push({ key, url: value });
      } else if (typeof value === 'object' && value !== null && 'src' in value) {
        entries.push({ key, url: (value as { src: string }).src });
      }
    }
    return entries;
  }
}

export interface AssetPackManifest {
  assets?: Record<string, string | { src: string; [key: string]: unknown }>;
  bundles?: Record<string, string[]>;
}
