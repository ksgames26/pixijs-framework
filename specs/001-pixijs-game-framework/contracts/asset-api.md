# Public API Contract: @ksgames26/assets

Package: `@ksgames26/assets`
Depends: `@ksgames26/core`, `pixi.js`, `@pixi/assetpack`

## AssetManager

```typescript
class AssetManager extends Module {
  readonly name = 'assets';

  /**
   * 加载单个资源
   * @param key 资源唯一标识
   * @param url 资源 URL
   * @param options 加载选项
   * @returns 资源引用句柄
   */
  load<T = unknown>(key: string, url: string, options?: LoadOptions): Promise<AssetRef<T>>;

  /**
   * 批量加载资源
   * @param manifest 资源清单 [{key, url}]
   * @param onProgress 进度回调 (0-100)
   * @returns 所有资源的引用句柄
   */
  loadBundle(
    manifest: Array<{key: string; url: string}>,
    onProgress?: (percent: number) => void
  ): Promise<AssetRef[]>;

  /**
   * 获取已缓存的资源
   * @param key 资源标识
   * @returns 资源引用，不存在时返回 undefined
   */
  get<T = unknown>(key: string): AssetRef<T> | undefined;

  /**
   * 增加资源引用计数
   * @param key 资源标识
   */
  retain(key: string): void;

  /**
   * 释放资源引用（引用计数 -1，到 0 时自动卸载）
   * @param key 资源标识
   */
  release(key: string): void;

  /**
   * 强制卸载资源，不论引用计数
   * @param key 资源标识
   */
  forceUnload(key: string): void;

  /**
   * 获取所有资源的调试信息
   * @returns 仅开发模式可用
   */
  getDebugInfo(): AssetDebugInfo[];
}

interface LoadOptions {
  /** 资源类型提示 */
  type?: AssetType;
  /** 加载优先级，数字越小越优先 */
  priority?: number;
  /** 是否为场景级资源（随场景卸载） */
  sceneLevel?: boolean;
}

type AssetType = 'texture' | 'spritesheet' | 'spine' | 'json' | 'audio' | 'font' | 'other';
```

## AssetRef\<T\>

```typescript
class AssetRef<T = unknown> {
  /** 资源唯一标识 */
  readonly key: string;
  /** 资源原始 URL */
  readonly url: string;
  /** 资源类型 */
  readonly type: AssetType;
  /** 资源数据 */
  readonly data: T;
  /** 当前状态 */
  readonly state: AssetState;
  /** 引用计数 */
  readonly refCount: number;
  /** 资源大小估算（字节） */
  readonly size: number;
  /** 加载完成时间戳 */
  readonly loadedAt: number;
  /** 最后错误信息 */
  readonly error: Error | null;
}

type AssetState = 'pending' | 'loading' | 'loaded' | 'error' | 'unloading' | 'unloaded';
```

## AssetDebugInfo

```typescript
interface AssetDebugInfo {
  key: string;
  type: AssetType;
  state: AssetState;
  refCount: number;
  size: number;
  loadedAt: number;
  url: string;
}

interface AssetDebugDetail extends AssetDebugInfo {
  /** 纹理尺寸（如果是纹理） */
  width?: number;
  height?: number;
  /** GC 候选标记 */
  isGcCandidate: boolean;
}
```
