# 发布流程指南

## 快速开始

### 1. 创建变更集

当你完成代码修改后，创建变更集记录版本变更：

```bash
pnpm changeset
```

按提示选择受影响的包和变更类型（major/minor/patch），然后编写变更描述。

### 2. 版本升级

当准备发布时，运行版本升级命令：

```bash
pnpm version
```

这会：
- 根据 changesets 更新所有包的版本号
- 生成/更新 CHANGELOG.md
- 清除已处理的 changeset 文件

### 3. 发布到 npm

```bash
pnpm release
```

这会先构建所有包，然后发布到 npm。

## 常用命令

| 命令 | 说明 |
|------|------|
| `pnpm changeset` | 创建新的变更集 |
| `pnpm version` | 升级版本号并更新 CHANGELOG |
| `pnpm release` | 构建并发布到 npm |
| `pnpm publish:alpha` | 发布 alpha 版本 |
| `pnpm publish:latest` | 发布 latest 版本 |
| `pnpm publish:check` | 预览发布内容（不实际发布） |

## 版本策略

- **major**: 破坏性 API 变更（如移除/重命名接口）
- **minor**: 向后兼容的功能新增
- **patch**: Bug 修复和文档更新

## 发布前检查清单

- [ ] 所有测试通过 (`pnpm test`)
- [ ] 代码已格式化 (`pnpm format`)
- [ ] Lint 无错误 (`pnpm lint`)
- [ ] TypeScript 类型检查通过 (`pnpm typecheck`)
- [ ] 已创建 changeset (`pnpm changeset`)

## GitHub Actions 自动发布

项目已配置 GitHub Actions 工作流：

- **CI** (`.github/workflows/ci.yml`): 每次 PR 和 push 时运行测试和构建
- **Release** (`.github/workflows/release.yml`): 当 changeset 合并到 main 分支时自动创建发布 PR

### 自动发布流程

1. 开发者在功能分支创建 changeset
2. 合并到 main 分支
3. Changeset GitHub Action 创建版本发布 PR
4. 审查并合并版本发布 PR
5. Action 自动发布到 npm

## 手动发布

如需手动发布（不推荐）：

```bash
# 1. 构建
pnpm build

# 2. 发布（需 npm 登录）
pnpm publish -r
```

注意：手动发布不会更新 CHANGELOG，建议使用 `pnpm release`。
