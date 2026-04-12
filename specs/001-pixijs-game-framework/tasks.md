# Tasks: PixiJS 游戏框架

**Input**: Design documents from `/specs/001-pixijs-game-framework/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Monorepo 初始化和基础构建配置

- [x] T001 Initialize pnpm monorepo with workspace config at pnpm-workspace.yaml
- [x] T002 [P] Configure root package.json with scripts and devDependencies (TypeScript 5.x, Vitest, ESLint, Prettier)
- [x] T003 [P] Create root tsconfig.json with strict:true and project references for monorepo
- [x] T004 [P] Create root .eslintrc.cjs and .prettierrc compatible with TypeScript strict mode
- [x] T005 [P] Configure Turborepo for parallel build orchestration at turbo.json
- [x] T006 Create packages/core/package.json with name @ksgames26/core, sideEffects:false, ESM exports
- [x] T007 [P] Create packages/assets/package.json with name @ksgames26/assets, sideEffects:false
- [x] T008 [P] Create packages/scene/package.json with name @ksgames26/scene, sideEffects:false
- [x] T009 [P] Create packages/ui/package.json with name @ksgames26/ui, sideEffects:false
- [x] T010 [P] Create packages/spine/package.json with name @ksgames26/spine, sideEffects:false
- [x] T011 [P] Create packages/debug/package.json with name @ksgames26/debug, sideEffects:false
- [x] T012 [P] Create packages/platform-web/package.json with name @ksgames26/platform-web, sideEffects:false
- [x] T013 [P] Create packages/platform-wechat/package.json with name @ksgames26/platform-wechat, sideEffects:false
- [x] T014 [P] Create packages/platform-douyin/package.json with name @ksgames26/platform-douyin, sideEffects:false
- [x] T015 [P] Create packages/test-utils/package.json with name @ksgames26/test-utils, sideEffects:false
- [x] T016 Configure Vite library mode for each package with preserveModules:true and pixi.js as external

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: 核心接口和基类，所有 User Story 的前提

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T017 Create Module abstract base class in packages/core/src/module.ts per contracts/public-api.md
- [x] T018 Create PlatformAdapter interface in packages/core/src/platform.ts per contracts/platform-api.md
- [x] T019 Create event bus system with typed events in packages/core/src/events.ts per GameEvents contract
- [x] T020 Create GameConfig interface in packages/core/src/config.ts per contracts/public-api.md
- [x] T021 Create responsive screen adapter (resolution, autoDensity, DPR handling) in packages/core/src/screen.ts
- [x] T022 Create AssetRef<T> class with state machine in packages/assets/src/asset-ref.ts per contracts/asset-api.md
- [x] T023 Create AssetState and AssetType enums in packages/assets/src/types.ts
- [x] T024 Create Scene abstract base class with lifecycle methods in packages/scene/src/scene.ts per contracts/scene-api.md
- [x] T025 Create SceneState enum in packages/scene/src/types.ts
- [x] T026 Create test-utils MockApplication in packages/test-utils/src/mock-application.ts
- [x] T027 [P] Create test-utils MockRenderer in packages/test-utils/src/mock-renderer.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - 搭建最小可运行项目 (Priority: P1) 🎯 MVP

**Goal**: 开发者安装核心包后，10 行代码内启动全屏画布并响应窗口缩放

**Independent Test**: 安装 @ksgames26/core + pixi.js，调用 init() 后看到全屏画布，调整窗口尺寸后画布自动适配

### Implementation for User Story 1

- [x] T028 [US1] Implement GameApplication.init() with async PixiJS v8 setup in packages/core/src/application.ts
- [x] T029 [US1] Implement module registration (registerModule/getModule) in packages/core/src/application.ts
- [x] T030 [US1] Implement GameApplication.destroy() with ordered teardown in packages/core/src/application.ts
- [x] T031 [US1] Implement WebGL context loss auto-recovery with event notification in packages/core/src/application.ts
- [x] T032 [US1] Implement WebAdapter (PlatformAdapter for browser) in packages/platform-web/src/web-adapter.ts
- [x] T033 [US1] Implement WebStorage (localStorage wrapper) in packages/platform-web/src/web-storage.ts
- [x] T034 [US1] Implement auto-detection logic (wx/tt/web) in packages/core/src/platform.ts
- [x] T035 [US1] Create public exports in packages/core/src/index.ts
- [x] T036 [US1] Create public exports in packages/platform-web/src/index.ts
- [x] T037 [US1] Create demo app entry in apps/demo/src/main.ts showing minimal init (≤10 lines)

**Checkpoint**: At this point, `pnpm install && pnpm dev` should launch a working canvas in browser

---

## Phase 4: User Story 2 - 资源加载与管理 (Priority: P1)

**Goal**: 统一接口完成资源加载、缓存、引用计数、卸载和调试预览的完整生命周期

**Independent Test**: 加载纹理 → 显示到屏幕 → 调试面板查看状态 → 卸载 → 验证内存释放

### Implementation for User Story 2

- [x] T038 [US2] Implement AssetCache with reference counting in packages/assets/src/asset-cache.ts
- [x] T039 [US2] Implement AssetLoader wrapping PixiJS v8 Assets API in packages/assets/src/asset-loader.ts
- [x] T040 [US2] Implement AssetManager.load() single resource loading with dedup in packages/assets/src/asset-manager.ts
- [x] T041 [US2] Implement AssetManager.loadBundle() batch loading with progress callback
- [x] T042 [US2] Implement AssetManager.retain/release/forceUnload lifecycle methods
- [x] T043 [US2] Implement AssetManager.getDebugInfo() for dev mode inspection
- [x] T044 [US2] Implement AssetPack integration in packages/assets/src/asset-pack.ts
- [x] T045 [US2] Implement load cancellation when unload requested mid-load
- [x] T046 [US2] Handle load errors: per-resource error isolation, retry support, error state
- [x] T047 [US2] Create public exports in packages/assets/src/index.ts
- [x] T048 [US2] Add asset loading demo in apps/demo/src/scenes/asset-demo.ts

**Checkpoint**: Resources can be loaded, cached, inspected, and unloaded with full lifecycle

---

## Phase 5: User Story 3 - 场景管理与切换 (Priority: P1)

**Goal**: 定义多个场景，通过一行代码切换，自动管理资源和过渡动画

**Independent Test**: 注册两个场景 → 触发切换 → 验证旧场景资源清理 + 新场景资源加载 + 过渡动画

### Implementation for User Story 3

- [x] T049 [US3] Implement SceneManager.register/unregister/getCurrent in packages/scene/src/scene-manager.ts
- [x] T050 [US3] Implement SceneManager.switchTo() with transition guard (reject when transitioning)
- [x] T051 [US3] Implement scene transition flow: exit current → load new assets → enter new
- [x] T052 [US3] Implement scene-level resource auto management (load on enter, unload on exit, keep shared)
- [x] T053 [US3] Implement fade transition animation in packages/scene/src/scene-transition.ts
- [x] T054 [US3] Implement TransitionConfig with custom transition support
- [x] T055 [US3] Implement built-in Loading scene with threshold trigger (>300ms) in packages/scene/src/loading-scene.ts
- [x] T056 [US3] Implement error fallback scene for transition failures
- [x] T057 [US3] Wire SceneManager as Module (onRegister/onEnable/onDisable) in scene-manager.ts
- [x] T058 [US3] Create public exports in packages/scene/src/index.ts
- [x] T059 [US3] Add scene switching demo with two scenes in apps/demo/src/scenes/

**Checkpoint**: Full scene lifecycle working: register → switch → transition → resource cleanup

---

## Phase 6: User Story 4 - UI 分层与布局 (Priority: P2)

**Goal**: 在游戏画面之上创建独立 UI 层，支持弹性布局和多面板层级管理

**Independent Test**: 创建 UI 面板 → 验证始终在游戏之上 → 调整窗口 → 布局自适应

### Implementation for User Story 4

- [x] T060 [US4] Implement UITier module with layer management (addLayer/getLayer/removeLayer) in packages/ui/src/ui-tier.ts
- [x] T061 [US4] Implement UITier root container that stays above game content via z-index
- [x] T062 [US4] Implement LayoutEngine with Flexbox-style layout (row/column, justify, align, gap) in packages/ui/src/layout.ts
- [x] T063 [US4] Implement LayoutProps (flexGrow, flexShrink, flexBasis, alignSelf, margin) handling
- [x] T064 [US4] Implement LayoutEngine.onResize() for responsive recalculation
- [x] T065 [US4] Wrap @pixi/ui components (Button, CheckBox, Input, List, ScrollBox) in packages/ui/src/components/
- [x] T066 [US4] Implement graceful degradation when @pixi/ui is not installed
- [x] T067 [US4] Create public exports in packages/ui/src/index.ts
- [x] T068 [US4] Add UI demo with button, text, and layout in apps/demo/src/scenes/ui-demo.ts

**Checkpoint**: UI layer renders above game, layouts respond to resize, components work independently

---

## Phase 7: User Story 5 - 模块热拔插与按需加载 (Priority: P2)

**Goal**: 未引用的模块自动裁剪，显式标记可强制保留，实现零体积开销

**Independent Test**: 对比全模块 vs 仅核心的构建产物，验证体积差异 ≥ 60%

### Implementation for User Story 7

- [x] T069 [US5] Configure all packages with sideEffects:false and named exports only (no export default)
- [x] T070 [US5] Add noStripModules config handling in GameApplication.init() in packages/core/src/application.ts
- [x] T071 [US5] Create Vite plugin for automatic unused module stripping in build pipeline
- [x] T072 [US5] Create build verification script comparing full vs minimal bundle sizes
- [x] T073 [US5] Configure rollupOptions.preserveModules for all packages' vite.config.ts
- [x] T074 [US5] Add package.json exports field with conditional sub-path exports for each module
- [x] T075 [US5] Add missing dependency detection with clear error messages at module registration
- [x] T076 [US5] Document tree-shaking requirements in README for each package

**Checkpoint**: Tree-shaking verified: unused modules produce zero bytes in output

---

## Phase 8: User Story 6 - 跨平台适配 (Priority: P2)

**Goal**: 同一套代码通过切换入口配置即可构建 Web/微信/抖音三个平台

**Independent Test**: 示例游戏分别在三个平台运行，行为差异不超过像素级别

### Implementation for User Story 6

- [x] T077 [US6] Implement WechatAdapter (wx.createCanvas, wx.createImage, wx.storage) in packages/platform-wechat/src/wechat-adapter.ts
- [x] T078 [US6] Implement WechatStorage (wx.setStorageSync/getStorageSync wrapper) in packages/platform-wechat/src/wechat-storage.ts
- [x] T079 [US6] Implement Wechat touch event mapping (wx.onTouchStart → pointer events) in packages/platform-wechat/src/wechat-adapter.ts
- [x] T080 [US6] Implement Wechat network adapter (wx.request → fetch-like API) in packages/platform-wechat/src/wechat-adapter.ts
- [x] T081 [US6] Implement DouyinAdapter (tt.createCanvas, tt.createImage, tt.storage) in packages/platform-douyin/src/douyin-adapter.ts
- [x] T082 [US6] Implement DouyinStorage (tt.setStorageSync/getStorageSync wrapper) in packages/platform-douyin/src/douyin-storage.ts
- [x] T083 [US6] Implement Douyin touch event and network mapping in packages/platform-douyin/src/douyin-adapter.ts
- [x] T084 [US6] Implement path resolution for mini game sandbox (wx.env.USER_DATA_PATH) in platform adapters
- [x] T085 [US6] Create Vite build config for WeChat Mini Game output format (game.js + game.json)
- [x] T086 [US6] Create Vite build config for Douyin Mini Game output format
- [x] T087 [US6] Create public exports for platform-wechat and platform-douyin
- [x] T088 [US6] Add cross-platform demo build scripts in apps/demo/package.json

**Checkpoint**: Same game code builds and runs on Web, WeChat, and Douyin

---

## Phase 9: User Story 7 - 调试与开发工具 (Priority: P3)

**Goal**: 开发模式下可视化 FPS、内存、资源列表和场景树，生产模式完全裁剪

**Independent Test**: 开发模式打开调试面板看到实时数据，生产构建不包含调试代码

### Implementation for User Story 7

- [x] T089 [US7] Implement DebugOverlay with toggle visibility in packages/debug/src/debug-overlay.ts
- [x] T090 [US7] Implement FPS and memory monitor in packages/debug/src/perf-monitor.ts
- [x] T091 [US7] Implement resource inspector (list, type, size, refCount) in packages/debug/src/resource-inspector.ts
- [x] T092 [US7] Implement scene hierarchy tree viewer in packages/debug/src/scene-tree.ts
- [x] T093 [US7] Implement resource leak detection (non-zero refCount but marked unload) with warning highlight
- [x] T094 [US7] Wire DebugOverlay into GameApplication when config.debug=true
- [x] T095 [US7] Implement production mode stripping via conditional import and Vite define
- [x] T096 [US7] Create public exports in packages/debug/src/index.ts

**Checkpoint**: Debug panel shows live data in dev mode; zero bytes in production build

---

## Phase 10: User Story 8 - 抖音 Adapter TypeScript 重构 (Priority: P2)

**Goal**: 将抖音官方 WebApp Adapter 从单文件 JavaScript 重构为多文件 TypeScript，每个类独立文件

**Independent Test**: TypeScript 编译通过，所有类可正确导出，全局注入后浏览器 API 可正常使用

### Implementation for User Story 8

#### Phase 10A: 基础设施和工具函数

- [x] T097 [P] [US8] Create tt.d.ts type declarations for Douyin API in packages/platform-douyin/src/types/tt.d.ts
- [x] T098 [P] [US8] Create util/noop.ts empty function utility
- [x] T099 [P] [US8] Create util/css-style.ts with 500+ CSS property defaults and getImageComputedStyle/getCanvasComputedStyle functions
- [x] T100 [P] [US8] Create util/parent-node.ts with parentNode/parentElement/ownerDocument helpers
- [x] T101 [P] [US8] Create util/style.ts with style property initialization
- [x] T102 [P] [US8] Create util/client-region.ts with clientLeft/Top/Width/Height and getBoundingClientRect
- [x] T103 [P] [US8] Create util/offset-region.ts with offsetLeft/Top/Width/Height
- [x] T104 [P] [US8] Create util/scroll-region.ts with scrollLeft/Top/Width/Height
- [x] T105 [P] [US8] Create util/class-list.ts with DOMTokenList stub
- [x] T106 [P] [US8] Create util/dataset.ts with dataset property helper
- [x] T107 [P] [US8] Create util/btoa.ts Base64 encoding function
- [x] T108 [P] [US8] Create util/atob.ts Base64 decoding function

#### Phase 10B: 事件系统

- [x] T109 [P] [US8] Create event/Event.ts base Event class
- [x] T110 [P] [US8] Create event/EventTarget.ts with WeakMap-based event listener storage
- [x] T111 [P] [US8] Create event/TouchEvent.ts for touch events
- [x] T112 [P] [US8] Create event/PointerEvent.ts with touchToPointer conversion logic
- [x] T113 [P] [US8] Create event/MouseEvent.ts for mouse events

#### Phase 10C: DOM 核心

- [x] T114 [US8] Create dom/Node.ts extending EventTarget with childNodes management
- [x] T115 [US8] Create dom/Element.ts extending Node with attributes and children
- [x] T116 [US8] Create dom/HTMLElement.ts extending Element with layout properties and style
- [x] T117 [P] [US8] Create dom/DocumentElement.ts for document.documentElement
- [x] T118 [P] [US8] Create dom/Body.ts for document.body

#### Phase 10D: DOM 元素

- [x] T119 [US8] Create dom/HTMLCanvasElement.ts base class for canvas
- [x] T120 [US8] Create dom/Canvas.ts wrapping tt.createCanvas()
- [x] T121 [P] [US8] Create dom/Image.ts factory wrapping tt.createImage()
- [x] T122 [P] [US8] Create dom/ImageBitmap.ts stub class
- [x] T123 [P] [US8] Create dom/HTMLVideoElement.ts for video elements

#### Phase 10E: 媒体系统

- [x] T124 [US8] Create media/HTMLMediaElement.ts base media class
- [x] T125 [P] [US8] Create media/HTMLAudioElement.ts base audio class
- [x] T126 [US8] Create media/Audio.ts with InnerAudioContext integration (HAVE_NOTHING..HAVE_ENOUGH_DATA states)
- [x] T127 [US8] Create media/AudioContext.ts wrapping tt.getAudioContext()

#### Phase 10F: 网络

- [x] T128 [US8] Create network/XMLHttpRequest.ts with tt.request() for remote and tt.getFileSystemManager() for local files
- [x] T129 [P] [US8] Create network/WebSocket.ts wrapping tt.connectSocket()

#### Phase 10G: Worker, Storage, Screen

- [x] T130 [P] [US8] Create worker/Worker.ts wrapping tt.createWorker()
- [x] T131 [US8] Create storage/localStorage.ts with tt storage API mapping
- [x] T132 [P] [US8] Create storage/FileReader.ts stub class
- [x] T133 [P] [US8] Create storage/TextDecoder.ts text decoding utility
- [x] T134 [US8] Create storage/Blob.ts binary large object implementation
- [x] T135 [P] [US8] Create storage/URL.ts with createObjectURL/revokeObjectURL
- [x] T136 [P] [US8] Create navigator/navigator.ts with user agent and online status
- [x] T137 [P] [US8] Create performance/performance.ts with tt.getPerformance() or Date fallback
- [x] T138 [P] [US8] Create screen/screen.ts with system info dimensions
- [x] T139 [P] [US8] Create screen/matchMedia.ts media query stub

#### Phase 10H: Window 和 Document

- [x] T140 [US8] Create window/location.ts location object
- [x] T141 [P] [US8] Create window/getComputedStyle.ts style computation
- [x] T142 [P] [US8] Create window/scrollTo.ts and window/scrollBy.ts scroll functions
- [x] T143 [P] [US8] Create window/alert.ts, window/focus.ts, window/blur.ts global functions
- [x] T144 [US8] Create dom/document.ts with createElement, getElementById, querySelector, etc.
- [x] T145 [US8] Create window/window.ts aggregating all global objects and classes

#### Phase 10I: 注入和导出

- [x] T146 [US8] Create inject.ts with global injection logic and GameGlobal.__isAdapterInjected guard
- [x] T147 [US8] Create index.ts with all exports for tree-shaking support
- [x] T148 [US8] Run tsc --noEmit to verify all types compile correctly
- [x] T149 [US8] Create test verifying inject() populates global objects correctly

**Checkpoint**: TypeScript compilation passes, all classes exported, global injection works

---

## Phase 10J: 屏幕自适应修复 (US1 补充 — 画布 resize 事件驱动)

**Goal**: 修复画布不自适应窗口大小的问题，将 resize 检测从 ticker 轮询改为 PlatformAdapter.onResize() 事件驱动

**Independent Test**: 打开 dev server → 画布填满浏览器窗口 → 拖动窗口边缘 → 画布即时适配新尺寸（无延迟）

### 根因

`WebAdapter.getSystemInfo()` 返回 `window.screen.width/height`（物理屏幕尺寸），而非 `window.innerWidth/innerHeight`（视口尺寸）。同时 `ScreenAdapter` 使用 ticker 每帧轮询，开销浪费。

### Implementation

- [x] T159 [US1] Add `onResize(callback)` method to `PlatformAdapter` interface in `packages/core/src/platform.ts` — 回调签名 `(width: number, height: number) => void`，返回取消注册函数 `() => void`
- [x] T160 [P] [US1] Fix `WebAdapter.getSystemInfo()` to return `window.innerWidth/innerHeight` instead of `window.screen.width/height` in `packages/core/src/platform-web-adapter.ts`
- [x] T161 [P] [US1] Implement `WebAdapter.onResize()` using `window.addEventListener('resize', ...)` in `packages/core/src/platform-web-adapter.ts` — 返回的 unsubscribe 函数调用 `removeEventListener`
- [x] T162 [P] [US1] Sync `WebAdapter` fixes to `packages/platform-web/src/web-adapter.ts` (getSystemInfo + onResize)
- [x] T163 [US1] Rewrite `ScreenAdapter` in `packages/core/src/screen.ts` — 移除 ticker 轮询 (`tickResizeCheck`)，改用 `PlatformAdapter.onResize()` 事件驱动：`start()` 注册回调，回调中调用 `renderer.resize(width, height)` 并触发 `resizeCallback`
- [x] T164 [P] [US1] Add `SCREEN_RESIZE = 'screen:resize'` event constant to `GameEvents` in `packages/core/src/events.ts`
- [x] T165 [US1] Connect `ScreenAdapter` resize to `EventBus` in `packages/core/src/application.ts` — ScreenAdapter 构造时接收 EventBus 引用，resize 回调中 `events.emit(GameEvents.SCREEN_RESIZE, width, height)`
- [x] T166 [US1] Add resize listener in `SceneManager.onEnable()` in `packages/scene/src/scene-manager.ts` — 监听 `screen:resize` 事件，分发到当前活跃场景的 `scene.onResize(width, height)`
- [x] T167 [US1] Update demo app in `apps/demo/src/main.ts` — 移除手动 ticker 居中逻辑，改为在 `onResize` 中居中，验证窗口 resize 时画布即时适配

**Checkpoint**: `pnpm dev` → 画布填满窗口 → 拖动窗口边缘 → 画布即时适配，Scene.onResize() 被正确调用

---

## Phase 10K: 微信小游戏 Adapter TypeScript 重构 (US8 补充)

**Goal**: 将微信小游戏官方 weapp-adapter.js 转为 TypeScript 模块化实现，一个类一个文件

**Independent Test**: TypeScript 编译通过，所有类可正确导出，全局注入后浏览器 API 可正常使用

### 根据依赖拓扑分组执行

#### 10K-A: 类型声明和工具函数（基础层，无依赖）

- [x] T168 [P] [US8] Create `wx.d.ts` type declarations for WeChat API in `packages/platform-wechat/src/types/wx.d.ts` — 涵盖全部 16 个 wx.* API 类型
- [x] T169 [P] [US8] Create `noop.ts` empty function utility in `packages/platform-wechat/src/util/noop.ts`

#### 10K-B: 事件系统（依赖类型声明）

- [x] T170 [P] [US8] Create `Event.ts` base Event class in `packages/platform-wechat/src/event/Event.ts` — 修正 `timestampe` → `timestamp` 拼写错误
- [x] T171 [US8] Create `EventTarget.ts` with WeakMap-based event listener storage in `packages/platform-wechat/src/event/EventTarget.ts` — 修正 for 循环 bug: `for (i=length-1; i>=0; i--)`
- [x] T172 [P] [US8] Create `TouchEvent.ts` with TouchEvent class + touchEventHandlerFactory + wx.onTouch* registration in `packages/platform-wechat/src/event/TouchEvent.ts`

#### 10K-C: DOM 核心（顺序执行：Node → Element → HTMLElement）

- [x] T173 [US8] Create `Node.ts` extending EventTarget with childNodes management in `packages/platform-wechat/src/dom/Node.ts`
- [x] T174 [US8] Create `Element.ts` extending Node with attributes and children in `packages/platform-wechat/src/dom/Element.ts` — 修正 `ELement` → `Element` 拼写错误
- [x] T175 [US8] Create `HTMLElement.ts` extending Element with layout properties and style in `packages/platform-wechat/src/dom/HTMLElement.ts` — 修正 `childern` → `children`

#### 10K-D: DOM 元素（DOM 核心完成后可并行）

- [x] T176 [P] [US8] Create `HTMLCanvasElement.ts` base class for canvas in `packages/platform-wechat/src/dom/HTMLCanvasElement.ts`
- [x] T177 [P] [US8] Create `HTMLImageElement.ts` base class for image in `packages/platform-wechat/src/dom/HTMLImageElement.ts`
- [x] T178 [US8] Create `Canvas.ts` factory wrapping `wx.createCanvas()` with prototype chain injection in `packages/platform-wechat/src/dom/Canvas.ts`
- [x] T179 [P] [US8] Create `Image.ts` factory wrapping `wx.createImage()` in `packages/platform-wechat/src/dom/Image.ts`
- [x] T180 [P] [US8] Create `HTMLMediaElement.ts` base media class with stub methods in `packages/platform-wechat/src/dom/HTMLMediaElement.ts`
- [x] T181 [P] [US8] Create `HTMLAudioElement.ts` base audio class in `packages/platform-wechat/src/dom/HTMLAudioElement.ts`
- [x] T182 [P] [US8] Create `HTMLVideoElement.ts` stub for video elements in `packages/platform-wechat/src/dom/HTMLVideoElement.ts`
- [x] T183 [P] [US8] Create `DocumentElement.ts` for `document.documentElement` in `packages/platform-wechat/src/dom/DocumentElement.ts`
- [x] T184 [P] [US8] Create `Body.ts` for `document.body` in `packages/platform-wechat/src/dom/Body.ts`

#### 10K-E: 媒体系统

- [x] T185 [US8] Create `Audio.ts` with InnerAudioContext integration (HAVE_NOTHING..HAVE_ENOUGH_DATA states) in `packages/platform-wechat/src/media/Audio.ts` — 包装 wx.createInnerAudioContext，使用 WeakMap 私有字段

#### 10K-F: 网络

- [x] T186 [P] [US8] Create `XMLHttpRequest.ts` wrapping `wx.request()` in `packages/platform-wechat/src/network/XMLHttpRequest.ts` — 修正 `UNSEND` → `UNSENT`，WeakMap 私有字段，~145 行
- [x] T187 [P] [US8] Create `WebSocket.ts` wrapping `wx.connectSocket()` in `packages/platform-wechat/src/network/WebSocket.ts`

#### 10K-G: Storage / Navigator / Performance / Screen

- [x] T188 [US8] Create `localStorage.ts` wrapping wx storage API mapping in `packages/platform-wechat/src/storage/localStorage.ts` — wx.getStorageSync/setStorageSync/removeStorageSync/clearStorageSync/getStorageInfoSync
- [x] T189 [P] [US8] Create `Blob.ts` binary large object implementation in `packages/platform-wechat/src/storage/Blob.ts`
- [x] T190 [P] [US8] Create `FileReader.ts` stub class in `packages/platform-wechat/src/storage/FileReader.ts`
- [x] T191 [P] [US8] Create `URL.ts` with createObjectURL/revokeObjectURL in `packages/platform-wechat/src/storage/URL.ts`
- [x] T192 [P] [US8] Create `navigator.ts` singleton with user agent and online status in `packages/platform-wechat/src/navigator/navigator.ts`
- [x] T193 [P] [US8] Create `performance.ts` wrapping `wx.getPerformance()` or Date fallback in `packages/platform-wechat/src/performance/performance.ts`
- [x] T194 [P] [US8] Create `screen.ts` singleton with system info dimensions in `packages/platform-wechat/src/screen/screen.ts`
- [x] T195 [P] [US8] Create `matchMedia.ts` media query stub in `packages/platform-wechat/src/screen/matchMedia.ts`

#### 10K-H: Window 和 Document

- [x] T196 [P] [US8] Create `location.ts` location object in `packages/platform-wechat/src/window/location.ts`
- [x] T197 [P] [US8] Create `getComputedStyle.ts` style computation in `packages/platform-wechat/src/window/getComputedStyle.ts`
- [x] T198 [P] [US8] Create `scrollTo.ts` and `scrollBy.ts` scroll functions in `packages/platform-wechat/src/window/scrollTo.ts`
- [x] T199 [P] [US8] Create `alert.ts`, `focus.ts`, `blur.ts` global functions in `packages/platform-wechat/src/window/alert.ts`
- [x] T200 [US8] Create `document.ts` with createElement, getElementById, querySelector, etc. in `packages/platform-wechat/src/dom/document.ts`
- [x] T201 [US8] Create `window.ts` aggregating all global objects and classes in `packages/platform-wechat/src/window/window.ts`

#### 10K-I: 注入和导出

- [x] T202 [US8] Create `inject.ts` with global injection logic and `GameGlobal.__isAdapterInjected` guard in `packages/platform-wechat/src/inject.ts` — 支持 devtools（Object.defineProperty）和真机（直接赋值）双路径
- [x] T203 [US8] Create `index.ts` with all exports for tree-shaking support in `packages/platform-wechat/src/index.ts` — 按 event/dom/media/network/storage/globals/inject 分组导出
- [x] T204 [US8] Run `tsc --noEmit` to verify all types compile correctly for the wechat adapter package
- [x] T205 [US8] Update `WechatAdapter` in `packages/platform-wechat/src/wechat-adapter.ts` to remove inline wx type declarations, use `types/wx.d.ts` reference instead

**Checkpoint**: TypeScript compilation passes, all classes exported, global injection works on WeChat devtools and device

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: Cross-cutting improvements and final validation

- [ ] T150 [P] Write JSDoc comments for all public APIs across all packages
- [ ] T151 [P] Verify quickstart.md instructions work end-to-end on fresh project
- [ ] T152 Verify core package gzip size ≤ 50KB (SC-002)
- [ ] T153 Verify full vs minimal build size difference ≥ 60% (SC-003)
- [ ] T154 [P] Add README.md to each package with usage examples
- [ ] T155 Run ESLint and Prettier across all packages
- [ ] T156 Validate cross-platform build outputs (Web/WeChat/Douyin directory structures)
- [ ] T157 Performance benchmark: 100 texture load/unload at ≥ 55 FPS (SC-005)
- [ ] T158 Performance benchmark: scene transition at ≥ 55 FPS (SC-006)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-9)**: All depend on Foundational phase completion
  - US1, US2, US3 (P1) can proceed sequentially in priority order
  - US4, US5, US6 (P2) can start after P1 stories or in parallel
  - US7 (P3) starts after P2 stories
- **Polish (Phase 10)**: Depends on all desired user stories being complete

### User Story Dependencies

- **US1 (P1)**: Foundation only - no other story dependencies
- **US2 (P1)**: Foundation only - AssetManager is independent of scenes
- **US3 (P1)**: Depends on US2 (scenes use AssetManager for resource loading)
- **US4 (P2)**: Depends on US1 (needs GameApplication and Module base)
- **US5 (P2)**: Depends on US1 (needs core config system)
- **US6 (P2)**: Depends on US1 (needs PlatformAdapter interface)
- **US7 (P3)**: Depends on US2, US3 (inspects assets and scenes)
- **US8 (P2)**: Can start after util and event patterns established, runs in parallel with US6
- **Phase 10J (US1 补充)**: Depends on Phase 2 (PlatformAdapter 接口) 和 Phase 3 (US1 GameApplication)，修复画布 resize 问题
- **Phase 10K (US8 补充 — 微信 Adapter)**: Depends on Phase 2 (基础类型)，与 Phase 10 (US8 抖音 Adapter) 模式一致

### Within Each User Story

- Interfaces and types before implementations
- Core logic before integrations
- Story complete before moving to next priority

### Parallel Opportunities

- Phase 1: T002-T005 (config files), T006-T016 (package.json files) all parallel
- Phase 2: T026-T027 (test mocks) parallel with other foundation tasks
- Phase 3 (US1): T032-T033 (WebAdapter) parallel with T028-T031 (GameApplication)
- Phase 4 (US2): T044 (AssetPack) parallel with T040-T043 (AssetManager core)
- Phase 8 (US6): T077-T080 (WeChat) parallel with T081-T083 (Douyin)
- Phase 9 (US7): T090-T092 (monitor/inspector/tree) all parallel
- Phase 10 (US8 - Adapter):
  - 10A: T097-T108 (util functions) all parallel
  - 10B: T109-T113 (event classes) can be partially parallel (EventTarget depends on Event)
  - 10C: T114-T116 (DOM core) sequential (Node → Element → HTMLElement)
  - 10D-E-F-G: T117-T143 (elements, media, network, storage) can run in parallel groups
  - 10H: T144-T145 (document/window) after DOM core complete
  - 10I: T146-T149 (inject/index) at the end
- Phase 11: T150, T151, T154, T155 all parallel
- Phase 10J: T160+T161 (WebAdapter core) parallel with T162 (WebAdapter platform-web), T160+T161+T162+T164 all parallel (不同文件)
- Phase 10K (US8 微信 Adapter):
  - 10K-A: T168+T169 (types + util) all parallel
  - 10K-B: T170+T172 (Event, TouchEvent) parallel, T171 (EventTarget) after T170
  - 10K-C: T173→T174→T175 (DOM core) sequential (Node → Element → HTMLElement)
  - 10K-D: T176-T184 (DOM elements) all parallel after DOM core complete
  - 10K-E-F-G: T185-T195 (media, network, storage, navigator, performance, screen) independent groups can run in parallel
  - 10K-H: T196-T201 (window/document) after DOM core
  - 10K-I: T202-T205 (inject/index) at the end

---

## Parallel Example: 微信 Adapter TypeScript 重构 (Phase 10K)

```bash
# 10K-A - Types and utils (all parallel):
Task: "Create wx.d.ts type declarations"       # T168
Task: "Create noop.ts utility"                  # T169

