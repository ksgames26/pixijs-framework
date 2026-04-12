/**
 * TextDecoder class
 * Decodes byte arrays to strings
 */
export class TextDecoder {
  private _encoding: string;
  private _fatal: boolean;
  private _ignoreBOM: boolean;

  constructor(encoding: string = 'utf-8', options?: TextDecoderOptions) {
    this._encoding = encoding;
    this._fatal = options?.fatal || false;
    this._ignoreBOM = options?.ignoreBOM || false;
  }

  get encoding(): string {
    return this._encoding;
  }

  get fatal(): boolean {
    return this._fatal;
  }

  get ignoreBOM(): boolean {
    return this._ignoreBOM;
  }

  decode(
    uint8Array: Uint8Array | ArrayBuffer | DataView,
    _options?: TextDecodeOptions
  ): string {
    let bytes: Uint8Array;
    if (uint8Array instanceof DataView) {
      bytes = new Uint8Array(uint8Array.buffer, uint8Array.byteOffset, uint8Array.byteLength);
    } else if (uint8Array instanceof ArrayBuffer) {
      bytes = new Uint8Array(uint8Array);
    } else {
      bytes = uint8Array;
    }

    let s = '';
    for (let i = 0, il = bytes.length; i < il; i++) {
      s += String.fromCharCode(bytes[i]);
    }

    try {
      return decodeURIComponent(escape(s));
    } catch (e) {
      return s;
    }
  }
}

export default TextDecoder;
