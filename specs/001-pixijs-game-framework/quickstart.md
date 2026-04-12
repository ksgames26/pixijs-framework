# Quickstart: PixiJS 游戏框架

5 分钟从零到运行一个可交互的示例项目。

## 1. 创建项目

```bash
mkdir my-game && cd my-game
npm init -y
```

## 2. 安装依赖

仅安装核心包（最小体积）：

```bash
npm install @ksgames26/core pixi.js
```

可选模块按需安装：

```bash
# 资源管理
npm install @ksgames26/assets
# 场景管理
npm install @ksgames26/scene
# UI 系统
npm install @ksgames26/ui
# 调试工具（仅开发）
npm install -D @ksgames26/debug
```

## 3. 创建入口文件

```typescript
// src/main.ts
import { GameApplication } from '@ksgames26/core';
import { AssetManager } from '@ksgames26/assets';
import { SceneManager, Scene } from '@ksgames26/scene';

// 定义主菜单场景
class MenuScene extends Scene {
  readonly name = 'menu';
  readonly assets = [
    { key: 'bg', url: '/assets/bg.png' },
  ];

  async onEnter() {
    const bg = this.app.assets.get('bg')!.data;
    const sprite = this.app.factory.createSprite(bg);
    this.stage.addChild(sprite);
  }

  onUpdate() { /* 每帧更新逻辑 */ }

  // 画布尺寸变化时自动调用（由 SceneManager 分发）
  onResize(width: number, height: number) {
    // 重新布局场景元素
  }
}

// 初始化框架
const game = new GameApplication();
await game
  .registerModule(new AssetManager())
  .registerModule(new SceneManager())
  .init({ debug: true });

// 注册并切换到主菜单
game.scenes.register(new MenuScene());
await game.scenes.switchTo('menu');
```

## 4. 添加 UI

```typescript
import { UITier } from '@ksgames26/ui';

game.registerModule(new UITier());

// 在场景中使用
const ui = game.getModule<UITier>('ui')!;
ui.addLayer('hud', 10);

const hudLayer = ui.getLayer('hud')!;
const text = game.factory.createText({ text: 'Score: 0', style: { fill: 'white' } });
hudLayer.addChild(text);
```

## 5. 跨平台构建

### Web (默认)

```bash
npx vite build
```

### 微信小游戏

```bash
# 安装微信平台适配器
npm install @ksgames26/platform-wechat
# 构建
npx vite build --mode wechat
```

### 抖音小游戏

```bash
npm install @ksgames26/platform-douyin
npx vite build --mode douyin
```

## 6. 模块裁剪验证

未安装的模块不会出现在构建产物中：

```bash
# 仅核心 — 最小包体
npm install @ksgames26/core pixi.js
npx vite build
# 检查 gzip 体积
```

## 项目结构参考

```
my-game/
├── src/
│   ├── main.ts          # 入口
│   ├── scenes/          # 场景定义
│   │   ├── menu.ts
│   │   └── battle.ts
│   └── config.ts        # 游戏配置
├── assets/              # 游戏资源
│   ├── textures/
│   └── spritesheets/
├── public/
└── package.json
```

---

## 抖音 Adapter TypeScript 使用指南

### 目录结构

```
packages/platform-douyin/src/
├── index.ts                    # 统一导出
├── inject.ts                   # 注入逻辑
├── types/
│   └── tt.d.ts                # 抖音 API 类型声明
├── util/                       # 工具函数
├── event/                      # 事件系统
├── dom/                        # DOM API
├── network/                    # 网络
├── media/                      # 媒体
├── storage/                    # 存储
├── worker/                     # Worker
├── navigator/                  # 导航器
├── performance/                # 性能
├── screen/                     # 屏幕
└── window/                     # Window
```

### 使用方式

Adapter 会自动检测 `GameGlobal` 并注入全局对象：

```typescript
// 在抖音小游戏入口文件引入
import '@ksgames26/platform-douyin';

// 现在可以像浏览器环境一样使用标准 API
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

const img = new Image();
img.src = 'https://example.com/image.png';

const xhr = new XMLHttpRequest();
xhr.open('GET', 'https://api.example.com/data');
xhr.send();
```

### 按需导入

如果只需要部分功能，可以按需导入：

```typescript
import { Canvas, Image, XMLHttpRequest } from '@ksgames26/platform-douyin';

// 手动创建实例
const canvas = new Canvas();
const img = new Image();
```

### 构建配置

在 `vite.config.ts` 中：

```typescript
export default defineConfig({
  build: {
    target: 'es2015',
    rollupOptions: {
      external: ['pixi.js'],
    },
  },
});
```

### 与原 JS 版本的差异

TypeScript 版本与原 `tt-adapter.js` 完全 API 兼容：

| 特性 | 原 JS | TypeScript |
|------|-------|------------|
| 全局注入 | ✅ 自动 | ✅ 自动 |
| 类型安全 | ❌ 无 | ✅ 完整类型 |
| 模块化 | ❌ 单文件 | ✅ 按需导入 |
| Tree-shaking | ❌ 不支持 | ✅ 支持 |
| 运行时行为 | 基准 | 完全一致 |
