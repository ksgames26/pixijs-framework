import type { PlatformAdapter, StorageLike, SystemInfo } from '@ksgames26/core';
import { DouyinStorage } from './douyin-storage';

/**
 * Douyin Mini Game platform adapter.
 * Wraps tt.* APIs to conform to PlatformAdapter interface.
 */
export class DouyinAdapter implements PlatformAdapter {
  createCanvas(): HTMLCanvasElement {
    return tt.createCanvas() as unknown as HTMLCanvasElement;
  }

  createImage(): HTMLImageElement {
    return tt.createImage() as unknown as HTMLImageElement;
  }

  getStorage(): StorageLike {
    return new DouyinStorage();
  }

  requestAnimationFrame(callback: FrameRequestCallback): number {
    return (globalThis as Record<string, unknown>).requestAnimationFrame
      ? (globalThis.requestAnimationFrame as typeof window.requestAnimationFrame)(callback)
      : setTimeout(callback, 16) as unknown as number;
  }

  cancelAnimationFrame(id: number): void {
    if ((globalThis as Record<string, unknown>).cancelAnimationFrame) {
      (globalThis.cancelAnimationFrame as typeof window.cancelAnimationFrame)(id);
    } else {
      clearTimeout(id);
    }
  }

  async fetch(url: string, init?: RequestInit): Promise<Response> {
    return new Promise((resolve, reject) => {
      tt.request({
        url,
        method: (init?.method as 'GET' | 'POST' | 'PUT' | 'DELETE') ?? 'GET',
        data: init?.body as string,
        header: init?.headers as Record<string, string>,
        success: (res: { statusCode: number; data: string; header: Record<string, string> }) => {
          resolve({
            ok: res.statusCode >= 200 && res.statusCode < 300,
            status: res.statusCode,
            headers: new Headers(res.header),
            json: () => Promise.resolve(JSON.parse(res.data)),
            text: () => Promise.resolve(res.data),
          } as Response);
        },
        fail: (err: { errMsg: string }) => {
          reject(new Error(err.errMsg));
        },
      });
    });
  }

  resolvePath(path: string): string {
    if (path.startsWith('./') || path.startsWith('../')) {
      return `${tt.env.USER_DATA_PATH}/${path}`;
    }
    return path;
  }

  getSystemInfo(): SystemInfo {
    const info = tt.getSystemInfoSync();
    return {
      screenWidth: info.screenWidth,
      screenHeight: info.screenHeight,
      pixelRatio: info.pixelRatio,
      platform: 'douyin',
      systemVersion: info.system,
    };
  }

  onResize(callback: (width: number, height: number) => void): () => void {
    const handler = (res: { windowWidth: number; windowHeight: number }) => {
      callback(res.windowWidth, res.windowHeight);
    };
    tt.onWindowResize(handler);
    return () => {
      tt.offWindowResize?.(handler);
    };
  }

  onTouchStart(callback: (event: TouchEvent) => void): void {
    tt.onTouchStart((res: unknown) => {
      callback(res as TouchEvent);
    });
  }

  onTouchMove(callback: (event: TouchEvent) => void): void {
    tt.onTouchMove((res: unknown) => {
      callback(res as TouchEvent);
    });
  }

  onTouchEnd(callback: (event: TouchEvent) => void): void {
    tt.onTouchEnd((res: unknown) => {
      callback(res as TouchEvent);
    });
  }
}

declare const tt: {
  createCanvas(): unknown;
  createImage(): unknown;
  env: { USER_DATA_PATH: string };
  getSystemInfoSync(): {
    screenWidth: number;
    screenHeight: number;
    pixelRatio: number;
    system: string;
  };
  request(options: {
    url: string;
    method?: string;
    data?: string;
    header?: Record<string, string>;
    success: (res: { statusCode: number; data: string; header: Record<string, string> }) => void;
    fail: (err: { errMsg: string }) => void;
  }): void;
  onTouchStart(callback: (res: unknown) => void): void;
  onTouchMove(callback: (res: unknown) => void): void;
  onTouchEnd(callback: (res: unknown) => void): void;
  onWindowResize(callback: (res: { windowWidth: number; windowHeight: number }) => void): void;
  offWindowResize?(callback: (res: { windowWidth: number; windowHeight: number }) => void): void;
};
