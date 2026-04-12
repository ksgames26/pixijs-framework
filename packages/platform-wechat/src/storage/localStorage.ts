/// <reference path="../types/wx.d.ts" />

export const localStorage: Storage = {
  get length(): number {
    const { keys } = wx.getStorageInfoSync();
    return keys.length;
  },

  key(n: number): string | null {
    const { keys } = wx.getStorageInfoSync();
    return keys[n] || null;
  },

  getItem(key: string): string | null {
    const value = wx.getStorageSync(key);
    return value !== '' && value !== undefined ? value : null;
  },

  setItem(key: string, value: string): void {
    wx.setStorageSync(key, value);
  },

  removeItem(key: string): void {
    wx.removeStorageSync(key);
  },

  clear(): void {
    wx.clearStorageSync();
  },
};

export default localStorage;
