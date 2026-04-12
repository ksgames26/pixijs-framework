import { noop } from '../util/noop';

/// <reference path="../types/tt.d.ts" />

declare const tt: TT.TTAPI;

/**
 * Navigator object
 * Provides browser-like navigator interface
 */

const systemInfo = tt.getSystemInfoSync();
const system = systemInfo.system;
const platform = systemInfo.platform;
const language = systemInfo.language;
const android = system.toLowerCase().indexOf('android') !== -1;

const uaDesc = android
  ? 'Android; CPU Android 6.0'
  : 'iPhone; CPU iPhone OS 10_3_1 like Mac OS X';

const ua = `Mozilla/5.0 (${uaDesc}) AppleWebKit/603.1.30 (KHTML, like Gecko) Mobile/14E8301 MicroMessenger/6.6.0 MiniGame NetType/WIFI Language/${language}`;

export const navigator: Navigator = {
  platform: platform,
  language: language,
  appVersion: `5.0 (${uaDesc}) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1`,
  userAgent: ua,
  onLine: true,
  geolocation: {
    getCurrentPosition: noop as any,
    watchPosition: noop as any,
    clearWatch: noop as any,
  },
} as Navigator;

// Set up network status listener
if (tt.onNetworkStatusChange) {
  tt.onNetworkStatusChange((event: TT.NetworkStatus) => {
    (navigator as any).onLine = event.isConnected;
  });
}

export default navigator;
