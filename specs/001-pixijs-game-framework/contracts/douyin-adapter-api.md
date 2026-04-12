# Contract: 抖音 WebApp Adapter API

**Package**: `@ksgames26/platform-douyin`  
**Version**: 1.0.0  
**Date**: 2026-04-11

## 概述

抖音 WebApp Adapter 是一个浏览器环境模拟层，为抖音小游戏提供标准 Web API 支持。它将抖音小游戏运行时 API (`tt`) 映射为浏览器标准 API。

## API 契约

### 全局注入

Adapter 会自动将以下对象注入到 `GameGlobal`（全局对象）：

```typescript
// 自动注入时检查
declare const GameGlobal: {
  __isAdapterInjected?: boolean;
} & typeof globalThis;

// 注入后可通过以下方式访问
const canvas = document.createElement('canvas');
const xhr = new XMLHttpRequest();
```

### 事件系统

#### Event

```typescript
class Event {
  constructor(type: string);
  readonly type: string;
  readonly timeStamp: number;
  cancelBubble: boolean;
  cancelable: boolean;
  target: any;
  currentTarget: any;
  preventDefault(): void;
  stopPropagation(): void;
}
```

#### EventTarget

```typescript
class EventTarget {
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject | null,
    options?: boolean | EventListenerOptions
  ): void;
  dispatchEvent(event: Event): boolean;
}
```

### 网络

#### XMLHttpRequest

```typescript
class XMLHttpRequest extends EventTarget {
  // 状态常量
  static readonly UNSENT = 0;
  static readonly OPENED = 1;
  static readonly HEADERS_RECEIVED = 2;
  static readonly LOADING = 3;
  static readonly DONE = 4;

  // 属性
  onreadystatechange: ((this: XMLHttpRequest, ev: Event) => any) | null;
  readonly readyState: number;
  readonly response: any;
  readonly responseText: string;
  responseType: XMLHttpRequestResponseType;
  readonly status: number;
  readonly statusText: string;
  readonly upload: XMLHttpRequestUpload;
  withCredentials: boolean;

  // 方法
  open(method: string, url: string): void;
  send(body?: Document | BodyInit | null): void;
  abort(): void;
  getAllResponseHeaders(): string;
  getResponseHeader(header: string): string | null;
  setRequestHeader(header: string, value: string): void;
  overrideMimeType(mime: string): void;
}
```

**注意**: 本地文件路径（非 http/https）会通过 `tt.getFileSystemManager()` 读取。

#### WebSocket

```typescript
class WebSocket {
  static readonly CONNECTING = 0;
  static readonly OPEN = 1;
  static readonly CLOSING = 2;
  static readonly CLOSED = 3;

  constructor(url: string | URL, protocols?: string | string[]);

  readonly url: string;
  readonly readyState: number;
  readonly protocol: string;
  readonly extensions: string;
  readonly bufferedAmount: number;
  binaryType: BinaryType;

  onopen: ((this: WebSocket, ev: Event) => any) | null;
  onmessage: ((this: WebSocket, ev: MessageEvent) => any) | null;
  onerror: ((this: WebSocket, ev: Event) => any) | null;
  onclose: ((this: WebSocket, ev: CloseEvent) => any) | null;

  send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void;
  close(code?: number, reason?: string): void;
}
```

### DOM

#### 类层次

```
EventTarget
└── Node
    └── Element
        └── HTMLElement
            ├── HTMLCanvasElement
            │   └── Canvas (抖音包装)
            ├── HTMLVideoElement
            └── HTMLMediaElement
                ├── HTMLAudioElement
                │   └── Audio
                └── AudioContext
```

#### HTMLElement

```typescript
class HTMLElement extends Element {
  constructor(tagName?: string, level?: number);

  // 基本属性
  tagName: string;
  className: string;
  innerHTML: string;
  style: CSSStyleDeclaration;
  dataset: DOMStringMap;
  classList: DOMTokenList;

  // 布局属性
  readonly clientLeft: number;
  readonly clientTop: number;
  readonly clientWidth: number;
  readonly clientHeight: number;
  readonly offsetLeft: number;
  readonly offsetTop: number;
  readonly offsetWidth: number;
  readonly offsetHeight: number;
  scrollLeft: number;
  scrollTop: number;
  readonly scrollWidth: number;
  readonly scrollHeight: number;

  // 方法
  focus(): void;
  blur(): void;
  insertBefore<T extends Node>(newNode: T, referenceNode: Node | null): T;
  remove(): void;
  getBoundingClientRect(): DOMRect;
}
```

#### Canvas

```typescript
class Canvas extends HTMLCanvasElement {
  // 包装 tt.createCanvas() 创建的画布
  readonly canvas: HTMLCanvasElement;

  width: number;
  height: number;

  getContext(
    contextId: '2d' | 'webgl' | 'experimental-webgl',
    contextAttributes?: any
  ): RenderingContext | null;
  toDataURL(type?: string, encoderOptions?: number): string;
}

// 全局默认 Canvas 实例
const canvas: Canvas;
```

