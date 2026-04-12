# Data Model: PixiJS 游戏框架

**Feature**: 001-pixijs-game-framework
**Date**: 2026-04-11

## Entities

### GameApplication

框架主入口，负责初始化 PixiJS 渲染引擎和协调各模块。

| Field | Type | Description |
|-------|------|-------------|
| pixiApp | `Application` | PixiJS v8 Application 实例 |
| platform | `PlatformAdapter` | 当前平台适配器 |
| screen | `ScreenAdapter` | 屏幕自适应适配器 |
| factory | `DisplayObjectFactory` | 显示对象工厂 |
| events | `EventBus` | 事件总线 |
| modules | `Map<string, Module>` | 已注册的功能模块 |
| config | `GameConfig` | 框架配置 |
| isDev | `boolean` | 是否为开发模式 |

**Methods**:
- `init(config: GameConfig): Promise<void>` — 异步初始化
- `registerModule(module: Module): void` — 注册功能模块
- `getModule<T>(name: string): T` — 获取已注册模块
- `destroy(): void` — 销毁框架，释放所有资源

**State transitions**: `idle` → `initializing` → `running` → `destroying` → `destroyed`

---

### GameConfig

框架初始化配置。

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| width | `number` | `window.innerWidth` (Web) / 平台视口宽 | 画布宽度 |
| height | `number` | `window.innerHeight` (Web) / 平台视口高 | 画布高度 |
| backgroundColor | `number` | `0x000000` | 背景色 |
| resolution | `number` | `devicePixelRatio` | 渲染分辨率 |
| antialias | `boolean` | `true` | 抗锯齿 |
| platform | `'web'\|'wechat'\|'douyin'\|'auto'` | `'auto'` | 目标平台 |
| platformAdapter | `PlatformAdapter` | — | 显式传入平台适配器 |
| debug | `boolean` | `false` | 开发调试模式 |
| noStripModules | `string[]` | `[]` | 不可裁剪的模块列表 |

---

### ScreenAdapter

屏幕自适应适配器，处理画布尺寸检测和 resize 事件分发。采用事件驱动，不使用 ticker 轮询。

| Field | Type | Description |
|-------|------|-------------|
| dimensions | `{ width: number; height: number }` | 当前画布渲染尺寸（只读） |

**Methods**:
- `start(): void` — 通过 `PlatformAdapter.onResize()` 注册 resize 回调
- `stop(): void` — 移除 resize 回调，清理资源

**Resize 检测机制**（事件驱动，零轮询）:
1. `start()` 时调用 `PlatformAdapter.onResize(callback)` 注册原生 resize 回调
2. 平台原生事件触发时：Web → `window.resize`，微信 → `wx.onWindowResize`，抖音 → `tt.onWindowResize`
3. 回调中调用 `renderer.resize(width, height)` 更新画布尺寸
4. 通过 `GameApplication.events` 发射 `screen:resize` 事件（携带 width, height）
5. `SceneManager` 监听此事件并分发到当前活跃场景的 `Scene.onResize()`

---

### Module

功能模块抽象基类，各模块为独立 npm 包。

| Field | Type | Description |
|-------|------|-------------|
| name | `string` | 模块唯一标识 |
| version | `string` | 模块版本 |
| app | `GameApplication` | 框架实例引用（注入） |
| enabled | `boolean` | 是否已启用 |

**Methods**:
- `onRegister(app: GameApplication): void` — 注册时调用
- `onEnable(): Promise<void>` — 启用模块
- `onDisable(): void` — 禁用模块
- `onDestroy(): void` — 销毁模块

**Lifecycle**: `created` → `registered` → `enabled` → `disabled` → `destroyed`

---

### AssetManager

资源管理器，封装加载、缓存、引用计数和卸载逻辑。

| Field | Type | Description |
|-------|------|-------------|
| cache | `Map<string, AssetRef>` | 资源缓存映射 |
| loading | `Map<string, Promise<AssetRef>>` | 正在加载的资源 |
| loader | `AssetLoader` | 加载策略 |

