import { GameApplication } from '@ksgames26/core';
import { Text, Container, Graphics } from 'pixi.js';

async function main() {
  // 创建游戏应用实例
  const game = new GameApplication();

  // 初始化游戏
  await game.init({
    debug: true,
    backgroundColor: 0x1a1a2e,
  });

  // 将画布添加到页面
  const appElement = document.getElementById('app');
  if (appElement) {
    appElement.appendChild(game.pixiApp.canvas);
  }

  // 创建游戏场景
  const scene = new Container();

  // 获取屏幕尺寸
  const { width, height } = game.screen.dimensions;

  // 创建背景
  const bg = new Graphics();
  bg.rect(0, 0, width, height);
  bg.fill({ color: 0x16213e });
  scene.addChild(bg);

  // 创建标题文本
  const title = new Text({
    text: '我的第一个 PixiJS 游戏',
    style: {
      fill: 0xffffff,
      fontSize: 32,
      fontFamily: 'Arial',
      fontWeight: 'bold',
    },
  });
  title.anchor.set(0.5);
  title.position.set(width / 2, height / 2 - 50);
  scene.addChild(title);

  // 创建副标题
  const subtitle = new Text({
    text: '基于 @ksgames26 框架',
    style: {
      fill: 0xaaaaaa,
      fontSize: 18,
      fontFamily: 'Arial',
    },
  });
  subtitle.anchor.set(0.5);
  subtitle.position.set(width / 2, height / 2 + 20);
  scene.addChild(subtitle);

  // 添加到舞台
  game.pixiApp.stage.addChild(scene);

  // 响应窗口大小变化
  game.pixiApp.ticker.add(() => {
    const { width, height } = game.screen.dimensions;

    // 更新背景大小
    bg.clear();
    bg.rect(0, 0, width, height);
    bg.fill({ color: 0x16213e });

    // 更新文本位置
    title.position.set(width / 2, height / 2 - 50);
    subtitle.position.set(width / 2, height / 2 + 20);
  });

  console.log('[My Game] 游戏初始化成功！');
}

main().catch(console.error);
