// Imports for type references
import type { TouchEvent } from '../event/TouchEvent';

/// <reference path="../types/tt.d.ts" />
declare const tt: TT.TTAPI;

import { navigator } from '../navigator/navigator';
import { location } from './location';
import { performance } from '../performance/performance';
import { screen } from '../screen/screen';
import { localStorage } from '../storage/localStorage';
import { getComputedStyle } from './getComputedStyle';
import { scrollTo } from './scrollTo';
import { scrollBy } from './scrollBy';
import { alert } from './alert';
import { focus } from './focus';
import { blur } from './blur';
import { btoa } from '../util/btoa';
import { atob } from '../util/atob';
import { matchMedia } from '../screen/matchMedia';
import { document } from '../dom/document';
import { Canvas } from '../dom/Canvas';

// Get system info
const systemInfo = tt.getSystemInfoSync();

// Canvas singleton
const canvas = document.onscreenCanvas || new Canvas();

// Create window object
export const window = {
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
  console,

  // Dimensions
  get innerWidth(): number {
    return systemInfo.screenWidth;
  },
  get innerHeight(): number {
    return systemInfo.screenHeight;
  },
  devicePixelRatio: systemInfo.devicePixelRatio,
  scrollX: 0,
  scrollY: 0,

  // Touch handlers
  ontouchstart: null as ((this: Window, ev: TouchEvent) => any) | null,
  ontouchmove: null as ((this: Window, ev: TouchEvent) => any) | null,
  ontouchend: null as ((this: Window, ev: TouchEvent) => any) | null,

  // Canvas
  canvas,

  // Classes (will be assigned in inject.ts)
  XMLHttpRequest: null as any,
  WebSocket: null as any,
  Worker: null as any,
  Image: null as any,
  ImageBitmap: null as any,
  Audio: null as any,
  AudioContext: null as any,
  FileReader: null as any,
  Blob: null as any,
  URL: null as any,
  TextDecoder: null as any,
  Element: null as any,
  HTMLElement: null as any,
  HTMLImageElement: null as any,
  HTMLMediaElement: null as any,
  HTMLAudioElement: null as any,
  HTMLVideoElement: null as any,
  HTMLCanvasElement: null as any,
  WebGLRenderingContext: null as any,
  TouchEvent: null as any,
  PointerEvent: null as any,
  MouseEvent: null as any,

  // Self reference for circular references
  get self() {
    return window;
  },
  get window() {
    return window;
  },
  get top() {
    return window;
  },
  get parent() {
    return window;
  },

  // Event handling
  addEventListener(type: string, listener: EventListenerOrEventListenerObject | null): void {
    document.addEventListener(type, listener as any);
  },

  removeEventListener(type: string, listener: EventListenerOrEventListenerObject | null): void {
    document.removeEventListener(type, listener as any);
  },

  dispatchEvent(event: Event): boolean {
    console.log('window.dispatchEvent', (event as any).type, event);
    return true;
  },

  // Douyin API
  tt,
};

export default window;
