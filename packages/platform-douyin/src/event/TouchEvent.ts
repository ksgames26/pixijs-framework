import { Event } from './Event';

/**
 * Touch interface
 */
export interface Touch {
  identifier: number;
  pageX: number;
  pageY: number;
  clientX: number;
  clientY: number;
  force?: number;
  radiusX?: number;
  radiusY?: number;
}

/**
 * TouchEvent class
 * Represents touch events from the device
 */
export class TouchEvent extends Event {
  public touches: Touch[];
  public targetTouches: Touch[];
  public changedTouches: Touch[];

  constructor(type: string) {
    super(type);
    this.touches = [];
    this.targetTouches = [];
    this.changedTouches = [];

    // Target is typically the canvas in mini-game environments
    const canvas = (globalThis as any).canvas;
    this.target = canvas;
    this.currentTarget = canvas;
  }
}

export default TouchEvent;