# 10K-B - Event system (Event before EventTarget):
Task: "Create Event.ts"                         # T170
Task: "Create EventTarget.ts"                   # T171 (depends on T170)
Task: "Create TouchEvent.ts"                    # T172

# 10K-C - DOM core (sequential):
Task: "Create Node.ts"                          # T173
Task: "Create Element.ts"                       # T174 (depends on T173)
Task: "Create HTMLElement.ts"                   # T175 (depends on T174)

# 10K-D - DOM elements (all parallel after DOM core):
Task: "Create HTMLCanvasElement.ts"             # T176
Task: "Create HTMLImageElement.ts"              # T177
Task: "Create Canvas.ts"                        # T178
Task: "Create Image.ts"                         # T179
Task: "Create HTMLMediaElement.ts"              # T180
Task: "Create HTMLAudioElement.ts"              # T181
Task: "Create HTMLVideoElement.ts"              # T182
Task: "Create DocumentElement.ts"               # T183
Task: "Create Body.ts"                          # T184

# 10K-E-F-G - Independent groups (can run in parallel after DOM core):
Group 1: Audio (T185)
Group 2: Network (T186, T187)
Group 3: Storage (T188-T191)
Group 4: Navigator/Performance/Screen (T192-T195)

# 10K-H - Window and Document:
Group: location, getComputedStyle, scrollTo, alert, document, window (T196-T201)

