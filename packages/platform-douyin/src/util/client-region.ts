/**
 * Helper function to add client region properties and getBoundingClientRect
 * to DOM-like objects
 */

import { screenWidth, screenHeight } from './system-info';

export function clientRegion(obj: any): void {
  if (!('clientLeft' in obj)) {
    obj.clientLeft = 0;
    obj.clientTop = 0;
  }

  if (!('clientWidth' in obj)) {
    obj.clientWidth = screenWidth;
    obj.clientHeight = screenHeight;
  }

  if (!('getBoundingClientRect' in obj)) {
    obj.getBoundingClientRect = function (): DOMRect {
      const ret = {
        x: 0,
        y: 0,
        top: 0,
        left: 0,
        width: this.clientWidth,
        height: this.clientHeight,
        right: 0,
        bottom: 0,
        toJSON(): string {
          return JSON.stringify(ret);
        },
      };
      ret.right = ret.width;
      ret.bottom = ret.height;
      return ret as DOMRect;
    };
  }
}

export default clientRegion;
