import { Module } from '@ksgames26/core';
import { Container, Text, Graphics } from 'pixi.js';

/**
 * Debug overlay module.
 * Displays FPS, memory usage, resource list, and scene hierarchy.
 * Only active in development mode; fully stripped in production builds.
 */
export class DebugOverlay extends Module {
  readonly name = 'debug';
  readonly version = '0.1.0';

  private overlay = new Container();
  private bg!: Graphics;
  private fpsText!: Text;
  private memoryText!: Text;
  private resourceText!: Text;
  private sceneTreeText!: Text;
  private _visible = false;
  private frameCount = 0;
  private lastFpsUpdate = 0;
  private currentFps = 0;

  get visible(): boolean {
    return this._visible;
  }

  override onEnable(): Promise<void> {
    this.setupOverlay();
    this.app.pixiApp.ticker.add(this.onTick);
    return super.onEnable();
  }

  override onDisable(): void {
    this.app.pixiApp.ticker.remove(this.onTick);
    this.overlay.removeFromParent();
    super.onDisable();
  }

  /**
   * Toggle debug panel visibility.
   */
  toggle(): void {
    this._visible = !this._visible;
    this.overlay.visible = this._visible;

    if (this._visible) {
      this.app.pixiApp.stage.addChild(this.overlay);
    } else {
      this.overlay.removeFromParent();
    }
  }

  /**
   * Refresh all debug data.
   */
  refresh(): void {
    this.updateResourceInfo();
    this.updateSceneTree();
  }

  private setupOverlay(): void {
    const width = 320;
    const height = 400;

    // Background panel
    this.bg = new Graphics();
    this.bg.rect(0, 0, width, height).fill({ color: 0x000000, alpha: 0.8 });
    this.overlay.addChild(this.bg);

    // FPS text
    this.fpsText = new Text({
      text: 'FPS: --',
      style: { fill: 0x00ff00, fontSize: 14, fontFamily: 'monospace' },
    });
    this.fpsText.position.set(10, 10);
    this.overlay.addChild(this.fpsText);

    // Memory text
    this.memoryText = new Text({
      text: 'Memory: --',
      style: { fill: 0xffffff, fontSize: 14, fontFamily: 'monospace' },
    });
    this.memoryText.position.set(10, 30);
    this.overlay.addChild(this.memoryText);

    // Resource list
    this.resourceText = new Text({
      text: 'Resources: --',
      style: { fill: 0xcccccc, fontSize: 12, fontFamily: 'monospace' },
    });
    this.resourceText.position.set(10, 60);
    this.overlay.addChild(this.resourceText);

    // Scene tree
    this.sceneTreeText = new Text({
      text: 'Scene: --',
      style: { fill: 0xcccccc, fontSize: 12, fontFamily: 'monospace' },
    });
    this.sceneTreeText.position.set(10, 200);
    this.overlay.addChild(this.sceneTreeText);

    this.overlay.visible = false;
  }

  private onTick = (): void => {
    if (!this._visible) return;

    this.frameCount++;
    const now = Date.now();
    if (now - this.lastFpsUpdate >= 1000) {
      this.currentFps = this.frameCount;
      this.frameCount = 0;
      this.lastFpsUpdate = now;

      this.fpsText.text = `FPS: ${this.currentFps}`;
      this.fpsText.style.fill = this.currentFps >= 55 ? 0x00ff00 : this.currentFps >= 30 ? 0xffaa00 : 0xff0000;

      this.updateMemoryInfo();
      this.updateResourceInfo();
      this.updateSceneTree();
    }
  };

  private updateMemoryInfo(): void {
    const perf = performance as unknown as { memory?: { usedJSHeapSize: number } };
    if (perf.memory) {
      const mb = (perf.memory.usedJSHeapSize / 1024 / 1024).toFixed(1);
      this.memoryText.text = `Memory: ${mb} MB`;
    } else {
      this.memoryText.text = 'Memory: N/A';
    }
  }

  private updateResourceInfo(): void {
    const assetManager = this.app.getModule<import('@ksgames26/assets').AssetManager>('assets');
    if (!assetManager) {
      this.resourceText.text = 'Resources: AssetManager not loaded';
      return;
    }

    const info = assetManager.getDebugInfo();
    const lines = info.map((a: { key: string; type: string; state: string; refCount: number; size: number }) => {
      const state = a.state;
      const ref = a.refCount;
      const size = (a.size / 1024).toFixed(1);
      return `${a.key} [${a.type}] ${state} ref:${ref} ${size}KB`;
    });

    this.resourceText.text = `Resources (${info.length}):\n${lines.join('\n')}`;
  }

  private updateSceneTree(): void {
    const sceneManager = this.app.getModule<import('@ksgames26/scene').SceneManager>('scene');
    const current = sceneManager?.current;
    if (!current) {
      this.sceneTreeText.text = 'Scene: None active';
      return;
    }

    this.sceneTreeText.text = `Scene: ${current.name}\nChildren: ${current.stage.children.length}`;
  }
}
