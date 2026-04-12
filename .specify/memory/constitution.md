<!--
Sync Impact Report
==================
Version change: N/A → 1.0.0
Modified principles: N/A (initial ratification)
Added sections:
  - I. 性能优先 (Performance First)
  - II. 模块化架构 (Modular Architecture)
  - III. 类型安全 (Type Safety)
  - IV. 渲染一致性 (Rendering Consistency)
  - V. 资源管理 (Resource Management)
  - VI. 可测试性 (Testability)
  - VII. 简洁性 (Simplicity)
  - 技术约束
  - 开发工作流
  - 治理
Removed sections: N/A
Templates requiring updates:
  - .specify/templates/plan-template.md ✅ compatible (Constitution Check gate present)
  - .specify/templates/spec-template.md ✅ compatible (no principle-specific references)
  - .specify/templates/tasks-template.md ✅ compatible (task structure supports principles)
Follow-up TODOs: None
-->

# PixiJS Client Constitution

## Core Principles

### I. 性能优先 (Performance First)

渲染性能是 PixiJS 客户端项目的生命线。所有代码变更 MUST 不引入可察觉的帧率下降。

- 渲染循环 MUST 维持目标帧率（通常 60 FPS），帧时间波动 MUST NOT 超过 16.67ms 的 20%
- 动画和交互响应 MUST 在一帧内完成计算，禁止阻塞主线程的长同步操作
- 对象池（Object Pool）MUST 用于频繁创建销毁的显示对象（如粒子、子弹）
- MUST 使用 PixiJS 内置性能分析工具（如 `@pixi/utils`、`Stats` 插件）定期检测性能瓶颈
- 纹理合批（Batching）和图集（Texture Atlas）MUST 作为资源加载的默认策略

**理由**: 图形渲染应用的核心价值在于流畅的视觉体验，性能退化直接破坏用户体验，且在后期修复成本极高。

### II. 模块化架构 (Modular Architecture)

功能 MUST 以独立的模块组织，每个模块拥有明确的职责边界和公开接口。

- 模块间 MUST 通过事件总线或依赖注入通信，禁止直接跨模块访问内部状态
- 每个模块 MUST 能在隔离环境中独立运行和测试
- 场景（Scene）MUST 作为顶层模块容器，负责管理其下属的显示对象和子系统
- 公共接口 MUST 以 TypeScript 接口（Interface）形式定义，实现细节隐藏在具体类中
- 禁止循环依赖；模块依赖图 MUST 始终保持有向无环图（DAG）

**理由**: 图形应用的复杂度随功能增长急剧上升，模块化是控制复杂度、支持团队并行开发的唯一可持续方式。

### III. 类型安全 (Type Safety)

项目 MUST 使用 TypeScript 并启用严格模式，类型安全是不可协商的底线。

- `tsconfig.json` MUST 启用 `strict: true`，禁止使用 `any` 类型（`eslint-disable` 需附注释说明理由）
- 所有公共 API MUST 提供完整的类型定义，包括 PixiJS 对象的扩展类型
- 与 PixiJS 交互的代码 MUST 使用 `@pixi/*` 包的类型定义，不依赖隐式 `any`
- 枚举和常量 MUST 使用 `const enum` 或 `as const` 定义，避免运行时开销
- 泛型 MUST 用于可复用的工具函数和组件，确保类型推导的完整性

**理由**: PixiJS API 复杂且类型层级深，缺乏类型保护会导致运行时错误难以定位，TypeScript 严格模式是第一道防线。

### IV. 渲染一致性 (Rendering Consistency)

跨浏览器和设备的渲染结果 MUST 保持视觉一致性。

- MUST 在项目支持的最低规格设备上进行基准测试，定义最低可接受帧率
- WebGL 不可用时 MUST 有 Canvas 2D 回退方案，并记录降级行为
- 文字渲染 MUST 使用 PixiJS 的 `BitmapText` 或预渲染策略，避免跨平台字体差异
- 坐标系和分辨率 MUST 通过 `resolution` 和 `autoDensity` 统一管理，支持高 DPI 屏幕
- 颜色值 MUST 使用统一格式（十六进制数字或 `Color` 类），禁止混用字符串和数字格式

**理由**: 用户在不同设备和浏览器上的体验不一致会直接导致可用性问题，且图形渲染的跨平台差异往往在开发后期才暴露。

### V. 资源管理 (Resource Management)

纹理、音频、着色器等资源的加载、缓存和释放 MUST 遵循显式生命周期管理。

