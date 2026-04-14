/**
 * Cached system info to avoid repeated calls to tt.getSystemInfoSync()
 */





const systemInfo = tt.getSystemInfoSync();

export const screenWidth = systemInfo.screenWidth;
export const screenHeight = systemInfo.screenHeight;

export default systemInfo;
