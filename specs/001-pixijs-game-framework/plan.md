# Implementation Plan: 微信小游戏 Adapter TypeScript 重构

**Branch**: `001-pixijs-game-framework` | **Date**: 2026-04-12 | **Spec**: [spec.md](./spec.md)
**Input**: 将微信小游戏官方 weapp-adapter.js 转为 TypeScript 模块化版本，一个类一个文件

## Summary

将微信小游戏官方 adapter（`weapp-adapter/weapp-adapter.js`，1593 行 webpack 打包产物，~450 行源码）重构为 TypeScript 模块化实现。参照已有的抖音 adapter TypeScript 版本（`packages/platform-douyin/src/`）的目录结构和模式，每个类/对象独立文件，放置到 `packages/platform-wechat/src/`。同时修正原版中的已知 bug（`ELement` 拼写、`timestampe` 拼写、`UNSEND` → `UNSENT`、for 循环错误等）。

## Technical Context

**Language/Version**: TypeScript (strict mode)
**Primary Dependencies**: 微信小游戏 wx.* API（16 个 API）
**Storage**: N/A
**Testing**: Vitest
**Target Platform**: 微信小游戏
**Project Type**: npm monorepo 多包库（平台适配器）
**Performance Goals**: 零运行时开销（纯类型+模块化重构）
**Constraints**: 与原 JS 版 API 完全兼容，双环境注入（devtools + 真机）
**Scale/Scope**: ~450 行源码 → ~26 个 TypeScript 文件

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| 原则 | 状态 | 说明 |
|------|------|------|
| I. 性能优先 | PASS | 纯类型重构，无运行时性能影响 |
| II. 模块化架构 | PASS | 每个类独立文件，按职责分目录 |
| III. 类型安全 | PASS | TypeScript strict mode，wx API 完整类型声明 |
| IV. 渲染一致性 | PASS | 保持与原版完全一致的运行时行为 |
| V. 资源管理 | PASS | 不涉及资源加载逻辑 |
| VI. 可测试性 | PASS | 每个类可独立测试 |
| VII. 简洁性 | PASS | 参照抖音版本已验证的模式，不引入新抽象 |

## Project Structure

### Documentation (this feature)

```text
specs/001-pixijs-game-framework/
├── plan.md              # This file
├── research.md          # R20: 微信 adapter 转换决策
└── tasks.md             # 实施任务列表
```

### Source Code (repository root)

```text
packages/platform-wechat/src/
├── index.ts                    # 统一导出
├── inject.ts                   # 全局注入逻辑（devtools + 真机双路径）
├── wechat-adapter.ts           # WechatAdapter（已有，保留）
├── wechat-storage.ts           # WechatStorage（已有，保留）
│
├── types/
│   └── wx.d.ts                 # wx.* API 类型声明
│
├── util/
│   ├── noop.ts                 # 空函数工具
│   └── css-style.ts            # CSS 样式默认值（如需）
│
├── event/
│   ├── Event.ts                # 基础事件类
│   ├── EventTarget.ts          # 事件目标基类
│   └── TouchEvent.ts           # 触摸事件 + touchEventHandlerFactory
│
├── dom/
│   ├── Node.ts                 # DOM 节点基类
│   ├── Element.ts              # DOM 元素
│   ├── HTMLElement.ts          # HTML 元素
│   ├── HTMLCanvasElement.ts    # Canvas 元素基类
│   ├── HTMLImageElement.ts     # Image 元素基类
│   ├── HTMLMediaElement.ts     # 媒体元素基类
│   ├── HTMLAudioElement.ts     # 音频元素基类
│   ├── HTMLVideoElement.ts     # 视频元素基类
│   ├── DocumentElement.ts      # document.documentElement
│   ├── Body.ts                 # document.body
│   ├── Canvas.ts               # Canvas 工厂（包装 wx.createCanvas）
│   ├── Image.ts                # Image 工厂（包装 wx.createImage）
│   └── document.ts             # document 单例对象
│
├── media/
│   ├── Audio.ts                # 音频播放器（包装 wx.createInnerAudioContext）
│   └── AudioContext.ts         # 音频上下文（如需）
│
├── network/
│   ├── XMLHttpRequest.ts       # HTTP 请求（包装 wx.request）
│   └── WebSocket.ts            # WebSocket（包装 wx.connectSocket）
│
├── worker/
│   └── Worker.ts               # Worker（如 wx.createWorker 可用）
│
├── storage/
│   ├── localStorage.ts         # 本地存储（包装 wx.*StorageSync）
│   ├── Blob.ts                 # Blob 类
│   ├── FileReader.ts           # FileReader 桩
│   └── URL.ts                  # URL 类
│
├── navigator/
│   └── navigator.ts            # navigator 单例
│
├── performance/
│   └── performance.ts          # performance 单例（包装 wx.getPerformance）
│
├── screen/
│   ├── screen.ts               # screen 单例
│   └── matchMedia.ts           # matchMedia 桩
│
└── window/
    ├── window.ts               # window 单例
    ├── location.ts             # location 单例
    ├── getComputedStyle.ts     # getComputedStyle 函数
    ├── scrollTo.ts             # scrollTo 函数
    ├── scrollBy.ts             # scrollBy 函数
    ├── alert.ts                # alert 函数
    ├── focus.ts                # focus 函数
    └── blur.ts                 # blur 函数
```

**Structure Decision**: 参照抖音 adapter TypeScript 版本的目录结构，按职责分为 util/、event/、dom/、media/、network/、worker/、storage/、navigator/、performance/、screen/、window/ 子目录。保留已有的 wechat-adapter.ts 和 wechat-storage.ts（PlatformAdapter 接口实现）。

## 与原版差异

### 修正的 Bug

| 原版问题 | 修正 |
|----------|------|
| `class ELement` | → `class Element` |
| `this.timestampe` | → `this.timestamp` |
| `XMLHttpRequest.UNSEND` | → `XMLHttpRequest.UNSENT` |
| `for (let i = arr.length; i--; i > 0)` | → `for (let i = arr.length - 1; i >= 0; i--)` |
| `construct()` in FileReader | → `constructor()` |
| `this.childern` | → `this.children` |

### wx.* API 清单（16 个）

`wx.getSystemInfoSync`, `wx.getPerformance`, `wx.createCanvas`, `wx.createImage`, `wx.createInnerAudioContext`, `wx.onTouchStart/Move/End/Cancel`, `wx.request`, `wx.connectSocket`, `wx.getStorageInfoSync`, `wx.getStorageSync`, `wx.setStorageSync`, `wx.removeStorageSync`, `wx.clearStorageSync`, `wx.onWindowResize`, `wx.offWindowResize`

## Complexity Tracking

> 无宪章违规需要记录。