**Methods**:
- `load<T>(key: string, url: string, options?: LoadOptions): Promise<AssetRef<T>>` — 加载资源
- `loadBundle(keys: string[], onProgress?: (p: number) => void): Promise<AssetRef[]>` — 批量加载
- `get<T>(key: string): AssetRef<T> \| undefined` — 获取已缓存资源
- `release(key: string): void` — 释放引用（引用计数 -1）
- `retain(key: string): void` — 增加引用（引用计数 +1）
- `forceUnload(key: string): void` — 强制卸载资源
- `getDebugInfo(): AssetDebugInfo[]` — 获取调试信息

---

### AssetRef\<T\>

资源引用句柄，携带引用计数和资源元信息。

| Field | Type | Description |
|-------|------|-------------|
| key | `string` | 资源唯一标识 |
| url | `string` | 资源原始 URL |
| data | `T` | 资源数据（Texture, Spritesheet 等） |
| type | `AssetType` | 资源类型枚举 |
| state | `AssetState` | 当前状态 |
| refCount | `number` | 引用计数 |
| size | `number` | 资源大小（字节估算） |
| loadedAt | `number` | 加载完成时间戳 |

**AssetType enum**: `texture` | `spritesheet` | `spine` | `json` | `audio` | `font` | `other`

**AssetState enum**: `pending` | `loading` | `loaded` | `error` | `unloading` | `unloaded`

---

### Scene

游戏场景，定义完整生命周期。

| Field | Type | Description |
|-------|------|-------------|
| name | `string` | 场景唯一标识 |
| stage | `Container` | 场景根容器 |
| assets | `string[]` | 场景依赖的资源列表 |
| state | `SceneState` | 当前生命周期状态 |
| app | `GameApplication` | 框架实例引用 |

**Methods**:
- `onEnter(params?: Record<string, unknown>): Promise<void>` — 进入场景
- `onExit(): Promise<void>` — 退出场景
- `onSuspend(): void` — 挂起（被其他场景覆盖）
- `onResume(): void` — 恢复（从挂起恢复）
- `onUpdate(ticker: Ticker): void` — 每帧更新
- `onResize(width: number, height: number): void` — 窗口大小变化

**SceneState enum**: `idle` | `entering` | `active` | `suspended` | `exiting` | `destroyed`

---

### SceneManager

场景管理器，处理注册、切换和过渡动画。

| Field | Type | Description |
|-------|------|-------------|
| scenes | `Map<string, Scene>` | 已注册的场景 |
| current | `Scene \| null` | 当前活跃场景 |
| transitioning | `boolean` | 是否正在过渡中 |
| transitionQueue | `string[]` | 待执行的切换队列 |

**Methods**:
- `register(scene: Scene): void` — 注册场景
- `switchTo(name: string, params?: Record<string, unknown>, transition?: TransitionConfig): Promise<void>` — 切换场景
- `getCurrent(): Scene \| null` — 获取当前场景
- `preload(name: string, onProgress?: (p: number) => void): Promise<void>` — 预加载场景资源

---

### TransitionConfig

场景过渡配置。

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| type | `'fade'\|'custom'` | `'fade'` | 过渡类型 |
| duration | `number` | `500` | 过渡时长 (ms) |
| loadingThreshold | `number` | `300` | 显示 Loading 的阈值 (ms) |
| loadingScene | `string` | `'__loading__'` | 自定义 Loading 场景名 |
| customTransition | `SceneTransition` | — | 自定义过渡实现 |

---

### PlatformAdapter

平台适配器接口，抽象平台差异。

| Method | Signature | Description |
|--------|-----------|-------------|
| createCanvas | `(): HTMLCanvasElement` | 创建画布 |
| createImage | `(): HTMLImageElement` | 创建图片对象 |
| getStorage | `(): Storage` | 获取本地存储 |
| requestAnimationFrame | `(cb: FrameRequestCallback): number` | 注册帧回调 |
| cancelAnimationFrame | `(id: number): void` | 取消帧回调 |
| fetch | `(url: string, options?): Promise<Response>` | HTTP 请求 |
| resolvePath | `(path: string): string` | 解析资源路径 |
| getSystemInfo | `(): SystemInfo` | 获取系统信息 |
| onTouchStart | `(cb): void` | 注册触摸开始事件 |
| onTouchMove | `(cb): void` | 注册触摸移动事件 |
| onTouchEnd | `(cb): void` | 注册触摸结束事件 |
| onResize | `(cb: (width: number, height: number) => void): () => void` | 注册窗口/画布尺寸变化回调，返回取消注册函数 |

