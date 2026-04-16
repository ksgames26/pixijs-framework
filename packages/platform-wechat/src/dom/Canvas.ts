

import { HTMLElement } from './HTMLElement';

let hasModifiedCanvasPrototype = false;

export function enhanceCanvas(canvas: HTMLCanvasElement): HTMLCanvasElement {
  const enhancedCanvas = canvas as any;

  enhancedCanvas.type = 'canvas';

  // Inject HTMLElement prototype chain once for native mini-game canvas objects.
  if (!hasModifiedCanvasPrototype) {
    hasModifiedCanvasPrototype = true;
    const htmlElementInstance = new HTMLElement('canvas');
    enhancedCanvas.__proto__.__proto__ = htmlElementInstance;
  }

  enhancedCanvas.getBoundingClientRect = () => {
    return {
      top: 0,
      left: 0,
      width: (globalThis as any).innerWidth || wx.getSystemInfoSync().screenWidth,
      height: (globalThis as any).innerHeight || wx.getSystemInfoSync().screenHeight,
    };
  };

  return enhancedCanvas;
}

export function Canvas(): HTMLCanvasElement {
  return enhanceCanvas(wx.createCanvas() as unknown as HTMLCanvasElement);
}

export default Canvas;
