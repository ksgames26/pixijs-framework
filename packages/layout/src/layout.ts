import { Container } from 'pixi.js';

// @pixi/layout types (declared here since we can't access the actual package types)
interface PixiLayoutOptions {
  display?: 'flex' | 'grid' | 'block';
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  alignContent?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'space-between' | 'space-around';
  gap?: number;
  padding?: number | { top?: number; right?: number; bottom?: number; left?: number };
  width?: number | string;
  height?: number | string;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  overflow?: 'visible' | 'hidden';
  anchor?: number | { x?: number; y?: number };
  scale?: number | { x?: number; y?: number };
  position?: { x?: number; y?: number };
}

declare class PixiLayout extends Container {
  constructor(options?: PixiLayoutOptions);
  init(options: PixiLayoutOptions): void;
  resize(width?: number, height?: number): void;
  readonly layoutWidth: number;
  readonly layoutHeight: number;
}

/**
 * Layout options for creating a flex container.
 */
export interface LayoutOptions {
  /** Main axis direction */
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  /** Whether to wrap children to new lines */
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  /** Main axis alignment */
  justifyContent?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  /** Cross axis alignment */
  alignItems?: 'start' | 'end' | 'center' | 'stretch' | 'baseline';
  /** Multi-line alignment (when wrap is enabled) */
  alignContent?: 'start' | 'end' | 'center' | 'stretch' | 'between' | 'around';
  /** Gap between children */
  gap?: number;
  /** Padding */
  padding?: number | { top?: number; right?: number; bottom?: number; left?: number };
  /** Container width (number for pixels, string for percentages like '100%') */
  width?: number | string;
  /** Container height (number for pixels, string for percentages like '100%') */
  height?: number | string;
  /** Minimum width */
  minWidth?: number;
  /** Minimum height */
  minHeight?: number;
  /** Maximum width */
  maxWidth?: number;
  /** Maximum height */
  maxHeight?: number;
  /** Overflow behavior */
  overflow?: 'visible' | 'hidden';
}

/**
 * Layout options for individual children.
 */
export interface ChildLayoutOptions {
  /** Flex grow factor */
  flexGrow?: number;
  /** Flex shrink factor */
  flexShrink?: number;
  /** Flex basis (number for pixels, string for percentages) */
  flexBasis?: number | string | 'auto';
  /** Self alignment override */
  alignSelf?: 'auto' | 'start' | 'end' | 'center' | 'stretch';
  /** Fixed width (overrides flex) */
  width?: number | string;
  /** Fixed height (overrides flex) */
  height?: number | string;
  /** Minimum width */
  minWidth?: number;
  /** Minimum height */
  minHeight?: number;
  /** Maximum width */
  maxWidth?: number;
  /** Maximum height */
  maxHeight?: number;
  /** Margin around the child */
  margin?: number | { top?: number; right?: number; bottom?: number; left?: number };
}

/**
 * Initialize the layout system with @pixi/layout.
 * Call this before using Layout.
 */
export function initLayout(_pixiLayoutModule: typeof PixiLayout): void {
  // Layout module is now used directly via init() method on Layout instances
}

/**
 * Flexbox layout container based on @pixi/layout.
 *
 * @example
 * ```typescript
 * import { Layout } from '@ksgames26/layout';
 * import { Layout as PixiLayout } from '@pixi/layout';
 *
 * initLayout(PixiLayout);
 *
 * const layout = new Layout({
 *   direction: 'row',
 *   justifyContent: 'center',
 *   alignItems: 'center',
 *   gap: 10
 * });
 *
 * // Add children with layout options
 * layout.addChildWithLayout(sprite1, { flexGrow: 1 });
 * layout.addChildWithLayout(sprite2, { flexGrow: 2 });
 * ```
 */
export class Layout extends Container {
  private layoutContainer: PixiLayout | null = null;
  private options: LayoutOptions;

  constructor(options: LayoutOptions = {}) {
    super();
    this.options = options;
  }

  /**
   * Initialize the layout with @pixi/layout class.
   * Must be called before adding children.
   */
  init(LayoutConstructor: typeof PixiLayout): void {
    if (this.layoutContainer) return;

    const pixiOptions = this.convertOptions(this.options);
    this.layoutContainer = new LayoutConstructor(pixiOptions);
    super.addChild(this.layoutContainer);
  }

