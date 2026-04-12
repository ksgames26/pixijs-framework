/**
 * Scene hierarchy tree viewer for debug mode.
 * Displays the current scene's display object tree structure.
 */
export class SceneTreeViewer {
  /**
   * Build a tree representation of a scene's stage.
   * @param stage The scene's root container
   * @param maxDepth Maximum depth to traverse
   */
  buildTree(stage: { children: unknown[]; constructor?: { name: string } }, maxDepth = 10): SceneTreeNode {
    return this.buildNode(stage, 0, maxDepth);
  }

  /**
   * Format tree as a string for text-based display.
   */
  formatTree(node: SceneTreeNode, indent = 0): string {
    const prefix = '  '.repeat(indent);
    const type = node.type;
    const info = node.childCount > 0 ? ` (${node.childCount} children)` : '';
    let result = `${prefix}${type}${info}\n`;

    for (const child of node.children) {
      result += this.formatTree(child, indent + 1);
    }

    return result;
  }

  private buildNode(obj: unknown, depth: number, maxDepth: number): SceneTreeNode {
    const node = obj as { children?: unknown[]; constructor?: { name: string } };
    const type = node.constructor?.name ?? 'Unknown';
    const children: SceneTreeNode[] = [];

    if (depth < maxDepth && Array.isArray(node.children)) {
      for (const child of node.children) {
        children.push(this.buildNode(child, depth + 1, maxDepth));
      }
    }

    return {
      type,
      childCount: children.length,
      children,
    };
  }
}

export interface SceneTreeNode {
  type: string;
  childCount: number;
  children: SceneTreeNode[];
}
