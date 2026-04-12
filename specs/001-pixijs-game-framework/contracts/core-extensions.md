# Core Extensions Contract: @ksgames26/core (补充)

Package: `@ksgames26/core`
此文件补充 `public-api.md` 中未涵盖的宪章对齐 API。

## ObjectPool\<T\>

泛型对象池，满足宪章 I「对象池 MUST 用于频繁创建销毁的显示对象」。

```typescript
class ObjectPool<T> {
  /**
   * 创建对象池
   * @param factory 对象工厂函数
   * @param reset 对象重置函数（归还时调用）
   * @param initialSize 预热数量（默认 0）
   */
  constructor(
    factory: () => T,
    reset: (obj: T) => void,
    initialSize?: number
  );

  /** 池中可用对象数量 */
  readonly size: number;

  /** 当前借出的活跃对象数量 */
  readonly activeCount: number;

  /**
   * 从池中取出对象
   * 池空时调用 factory 新建
   */
  acquire(): T;

  /**
   * 归还对象到池中
   * 调用 reset 后放回池中
   */
  release(obj: T): void;

  /**
   * 预热池，预先创建指定数量的对象
   * @param count 预创建数量
   */
  prewarm(count: number): void;

  /** 清空池中所有可用对象 */
  drain(): void;
}
```

**使用示例**:
```typescript
const bulletPool = new ObjectPool(
  () => new Sprite(texture),
  (sprite) => { sprite.visible = false; sprite.x = 0; sprite.y = 0; },
  50 // 预热 50 个子弹
);

const bullet = bulletPool.acquire();
bullet.visible = true;
// ... 使用子弹
bulletPool.release(bullet);
```

---

## DisplayObjectFactory

显示对象工厂接口，满足宪章 VI「显示对象的创建 MUST 通过工厂函数」。

```typescript
interface DisplayObjectFactory {
  /** 创建精灵 */
  createSprite(texture?: Texture): Sprite;

  /** 创建容器 */
  createContainer(): Container;

  /** 创建图形 */
  createGraphics(): Graphics;

  /**
   * 创建位图文本（默认文本方案）
   * 满足宪章 IV「文字渲染 MUST 使用 BitmapText 或预渲染策略」
   */
  createBitmapText(fontName: string, text: string): BitmapText;

  /**
   * 创建动态文本（适用于多语言等需要运行时字体渲染的场景）
   * 仅在明确需要动态文本时使用
   */
  createText(options: TextOptions): Text;
}
```

### DefaultDisplayObjectFactory

生产环境的默认实现，直接调用 PixiJS 构造函数。

```typescript
class DefaultDisplayObjectFactory implements DisplayObjectFactory {
  createSprite(texture?: Texture): Sprite {
    return new Sprite(texture);
  }
  createContainer(): Container {
    return new Container();
  }
  createGraphics(): Graphics {
    return new Graphics();
  }
  createBitmapText(fontName: string, text: string): BitmapText {
    return new BitmapText({ text, style: { fontFamily: fontName } });
  }
  createText(options: TextOptions): Text {
    return new Text(options);
  }
}
```

---

## SerializableState

可序列化状态接口，满足宪章 VI「状态管理 MUST 使用可序列化的数据结构」。

```typescript
interface SerializableState {
  /**
   * 序列化为纯 JSON 对象
   * 返回值 MUST 仅包含 JSON 兼容类型（string, number, boolean, null, array, plain object）
   */
  toJSON(): Record<string, unknown>;

  /**
   * 从纯 JSON 对象恢复状态
   * @param data 通过 toJSON() 产出的数据
   */
  fromJSON(data: Record<string, unknown>): void;

  /**
   * 创建当前状态的只读快照
   * 用于状态对比测试和调试
   */
  snapshot(): Readonly<Record<string, unknown>>;
}
```

**使用示例**:
```typescript
class GameState implements SerializableState {
  private score = 0;
  private level = 1;

  toJSON() {
    return { score: this.score, level: this.level };
  }

  fromJSON(data: Record<string, unknown>) {
    this.score = data.score as number;
    this.level = data.level as number;
  }

  snapshot() {
    return Object.freeze(this.toJSON());
  }
}
```

---

## BatchingConfig

纹理合批配置，满足宪章 I「纹理合批和图集 MUST 作为资源加载的默认策略」。

定义于 `@ksgames26/assets` 包。

```typescript
interface BatchingConfig {
  /** 默认使用纹理图集，true 时优先打包为 atlas */
  preferAtlas: boolean;        // default: true
  /** 自动合批阈值，相同类型的资源超过此数量时自动打包 */
  autoBatchThreshold: number;  // default: 5
  /** 最大图集尺寸（像素） */
  maxAtlasSize: number;        // default: 2048
}

const DEFAULT_BATCHING_CONFIG: BatchingConfig = {
  preferAtlas: true,
  autoBatchThreshold: 5,
  maxAtlasSize: 2048,
};
```

---

## GameTextOptions

游戏文本选项，控制 BitmapText vs DynamicText。满足宪章 IV。

定义于 `@ksgames26/ui` 包。

```typescript
interface GameTextOptions {
  /** 文本渲染模式，默认 'bitmap' */
  mode?: 'bitmap' | 'dynamic';
  /** BitmapText 字体名（需预加载 .fnt 文件），mode='bitmap' 时必填 */
  fontName?: string;
  /** 显示文本内容 */
  text?: string;
  /** DynamicText 样式（仅 mode='dynamic' 时使用） */
  textStyle?: TextStyleOptions;
}
```

---

## MockDisplayObjectFactory

测试用 Mock 工厂，定义于 `@ksgames26/test-utils` 包。

```typescript
import { DisplayObjectFactory } from '@ksgames26/core';

class MockDisplayObjectFactory implements DisplayObjectFactory {
  readonly createdSprites: MockSprite[] = [];
  readonly createdContainers: MockContainer[] = [];

  createSprite(texture?: Texture): Sprite {
    const mock = new MockSprite(texture);
    this.createdSprites.push(mock);
    return mock as unknown as Sprite;
  }

  createContainer(): Container {
    const mock = new MockContainer();
    this.createdContainers.push(mock);
    return mock as unknown as Container;
  }

  createGraphics(): Graphics {
    return new MockGraphics() as unknown as Graphics;
  }

  createBitmapText(fontName: string, text: string): BitmapText {
    return new MockBitmapText(fontName, text) as unknown as BitmapText;
  }

  createText(options: TextOptions): Text {
    return new MockText(options) as unknown as Text;
  }
}
```

**注意**: Mock 类的具体实现（MockSprite, MockContainer 等）不需要真正渲染，只需实现足够的接口以满足逻辑测试。
