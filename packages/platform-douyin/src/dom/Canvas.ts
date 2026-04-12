/// <reference path="../types/tt.d.ts" />

declare const tt: TT.TTAPI;

import { HTMLCanvasElement } from './HTMLCanvasElement';
import { parentNode } from '../util/parent-node';
import { initializeStyle } from '../util/style';
import { classList } from '../util/class-list';
import { clientRegion } from '../util/client-region';
import { offsetRegion } from '../util/offset-region';
import { dataset } from '../util/dataset';
import { document } from './document';

/**
 * Canvas class
 * Wraps tt.createCanvas() for DOM compatibility
 */
export class Canvas extends HTMLCanvasElement {
  private _canvas: HTMLCanvasElement & { width: number; height: number; getContext: any; toDataURL?: any };

  constructor() {
    super();
    this._canvas = tt.createCanvas() as any;

    if (!('tagName' in this._canvas)) {
      (this._canvas as any).tagName = 'CANVAS';
    }
    (this._canvas as any).type = 'canvas';

    parentNode(this._canvas, 2);
    initializeStyle(this._canvas);
    classList(this._canvas);
    clientRegion(this._canvas);
    offsetRegion(this._canvas);
    dataset(this._canvas);
  }

  get canvas(): HTMLCanvasElement {
    return this._canvas;
  }

  set width(value: number) {
    this._canvas.width = value;
  }

  get width(): number {
    return this._canvas.width;
  }

  set height(value: number) {
    this._canvas.height = value;
  }

  get height(): number {
    return this._canvas.height;
  }

  getContext(contextType: string, contextAttributes?: any): RenderingContext | null {
    return this._canvas.getContext(contextType as any, contextAttributes);
  }

  toDataURL(type?: string, encoderOptions?: number): string {
    return this._canvas.toDataURL?.(type, encoderOptions) || '';
  }

  focus(): void {
    // No-op
  }

  blur(): void {
    // No-op
  }

  addEventListener(type: string, listener: (event: any) => void, _options: any = {}): void {
    document.addEventListener(type, listener);
  }

  removeEventListener(type: string, listener: (event: any) => void): void {
    document.removeEventListener(type, listener);
  }

  dispatchEvent(event: any = {}): boolean {
    console.log('canvas.dispatchEvent', event.type, event);
    return true;
  }
}

export default Canvas;
