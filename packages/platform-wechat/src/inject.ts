

declare const GameGlobal: typeof globalThis & {
  __isAdapterInjected?: boolean;
  screencanvas?: HTMLCanvasElement;
  global?: typeof globalThis;
  CanvasRenderingContext2D?: any;
  WebGLRenderingContext?: any;
};

import { enhanceCanvas } from './dom/Canvas';
import { document, setCanvas } from './dom/document';
import { window as _window } from './window/window';

export function inject(): void {
  if (GameGlobal.__isAdapterInjected) {
    return;
  }
  GameGlobal.__isAdapterInjected = true;

  console.log('[Inject] Injecting...');

  _window.addEventListener = (type: string, listener: any) => {
    document.addEventListener(type, listener);
  };
  _window.removeEventListener = (type: string, listener: any) => {
    document.removeEventListener(type, listener);
  };

  if ((_window as any).canvas) {
    (_window as any).canvas.addEventListener = _window.addEventListener;
    (_window as any).canvas.removeEventListener = _window.removeEventListener;
  }

  const { platform } = wx.getSystemInfoSync();
  const global = GameGlobal;

  console.log('[Inject] Platform:', platform);

  // Reuse the first native canvas as the shared onscreen canvas for rendering.
  const tempCanvas = GameGlobal.screencanvas
    ? enhanceCanvas(GameGlobal.screencanvas)
    : enhanceCanvas(wx.createCanvas() as unknown as HTMLCanvasElement);
  GameGlobal.screencanvas = tempCanvas;
  (_window as any).canvas = tempCanvas;
  (global as any).canvas = tempCanvas;
  setCanvas(tempCanvas);

  console.log('[Inject] Canvas:', tempCanvas);

  // Inject CanvasRenderingContext2D and WebGLRenderingContext if not exists
  // We MUST use a separate dummy canvas to extract constructors! 
  // Calling getContext('2d') on the main tempCanvas will permanently lock it out of WebGL mode!
  const dummyCanvas = wx.createCanvas();
  if (!global.CanvasRenderingContext2D && dummyCanvas.getContext) {
    const ctx2d = dummyCanvas.getContext('2d');
    if (ctx2d) {
      global.CanvasRenderingContext2D = ctx2d.constructor;
    }
  }
  if (!global.WebGLRenderingContext && dummyCanvas.getContext) {
    const gl = dummyCanvas.getContext('webgl');
    if (gl) {
      global.WebGLRenderingContext = gl.constructor;
    }
  }

  const circularProps = ['window', 'self', 'top', 'parent'];

  // In devtools, we cannot redefine window, use Object.defineProperty
  if (platform === 'devtools') {
    for (const key in _window) {
      if (circularProps.includes(key)) continue;
      const descriptor = Object.getOwnPropertyDescriptor(globalThis as any, key);

      if (!descriptor || descriptor.configurable === true) {
        Object.defineProperty(globalThis, key, {
          value: (_window as any)[key],
        });
      }
    }

    for (const key in document) {
      const descriptor = Object.getOwnPropertyDescriptor((globalThis as any).document, key);

      if (!descriptor || descriptor.configurable === true) {
        Object.defineProperty((globalThis as any).document, key, {
          value: (document as any)[key],
        });
      }
    }

    circularProps.forEach(key => {
      try {
        const descriptor = Object.getOwnPropertyDescriptor(globalThis as any, key);
        if (!descriptor || descriptor.configurable) {
          Object.defineProperty(globalThis, key, {
            value: key === 'window' ? _window : globalThis,
            configurable: true,
            writable: true
          });
        }
      } catch (e) {
        // ignore
      }
    });
  } else {
    // On real device, inject directly into global scope
    for (const key in _window) {
      if (circularProps.includes(key)) continue;
      try {
        (global as any)[key] = (_window as any)[key];
      } catch (e) {
        // ignore
      }
    }

    circularProps.forEach(key => {
      try {
        const descriptor = Object.getOwnPropertyDescriptor(global as any, key);
        if (!descriptor || descriptor.configurable) {
          Object.defineProperty(global, key, {
            value: key === 'window' ? _window : global,
            configurable: true,
            writable: true
          });
        }
      } catch (e) {
        // ignore
      }
    });
  }
}

// Auto-inject on first import.
inject();

export default inject;
