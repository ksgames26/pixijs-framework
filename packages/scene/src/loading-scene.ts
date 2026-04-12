import { Text, Graphics } from 'pixi.js';
import { Scene } from './scene';

/**
 * Built-in loading scene.
 * Automatically displayed when scene resource loading exceeds the threshold.
 * Developers can customize by registering a scene with name '__loading__'.
 */
export class LoadingScene extends Scene {
  override readonly name = '__loading__';
  override readonly assets = [];

  private progressBar!: Graphics;
  private progressText!: Text;
  private bg!: Graphics;

  override async onEnter(): Promise<void> {
    const width = 800;
    const height = 600;

    // Semi-transparent background
    this.bg = new Graphics();
    this.bg.rect(0, 0, width, height).fill({ color: 0x000000, alpha: 0.7 });
    this.stage.addChild(this.bg);

    // Progress bar background
    const barWidth = 300;
    const barHeight = 20;
    const barX = (width - barWidth) / 2;
    const barY = height / 2;

    const barBg = new Graphics();
    barBg.rect(barX, barY, barWidth, barHeight).fill({ color: 0x333333 });
    this.stage.addChild(barBg);

    // Progress bar fill
    this.progressBar = new Graphics();
    this.stage.addChild(this.progressBar);

    // Progress text
    this.progressText = new Text({
      text: 'Loading... 0%',
      style: { fill: 'white', fontSize: 16, fontFamily: 'Arial' },
    });
    this.progressText.anchor.set(0.5);
    this.progressText.position.set(width / 2, barY - 30);
    this.stage.addChild(this.progressText);
  }

  /**
   * Update progress display.
   */
  updateProgress(percent: number): void {
    const barWidth = 300;
    const barHeight = 20;
    const barX = (800 - barWidth) / 2;
    const barY = 600 / 2;

    this.progressBar.clear();
    this.progressBar
      .rect(barX, barY, barWidth * (percent / 100), barHeight)
      .fill({ color: 0x4caf50 });
    this.progressText.text = `Loading... ${Math.round(percent)}%`;
  }
}
