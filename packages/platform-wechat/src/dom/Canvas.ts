

import { HTMLCanvasElement as LocalHTMLCanvasElement } from './HTMLCanvasElement';

export function enhanceCanvas(canvas: any): any {
  const enhancedCanvas = canvas as any;

  enhancedCanvas.type = 'canvas';

  // Inherit from our custom HTMLCanvasElement so instanceof checks work
  const originalProto = Object.getPrototypeOf(enhancedCanvas);
  if (originalProto) {
    Object.setPrototypeOf(originalProto, LocalHTMLCanvasElement.prototype);
  } else {
    Object.setPrototypeOf(enhancedCanvas, LocalHTMLCanvasElement.prototype);
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

export function Canvas(): any {
  return enhanceCanvas(wx.createCanvas());
}

export default Canvas;
