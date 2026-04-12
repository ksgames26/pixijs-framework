import type { PlatformAdapter, StorageLike, SystemInfo } from './platform';

/**
 * Web Storage implementation using localStorage.
 */
class WebStorage implements StorageLike {
  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }
}

/**
 * Web platform adapter.
 * Uses standard browser APIs.
 * Included in core package to avoid dynamic imports (mini-game compatibility).
 */
export class WebAdapter implements PlatformAdapter {
  createCanvas(): HTMLCanvasElement {
    return document.createElement('canvas');
  }

  createImage(): HTMLImageElement {
    return new Image();
  }

  getStorage(): StorageLike {
    return new WebStorage();
  }

  requestAnimationFrame(callback: FrameRequestCallback): number {
    return window.requestAnimationFrame(callback);
  }

  cancelAnimationFrame(id: number): void {
    window.cancelAnimationFrame(id);
  }

  async fetch(url: string, init?: RequestInit): Promise<Response> {
    return globalThis.fetch(url, init);
  }

  resolvePath(path: string): string {
    return path;
  }

  getSystemInfo(): SystemInfo {
    return {
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      pixelRatio: window.devicePixelRatio ?? 1,
      platform: 'web',
      systemVersion: navigator.userAgent,
    };
  }

  onResize(callback: (width: number, height: number) => void): () => void {
    const handler = () => {
      callback(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handler);
    return () => {
      window.removeEventListener('resize', handler);
    };
  }

  onTouchStart(callback: (event: TouchEvent) => void): void {
    window.addEventListener('touchstart', callback as EventListener);
  }

  onTouchMove(callback: (event: TouchEvent) => void): void {
    window.addEventListener('touchmove', callback as EventListener);
  }

  onTouchEnd(callback: (event: TouchEvent) => void): void {
    window.addEventListener('touchend', callback as EventListener);
  }
}
