# Research: PixiJS 游戏框架

**Feature**: 001-pixijs-game-framework
**Date**: 2026-04-11

## 决策记录

### R1: PixiJS v8 核心架构

**Decision**: 采用 PixiJS v8.13+ 作为渲染引擎基础

**Rationale**:
- v8 是当前主推版本，生产就绪
- WebGPU 一等公民支持，面向未来
- 新 Assets 系统、EffectSystem、CullerPlugin 提升框架能力
- 良好的 ESM 和 tree-shaking 支持

**Alternatives considered**:
- PixiJS v7: 维护模式，不建议新项目采用
- Phaser: 不支持 tree-shaking，包体大
- Cocos Creator: 全功能引擎但不可裁剪

**Key API changes (v7 → v8)**:
- `Application` 构造函数 → 异步 `app.init()`
- `app.view` → `app.canvas`
- `DisplayObject` 移除，`Container` 是唯一基类
- 叶子节点（Sprite/Graphics/Text）不能再添加子节点
- `BaseTexture` → `TextureSource` 体系
- Ticker 回调参数改为 Ticker 实例
- `Graphics` 新链式 API: `.rect().fill().stroke()`

**Gotchas**:
- 叶子节点需要 Container 包裹才能有子节点
- v8.12+ 资源解析器配置已重构
- `manageImports: false` 用于精确控制导入实现最小包体

---

### R2: UI 组件库 — @pixi/ui

**Decision**: 采用 `@pixi/ui` v2.x 作为 UI 组件基础

**Rationale**:
- v2.x 对应 PixiJS v8，稳定可用
- 提供 12 个常用组件（Button、CheckBox、Input、List、ScrollBox 等）
- 基于 Signal 的事件系统，与 PixiJS 原生 EventEmitter 分离清晰

**Alternatives considered**:
- 自建 UI 组件库：工作量大，且 @pixi/ui 已足够成熟
- DOM UI overlay：不适合小游戏平台

**Gotchas**:
- Signal API (`onPress.connect()`) vs EventEmitter (`on()`)，不要混淆
- FancyButton 支持多状态视图（默认/悬停/按下/禁用）

---

### R3: 布局系统 — 自建方案

**Decision**: 自建基于 Flexbox 的布局系统，作为 @ksgames26/ui 的一部分

**Rationale**:
- `@pixi/layout` 官方包**不存在**（调研确认）
- `@pixi/ui` 的 List 和 ScrollBox 仅提供简单的线性布局
- 游戏框架需要更灵活的布局能力（弹性布局、锚点、网格）
- 可参考 yoga-layout-prebuilt 或简单自实现

**Alternatives considered**:
- @pixi/ui List/ScrollBox only: 功能不足
- 等待官方 @pixi/layout: 时间线未知
- 纯 CSS DOM overlay: 不适用于小游戏平台

---

### R4: 资源管线 — @pixi/assetpack

**Decision**: 集成 `@pixi/assetpack` 作为资源构建管线

**Rationale**:
- v1.4.0 稳定，框架无关设计
- 插件式架构支持自定义管线
- 支持纹理打包、压缩、精灵图生成
- 与 PixiJS Assets 无缝集成

**Integration pattern**:
1. 定义 `assetpack.config.js` 配置管线
2. 构建输出优化资源
3. 通过 `Assets.load()` 加载

**Gotchas**:
- 框架无关意味着需自行配置 PixiJS 特定步骤
- 与 Vite 搭配时注意构建顺序

---

### R5: Spine 动画 — 延后策略

**Decision**: Spine 模块接口先行定义，实际集成延后至 @pixi/spine-pixi 完成 v8 迁移

**Rationale**:
- `@pixi/spine-pixi` 官方标注为 "Migrating Right Now"
- API 不稳定，无法确认最终形态
- 接口先行可确保架构不被阻塞

**Alternatives considered**:
- 使用旧版 pixi-spine: 与 v8 不兼容
- 预渲染精灵图替代: 功能受限

