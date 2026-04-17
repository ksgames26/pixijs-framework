#!/usr/bin/env node
/**
 * Mini Game Build Script
 * Runs the app-level Vite build for a mini game platform.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const platforms = {
  wechat: '微信小游戏',
  douyin: '抖音小游戏',
};

function showUsage() {
  console.log(`
Usage: node build-minigame.js <platform> [app-path]

Platforms:
  wechat    Build for WeChat Mini Game
  douyin    Build for Douyin Mini Game

Options:
  app-path  Path to app directory (default: apps/demo)

Examples:
  node scripts/build-minigame.js wechat
  node scripts/build-minigame.js wechat apps/my-game
  node scripts/build-minigame.js douyin apps/my-game
`);
}

function runCommand(command, cwd) {
  execSync(command, {
    cwd,
    stdio: 'inherit',
    encoding: 'utf-8',
  });
}

function buildPlatform(platform, appPath) {
  const platformName = platforms[platform];
  if (!platformName) {
    console.error(`Unknown platform: ${platform}`);
    console.log(`Supported platforms: ${Object.keys(platforms).join(', ')}`);
    process.exit(1);
  }

  const appDir = path.resolve(rootDir, appPath);
  const appPackageJsonPath = path.join(appDir, 'package.json');

  if (!fs.existsSync(appPackageJsonPath)) {
    console.error(`App package.json not found: ${appPackageJsonPath}`);
    process.exit(1);
  }

  console.log(`\n🎮 开始构建${platformName}...\n`);
  runCommand(`pnpm run build:${platform}`, appDir);
  console.log(`\n✅ ${platformName}构建完成`);
  console.log(`📁 输出目录: ${path.join(appDir, `dist-${platform}`)}`);
}

const platform = process.argv[2];
const appPath = process.argv[3] || 'apps/demo';

if (!platform) {
  showUsage();
  process.exit(1);
}

buildPlatform(platform, appPath);
