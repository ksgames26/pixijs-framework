import type { DisplayObjectFactory } from '@ksgames26/core';
import type { Texture } from 'pixi.js';

/**
 * Mock display object factory for testing.
 * Returns lightweight mock objects instead of real PixiJS display objects.
 * Satisfies Constitution VI: "Display object creation MUST go through
 * factory functions, making it easy to replace with Mocks in tests."
 */
export class MockDisplayObjectFactory implements DisplayObjectFactory {
  readonly createdSprites: MockSprite[] = [];
  readonly createdContainers: MockContainer[] = [];
  readonly createdGraphics: MockGraphics[] = [];
  readonly createdBitmapTexts: MockBitmapText[] = [];
  readonly createdTexts: MockText[] = [];

  createSprite(_texture?: Texture): never {
    const mock = new MockSprite();
    this.createdSprites.push(mock);
    return mock as never;
  }

  createContainer(): never {
    const mock = new MockContainer();
    this.createdContainers.push(mock);
    return mock as never;
  }

  createGraphics(): never {
    const mock = new MockGraphics();
    this.createdGraphics.push(mock);
    return mock as never;
  }

  createBitmapText(fontName: string, text: string): never {
    const mock = new MockBitmapText(fontName, text);
    this.createdBitmapTexts.push(mock);
    return mock as never;
  }

  createText(options: Record<string, unknown>): never {
    const mock = new MockText(options);
    this.createdTexts.push(mock);
    return mock as never;
  }

  /** Reset all tracked mock objects */
  reset(): void {
    this.createdSprites.length = 0;
    this.createdContainers.length = 0;
    this.createdGraphics.length = 0;
    this.createdBitmapTexts.length = 0;
    this.createdTexts.length = 0;
  }
}

// Lightweight mock implementations for testing

export class MockSprite {
  visible = true;
  x = 0;
  y = 0;
  width = 0;
  height = 0;
  alpha = 1;
  rotation = 0;
  scale = { x: 1, y: 1 };
  anchor = { x: 0, y: 0 };
  parent: MockContainer | null = null;
  children: unknown[] = [];

  removeFromParent(): void {
    this.parent = null;
  }
}

export class MockContainer {
  visible = true;
  x = 0;
  y = 0;
  alpha = 1;
  rotation = 0;
  scale = { x: 1, y: 1 };
  parent: MockContainer | null = null;
  children: unknown[] = [];

  addChild(_child: unknown): void {
    // no-op
  }

  removeChild(_child: unknown): void {
    // no-op
  }

  removeFromParent(): void {
    this.parent = null;
  }
}

export class MockGraphics {
  visible = true;
  x = 0;
  y = 0;
  parent: MockContainer | null = null;

  rect(): this { return this; }
  fill(): this { return this; }
  stroke(): this { return this; }
  clear(): this { return this; }
  removeFromParent(): void { this.parent = null; }
}

export class MockBitmapText {
  text: string;
  fontName: string;
  visible = true;
  x = 0;
  y = 0;
  parent: MockContainer | null = null;

  constructor(fontName: string, text: string) {
    this.fontName = fontName;
    this.text = text;
  }

  removeFromParent(): void { this.parent = null; }
}

export class MockText {
  text: string;
  visible = true;
  x = 0;
  y = 0;
  parent: MockContainer | null = null;

  constructor(options: Record<string, unknown>) {
    this.text = (options.text as string) ?? '';
  }

  removeFromParent(): void { this.parent = null; }
}
