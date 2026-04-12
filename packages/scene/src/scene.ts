import { Container, type Ticker } from 'pixi.js';
import type { SceneState } from './types';
import type { SceneAsset } from './types';

/**
 * Abstract base class for game scenes.
 * Defines the complete lifecycle: enter → active → (suspend/resume) → exit → destroyed.
 */
export abstract class Scene {
  /** Scene unique identifier */
  abstract readonly name: string;

  /** Scene root container */
  readonly stage = new Container();

  /** Scene dependency list */
  readonly assets: SceneAsset[] = [];

  /** Current lifecycle state */
  state: SceneState = 'idle' as SceneState;

  /** Framework reference (injected by SceneManager) */
  protected declare app: import('@ksgames26/core').GameApplication;

  /**
   * Called when entering the scene.
   * @param params Parameters passed from the previous scene
   */
  onEnter(_params?: Record<string, unknown>): Promise<void> {
    return Promise.resolve();
  }

  /**
   * Called when exiting the scene.
   */
  onExit(): Promise<void> {
    return Promise.resolve();
  }

  /**
   * Called when the scene is suspended (another scene covers it).
   */
  onSuspend(): void {
    // Override in subclass
  }

  /**
   * Called when the scene resumes from suspension.
   */
  onResume(): void {
    // Override in subclass
  }

  /**
   * Called every frame while the scene is active.
   */
  onUpdate(_ticker: Ticker): void {
    // Override in subclass
  }

  /**
   * Called when the window/canvas is resized.
   */
  onResize(_width: number, _height: number): void {
    // Override in subclass
  }

  /**
   * Destroy the scene and release resources.
   */
  destroy(): void {
    this.stage.destroy({ children: true });
    this.state = 'destroyed' as SceneState;
  }
}
