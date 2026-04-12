import { BitmapText, Text } from 'pixi.js';
import type { TextOptions } from 'pixi.js';

/**
 * Game text options controlling BitmapText vs DynamicText selection.
 * Satisfies Constitution IV: "Text rendering MUST use BitmapText
 * or pre-rendering strategy."
 */
export interface GameTextOptions {
  /** Text rendering mode. Default 'bitmap'. */
  mode?: 'bitmap' | 'dynamic';

  /** BitmapText font name (requires pre-loaded .fnt file). Required for mode='bitmap'. */
  fontName?: string;

  /** Display text content. */
  text?: string;

  /** DynamicText style. Only used when mode='dynamic'. */
  textStyle?: TextOptions['style'];
}

/**
 * Create a game text element with automatic BitmapText/DynamicText selection.
 * Defaults to BitmapText for cross-platform rendering consistency.
 */
export function createGameText(options: GameTextOptions): BitmapText | Text {
  const mode = options.mode ?? 'bitmap';
  const content = options.text ?? '';

  if (mode === 'bitmap') {
    if (!options.fontName) {
      throw new Error('[GameText] fontName is required for bitmap text mode');
    }
    return new BitmapText({
      text: content,
      style: { fontFamily: options.fontName },
    });
  }

  return new Text({
    text: content,
    style: options.textStyle ?? {},
  });
}
