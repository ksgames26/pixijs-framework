/**
 * Type definitions for Douyin Mini Game API (tt object)
 * Based on official Douyin documentation
 */

declare namespace TT {
  interface SystemInfo {
    platform: string;
    system: string;
    language: string;
    screenWidth: number;
    screenHeight: number;
    devicePixelRatio: number;
    windowWidth?: number;
    windowHeight?: number;
  }

  interface NetworkStatus {
    isConnected: boolean;
    networkType: string;
  }

  interface RequestOptions {
    url: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'HEAD' | 'TRACE' | 'CONNECT';
    data?: string | Record<string, any> | ArrayBuffer;
    header?: Record<string, string>;
    dataType?: 'json' | 'string';
    responseType?: 'text' | 'arraybuffer';
    success?: (res: RequestSuccessCallback) => void;
    fail?: (res: RequestFailCallback) => void;
  }

  interface RequestSuccessCallback {
    data: string | Record<string, any> | ArrayBuffer;
    statusCode: number;
    header: Record<string, string>;
  }

  interface RequestFailCallback {
    errMsg: string;
  }

  interface SocketTask {
    send(options: { data: string | ArrayBuffer }): void;
    close(options?: { code?: number; reason?: string }): void;
    onOpen(callback: () => void): void;
    onClose(callback: (res: any) => void): void;
    onMessage(callback: (res: { data: string | ArrayBuffer }) => void): void;
    onError(callback: (res: { errMsg: string }) => void): void;
  }

  interface ConnectSocketOptions {
    url: string;
    protocols?: string[];
  }

  interface WorkerInstance {
    postMessage(message: any, transferList?: ArrayBuffer[]): void;
    onMessage(callback: (res: any) => void): void;
    terminate(): void;
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
    onError(callback: () => void): void;
  }

  interface FileSystemManager {
    readFile(options: {
      filePath: string;
      encoding?: 'ascii' | 'base64' | 'binary' | 'hex' | 'utf-8' | 'utf8' | 'latin1' | undefined;
      success?: (res: { data: string | ArrayBuffer }) => void;
      fail?: (res: { errMsg: string }) => void;
    }): void;
  }

  interface StorageInfo {
    keys: string[];
    currentSize: number;
    limitSize: number;
  }

  interface Touch {
    identifier: number;
    pageX: number;
    pageY: number;
    clientX: number;
    clientY: number;
    force?: number;
    radiusX?: number;
    radiusY?: number;
  }

  interface TouchEvent {
    touches: Touch[];
    changedTouches: Touch[];
    timeStamp: number;
    altKey?: boolean;
    ctrlKey?: boolean;
    metaKey?: boolean;
    shiftKey?: boolean;
    preventDefault?(): void;
  }

  interface WindowResizeEvent {
    windowWidth: number;
    windowHeight: number;
  }

  interface Performance {
    now(): number;
  }

  interface TTAPI {
    // System Info
    getSystemInfoSync(): SystemInfo;

    // Network
    request(options: RequestOptions): void;
    connectSocket(options: ConnectSocketOptions): SocketTask;
    onNetworkStatusChange(callback: (res: NetworkStatus) => void): void;

    // Worker
    createWorker(scriptPath: string): WorkerInstance;

    // Canvas & Image
    createCanvas(): HTMLCanvasElement;
    createImage(): HTMLImageElement;

    // Audio
    createInnerAudioContext(): InnerAudioContext;
    getAudioContext?(): AudioContext;
    getPerformance?(): Performance;

    // File System
    getFileSystemManager(): FileSystemManager;

    // Storage
    getStorageInfoSync(): StorageInfo;
    getStorageSync(key: string): any;
    setStorageSync(key: string, data: any): void;
    setStorage(options: { key: string; data: any; success?: () => void; fail?: (res: any) => void }): void;
    removeStorageSync(key: string): void;
    removeStorage(options: { key: string; success?: () => void; fail?: (res: any) => void }): void;
    clearStorageSync(): void;
    clearStorage(options?: { success?: () => void; fail?: (res: any) => void }): void;

    // Lifecycle
    onHide(callback: () => void): void;
    onShow(callback: () => void): void;

    // Touch Events
    onTouchStart(callback: (res: TouchEvent) => void): void;
    onTouchMove(callback: (res: TouchEvent) => void): void;
    onTouchEnd(callback: (res: TouchEvent) => void): void;
    onTouchCancel(callback: (res: TouchEvent) => void): void;

    // Window
    onWindowResize?(callback: (res: WindowResizeEvent) => void): void;

    // Environment
    env?: {
      USER_DATA_PATH: string;
    };
  }
}

declare const tt: TT.TTAPI;

declare const GameGlobal: typeof globalThis & {
  __isAdapterInjected?: boolean;
  screencanvas?: HTMLCanvasElement;
  global?: typeof globalThis;
};
