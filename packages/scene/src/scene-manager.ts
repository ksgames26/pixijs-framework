import { Module, GameEvents } from '@ksgames26/core';
import type { GameApplication } from '@ksgames26/core';
import { Scene } from './scene';
import type { SceneState, TransitionConfig } from './types';

/**
 * Scene manager module.
 * Handles scene registration, switching, and transition animations.
 */
export class SceneManager extends Module {
  readonly name = 'scene';
  readonly version = '0.1.0';

  private scenes = new Map<string, Scene>();
  private _current: Scene | null = null;
  private _transitioning = false;

  /** Get the current active scene */
  get current(): Scene | null {
    return this._current;
  }

  /** Whether a scene transition is in progress */
  get transitioning(): boolean {
    return this._transitioning;
  }

  /**
   * Register a scene.
   */
  register(scene: Scene): void {
    if (this.scenes.has(scene.name)) {
      throw new Error(`[SceneManager] Scene "${scene.name}" is already registered`);
    }
    // Inject framework reference
    (scene as unknown as { app: GameApplication }).app = this.app;
    this.scenes.set(scene.name, scene);
  }

  /**
   * Unregister a scene.
   */
  unregister(name: string): void {
    const scene = this.scenes.get(name);
    if (!scene) return;
    if (this._current === scene) {
      console.warn(`[SceneManager] Cannot unregister active scene "${name}"`);
      return;
    }
    scene.destroy();
    this.scenes.delete(name);
  }

  /**
   * Switch to a target scene with optional transition.
   * @param name Target scene name
   * @param params Parameters passed to the target scene
   * @param transition Transition configuration
   */
  async switchTo(
    name: string,
    params?: Record<string, unknown>,
    transition?: TransitionConfig,
  ): Promise<void> {
    const target = this.scenes.get(name);
    if (!target) {
      throw new Error(`[SceneManager] Scene "${name}" not found`);
    }
    if (this._transitioning) {
      throw new Error('[SceneManager] Scene transition already in progress');
    }

    this._transitioning = true;
    const from = this._current;
    const fromName = from?.name ?? '(none)';

    try {
      this.app.events.emit(GameEvents.SCENE_SWITCH, fromName, name);

      // Exit current scene
      if (from) {
        from.state = 'exiting' as SceneState;
        await from.onExit();

        // Remove from stage
        this.app.pixiApp.stage.removeChild(from.stage);
        from.state = 'idle' as SceneState;
      }

      // Apply enter transition
      const duration = transition?.duration ?? 500;
      const loadingThreshold = transition?.loadingThreshold ?? 300;

      // Start timer for loading display
      const loadingTimer = setTimeout(() => {
        // TODO: Show loading scene when threshold exceeded
      }, loadingThreshold);

      // Enter new scene
      target.state = 'entering' as SceneState;
      await target.onEnter(params);

      clearTimeout(loadingTimer);

      // Add to stage
      this.app.pixiApp.stage.addChild(target.stage);

      // Apply fade transition
      if (transition?.type !== 'custom') {
        await this.applyFadeIn(target, duration);
      }

      target.state = 'active' as SceneState;
      this._current = target;

      this.app.events.emit(GameEvents.SCENE_SWITCHED, name);
    } catch (error) {
      // Fallback: ensure we don't get stuck in transitioning state
      console.error(`[SceneManager] Error switching to "${name}":`, error);
      target.state = 'idle' as SceneState;

      // TODO: Switch to error fallback scene
      throw error;
    } finally {
      this._transitioning = false;
    }
  }

  /**
   * Preload scene resources without switching.
   */
  async preload(name: string, onProgress?: (p: number) => void): Promise<void> {
    const scene = this.scenes.get(name);
    if (!scene) {
      throw new Error(`[SceneManager] Scene "${name}" not found`);
    }

    if (scene.assets.length === 0) return;

    // Use AssetManager if available
    const assetManager = this.app.getModule<import('@ksgames26/assets').AssetManager>('assets');
    if (assetManager) {
      await assetManager.loadBundle(scene.assets, onProgress);
    }
  }

  /**
   * Register scene update in the ticker and resize listener.
   */
  override onEnable(): Promise<void> {
    this.app.pixiApp.ticker.add((ticker) => {
      if (this._current?.state === ('active' as SceneState)) {
        this._current.onUpdate(ticker);
      }
    });

    // Listen for screen resize and dispatch to active scene
    this.app.events.on(GameEvents.SCREEN_RESIZE, (width: unknown, height: unknown) => {
      if (this._current?.state === ('active' as SceneState)) {
        this._current.onResize(width as number, height as number);
      }
    });

    return super.onEnable();
  }

  override onDestroy(): void {
    for (const scene of this.scenes.values()) {
      scene.destroy();
    }
    this.scenes.clear();
    this._current = null;
    super.onDestroy();
  }

  /**
   * Apply fade-in transition to a scene.
   */
  private async applyFadeIn(scene: Scene, duration: number): Promise<void> {
    return new Promise((resolve) => {
      scene.stage.alpha = 0;
      const startTime = Date.now();

      const fadeStep = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        scene.stage.alpha = progress;

        if (progress >= 1) {
          scene.stage.alpha = 1;
          resolve();
        } else {
          requestAnimationFrame(fadeStep);
        }
      };

      requestAnimationFrame(fadeStep);
    });
  }
}
