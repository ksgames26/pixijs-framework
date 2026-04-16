/**
 * Game Initialization for Mini Game Platforms
 * This file contains platform-agnostic game logic
 */
import { Text, Container } from 'pixi.js';
import type { GameApplication } from '@ksgames26/core';
import type { PlatformAdapter } from '@ksgames26/core';

export async function initGame(
  game: GameApplication,
  _adapter: PlatformAdapter
): Promise<void> {
  console.log('[Game] Initializing...');

  // Create game scene
  const scene = new Container();

  // Create title text
  const title = new Text({
    text: 'Mini Game Running!',
    style: {
      fill: 0xffffff,
      fontSize: 32,
      fontFamily: 'Arial',
      fontWeight: 'bold',
    },
  });
  title.anchor.set(0.5);
  scene.addChild(title);

  console.log('[Game] Title text created');

  // Add to stage
  game.pixiApp.stage.addChild(scene);

  // Center on screen
  function centerContent() {
    const { width, height } = game.screen.dimensions;
    scene.position.set(width / 2, height / 2);
  }
  centerContent();

  // Handle resize
  game.pixiApp.ticker.add(() => {
    centerContent();
  });

  console.log('[Game] Initialization complete');
}
