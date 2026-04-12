/**
 * WeChat Mini Game Entry
 * Auto-generated - Do not edit directly
 */
import { GameApplication } from '@ksgames26/core';
import { WechatAdapter } from '@ksgames26/platform-wechat';
import { initGame } from './game-init';

async function main() {
  const adapter = new WechatAdapter();

  const game = new GameApplication();
  await game.init({
    platformAdapter: adapter,
    debug: false,
  });

  // Initialize user game
  await initGame(game, adapter);

  console.log('[WeChat] Game initialized');
}

main().catch(console.error);