#### Image

```typescript
class Image {
  constructor();
  src: string;
  width: number;
  height: number;
  readonly naturalWidth: number;
  readonly naturalHeight: number;
  complete: boolean;
  crossOrigin: string | null;
  onload: ((this: GlobalEventHandlers, ev: Event) => any) | null;
  onerror: ((this: GlobalEventHandlers, ev: Event) => any) | null;
}
```

### 媒体

#### Audio

```typescript
class Audio extends HTMLAudioElement {
  // 状态常量
  static readonly HAVE_NOTHING = 0;
  static readonly HAVE_METADATA = 1;
  static readonly HAVE_CURRENT_DATA = 2;
  static readonly HAVE_FUTURE_DATA = 3;
  static readonly HAVE_ENOUGH_DATA = 4;

  constructor(url?: string);

  src: string;
  currentTime: number;
  readonly duration: number;
  loop: boolean;
  autoplay: boolean;
  readonly paused: boolean;
  volume: number;
  muted: boolean;
  readonly readyState: number;

  play(): void;
  pause(): void;
  resume(): void;
  destroy(): void;
  canPlayType(type: string): CanPlayTypeResult;
}
```

#### AudioContext

```typescript
class AudioContext {
  constructor();

  readonly audioContext: any; // 原生 tt.getAudioContext()
  readonly state: AudioContextState;
  readonly destination: AudioDestinationNode;

  getContext(): void;
  decodeAudioData(
    audioData: ArrayBuffer,
    successCallback?: DecodeSuccessCallback,
    errorCallback?: DecodeErrorCallback
  ): Promise<AudioBuffer>;
  createAnalyser(): AnalyserNode;
  createBufferSource(): AudioBufferSourceNode;
  createGain(): GainNode;
  createMediaElementSource(mediaElement: HTMLMediaElement): MediaElementAudioSourceNode;
}
```

### Worker

```typescript
class Worker {
  constructor(scriptURL: string | URL);

  onmessage: ((this: Worker, ev: MessageEvent) => any) | null;

  postMessage(message: any, transferList?: Transferable[]): void;
  terminate(): void;
}
```

### 存储

#### localStorage

```typescript
interface Storage {
  readonly length: number;
  key(index: number): string | null;
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
}

// 全局实例
const localStorage: Storage;
```

**注意**: 使用 `window.asyncStorage` 标志控制同步/异步存储模式。

#### Blob

```typescript
class Blob {
  constructor(
    blobParts?: BlobPart[],
    options?: BlobPropertyBag
  );

  readonly size: number;
  readonly type: string;

  slice(start?: number, end?: number, contentType?: string): Blob;
  arrayBuffer(): Promise<ArrayBuffer>;
  text(): Promise<string>;
}
```

#### URL

```typescript
class URL {
  constructor(url: string | URL, base?: string | URL);

  href: string;
  protocol: string;
  host: string;
  pathname: string;
  search: string;
  hash: string;
  readonly searchParams: URLSearchParams;

  static createObjectURL(obj: Blob): string;
  static revokeObjectURL(url: string): void;
}
```

### 全局对象

#### navigator

```typescript
interface Navigator {
  readonly platform: string;
  readonly language: string;
  readonly appVersion: string;
  readonly userAgent: string;
  onLine: boolean;
  readonly geolocation: {
    getCurrentPosition: (...args: any[]) => void;
    watchPosition: (...args: any[]) => void;
    clearWatch: (...args: any[]) => void;
  };
}

// 全局实例
const navigator: Navigator;
```

#### performance

```typescript
interface Performance {
  readonly timeOrigin: number;
  now(): number;
}

// 全局实例
const performance: Performance;
```

#### screen

```typescript
interface Screen {
  readonly width: number;
  readonly height: number;
  readonly availWidth: number;
  readonly availHeight: number;
  readonly availLeft: number;
  readonly availTop: number;
}

// 全局实例
const screen: Screen;
```

#### location

```typescript
interface Location {
  href: string;
  reload(): void;
  replace(url: string): void;
}

// 全局实例
const location: Location;
```

#### document