---

### R6: WebGL 上下文丢失处理

**Decision**: 监听 `contextlost`/`contextrestored` 事件，实现自动恢复 + 事件通知

**Rationale**:
- PixiJS v8 提供了这两个事件
- TextureSource 体系会尝试自动重建
- 自定义 WebGL 资源需手动处理
- WebGPU 后端不存在上下文丢失问题

**Implementation approach**:
1. 在 GameApplication 中注册 `contextlost` 监听
2. 显示"正在恢复"提示
3. 利用 PixiJS 内置的 TextureSource 自动重建
4. 自定义资源通过 AssetManager 重新加载
5. 恢复完成后发出 `contextrestored` 事件通知业务层

---

### R7: 跨平台适配策略

**Decision**: PlatformAdapter 接口 + 三平台实现 + 环境自动检测

**Rationale**: 三平台关键差异已明确，适配层可标准化

**需要抽象的 API**:

| 能力 | Web | 微信 | 抖音 |
|------|-----|------|------|
| Canvas | `document.createElement('canvas')` | `wx.createCanvas()` | `tt.createCanvas()` |
| Image | `new Image()` | `wx.createImage()` | `tt.createImage()` |
| rAF | `requestAnimationFrame` | `canvas.requestAnimationFrame` | 同微信 |
| 存储 | `localStorage` | `wx.setStorageSync` | `tt.setStorageSync` |
| HTTP | `fetch` | `wx.request()` | `tt.request()` |
| 触摸 | pointer events | `wx.onTouchStart/Move/End` | `tt.onTouchStart/Move/End` |
| 文件路径 | URL | `wx.env.USER_DATA_PATH` | `tt.env.USER_DATA_PATH` |
| 音频 | `new Audio()` | `wx.createInnerAudioContext()` | `tt.createInnerAudioContext()` |

**小游戏包体限制**:
- 首包最大 **4MB**（微信和抖音一致）
- 分包总计约 **20MB**
- CDN 远端资源不计入本地包大小
- 支持 `wx.loadSubpackage()` 异步加载分包

**自动检测逻辑**: 检测 `wx` / `tt` 全局对象是否存在，回退到 Web

---

### R8: Monorepo 构建方案

**Decision**: pnpm workspaces + Vite Library Mode + Turborepo

**Rationale**:
- pnpm workspaces 管理 monorepo 依赖
- Vite Library Mode 构建各包，输出 ESM + CJS
- Turborepo 编排并行构建和依赖排序

**Tree-shaking 关键配置**:
- `package.json` 设置 `"sideEffects": false`
- 使用具名导出，避免 `export default`
- `rollupOptions.output.preserveModules: true`
- `vite-plugin-dts` 生成类型声明
- PixiJS 作为 external 依赖，不打包进库

---

### R9: 测试策略

**Decision**: 三层测试金字塔 — 70% 纯逻辑 / 20% 集成 / 10% E2E

**Rationale**:
- 纯逻辑测试不需要 Canvas 模拟，执行快速
- 集成测试使用 node-canvas/webgl-mock
- E2E 测试使用 Playwright 验证真实渲染

**工具链**:
- Vitest (单元/集成)
- jsdom + 自定义 Canvas Mock
- Playwright (端到端)
- @ksgames26/test-utils 提供 Application/Renderer/Factory Mock

---

### R10: 对象池方案 (Constitution I)

**Decision**: 在 `@ksgames26/core` 中提供泛型 `ObjectPool<T>` 实现

**Rationale**:
- 宪章 I 要求「对象池 MUST 用于频繁创建销毁的显示对象」
- PixiJS v8 未提供内置对象池
- 泛型设计可覆盖粒子、子弹、特效等多种场景
- 跨平台兼容：对象池是纯逻辑，不依赖任何平台 API