# 10K-I - Final integration:
Task: "Create inject.ts"                        # T202
Task: "Create index.ts"                         # T203
Task: "Run tsc --noEmit"                        # T204
Task: "Update WechatAdapter"                    # T205
```

## Parallel Example: 屏幕自适应修复 (Phase 10J)

```bash
# 接口变更先执行:
Task: "Add onResize() to PlatformAdapter interface"                         # T159

# 然后这些可以并行（不同文件）:
Task: "Fix WebAdapter.getSystemInfo() + implement onResize() (core)"        # T160, T161
Task: "Sync WebAdapter fixes (platform-web)"                                # T162
Task: "Add SCREEN_RESIZE event constant"                                    # T164

# 最后顺序执行（有依赖关系）:
Task: "Rewrite ScreenAdapter to event-driven"                               # T163 (depends on T159)
Task: "Connect ScreenAdapter to EventBus"                                   # T165 (depends on T163, T164)
Task: "Add SceneManager resize listener"                                    # T166 (depends on T165)
Task: "Update demo app to verify"                                           # T167
```

## Parallel Example: User Story 1

```bash
# Phase 2 foundation completes, then US1 can start:
Task: "Implement GameApplication.init() in packages/core/src/application.ts"  # T028
Task: "Implement WebAdapter in packages/platform-web/src/web-adapter.ts"      # T032
Task: "Implement WebStorage in packages/platform-web/src/web-storage.ts"      # T033
```

## Parallel Example: User Story 6

```bash
# WeChat and Douyin adapters can be built simultaneously:
Task: "Implement WechatAdapter in packages/platform-wechat/src/wechat-adapter.ts"  # T077-T080
Task: "Implement DouyinAdapter in packages/platform-douyin/src/douyin-adapter.ts"  # T081-T083
```

## Parallel Example: User Story 8 (Douyin Adapter TS Refactor)

```bash
# Phase 10A - All util functions can be created in parallel:
Task: "Create util/noop.ts"                                                  # T098
Task: "Create util/css-style.ts"                                             # T099
Task: "Create util/parent-node.ts"                                           # T100
Task: "Create util/style.ts"                                                 # T101
Task: "Create util/client-region.ts"                                         # T102
Task: "Create util/offset-region.ts"                                         # T103
Task: "Create util/scroll-region.ts"                                         # T104
Task: "Create util/class-list.ts"                                            # T105
Task: "Create util/dataset.ts"                                               # T106
Task: "Create util/btoa.ts"                                                  # T107
Task: "Create util/atob.ts"                                                  # T108

# Phase 10B - Event system (Event before EventTarget):
Task: "Create event/Event.ts"                                                # T109
Task: "Create event/EventTarget.ts"                                          # T110 (depends on T109)
Task: "Create event/TouchEvent.ts"                                           # T111
Task: "Create event/PointerEvent.ts"                                         # T112
Task: "Create event/MouseEvent.ts"                                           # T113

# Phase 10D-G - Independent groups can run in parallel after DOM core:
Group 1: DOM elements (T117-T123)
Group 2: Media system (T124-T127)
Group 3: Network (T128-T129)
Group 4: Worker/Storage/Navigator/Performance/Screen (T130-T139)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Install @ksgames26/core in empty project, 10 lines to launch canvas
5. Can already be published as alpha for early adopters

### Incremental Delivery

1. Setup + Foundational → Architecture ready
2. Add US1 → Canvas launches → **Publish alpha** (MVP!)
3. Add US2 → Resources load/unload → **Publish beta**
4. Add US3 → Scenes switch with transitions → **Release candidate**
5. Add US4-US6 → UI, tree-shaking, cross-platform → **v1.0**
6. Add US7 → Debug tools → **v1.1**
7. Add US8 → Douyin Adapter TypeScript refactor → Better type safety for Douyin platform

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
