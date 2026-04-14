

import { noop } from '../util/noop';

export class Event {
  public readonly type: string;
  public readonly timeStamp: number;
  public cancelBubble: boolean;
  public cancelable: boolean;
  public target: any;
  public currentTarget: any;
  public preventDefault: () => void;
  public stopPropagation: () => void;

  constructor(type: string) {
    this.type = type;
    this.timeStamp = Date.now();
    this.cancelBubble = false;
    this.cancelable = false;
    this.target = null;
    this.currentTarget = null;
    this.preventDefault = noop;
    this.stopPropagation = noop;
  }
}

export default Event;
