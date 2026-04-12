import { Event } from './Event';
import { Touch, TouchEvent } from './TouchEvent';

/**
 * PointerEvent class
 * Maps touch events to pointer events for broader compatibility
 */
export class PointerEvent extends Event {
  public bubbles: boolean;
  public cancelable: boolean;
  public view: any;
  public detail: number;
  public screenX: number;
  public screenY: number;
  public clientX: number;
  public clientY: number;
  public ctrlKey: boolean;
  public altKey: boolean;
  public shiftKey: boolean;
  public metaKey: boolean;
  public button: number;
  public buttons: number;
  public which: number;
  public relatedTarget: any;
  public pointerId: number;
  public width: number;
  public height: number;
  public pressure: number;
  public tiltX: number;
  public tiltY: number;
  public pointerType: string;
  public hwTimestamp: number;
  public isPrimary: boolean;
  public pageX: number;
  public pageY: number;

  constructor(type: string) {
    super(type);
    this.bubbles = false;
    this.cancelable = false;
    this.view = null;
    this.detail = 0;
    this.screenX = 0;
    this.screenY = 0;
    this.clientX = 0;
    this.clientY = 0;
    this.ctrlKey = false;
    this.altKey = false;
    this.shiftKey = false;
    this.metaKey = false;
    this.button = 0;
    this.buttons = 0;
    this.which = 0;
    this.relatedTarget = null;
    this.pointerId = 0;
    this.width = 0;
    this.height = 0;
    this.pressure = 0;
    this.tiltX = 0;
    this.tiltY = 0;
    this.pointerType = 'touch';
    this.hwTimestamp = 0;
    this.isPrimary = false;
    this.pageX = 0;
    this.pageY = 0;

    const canvas = (globalThis as any).canvas;
    this.target = canvas;
    this.currentTarget = canvas;
  }
}

// Clone properties array for touch to pointer conversion
const CLONE_PROPS = [
  'bubbles',
  'cancelable',
  'view',
  'detail',
  'screenX',
  'screenY',
  'clientX',
  'clientY',
  'ctrlKey',
  'altKey',
  'shiftKey',
  'metaKey',
  'button',
  'relatedTarget',
  'pointerId',
  'width',
  'height',
  'pressure',
  'tiltX',
  'tiltY',
  'pointerType',
  'hwTimestamp',
  'isPrimary',
  'pageX',
  'pageY',
  'timeStamp',
];

const CLONE_DEFAULTS: Array<boolean | number | string | null> = [
  false,
  false,
  null,
  null,
  0,
  0,
  0,
  0,
  false,
  false,
  false,
  false,
  0,
  null,
  0,
  0,
  0,
  0,
  0,
  0,
  '',
  0,
  false,
  0,
  0,
  0,
];

const POINTER_TYPE = 'touch';

let firstPointer: number | null = null;

function isPrimaryPointer(touch: Touch): boolean {
  return firstPointer === touch.identifier;
}

function setPrimaryPointer(touch: Touch): void {
  if (firstPointer === null) {
    firstPointer = touch.identifier;
  }
}

function removePrimaryPointer(touch: Touch): void {
  if (firstPointer === touch.identifier) {
    firstPointer = null;
  }
}

function typeToButtons(type: string): number {
  let ret = 0;
  if (
    type === 'touchstart' ||
    type === 'touchmove' ||
    type === 'pointerdown' ||
    type === 'pointermove'
  ) {
    ret = 1;
  }
  return ret;
}

/**
 * Convert a touch to a pointer event
 */
export function touchToPointer(
  type: string,
  touch: Touch,
  rawEvent: TouchEvent
): PointerEvent {
  const e = new PointerEvent(type);

  for (let i = 0; i < CLONE_PROPS.length; i++) {
    const prop = CLONE_PROPS[i];
    if (prop !== 'type' && prop !== 'timeStamp') {
      (e as any)[prop] = (touch as any)[prop] ?? CLONE_DEFAULTS[i];
    }
  }
  e.target = (globalThis as any).canvas;
  e.currentTarget = (globalThis as any).canvas;
  e.buttons = typeToButtons(type);
  e.which = e.buttons;
  e.pointerId = (touch.identifier || 0) + 2;
  e.bubbles = true;
  e.cancelable = true;
  e.button = 0;
  e.width = (touch.radiusX || 0.5) * 2;
  e.height = (touch.radiusY || 0.5) * 2;
  e.pressure = touch.force || 0.5;
  e.isPrimary = isPrimaryPointer(touch);
  e.pointerType = POINTER_TYPE;

  if (rawEvent) {
    e.altKey = (rawEvent as any).altKey || false;
    e.ctrlKey = (rawEvent as any).ctrlKey || false;
    e.metaKey = (rawEvent as any).metaKey || false;
    e.shiftKey = (rawEvent as any).shiftKey || false;

    if ((rawEvent as any).preventDefault) {
      e.preventDefault = function () {
        (rawEvent as any).preventDefault();
      };
    }
  }

  return e;
}

/**
 * Factory function for creating pointer event handlers from touch events
 */
export function eventHandlerFactory(type: string) {
  return (rawEvent: TouchEvent): void => {
    const changedTouches = rawEvent.changedTouches;
    for (let i = 0; i < changedTouches.length; i++) {
      const touch = changedTouches[i];

      if (i === 0 && type === 'pointerdown') {
        setPrimaryPointer(touch);
      } else if (type === 'pointerup' || type === 'pointercancel') {
        removePrimaryPointer(touch);
      }

      const event = touchToPointer(type, touch, rawEvent);
      const document = (globalThis as any).document;
      if (document && document.dispatchEvent) {
        document.dispatchEvent(event);
      }
    }
  };
}

export default PointerEvent;
