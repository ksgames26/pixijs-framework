import { Module } from '@ksgames26/core';
import { Container } from 'pixi.js';

/**
 * UI tier module.
 * Manages UI layers that render above game content.
 *
 * Note: For layout functionality, install @ksgames26/layout separately.
 *
 * @example
 * ```typescript
 * import { UITier } from '@ksgames26/ui';
 * import { Layout, initLayout } from '@ksgames26/layout';
 * import { Layout as PixiLayout } from '@pixi/layout';
 *
 * // Initialize layout system
 * initLayout(PixiLayout);
 *
 * const ui = new UITier();
 * app.registerModule(ui);
 *
 * // Create a UI layer with layout
 * const menuLayer = ui.addLayer('menu', 10);
 * const layout = new Layout({ direction: 'column', gap: 10 });
 * layout.init(PixiLayout);
 * menuLayer.addChild(layout);
 * ```
 */
export class UITier extends Module {
  readonly name = 'ui';
  readonly version = '0.1.0';

  /** UI root container (always above game content) */
  readonly root = new Container();

  /** Named UI layers */
  private layers = new Map<string, Container>();

  override onEnable(): Promise<void> {
    // Place UI root above all game content
    this.app.pixiApp.stage.addChild(this.root);
    this.root.zIndex = 9999;
    this.root.sortableChildren = true;

    return super.onEnable();
  }

  /**
   * Add a named UI layer at the specified z-index.
   */
  addLayer(name: string, zIndex: number): Container {
    if (this.layers.has(name)) {
      return this.layers.get(name)!;
    }

    const layer = new Container();
    layer.label = name;
    layer.zIndex = zIndex;
    this.root.addChild(layer);
    this.layers.set(name, layer);
    return layer;
  }

  /**
   * Get a UI layer by name.
   */
  getLayer(name: string): Container | undefined {
    return this.layers.get(name);
  }

  /**
   * Remove a UI layer.
   */
  removeLayer(name: string): void {
    const layer = this.layers.get(name);
    if (layer) {
      this.root.removeChild(layer);
      layer.destroy({ children: true });
      this.layers.delete(name);
    }
  }

  /**
   * Add an element to a specific UI layer.
   */
  addToLayer(layerName: string, element: Container): void {
    const layer = this.layers.get(layerName);
    if (!layer) {
      throw new Error(`[UITier] Layer "${layerName}" not found`);
    }
    layer.addChild(element);
  }

  override onDisable(): void {
    this.root.removeFromParent();
    super.onDisable();
  }

  override onDestroy(): void {
    for (const name of [...this.layers.keys()]) {
      this.removeLayer(name);
    }
    this.root.destroy({ children: true });
    super.onDestroy();
  }
}
