/**
 * matchMedia function
 * Stub implementation for media query matching
 */

export function matchMedia(query: string): MediaQueryList {
  return {
    matches: true,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  } as MediaQueryList;
}

export default matchMedia;
