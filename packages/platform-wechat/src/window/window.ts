/// <reference path="../types/wx.d.ts" />

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
import { matchMedia } from '../screen/matchMedia';
import { document } from '../dom/document';
import { Canvas } from '../dom/Canvas';

const systemInfo = wx.getSystemInfoSync();

// Create canvas singleton
const canvas = Canvas();

// Define Window interface to avoid circular reference issues
interface Window {
  alert: (msg?: any) => void;
  focus: () => void;
  blur: () => void;
  getComputedStyle: (element: Element) => CSSStyleDeclaration;
  scrollTo: (x: number, y: number) => void;
  scrollBy: (dx: number, dy: number) => void;
  matchMedia: (query: string) => MediaQueryList;
  navigator: Navigator;
  location: Location;
  localStorage: Storage;
  performance: Performance;
  screen: Screen;
  document: any;
  console: Console;
  innerWidth: number;
  innerHeight: number;
  devicePixelRatio: number;
  scrollX: number;
  scrollY: number;
  ontouchstart: any;
  ontouchmove: any;
  ontouchend: any;
  canvas: HTMLCanvasElement;
  self: any;
  window: any;
  top: any;
  parent: any;
  addEventListener: (type: string, listener: any) => void;
  removeEventListener: (type: string, listener: any) => void;
  dispatchEvent: (event: any) => boolean;
  setTimeout: (handler: TimerHandler, timeout?: number, ...args: any[]) => number;
  clearTimeout: (id: number | undefined) => void;
  setInterval: (handler: TimerHandler, timeout?: number, ...args: any[]) => number;
  clearInterval: (id: number | undefined) => void;
  requestAnimationFrame: (callback: FrameRequestCallback) => number;
  cancelAnimationFrame: (id: number) => void;
}

export const window: Window = {
  // Global functions
  alert,
  focus,
  blur,
  getComputedStyle,
  scrollTo,
  scrollBy,
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
  devicePixelRatio: systemInfo.pixelRatio,
  scrollX: 0,
  scrollY: 0,

  // Touch handlers
  ontouchstart: null as any,
  ontouchmove: null as any,
  ontouchend: null as any,

  // Canvas
  canvas,

  // Self reference
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
  addEventListener(type: string, listener: any): void {
    document.addEventListener(type, listener);
  },

  removeEventListener(type: string, listener: any): void {
    document.removeEventListener(type, listener);
  },

  dispatchEvent(event: any): boolean {
    document.dispatchEvent(event);
    return true;
  },

  // Global timer functions
  setTimeout: (
    handler: TimerHandler,
    timeout?: number,
    ...args: any[]
  ): number => setTimeout(handler, timeout, ...args),
  clearTimeout: (id: number | undefined): void => clearTimeout(id),
  setInterval: (
    handler: TimerHandler,
    timeout?: number,
    ...args: any[]
  ): number => setInterval(handler, timeout, ...args),
  clearInterval: (id: number | undefined): void => clearInterval(id),

  // Animation frame functions
  requestAnimationFrame: (callback: FrameRequestCallback): number =>
    requestAnimationFrame(callback),
  cancelAnimationFrame: (id: number): void => cancelAnimationFrame(id),
};

export default window;
