/// <reference path="../types/wx.d.ts" />

const _url = new WeakMap<XMLHttpRequest, string>();
const _method = new WeakMap<XMLHttpRequest, string>();
const _requestHeader = new WeakMap<XMLHttpRequest, Record<string, string>>();
const _responseHeader = new WeakMap<XMLHttpRequest, Record<string, string>>();
const _requestTask = new WeakMap<XMLHttpRequest, WX.RequestTask>();

function _triggerEvent(xhr: XMLHttpRequest, type: string, ...args: any[]): void {
  const handler = (xhr as any)[`on${type}`];
  if (typeof handler === 'function') {
    handler.apply(xhr, args);
  }
}

function _changeReadyState(xhr: XMLHttpRequest, readyState: number): void {
  (xhr as any).readyState = readyState;
  _triggerEvent(xhr, 'readystatechange');
}

export class XMLHttpRequest {
  static readonly UNSENT = 0;
  static readonly OPENED = 1;
  static readonly HEADERS_RECEIVED = 2;
  static readonly LOADING = 3;
  static readonly DONE = 4;

  public onabort: ((this: XMLHttpRequest, ev: any) => any) | null = null;
  public onerror: ((this: XMLHttpRequest, ev: any) => any) | null = null;
  public onload: ((this: XMLHttpRequest, ev: any) => any) | null = null;
  public onloadstart: ((this: XMLHttpRequest, ev: any) => any) | null = null;
  public onprogress: ((this: XMLHttpRequest, ev: any) => any) | null = null;
  public ontimeout: ((this: XMLHttpRequest, ev: any) => any) | null = null;
  public onloadend: ((this: XMLHttpRequest, ev: any) => any) | null = null;
  public onreadystatechange: ((this: XMLHttpRequest, ev: any) => any) | null = null;

  public readyState: number = XMLHttpRequest.UNSENT;
  public response: any = null;
  public responseText: string | null = null;
  public responseType: XMLHttpRequestResponseType = 'text';
  public responseXML: Document | null = null;
  public status: number = 0;
  public statusText: string = '';
  public upload: any = {};
  public withCredentials: boolean = false;

  constructor() {
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
    _method.set(this, method);
    _url.set(this, url);
    _changeReadyState(this, XMLHttpRequest.OPENED);
  }

  overrideMimeType(): void {
    // Stub
  }

  send(data: string = ''): void {
    if (this.readyState !== XMLHttpRequest.OPENED) {
      throw new Error("Failed to execute 'send' on 'XMLHttpRequest': The object's state must be OPENED.");
    }

    wx.request({
      data: data as any,
      url: _url.get(this)!,
      method: _method.get(this)! as any,
      header: _requestHeader.get(this)!,
      responseType: this.responseType as 'text' | 'arraybuffer',
      success: (res: WX.RequestSuccessCallback) => {
        let responseData: any = res.data;

        if (typeof responseData !== 'string' && !(responseData instanceof ArrayBuffer)) {
          try {
            responseData = JSON.stringify(responseData);
          } catch (e) {
            // Keep original data
          }
        }

        this.status = res.statusCode;
        _responseHeader.set(this, res.header);
        _triggerEvent(this, 'loadstart');
        _changeReadyState(this, XMLHttpRequest.HEADERS_RECEIVED);
        _changeReadyState(this, XMLHttpRequest.LOADING);

        this.response = responseData;

        if (responseData instanceof ArrayBuffer) {
          this.responseText = '';
          const bytes = new Uint8Array(responseData);
          const len = bytes.byteLength;
          for (let i = 0; i < len; i++) {
            this.responseText += String.fromCharCode(bytes[i]);
          }
        } else {
          this.responseText = responseData;
        }

        _changeReadyState(this, XMLHttpRequest.DONE);
        _triggerEvent(this, 'load');
        _triggerEvent(this, 'loadend');
      },
      fail: (res: { errMsg: string }) => {
        if (res.errMsg.indexOf('abort') !== -1) {
          _triggerEvent(this, 'abort');
        } else {
          _triggerEvent(this, 'error', res);
        }
        _triggerEvent(this, 'loadend');
      },
    });
  }

  setRequestHeader(header: string, value: string): void {
    const myHeader = _requestHeader.get(this);
    if (myHeader) {
      myHeader[header] = value;
      _requestHeader.set(this, myHeader);
    }
  }
}

export default XMLHttpRequest;