```typescript
interface Document extends EventTarget {
  readonly readyState: DocumentReadyState;
  readonly visibilityState: VisibilityState;
  hidden: boolean;
  readonly fullscreen: boolean;
  readonly location: Location;
  readonly scripts: HTMLScriptElement[];
  readonly style: CSSStyleDeclaration;
  readonly documentElement: HTMLElement;
  readonly head: HTMLElement;
  readonly body: HTMLElement;

  createElement<K extends keyof HTMLElementTagNameMap>(
    tagName: K
  ): HTMLElementTagNameMap[K];
  createElement(tagName: string): HTMLElement;
  createElementNS(namespaceURI: string, qualifiedName: string): Element;
  createTextNode(data: string): Text;
  getElementById(elementId: string): HTMLElement | null;
  getElementsByTagName<K extends keyof HTMLElementTagNameMap>(
    qualifiedName: K
  ): HTMLCollectionOf<HTMLElementTagNameMap[K]>;
  getElementsByTagName(qualifiedName: string): HTMLCollectionOf<Element>;
  getElementsByTagNameNS(namespaceURI: string, localName: string): HTMLCollectionOf<Element>;
  getElementsByName(elementName: string): NodeListOf<HTMLElement>;
  querySelector<K extends keyof HTMLElementTagNameMap>(
    selectors: string
  ): HTMLElementTagNameMap[K] | null;
  querySelector(selectors: string): Element | null;
  querySelectorAll<K extends keyof HTMLElementTagNameMap>(
    selectors: string
  ): NodeListOf<HTMLElementTagNameMap[K]>;
  querySelectorAll(selectors: string): NodeListOf<Element>;
  hasFocus(): boolean;
}

// 全局实例
const document: Document;
```

#### window

```typescript
interface Window extends EventTarget {
  // 基本方法
  alert(message?: any): void;
  focus(): void;
  blur(): void;
  getComputedStyle(element: Element): CSSStyleDeclaration;
  scrollTo(x: number, y: number): void;
  scrollBy(dx: number, dy: number): void;
  matchMedia(query: string): MediaQueryList;
  atob(encodedString: string): string;
  btoa(stringToEncode: string): string;

  // 全局对象
  readonly navigator: Navigator;
  readonly location: Location;
  readonly localStorage: Storage;
  readonly performance: Performance;
  readonly screen: Screen;
  readonly document: Document;

  // 全局类
  readonly XMLHttpRequest: typeof XMLHttpRequest;
  readonly WebSocket: typeof WebSocket;
  readonly Worker: typeof Worker;
  readonly Image: typeof Image;
  readonly Audio: typeof Audio;
  readonly AudioContext: typeof AudioContext;
  readonly FileReader: typeof FileReader;
  readonly Blob: typeof Blob;
  readonly URL: typeof URL;
  readonly TextDecoder: typeof TextDecoder;
  readonly Element: typeof Element;
  readonly HTMLElement: typeof HTMLElement;
  readonly HTMLCanvasElement: typeof HTMLCanvasElement;
  readonly HTMLImageElement: typeof HTMLImageElement;
  readonly HTMLMediaElement: typeof HTMLMediaElement;
  readonly HTMLAudioElement: typeof HTMLAudioElement;
  readonly HTMLVideoElement: typeof HTMLVideoElement;
  readonly TouchEvent: typeof TouchEvent;
  readonly PointerEvent: typeof PointerEvent;
  readonly MouseEvent: typeof MouseEvent;

  // 尺寸
  readonly innerWidth: number;
  readonly innerHeight: number;
  readonly devicePixelRatio: number;
  readonly scrollX: number;
  readonly scrollY: number;

  // 触摸事件
  ontouchstart: ((this: Window, ev: TouchEvent) => any) | null;
  ontouchmove: ((this: Window, ev: TouchEvent) => any) | null;
  ontouchend: ((this: Window, ev: TouchEvent) => any) | null;

  // canvas
  readonly canvas: Canvas;
}

// 全局实例
const window: Window;
```

## 平台特定行为

### 触摸事件映射

抖音触摸事件自动映射为 PointerEvent：

| 抖音事件 | 映射为 | 说明 |
|---------|--------|------|
| `tt.onTouchStart` | `pointerdown` | 同时触发 `touchstart` |
| `tt.onTouchMove` | `pointermove` | 同时触发 `touchmove` |
| `tt.onTouchEnd` | `pointerup` | 同时触发 `touchend` |
| `tt.onTouchCancel` | `pointercancel` | 同时触发 `touchcancel` |

### 网络请求行为

- `http/https` URL：使用 `tt.request()`
- 本地文件路径：使用 `tt.getFileSystemManager().readFile()`

### 生命周期事件

| 抖音事件 | document 事件 | 状态变化 |
|---------|--------------|---------|
| `tt.onHide` | `visibilitychange` | `hidden=true, visibilityState='hidden'` |
| `tt.onShow` | `visibilitychange` | `hidden=false, visibilityState='visible'` |

## 版本兼容性

- 抖音小游戏基础库版本: >= 1.0.0
- TypeScript: >= 4.5.0
- 目标: ES2015

## 依赖

- 运行时依赖: 无（直接使用抖音 `tt` API）
- 开发依赖: TypeScript 类型定义

## 注意事项

1. **自动注入**: Adapter 在导入时自动注入，通过 `GameGlobal.__isAdapterInjected` 防止重复注入
2. **性能监控**: 在非开发者工具环境下，`console.time/timeEnd` 被重写到 `tt.getPerformance()`
3. **Worker 限制**: 同一时间只能有一个 Worker 实例运行，新建 Worker 会自动终止前一个
4. **Canvas 唯一**: 通过 `tt.createCanvas()` 创建的 Canvas 是唯一的屏幕画布