**Implementation approach**:
1. `ObjectPool<T>` 接受 `factory` 和 `reset` 回调
2. `acquire()` 从池中取出或新建对象
3. `release()` 重置并归还对象
4. `prewarm()` 预热池，避免运行时首次分配开销
5. Scene 基类提供 `createPool<T>()` 便捷方法

**Alternatives considered**:
- 每种对象单独实现池：代码重复，违反 DRY
- 第三方对象池库：增加依赖，违反简洁性原则

---

### R11: 纹理合批默认策略 (Constitution I)

**Decision**: AssetLoader 默认使用 TextureAtlas 优先加载策略，配合 PixiJS 内置 Batcher

**Rationale**:
- 宪章 I 要求「纹理合批和图集 MUST 作为资源加载的默认策略」
- PixiJS v8 内置 Batcher 已自动处理同纹理合批
- 需要在资源加载层面引导使用 TextureAtlas
- @pixi/assetpack 可在构建时生成纹理图集

**Implementation approach**:
1. `BatchingConfig` 作为 AssetManager 初始化配置的一部分
2. `loadBundle()` 时自动将多个纹理资源打包为 TextureAtlas
3. 与 @pixi/assetpack 构建管线集成，构建时预生成图集
4. 跨平台兼容：TextureAtlas 是 PixiJS 内部数据结构，无平台依赖

**Gotchas**:
- 小游戏平台内存有限，图集尺寸不宜过大（默认 maxAtlasSize: 2048）
- 动态添加的资源无法在构建时合批，需运行时处理

---

### R12: Canvas 2D 回退方案 (Constitution IV)

**Decision**: 利用 PixiJS v8 的 `preference` 参数实现自动渲染器回退

**Rationale**:
- 宪章 IV 要求「WebGL 不可用时 MUST 有 Canvas 2D 回退方案」
- PixiJS v8 支持 `preference` 参数，内置 `webgpu` → `webgl` → `canvas` 降级链
- 无需自行实现回退逻辑，由 PixiJS 引擎处理底层适配
- 跨平台兼容：PixiJS 已为小游戏平台适配渲染器

**Implementation approach**:
1. GameApplication.init() 根据 PlatformAdapter 提供的系统信息设置 preference
2. 监听渲染器降级事件，通过 `app:rendererfallback` 通知业务层
3. 在 DebugOverlay 中显示当前使用的渲染器类型

**Gotchas**:
- Canvas 2D 模式下某些高级特性不可用（滤镜、混合模式等）
- 需在文档中说明 Canvas 2D 模式的功能限制

---

### R13: BitmapText 跨平台文本策略 (Constitution IV)

**Decision**: UITier 默认使用 BitmapText，提供 DynamicText 回退选项

**Rationale**:
- 宪章 IV 要求「文字渲染 MUST 使用 BitmapText 或预渲染策略」
- BitmapText 使用预渲染位图字体，跨平台渲染一致
- PixiJS v8 的 Text 对象依赖 Canvas API 渲染，在小游戏平台可能有字体差异
- BitmapText 不依赖运行时字体渲染，性能更优

**Implementation approach**:
1. 提供 `GameTextOptions.mode: 'bitmap' | 'dynamic'` 选项
2. `mode: 'bitmap'` (默认): 使用预加载的 .fnt + .png 字体资源
3. `mode: 'dynamic'`: 使用 PixiJS Text 对象，适用于多语言动态文本
4. 框架初始化时通过 AssetManager 预加载默认英文字体

**Gotchas**:
- BitmapText 需要预生成字体文件（使用工具如 BitmapFont Generator）
- 中文等多字符集语言需要大尺寸字体图集，可能影响包体
- 小游戏平台建议使用动态文本 + 系统字体作为中文方案

---

### R14: 显示对象工厂模式 (Constitution VI)

**Decision**: 在 `@ksgames26/core` 中提供 `DisplayObjectFactory` 接口和默认实现

**Rationale**:
- 宪章 VI 要求「显示对象的创建 MUST 通过工厂函数」
- 工厂模式允许在测试中替换为 Mock 对象
- 集中管理显示对象创建逻辑，便于后续扩展（如对象池集成）

