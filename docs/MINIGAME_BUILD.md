# 小游戏平台构建指南

本框架支持构建到微信小游戏和抖音小游戏平台。

## 快速开始

### 1. 准备游戏初始化文件

在 `src/game-init.ts` 中编写平台无关的游戏逻辑：

```typescript
import type { GameApplication, PlatformAdapter } from '@ksgames26/core';

export async function initGame(
  game: GameApplication,
  adapter: PlatformAdapter
): Promise<void> {
  // 你的游戏初始化代码
  console.log('[Game] Initializing...');

  // 框架已自动初始化，直接使用 game.pixiApp
  const sprite = game.factory.createSprite('texture/path');
  game.pixiApp.stage.addChild(sprite);
}
```

### 2. 构建命令

在任意 app 目录下运行：

```bash
# 构建微信小游戏
cd apps/demo
pnpm build:wechat

# 构建抖音小游戏
pnpm build:douyin

# 构建所有平台
pnpm build:all
```

或在根目录：

```bash
# 全局构建命令
pnpm build:wechat apps/demo
pnpm build:douyin apps/demo
```

### 3. 输出目录

- **Web**: `apps/demo/dist/` - 标准 Web 构建
- **微信**: `apps/demo/dist-wechat/` - 微信小游戏
- **抖音**: `apps/demo/dist-douyin/` - 抖音小游戏

### 4. 使用开发者工具打开

**微信小游戏**:
1. 打开微信开发者工具
2. 选择「小游戏」项目类型
3. 导入 `apps/demo/dist-wechat` 目录
4. 填入测试 appid 或选择「测试号」

**抖音小游戏**:
1. 打开抖音开发者工具
2. 选择「小游戏」项目类型
3. 导入 `apps/demo/dist-douyin` 目录

## 项目结构

```
apps/demo/
├── src/
│   ├── main.ts           # Web 入口
│   ├── main-wechat.ts    # 微信小游戏入口（自动生成）
│   ├── main-douyin.ts    # 抖音小游戏入口（自动生成）
│   └── game-init.ts      # 游戏初始化逻辑（用户编写）
├── vite.config.ts        # Web 配置
├── vite.config.wechat.ts # 微信小游戏配置
├── vite.config.douyin.ts # 抖音小游戏配置
├── game.json             # 小游戏配置
└── project.config.json   # 微信开发者工具配置
```

## 平台适配器自动引入

无需手动处理平台差异：

- **微信**: 自动引入 `WechatAdapter`，使用 `wx.*` API
- **抖音**: 自动引入 `DouyinAdapter`，使用 `tt.*` API
- **Web**: 使用内置 `WebAdapter`

## 注意事项

### 分包策略

小游戏平台有包体限制（微信 20MB / 抖音 16MB），建议：

1. 主包只包含核心代码
2. 资源使用远程加载
3. 代码按需加载（动态 import）

在 `game.json` 中配置分包：

```json
{
  "subpackages": [
    {
      "name": "level1",
      "root": "levels/level1/"
    }
  ]
}
```

### 资源路径

小游戏平台使用本地存储路径：

```typescript
// 自动处理，无需修改代码
const path = adapter.resolvePath('./assets/sprite.png');
// 微信: wx.env.USER_DATA_PATH/assets/sprite.png
```

### 调试

```bash
# 开发模式（Web）
pnpm dev

# 生产构建后在小游戏开发者工具中调试
```

## 创建新的小游戏项目

```bash
# 复制 demo 结构
cp -r apps/demo apps/my-minigame

# 修改 package.json 中的 name
# 编写 src/game-init.ts
# 运行构建
cd apps/my-minigame
pnpm build:wechat
```
