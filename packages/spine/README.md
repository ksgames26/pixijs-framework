# @ksgames26/spine

Spine 动画模块，集成 `@esotericsoftware/spine-pixi-v8` 到 PixiJS 游戏框架。

## 安装

```bash
npm install @ksgames26/spine
```

依赖要求：
- `pixi.js` >= 8.16.0
- `@ksgames26/core` workspace
- `@ksgames26/assets` workspace

## 快速开始

### 注册模块

```typescript
import { GameApplication } from '@ksgames26/core';
import { SpineModule } from '@ksgames26/spine';

const app = new GameApplication({
  width: 750,
  height: 1334,
});

// 注册 Spine 模块
const spine = new SpineModule();
app.registerModule(spine);

await app.init();
```

### 加载和播放动画

```typescript
// 加载动画
const hero = await spine.load('hero', 'spine/hero.json');

// 播放动画
hero.play('run', true);

// 添加到舞台
app.stage.addChild(hero.container);
```

### 事件监听

```typescript
hero.on('complete', (entry) => {
  console.log('Animation completed:', entry.animation.name);
});

hero.on('event', (entry, event) => {
  console.log('Spine event:', event);
});
```

### 场景集成

在场景中使用 Spine 动画，自动清理资源：

```typescript
import { Scene } from '@ksgames26/scene';
import { SpineSceneHelper } from '@ksgames26/spine';

class GameScene extends Scene {
  private spineHelper = new SpineSceneHelper(this.stage);

  async onEnter(): Promise<void> {
    // 从 SpineModule 加载
    const heroAnim = await spine.load('hero', 'spine/hero.json');
    
    // 添加到场景
    this.spineHelper.add('hero', heroAnim);
    heroAnim.play('idle', true);
  }

  async onExit(): Promise<void> {
    // 自动清理所有动画
    this.spineHelper.destroyAll();
  }
}
```

### 使用 Mixin

```typescript
import { SpineSceneMixin } from '@ksgames26/spine';

class GameScene extends SpineSceneMixin(Scene) {
  async onEnter(): Promise<void> {
    const hero = await this.loadSpine('hero', 'spine/hero.json', spine);
    hero.play('attack', false);
    
    hero.once('complete', () => {
      hero.play('idle', true);
    });
  }
}
```

## API 参考

### SpineModule

| 方法 | 描述 |
|------|------|
| `load(key, url)` | 加载 Spine 动画 |
| `get(key)` | 获取已加载的动画 |
| `has(key)` | 检查动画是否已加载 |
| `unload(key)` | 卸载指定动画 |
| `unloadAll()` | 卸载所有动画 |

### SpineAnimation

| 方法 | 描述 |
|------|------|
| `play(name, loop?, track?)` | 播放动画 |
| `addAnimation(name, loop?, delay?, track?)` | 添加动画到队列 |
| `stop()` | 停止所有动画 |
| `pause()` | 暂停 |
| `resume()` | 恢复 |
| `setSkin(name)` | 设置皮肤 |
| `setMix(from, to, duration)` | 设置动画混合时间 |
| `on(event, callback)` | 监听事件 |
| `once(event, callback)` | 监听一次事件 |
| `off(event, callback)` | 移除监听 |

### 事件类型

- `start` - 动画开始
- `interrupt` - 动画被打断
- `end` - 动画结束
- `complete` - 动画完成（循环动画每次完成都会触发）
- `dispose` - 动画被释放
- `event` - Spine 自定义事件

## 文件格式

支持以下 Spine 导出格式：

- `.json` + `.atlas` + `.png` (JSON 格式)
- `.skel` + `.atlas` + `.png` (二进制格式，推荐)

注意：Spine Editor 版本必须与 runtime 版本匹配（4.2.x）。

## License

MIT
