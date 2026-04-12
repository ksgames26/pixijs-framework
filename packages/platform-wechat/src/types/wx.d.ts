/**
 * WeChat Mini Game API type declarations.
 */
declare namespace WX {
  interface SystemInfo {
    screenWidth: number;
    screenHeight: number;
    pixelRatio: number;
    platform: string;
    system: string;
    language: string;
    brand: string;
    model: string;
    version: string;
    SDKVersion: string;
    windowWidth: number;
    windowHeight: number;
  }

  interface RequestOptions {
    url: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'HEAD' | 'TRACE' | 'CONNECT';
    data?: string | Record<string, unknown>;
    header?: Record<string, string>;
    responseType?: 'text' | 'arraybuffer';
    success?: (res: RequestSuccessCallback) => void;
    fail?: (res: { errMsg: string }) => void;
  }

  interface RequestSuccessCallback {
    data: string | ArrayBuffer | Record<string, unknown>;
    statusCode: number;
    header: Record<string, string>;
  }

  interface SocketTask {
    send(options: { data: string | ArrayBuffer }): void;
    close(options?: { code?: number; reason?: string }): void;
    onOpen(callback: () => void): void;
    onClose(callback: (res: { code: number; reason: string }) => void): void;
    onMessage(callback: (res: { data: string | ArrayBuffer }) => void): void;
    onError(callback: (res: { errMsg: string }) => void): void;
  }

  interface ConnectSocketOptions {
    url: string;
    protocols?: string | string[];
  }

  interface InnerAudioContext {
    src: string;
    startTime: number;
    autoplay: boolean;
    loop: boolean;
    obeyMuteSwitch: boolean;
    duration: number;
    currentTime: number;
    paused: boolean;
    buffered: number;
    volume: number;
    play(): void;
    pause(): void;
    stop(): void;
    seek(position: number): void;
    destroy(): void;
    onCanplay(callback: () => void): void;
    onPlay(callback: () => void): void;
    onPause(callback: () => void): void;
    onStop(callback: () => void): void;
    onEnded(callback: () => void): void;
    onTimeUpdate(callback: () => void): void;
    onError(callback: (res: { errMsg: string }) => void): void;
  }

  interface StorageInfo {
    keys: string[];
    currentSize: number;
    limitSize: number;
  }

  interface Touch {
    identifier: number;
    clientX: number;
    clientY: number;
    pageX: number;
    pageY: number;
  }

  interface TouchEvent {
    touches: Touch[];
    changedTouches: Touch[];
    timeStamp: number;
  }

  interface WindowResizeEvent {
    windowWidth: number;
    windowHeight: number;
  }

  interface WXPerformance {
    now(): number;
  }

  interface WXAPI {
    // System
    getSystemInfoSync(): SystemInfo;

    // Network
    request(options: RequestOptions): RequestTask;
    connectSocket(options: ConnectSocketOptions): SocketTask;

    // Canvas & Image
    createCanvas(): HTMLCanvasElement;
    createImage(): HTMLImageElement;

    // Audio
    createInnerAudioContext(): InnerAudioContext;

    // Storage
    getStorageInfoSync(): StorageInfo;
    getStorageSync(key: string): string;
    setStorageSync(key: string, data: string): void;
    removeStorageSync(key: string): void;
    clearStorageSync(): void;

    // Touch events
    onTouchStart(callback: (res: TouchEvent) => void): void;
    onTouchMove(callback: (res: TouchEvent) => void): void;
    onTouchEnd(callback: (res: TouchEvent) => void): void;
    onTouchCancel(callback: (res: TouchEvent) => void): void;

    // Window resize
    onWindowResize(callback: (res: WindowResizeEvent) => void): void;
    offWindowResize(callback: (res: WindowResizeEvent) => void): void;

    // Performance
    getPerformance(): WXPerformance;

    // Environment
    env: {
      USER_DATA_PATH: string;
    };
  }

  interface RequestTask {
    abort(): void;
  }
}

declare const wx: WX.WXAPI;

declare const GameGlobal: typeof globalThis & {
  __isAdapterInjected?: boolean;
  screencanvas?: HTMLCanvasElement;
  global?: typeof globalThis;
};
