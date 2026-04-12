/**
 * Helper function to add offset region properties to DOM-like objects
 */

import { screenWidth, screenHeight } from './system-info';

export function offsetRegion(obj: any): void {
  if (!('offsetLeft' in obj)) {
    obj.offsetLeft = 0;
    obj.offsetTop = 0;
  }

  if (!('offsetWidth' in obj)) {
    obj.offsetWidth = screenWidth;
    obj.offsetHeight = screenHeight;
  }
}

export default offsetRegion;
