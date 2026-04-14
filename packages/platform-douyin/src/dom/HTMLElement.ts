

import { Element } from './Element';
import { parentNode } from '../util/parent-node';
import { initializeStyle } from '../util/style';
import { classList } from '../util/class-list';
import { clientRegion } from '../util/client-region';
import { offsetRegion } from '../util/offset-region';
import { scrollRegion } from '../util/scroll-region';
import { noop } from '../util/noop';

/**
 * HTMLElement base class
 * Standard HTML element with layout properties and methods
 */
export class HTMLElement extends Element {
  public tagName: string;
  public className: string;
  public children: Element[];
  public innerHTML: string;
  public style: CSSStyleDeclaration;
  public dataset!: DOMStringMap;
  public classList!: DOMTokenList;

  // Layout properties
  public clientLeft!: number;
  public clientTop!: number;
  public clientWidth!: number;
  public clientHeight!: number;
  public offsetLeft!: number;
  public offsetTop!: number;
  public offsetWidth!: number;
  public offsetHeight!: number;
  public scrollLeft!: number;
  public scrollTop!: number;
  public scrollWidth!: number;
  public scrollHeight!: number;

  constructor(tagName: string = '', level: number = 2) {
    super();
    this.tagName = tagName.toUpperCase();
    this.className = '';
    this.children = [];
    this.innerHTML = '';
    this.style = {} as CSSStyleDeclaration;

    // Initialize helpers
    parentNode(this, level);
    initializeStyle(this);
    classList(this);
    clientRegion(this);
    offsetRegion(this);
    scrollRegion(this);
  }

  focus(): void {
    noop();
  }

  blur(): void {
    noop();
  }

  appendChild(_node: any): void {
    noop();
  }

  insertBefore(_newNode: any, _referenceNode: any | null): void {
    noop();
  }

  removeChild(_node: any): any {
    noop();
    return null;
  }

  remove(): void {
    noop();
  }
}

export default HTMLElement;