  /**
   * Add a child with layout options.
   */
  addChildWithLayout<T extends Container>(
    child: T,
    layoutOptions: ChildLayoutOptions = {}
  ): T {
    if (!this.layoutContainer) {
      throw new Error(
        '[Layout] Must call init() with @pixi/layout class before adding children. ' +
        'Example: layout.init(PixiLayout)'
      );
    }

    // Apply layout options as metadata on the child
    (child as any).__layoutOptions = layoutOptions;

    // Add to layout container
    this.layoutContainer.addChild(child);

    // Update layout
    this.refresh();

    return child;
  }

  /**
   * Remove a child from the layout.
   */
  removeChildWithLayout<T extends Container>(child: T): T {
    if (this.layoutContainer) {
      this.layoutContainer.removeChild(child);
      delete (child as any).__layoutOptions;
      this.refresh();
    }
    return child;
  }

  /**
   * Update layout options.
   */
  setLayoutOptions(options: Partial<LayoutOptions>): void {
    this.options = { ...this.options, ...options };
    if (this.layoutContainer) {
      const pixiOptions = this.convertOptions(this.options);
      this.layoutContainer.init(pixiOptions);
    }
  }

  /**
   * Update child's layout options.
   */
  setChildLayoutOptions(child: Container, options: ChildLayoutOptions): void {
    (child as any).__layoutOptions = { ...(child as any).__layoutOptions, ...options };
    this.refresh();
  }

  /**
   * Refresh the layout.
   */
  refresh(): void {
    // @pixi/layout handles layout automatically
  }

  /**
   * Resize the layout container.
   */
  resize(width?: number, height?: number): void {
    if (this.layoutContainer) {
      this.layoutContainer.resize(width, height);
    }
  }

  /**
   * Get the inner layout container.
   */
  getLayoutContainer(): PixiLayout | null {
    return this.layoutContainer;
  }

  /**
   * Convert our options to @pixi/layout options.
   */
  private convertOptions(options: LayoutOptions): PixiLayoutOptions {
    return {
      display: 'flex',
      flexDirection: options.direction ?? 'column',
      flexWrap: options.wrap ?? 'nowrap',
      justifyContent: this.convertJustifyContent(options.justifyContent),
      alignItems: this.convertAlignItems(options.alignItems),
      alignContent: this.convertAlignContent(options.alignContent),
      gap: options.gap,
      padding: options.padding,
      width: options.width,
      height: options.height,
      minWidth: options.minWidth,
      minHeight: options.minHeight,
      maxWidth: options.maxWidth,
      maxHeight: options.maxHeight,
      overflow: options.overflow,
    };
  }

  private convertJustifyContent(
    value?: LayoutOptions['justifyContent']
  ): PixiLayoutOptions['justifyContent'] {
    const map: Record<string, PixiLayoutOptions['justifyContent']> = {
      start: 'flex-start',
      end: 'flex-end',
      center: 'center',
      between: 'space-between',
      around: 'space-around',
      evenly: 'space-evenly',
    };
    return map[value ?? 'start'];
  }

  private convertAlignItems(
    value?: LayoutOptions['alignItems']
  ): PixiLayoutOptions['alignItems'] {
    const map: Record<string, PixiLayoutOptions['alignItems']> = {
      start: 'flex-start',
      end: 'flex-end',
      center: 'center',
      stretch: 'stretch',
      baseline: 'baseline',
    };
    return map[value ?? 'stretch'];
  }

  private convertAlignContent(
    value?: LayoutOptions['alignContent']
  ): PixiLayoutOptions['alignContent'] {
    const map: Record<string, PixiLayoutOptions['alignContent']> = {
      start: 'flex-start',
      end: 'flex-end',
      center: 'center',
      stretch: 'stretch',
      between: 'space-between',
      around: 'space-around',
    };
    return map[value ?? 'stretch'];
  }

  override destroy(options?: { children?: boolean; texture?: boolean; baseTexture?: boolean }): void {
    this.layoutContainer = null;
    super.destroy(options);
  }
}

/**
 * Create a row layout (horizontal flex).
 */
export function createRowLayout(options: Omit<LayoutOptions, 'direction'> = {}): Layout {
  return new Layout({ ...options, direction: 'row' });
}

/**
 * Create a column layout (vertical flex).
 */
export function createColumnLayout(options: Omit<LayoutOptions, 'direction'> = {}): Layout {
  return new Layout({ ...options, direction: 'column' });
}

/**
 * Create a centered layout (content centered both axes).
 */
export function createCenteredLayout(options: Omit<LayoutOptions, 'justifyContent' | 'alignItems'> = {}): Layout {
  return new Layout({
    ...options,
    justifyContent: 'center',
    alignItems: 'center',
  });
}
