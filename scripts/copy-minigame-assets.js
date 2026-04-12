#!/usr/bin/env node
/**
 * Post-build script for mini game platforms
 * Copies required config files to build output
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const platforms = ['wechat', 'douyin'];

function copyConfigFiles(appDir, platform) {
  const distDir = path.join(appDir, `dist-${platform}`);

  if (!fs.existsSync(distDir)) {
    console.error(`Build output not found: ${distDir}`);
    return;
  }

  // Copy game.json
  const gameJsonSrc = path.join(appDir, 'game.json');
  const gameJsonDest = path.join(distDir, 'game.json');

  if (fs.existsSync(gameJsonSrc)) {
    fs.copyFileSync(gameJsonSrc, gameJsonDest);
    console.log(`✓ Copied game.json to ${platform}`);
  }

  // Copy project.config.json for WeChat
  if (platform === 'wechat') {
    const projectConfigSrc = path.join(appDir, 'project.config.json');
    const projectConfigDest = path.join(distDir, 'project.config.json');

    if (fs.existsSync(projectConfigSrc)) {
      fs.copyFileSync(projectConfigSrc, projectConfigDest);
      console.log(`✓ Copied project.config.json to ${platform}`);
    }
  }

  console.log(`✅ ${platform} build complete!`);
}

// Main
const appPath = process.argv[2] || 'apps/demo';
const appDir = path.resolve(rootDir, appPath);

platforms.forEach((platform) => {
  copyConfigFiles(appDir, platform);
});
