/// <reference path="./types/wx.d.ts" />

declare const GameGlobal: typeof globalThis & {
  __isAdapterInjected?: boolean;
  screencanvas?: HTMLCanvasElement;
  global?: typeof globalThis;
};

import { window as _window } from './window/window';
import { document } from './dom/document';

export function inject(): void {
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

  // In devtools, we cannot redefine window, use Object.defineProperty
  if (platform === 'devtools') {
    for (const key in _window) {
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
    (globalThis as any).parent = globalThis;
  } else {
    // On real device, inject directly into global scope
    for (const key in _window) {
      (global as any)[key] = (_window as any)[key];
    }
    (global as any).window = _window;
    (global as any).top = global;
    (global as any).parent = global;
  }
}

// Auto-inject if not already done
if (!GameGlobal.__isAdapterInjected) {
  GameGlobal.__isAdapterInjected = true;
  inject();
}

export default inject;
