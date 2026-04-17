

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
import { HTMLElement } from '../dom/HTMLElement';
import { HTMLCanvasElement } from '../dom/HTMLCanvasElement';
import { HTMLImageElement } from '../dom/HTMLImageElement';
import { HTMLMediaElement } from '../dom/HTMLMediaElement';
import { HTMLAudioElement } from '../dom/HTMLAudioElement';
import { HTMLVideoElement } from '../dom/HTMLVideoElement';
import { Element } from '../dom/Element';
import { Node } from '../dom/Node';

const systemInfo = wx.getSystemInfoSync();

// Define Window interface to avoid circular reference issues
interface Window {
  alert: (msg?: any) => void;
  focus: () => void;
  blur: () => void;
  getComputedStyle: (element: any) => CSSStyleDeclaration;
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

  Node: typeof Node;
  Element: typeof Element;
  HTMLElement: typeof HTMLElement;
  HTMLCanvasElement: typeof HTMLCanvasElement;
  HTMLImageElement: typeof HTMLImageElement;
  HTMLMediaElement: typeof HTMLMediaElement;
  HTMLAudioElement: typeof HTMLAudioElement;
  HTMLVideoElement: typeof HTMLVideoElement;
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
  canvas: null as any,

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

  // DOM classes
  Node,
  Element,
  HTMLElement,
  HTMLCanvasElement,
  HTMLImageElement,
  HTMLMediaElement,
  HTMLAudioElement,
  HTMLVideoElement,
};

export default window;
