/**
 * Performance monitor for FPS, frame time, and frame time jitter.
 * Satisfies Constitution I: "MUST use PixiJS performance analysis tools
 * to regularly detect performance bottlenecks."
 *
 * Displays: FPS, frame time (ms), frame time jitter (ms), renderer type.
 */
export class PerfMonitor {
  private frameCount = 0;
  private lastTimestamp = 0;
  private currentFps = 0;
  private frameTimeMs = 0;
  private frameTimeJitterMs = 0;
  private frameTimes: number[] = [];
  private readonly maxFrameTimeSamples = 60;

  /** Current FPS */
  get fps(): number {
    return this.currentFps;
  }

  /** Current frame time in milliseconds */
  get frameTime(): number {
    return this.frameTimeMs;
  }

  /** Frame time jitter (standard deviation) in milliseconds */
  get frameTimeJitter(): number {
    return this.frameTimeJitterMs;
  }

  /**
   * Update the monitor with a new frame tick.
   * Call this on every frame from the PixiJS ticker.
   */
  tick(timestamp: number): void {
    this.frameCount++;

    if (this.lastTimestamp > 0) {
      const delta = timestamp - this.lastTimestamp;
      this.frameTimeMs = delta;

      // Track frame times for jitter calculation
      this.frameTimes.push(delta);
      if (this.frameTimes.length > this.maxFrameTimeSamples) {
        this.frameTimes.shift();
      }

      // Update FPS every second
      if (this.frameCount % 60 === 0 && this.frameTimes.length > 0) {
        const avgFrameTime = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
        this.currentFps = Math.round(1000 / avgFrameTime);
        this.frameTimeJitterMs = this.calculateJitter();
      }
    }

    this.lastTimestamp = timestamp;
  }

  /**
   * Reset all counters.
   */
  reset(): void {
    this.frameCount = 0;
    this.lastTimestamp = 0;
    this.currentFps = 0;
    this.frameTimeMs = 0;
    this.frameTimeJitterMs = 0;
    this.frameTimes.length = 0;
  }

  /**
   * Calculate frame time jitter (standard deviation).
   */
  private calculateJitter(): number {
    if (this.frameTimes.length < 2) return 0;

    const avg = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
    const variance = this.frameTimes.reduce((sum, t) => sum + (t - avg) ** 2, 0) / this.frameTimes.length;
    return Math.round(Math.sqrt(variance) * 100) / 100;
  }
}
