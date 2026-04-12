/**
 * Helper function to initialize style properties on DOM-like objects
 * Uses cached system info for dimensions
 */

import { screenWidth, screenHeight } from './system-info';

export function initializeStyle(obj: any): void {
  obj.style = obj.style || {};
  Object.assign(obj.style, {
    top: '0px',
    left: '0px',
    width: `${screenWidth}px`,
    height: `${screenHeight}px`,
    margin: '0px',
    padding: '0px',
  });
}

export default initializeStyle;