---

### UITier

UI 分层容器，管理 UI 元素的层级和布局。

| Field | Type | Description |
|-------|------|-------------|
| container | `Container` | UI 根容器（始终在游戏内容之上） |
| layers | `Map<string, Container>` | 具名 UI 层 |
| layoutEngine | `LayoutEngine` | 布局引擎 |

**Methods**:
- `addLayer(name: string, zIndex: number): Container` — 添加 UI 层
- `getLayer(name: string): Container` — 获取 UI 层
- `removeLayer(name: string): void` — 移除 UI 层
- `addToLayer(layerName: string, element: Container): void` — 添加元素到指定层

---

### LayoutEngine

布局引擎（自建），提供弹性布局能力。

| Field | Type | Description |
|-------|------|-------------|
| root | `Container` | 布局根容器 |
| config | `LayoutConfig` | 布局配置 |

**LayoutConfig**:
| Field | Type | Description |
|-------|------|-------------|
| direction | `'row'\|'column'` | 主轴方向 |
| justifyContent | `'start'\|'center'\|'end'\|'between'` | 主轴对齐 |
| alignItems | `'start'\|'center'\|'end'\|'stretch'` | 交叉轴对齐 |
| gap | `number` | 元素间距 |
| padding | `{top, right, bottom, left}` | 内边距 |

**Methods**:
- `layout(): void` — 执行布局计算
- `addChild(child: Container, layoutProps: LayoutProps): void` — 添加带布局属性的子元素
- `removeChild(child: Container): void` — 移除子元素
- `onResize(width: number, height: number): void` — 响应尺寸变化

---

### ObjectPool\<T\>

泛型对象池，用于频繁创建销毁的显示对象（粒子、子弹、特效等）。满足宪章 I「对象池 MUST 用于频繁创建销毁的显示对象」。

| Field | Type | Description |
|-------|------|-------------|
| size | `number` | 池中可用对象数量 |
| activeCount | `number` | 当前借出的对象数量 |

**Constructor**:
- `new ObjectPool(factory: () => T, reset: (obj: T) => void, initialSize?: number)` — 工厂函数 + 重置函数 + 预热数量

**Methods**:
- `acquire(): T` — 从池中取出对象，池空时调用 factory 新建
- `release(obj: T): void` — 调用 reset 后归还池中
- `prewarm(count: number): void` — 预热池，预先创建指定数量的对象
- `drain(): void` — 清空池中所有对象

**State transitions**: `empty` → `prewarming` → `ready` ↔ `active`

---

### DisplayObjectFactory

显示对象工厂接口，所有显示对象创建 MUST 通过此工厂。满足宪章 VI「显示对象的创建 MUST 通过工厂函数」。便于测试中替换为 Mock。

| Method | Signature | Description |
|--------|-----------|-------------|
| createSprite | `(texture?: Texture): Sprite` | 创建精灵 |
| createContainer | `(): Container` | 创建容器 |
| createGraphics | `(): Graphics` | 创建图形 |
| createBitmapText | `(font: string, text: string): BitmapText` | 创建位图文本 |
| createText | `(options: TextOptions): Text` | 创建动态文本 |

**DefaultDisplayObjectFactory**: 直接调用 PixiJS 构造函数的默认实现。
**MockDisplayObjectFactory**: test-utils 中提供的 Mock 实现，返回轻量 Mock 对象。

---

### SerializableState

可序列化状态接口，支持状态快照对比测试。满足宪章 VI「状态管理 MUST 使用可序列化的数据结构」。

