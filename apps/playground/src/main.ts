import { GameApplication } from '@ksgames26/core';
import { Text, Container } from 'pixi.js';

async function main() {
  const game = new GameApplication();

  await game.init({
    debug: true,
    backgroundColor: 0x1a1a2e,
  });

  // 将画布添加到页面
  document.body.appendChild(game.pixiApp.canvas);

  // 创建场景
  const scene = new Container();

  // 创建文本
  const text = new Text({
    text: 'Playground - 实验场',
    style: {
      fill: 0xffffff,
      fontSize: 24,
      fontFamily: 'Arial',
    },
  });
  text.anchor.set(0.5);
  scene.addChild(text);

  game.pixiApp.stage.addChild(scene);

  // 居中显示
  function centerText() {
    const { width, height } = game.screen.dimensions;
    scene.position.set(width / 2, height / 2);
  }
  centerText();

  game.pixiApp.ticker.add(() => {
    centerText();
  });

  console.log('[Playground] Initialized');
}

main().catch(console.error);
