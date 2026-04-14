

import { Event } from './Event';

export class TouchEvent extends Event {
  public touches: WechatMinigame.Touch[];
  public targetTouches: WechatMinigame.Touch[];
  public changedTouches: WechatMinigame.Touch[];

  constructor(type: string) {
    super(type);
    this.touches = [];
    this.targetTouches = [];
    this.changedTouches = [];

    const canvas = (globalThis as any).canvas;
    this.target = canvas;
    this.currentTarget = canvas;
  }
}

export function touchEventHandlerFactory(type: string): (event: WechatMinigame.OnTouchStartListenerResult) => void {
  return (event: WechatMinigame.OnTouchStartListenerResult) => {
    const touchEvent = new TouchEvent(type);

    touchEvent.touches = event.touches;
    touchEvent.targetTouches = Array.prototype.slice.call(event.touches);
    touchEvent.changedTouches = event.changedTouches;
    (touchEvent as any).timeStamp = event.timeStamp;

    const doc = (globalThis as any).document;
    if (doc && doc.dispatchEvent) {
      doc.dispatchEvent(touchEvent);
    }
  };
}

// Register touch event handlers with wx API
wx.onTouchStart(touchEventHandlerFactory('touchstart'));
wx.onTouchMove(touchEventHandlerFactory('touchmove'));
wx.onTouchEnd(touchEventHandlerFactory('touchend'));
wx.onTouchCancel(touchEventHandlerFactory('touchcancel'));

export default TouchEvent;
