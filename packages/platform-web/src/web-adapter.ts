import type { PlatformAdapter, StorageLike, SystemInfo } from '@ksgames26/core';
import { WebStorage } from './web-storage';

/**
 * Web platform adapter.
 * Uses standard browser APIs.
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
