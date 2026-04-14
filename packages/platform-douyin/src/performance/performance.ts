/**
 * Performance object
 * Provides performance timing interface
 */




let performanceImpl: any;

if (tt.getPerformance) {
  const systemInfo = tt.getSystemInfoSync();
  const ttPerf = tt.getPerformance();
  const initTime = ttPerf.now();

  const clientPerfAdapter = Object.assign({}, ttPerf, {
    now: function () {
      return (ttPerf.now() - initTime) / 1000;
    },
  });

  performanceImpl = systemInfo.platform === 'devtools' ? ttPerf : clientPerfAdapter;
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
