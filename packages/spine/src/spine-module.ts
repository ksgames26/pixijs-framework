import { Module } from '@ksgames26/core';
import type { GameApplication } from '@ksgames26/core';
import { SpineAnimation } from './spine-animation';
import { SpineAssetResolver } from './spine-asset-resolver';

/**
 * Spine animation module for PixiJS game framework.
 *
 * Integrates @esotericsoftware/spine-pixi-v8 with the framework's
 * module system and asset management.
 *
 * @example
 * ```typescript
 * import { SpineModule } from '@ksgames26/spine';
 *
 * const spine = new SpineModule();
 * app.registerModule(spine);
 *
 * // Load and play spine animation
 * const hero = await spine.load('hero', 'spine/hero.json');
 * hero.play('run', true);
 * app.stage.addChild(hero);
 * ```
 */
export class SpineModule extends Module {
  readonly name = 'spine';
  readonly version = '0.1.0';

  private assetResolver: SpineAssetResolver | null = null;
  private animations = new Map<string, SpineAnimation>();

  override onRegister(app: GameApplication): void {
    super.onRegister(app);

    // Initialize asset resolver
    this.assetResolver = new SpineAssetResolver(app);
  }

  override async onEnable(): Promise<void> {
    // Register spine asset loaders with the framework's asset manager
    if (this.assetResolver) {
      await this.assetResolver.registerLoaders();
    }

    this.enabled = true;
  }

  /**
   * Load a Spine animation from the specified URL.
   *
   * @param key - Unique identifier for this animation instance
   * @param url - URL to the spine .json file
   * @returns Promise resolving to SpineAnimation instance
   */
  async load(key: string, url: string): Promise<SpineAnimation> {
    if (this.animations.has(key)) {
      return this.animations.get(key)!;
    }

    if (!this.assetResolver) {
      throw new Error('[SpineModule] Module not registered. Call app.registerModule(spine) first.');
    }

    const spineData = await this.assetResolver.loadSpineData(url);
    const animation = new SpineAnimation(spineData);

    this.animations.set(key, animation);
    return animation;
  }

  /**
   * Get a loaded animation by key.
   */
  get(key: string): SpineAnimation | undefined {
    return this.animations.get(key);
  }

  /**
   * Check if an animation is loaded.
   */
  has(key: string): boolean {
    return this.animations.has(key);
  }

  /**
   * Unload a specific animation and release its resources.
   */
  unload(key: string): void {
    const animation = this.animations.get(key);
    if (animation) {
      animation.destroy();
      this.animations.delete(key);
    }
  }

  /**
   * Unload all animations.
   */
  unloadAll(): void {
    for (const [, animation] of this.animations) {
      animation.destroy();
    }
    this.animations.clear();
  }

  /**
   * Get all loaded animation keys.
   */
  getLoadedKeys(): string[] {
    return Array.from(this.animations.keys());
  }

  override onDisable(): void {
    this.unloadAll();
    this.enabled = false;
    super.onDisable();
  }

  override onDestroy(): void {
    this.unloadAll();
    this.assetResolver = null;
    super.onDestroy();
  }
}
