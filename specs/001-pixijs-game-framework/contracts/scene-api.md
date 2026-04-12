# Public API Contract: @ksgames26/scene

Package: `@ksgames26/scene`
Depends: `@ksgames26/core`, `@ksgames26/assets`

## Scene

```typescript
abstract class Scene {
  /** 场景唯一标识 */
  abstract readonly name: string;

  /** 场景根容器 */
  readonly stage: Container;

  /** 场景依赖的资源清单 */
  readonly assets: Array<{key: string; url: string}>;

  /** 当前生命周期状态 */
  readonly state: SceneState;

  /** 进入场景 */
  onEnter(params?: Record<string, unknown>): Promise<void>;

  /** 退出场景 */
  onExit(): Promise<void>;

  /** 挂起（被其他场景覆盖） */
  onSuspend(): void;

  /** 恢复（从挂起恢复） */
  onResume(): void;

  /** 每帧更新 */
  onUpdate(ticker: Ticker): void;

  /** 窗口大小变化 */
  onResize(width: number, height: number): void;
}

type SceneState = 'idle' | 'entering' | 'active' | 'suspended' | 'exiting' | 'destroyed';
```

## SceneManager

```typescript
class SceneManager extends Module {
  readonly name = 'scene';

  /** 当前活跃场景 */
  readonly current: Scene | null;

  /** 是否正在过渡中 */
  readonly transitioning: boolean;

  /**
   * 注册场景
   * 注入框架实例到场景的 app 属性
   */
  register(scene: Scene): void;

  /** 注销场景 */
  unregister(name: string): void;

  /**
   * 切换到指定场景
   * @param name 目标场景名
   * @param params 传递给目标场景的参数
   * @param transition 过渡配置
   * @throws 场景不存在时抛出错误
   * @throws 正在过渡中时抛出错误（除非排队）
   */
  switchTo(
    name: string,
    params?: Record<string, unknown>,
    transition?: TransitionConfig
  ): Promise<void>;

  /** 预加载场景资源（不切换场景） */
  preload(name: string, onProgress?: (p: number) => void): Promise<void>;
}

interface TransitionConfig {
  /** 过渡类型 */
  type?: 'fade' | 'custom';
  /** 过渡时长 (ms)，默认 500 */
  duration?: number;
  /** 显示 Loading 的阈值 (ms)，默认 300 */
  loadingThreshold?: number;
  /** 自定义 Loading 场景名 */
  loadingScene?: string;
  /** 自定义过渡实现 */
  customTransition?: SceneTransition;
}

interface SceneTransition {
  /** 退出过渡动画 */
  exit(from: Scene, to: Scene, progress: (t: number) => void): Promise<void>;
  /** 进入过渡动画 */
  enter(from: Scene, to: Scene, progress: (t: number) => void): Promise<void>;
}
```
