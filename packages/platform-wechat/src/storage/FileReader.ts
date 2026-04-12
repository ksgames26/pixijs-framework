import { EventTarget } from '../event/EventTarget';
import { Blob } from './Blob';

export class FileReader extends EventTarget {
  public error: Error | null = null;
  public result: string | ArrayBuffer | null = null;

  static readonly EMPTY = 0;
  static readonly LOADING = 1;
  static readonly DONE = 2;

  private _readyState: number = FileReader.EMPTY;

  get readyState(): number {
    return this._readyState;
  }

  constructor() {
    super();
  }

  readAsArrayBuffer(blob: Blob): void {
    this._read(blob, (buffer) => {
      this.result = buffer;
    });
  }

  readAsBinaryString(blob: Blob): void {
    this._read(blob, (buffer) => {
      const bytes = new Uint8Array(buffer);
      let binary = '';
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      this.result = binary;
    });
  }

  readAsDataURL(blob: Blob): void {
    this._read(blob, (buffer) => {
      const bytes = new Uint8Array(buffer);
      let binary = '';
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      this.result = `data:${blob.type || 'application/octet-stream'};base64,${btoa(binary)}`;
    });
  }

  readAsText(blob: Blob, _encoding?: string): void {
    this._read(blob, (buffer) => {
      const decoder = new TextDecoder();
      this.result = decoder.decode(new Uint8Array(buffer));
    });
  }

  abort(): void {
    if (this._readyState === FileReader.LOADING) {
      this._readyState = FileReader.DONE;
      this.result = null;
      this.dispatchEvent({ type: 'abort' });
      this.dispatchEvent({ type: 'loadend' });
    }
  }

  private _read(blob: Blob, onSuccess: (buffer: ArrayBuffer) => void): void {
    if (this._readyState === FileReader.LOADING) {
      throw new Error('InvalidStateError: FileReader is already loading');
    }

    this._readyState = FileReader.LOADING;
    this.result = null;
    this.error = null;

    this.dispatchEvent({ type: 'loadstart' });

    try {
      const buffer = (blob as Blob)._getBuffer();
      onSuccess(buffer);
      this._readyState = FileReader.DONE;
      this.dispatchEvent({ type: 'load' });
      this.dispatchEvent({ type: 'loadend' });
    } catch (err) {
      this._readyState = FileReader.DONE;
      this.error = err as Error;
      this.dispatchEvent({ type: 'error' });
      this.dispatchEvent({ type: 'loadend' });
    }
  }
}

export default FileReader;
