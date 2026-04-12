import { scrollTo } from './scrollTo';

/**
 * Scroll by delta
 * Stub implementation for scroll operations
 */

export function scrollBy(dx: number, dy: number): void {
  // Use actual scroll position from window if available
  const win = (globalThis as any).window || (globalThis as any);
  const scrollX = (win.scrollX as number) || 0;
  const scrollY = (win.scrollY as number) || 0;
  scrollTo(scrollX + dx, scrollY + dy);
}

export default scrollBy;
