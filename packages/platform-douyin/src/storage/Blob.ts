/**
 * Blob class
 * Binary Large Object implementation
 */
export class Blob {
  public readonly size: number;
  public readonly type: string;

  private _parts: BlobPart[];
  private _buffer: ArrayBuffer;

  constructor(parts?: BlobPart[], options?: BlobPropertyBag) {
    this._parts = parts || [];
    this.type = (options?.type || '').toLowerCase();
    this._buffer = this._processParts(this._parts);
    this.size = this._buffer.byteLength;
  }

  private _processParts(parts: BlobPart[]): ArrayBuffer {
    const buffers: Uint8Array[] = [];

    for (const part of parts) {
      if (part instanceof ArrayBuffer) {
        buffers.push(new Uint8Array(part));
      } else if (ArrayBuffer.isView(part)) {
        const view = part;
        buffers.push(new Uint8Array(view.buffer, view.byteOffset, view.byteLength));
      } else if (typeof part === 'string') {
        const encoder = new TextEncoder();
        buffers.push(encoder.encode(part));
      } else if (part instanceof Blob) {
        buffers.push(new Uint8Array(part._buffer));
      }
    }

    return this._concatBuffers(buffers);
  }

  private _concatBuffers(buffers: Uint8Array[]): ArrayBuffer {
    const totalLength = buffers.reduce((acc, buf) => acc + buf.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;

    for (const buf of buffers) {
      result.set(buf, offset);
      offset += buf.length;
    }

    return result.buffer;
  }

  slice(start: number = 0, end?: number, contentType?: string): Blob {
    const actualEnd = end ?? this._buffer.byteLength;
    const slicedBuffer = this._buffer.slice(start, actualEnd);

    return new Blob([slicedBuffer], {
      type: contentType || this.type,
    });
  }

  arrayBuffer(): Promise<ArrayBuffer> {
    return Promise.resolve(this._buffer);
  }

  text(): Promise<string> {
    const decoder = new TextDecoder();
    return Promise.resolve(decoder.decode(new Uint8Array(this._buffer)));
  }

  stream(): ReadableStream {
    // Stub - returns a basic readable stream
    return new ReadableStream({
      start(controller) {
        controller.close();
      },
    });
  }
}

export default Blob;
