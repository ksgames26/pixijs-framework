import { scrollTo } from './scrollTo';

export function scrollBy(dx: number, dy: number): void {
  const win = (globalThis as any).window || (globalThis as any);
  const scrollX = (win.scrollX as number) || 0;
  const scrollY = (win.scrollY as number) || 0;
  scrollTo(scrollX + dx, scrollY + dy);
}

export default scrollBy;
