import type { PlatformAdapter } from './platform';

/**
 * Framework initialization configuration.
 */
export interface GameConfig {
  /** Canvas width, defaults to window.innerWidth */
  width?: number;

  /** Canvas height, defaults to window.innerHeight */
  height?: number;

  /** Background color, defaults to 0x000000 */
  backgroundColor?: number;

  /** Render resolution, defaults to devicePixelRatio */
  resolution?: number;

  /** Antialiasing, defaults to true */
  antialias?: boolean;

  /** Target platform, defaults to 'auto' (auto-detect) */
  platform?: 'web' | 'wechat' | 'douyin' | 'auto';

  /** Platform adapter instance. Required for mini-game platforms (WeChat/Douyin) */
  platformAdapter?: PlatformAdapter;

  /** HTML Canvas element to use for rendering */
  canvas?: HTMLCanvasElement;

  /** Development debug mode, defaults to false */
  debug?: boolean;

  /** Modules that must NOT be tree-shaken even if unreferenced */
  noStripModules?: string[];
}
