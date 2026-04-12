import type { StorageLike } from '@ksgames26/core';

/**
 * Web storage wrapper using localStorage.
 */
export class WebStorage implements StorageLike {
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
