

import { HTMLElement } from './HTMLElement';
import { Canvas } from './Canvas';
import { Image } from './Image';
import { Audio } from '../media/Audio';
import { Body } from './Body';
import { location } from '../window/location';
import { HTMLVideoElement } from './HTMLVideoElement';

const events: Record<string, Array<(event: any) => void>> = {};

// Canvas singleton
let _canvas: any = null;

export function setCanvas(canvas: HTMLCanvasElement): void {
  _canvas = canvas;
}

interface Document {
  readyState: 'complete';
  visibilityState: 'visible';
  hidden: boolean;
  style: Record<string, any>;
  location: Location;
  ontouchstart: any;
  ontouchmove: any;
  ontouchend: any;
  documentElement: any;
  head: HTMLElement;
  body: HTMLElement;
  createElement(tagName: string): any;
  getElementById(id: string): any;
  getElementsByTagName(tagName: string): any[];
  getElementsByName(tagName: string): any[];
  querySelector(query: string): any;
  querySelectorAll(query: string): any[];
  addEventListener(type: string, listener: (event: any) => void): void;
  removeEventListener(type: string, listener: (event: any) => void): void;
  dispatchEvent(event: any): void;
}

export const document: Document = {
  readyState: 'complete',
  visibilityState: 'visible',
  hidden: false,
  style: {},
  location: location,
  ontouchstart: null,
  ontouchmove: null,
  ontouchend: null,

  // documentElement should be window (as in official adapter)
  documentElement: null as any, // Will be set after window is created
  head: new HTMLElement('head'),
  body: new Body(),

  createElement(tagName: string): any {
    tagName = tagName.toLowerCase();
    if (tagName === 'canvas') {
      return Canvas();
    } else if (tagName === 'audio') {
      return new Audio();
    } else if (tagName === 'video') {
      return new HTMLVideoElement();
    } else if (tagName === 'img') {
      return Image();
    }
    return new HTMLElement(tagName);
  },

  getElementById(id: string): any {
    if (_canvas && _canvas.id === id) {
      return _canvas;
    }
    return null;
  },

  getElementsByTagName(tagName: string): any[] {
    tagName = tagName.toLowerCase();
    if (tagName === 'head') {
      return [document.head];
    } else if (tagName === 'body') {
      return [document.body];
    } else if (tagName === 'canvas') {
      return _canvas ? [_canvas] : [];
    }
    return [];
  },

  getElementsByName(tagName: string): any[] {
    if (tagName === 'head') {
      return [document.head];
    } else if (tagName === 'body') {
      return [document.body];
    } else if (tagName === 'canvas') {
      return _canvas ? [_canvas] : [];
    }
    return [];
  },

  querySelector(query: string): any {
    if (query === 'head') {
      return document.head;
    } else if (query === 'body') {
      return document.body;
    } else if (query === 'canvas') {
      return _canvas;
    } else if (query.startsWith('#') && _canvas && query === `#${_canvas.id}`) {
      return _canvas;
    }
    return null;
  },

  querySelectorAll(query: string): any[] {
    if (query === 'head') {
      return [document.head];
    } else if (query === 'body') {
      return [document.body];
    } else if (query === 'canvas') {
      return _canvas ? [_canvas] : [];
    }
    return [];
  },

  addEventListener(type: string, listener: (event: any) => void): void {
    if (!events[type]) {
      events[type] = [];
    }
    events[type].push(listener);
  },

  removeEventListener(type: string, listener: (event: any) => void): void {
    const listeners = events[type];
    if (listeners && listeners.length > 0) {
      for (let i = listeners.length - 1; i >= 0; i--) {
        if (listeners[i] === listener) {
          listeners.splice(i, 1);
          break;
        }
      }
    }
  },

  dispatchEvent(event: any): void {
    const listeners = events[event.type];
    if (listeners) {
      for (let i = 0; i < listeners.length; i++) {
        listeners[i](event);
      }
    }
  },
};

export default document;

// Set documentElement and _canvas after window is created to avoid circular reference
import { window as _win } from '../window/window';
document.documentElement = _win;
setCanvas(_win.canvas);
