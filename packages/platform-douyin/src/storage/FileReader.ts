import { EventTarget } from '../event/EventTarget';

/**
 * FileReader class
 * Stub implementation for File API compatibility
 */
export class FileReader extends EventTarget {
  public error: Error | null = null;
  public readyState: number = 0;
  public result: any = null;

  static readonly EMPTY = 0;
  static readonly LOADING = 1;
  static readonly DONE = 2;

  constructor() {
    super();
  }

  readAsArrayBuffer(_blob: Blob): void {
    // Stub
  }

  readAsBinaryString(_blob: Blob): void {
    // Stub
  }

  readAsDataURL(_blob: Blob): void {
    // Stub
  }

  readAsText(_blob: Blob, _encoding?: string): void {
    // Stub
  }

  abort(): void {
    // Stub
  }
}

export default FileReader;
