import { EventTarget } from '../event/EventTarget';




/**
 * XMLHttpRequest class
 * Wraps tt.request() and tt.getFileSystemManager() for HTTP/FILE API compatibility
 */
const _requestHeader = new WeakMap<XMLHttpRequest, Record<string, string>>();
const _responseHeader = new WeakMap<XMLHttpRequest, Record<string, string>>();
const _requestTask = new WeakMap<XMLHttpRequest, any>();

export class XMLHttpRequest extends EventTarget {
  // States
  static readonly UNSENT = 0;
  static readonly OPENED = 1;
  static readonly HEADERS_RECEIVED = 2;
  static readonly LOADING = 3;
  static readonly DONE = 4;

  // Properties
  public onabort: ((this: XMLHttpRequest, ev: Event) => any) | null = null;
  public onerror: ((this: XMLHttpRequest, ev: Event) => any) | null = null;
  public onload: ((this: XMLHttpRequest, ev: Event) => any) | null = null;
  public onloadstart: ((this: XMLHttpRequest, ev: Event) => any) | null = null;
  public onprogress: ((this: XMLHttpRequest, ev: Event) => any) | null = null;
  public ontimeout: ((this: XMLHttpRequest, ev: Event) => any) | null = null;
  public onloadend: ((this: XMLHttpRequest, ev: Event) => any) | null = null;
  public onreadystatechange: ((this: XMLHttpRequest, ev: Event) => any) | null = null;

  public readyState: number = XMLHttpRequest.UNSENT;
  public response: any = null;
  public responseText: string | null = null;
  public responseXML: Document | null = null;
  public responseType: XMLHttpRequestResponseType = 'text';
  public status: number = 0;
  public statusText: string = '';
  public upload: any = {};
  public withCredentials: boolean = false;

  private _method: string = '';
  private _url: string = '';
  private dataType: 'json' | 'string' = 'string';

  constructor() {
    super();
    _requestHeader.set(this, {
      'content-type': 'application/x-www-form-urlencoded',
    });
    _responseHeader.set(this, {});
  }

  abort(): void {
    const myRequestTask = _requestTask.get(this);
    if (myRequestTask) {
      myRequestTask.abort();
    }
  }

  getAllResponseHeaders(): string {
    const responseHeader = _responseHeader.get(this);
    if (!responseHeader) return '';
    return Object.keys(responseHeader)
      .map(header => `${header}: ${responseHeader[header]}`)
      .join('\n');
  }

  getResponseHeader(header: string): string | null {
    return _responseHeader.get(this)?.[header] || null;
  }

  open(method: string, url: string): void {
    this._method = method;
    this._url = url;
    this._changeReadyState(XMLHttpRequest.OPENED);
  }

  overrideMimeType(_mime: string): void {
    // Stub
  }

  send(data: string = ''): void {
    if (this.readyState !== XMLHttpRequest.OPENED) {
      throw new Error(
        "Failed to execute 'send' on 'XMLHttpRequest': The object's state must be OPENED."
      );
    }

    const url = this._url;
    const header = _requestHeader.get(this) || {};
    const responseType = this.responseType;
    const relative = this._isRelativePath(url);

    let encoding: string | undefined;
    if (responseType !== 'arraybuffer') {
      encoding = 'utf8';
    }

    delete this.response;
    this.response = null;

    const onSuccess = (res: {
      data: any;
      statusCode?: number;
      header?: Record<string, string>;
    }) => {
      const statusCode = res.statusCode === undefined ? 200 : res.statusCode;
      let data = res.data;

      if (typeof data !== 'string' && !(data instanceof ArrayBuffer)) {
        try {
          data = JSON.stringify(data);
        } catch (e) {
          // Ignore
        }
      }

      this.status = statusCode;
      if (res.header) {
        _responseHeader.set(this, res.header);
      }

      this._triggerEvent('loadstart');
      this._changeReadyState(XMLHttpRequest.HEADERS_RECEIVED);
      this._changeReadyState(XMLHttpRequest.LOADING);

      this.response = data;
      if (data instanceof ArrayBuffer) {
        Object.defineProperty(this, 'responseText', {
          enumerable: true,
          configurable: true,
          get: function () {
            throw 'InvalidStateError : responseType is ' + this.responseType;
          },
        });
      } else {
        this.responseText = data;
      }

      this._changeReadyState(XMLHttpRequest.DONE);
      this._triggerEvent('load');
      this._triggerEvent('loadend');
    };

    const onFail = (res: { errMsg: string }) => {
      if (res.errMsg.indexOf('abort') !== -1) {
        this._triggerEvent('abort');
      } else {
        this._triggerEvent('error', { message: res.errMsg });
      }
      this._triggerEvent('loadend');
      if (relative) {
        console.warn(res.errMsg);
      }
    };

    if (relative) {
      const fs = tt.getFileSystemManager();
      const options: any = {
        filePath: url,
        success: onSuccess,
        fail: onFail,
      };
      if (encoding) {
        options.encoding = encoding;
      }
      fs.readFile(options);
      return;
    }

    const requestTask = tt.request({
      data: data,
      url: url,
      method: this._method as any,
      header: header,
      dataType: this.dataType,
      responseType: responseType as 'text' | 'arraybuffer',
      success: onSuccess,
      fail: onFail,
    });

    _requestTask.set(this, requestTask);
  }

  setRequestHeader(header: string, value: string): void {
    const myHeader = _requestHeader.get(this);
    if (myHeader) {
      myHeader[header] = value;
      _requestHeader.set(this, myHeader);
    }
  }

  addEventListener(type: string, listener: (event: Event) => void): void {
    if (typeof listener !== 'function') {
      return;
    }
    (this as any)['on' + type] = (event: Event = {} as Event) => {
      (event as any).target = (event as any).target || this;
      listener.call(this, event);
    };
  }

  removeEventListener(type: string, listener: (event: Event) => void): void {
    if ((this as any)['on' + type] === listener) {
      (this as any)['on' + type] = null;
    }
  }

  private _isRelativePath(url: string): boolean {
    return !/^(http|https|ftp|wxfile):\/\/.*/i.test(url);
  }

  private _triggerEvent(type: string, event: any = {}): void {
    event.target = event.target || this;
    const handler = (this as any)['on' + type];
    if (typeof handler === 'function') {
      handler.call(this, event);
    }
  }

  private _changeReadyState(readyState: number, event: any = {}): void {
    this.readyState = readyState;
    event.readyState = readyState;
    this._triggerEvent('readystatechange', event);
  }
}

export default XMLHttpRequest;
