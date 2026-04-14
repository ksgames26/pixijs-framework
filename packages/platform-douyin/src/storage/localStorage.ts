/**
 * localStorage implementation
 * Maps to tt storage APIs
 */




export const localStorage: Storage = {
  get length(): number {
    const info = tt.getStorageInfoSync();
    return info.keys.length;
  },

  key(n: number): string | null {
    const info = tt.getStorageInfoSync();
    return info.keys[n] || null;
  },

  getItem(key: string): string | null {
    const value = tt.getStorageSync(key);
    return value === '' ? null : value;
  },

  setItem(key: string, value: string): void {
    if ((globalThis as any).asyncStorage) {
      tt.setStorage({
        key: key,
        data: value,
      });
    } else {
      tt.setStorageSync(key, value);
    }
  },

  removeItem(key: string): void {
    if ((globalThis as any).asyncStorage) {
      tt.removeStorage({
        key: key,
      });
    } else {
      tt.removeStorageSync(key);
    }
  },

  clear(): void {
    if ((globalThis as any).asyncStorage) {
      tt.clearStorage();
    } else {
      tt.clearStorageSync();
    }
  },
};

export default localStorage;
