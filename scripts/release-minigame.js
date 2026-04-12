#!/usr/bin/env node
/**
 * Mini Game Release Script
 * Builds and analyzes for production release
 */

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const platforms = {
  wechat: { name: '微信小游戏', color: '\x1b[32m' },
  douyin: { name: '抖音小游戏', color: '\x1b[36m' },
};

function log(message) {
  console.log(message);
}

function runCommand(command, options = {}) {
  try {
    return execSync(command, { encoding: 'utf-8', stdio: 'inherit', ...options });
  } catch (error) {
    if (!options.ignoreError) {
      throw error;
    }
  }
}

async function release(platform, appPath) {
  const config = platforms[platform];

  log(`\n${config.color}═══════════════════════════════════════`);
  log(`🎮 开始构建 ${config.name} Release 版本`);
  log(`═══════════════════════════════════════\x1b[0m\n`);

  const appDir = path.resolve(process.cwd(), appPath);
  const filter = path.basename(appPath);

  // Step 1: Type check
  log('📋 步骤 1/4: TypeScript 类型检查...');
  runCommand(`pnpm --filter ${filter} typecheck`);

  // Step 2: Build
  log('\n🔨 步骤 2/4: 构建生产版本...');
  runCommand(`pnpm --filter ${filter} build:${platform}`);

  // Step 3: Analyze bundle
  log('\n📊 步骤 3/4: 分析包体积...');
  try {
    runCommand(`node ${path.join(__dirname, 'analyze-bundle.js')} ${platform} ${appPath}`, {
      stdio: 'inherit',
    });
  } catch {
    log('\x1b[33m⚠️  包体积分析失败，但构建已完成\x1b[0m');
  }

  // Step 4: Summary
  log('\n✅ 步骤 4/4: 构建完成！');
  log(`\n📁 输出目录: ${path.join(appDir, `dist-${platform}`)}`);
  log('\n下一步:');
  log(`  1. 打开 ${config.name} 开发者工具`);
  log(`  2. 导入项目: ${path.join(appDir, `dist-${platform}`)}`);
  log(`  3. 测试并上传`);

  log(`\n${config.color}═══════════════════════════════════════\x1b[0m\n`);
}

function showUsage() {
  console.log(`
Usage: node release-minigame.js <platform> [app-path]

Platforms:
  wechat    发布微信小游戏
  douyin    发布抖音小游戏
  all       发布所有平台

Options:
  app-path  应用目录 (默认: apps/demo)

Examples:
  node scripts/release-minigame.js wechat
  node scripts/release-minigame.js wechat apps/my-game
  node scripts/release-minigame.js all apps/demo
`);
}

// Main
const platform = process.argv[2];
const appPath = process.argv[3] || 'apps/demo';

if (!platform) {
  showUsage();
  process.exit(1);
}

if (platform === 'all') {
  for (const p of Object.keys(platforms)) {
    release(p, appPath);
  }
} else if (platforms[platform]) {
  release(platform, appPath);
} else {
  console.error(`❌ 未知平台: ${platform}`);
  console.log(`支持的平台: ${Object.keys(platforms).join(', ')}, all`);
  process.exit(1);
}
