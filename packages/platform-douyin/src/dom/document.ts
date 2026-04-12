/// <reference path="../types/tt.d.ts" />

declare const tt: TT.TTAPI;

import { Event } from '../event/Event';
import { TouchEvent } from '../event/TouchEvent';
import { eventHandlerFactory } from '../event/PointerEvent';
import { HTMLElement } from './HTMLElement';
import { Canvas } from './Canvas';
import { Image } from './Image';
import { HTMLVideoElement } from './HTMLVideoElement';
import { Audio } from '../media/Audio';
import { DocumentElement } from './DocumentElement';
import { Body } from './Body';
import { location } from '../window/location';
import { setDocumentReference } from '../util/parent-node';

// Events and elements storage
const events: Record<string, Array<(event: Event) => void>> = {};
const elements: Record<string, HTMLElement[]> = {};

// Create singleton canvas
let onscreenCanvas: Canvas | null = null;
function getCanvas(): Canvas {
  if (!onscreenCanvas) {
    onscreenCanvas = new Canvas();
  }
  return onscreenCanvas;
}

/**
 * Document object
 * Provides browser-like document interface
 */
export const document = {
  readyState: 'complete',
  visibilityState: 'visible',
  hidden: false,
  fullscreen: true,
  location: location,
  scripts: [] as any[],
  style: {} as any,
  ontouchstart: null as any,
  ontouchmove: null as any,
  ontouchend: null as any,
  onvisibilitychange: null as any,
  parentNode: null as any,
  parentElement: null as any,

  // Document element and body
  documentElement: new DocumentElement(),
  head: new HTMLElement('head'),
  body: new Body(),

  createElement(tagName: string): any {
    tagName = tagName.toLowerCase();
    let element: any;

    switch (tagName) {
      case 'canvas':
        element = new Canvas();
        break;
      case 'audio':
        element = new Audio();
        break;
      case 'img':
        element = new (Image as any)();
        break;
      case 'video':
        element = new HTMLVideoElement();
        break;
      default:
        element = new HTMLElement(tagName);
    }

    if (elements[tagName]) {
      elements[tagName].push(element);
    } else {
      elements[tagName] = [element];
    }

    return element;
  },

  createElementNS(_namespace: string | null, tagName: string): HTMLElement {
    return this.createElement(tagName);
  },

  createTextNode(text: string): string {
    return text;
  },

  getElementById(id: string): HTMLElement | null {
    let match: HTMLElement | null = null;
    Object.values(elements).forEach((list) => {
      list.forEach((element) => {
        if ((element as any).id === id) {
          match = element;
        }
      });
    });
    return match;
  },

  getElementsByTagName(tagName: string): HTMLElement[] {
    tagName = tagName.toLowerCase();
    return elements[tagName] || [];
  },

  getElementsByTagNameNS(_namespace: string | null, tagName: string): HTMLElement[] {
    return this.getElementsByTagName(tagName);
  },

  getElementsByName(name: string): HTMLElement[] {
    if (name === 'head') {
      return [this.head];
    } else if (name === 'body') {
      return [this.body];
    } else if (name === 'canvas') {
      return [getCanvas()];
    }
    return [];
  },

  querySelector(query: string): HTMLElement | null {
    switch (query) {
      case 'head':
        return this.head;
      case 'body':
        return this.body;
      case 'canvas':
        return getCanvas();
      default:
        if (query.startsWith('#')) {
          return this.getElementById(query.slice(1));
        }
        return null;
    }
  },

  querySelectorAll(query: string): HTMLElement[] {
    switch (query) {
      case 'head':
        return [this.head];
      case 'body':
        return [this.body];
      case 'canvas':
        return [getCanvas()];
      default:
        return [];
    }
  },

  addEventListener(type: string, listener: (event: Event) => void): void {
    if (!events[type]) {
      events[type] = [];
    }
    events[type].push(listener);
  },

  removeEventListener(type: string, listener: (event: Event) => void): void {
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

  dispatchEvent(event: Event): void {
    const type = event.type;
    const listeners = events[type];
    if (listeners) {
      for (let i = 0; i < listeners.length; i++) {
        listeners[i](event);
      }
    }
    if ((event as any).target && typeof (event as any).target['on' + type] === 'function') {
      (event as any).target['on' + type](event);
    }
  },

  hasFocus(): boolean {
    return true;
  },

  createEvent(type: string): Event {
    return new Event(type);
  },

  get onscreenCanvas(): Canvas {
    return getCanvas();
  },
};

// Set up visibility change handlers
function onVisibilityChange(visible: boolean) {
  return function () {
    document.visibilityState = visible ? 'visible' : 'hidden';
    const hidden = !visible;
    if (document.hidden === hidden) {
      return;
    }
    document.hidden = hidden;
    const event = new Event('visibilitychange');
    (event as any).target = document;
    document.dispatchEvent(event);
  };
}

if (tt.onHide) {
  tt.onHide(onVisibilityChange(false));
}

if (tt.onShow) {
  tt.onShow(onVisibilityChange(true));
}

// Set up touch event handlers
tt.onTouchStart(eventHandlerFactory('pointerdown') as any);
tt.onTouchMove(eventHandlerFactory('pointermove') as any);
tt.onTouchEnd(eventHandlerFactory('pointerup') as any);
tt.onTouchCancel(eventHandlerFactory('pointercancel') as any);

tt.onTouchStart((rawEvent: any) => {
  const event = new TouchEvent('touchstart');
  event.changedTouches = rawEvent.changedTouches as any;
  event.touches = rawEvent.touches as any;
  event.targetTouches = Array.prototype.slice.call(rawEvent.touches) as any;
  document.dispatchEvent(event);
});

tt.onTouchMove((rawEvent: any) => {
  const event = new TouchEvent('touchmove');
  event.changedTouches = rawEvent.changedTouches as any;
  event.touches = rawEvent.touches as any;
  event.targetTouches = Array.prototype.slice.call(rawEvent.touches) as any;
  document.dispatchEvent(event);
});

tt.onTouchEnd((rawEvent: any) => {
  const event = new TouchEvent('touchend');
  event.changedTouches = rawEvent.changedTouches as any;
  event.touches = rawEvent.touches as any;
  event.targetTouches = Array.prototype.slice.call(rawEvent.touches) as any;
  document.dispatchEvent(event);
});

tt.onTouchCancel((rawEvent: any) => {
  const event = new TouchEvent('touchcancel');
  event.changedTouches = rawEvent.changedTouches as any;
  event.touches = rawEvent.touches as any;
  event.targetTouches = Array.prototype.slice.call(rawEvent.touches) as any;
  document.dispatchEvent(event);
});

export default document;

// Set document reference for parentNode helper after document object is created
setDocumentReference(document);
