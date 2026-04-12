import type { Container } from 'pixi.js';
import type { SpineAnimation } from './spine-animation';

/**
 * Interface for objects with a stage property (like Scene).
 */
interface WithStage {
  stage: Container;
}

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
    for (const [, animation] of this.animations) {
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
// WeakMap to store spine animations for mixin instances
const spineAnimationsMap = new WeakMap<object, Map<string, SpineAnimation>>();

function getSpineAnimations(instance: object): Map<string, SpineAnimation> {
  if (!spineAnimationsMap.has(instance)) {
    spineAnimationsMap.set(instance, new Map<string, SpineAnimation>());
  }
  return spineAnimationsMap.get(instance)!;
}

export function SpineSceneMixin<T extends new (...args: any[]) => WithStage>(Base: T) {
  return class extends Base {

    /**
     * Load a spine animation and add it to the scene.
     */
    async loadSpine(key: string, url: string, spineModule: { load: (k: string, u: string) => Promise<SpineAnimation> }): Promise<SpineAnimation> {
      const animation = await spineModule.load(key, url);
      getSpineAnimations(this).set(key, animation);
      this.stage.addChild(animation.container);
      return animation;
    }

    /**
     * Get a loaded spine animation.
     */
    getSpine(key: string): SpineAnimation | undefined {
      return getSpineAnimations(this).get(key);
    }

    /**
     * Remove a spine animation from the scene.
     */
    removeSpine(key: string): void {
      const animations = getSpineAnimations(this);
      const animation = animations.get(key);
      if (animation) {
        animation.container.removeFromParent();
        animation.destroy();
        animations.delete(key);
      }
    }

    /**
     * Clean up all spine animations.
     * Call this in your scene's onExit method.
     */
    cleanupSpineAnimations(): void {
      const animations = getSpineAnimations(this);
      for (const [, animation] of animations) {
        animation.container.removeFromParent();
        animation.destroy();
      }
      animations.clear();
    }
  };
}