| Method | Signature | Description |
|--------|-----------|-------------|
| toJSON | `(): Record<string, unknown>` | 序列化为 JSON 对象 |
| fromJSON | `(data: Record<string, unknown>): void` | 从 JSON 对象恢复状态 |
| snapshot | `(): Readonly<Record<string, unknown>>` | 创建当前状态只读快照 |

Scene 基类内置 `state: SerializableState` 属性，业务场景通过实现此接口支持状态管理。

---

### BatchingConfig

纹理合批配置。满足宪章 I「纹理合批和图集 MUST 作为资源加载的默认策略」。

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| preferAtlas | `boolean` | `true` | 默认使用纹理图集 |
| autoBatchThreshold | `number` | `5` | 自动合批阈值 |
| maxAtlasSize | `number` | `2048` | 最大图集尺寸 |

---

### GameTextOptions

游戏文本选项，控制 BitmapText vs DynamicText 的选择。满足宪章 IV「文字渲染 MUST 使用 BitmapText 或预渲染策略」。

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| mode | `'bitmap' \| 'dynamic'` | `'bitmap'` | 文本渲染模式 |
| fontName | `string` | — | BitmapText 字体名（需预加载 .fnt） |
| textStyle | `TextStyleOptions` | — | DynamicText 样式（仅 mode='dynamic'） |

---

### DebugOverlay

调试覆盖层（仅开发模式）。

| Field | Type | Description |
|-------|------|-------------|
| visible | `boolean` | 是否可见 |
| fps | `number` | 当前帧率 |
| frameTimeMs | `number` | 当前帧时间 (ms) |
| frameTimeJitterMs | `number` | 帧时间波动 (ms) |
| memoryUsage | `number` | 内存占用 (MB) |
| rendererType | `string` | 当前渲染器类型（webgl/canvas） |
| resources | `AssetDebugInfo[]` | 资源状态列表 |
| sceneTree | `SceneTreeNode[]` | 场景层级树 |

**Methods**:
- `toggle(): void` — 切换显示/隐藏
- `refresh(): void` — 刷新数据
- `inspectResource(key: string): AssetDebugDetail` — 查看资源详情

---

## Relationships

```
GameApplication
├── 1:1 → PlatformAdapter (注入，运行时选择实现)
├── 1:1 → ScreenAdapter (创建并持有，通过 EventBus 分发 resize)
├── 1:1 → DisplayObjectFactory (创建并持有)
├── 1:1 → EventBus (事件总线，模块间通信)
├── 1:N → Module (注册表，可插拔)
│
EventBus
├── emits → screen:resize (ScreenAdapter 检测到尺寸变化)
├── emits → app:init, app:contextlost, app:contextrestored
├── emits → scene:switch, scene:switched
├── emits → asset:loaded, asset:unloaded, asset:error
│
ScreenAdapter
├── uses → PlatformAdapter.onResize() (事件驱动，零轮询)
├── calls → renderer.resize() (应用新尺寸)
├── emits → screen:resize via EventBus
│
SceneManager (Module)
├── listens → screen:resize (从 EventBus)
├── dispatches → Scene.onResize(width, height)
├── 1:N → Scene (注册表)
├── 1:1 → Scene (current，当前活跃场景)
│
DisplayObjectFactory (Interface)
├── DefaultDisplayObjectFactory (implements，生产环境)
├── MockDisplayObjectFactory (implements，测试环境)
│
ObjectPool<T> (独立泛型类，不依赖平台 API)
├── used by → Scene (便捷创建方法 createPool)
├── used by → AssetManager (临时对象管理)
│
SerializableState (Interface)
├── implemented by → Scene.state
│
AssetManager
├── 1:N → AssetRef (缓存管理)
├── 1:1 → AssetLoader (加载策略，基于 PixiJS Assets)
├── uses → BatchingConfig (纹理合批配置)
│
Scene
├── 1:1 → Container (stage，场景渲染树)
├── 1:1 → SerializableState (state，可序列化状态)
├── N:1 → AssetManager (资源依赖)
├── creates → ObjectPool<T> (便捷方法)
│
UITier (Module)
├── 1:1 → Container (UI root)
├── 1:N → Container (layers)
├── 1:1 → LayoutEngine
├── uses → GameTextOptions (BitmapText 默认)
│
PlatformAdapter (Interface)
├── WebAdapter (implements) — getSystemInfo() 返回 innerWidth/innerHeight
├── WechatAdapter (implements)
└── DouyinAdapter (implements)
```

