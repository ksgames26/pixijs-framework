type EventHandler = (...args: unknown[]) => void;

/**
 * Typed event bus for framework communication.
 * Modules MUST communicate through events, never by direct state access.
 */
export class EventBus {
  private handlers = new Map<string, Set<EventHandler>>();

  /**
   * Subscribe to an event.
   * @returns Unsubscribe function
   */
  on(event: string, handler: EventHandler): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);
    return () => this.off(event, handler);
  }

  /**
   * Subscribe to an event once. Auto-removes after first invocation.
   */
  once(event: string, handler: EventHandler): () => void {
    const wrapper: EventHandler = (...args) => {
      this.off(event, wrapper);
      handler(...args);
    };
    return this.on(event, wrapper);
  }

  /**
   * Unsubscribe from an event.
   */
  off(event: string, handler: EventHandler): void {
    this.handlers.get(event)?.delete(handler);
  }

  /**
   * Emit an event to all subscribers.
   */
  emit(event: string, ...args: unknown[]): void {
    const handlers = this.handlers.get(event);
    if (handlers) {
      for (const handler of handlers) {
        try {
          handler(...args);
        } catch (error) {
          console.error(`[EventBus] Error in handler for "${event}":`, error);
        }
      }
    }
  }

  /**
   * Remove all handlers for a specific event, or all events.
   */
  clear(event?: string): void {
    if (event) {
      this.handlers.delete(event);
    } else {
      this.handlers.clear();
    }
  }
}

/**
 * Framework event name constants.
 */
export const GameEvents = {
  APP_INIT: 'app:init',
  APP_CONTEXT_LOST: 'app:contextlost',
  APP_CONTEXT_RESTORED: 'app:contextrestored',
  APP_RENDERER_FALLBACK: 'app:rendererfallback',
  SCREEN_RESIZE: 'screen:resize',
  SCENE_SWITCH: 'scene:switch',
  SCENE_SWITCHED: 'scene:switched',
  ASSET_LOADED: 'asset:loaded',
  ASSET_UNLOADED: 'asset:unloaded',
  ASSET_ERROR: 'asset:error',
} as const;

export type GameEventName = (typeof GameEvents)[keyof typeof GameEvents];
