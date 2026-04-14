

import { noop } from '../util/noop';

const { platform } = wx.getSystemInfoSync();

export const navigator: Navigator = {
  platform: platform,
  language: 'zh-cn',
  appVersion: '5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Mobile/14E8301 MicroMessenger/6.6.0 MiniGame NetType/WIFI Language/zh_CN',
  onLine: true,
  geolocation: {
    getCurrentPosition: noop as any,
    watchPosition: noop as any,
    clearWatch: noop as any,
  },
} as Navigator;

export default navigator;
