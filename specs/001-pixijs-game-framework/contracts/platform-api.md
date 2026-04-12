# Public API Contract: @ksgames26/platform-web / platform-wechat / platform-douyin

## PlatformAdapter (Interface)

所有平台适配器必须实现此接口。

```typescript
interface PlatformAdapter {
  /** 创建主画布 */
  createCanvas(): HTMLCanvasElement;

  /** 创建图片对象 */
  createImage(): HTMLImageElement;

  /** 获取本地存储实现 */
  getStorage(): StorageLike;

  /** 注册帧回调 */
  requestAnimationFrame(callback: FrameRequestCallback): number;

  /** 取消帧回调 */
  cancelAnimationFrame(id: number): void;

  /** HTTP 请求 */
  fetch(url: string, init?: RequestInit): Promise<Response>;

  /** 解析资源路径 */
  resolvePath(path: string): string;

  /** 获取系统信息 */
  getSystemInfo(): SystemInfo;

  /** 注册触摸开始事件 */
  onTouchStart(callback: (event: TouchEvent) => void): void;

  /** 注册触摸移动事件 */
  onTouchMove(callback: (event: TouchEvent) => void): void;

  /** 注册触摸结束事件 */
  onTouchEnd(callback: (event: TouchEvent) => void): void;
}

interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
}

interface SystemInfo {
  /** 屏幕宽度 */
  screenWidth: number;
  /** 屏幕高度 */
  screenHeight: number;
  /** 设备像素比 */
  pixelRatio: number;
  /** 平台标识 */
  platform: 'web' | 'wechat' | 'douyin';
  /** 系统版本 */
  systemVersion: string;
}
```

## Auto-detection

```typescript
/**
 * 自动检测当前运行平台并返回对应的适配器
 * 检测顺序：wx → tt → web
 */
function detectPlatform(): PlatformAdapter;
```

## Platform-specific exports

```typescript
// @ksgames26/platform-web
export { WebAdapter } from './web-adapter';

// @ksgames26/platform-wechat
export { WechatAdapter } from './wechat-adapter';

// @ksgames26/platform-douyin
export { DouyinAdapter } from './douyin-adapter';
```
