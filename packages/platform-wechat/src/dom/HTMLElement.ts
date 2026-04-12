/// <reference path="../types/wx.d.ts" />

import { Element } from './Element';
import { noop } from '../util/noop';

const { screenWidth: innerWidth, screenHeight: innerHeight } = wx.getSystemInfoSync();

export class HTMLElement extends Element {
  public tagName: string;
  public style: Record<string, string>;
  public innerHTML: string;
  public insertBefore: () => void;

  constructor(tagName: string = '') {
    super();
    this.tagName = tagName.toUpperCase();
    this.style = {
      width: `${innerWidth}px`,
      height: `${innerHeight}px`,
    };
    this.innerHTML = '';
    this.insertBefore = noop;
  }

  get clientWidth(): number {
    const ret = parseInt(this.style.fontSize as string, 10) * this.innerHTML.length;
    return Number.isNaN(ret) ? 0 : ret;
  }

  get clientHeight(): number {
    const ret = parseInt(this.style.fontSize as string, 10);
    return Number.isNaN(ret) ? 0 : ret;
  }

  getBoundingClientRect(): { top: number; left: number; width: number; height: number } {
    return {
      top: 0,
      left: 0,
      width: innerWidth,
      height: innerHeight,
    };
  }

  focus(): void {
    // No-op
  }
}

export default HTMLElement;
