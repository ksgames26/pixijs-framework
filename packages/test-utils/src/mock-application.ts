import { Container } from 'pixi.js';

/**
 * Minimal mock of PixiJS Application for unit testing.
 * Provides the API surface needed by framework modules
 * without requiring a real browser/WebGL environment.
 */
export class MockApplication {
  canvas = {
    width: 800,
    height: 600,
    getContext: () => null,
    remove: () => {},
    style: {},
    addEventListener: () => {},
    removeEventListener: () => {},
  } as unknown as HTMLCanvasElement;

  stage = new Container();

  renderer = {
    width: 800,
    height: 600,
    resolution: 1,
    resize: (_w: number, _h: number) => {},
    destroy: () => {},
    on: () => {},
    off: () => {},
    generateTexture: () => null,
  } as never;

  ticker = {
    add: (_fn: (ticker: unknown) => void) => {},
    remove: (_fn: (ticker: unknown) => void) => {},
    start: () => {},
    stop: () => {},
    deltaTime: 1,
    elapsedMS: 16.67,
    FPS: 60,
  } as never;

  destroy(): void {
    // no-op
  }
}
