/**
 * EventTarget base class
 * Provides addEventListener/removeEventListener/dispatchEvent interface
 * Uses WeakMap for private event storage
 */

export interface EventListenerOptions {
  capture?: boolean;
  once?: boolean;
  passive?: boolean;
}

export interface Event {
  type: string;
  target?: any;
  currentTarget?: any;
}

const _events = new WeakMap<any, Record<string, Array<(event: Event) => void>>>();

export class EventTarget {
  constructor() {
    _events.set(this, {});
  }

  addEventListener(
    type: string,
    listener: (event: Event) => void,
    options: EventListenerOptions = {}
  ): void {
    let events = _events.get(this);
    if (!events) {
      events = {};
      _events.set(this, events);
    }

    if (!events[type]) {
      events[type] = [];
    }

    events[type].push(listener);

    // Options are noted but not fully implemented (capture, once, passive)
    if (options.capture) {
      // capture option noted
    }
    if (options.once) {
      // once option noted
    }
    if (options.passive) {
      // passive option noted
    }
  }

  removeEventListener(
    type: string,
    listener: (event: Event) => void,
    _options?: EventListenerOptions
  ): void {
    const events = _events.get(this);
    if (events) {
      const listeners = events[type];
      if (listeners && listeners.length > 0) {
        for (let i = listeners.length - 1; i >= 0; i--) {
          if (listeners[i] === listener) {
            listeners.splice(i, 1);
            break;
          }
        }
      }
    }
  }

  dispatchEvent(event: Event = { type: '' }): boolean {
    const events = _events.get(this);
    if (events) {
      const listeners = events[event.type];
      if (listeners) {
        event.target = event.target || this;
        event.currentTarget = this;
        for (let i = 0; i < listeners.length; i++) {
          listeners[i](event);
        }
      }
    }
    return true;
  }
}

export default EventTarget;
