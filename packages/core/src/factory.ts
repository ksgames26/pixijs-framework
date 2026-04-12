import { Sprite, Container, Graphics, BitmapText, Text } from 'pixi.js';
import type { Texture, TextOptions } from 'pixi.js';

/**
 * Display object factory interface.
 * Satisfies Constitution VI: "Display object creation MUST go through
 * factory functions, making it easy to replace with Mocks in tests."
 */
export interface DisplayObjectFactory {
  /** Create a sprite */
  createSprite(texture?: Texture): Sprite;

  /** Create a container */
  createContainer(): Container;

  /** Create a graphics object */
  createGraphics(): Graphics;

  /**
   * Create a bitmap text (default text approach).
   * Satisfies Constitution IV: "Text rendering MUST use BitmapText
   * or pre-rendering strategy."
   */
  createBitmapText(fontName: string, text: string): BitmapText;

  /**
   * Create a dynamic text (for multilingual or runtime-rendered text).
   * Only use when BitmapText is not suitable.
   */
  createText(options: TextOptions): Text;
}

/**
 * Default factory implementation that directly calls PixiJS constructors.
 */
export class DefaultDisplayObjectFactory implements DisplayObjectFactory {
  createSprite(texture?: Texture): Sprite {
    return new Sprite(texture);
  }

  createContainer(): Container {
    return new Container();
  }

  createGraphics(): Graphics {
    return new Graphics();
  }

  createBitmapText(fontName: string, text: string): BitmapText {
    return new BitmapText({
      text,
      style: { fontFamily: fontName },
    });
  }

  createText(options: TextOptions): Text {
    return new Text(options);
  }
}
