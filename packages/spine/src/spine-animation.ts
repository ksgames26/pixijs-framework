import { Spine } from '@esotericsoftware/spine-pixi-v8';
import type { SkeletonData, AnimationStateListener, TrackEntry } from '@esotericsoftware/spine-pixi-v8';

/**
 * Animation state event types.
 */
export type SpineEventType =
  | 'start'
  | 'interrupt'
  | 'end'
  | 'complete'
  | 'dispose'
  | 'event';

/**
 * Event callback function type.
 */
export type SpineEventCallback = (entry: TrackEntry, event?: unknown) => void;

/**
 * Wrapper class for Spine animations.
 * Provides a convenient API for controlling spine animations.
 *
 * @example
 * ```typescript
 * const hero = new SpineAnimation(spineData);
 *
 * // Play animation
 * hero.play('run', true);
 *
 * // Listen for events
 * hero.on('complete', (entry) => {
 *   console.log('Animation completed:', entry.animation.name);
 * });
 *
 * // Set skin
 * hero.setSkin('default');
 *
 * // Add to PixiJS stage
 * app.stage.addChild(hero.spine);
 * ```
 */
export class SpineAnimation {
  /** The underlying Spine instance */
  readonly spine: Spine;

  /** Skeleton data reference */
  readonly skeletonData: SkeletonData;

  /** Event listeners */
  private listeners = new Map<SpineEventType, Set<SpineEventCallback>>();

  constructor(skeletonData: SkeletonData) {
    this.skeletonData = skeletonData;
    this.spine = new Spine(skeletonData);
    this.setupDefaultListeners();
  }

  /**
   * Get the PixiJS container for this animation.
   * Alias for `spine` property.
   */
  get container(): Spine {
    return this.spine;
  }

  /**
   * Play an animation on the specified track.
   *
   * @param animationName - Name of the animation to play
   * @param loop - Whether to loop the animation
   * @param trackIndex - Track index (default: 0)
   * @returns TrackEntry for the started animation
   */
  play(animationName: string, loop = false, trackIndex = 0): TrackEntry {
    return this.spine.state.setAnimation(trackIndex, animationName, loop);
  }

  /**
   * Add an animation to the queue on the specified track.
   *
   * @param animationName - Name of the animation to add
   * @param loop - Whether to loop the animation
   * @param delay - Delay before starting (seconds), or 0 to start immediately after previous
   * @param trackIndex - Track index (default: 0)
   * @returns TrackEntry for the queued animation
   */
  addAnimation(animationName: string, loop = false, delay = 0, trackIndex = 0): TrackEntry {
    return this.spine.state.addAnimation(trackIndex, animationName, loop, delay);
  }

  /**
   * Set the empty animation on a track (clears current animation).
   *
   * @param trackIndex - Track index (default: 0)
   * @param mixDuration - Mix duration for transition
   * @returns TrackEntry
   */
  setEmptyAnimation(trackIndex = 0, mixDuration = 0): TrackEntry {
    return this.spine.state.setEmptyAnimation(trackIndex, mixDuration);
  }

  /**
   * Clear a specific track.
   *
   * @param trackIndex - Track index (default: 0)
   */
  clearTrack(trackIndex = 0): void {
    this.spine.state.clearTrack(trackIndex);
  }

  /**
   * Clear all tracks.
   */
  clearTracks(): void {
    this.spine.state.clearTracks();
  }

  /**
   * Stop all animations on all tracks.
   */
  stop(): void {
    this.spine.state.clearTracks();
  }

  /**
   * Pause animation updates.
   */
  pause(): void {
    this.spine.autoUpdate = false;
  }

  /**
   * Resume animation updates.
   */
  resume(): void {
    this.spine.autoUpdate = true;
  }

  /**
   * Check if auto-update is enabled.
   */
  get isPlaying(): boolean {
    return this.spine.autoUpdate;
  }

  /**
   * Get the current animation name on a track.
   *
   * @param trackIndex - Track index (default: 0)
   * @returns Animation name or null
   */
  getCurrentAnimation(trackIndex = 0): string | null {
    const entry = this.spine.state.getCurrent(trackIndex);
    return entry?.animation?.name ?? null;
  }

