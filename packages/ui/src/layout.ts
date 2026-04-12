import { Container } from 'pixi.js';

/**
 * Layout configuration following Flexbox-like patterns.
 */
export interface LayoutConfig {
  /** Main axis direction */
  direction?: 'row' | 'column';
  /** Main axis alignment */
  justifyContent?: 'start' | 'center' | 'end' | 'between';
  /** Cross axis alignment */
  alignItems?: 'start' | 'center' | 'end' | 'stretch';
  /** Gap between children */
  gap?: number;
  /** Padding */
  padding?: { top?: number; right?: number; bottom?: number; left?: number };
}

/**
 * Per-child layout properties.
 */
export interface LayoutProps {
  /** Fixed width */
  width?: number;
  /** Fixed height */
  height?: number;
  /** Flex grow factor */
  flexGrow?: number;
  /** Flex shrink factor */
  flexShrink?: number;
  /** Flex basis */
  flexBasis?: number | 'auto';
  /** Self alignment override */
  alignSelf?: 'start' | 'center' | 'end' | 'stretch';
  /** Margin */
  margin?: { top?: number; right?: number; bottom?: number; left?: number };
}

interface LayoutChild {
  container: Container;
  props: LayoutProps;
}

/**
 * Lightweight Flexbox-style layout engine.
 * Calculates and applies positions to Container children.
 */
export class LayoutEngine {
  private root: Container;
  private config: LayoutConfig;
  private children: LayoutChild[] = [];

  constructor(root: Container, config: LayoutConfig = {}) {
    this.root = root;
    this.config = {
      direction: config.direction ?? 'column',
      justifyContent: config.justifyContent ?? 'start',
      alignItems: config.alignItems ?? 'start',
      gap: config.gap ?? 0,
      padding: config.padding ?? {},
    };
  }

  /**
   * Add a child with layout properties.
   */
  addChild(container: Container, props: LayoutProps): void {
    this.children.push({ container, props });
  }

  /**
   * Remove a child from layout tracking.
   */
  removeChild(container: Container): void {
    this.children = this.children.filter((c) => c.container !== container);
  }

  /**
   * Execute layout calculation and apply positions.
   */
  layout(): void {
    if (this.children.length === 0) return;

    const padding = this.config.padding ?? {};
    const gap = this.config.gap ?? 0;
    const isRow = this.config.direction === 'row';

    // Calculate total fixed size and flex counts
    let totalFixedSize = 0;
    let totalFlexGrow = 0;

    for (const child of this.children) {
      const size = isRow
        ? (child.props.width ?? child.props.flexBasis ?? 0)
        : (child.props.height ?? child.props.flexBasis ?? 0);

      if (child.props.flexGrow) {
        totalFlexGrow += child.props.flexGrow;
      } else {
        totalFixedSize += size as number;
      }
    }

    const totalGap = gap * Math.max(0, this.children.length - 1);
    const rootSize = isRow ? this.root.width : this.root.height;
    const availableSpace = rootSize - totalFixedSize - totalGap -
      (padding.left ?? 0) - (padding.right ?? 0);

    // Distribute flex space
    const flexUnitSize = totalFlexGrow > 0 ? availableSpace / totalFlexGrow : 0;

    // Position children
    let offset = isRow
      ? (padding.left ?? 0)
      : (padding.top ?? 0);

    for (const child of this.children) {
      const margin = child.props.margin ?? {};
      const marginStart = isRow ? (margin.left ?? 0) : (margin.top ?? 0);
      const crossMargin = isRow ? (margin.top ?? 0) : (margin.left ?? 0);

      offset += marginStart;

      let mainSize: number;
      if (child.props.flexGrow) {
        mainSize = flexUnitSize * child.props.flexGrow;
      } else {
        mainSize = isRow
          ? (child.props.width ?? child.container.width)
          : (child.props.height ?? child.container.height);
      }

      // Cross axis alignment
      const crossSize = isRow
        ? (child.props.height ?? child.container.height)
        : (child.props.width ?? child.container.width);

      const rootCross = isRow
        ? this.root.height - (padding.top ?? 0) - (padding.bottom ?? 0)
        : this.root.width - (padding.left ?? 0) - (padding.right ?? 0);

      let crossOffset: number;
      const alignSelf = child.props.alignSelf ?? this.config.alignItems;
      switch (alignSelf) {
        case 'center':
          crossOffset = (rootCross - crossSize) / 2 + (isRow ? (padding.top ?? 0) : (padding.left ?? 0));
          break;
        case 'end':
          crossOffset = rootCross - crossSize + (isRow ? (padding.top ?? 0) : (padding.left ?? 0));
          break;
        case 'stretch':
          crossOffset = isRow ? (padding.top ?? 0) : (padding.left ?? 0);
          if (isRow) child.container.height = rootCross;
          else child.container.width = rootCross;
          break;
        default: // 'start'
          crossOffset = (isRow ? (padding.top ?? 0) : (padding.left ?? 0)) + crossMargin;
      }

      // Apply position
      if (isRow) {
        child.container.position.set(offset, crossOffset);
        if (child.props.flexGrow) child.container.width = mainSize;
      } else {
        child.container.position.set(crossOffset, offset);
        if (child.props.flexGrow) child.container.height = mainSize;
      }

      offset += mainSize + gap;
    }
  }

  /**
   * Handle resize by recalculating layout.
   */
  onResize(width: number, height: number): void {
    this.root.width = width;
    this.root.height = height;
    this.layout();
  }
}
