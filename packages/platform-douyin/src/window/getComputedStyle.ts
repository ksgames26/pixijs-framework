import { defaultStyles, getImageComputedStyle, getCanvasComputedStyle } from '../util/css-style';

/**
 * getComputedStyle function
 * Returns computed styles for DOM elements
 */

export function getComputedStyle(element: Element): CSSStyleDeclaration {
  const tagName = element.tagName;

  if (tagName === 'CANVAS') {
    return getCanvasComputedStyle(element as HTMLCanvasElement) as unknown as CSSStyleDeclaration;
  }

  if (tagName === 'IMG') {
    return getImageComputedStyle(element as HTMLImageElement) as unknown as CSSStyleDeclaration;
  }

  return defaultStyles as unknown as CSSStyleDeclaration;
}

export default getComputedStyle;
