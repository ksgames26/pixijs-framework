import type { Container } from 'pixi.js';
import type { Scene } from '@ksgames26/scene';
import type { SpineAnimation } from './spine-animation';

/**
 * Helper class for managing spine animations within a scene.
 * Automatically tracks and cleans up animations when scene exits.
 *
 * @example
 * ```typescript
 * class GameScene extends Scene {
 *   private spineHelper = new SpineSceneHelper(this.stage);
 *
 *   async onEnter(): Promise<void> {
 *     const hero = await this.spineHelper.load('hero', 'spine/hero.json');
 *     hero.play('idle', true);
 *   }
 *
 *   async onExit(): Promise<void> {
 *     this.spineHelper.destroyAll();
 *   }
 * }
 * ```
 */
export class SpineSceneHelper {
  private animations = new Map<string, SpineAnimation>();
  private stage: Container;

  constructor(stage: Container) {
    this.stage = stage;
  }

  /**
   * Add a spine animation to the scene.
   *
   * @param key - Unique identifier
   * @param animation - SpineAnimation instance
   * @returns The added animation
   */
  add(key: string, animation: SpineAnimation): SpineAnimation {
    if (this.animations.has(key)) {
      console.warn(`[SpineSceneHelper] Animation with key "${key}" already exists, replacing.`);
      this.remove(key);
    }

    this.animations.set(key, animation);
    this.stage.addChild(animation.container);
    return animation;
  }

  /**
   * Get an animation by key.
   */
  get(key: string): SpineAnimation | undefined {
    return this.animations.get(key);
  }

  /**
   * Check if an animation exists.
   */
  has(key: string): boolean {
    return this.animations.has(key);
  }

  /**
   * Remove an animation from the scene.
   */
  remove(key: string): void {
    const animation = this.animations.get(key);
    if (animation) {
      animation.container.removeFromParent();
      animation.destroy();
      this.animations.delete(key);
    }
  }

  /**
   * Play an animation on the specified spine.
   */
  play(key: string, animationName: string, loop = false): void {
    const animation = this.animations.get(key);
    if (animation) {
      animation.play(animationName, loop);
    }
  }

  /**
   * Pause a specific animation.
   */
  pause(key: string): void {
    const animation = this.animations.get(key);
    if (animation) {
      animation.pause();
    }
  }

  /**
   * Resume a specific animation.
   */
  resume(key: string): void {
    const animation = this.animations.get(key);
    if (animation) {
      animation.resume();
    }
  }

  /**
   * Pause all animations.
   */
  pauseAll(): void {
    for (const animation of this.animations.values()) {
      animation.pause();
    }
  }

  /**
   * Resume all animations.
   */
  resumeAll(): void {
    for (const animation of this.animations.values()) {
      animation.resume();
    }
  }

  /**
   * Get all animation keys.
   */
  getKeys(): string[] {
    return Array.from(this.animations.keys());
  }

  /**
   * Destroy all animations and clear the helper.
   */
  destroyAll(): void {
    for (const [key, animation] of this.animations) {
      animation.container.removeFromParent();
      animation.destroy();
    }
    this.animations.clear();
  }
}

/**
 * Mixin for scenes that use spine animations.
 * Adds spine management capabilities to a scene.
 *
 * @example
 * ```typescript
 * class GameScene extends SpineSceneMixin(Scene) {
 *   async onEnter(): Promise<void> {
 *     const hero = await this.loadSpine('hero', 'spine/hero.json');
 *     hero.play('run', true);
 *   }
 * }
 * ```
 */
export function SpineSceneMixin<T extends new (...args: any[]) => Scene>(Base: T) {
  return class extends Base {
    private spineAnimations = new Map<string, SpineAnimation>();

    /**
     * Load a spine animation and add it to the scene.
     */
    async loadSpine(key: string, url: string, spineModule: { load: (k: string, u: string) => Promise<SpineAnimation> }): Promise<SpineAnimation> {
      const animation = await spineModule.load(key, url);
      this.spineAnimations.set(key, animation);
      this.stage.addChild(animation.container);
      return animation;
    }

    /**
     * Get a loaded spine animation.
     */
    getSpine(key: string): SpineAnimation | undefined {
      return this.spineAnimations.get(key);
    }

    /**
     * Remove a spine animation from the scene.
     */
    removeSpine(key: string): void {
      const animation = this.spineAnimations.get(key);
      if (animation) {
        animation.container.removeFromParent();
        animation.destroy();
        this.spineAnimations.delete(key);
      }
    }

    override async onExit(): Promise<void> {
      // Clean up all spine animations
      for (const [key, animation] of this.spineAnimations) {
        animation.container.removeFromParent();
        animation.destroy();
      }
      this.spineAnimations.clear();

      await super.onExit();
    }
  };
}
