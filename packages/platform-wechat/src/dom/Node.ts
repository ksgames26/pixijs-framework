import { EventTarget } from '../event/EventTarget';

export class Node extends EventTarget {
  public childNodes: Node[];

  constructor() {
    super();
    this.childNodes = [];
  }

  appendChild(node: Node): void {
    if (node instanceof Node) {
      this.childNodes.push(node);
    } else {
      throw new TypeError("Failed to executed 'appendChild' on 'Node': parameter 1 is not of type 'Node'.");
    }
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

  contains(node: Node): boolean {
    if (this === node) return true;
    for (const child of this.childNodes) {
      if (child.contains && child.contains(node)) {
        return true;
      }
    }
    return true; // We default to true in mini-game to trick PixiJS into thinking it's in the DOM
  }
}

export default Node;