**Implementation approach**:
1. `DisplayObjectFactory` 接口定义所有显示对象的创建方法
2. `DefaultDisplayObjectFactory` 直接调用 PixiJS 构造函数
3. `MockDisplayObjectFactory` 在 test-utils 中提供，返回 Mock 对象
4. GameApplication 持有 factory 实例，通过 `app.factory` 访问
5. 跨平台兼容：工厂本身是纯逻辑，创建的对象由 PixiJS 处理渲染

---

### R15: 可序列化状态接口 (Constitution VI)

**Decision**: 在 `@ksgames26/core` 中定义 `SerializableState` 接口

**Rationale**:
- 宪章 VI 要求「状态管理 MUST 使用可序列化的数据结构」
- 可序列化状态支持快照对比测试
- 支持场景状态保存/恢复（如暂停游戏、切回后台恢复）

**Implementation approach**:
1. `SerializableState` 接口定义 `toJSON()` / `fromJSON()` / `snapshot()` 方法
2. Scene 基类内置 `state: SerializableState` 属性
3. 开发者通过实现此接口为场景添加状态管理
4. 跨平台兼容：纯 JSON 序列化，无平台依赖

---

### R16: E2E 跨平台测试策略 (Constitution VI)

**Decision**: 使用 Playwright 对 Web 平台进行 E2E 测试，小游戏平台通过集成测试 + 构建产物验证覆盖

**Rationale**:
- 宪章 VI 要求「关键交互流程 MUST 有端到端测试」
- Playwright 仅支持浏览器环境，无法直接测试小游戏平台
- 小游戏平台的 E2E 测试需要真机或模拟器，成本过高
- 折中方案：Web E2E 覆盖核心流程 + 小游戏构建产物验证

**Implementation approach**:
1. Web 平台: Playwright 覆盖场景切换、资源加载、UI 交互
2. 微信平台: Vitest 集成测试 + 构建产物目录结构验证
3. 抖音平台: 同微信策略
4. CI 中仅 Web E2E 自动运行，小游戏验证可手动触发

---

### R17: 跨平台 API 禁用规则

**Decision**: 框架内部代码 MUST NOT 直接使用 Web 专属 API，通过 ESLint 规则强制执行

**Rationale**:
- 用户要求框架兼容小游戏平台
- Web 专属 API (`document`, `window`, `localStorage`, `fetch` 等) 在小游戏平台不可用
- 所有平台差异通过 PlatformAdapter 抽象

**Implementation approach**:
1. 配置 ESLint `no-restricted-globals` 规则，禁止框架包中使用 Web 全局对象
2. 例外: `packages/platform-web/` 和 `apps/` 允许使用 Web API
3. 代码审查时强制检查跨平台兼容性
4. PlatformAdapter 接口覆盖所有需要的平台能力

**已覆盖的 API 映射**:
| Web API | PlatformAdapter 方法 | 微信替代 | 抖音替代 |
|---------|---------------------|---------|---------|
| document.createElement('canvas') | createCanvas() | wx.createCanvas() | tt.createCanvas() |
| new Image() | createImage() | wx.createImage() | tt.createImage() |
| window.innerWidth/Height | getSystemInfo() | wx.getSystemInfoSync() | tt.getSystemInfoSync() |
| localStorage | getStorage() | wx.setStorageSync() | tt.setStorageSync() |
| requestAnimationFrame | requestAnimationFrame() | canvas.requestAnimationFrame | 同微信 |
| fetch() | fetch() | wx.request() | tt.request() |
| pointer events | onTouchStart/Move/End() | wx.onTouchStart() | tt.onTouchStart() |

---

### R18: 抖音 WebApp Adapter TypeScript 重构

**Decision**: 将官方 `tt-adapter.js` 重构为 TypeScript 模块化实现，每个类独立文件

