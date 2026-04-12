/**
 * Screen object
 * Provides screen dimensions information
 */

/// <reference path="../types/tt.d.ts" />
declare const tt: TT.TTAPI;

const systemInfo = tt.getSystemInfoSync();
const screenWidth = systemInfo.screenWidth;
const screenHeight = systemInfo.screenHeight;

export const screen = {
  width: screenWidth,
  height: screenHeight,
  availWidth: screenWidth,
  availHeight: screenHeight,
  availLeft: 0,
  availTop: 0,
  colorDepth: 24,
  pixelDepth: 24,
  orientation: { angle: 0, type: 'landscape-primary' },
} as unknown as Screen;

export default screen;
