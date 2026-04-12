# Implementation Plan: PixiJS 游戏框架

**Branch**: `001-pixijs-game-framework` | **Date**: 2026-04-13 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-pixijs-game-framework/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

基于 PixiJS v8 构建模块化游戏开发框架，支持 Web、微信小游戏、抖音小游戏三端发布。采用 monorepo 架构，各功能模块独立 npm 包，通过 tree-shaking 实现按需引入，核心包体控制在 50KB(gzip)以内。

主要技术方案：
- PixiJS Assets 作为资源基础设施，集成 AssetPack 分块加载
- 场景管理器提供生命周期和过渡动画支持
- UI 分层基于 PixiJS Layout 实现弹性布局
- 平台适配层抽象窗口、存储、输入等平台差异
- 调试工具面板仅在开发模式存在

## Technical Context

**Language/Version**: TypeScript 5.7+ (strict mode)
**Primary Dependencies**: PixiJS 8.13+, @pixi/layout, @pixi/assetpack, @pixi/spine-pixi
**Storage**: 平台本地存储适配（localStorage/微信 Storage/抖音 Storage）
**Testing**: Vitest + Playwright（E2E）
**Target Platform**: Web (ES2020+), 微信小游戏, 抖音小游戏
**Project Type**: library (npm monorepo 多包发布)
**Performance Goals**: 60 FPS (桌面), 30+ FPS (移动端), 首屏加载 < 3s
**Constraints**: 核心包 < 50KB gzip, 全模块裁剪后减少 60%+ 体积
**Scale/Scope**: 10+ 个功能包，支持 3 个平台，示例项目 3 个

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| 原则 | 状态 | 备注 |
|------|------|------|
| I. 性能优先 | ✅ PASS | 目标 60 FPS，使用对象池，纹理合批 |
| II. 模块化架构 | ✅ PASS | monorepo 结构，模块间通过事件/接口通信 |
| III. 类型安全 | ✅ PASS | strict mode, 禁止 any |
| IV. 渲染一致性 | ✅ PASS | 统一 resolution/autoDensity，支持降级 |
| V. 资源管理 | ✅ PASS | Assets 统一管理，显式生命周期 |
| VI. 可测试性 | ✅ PASS | 逻辑渲染分离，提供 Mock |
| VII. 简洁性 | ⚠️ CHECK | 需验证不引入过度设计 |

## Project Structure

### Documentation (this feature)

```text
specs/001-pixijs-game-framework/
├── plan.md              # 本文件
├── research.md          # 技术调研和决策
├── data-model.md        # 数据模型和实体定义
├── quickstart.md        # 快速开始指南
├── contracts/           # API 契约文档
└── tasks.md             # 任务列表（后续生成）
```

### Source Code (repository root)

```text
packages/                    # 核心功能包
├── core/                   # 框架核心（GameApplication、模块系统、平台抽象）
├── assets/                 # 资源管理（加载、缓存、引用计数、AssetPack）
├── scene/                  # 场景管理（切换、过渡、生命周期）
├── ui/                     # UI 层（布局、组件）
├── platform-web/           # Web 平台适配
├── platform-wechat/        # 微信小游戏适配
├── platform-douyin/        # 抖音小游戏适配
├── debug/                  # 调试工具（仅在开发模式）
├── spine/                  # Spine 动画支持（可选）
└── test-utils/             # 测试工具

apps/                       # 示例应用
├── demo/                   # 完整演示项目
├── my-game/                # 最小示例项目
└── playground/             # 测试场

scripts/                    # 构建和发布脚本
├── build-minigame.js       # 小游戏构建
├── release-minigame.js     # 小游戏发布
├── release-npm.js          # npm 发布
└── analyze-bundle.js       # 包体分析

docs/                       # 文档
├── MINIGAME_BUILD.md       # 小游戏构建指南
└── MINIGAME_RELEASE.md     # 小游戏发布指南
```

**Structure Decision**: 采用 monorepo 多包结构，每个功能模块为独立 npm 包。packages/ 包含 10 个核心包，apps/ 包含 3 个示例项目。

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| 10 个包 (而非更少) | 功能解耦，按需引入 | 合并会导致无法 tree-shaking，违背包体控制目标 |
| 平台适配器模式 | 跨平台需求明确 | 条件编译难以维护，适配器更清晰 |
