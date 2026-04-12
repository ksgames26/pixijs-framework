import { Node } from './Node';

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
}

export default Element;
