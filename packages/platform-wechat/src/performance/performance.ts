/// <reference path="../types/wx.d.ts" />

let performanceImpl: any;

if (wx.getPerformance) {
  const { platform } = wx.getSystemInfoSync();
  const wxPerf = wx.getPerformance();
  const initTime = wxPerf.now();

  const clientPerfAdapter = Object.assign({}, wxPerf, {
    now: function () {
      return (wxPerf.now() - initTime) / 1000;
    },
  });

  performanceImpl = platform === 'devtools' ? wxPerf : clientPerfAdapter;
} else {
  const timeOrigin = Date.now();
  performanceImpl = {
    timeOrigin: timeOrigin,
    now: function () {
      return Date.now() - timeOrigin;
    },
  };
}

export const performance = performanceImpl as Performance;

export default performance;
