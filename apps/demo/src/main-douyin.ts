/**
 * Douyin Mini Game Entry
 * Auto-generated - Do not edit directly
 */
import { GameApplication } from '@ksgames26/core';
import { DouyinAdapter } from '@ksgames26/platform-douyin';
import { initGame } from './game-init';

async function main() {
  const adapter = new DouyinAdapter();

  const game = new GameApplication();
  await game.init({
    platformAdapter: adapter,
    debug: false,
  });

  // Initialize user game
  await initGame(game, adapter);

  console.log('[Douyin] Game initialized');
}

main().catch(console.error);
