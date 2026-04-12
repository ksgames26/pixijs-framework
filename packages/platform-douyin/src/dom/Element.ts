import { Node } from './Node';

/**
 * Element base class
 * Extends Node with attribute and child element management
 */
export class Element extends Node {
  public className: string;
  public children: Element[];

  constructor() {
    super();
    this.className = '';
    this.children = [];
  }

  setAttribute(name: string, value: any): void {
    (this as any)[name] = value;
  }

  getAttribute(name: string): any {
    return (this as any)[name];
  }

  setAttributeNS(_namespace: string, name: string, value: any): void {
    (this as any)[name] = value;
  }

  getAttributeNS(_namespace: string, name: string): any {
    return (this as any)[name];
  }
}

export default Element;