**Rationale**:
- 原 `tt-adapter.js` 为单文件 ~2134 行，可维护性差
- TypeScript 提供类型安全，便于 IDE 提示和错误检查
- 模块化结构便于按需导入和 tree-shaking
- PixiJS 项目整体使用 TypeScript，保持一致性

**原 Adapter 组件分析**:

| 组件类型 | 名称 | 代码行数 | 说明 |
|---------|------|---------|------|
| 常量 | style$1 | ~590 行 | CSS 样式属性默认值 |
| 工具函数 | 各种辅助函数 | ~50 行 | DOM 属性设置、计算样式等 |
| 类 | Event | ~15 行 | 基础事件类 |
| 类 | EventTarget | ~40 行 | 事件目标基类 |
| 类 | XMLHttpRequest | ~150 行 | HTTP 请求实现 |
| 类 | WebSocket | ~70 行 | WebSocket 实现 |
| 类 | Worker | ~30 行 | Web Worker 实现 |
| 类 | Node | ~20 行 | DOM 节点基类 |
| 类 | Element | ~20 行 | DOM 元素基类 |
| 类 | HTMLElement | ~30 行 | HTML 元素基类 |
| 类 | Canvas | ~50 行 | 画布包装（包装 tt.createCanvas） |
| 类 | Image | ~20 行 | 图片包装（包装 tt.createImage） |
| 类 | Audio | ~150 行 | 音频播放器 |
| 类 | AudioContext | ~40 行 | 音频上下文 |
| 类 | Blob | ~60 行 | 二进制大对象 |
| 类 | URL | ~40 行 | URL 处理 |
| 全局对象 | document | ~150 行 | 模拟 document |
| 全局对象 | window | ~60 行 | 模拟 window |
| 其他 | navigator, performance, screen, localStorage 等 | ~100 行 | 浏览器全局对象 |

**抖音 tt API 使用清单**:
- `tt.getSystemInfoSync()` - 系统信息
- `tt.getFileSystemManager()` - 文件系统（XMLHttpRequest 本地文件）
- `tt.request()` - 网络请求
- `tt.connectSocket()` - WebSocket
- `tt.createWorker()` - Worker
- `tt.createCanvas()` - 创建画布
- `tt.createImage()` - 创建图片
- `tt.createInnerAudioContext()` - 音频
- `tt.getAudioContext()` - 音频上下文
- `tt.getPerformance()` - 性能计时
- `tt.onNetworkStatusChange()` - 网络状态变化
- `tt.onHide/onShow` - 生命周期
- `tt.onTouchStart/Move/End/Cancel` - 触摸事件
- `tt.onWindowResize` - 窗口大小变化
- `tt.getStorageInfoSync/getStorageSync/setStorageSync/removeStorageSync/clearStorageSync` - 存储

**重构策略**:
1. 按功能分组到子目录（util/, event/, dom/, network/, media/, storage/, worker/, navigator/, performance/, screen/, window/）
2. 每个类独立文件，保持与原 API 完全兼容
3. 工具函数提取到 util/ 目录便于复用
4. 添加 `types/tt.d.ts` 声明抖音 API 类型
5. `index.ts` 统一导出所有类和对象
6. `inject.ts` 处理全局注入逻辑

**API 兼容性保证**:
- 所有公开类名、方法名、属性名保持不变
- 事件触发时机保持一致
- 通过 `GameGlobal.__isAdapterInjected` 防止重复注入

---

### R19: 画布屏幕自适应修复

**Date**: 2026-04-12

**Decision**: 修改 `WebAdapter.getSystemInfo()` 使用 `window.innerWidth/innerHeight`，并将 resize 检测从 ticker 轮询改为 `PlatformAdapter.onResize()` 原生事件回调

**Rationale**:

根因分析发现两层缺陷：

1. **`WebAdapter.getSystemInfo()` 返回物理屏幕尺寸而非视口尺寸**
   - `window.screen.width/height` 是显示器分辨率（如 1920x1080），不随浏览器窗口变化
   - `window.innerWidth/innerHeight` 是浏览器视口尺寸，resize 时实时变化
   - 画布被初始化为 1920x1080 而非浏览器窗口实际大小（如 800x600）

