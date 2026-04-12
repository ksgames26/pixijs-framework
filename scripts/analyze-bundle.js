#!/usr/bin/env node
/**
 * Mini Game Bundle Analyzer
 * Analyzes bundle size and provides optimization suggestions
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const PLATFORM_LIMITS = {
  wechat: {
    name: '微信小游戏',
    totalLimit: 20 * 1024 * 1024, // 20MB
    mainPackageLimit: 4 * 1024 * 1024, // 4MB
    singleFileLimit: 2 * 1024 * 1024, // 2MB
  },
  douyin: {
    name: '抖音小游戏',
    totalLimit: 16 * 1024 * 1024, // 16MB
    mainPackageLimit: 4 * 1024 * 1024, // 4MB
    singleFileLimit: 2 * 1024 * 1024, // 2MB
  },
};

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function analyzeBundle(platform, appPath) {
  const limits = PLATFORM_LIMITS[platform];
  const distDir = path.resolve(rootDir, appPath, `dist-${platform}`);

  if (!fs.existsSync(distDir)) {
    console.error(`❌ Build output not found: ${distDir}`);
    console.log(`Run: pnpm --filter ${path.basename(appPath)} build:${platform}`);
    process.exit(1);
  }

  console.log(`\n📦 ${limits.name} 包体积分析\n`);
  console.log('=' .repeat(60));

  // Analyze all files
  const files = fs.readdirSync(distDir);
  let totalSize = 0;
  const fileStats = [];

  for (const file of files) {
    const filePath = path.join(distDir, file);
    const stats = fs.statSync(filePath);

    if (stats.isFile()) {
      totalSize += stats.size;
      fileStats.push({
        name: file,
        size: stats.size,
        isMainBundle: file === 'game.js',
      });
    }
  }

  // Sort by size
  fileStats.sort((a, b) => b.size - a.size);

  // Print file list
  console.log('\n📁 文件列表:');
  console.log('-'.repeat(60));
  for (const { name, size, isMainBundle } of fileStats) {
    const marker = isMainBundle ? ' [主包]' : '';
    const warning = size > limits.singleFileLimit ? ' ⚠️ 超过单文件限制' : '';
    console.log(`${name.padEnd(30)} ${formatSize(size).padStart(10)}${marker}${warning}`);
  }

  console.log('-'.repeat(60));
  console.log(`总计: ${formatSize(totalSize).padStart(38)}`);

  // Check limits
  console.log('\n📊 限制检查:');
  console.log('-'.repeat(60));

  const mainBundle = fileStats.find(f => f.isMainBundle);
  if (mainBundle) {
    const mainBundleOk = mainBundle.size <= limits.mainPackageLimit;
    console.log(
      `${mainBundleOk ? '✅' : '❌'} 主包大小: ${formatSize(mainBundle.size)} / ${formatSize(limits.mainPackageLimit)}`
    );
  }

  const totalOk = totalSize <= limits.totalLimit;
  console.log(
    `${totalOk ? '✅' : '❌'} 总包大小: ${formatSize(totalSize)} / ${formatSize(limits.totalLimit)}`
  );

  // Optimization suggestions
  console.log('\n💡 优化建议:');
  console.log('-'.repeat(60));

  if (mainBundle && mainBundle.size > limits.mainPackageLimit * 0.8) {
    console.log('• 主包接近限制，建议开启代码分包');
    console.log('• 将非核心资源移至远程 CDN');
  }

  if (totalSize > limits.totalLimit * 0.8) {
    console.log('• 总包接近平台限制，建议：');
    console.log('  - 压缩图片资源');
    console.log('  - 移除未使用的代码');
    console.log('  - 使用外部资源加载');
  }

  if (mainBundle && mainBundle.size > 500 * 1024) {
    console.log('• 考虑使用动态导入延迟加载非必要模块');
    console.log('• 检查是否有重复依赖');
  }

  console.log('\n' + '='.repeat(60));

  return {
    platform,
    totalSize,
    mainBundleSize: mainBundle?.size || 0,
    passed: totalSize <= limits.totalLimit && (mainBundle?.size || 0) <= limits.mainPackageLimit,
  };
}

// Main
const platform = process.argv[2];
const appPath = process.argv[3] || 'apps/demo';

if (!platform || !['wechat', 'douyin'].includes(platform)) {
  console.log(`
Usage: node analyze-bundle.js <platform> [app-path]

Platforms:
  wechat    分析微信小游戏包
  douyin    分析抖音小游戏包

Examples:
  node scripts/analyze-bundle.js wechat
  node scripts/analyze-bundle.js wechat apps/my-game
  node scripts/analyze-bundle.js douyin apps/demo
`);
  process.exit(1);
}

const result = analyzeBundle(platform, appPath);
process.exit(result.passed ? 0 : 1);
