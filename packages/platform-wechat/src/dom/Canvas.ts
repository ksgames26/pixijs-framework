

import { HTMLElement } from './HTMLElement';

export function enhanceCanvas(canvas: HTMLCanvasElement): HTMLCanvasElement {
  const enhancedCanvas = canvas as any;

  enhancedCanvas.type = 'canvas';

  enhancedCanvas.__proto__.__proto__ = new HTMLElement('canvas');

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
