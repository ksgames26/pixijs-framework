import type { StorageLike } from '@ksgames26/core';

/**
 * Douyin Mini Game storage wrapper.
 * Uses tt.setStorageSync/getStorageSync.
 */
export class DouyinStorage implements StorageLike {
  getItem(key: string): string | null {
    const value = tt.getStorageSync(key);
    return value || null;
  }

  setItem(key: string, value: string): void {
    tt.setStorageSync(key, value);
  }

  removeItem(key: string): void {
    tt.removeStorageSync(key);
  }

  clear(): void {
    tt.clearStorageSync();
  }
}

declare const tt: {
  getStorageSync(key: string): string;
  setStorageSync(key: string, data: string): void;
  removeStorageSync(key: string): void;
  clearStorageSync(): void;
};