- 资源加载 MUST 使用 `Assets` 类统一管理，禁止分散的 `Loader` 调用
- 纹理和精灵表（Spritesheet）MUST 在使用前预加载，禁止渲染时同步加载
- 场景切换时 MUST 显式释放不再使用的纹理和显示对象，防止 GPU 内存泄漏
- 资源路径 MUST 使用常量或配置文件定义，禁止在代码中硬编码相对路径
- 大型资源 MUST 支持渐进式加载，提供加载进度反馈

**理由**: GPU 内存有限且不会自动回收，资源泄漏在图形应用中是常见的崩溃源，必须从架构层面管控。

### VI. 可测试性 (Testability)

所有游戏逻辑和渲染组件 MUST 可在无浏览器环境下进行单元测试。

- 游戏逻辑 MUST 与渲染逻辑分离，纯逻辑部分不依赖 PixiJS 运行时
- 显示对象的创建 MUST 通过工厂函数，便于在测试中替换为 Mock
- 状态管理 MUST 使用可序列化的数据结构，支持状态快照对比测试
- MUST 提供最小化的 PixiJS Application Mock，用于集成测试
- 关键交互流程 MUST 有端到端测试覆盖（如使用 Playwright 或 Puppeteer）

**理由**: 图形代码的可测试性差是业界普遍问题，提前在架构层面做可测试性设计，能显著降低回归风险。

### VII. 简洁性 (Simplicity)

遵循 YAGNI 原则，只实现当前需求明确要求的功能。

- 禁止为假设的未来需求创建抽象层或钩子点
- 优先使用 PixiJS 内置能力，不引入不必要的第三方库
- 代码行数超过 300 行的类 MUST 有拆分计划或重构理由
- 配置项 MUST 有合理的默认值，仅在确实需要时才暴露配置接口
- 新增依赖 MUST 经过必要性评审：该功能是否可通过现有依赖或少量代码实现

**理由**: 图形应用的代码量增长迅速，过度设计会导致理解成本和维护成本指数级上升，简洁是可持续开发的前提。

## 技术约束

### 技术栈

- **语言**: TypeScript（strict mode）
- **渲染引擎**: PixiJS（最新稳定版本）
- **构建工具**: Vite（推荐）或 Webpack
- **包管理**: npm 或 pnpm
- **代码规范**: ESLint + Prettier，配置 MUST 与 TypeScript strict mode 兼容
- **版本控制**: Git，遵循 Conventional Commits 规范

### 浏览器兼容性

- MUST 支持主流浏览器最近两个大版本（Chrome、Firefox、Safari、Edge）
- 移动端浏览器 MUST 作为一等公民对待
- MUST 在项目文档中明确标注最低支持的浏览器版本

### 性能基准

- 桌面端目标：60 FPS（帧时间 ≤ 16.67ms）
- 桌面端最低：≥ 55 FPS（帧时间 ≤ 18.2ms），帧时间波动 MUST ≤ ±3.33ms
- 移动端目标：30 FPS 最低，60 FPS 理想
- 首屏加载时间 MUST < 3 秒（中等网络条件）
- 内存占用 MUST < 200MB（桌面端典型场景）

## 开发工作流

### 代码审查

- 所有变更 MUST 通过 Pull Request 提交，至少一人审查通过方可合并
- PR 描述 MUST 包含变更原因、影响范围和测试方法
- 涉及渲染管线或性能的变更 MUST 附带性能对比数据

### 测试策略

- 纯逻辑代码：单元测试覆盖率 MUST ≥ 80%
- 渲染组件：集成测试覆盖关键渲染路径
- 交互流程：端到端测试覆盖核心用户操作
- 性能回归：关键场景 MUST 有自动化性能基准测试

### 版本管理

- 遵循语义化版本（SemVer）：MAJOR.MINOR.PATCH
- MAJOR：破坏性 API 变更
- MINOR：向后兼容的功能新增
- PATCH：Bug 修复和文档更新
- 每个版本 MUST 有对应的 CHANGELOG 条目

## Governance

本宪章是项目所有开发实践的最高准则，当其他文档或实践与本宪章冲突时，以本宪章为准。

- 修订流程：任何原则的修改 MUST 提交书面提案，包含修改理由、影响分析和迁移计划
- 合规审查：所有 PR 审查 MUST 验证是否符合本宪章的原则
- 复杂性豁免：当某项设计违反简洁性原则时，MUST 在实现计划的复杂性追踪表中记录理由和被拒绝的简化方案
- 版本策略：宪章版本遵循语义化版本规则，重大原则变更递增 MAJOR，新增原则递增 MINOR，措辞修正递增 PATCH

**Version**: 1.0.0 | **Ratified**: 2026-04-11 | **Last Amended**: 2026-04-11
