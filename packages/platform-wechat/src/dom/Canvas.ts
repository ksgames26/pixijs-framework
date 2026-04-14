

import { HTMLElement } from './HTMLElement';

let hasModifiedCanvasPrototype = false;

export function Canvas(): HTMLCanvasElement {
  const canvas = wx.createCanvas() as any;

  canvas.type = 'canvas';

  // Inject HTMLElement prototype chain
  if (!hasModifiedCanvasPrototype) {
    hasModifiedCanvasPrototype = true;
    const htmlElementInstance = new HTMLElement('canvas');
    canvas.__proto__.__proto__ = htmlElementInstance;
  }

  canvas.getBoundingClientRect = () => {
    return {
      top: 0,
      left: 0,
      width: (globalThis as any).innerWidth || wx.getSystemInfoSync().screenWidth,
      height: (globalThis as any).innerHeight || wx.getSystemInfoSync().screenHeight,
    };
  };

  return canvas;
}

export default Canvas;