---

## 抖音 WebApp Adapter 数据模型

### 核心类结构

以下类/对象需从 `tt-adapter.js` 转换为 TypeScript：

### Event 类

```typescript
class Event {
  type: string;
  timeStamp: number;
  cancelBubble: boolean;
  cancelable: boolean;
  target: any;
  currentTarget: any;
  preventDefault: () => void;
  stopPropagation: () => void;
}
```

### EventTarget 类

```typescript
class EventTarget {
  addEventListener(type: string, listener: Function, options?: AddEventListenerOptions): void;
  removeEventListener(type: string, listener: Function, options?: EventListenerOptions): void;
  dispatchEvent(event: Event): void;
}
```

### XMLHttpRequest 类

```typescript
class XMLHttpRequest extends EventTarget {
  // 状态常量
  static UNSENT = 0;
  static OPENED = 1;
  static HEADERS_RECEIVED = 2;
  static LOADING = 3;
  static DONE = 4;

  // 属性
  readyState: number;
  response: any;
  responseText: string | null;
  responseType: string;
  status: number;
  statusText: string;
  upload: any;
  withCredentials: boolean;

  // 事件处理
  onabort: ((this: XMLHttpRequest, ev: Event) => any) | null;
  onerror: ((this: XMLHttpRequest, ev: Event) => any) | null;
  onload: ((this: XMLHttpRequest, ev: Event) => any) | null;
  onloadstart: ((this: XMLHttpRequest, ev: Event) => any) | null;
  onprogress: ((this: XMLHttpRequest, ev: Event) => any) | null;
  ontimeout: ((this: XMLHttpRequest, ev: Event) => any) | null;
  onloadend: ((this: XMLHttpRequest, ev: Event) => any) | null;
  onreadystatechange: ((this: XMLHttpRequest, ev: Event) => any) | null;

  // 方法
  open(method: string, url: string): void;
  send(data?: string): void;
  abort(): void;
  getAllResponseHeaders(): string;
  getResponseHeader(header: string): string | null;
  setRequestHeader(header: string, value: string): void;
  overrideMimeType(mime: string): void;
}
```

### WebSocket 类

```typescript
class WebSocket {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  url: string;
  readyState: number;
  protocol: string;
  extensions: string;
  bufferedAmount: number;
  binaryType: string;

  onopen: ((this: WebSocket, ev: Event) => any) | null;
  onmessage: ((this: WebSocket, ev: MessageEvent) => any) | null;
  onerror: ((this: WebSocket, ev: Event) => any) | null;
  onclose: ((this: WebSocket, ev: CloseEvent) => any) | null;

  constructor(url: string, protocols?: string | string[]);
  send(data: string | ArrayBuffer): void;
  close(code?: number, reason?: string): void;
}
```

### DOM 类层次

```typescript
class Node extends EventTarget {
  childNodes: Node[];
  appendChild(node: Node): void;
  removeChild(node: Node): Node[] | null;
  cloneNode(): Node;
}

class Element extends Node {
  className: string;
  children: Element[];
  setAttribute(name: string, value: any): void;
  getAttribute(name: string): any;
  setAttributeNS(namespace: string, name: string, value: any): void;
  getAttributeNS(namespace: string, name: string): any;
}

class HTMLElement extends Element {
  tagName: string;
  className: string;
  children: Element[];
  innerHTML: string;
  style: CSSStyleDeclaration;
  dataset: DOMStringMap;
  classList: DOMTokenList;

  // 布局属性
  clientLeft: number;
  clientTop: number;
  clientWidth: number;
  clientHeight: number;
  offsetLeft: number;
  offsetTop: number;
  offsetWidth: number;
  offsetHeight: number;
  scrollLeft: number;
  scrollTop: number;
  scrollWidth: number;
  scrollHeight: number;

  // 方法
  focus(): void;
  blur(): void;
  insertBefore(newNode: Node, referenceNode: Node): void;
  remove(): void;
  getBoundingClientRect(): DOMRect;

  constructor(tagName?: string, level?: number);
}
```

