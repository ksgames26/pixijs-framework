/// <reference path="../types/wx.d.ts" />

const _socketTask = new WeakMap<WebSocket, WX.SocketTask>();

export class WebSocket {
  static readonly CONNECTING = 0;
  static readonly OPEN = 1;
  static readonly CLOSING = 2;
  static readonly CLOSED = 3;

  public binaryType: string = '';
  public bufferedAmount: number = 0;
  public extensions: string = '';
  public protocol: string = '';
  public readyState: number = WebSocket.CLOSED;
  public url: string = '';

  public onclose: ((this: WebSocket, ev: any) => any) | null = null;
  public onerror: ((this: WebSocket, ev: any) => any) | null = null;
  public onmessage: ((this: WebSocket, ev: any) => any) | null = null;
  public onopen: ((this: WebSocket, ev: any) => any) | null = null;

  constructor(url: string, protocols: string | string[] = []) {
    if (typeof url !== 'string' || !/(^ws:\/\/)|(^wss:\/\/)/.test(url)) {
      throw new TypeError(`Failed to construct 'WebSocket': The URL '${url}' is invalid`);
    }

    this.url = url;
    this.readyState = WebSocket.CONNECTING;

    const socketTask = wx.connectSocket({
      url,
      protocols: Array.isArray(protocols) ? protocols : [protocols],
    });

    _socketTask.set(this, socketTask);

    socketTask.onClose((res: { code: number; reason: string }) => {
      this.readyState = WebSocket.CLOSED;
      if (typeof this.onclose === 'function') {
        this.onclose(res);
      }
    });

    socketTask.onMessage((res: { data: string | ArrayBuffer }) => {
      if (typeof this.onmessage === 'function') {
        this.onmessage(res);
      }
    });

    socketTask.onOpen(() => {
      this.readyState = WebSocket.OPEN;
      if (typeof this.onopen === 'function') {
        this.onopen({} as any);
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
        code,
        reason,
      });
    }
  }

  send(data: string | ArrayBuffer): void {
    if (typeof data !== 'string' && !(data instanceof ArrayBuffer)) {
      throw new TypeError(`Failed to send message: The data ${data} is invalid`);
    }

    const socketTask = _socketTask.get(this);
    if (socketTask) {
      socketTask.send({
        data,
      });
    }
  }
}

export default WebSocket;
