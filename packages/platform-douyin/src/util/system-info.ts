/**
 * Cached system info to avoid repeated calls to tt.getSystemInfoSync()
 */

/// <reference path="../types/tt.d.ts" />

declare const tt: TT.TTAPI;

const systemInfo = tt.getSystemInfoSync();

export const screenWidth = systemInfo.screenWidth;
export const screenHeight = systemInfo.screenHeight;

export default systemInfo;