2. **`ScreenAdapter` 的 ticker 每帧轮询检测 resize 不够优雅**
   - `tickResizeCheck()` 每帧（60 FPS）轮询 `getSystemInfo()`，每次 2 次属性读取 + 2 次数字比较
   - 虽然单次开销极小（~0.001ms），但 60 次/秒完全是无效操作——窗口 resize 是低频事件
   - 更好的方案：各平台都有原生 resize 事件回调，应利用平台能力而非轮询

**resize 检测策略优化**:

| 方案 | 响应延迟 | 帧开销 | 跨平台 |
|------|----------|--------|--------|
| ticker 每帧轮询（当前） | ~16ms | 60 次/秒 | 需 getSystemInfo() 返回动态值 |
| setInterval 1 秒轮询 | 0-1000ms | 1 次/秒 | 同上 |
| **PlatformAdapter.onResize() 事件** | **即时** | **零** | **各平台原生事件** |

选择 `PlatformAdapter.onResize()` 事件回调，各平台实现：

| 平台 | 原生 API | 说明 |
|------|----------|------|
| Web | `window.addEventListener('resize', cb)` | 标准浏览器 API |
| 微信 | `wx.onWindowResize(cb)` | 微信小游戏 API |
| 抖音 | `tt.onWindowResize(cb)` | 抖音小游戏 API |

**修改范围**:

| 文件 | 修改内容 |
|------|----------|
| `packages/core/src/platform.ts` | `PlatformAdapter` 接口增加 `onResize(callback)` 方法 |
| `packages/core/src/platform-web-adapter.ts` | 修正 getSystemInfo + 实现 onResize |
| `packages/platform-web/src/web-adapter.ts` | 同步修改 |
| `packages/core/src/screen.ts` | 改用 `PlatformAdapter.onResize()` 替代 ticker 轮询 |
| `packages/core/src/events.ts` | 增加 `SCREEN_RESIZE` 事件常量 |
| `packages/core/src/application.ts` | 连接 ScreenAdapter resize 到 EventBus |
| `packages/scene/src/scene-manager.ts` | 监听 resize 事件，分发到当前 Scene |

**Alternatives considered**:
1. ~~Ticker 每帧轮询~~ — 无效帧开销，且依赖 getSystemInfo() 返回动态值
2. ~~setInterval 1 秒轮询~~ — 0-1 秒延迟，用户拖拽窗口时会有明显卡顿感
3. ~~使用 `ResizeObserver` 监听 canvas 父容器~~ — 仅 Web 可用，增加复杂度
4. ~~保持 `window.screen` 但额外监听 resize 事件~~ — 初始尺寸仍错误
5. ~~ScreenAdapter 直接监听 `window.resize`~~ — 小游戏平台无 `window` 对象，必须走 PlatformAdapter 抽象

---

### R20: 微信小游戏 Adapter TypeScript 重构

**Date**: 2026-04-12

**Decision**: 将微信小游戏官方 weapp-adapter.js 转为 TypeScript 模块化实现，参照抖音 adapter TS 版本的目录结构和模式

**Rationale**:

微信官方 adapter 是 Webpack 1.x 打包产物（1593 行），源码约 450 行分布在 26 个文件中。需要转为 TypeScript 以获得类型安全、IDE 提示和 tree-shaking 支持。

**源码分析**:

