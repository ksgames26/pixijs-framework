

declare const GameGlobal: typeof globalThis & {
  __isAdapterInjected?: boolean;
  screencanvas?: HTMLCanvasElement;
  global?: typeof globalThis;
  CanvasRenderingContext2D?: any;
  WebGLRenderingContext?: any;
};

import { window as _window } from './window/window';
import { document } from './dom/document';

export function inject(): void {
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

  // Inject CanvasRenderingContext2D and WebGLRenderingContext if not exists
  const tempCanvas = wx.createCanvas();
  if (!global.CanvasRenderingContext2D && tempCanvas.getContext) {
    const ctx2d = tempCanvas.getContext('2d');
    if (ctx2d) {
      global.CanvasRenderingContext2D = ctx2d.constructor;
    }
  }
  if (!global.WebGLRenderingContext && tempCanvas.getContext) {
    const gl = tempCanvas.getContext('webgl');
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

// Auto-inject if not already done
if (!GameGlobal.__isAdapterInjected) {
  GameGlobal.__isAdapterInjected = true;
  inject();
}

export default inject;
