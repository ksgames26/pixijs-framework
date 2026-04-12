# 小游戏平台发布指南

## 快速发布

### 一键发布

```bash
# 发布微信小游戏
pnpm release:wechat

# 发布抖音小游戏
pnpm release:douyin

# 发布所有平台
pnpm release:all
```

## 单个 Bundle 构建

发布版本会自动打包成**单个 JS 文件**，方便小游戏平台部署：

```
dist-wechat/
├── game.js          # 单个 Bundle (包含所有代码)
├── game.json        # 小游戏配置
└── project.config.json  # 微信开发者工具配置 (仅微信)
```

### 构建配置

使用 Rollup 的 `inlineDynamicImports` 选项将所有代码内联到单个文件：

```typescript
// vite.config.wechat.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        format: 'cjs',
        entryFileNames: 'game.js',
        inlineDynamicImports: true,  // 打包成单个文件
        manualChunks: undefined,      // 禁用代码分割
      },
      external: [],  // 所有依赖打包进来
    },
    minify: 'terser',  // 启用压缩
  },
});
```

## 包体积分析

```bash
# 分析微信包体积
pnpm analyze:wechat

# 分析抖音包体积
pnpm analyze:douyin

# 或在指定 app 目录
node scripts/analyze-bundle.js wechat apps/my-game
```

输出示例：

```
📦 微信小游戏 包体积分析

📁 文件列表:
------------------------------------------------------------
game.js                         524.68 KB [主包]
game.json                           188 B
------------------------------------------------------------
总计:                              524.87 KB

📊 限制检查:
✅ 主包大小: 524.68 KB / 4.00 MB
✅ 总包大小: 524.87 KB / 20.00 MB
```

## 平台限制

| 平台 | 主包限制 | 总包限制 | 单文件限制 |
|------|----------|----------|------------|
| 微信小游戏 | 4 MB | 20 MB | 2 MB |
| 抖音小游戏 | 4 MB | 16 MB | 2 MB |

## 分包策略（可选）

如果主包超过 4MB，需要开启分包：

```json
// game.json
{
  "subpackages": [
    {
      "name": "level1",
      "root": "levels/level1/",
      "pages": ["index.js"]
    },
    {
      "name": "assets",
      "root": "assets/"
    }
  ]
}
```

修改构建配置支持分包：

```typescript
// vite.config.wechat.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        // 禁用 inlineDynamicImports，启用代码分割
        inlineDynamicImports: false,
        manualChunks: {
          // 将特定模块分到不同 chunk
          'level1': ['./src/levels/level1/index.ts'],
        },
      },
    },
  },
});
```

## 发布流程

### 1. 构建

```bash
cd apps/demo

# 构建微信版本
pnpm build:wechat

# 输出: dist-wechat/game.js (单个 bundle)
```

### 2. 分析包体积

```bash
node ../../scripts/analyze-bundle.js wechat
```

### 3. 在微信开发者工具中打开

1. 打开微信开发者工具
2. 选择「小游戏」项目类型
3. 导入 `apps/demo/dist-wechat` 目录
4. 填入 AppID 或使用测试号

### 4. 上传发布

在微信开发者工具中：
- 点击「上传」按钮
- 填写版本号和项目备注
- 上传后在微信公众平台提交审核

## 优化建议

### 减少包体积

1. **启用 Gzip 压缩**
   ```bash
   # 构建时自动启用 terser 压缩
   pnpm build:wechat
   ```

2. **移除未使用的代码**
   ```typescript
   // vite.config.ts
   build: {
     terserOptions: {
       compress: {
         dead_code: true,
         unused: true,
       },
     },
   }
   ```

3. **外部资源加载**
   - 图片/音频使用远程 CDN
   - 配置文件动态加载

4. **Tree Shaking**
   - 只导入需要的模块
   - 使用 `import type` 避免引入类型定义

### 代码分割示例

对于大型游戏，建议按场景分割：

```typescript
// main-wechat.ts
async function loadLevel(levelId: string) {
  // 动态导入，按需加载
  const level = await import(`./levels/${levelId}.ts`);
  return level.default;
}
```

## 多平台适配器自动引入

不同平台会自动引入对应的 Adapter：

- **微信**: `import { WechatAdapter } from '@ksgames26/platform-wechat'`
- **抖音**: `import { DouyinAdapter } from '@ksgames26/platform-douyin'`

用户代码保持平台无关：

```typescript
// src/game-init.ts
import type { GameApplication, PlatformAdapter } from '@ksgames26/core';

export async function initGame(
  game: GameApplication,
  adapter: PlatformAdapter
): Promise<void> {
  // 使用 adapter 的平台 API
  const info = adapter.getSystemInfo();
  console.log(`Platform: ${info.platform}`);

  // 游戏逻辑...
}
```

## Troubleshooting

### 构建失败

```bash
# 清理缓存后重试
rm -rf node_modules/.vite
cd apps/demo
pnpm build:wechat
```

### 包体积过大

```bash
# 分析具体依赖
npx vite-bundle-visualizer

# 或使用 rollup 分析
npx rollup-plugin-analyzer dist-wechat/game.js
```

### 微信开发者工具报错

1. 确保 `game.js` 存在且不为空
2. 检查 `game.json` 配置正确
3. 使用「详情」→「本地设置」→「调试基础库」选择最新版本
