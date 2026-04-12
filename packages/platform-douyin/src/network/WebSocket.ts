/// <reference path="../types/tt.d.ts" />

declare const tt: TT.TTAPI;

const _socketTask = new WeakMap<WebSocket, TT.SocketTask>();

/**
 * WebSocket class
 * Wraps tt.connectSocket() for WebSocket API compatibility
 */
export class WebSocket {
  static readonly CONNECTING = 0;
  static readonly OPEN = 1;
  static readonly CLOSING = 2;
  static readonly CLOSED = 3;

  public binaryType: BinaryType = 'blob';
  public bufferedAmount: number = 0;
  public extensions: string = '';
  public onclose: ((this: WebSocket, ev: CloseEvent) => any) | null = null;
  public onerror: ((this: WebSocket, ev: Event) => any) | null = null;
  public onmessage: ((this: WebSocket, ev: MessageEvent) => any) | null = null;
  public onopen: ((this: WebSocket, ev: Event) => any) | null = null;
  public protocol: string = '';
  public readyState: number = WebSocket.CLOSED;
  public url: string = '';

  constructor(url: string | URL, protocols: string | string[] = []) {
    const urlString = url.toString();

    if (
      typeof urlString !== 'string' ||
      !/(^ws:\/\/)|(^wss:\/\/)/.test(urlString)
    ) {
      throw new TypeError(
        `Failed to construct 'WebSocket': The URL '${urlString}' is invalid`
      );
    }

    this.url = urlString;
    this.readyState = WebSocket.CONNECTING;

    const protocolsArray = Array.isArray(protocols)
      ? protocols
      : [protocols];

    const socketTask = tt.connectSocket({
      url: urlString,
      protocols: protocolsArray,
    });

    _socketTask.set(this, socketTask);

    socketTask.onClose((res: any) => {
      this.readyState = WebSocket.CLOSED;
      if (typeof this.onclose === 'function') {
        this.onclose(res);
      }
    });

    socketTask.onMessage((res: { data: string | ArrayBuffer }) => {
      if (typeof this.onmessage === 'function') {
        const messageEvent = new MessageEvent('message', { data: res.data });
        this.onmessage(messageEvent);
      }
    });

    socketTask.onOpen(() => {
      this.readyState = WebSocket.OPEN;
      if (typeof this.onopen === 'function') {
        this.onopen(new Event('open'));
      }
    });

    socketTask.onError((res: { errMsg: string }) => {
      if (typeof this.onerror === 'function') {
        this.onerror(new Error(res.errMsg) as any);
      }
    });
  }

  close(code?: number, reason?: string): void {
    this.readyState = WebSocket.CLOSING;
    const socketTask = _socketTask.get(this);
    if (socketTask) {
      socketTask.close({
        code: code,
        reason: reason,
      });
    }
  }

  send(data: string | ArrayBuffer | Blob | ArrayBufferView): void {
    if (typeof data !== 'string' && !(data instanceof ArrayBuffer)) {
      throw new TypeError(
        `Failed to send message: The data ${data} is invalid`
      );
    }

    const socketTask = _socketTask.get(this);
    if (socketTask) {
      socketTask.send({
        data: data as string | ArrayBuffer,
      });
    }
  }
}

export default WebSocket;
