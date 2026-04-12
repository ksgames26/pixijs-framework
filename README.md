# PixiJS Game Framework

基于 PixiJS v8 的模块化游戏开发框架，采用 monorepo 架构，支持一套代码同时发布到 Web、微信小游戏和抖音小游戏三端。

[![PixiJS](https://img.shields.io/badge/PixiJS-v8-ff69b4)](https://pixijs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

## 特性

- **模块化架构** - 各功能模块独立 npm 包，按需引入，tree-shaking 友好
- **包体控制** - 核心模块 gzip 后 < 50KB，全功能裁剪可减少 60%+ 体积
- **多平台支持** - Web / 微信小游戏 / 抖音小游戏，平台差异通过适配器抽象
- **资源管理** - 基于 PixiJS Assets 封装，支持引用计数、自动卸载、AssetPack 分块加载
- **场景管理** - 完整生命周期（enter/exit/suspend/resume）、过渡动画、资源自动管理
- **UI 系统** - 独立 UI 层，布局为可选模块
- **Flexbox 布局** - 基于 @pixi/layout 的弹性布局（可选包）
- **调试工具** - FPS 监控、资源占用、场景树查看器（开发模式自动注入）
- **TypeScript** - 完整类型定义，严格模式

## 快速开始

### 环境要求

- Node.js >= 18.0.0
- pnpm >= 9.15.0

### 创建新项目

```bash
# 安装框架核心包
npm install @ksgames26/core @ksgames26/assets @ksgames26/scene

# 安装平台适配器（根据目标平台选择）
npm install @ksgames26/platform-web      # Web 平台
npm install @ksgames26/platform-wechat   # 微信小游戏
npm install @ksgames26/platform-douyin   # 抖音小游戏

# 安装可选包（按需）
npm install @ksgames26/layout @pixi/layout   # Flexbox 布局
npm install @ksgames26/spine                  # Spine 动画
```

### 最小示例

```typescript
import { GameApplication } from '@ksgames26/core';
import { SceneManager } from '@ksgames26/scene';
import { WebAdapter } from '@ksgames26/platform-web';

// 创建应用
const app = new GameApplication({
  width: 750,
  height: 1334,
  backgroundColor: 0x1099bb,
  platform: new WebAdapter(),
});

// 初始化
await app.init();

// 添加画布到页面
document.body.appendChild(app.canvas);

// 创建场景管理器
const scenes = new SceneManager(app);
scenes.register(new LoadingScene());
scenes.register(new GameScene());

// 切换到加载场景
await scenes.switchTo('loading');
```

### 定义场景

```typescript
import { Scene } from '@ksgames26/scene';
import { AssetManager } from '@ksgames26/assets';

class GameScene extends Scene {
  name = 'game';
  
  // 场景依赖的资源
  assets = ['images/bg.png', 'images/player.png'];
  
  constructor(private assets: AssetManager) {
    super();
  }
  
  async onEnter(): Promise<void> {
    // 资源已自动加载，创建游戏对象
    const bg = new Sprite(await this.assets.get('images/bg.png'));
    this.stage.addChild(bg);
  }
  
  onUpdate(ticker: Ticker): void {
    // 每帧更新逻辑
  }
  
  async onExit(): Promise<void> {
    // 清理工作，资源自动释放
  }
}
```

### 资源加载

```typescript
import { AssetManager } from '@ksgames26/assets';

const assets = new AssetManager();

// 加载单个资源
const texture = await assets.load('player', 'images/player.png');

// 批量加载（带进度回调）
await assets.loadBundle(
  ['bg', 'enemy', 'bullet'],
  (progress) => console.log(`${progress * 100}%`)
);

// 获取已缓存资源
const playerTex = assets.get<Texture>('player');

// 手动管理引用计数
assets.retain('player');   // 引用 +1
assets.release('player');  // 引用 -1，归零时自动卸载
```

### Flexbox 布局（可选）

```typescript
import { Layout, initLayout } from '@ksgames26/layout';
import { Layout as PixiLayout } from '@pixi/layout';

// 初始化布局系统
initLayout(PixiLayout);

// 创建垂直布局
const layout = new Layout({
  direction: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 10,
  padding: 20,
});

// 必须先初始化
layout.init(PixiLayout);

// 添加带布局选项的子元素
layout.addChildWithLayout(button1, { flexGrow: 1 });
layout.addChildWithLayout(button2, { flexGrow: 2 });

// 或使用便捷函数
import { createRowLayout, createColumnLayout, createCenteredLayout } from '@ksgames26/layout';

const row = createRowLayout({ gap: 10 });
row.init(PixiLayout);

const centered = createCenteredLayout();
centered.init(PixiLayout);
```

## 项目结构

```
.
├── apps/                      # 示例应用
│   ├── demo/                 # 完整演示项目
│   ├── my-game/              # 最小示例游戏
│   └── playground/           # 测试场
│
├── packages/                  # 核心功能包（monorepo）
│   ├── core/                 # 框架核心
│   │   ├── GameApplication   # 应用入口
│   │   ├── PlatformAdapter   # 平台抽象接口
│   │   ├── ScreenAdapter     # 屏幕自适应
│   │   ├── ObjectPool        # 对象池
│   │   ├── DisplayObjectFactory  # 显示对象工厂
│   │   └── EventBus          # 事件总线
│   │
│   ├── assets/               # 资源管理
│   │   ├── AssetManager      # 资源管理器
│   │   ├── AssetRef          # 引用句柄
│   │   └── AssetLoader       # 加载策略
│   │
│   ├── scene/                # 场景管理
│   │   ├── Scene             # 场景基类
│   │   ├── SceneManager      # 场景管理器
│   │   └── SceneTransition   # 过渡动画
│   │
│   ├── ui/                   # UI 系统
│   │   ├── UITier            # UI 分层容器
│   │   └── components/       # UI 组件
│   │
│   ├── layout/               # Flexbox 布局（可选）
│   │   └── Layout            # 基于 @pixi/layout 的弹性布局
│   │   └── components/       # UI 组件
│   │
│   ├── platform-web/         # Web 平台适配
│   ├── platform-wechat/      # 微信小游戏适配
│   ├── platform-douyin/      # 抖音小游戏适配
│   │
│   ├── debug/                # 调试工具（开发模式）
│   ├── spine/                # Spine 动画支持（可选）
│   └── test-utils/           # 测试工具
│
├── scripts/                   # 构建和发布脚本
├── docs/                      # 文档
└── specs/                     # 设计规范和规划
```

## 核心包说明

| 包名 | 体积(gzip) | 描述 |
|------|------------|------|
| `@ksgames26/core` | ~20KB | 应用基类、平台适配、屏幕适配、对象池、工厂模式 |
| `@ksgames26/assets` | ~15KB | 资源加载、缓存、引用计数、AssetPack 集成 |
| `@ksgames26/scene` | ~10KB | 场景生命周期、切换管理、过渡动画 |
| `@ksgames26/ui` | ~8KB | UI 层、组件（布局功能移至独立包） |
| `@ksgames26/layout` | ~15KB | 基于 @pixi/layout 的 Flexbox 布局（可选） |
| `@ksgames26/platform-web` | ~5KB | Web 平台适配 |
| `@ksgames26/platform-wechat` | ~8KB | 微信小游戏适配 |
| `@ksgames26/platform-douyin` | ~8KB | 抖音小游戏适配 |
| `@ksgames26/debug` | ~8KB | 调试面板（仅开发模式） |
| `@ksgames26/spine` | ~30KB | Spine 动画支持（可选） |

**核心总计**: ~50KB gzip | **全功能总计**: ~110KB gzip

## 平台适配

框架通过 `PlatformAdapter` 接口抽象平台差异：

```typescript
interface PlatformAdapter {
  createCanvas(): HTMLCanvasElement;
  createImage(): HTMLImageElement;
  getStorage(): Storage;
  requestAnimationFrame(cb: FrameRequestCallback): number;
  fetch(url: string, options?: RequestInit): Promise<Response>;
  resolvePath(path: string): string;
  getSystemInfo(): SystemInfo;
  onResize(cb: (w: number, h: number) => void): () => void;
  // ... 触摸事件、网络请求等
}
```

| 平台 | 构建命令 | 说明 |
|------|----------|------|
| Web | `pnpm build` | 标准 HTML + JS |
| 微信小游戏 | `pnpm build:wechat` | 符合微信小游戏规范 |
| 抖音小游戏 | `pnpm build:douyin` | 符合抖音小游戏规范 |

### 小游戏限制

| 平台 | 首包限制 | 分包总计 | CDN 资源 |
|------|----------|----------|----------|
| 微信 | 4MB | ~20MB | 不计入包体 |
| 抖音 | 4MB | ~20MB | 不计入包体 |

## 脚本命令

```bash
# 开发
pnpm dev                    # 启动所有包开发模式
pnpm dev --filter @ksgames26/core   # 仅开发指定包

# 构建
pnpm build                  # 构建所有包
pnpm build:wechat           # 构建微信小游戏
pnpm build:douyin           # 构建抖音小游戏

# 代码质量
pnpm lint                   # ESLint 检查
pnpm format                 # Prettier 格式化
pnpm format:check           # 检查格式
pnpm typecheck              # TypeScript 类型检查

# 测试
pnpm test                   # 运行所有测试
pnpm test --filter @ksgames26/core  # 仅测试指定包

# 发布
pnpm release:wechat         # 发布微信小游戏
pnpm release:douyin         # 发布抖音小游戏
pnpm release:all            # 发布所有平台
pnpm release:npm            # 发布 npm 包

# 分析
pnpm analyze:wechat         # 分析微信包体
pnpm analyze:douyin         # 分析抖音包体
```

## 开发规范

- **TypeScript**: 严格模式，禁止 `any`（需附说明）
- **模块化**: 各包独立，禁止循环依赖
- **工厂模式**: 显示对象创建必须通过工厂，便于测试 Mock
- **对象池**: 频繁创建销毁的对象（粒子、子弹）必须使用对象池
- **资源管理**: 纹理合批为默认策略，使用 AssetPack 分块加载
- **平台兼容**: 禁止直接使用 Web API，通过 PlatformAdapter 抽象

## 架构决策

### 为何选择 PixiJS v8？

- ESM 原生支持，tree-shaking 效果优秀
- 全新 Assets 系统，更好的资源管理
- TypeScript 重写，完整类型定义
- WebGPU 一等公民支持，面向未来

### 布局系统

框架提供独立的 `@ksgames26/layout` 包作为可选布局方案，基于官方 `@pixi/layout` 提供 Flexbox 弹性布局能力。UI 包 (`@ksgames26/ui`) 不再内置布局引擎，开发者可按需安装布局包，保持核心 UI 功能轻量。

### 平台适配器模式

运行时检测平台不可靠，小游戏环境特殊。构建时注入正确的适配器实现，实现零开销抽象。各平台 API 差异（Canvas、存储、请求等）统一通过适配器接口。

## 调试工具

开发模式下按 `~` 键打开调试面板：

- **FPS 监控**: 实时帧率、帧时间、波动
- **资源列表**: 内存占用、引用计数、加载状态
- **场景树**: 层级结构、节点数量
- **性能分析**: DrawCalls、纹理数量

```typescript
// 开发模式自动注入
import { initDebugOverlay } from '@ksgames26/debug';

await initDebugOverlay(app);
```

生产构建时调试代码自动剔除，零体积开销。

## 设计文档

- [功能规范](./specs/001-pixijs-game-framework/spec.md) - 详细需求定义
- [实现计划](./specs/001-pixijs-game-framework/plan.md) - 技术方案和规划
- [数据模型](./specs/001-pixijs-game-framework/data-model.md) - 实体和关系定义
- [快速开始](./specs/001-pixijs-game-framework/quickstart.md) - 新手指南
- [小游戏构建指南](./docs/MINIGAME_BUILD.md)
- [小游戏发布指南](./docs/MINIGAME_RELEASE.md)

## 浏览器兼容

- Chrome / Edge 88+
- Firefox 78+
- Safari 14+
- 微信内置浏览器（iOS/Android）
- 抖音内置浏览器（iOS/Android）

降级策略: WebGL 2 → WebGL 1 → Canvas 2D

## License

MIT

---

**Made with ❤️ using PixiJS v8**
