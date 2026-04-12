import { Event } from './Event';

/**
 * MouseEvent class
 * Represents mouse/pointer events
 */
export class MouseEvent extends Event {
  public clientX: number;
  public clientY: number;
  public screenX: number;
  public screenY: number;
  public pageX: number;
  public pageY: number;
  public button: number;
  public buttons: number;
  public ctrlKey: boolean;
  public altKey: boolean;
  public shiftKey: boolean;
  public metaKey: boolean;

  constructor(type: string) {
    super(type);
    this.clientX = 0;
    this.clientY = 0;
    this.screenX = 0;
    this.screenY = 0;
    this.pageX = 0;
    this.pageY = 0;
    this.button = 0;
    this.buttons = 0;
    this.ctrlKey = false;
    this.altKey = false;
    this.shiftKey = false;
    this.metaKey = false;
  }
}

export default MouseEvent;
