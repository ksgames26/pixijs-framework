import type { GameApplication } from '@ksgames26/core';
import { Assets } from 'pixi.js';
import {
  SkeletonData,
  TextureAtlas,
  AtlasAttachmentLoader,
  SkeletonJson,
  SkeletonBinary,
} from '@esotericsoftware/spine-pixi-v8';

/**
 * Asset resolver for Spine animations.
 * Handles loading of spine .json/.skel, .atlas, and texture files.
 */
export class SpineAssetResolver {
  private app: GameApplication;
  private loadedData = new Map<string, SkeletonData>();

  constructor(app: GameApplication) {
    this.app = app;
  }

  /**
   * Register spine asset loaders with PixiJS Assets.
   */
  async registerLoaders(): Promise<void> {
    // Register JSON loader for spine skeleton data
    Assets.loader.addParser({
      name: 'spine-json',
      test: (url: string) => url.endsWith('.json') && !url.includes('atlas'),
      load: async (url: string) => {
        const response = await fetch(url);
        return await response.json();
      },
    });

    // Register atlas loader
    Assets.loader.addParser({
      name: 'spine-atlas',
      test: (url: string) => url.endsWith('.atlas'),
      load: async (url: string) => {
        const response = await fetch(url);
        return await response.text();
      },
    });

    // Register binary loader for .skel files
    Assets.loader.addParser({
      name: 'spine-skel',
      test: (url: string) => url.endsWith('.skel'),
      load: async (url: string) => {
        const response = await fetch(url);
        return await response.arrayBuffer();
      },
    });
  }

  /**
   * Load spine skeleton data from URL.
   *
   * @param url - URL to spine file (.json or .skel)
   * @returns SkeletonData instance
   */
  async loadSpineData(url: string): Promise<SkeletonData> {
    if (this.loadedData.has(url)) {
      return this.loadedData.get(url)!;
    }

    const isBinary = url.endsWith('.skel');
    const baseUrl = url.substring(0, url.lastIndexOf('/') + 1);
    const fileName = url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));
    const atlasUrl = `${baseUrl}${fileName}.atlas`;

    // Load atlas
    const atlasText = await this.loadAtlas(atlasUrl);
    const atlas = new TextureAtlas(atlasText);

    // Load textures for atlas
    await this.loadAtlasTextures(atlas, baseUrl);

    // Create attachment loader
    const attachmentLoader = new AtlasAttachmentLoader(atlas);

    // Load skeleton data (JSON or binary)
    let skeletonData: SkeletonData;
    if (isBinary) {
      const binaryData = await Assets.load<ArrayBuffer>(url);
      const skeletonBinary = new SkeletonBinary(attachmentLoader);
      skeletonData = skeletonBinary.readSkeletonData(new Uint8Array(binaryData));
    } else {
      const jsonData = await Assets.load<Record<string, unknown>>(url);
      const skeletonJson = new SkeletonJson(attachmentLoader);
      skeletonData = skeletonJson.readSkeletonData(jsonData);
    }

    this.loadedData.set(url, skeletonData);
    return skeletonData;
  }

  /**
   * Unload spine data and release resources.
   *
   * @param url - URL of the spine data to unload
   */
  unloadSpineData(url: string): void {
    this.loadedData.delete(url);
    // PixiJS Assets handles texture cleanup
  }

  /**
   * Load atlas text file.
   */
  private async loadAtlas(url: string): Promise<string> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`[SpineAssetResolver] Failed to load atlas: ${url}`);
    }
    return await response.text();
  }

  /**
   * Load textures referenced in atlas.
   */
  private async loadAtlasTextures(atlas: TextureAtlas, baseUrl: string): Promise<void> {
    const pages = (atlas as unknown as { pages: Array<{ name: string; texture?: unknown }> }).pages;

    for (const page of pages) {
      const textureUrl = `${baseUrl}${page.name}`;
      const texture = await Assets.load(textureUrl);
      page.texture = texture;
    }
  }
}
