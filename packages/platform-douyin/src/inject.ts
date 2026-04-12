/**
 * Adapter injection module
 * Injects browser-compatible globals into the Douyin mini-game environment
 */

/// <reference path="./types/tt.d.ts" />

declare const tt: TT.TTAPI;
declare const GameGlobal: typeof globalThis & {
  __isAdapterInjected?: boolean;
  screencanvas?: HTMLCanvasElement;
  global?: typeof globalThis;
};

import { Event } from './event/Event';
import { TouchEvent } from './event/TouchEvent';
import { PointerEvent } from './event/PointerEvent';
import { MouseEvent } from './event/MouseEvent';
import { Element } from './dom/Element';
import { HTMLElement } from './dom/HTMLElement';
import { HTMLCanvasElement } from './dom/HTMLCanvasElement';
import { HTMLVideoElement } from './dom/HTMLVideoElement';
import { HTMLMediaElement } from './media/HTMLMediaElement';
import { HTMLAudioElement } from './media/HTMLAudioElement';
import { Audio } from './media/Audio';
import { AudioContext } from './media/AudioContext';
import { Image } from './dom/Image';
import { ImageBitmap } from './dom/ImageBitmap';
import { XMLHttpRequest } from './network/XMLHttpRequest';
import { WebSocket } from './network/WebSocket';
import { Worker } from './worker/Worker';
import { FileReader } from './storage/FileReader';
import { Blob } from './storage/Blob';
import { URL } from './storage/URL';
import { TextDecoder } from './storage/TextDecoder';
import { navigator } from './navigator/navigator';
import { localStorage } from './storage/localStorage';
import { location } from './window/location';
import { performance } from './performance/performance';
import { screen } from './screen/screen';
import { document } from './dom/document';
import { getComputedStyle } from './window/getComputedStyle';
import { scrollTo } from './window/scrollTo';
import { scrollBy } from './window/scrollBy';
import { alert } from './window/alert';
import { focus } from './window/focus';
import { blur } from './window/blur';
import { btoa } from './util/btoa';
import { atob } from './util/atob';
import { matchMedia } from './screen/matchMedia';

/**
 * WebGLRenderingContext stub
 */
class WebGLRenderingContextStub {
  // WebGL constants and methods stub
}

/**
 * Inject browser-compatible globals into the Douyin environment
 */
export function inject(): void {
  // Prevent duplicate injection
  if (GameGlobal.__isAdapterInjected) {
    return;
  }
  GameGlobal.__isAdapterInjected = true;

  // Set up window object
  const windowObj: any = {
    // Self references
    self: null,
    window: null,
    top: null,
    parent: null,

    // Global functions
    alert,
    focus,
    blur,
    getComputedStyle,
    scrollTo,
    scrollBy,
    btoa,
    atob,
    matchMedia,

    // Global objects
    navigator,
    location,
    localStorage,
    performance,
    screen,
    document,

    // Global classes
    XMLHttpRequest,
    WebSocket,
    Worker,
    Image,
    ImageBitmap,
    Audio,
    AudioContext,
    FileReader,
    Blob,
    URL,
    TextDecoder,
    Element,
    HTMLElement,
    HTMLImageElement: tt.createImage().constructor,
    HTMLMediaElement,
    HTMLAudioElement,
    HTMLVideoElement,
    HTMLCanvasElement,
    WebGLRenderingContext: WebGLRenderingContextStub,
    TouchEvent,
    PointerEvent,
    MouseEvent,

    // Canvas
    canvas: document.onscreenCanvas,

    // Dimensions
    get innerWidth() {
      return tt.getSystemInfoSync().screenWidth;
    },
    get innerHeight() {
      return tt.getSystemInfoSync().screenHeight;
    },
    devicePixelRatio: tt.getSystemInfoSync().devicePixelRatio,
    scrollX: 0,
    scrollY: 0,

    // Touch handlers
    ontouchstart: null,
    ontouchmove: null,
    ontouchend: null,

    // Douyin API
    tt,

    // Event handling
    addEventListener(type: string, listener: any) {
      document.addEventListener(type, listener);
    },
    removeEventListener(type: string, listener: any) {
      document.removeEventListener(type, listener);
    },
    dispatchEvent(event: Event) {
      console.log('window.dispatchEvent', event.type, event);
      return true;
    },
  };

  // Set up circular references
  windowObj.self = windowObj;
  windowObj.window = windowObj;
  windowObj.top = windowObj;
  windowObj.parent = windowObj;

  // Inject into global scope
  const global = GameGlobal;
  GameGlobal.global = GameGlobal.global || global;

  const systemInfo = tt.getSystemInfoSync();

  // Check if running in devtools
  if (typeof (globalThis as any).__devtoolssubcontext === 'undefined' && systemInfo.platform === 'devtools') {
    // In devtools, inject into actual window object
    for (const key of Object.keys(windowObj)) {
      const descriptor = Object.getOwnPropertyDescriptor((globalThis as any), key);
      if (!descriptor || descriptor.configurable === true) {
        Object.defineProperty(globalThis, key, {
          value: (windowObj as any)[key],
          configurable: true,
          writable: true,
        });
      }
    }

    for (const key of Object.keys(document)) {
      const descriptor = Object.getOwnPropertyDescriptor((globalThis as any).document, key);
      if (!descriptor || descriptor.configurable === true) {
        Object.defineProperty((globalThis as any).document, key, {
          value: (document as any)[key],
          configurable: true,
          writable: true,
        });
      }
    }

    (globalThis as any).parent = globalThis;
    (globalThis as any).tt = tt;
  } else {
    // In production mini-game environment
    (windowObj as any).tt = tt;

    for (const key of Object.keys(windowObj)) {
      (GameGlobal as any)[key] = (windowObj as any)[key];
    }

    (GameGlobal as any).window = GameGlobal;
    (GameGlobal as any).top = GameGlobal;
    (GameGlobal as any).parent = GameGlobal;
  }

  // Set up screencanvas
  if (!GameGlobal.screencanvas) {
    GameGlobal.screencanvas = document.onscreenCanvas;
  }

  // Override console.time/timeEnd in production
  if (systemInfo.platform !== 'devtools') {
    const ttPerf = tt.getPerformance ? tt.getPerformance() : Date;
    const consoleTimers: Record<string, number> = {};

    console.time = function (name: string) {
      consoleTimers[name] = ttPerf.now();
    };

    console.timeEnd = function (name: string) {
      const timeStart = consoleTimers[name];
      if (!timeStart) {
        return;
      }
      const timeElapsed = ttPerf.now() - timeStart;
      console.log(name + ': ' + timeElapsed / 1000 + 'ms');
      delete consoleTimers[name];
    };
  }

  // Set up resize handler
  if (tt.onWindowResize) {
    tt.onWindowResize((res: { windowWidth: number; windowHeight: number }) => {
      const event = new Event('resize');
      (event as any).target = windowObj;
      (event as any).timeStamp = Date.now();
      (event as any).res = res;
      (event as any).windowWidth = res.windowWidth;
      (event as any).windowHeight = res.windowHeight;
      document.dispatchEvent(event);
    });
  }
}

// Auto-inject if not already done
if (!GameGlobal.__isAdapterInjected) {
  inject();
}

export default inject;