### Canvas 类

```typescript
class Canvas extends HTMLCanvasElement {
  canvas: HTMLCanvasElement;

  width: number;
  height: number;

  getContext(contextType: string, contextAttributes?: any): RenderingContext | null;
  toDataURL(type?: string, encoderOptions?: number): string;
  focus(): void;
  blur(): void;
}
```

### 媒体类层次

```typescript
class HTMLMediaElement extends HTMLElement {
  addTextTrack(): void;
  captureStream(): MediaStream;
  fastSeek(time: number): void;
  load(): void;
  pause(): void;
  play(): Promise<void>;
}

class HTMLAudioElement extends HTMLMediaElement {
  constructor();
}

class Audio extends HTMLAudioElement {
  static HAVE_NOTHING = 0;
  static HAVE_METADATA = 1;
  static HAVE_CURRENT_DATA = 2;
  static HAVE_FUTURE_DATA = 3;
  static HAVE_ENOUGH_DATA = 4;

  src: string;
  currentTime: number;
  duration: number;
  loop: boolean;
  autoplay: boolean;
  paused: boolean;
  volume: number;
  muted: boolean;
  readyState: number;

  play(): void;
  pause(): void;
  resume(): void;
  destroy(): void;
  canPlayType(mediaType: string): string;
  cloneNode(): Audio;

  constructor(url?: string);
}

class AudioContext {
  audioContext: any;
  state: string;
  destination: AudioDestinationNode;

  getContext(): void;
  decodeAudioData(arrayBuffer: ArrayBuffer, successCallback?: Function, errorCallback?: Function): void;
  createAnalyser(): AnalyserNode;
  createBufferSource(): AudioBufferSourceNode;
  createGain(): GainNode;
  createMediaElementSource(element: HTMLMediaElement): MediaElementAudioSourceNode;
}
```

### Worker 类

```typescript
class Worker {
  onmessage: ((this: Worker, ev: MessageEvent) => any) | null;
  constructor(file: string);
  postMessage(message: any, transferList?: Transferable[]): void;
  terminate(): void;
}
```

### Blob 类

```typescript
class Blob {
  size: number;
  type: string;
  constructor(parts?: BlobPart[], options?: BlobPropertyBag);
  slice(start?: number, end?: number, contentType?: string): Blob;
  arrayBuffer(): Promise<ArrayBuffer>;
  text(): Promise<string>;
}
```

### URL 类

```typescript
class URL {
  href: string;
  protocol: string;
  host: string;
  pathname: string;
  search: string;
  hash: string;
  searchParams: URLSearchParams;

  constructor(url: string, base?: string);
  static createObjectURL(obj: Blob): string;
  static revokeObjectURL(url: string): void;
}
```

### 全局对象类型

