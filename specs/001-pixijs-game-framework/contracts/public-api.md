# Public API Contract: @ksgames26/core

Package: `@ksgames26/core`
Version: 1.0.0

## GameApplication

```typescript
class GameApplication {
  /** PixiJS Application 实例 */
  readonly pixiApp: Application;

  /** 当前平台适配器 */
  readonly platform: PlatformAdapter;

  /** 屏幕自适应适配器 */
  readonly screen: ScreenAdapter;

  /** 显示对象工厂 (Constitution VI) */
  readonly factory: DisplayObjectFactory;

  /** 事件总线 */
  readonly events: EventBus;

  /** 是否为开发模式 */
  readonly isDev: boolean;

  /**
   * 初始化框架
   * @param config 框架配置
   * @throws 当平台不支持的渲染模式时抛出错误
   */
  init(config?: GameConfig): Promise<this>;

  /**
   * 注册功能模块
   * @param module 模块实例
   * @throws 当模块名已存在时抛出错误
   */
  registerModule(module: Module): void;

  /**
   * 获取已注册的功能模块
   * @param name 模块名
   * @returns 模块实例，不存在时返回 undefined
   */
  getModule<T extends Module>(name: string): T | undefined;

  /**
   * 销毁框架，释放所有资源
   * 按顺序：场景 → 模块 → 资源 → 渲染器
   */
  destroy(): void;
}
```

## GameConfig

```typescript
interface GameConfig {
  /** 画布宽度，默认 window.innerWidth (Web) / 平台视口宽 */
  width?: number;
  /** 画布高度，默认 window.innerHeight (Web) / 平台视口高 */
  height?: number;
  /** 背景色，默认 0x000000 */
  backgroundColor?: number;
  /** 渲染分辨率，默认 devicePixelRatio */
  resolution?: number;
  /** 抗锯齿，默认 true */
  antialias?: boolean;
  /** 目标平台，默认 'auto'（自动检测） */
  platform?: 'web' | 'wechat' | 'douyin' | 'auto';
  /** 显式传入平台适配器（小游戏平台必须传入） */
  platformAdapter?: PlatformAdapter;
  /** 开发调试模式，默认 false */
  debug?: boolean;
  /** 不可裁剪的模块列表 */
  noStripModules?: string[];
}
```

## Module

```typescript
abstract class Module {
  /** 模块唯一标识 */
  abstract readonly name: string;
  /** 模块版本 */
  abstract readonly version: string;

  /** 注册时调用，接收框架实例 */
  onRegister(app: GameApplication): void;
  /** 启用模块（异步，可加载资源） */
  onEnable(): Promise<void>;
  /** 禁用模块 */
  onDisable(): void;
  /** 销毁模块，释放所有资源 */
  onDestroy(): void;
}
```

## Events

```typescript
/** 框架事件常量 */
interface GameEvents {
  /** 框架初始化完成 */
  'app:init': () => void;
  /** WebGL 上下文丢失 */
  'app:contextlost': () => void;
  /** WebGL 上下文恢复 */
  'app:contextrestored': () => void;
  /** 渲染器降级（WebGL → Canvas 2D 等） */
  'app:rendererfallback': (rendererType: string) => void;
  /** 屏幕尺寸变化 */
  'screen:resize': (width: number, height: number) => void;
  /** 场景切换开始 */
  'scene:switch': (from: string, to: string) => void;
  /** 场景切换完成 */
  'scene:switched': (name: string) => void;
  /** 资源加载完成 */
  'asset:loaded': (key: string) => void;
  /** 资源卸载完成 */
  'asset:unloaded': (key: string) => void;
  /** 资源加载失败 */
  'asset:error': (key: string, error: Error) => void;
}
```

## ScreenAdapter

```typescript
class ScreenAdapter {
  /**
   * 启动 resize 检测（事件驱动，零轮询）
   * 通过 PlatformAdapter.onResize() 注册平台原生 resize 回调
   * 回调触发时：
   *   1. 调用 renderer.resize(width, height)
   *   2. 通过 EventBus 发射 'screen:resize' 事件
   */
  start(): void;

  /** 停止 resize 检测，移除回调 */
  stop(): void;

  /**
   * 获取当前画布渲染尺寸
   * 返回 renderer 的实际渲染像素尺寸
   */
  readonly dimensions: { width: number; height: number };
}
```

## PlatformAdapter (resize 相关)

```typescript
interface PlatformAdapter {
  // ... 现有方法 ...

  /**
   * 注册窗口/画布尺寸变化回调
   * Web: window.addEventListener('resize', cb)
   * 微信: wx.onWindowResize(cb)
   * 抖音: tt.onWindowResize(cb)
   *
   * @param callback 尺寸变化时的回调，接收新的 width/height
   * @returns 取消注册函数
   */
  onResize(callback: (width: number, height: number) => void): () => void;
}
```
