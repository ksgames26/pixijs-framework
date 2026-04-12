# Public API Contract: @ksgames26/ui

Package: `@ksgames26/ui` (optional)
Depends: `@ksgames26/core`, `@pixi/ui`

## UITier

```typescript
class UITier extends Module {
  readonly name = 'ui';

  /** UI 根容器（始终在游戏内容之上） */
  readonly root: Container;

  /** 添加具名 UI 层 */
  addLayer(name: string, zIndex: number): Container;

  /** 获取 UI 层 */
  getLayer(name: string): Container | undefined;

  /** 移除 UI 层 */
  removeLayer(name: string): void;

  /** 将元素添加到指定层 */
  addToLayer(layerName: string, element: Container): void;
}
```

## LayoutEngine

```typescript
class LayoutEngine {
  constructor(root: Container, config?: LayoutConfig);

  /** 执行布局计算 */
  layout(): void;

  /** 添加带布局属性的子元素 */
  addChild(child: Container, props: LayoutProps): void;

  /** 移除子元素 */
  removeChild(child: Container): void;

  /** 响应画布尺寸变化 */
  onResize(width: number, height: number): void;
}

interface LayoutConfig {
  /** 主轴方向 */
  direction?: 'row' | 'column';
  /** 主轴对齐 */
  justifyContent?: 'start' | 'center' | 'end' | 'between';
  /** 交叉轴对齐 */
  alignItems?: 'start' | 'center' | 'end' | 'stretch';
  /** 元素间距 */
  gap?: number;
  /** 内边距 */
  padding?: { top?: number; right?: number; bottom?: number; left?: number };
}

interface LayoutProps {
  /** 固定宽度 */
  width?: number;
  /** 固定高度 */
  height?: number;
  /** 弹性增长因子 */
  flexGrow?: number;
  /** 弹性收缩因子 */
  flexShrink?: number;
  /** 基础尺寸 */
  flexBasis?: number | 'auto';
  /** 自身对齐覆盖 */
  alignSelf?: 'start' | 'center' | 'end' | 'stretch';
  /** 外边距 */
  margin?: { top?: number; right?: number; bottom?: number; left?: number };
}
```
