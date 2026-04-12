/// <reference path="./types/wx.d.ts" />

import type { StorageLike } from '@ksgames26/core';

/**
 * WeChat Mini Game storage wrapper.
 * Uses wx.setStorageSync/getStorageSync.
 */
export class WechatStorage implements StorageLike {
  getItem(key: string): string | null {
    const value = wx.getStorageSync(key);
    return value !== '' && value !== undefined ? value : null;
  }

  setItem(key: string, value: string): void {
    wx.setStorageSync(key, value);
  }

  removeItem(key: string): void {
    wx.removeStorageSync(key);
  }

  clear(): void {
    wx.clearStorageSync();
  }
}
