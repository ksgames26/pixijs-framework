#!/usr/bin/env node
/**
 * npm 发布脚本
 *
 * 支持命令：
 *   status    - 查看所有包的发布状态
 *   publish   - 构建并发布（标准 changeset 流程）
 *   alpha     - 构建并发布 alpha 版本
 *   beta      - 构建并发布 beta 版本
 *   canary    - 构建并发布 canary 版本（基于 commit hash）
 *   dry-run   - 预览发布内容（不实际发布）
 *
 * 用法：
 *   node scripts/release-npm.js <command>
 *   node scripts/release-npm.js status
 *   node scripts/release-npm.js publish
 *   node scripts/release-npm.js alpha
 */

import { execSync } from 'child_process';
import { readFileSync, readdirSync, statSync } from 'fs';
import path, { resolve, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const PACKAGES_DIR = join(ROOT, 'packages');

// ── 工具函数 ──────────────────────────────────────────────────────────

function log(msg) {
  console.log(msg);
}

function error(msg) {
  console.error(`\x1b[31m${msg}\x1b[0m`);
}

function success(msg) {
  console.log(`\x1b[32m${msg}\x1b[0m`);
}

function warn(msg) {
  console.log(`\x1b[33m${msg}\x1b[0m`);
}

function info(msg) {
  console.log(`\x1b[36m${msg}\x1b[0m`);
}

function run(cmd, options = {}) {
  try {
    return execSync(cmd, {
      encoding: 'utf-8',
      cwd: ROOT,
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options,
    });
  } catch (err) {
    if (!options.allowFail) throw err;
    return null;
  }
}

function runQuiet(cmd) {
  return run(cmd, { silent: true, allowFail: true })?.trim() || '';
}

// ── 读取包信息 ────────────────────────────────────────────────────────

function getPublishablePackages() {
  const dirs = readdirSync(PACKAGES_DIR).filter((d) =>
    statSync(join(PACKAGES_DIR, d)).isDirectory()
  );

  return dirs
    .map((dir) => {
      const pkgPath = join(PACKAGES_DIR, dir, 'package.json');
      try {
        const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
        if (pkg.private) return null;
        return {
          name: pkg.name,
          version: pkg.version,
          dir,
          pkgPath,
          distDir: join(PACKAGES_DIR, dir, 'dist'),
        };
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

// ── 前置检查 ──────────────────────────────────────────────────────────

function checkNpmAuth() {
  const whoami = runQuiet('npm whoami 2>&1');
  if (!whoami || whoami.toLowerCase().includes('error')) {
    error('\n未检测到 npm 登录状态。请先执行:');
    error('  npm login\n');
    process.exit(1);
  }
  info(`npm 账号: ${whoami}`);
  return whoami;
}

function checkGitStatus() {
  const status = runQuiet('git status --porcelain');
  if (status) {
    warn('工作区有未提交的更改:');
    status.split('\n').forEach((line) => {
      if (line) warn(`  ${line}`);
    });
    console.log();
  }

  const branch = runQuiet('git rev-parse --abbrev-ref HEAD');
  info(`当前分支: ${branch}`);

  return { hasChanges: !!status, branch };
}

function checkDistExists(packages) {
  const missing = packages.filter((pkg) => {
    try {
      statSync(pkg.distDir);
      return false;
    } catch {
      return true;
    }
  });

  if (missing.length > 0) {
    warn(`以下包缺少构建产物 (dist/)，将先执行构建:`);
    missing.forEach((pkg) => warn(`  - ${pkg.name}`));
    console.log();
    return false;
  }
  return true;
}

// ── 发布命令 ──────────────────────────────────────────────────────────

function cmdStatus() {
  log('\n\x1b[1m═══════════════════════════════════════');
  log('  npm 发布状态');
  log('═══════════════════════════════════════\x1b[0m\n');

  // 检查 npm 登录
  const whoami = runQuiet('npm whoami 2>/dev/null');
  if (whoami) {
    success(`npm 登录: ${whoami}`);
  } else {
    error('npm 登录: 未登录');
  }

  // 检查 git
  const branch = runQuiet('git rev-parse --abbrev-ref HEAD');
  info(`当前分支: ${branch}`);
  const gitClean = !runQuiet('git status --porcelain');
  if (gitClean) {
    success('工作区: 干净');
  } else {
    warn('工作区: 有未提交更改');
  }

  console.log();

  // 检查各包状态
  const packages = getPublishablePackages();

  log('\x1b[1m  包名                                本地版本    npm 最新\x1b[0m');
  log('  ─────────────────────────────────────────────────────────');

  for (const pkg of packages) {
    const npmVersion = runQuiet(`npm view ${pkg.name} version 2>/dev/null`);
    const local = pkg.version;
    const remote = npmVersion || '未发布';

    const needsPublish = !npmVersion || local !== npmVersion;
    const marker = needsPublish ? '\x1b[33m ●\x1b[0m' : '\x1b[32m ✓\x1b[0m';

    const nameCol = pkg.name.padEnd(36);
    const localCol = local.padEnd(11);

    log(`  ${marker} ${nameCol} ${localCol} ${remote}`);
  }

  console.log();
  log('  ● 需要发布  ✓ 已是最新');
  console.log();
}

function cmdPublish() {
  log('\n\x1b[1m═══════════════════════════════════════');
  log('  npm 标准发布 (changeset 流程)');
  log('═══════════════════════════════════════\x1b[0m\n');

  checkNpmAuth();
  checkGitStatus();

  const packages = getPublishablePackages();
  checkDistExists(packages);

  // Step 1: Build packages only (skip apps)
  info('\n[1/2] 构建所有包...');
  run('turbo run build --filter="./packages/*"');

  // Step 2: Publish via changeset
  info('\n[2/2] 发布到 npm...');
  run('changeset publish');

  success('\n发布完成！');
  log('\n后续步骤:');
  log('  git push --follow-tags');
  console.log();
}

function cmdAlpha() {
  publishWithTag('alpha');
}

function cmdBeta() {
  publishWithTag('beta');
}

function cmdCanary() {
  const shortHash = runQuiet('git rev-parse --short HEAD');
  const timestamp = Date.now();
  const canaryVersion = `0.0.0-canary.${timestamp}.${shortHash}`;

  log('\n\x1b[1m═══════════════════════════════════════');
  log('  npm Canary 发布');
  log('═══════════════════════════════════════\x1b[0m\n');

  info(`canary 版本: ${canaryVersion}`);
  console.log();

  checkNpmAuth();

  const packages = getPublishablePackages();

  info('[1/3] 构建所有包...');
  run('turbo run build --filter="./packages/*"');

  info('\n[2/3] 更新版本号...');
  for (const pkg of packages) {
    const pkgDir = join(PACKAGES_DIR, pkg.dir);
    run(`npm version ${canaryVersion} --no-git-tag-version`, { cwd: pkgDir });
  }

  info('\n[3/3] 发布到 npm (canary tag)...');
  run('pnpm publish -r --tag canary --no-git-checks');

  success('\nCanary 发布完成！');
  console.log();
}

function publishWithTag(tag) {
  const label = tag.toUpperCase();

  log(`\n\x1b[1m═══════════════════════════════════════`);
  log(`  npm ${label} 发布`);
  log(`═══════════════════════════════════════\x1b[0m\n`);

  checkNpmAuth();
  checkGitStatus();

  info('[1/2] 构建所有包...');
  run('turbo run build --filter="./packages/*"');

  info(`\n[2/2] 发布到 npm (${tag} tag)...`);
  run(`pnpm publish -r --tag ${tag} --no-git-checks`);

  success(`\n${label} 发布完成！`);
  console.log();
}

function cmdDryRun() {
  log('\n\x1b[1m═══════════════════════════════════════');
  log('  npm 发布预览 (dry-run)');
  log('═══════════════════════════════════════\x1b[0m\n');

  const packages = getPublishablePackages();
  info(`即将发布 ${packages.length} 个包:\n`);

  for (const pkg of packages) {
    log(`  - ${pkg.name}@${pkg.version}`);
  }

  console.log();
  info('执行 dry-run...\n');
  run('pnpm publish -r --dry-run');

  console.log();
  info('以上为预览内容，未实际发布。');
  console.log();
}

// ── 入口 ──────────────────────────────────────────────────────────────

const command = process.argv[2];

const commands = {
  status: { fn: cmdStatus, desc: '查看所有包的发布状态' },
  publish: { fn: cmdPublish, desc: '标准 changeset 发布流程' },
  alpha: { fn: cmdAlpha, desc: '发布 alpha 版本' },
  beta: { fn: cmdBeta, desc: '发布 beta 版本' },
  canary: { fn: cmdCanary, desc: '发布 canary 版本（基于 commit hash）' },
  'dry-run': { fn: cmdDryRun, desc: '预览发布内容' },
};

function showUsage() {
  log('\n\x1b[1m用法:\x1b[0m  node scripts/release-npm.js <command>\n');
  log('\x1b[1m命令:\x1b[0m');

  const entries = Object.entries(commands);
  for (const [name, { desc }] of entries) {
    log(`  ${name.padEnd(10)} ${desc}`);
  }

  console.log();
  log('\x1b[1m示例:\x1b[0m');
  log('  node scripts/release-npm.js status       # 查看状态');
  log('  node scripts/release-npm.js publish       # 标准发布');
  log('  node scripts/release-npm.js alpha         # 发布 alpha');
  log('  node scripts/release-npm.js dry-run       # 预览');
  console.log();
}

if (!command) {
  showUsage();
  process.exit(0);
}

const cmd = commands[command];
if (!cmd) {
  error(`未知命令: ${command}\n`);
  showUsage();
  process.exit(1);
}

cmd.fn();
