import type { Application } from 'pixi.js';
import type { PlatformAdapter } from './platform';
import type { EventBus } from './events';
import { GameEvents } from './events';

/**
 * Responsive screen adapter.
 * Uses PlatformAdapter.onResize() for event-driven resize detection (zero polling).
 * Emits 'screen:resize' via EventBus when canvas dimensions change.
 */
export class ScreenAdapter {
  private app: Application;
  private platform: PlatformAdapter;
  private events: EventBus;
  private unsubscribe: (() => void) | null = null;
  private lastWidth = 0;
  private lastHeight = 0;

  constructor(app: Application, platform: PlatformAdapter, events: EventBus) {
    this.app = app;
    this.platform = platform;
    this.events = events;
  }

  /**
   * Start listening for resize events via PlatformAdapter.onResize().
   * Event-driven: no ticker polling, zero overhead when idle.
   */
  start(): void {
    // Initialize dimensions from current system info
    const sysInfo = this.platform.getSystemInfo();
    this.lastWidth = sysInfo.screenWidth;
    this.lastHeight = sysInfo.screenHeight;

    // Register platform-native resize callback
    this.unsubscribe = this.platform.onResize((width, height) => {
      this.handleResize(width, height);
    });
  }

  /**
   * Stop listening for resize events.
   */
  stop(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }

  /**
   * Handle resize: update renderer and emit event.
   */
  private handleResize(width: number, height: number): void {
    if (width !== this.lastWidth || height !== this.lastHeight) {
      this.lastWidth = width;
      this.lastHeight = height;
      this.app.renderer.resize(width, height);
      this.events.emit(GameEvents.SCREEN_RESIZE, width, height);
    }
  }

  /**
   * Get current screen dimensions.
   */
  get dimensions(): { width: number; height: number } {
    return {
      width: this.app.renderer.width,
      height: this.app.renderer.height,
    };
  }
}
