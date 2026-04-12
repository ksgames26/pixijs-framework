/// <reference path="./types/wx.d.ts" />

import type { PlatformAdapter, StorageLike, SystemInfo } from '@ksgames26/core';
import { WechatStorage } from './wechat-storage';

/**
 * WeChat Mini Game platform adapter.
 * Wraps wx.* APIs to conform to PlatformAdapter interface.
 */
export class WechatAdapter implements PlatformAdapter {
  createCanvas(): HTMLCanvasElement {
    return wx.createCanvas() as unknown as HTMLCanvasElement;
  }

  createImage(): HTMLImageElement {
    return wx.createImage() as unknown as HTMLImageElement;
  }

  getStorage(): StorageLike {
    return new WechatStorage();
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
      wx.request({
        url,
        method: (init?.method as 'GET' | 'POST' | 'PUT' | 'DELETE') ?? 'GET',
        data: init?.body as string,
        header: init?.headers instanceof Headers
          ? Object.fromEntries((init.headers as Headers).entries())
          : (init?.headers as Record<string, string> | undefined),
        success: (res) => {
          resolve({
            ok: res.statusCode >= 200 && res.statusCode < 300,
            status: res.statusCode,
            headers: new Headers(res.header as Record<string, string>),
            json: () => {
              const data = res.data;
              // wx.request may auto-parse JSON; avoid double-parsing
              if (typeof data === 'object' && data !== null) {
                return Promise.resolve(data);
              }
              return Promise.resolve(JSON.parse(data as string));
            },
            text: () => Promise.resolve(typeof res.data === 'string' ? res.data : JSON.stringify(res.data)),
          } as Response);
        },
        fail: (err) => {
          reject(new Error(err.errMsg));
        },
      });
    });
  }

  resolvePath(path: string): string {
    // In WeChat mini game, use user data path for local files
    if (path.startsWith('./') || path.startsWith('../')) {
      return `${wx.env.USER_DATA_PATH}/${path}`;
    }
    return path;
  }

  getSystemInfo(): SystemInfo {
    const info = wx.getSystemInfoSync();
    return {
      screenWidth: info.screenWidth,
      screenHeight: info.screenHeight,
      pixelRatio: info.pixelRatio,
      platform: 'wechat',
      systemVersion: info.system,
    };
  }

  onResize(callback: (width: number, height: number) => void): () => void {
    const handler = (res: WX.WindowResizeEvent) => {
      callback(res.windowWidth, res.windowHeight);
    };
    wx.onWindowResize(handler);
    return () => {
      wx.offWindowResize(handler);
    };
  }

  onTouchStart(callback: (event: TouchEvent) => void): void {
    wx.onTouchStart((res: unknown) => {
      callback(res as TouchEvent);
    });
  }

  onTouchMove(callback: (event: TouchEvent) => void): void {
    wx.onTouchMove((res: unknown) => {
      callback(res as TouchEvent);
    });
  }

  onTouchEnd(callback: (event: TouchEvent) => void): void {
    wx.onTouchEnd((res: unknown) => {
      callback(res as TouchEvent);
    });
  }
}