```typescript
// navigator
interface Navigator {
  platform: string;
  language: string;
  appVersion: string;
  userAgent: string;
  onLine: boolean;
  geolocation: Geolocation;
}

// performance
interface Performance {
  timeOrigin: number;
  now(): number;
}

// screen
interface Screen {
  width: number;
  height: number;
  availWidth: number;
  availHeight: number;
  availLeft: number;
  availTop: number;
}

// localStorage
interface Storage {
  readonly length: number;
  key(index: number): string | null;
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
}

// location
interface Location {
  href: string;
  reload(): void;
  replace(url: string): void;
}

// document
interface Document extends EventTarget {
  readyState: string;
  visibilityState: string;
  hidden: boolean;
  fullscreen: boolean;
  location: Location;
  scripts: HTMLScriptElement[];
  style: CSSStyleDeclaration;
  documentElement: HTMLElement;
  head: HTMLElement;
  body: HTMLElement;

  createElement(tagName: string): HTMLElement;
  createElementNS(namespace: string, tagName: string): HTMLElement;
  createTextNode(text: string): Text;
  getElementById(id: string): HTMLElement | null;
  getElementsByTagName(tagName: string): HTMLElement[];
  getElementsByTagNameNS(namespace: string, tagName: string): HTMLElement[];
  getElementsByName(name: string): HTMLElement[];
  querySelector(selectors: string): HTMLElement | null;
  querySelectorAll(selectors: string): HTMLElement[];
  hasFocus(): boolean;
}

// window
interface Window extends EventTarget {
  alert(message?: any): void;
  focus(): void;
  blur(): void;
  getComputedStyle(element: Element): CSSStyleDeclaration;
  scrollTo(x: number, y: number): void;
  scrollBy(dx: number, dy: number): void;
  matchMedia(query: string): MediaQueryList;

  // 全局对象
  navigator: Navigator;
  location: Location;
  localStorage: Storage;
  performance: Performance;
  screen: Screen;
  document: Document;

  // 全局类
  XMLHttpRequest: typeof XMLHttpRequest;
  WebSocket: typeof WebSocket;
  Worker: typeof Worker;
  Image: typeof Image;
  Audio: typeof Audio;
  AudioContext: typeof AudioContext;
  FileReader: typeof FileReader;
  Blob: typeof Blob;
  URL: typeof URL;
  TextDecoder: typeof TextDecoder;

  // 尺寸属性
  innerWidth: number;
  innerHeight: number;
  devicePixelRatio: number;
  scrollX: number;
  scrollY: number;

  // 触摸事件处理
  ontouchstart: ((this: Window, ev: TouchEvent) => any) | null;
  ontouchmove: ((this: Window, ev: TouchEvent) => any) | null;
  ontouchend: ((this: Window, ev: TouchEvent) => any) | null;

  // canvas
  canvas: Canvas;
}
```

### 抖音 tt API 类型声明

```typescript
// types/tt.d.ts
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

  interface RequestOptions {
    url: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'HEAD' | 'TRACE' | 'CONNECT';
    data?: string | object | ArrayBuffer;
    header?: Record<string, string>;
    dataType?: 'json' | 'string';
    responseType?: 'text' | 'arraybuffer';
    success?: (res: RequestSuccessCallback) => void;
    fail?: (res: RequestFailCallback) => void;
  }

  interface RequestSuccessCallback {
    data: string | object | ArrayBuffer;
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

  interface TTAPI {
    // 系统信息
    getSystemInfoSync(): SystemInfo;

    // 网络请求
    request(options: RequestOptions): void;
    connectSocket(options: ConnectSocketOptions): SocketTask;

    // Worker
    createWorker(scriptPath: string): WorkerInstance;

    // Canvas & Image
    createCanvas(): HTMLCanvasElement;
    createImage(): HTMLImageElement;

    // Audio
    createInnerAudioContext(): InnerAudioContext;
    getAudioContext?(): AudioContext;
    getPerformance?(): Performance;

    // 文件系统
    getFileSystemManager(): FileSystemManager;

    // 存储
    getStorageInfoSync(): StorageInfo;
    getStorageSync(key: string): any;
    setStorageSync(key: string, data: any): void;
    setStorage(options: { key: string; data: any }): void;
    removeStorageSync(key: string): void;
    removeStorage(options: { key: string }): void;
    clearStorageSync(): void;
    clearStorage(): void;

    // 事件监听
    onNetworkStatusChange(callback: (res: { isConnected: boolean; networkType: string }) => void): void;
    onHide(callback: () => void): void;
    onShow(callback: () => void): void;
    onTouchStart(callback: (res: TouchEvent) => void): void;
    onTouchMove(callback: (res: TouchEvent) => void): void;
    onTouchEnd(callback: (res: TouchEvent) => void): void;
    onTouchCancel(callback: (res: TouchEvent) => void): void;
    onWindowResize?(callback: (res: { windowWidth: number; windowHeight: number }) => void): void;
  }
}

declare const tt: TT.TTAPI;
```
