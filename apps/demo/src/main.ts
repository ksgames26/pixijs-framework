import { GameApplication, GameEvents } from '@ksgames26/core';
import { Text, Container } from 'pixi.js';

async function main() {
  // 创建游戏应用实例
  const game = new GameApplication();

  // 初始化游戏
  await game.init({
    debug: true,
    backgroundColor: 0x1a1a2e,
  });

  // 将画布添加到页面
  document.body.appendChild(game.pixiApp.canvas);

  // 创建游戏场景
  const scene = new Container();

  // 创建标题文本
  const text = new Text({
    text: 'Hello PixiJS Game Framework!',
    style: {
      fill: 0xffffff,
      fontSize: 32,
      fontFamily: 'Arial',
      fontWeight: 'bold',
    },
  });
  text.anchor.set(0.5);
  scene.addChild(text);

  // 添加到舞台
  game.pixiApp.stage.addChild(scene);

  // 居中显示，响应 resize 事件
  function centerText(width: number, height: number) {
    scene.position.set(width / 2, height / 2);
  }

  // 初始居中
  const { width, height } = game.screen.dimensions;
  centerText(width, height);

  // 监听屏幕 resize 事件自动重定位
  game.events.on(GameEvents.SCREEN_RESIZE, (w: unknown, h: unknown) => {
    centerText(w as number, h as number);
  });

  console.log('[Demo] Game framework initialized successfully!');
}

main().catch(console.error);
