import { EventTarget } from '../event/EventTarget';

/**
 * Node base class
 * Abstract base for DOM nodes with child management
 */
export class Node extends EventTarget {
  public childNodes: Node[];

  constructor() {
    super();
    this.childNodes = [];
  }

  appendChild(node: Node): void {
    this.childNodes.push(node);
  }

  cloneNode(): Node {
    const copyNode = Object.create(this);
    Object.assign(copyNode, this);
    copyNode.childNodes = [];
    return copyNode;
  }

  removeChild(node: Node): Node[] | null {
    const index = this.childNodes.findIndex(child => child === node);
    if (index > -1) {
      return this.childNodes.splice(index, 1);
    }
    return null;
  }
}

export default Node;
