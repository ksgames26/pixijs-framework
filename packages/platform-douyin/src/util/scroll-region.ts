/**
 * Helper function to add scroll region properties to DOM-like objects
 */

import { screenWidth, screenHeight } from './system-info';

export function scrollRegion(obj: any): void {
  if (!('scrollLeft' in obj)) {
    obj.scrollLeft = 0;
    obj.scrollTop = 0;
  }

  if (!('scrollWidth' in obj)) {
    obj.scrollWidth = screenWidth;
    obj.scrollHeight = screenHeight;
  }
}

export default scrollRegion;
