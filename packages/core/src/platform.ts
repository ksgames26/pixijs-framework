/**
 * Platform adapter interface.
 * Abstracts platform differences for canvas, storage, network, and input.
 */
export interface PlatformAdapter {
  /** Create the main canvas element */
  createCanvas(): HTMLCanvasElement;

  /** Create an image element */
  createImage(): HTMLImageElement;

  /** Get local storage implementation */
  getStorage(): StorageLike;

  /** Register a frame callback */
  requestAnimationFrame(callback: FrameRequestCallback): number;

  /** Cancel a frame callback */
  cancelAnimationFrame(id: number): void;

  /** HTTP request (fetch-compatible) */
  fetch(url: string, init?: RequestInit): Promise<Response>;

  /** Resolve an asset path to platform-specific format */
  resolvePath(path: string): string;

  /** Get system information */
  getSystemInfo(): SystemInfo;

  /**
   * Register a callback for window/canvas resize events.
   * Uses platform-native resize events (zero polling overhead).
   * @returns Unsubscribe function to remove the callback
   */
  onResize(callback: (width: number, height: number) => void): () => void;

  /** Register touch start handler */
  onTouchStart(callback: (event: TouchEvent) => void): void;

  /** Register touch move handler */
  onTouchMove(callback: (event: TouchEvent) => void): void;

  /** Register touch end handler */
  onTouchEnd(callback: (event: TouchEvent) => void): void;
}

/**
 * Minimal storage interface compatible with localStorage and mini-game APIs.
 */
export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
}

/**
 * System information returned by platform adapter.
 */
export interface SystemInfo {
  screenWidth: number;
  screenHeight: number;
  pixelRatio: number;
  platform: 'web' | 'wechat' | 'douyin';
  systemVersion: string;
}

/**
 * Auto-detect current platform and return appropriate adapter name.
 * Detection order: wx → tt → web
 */
export function detectPlatformName(): 'wechat' | 'douyin' | 'web' {
  if (typeof wx !== 'undefined' && typeof wx.createCanvas === 'function') {
    return 'wechat';
  }
  if (typeof tt !== 'undefined' && typeof tt.createCanvas === 'function') {
    return 'douyin';
  }
  return 'web';
}

// Type declarations for mini-game global objects
declare const wx: { createCanvas?: () => HTMLCanvasElement } | undefined;
declare const tt: { createCanvas?: () => HTMLCanvasElement } | undefined;