  /**
   * Set the skin by name.
   *
   * @param skinName - Name of the skin
   */
  setSkin(skinName: string): void {
    this.spine.skeleton.setSkinByName(skinName);
    this.spine.skeleton.setToSetupPose();
  }

  /**
   * Get available animation names.
   */
  getAnimationNames(): string[] {
    return this.skeletonData.animations.map(a => a.name);
  }

  /**
   * Get available skin names.
   */
  getSkinNames(): string[] {
    return this.skeletonData.skins.map(s => s.name);
  }

  /**
   * Set attachment for a slot.
   *
   * @param slotName - Slot name
   * @param attachmentName - Attachment name (null to clear)
   */
  setAttachment(slotName: string, attachmentName: string | null): void {
    this.spine.skeleton.setAttachment(slotName, attachmentName);
  }

  /**
   * Set a slot color.
   *
   * @param slotName - Slot name
   * @param r - Red (0-1)
   * @param g - Green (0-1)
   * @param b - Blue (0-1)
   * @param a - Alpha (0-1)
   */
  setSlotColor(slotName: string, r: number, g: number, b: number, a: number): void {
    const slot = this.spine.skeleton.findSlot(slotName);
    if (slot) {
      slot.color.set(r, g, b, a);
    }
  }

  /**
   * Set the mix duration between two animations.
   *
   * @param fromAnimation - Source animation name
   * @param toAnimation - Target animation name
   * @param duration - Mix duration in seconds
   */
  setMix(fromAnimation: string, toAnimation: string, duration: number): void {
    this.spine.stateData.setMix(fromAnimation, toAnimation, duration);
  }

  /**
   * Register an event listener.
   *
   * @param event - Event type
   * @param callback - Callback function
   */
  on(event: SpineEventType, callback: SpineEventCallback): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  /**
   * Remove an event listener.
   *
   * @param event - Event type
   * @param callback - Callback function
   */
  off(event: SpineEventType, callback: SpineEventCallback): void {
    this.listeners.get(event)?.delete(callback);
  }

  /**
   * Register a one-time event listener.
   *
   * @param event - Event type
   * @param callback - Callback function
   */
  once(event: SpineEventType, callback: SpineEventCallback): void {
    const onceCallback: SpineEventCallback = (entry, evt) => {
      this.off(event, onceCallback);
      callback(entry, evt);
    };
    this.on(event, onceCallback);
  }

  /**
   * Update the animation manually (when autoUpdate is false).
   *
   * @param delta - Delta time in seconds
   */
  update(delta: number): void {
    this.spine.update(delta);
  }

  /**
   * Set the position of the spine container.
   */
  setPosition(x: number, y: number): void {
    this.spine.position.set(x, y);
  }

  /**
   * Set the scale of the spine container.
   */
  setScale(x: number, y?: number): void {
    this.spine.scale.set(x, y ?? x);
  }

  /**
   * Set the rotation of the spine container.
   */
  setRotation(rotation: number): void {
    this.spine.rotation = rotation;
  }

  /**
   * Flip the skeleton horizontally.
   */
  setFlipX(flip: boolean): void {
    this.spine.skeleton.scaleX = flip ? -1 : 1;
  }

  /**
   * Flip the skeleton vertically.
   */
  setFlipY(flip: boolean): void {
    this.spine.skeleton.scaleY = flip ? -1 : 1;
  }

  /**
   * Destroy the animation and release resources.
   */
  destroy(): void {
    this.listeners.clear();
    this.spine.destroy();
  }

  /**
   * Setup default event listeners that forward to our callback system.
   */
  private setupDefaultListeners(): void {
    const state = this.spine.state;

    state.addListener({
      start: (entry) => this.emit('start', entry),
      interrupt: (entry) => this.emit('interrupt', entry),
      end: (entry) => this.emit('end', entry),
      complete: (entry) => this.emit('complete', entry),
      dispose: (entry) => this.emit('dispose', entry),
      event: (entry, event) => this.emit('event', entry, event),
    });
  }

  /**
   * Emit an event to registered listeners.
   */
  private emit(event: SpineEventType, entry: TrackEntry, data?: unknown): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      for (const callback of callbacks) {
        callback(entry, data);
      }
    }
  }
}
