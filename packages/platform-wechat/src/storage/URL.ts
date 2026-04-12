import { Blob } from './Blob';

const urlStore = new Map<string, Blob>();

export class URL {
  public href: string;

  constructor(url: string) {
    this.href = url;
  }

  static createObjectURL(obj: Blob): string {
    if (obj instanceof Blob) {
      const url = `blob:${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      urlStore.set(url, obj);
      return url;
    }
    return '';
  }

  static revokeObjectURL(url: string): void {
    if (urlStore.has(url)) {
      urlStore.delete(url);
    }
  }

  toString(): string {
    return this.href;
  }
}

export default URL;
