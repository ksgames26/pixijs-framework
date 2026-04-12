import { Container } from 'pixi.js';
import type { Scene } from './scene';

/**
 * Scene transition animations.
 */

/**
 * Interface for custom scene transitions.
 */
export interface SceneTransition {
  /** Exit transition animation */
  exit(from: Scene, to: Scene, progress: (t: number) => void): Promise<void>;
  /** Enter transition animation */
  enter(from: Scene, to: Scene, progress: (t: number) => void): Promise<void>;
}

/**
 * Built-in fade transition.
 */
export class FadeTransition implements SceneTransition {
  constructor(private duration = 500) {}

  async exit(from: Scene): Promise<void> {
    return this.animateAlpha(from.stage, 1, 0, this.duration / 2);
  }

  async enter(_from: Scene, to: Scene): Promise<void> {
    return this.animateAlpha(to.stage, 0, 1, this.duration / 2);
  }

  private animateAlpha(
    target: Container,
    from: number,
    to: number,
    duration: number,
  ): Promise<void> {
    return new Promise((resolve) => {
      target.alpha = from;
      const startTime = Date.now();

      const step = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        target.alpha = from + (to - from) * progress;

        if (progress >= 1) {
          target.alpha = to;
          resolve();
        } else {
          requestAnimationFrame(step);
        }
      };

      requestAnimationFrame(step);
    });
  }
}
