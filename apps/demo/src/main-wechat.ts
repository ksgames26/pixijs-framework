/**
 * WeChat Mini Game Entry
 * Auto-generated - Do not edit directly
 */
import 'pixi.js/unsafe-eval'; // Polyfill for unsafe eval in mini game platform
import { inject } from '@ksgames26/platform-wechat';
inject(); // Ensure adapter globals are injected before app startup
import { GameApplication } from '@ksgames26/core';
import { WechatAdapter } from '@ksgames26/platform-wechat';
import { initGame } from './game-init';

async function main() {
  const adapter = new WechatAdapter();

  const game = new GameApplication();
  await game.init({
    platformAdapter: adapter,
    canvas: adapter.createCanvas(),
    debug: false,
  });

  // Initialize user game
  await initGame(game, adapter);

  console.log('[WeChat] Game initialized');
}

main().catch(console.error);