| 组件类型 | 名称 | 源码行数 | 说明 |
|---------|------|---------|------|
| 类 | EventTarget | ~55 行 | WeakMap 事件存储 |
| 类 | Node | ~33 行 | childNodes, appendChild |
| 类 | Element | ~10 行 | className, children（原版有 ELement 拼写错误） |
| 类 | HTMLElement | ~54 行 | setAttribute, clientWidth/Height, style |
| 类 | HTMLCanvasElement | ~13 行 | Canvas 元素（在 constructor.js 中） |
| 类 | HTMLImageElement | ~13 行 | Image 元素（在 constructor.js 中） |
| 类 | HTMLMediaElement | ~25 行 | 桩方法 |
| 类 | HTMLAudioElement | ~7 行 | 标签构造器 |
| 类 | Audio | ~124 行 | 最复杂，WeakMap 私有字段，包装 wx.createInnerAudioContext |
| 类 | XMLHttpRequest | ~145 行 | WeakMap 私有字段，包装 wx.request |
| 类 | WebSocket | ~88 行 | 包装 wx.connectSocket |
| 类 | Event | ~14 行 | 基础事件 |
| 类 | TouchEvent | ~33 行 | 触摸事件 + touchEventHandlerFactory |
| 工厂函数 | Canvas | ~29 行 | 包装 wx.createCanvas，原型链注入 |
| 工厂函数 | Image | ~5 行 | 包装 wx.createImage |
| 桩 | FileReader | ~7 行 | 空壳 |
| 对象 | document | ~120 行 | createElement, querySelector 等 |
| 对象 | localStorage | ~31 行 | 包装 wx.*StorageSync |
| 对象 | location | ~7 行 | 最小化桩 |
| 对象 | navigator | ~20 行 | 硬编码 UA |
| 对象 | performance | ~17 行 | 包装 wx.getPerformance |
| 对象 | window | ~25 行 | 模块命名空间再导出 |
| 常量 | WindowProperties | ~14 行 | innerWidth/Height, devicePixelRatio |
| 函数 | inject | ~45 行 | 全局注入（devtools + 真机双路径） |
| 工具 | noop | 1 行 | 空函数 |

**原版已修正的 Bug**:
- `ELement` → `Element` 拼写错误
- `timestampe` → `timestamp` 拼写错误
- `UNSEND` → `UNSENT` 常量名
- `for (i=length; i--; i>0)` → `for (i=length-1; i>=0; i--)` 循环错误
- `construct()` → `constructor()` FileReader 构造器名
- `childern` → `children` 属性名

**wx.* API 使用清单** (16 个):

| wx API | 用途 |
|--------|------|
| `wx.getSystemInfoSync()` | 获取 screenWidth/Height, pixelRatio, platform |
| `wx.getPerformance()` | 获取 performance.now() |
| `wx.createCanvas()` | 创建原生画布 |
| `wx.createImage()` | 创建原生图片 |
| `wx.createInnerAudioContext()` | 创建音频上下文 |
| `wx.onTouchStart/Move/End/Cancel()` | 触摸事件注册 |
| `wx.request()` | HTTP 请求 |
| `wx.connectSocket()` | WebSocket 连接 |
| `wx.getStorageInfoSync()` | 获取存储信息 |
| `wx.getStorageSync/setStorageSync/removeStorageSync/clearStorageSync` | 本地存储 |
| `wx.onWindowResize()` | 窗口 resize 事件 |
| `wx.offWindowResize()` | 移除 resize 监听 |

**微信 vs 抖音 adapter 差异**:

| 特性 | 微信 adapter | 抖音 adapter |
|------|-------------|-------------|
| 代码量 | ~450 行 | ~2134 行（原始 JS） |
| CSS 样式默认值 | 无 | 590 行常量表 |
| getBoundingClientRect | 简单实现 | 完整 clientRegion 工具 |
| 注入策略 | devtools + 真机双路径 | devtools + 生产环境 |
| 全局对象 | `GameGlobal` | `GameGlobal` |
| Canvas 工厂 | 原型链注入 | 类继承 |

**Alternatives considered**:
1. ~~保持 JS 版本不转换~~ — 无类型安全，无法 tree-shake，不符合项目 TypeScript 标准
2. ~~合并到抖音 adapter 共享代码~~ — wx 和 tt API 差异大，合并增加复杂度
3. ~~使用单一文件~~ — 不符合"一个类一个文件"的需求
