import { HTMLAudioElement } from './HTMLAudioElement';
import { Event } from '../event/Event';





let SN_SEED = 1;
const _innerAudioContextMap: Record<number, TT.InnerAudioContext> = {};

/**
 * Audio class
 * Wraps tt.createInnerAudioContext() for DOM compatibility
 */
export class Audio extends HTMLAudioElement {
  // Constants
  static readonly HAVE_NOTHING = 0;
  static readonly HAVE_METADATA = 1;
  static readonly HAVE_CURRENT_DATA = 2;
  static readonly HAVE_FUTURE_DATA = 3;
  static readonly HAVE_ENOUGH_DATA = 4;

  // Private
  private _$sn: number;
  private _src: string = '';
  private _loop: boolean = false;
  private _autoplay: boolean = false;
  private _paused: boolean = true;
  private _volume: number = 1;
  private _muted: boolean = false;
  private _loaded: boolean = false;
  private _canplayEvents: string[];

  public readyState: number = Audio.HAVE_NOTHING;

  constructor(url?: string) {
    super();
    this._$sn = SN_SEED++;
    this._canplayEvents = ['load', 'loadend', 'canplay', 'canplaythrough', 'loadedmetadata'];

    const innerAudioContext = tt.createInnerAudioContext();
    _innerAudioContextMap[this._$sn] = innerAudioContext;

    // Set up event handlers
    innerAudioContext.onCanplay(() => {
      this._loaded = true;
      this.readyState = Audio.HAVE_CURRENT_DATA;
      this._canplayEvents.forEach(type => {
        this.dispatchEvent(new Event(type));
      });
    });

    innerAudioContext.onPlay(() => {
      this._paused = _innerAudioContextMap[this._$sn].paused;
      this.dispatchEvent(new Event('play'));
    });

    innerAudioContext.onPause(() => {
      this._paused = _innerAudioContextMap[this._$sn].paused;
      this.dispatchEvent(new Event('pause'));
    });

    innerAudioContext.onEnded(() => {
      this._paused = _innerAudioContextMap[this._$sn].paused;
      if (!_innerAudioContextMap[this._$sn].loop) {
        this.dispatchEvent(new Event('ended'));
      }
      this.readyState = Audio.HAVE_ENOUGH_DATA;
    });

    innerAudioContext.onError(() => {
      this._paused = _innerAudioContextMap[this._$sn].paused;
      this.dispatchEvent(new Event('error'));
    });

    // Initialize with URL if provided
    if (url) {
      this.src = url;
    }

    this._loop = innerAudioContext.loop;
    this._autoplay = innerAudioContext.autoplay;
    this._paused = innerAudioContext.paused;
    this._volume = innerAudioContext.volume;
  }

  addEventListener(type: string, listener: (event: any) => void, options: any = {}): void {
    type = String(type).toLowerCase();
    super.addEventListener(type, listener as any, options);
    if (this._loaded && this._canplayEvents.indexOf(type) !== -1) {
      this.dispatchEvent(new Event(type));
    }
  }

  load(): void {
    // Stub - loading is handled by setting src
  }

  play(): Promise<void> {
    _innerAudioContextMap[this._$sn].play();
    return Promise.resolve();
  }

  resume(): void {
    _innerAudioContextMap[this._$sn].play();
  }

  pause(): void {
    _innerAudioContextMap[this._$sn].pause();
  }

  destroy(): void {
    _innerAudioContextMap[this._$sn].destroy();
  }

  canPlayType(mediaType: string = ''): string {
    if (typeof mediaType !== 'string') {
      return '';
    }
    if (mediaType.indexOf('audio/mpeg') > -1 || mediaType.indexOf('audio/mp4') > -1) {
      return 'probably';
    }
    return '';
  }

  // Getters and setters
  get currentTime(): number {
    return _innerAudioContextMap[this._$sn].currentTime;
  }

  set currentTime(value: number) {
    _innerAudioContextMap[this._$sn].seek(value);
  }

  get duration(): number {
    return _innerAudioContextMap[this._$sn].duration;
  }

  get src(): string {
    return this._src;
  }

  set src(value: string) {
    this._src = value;
    this._loaded = false;
    this.readyState = Audio.HAVE_NOTHING;
    _innerAudioContextMap[this._$sn].src = value;
  }

  get loop(): boolean {
    return this._loop;
  }

  set loop(value: boolean) {
    this._loop = value;
    _innerAudioContextMap[this._$sn].loop = value;
  }

  get autoplay(): boolean {
    return this._autoplay;
  }

  set autoplay(value: boolean) {
    this._autoplay = value;
    _innerAudioContextMap[this._$sn].autoplay = value;
  }

  get paused(): boolean {
    return this._paused;
  }

  get volume(): number {
    return this._volume;
  }

  set volume(value: number) {
    this._volume = value;
    if (!this._muted) {
      _innerAudioContextMap[this._$sn].volume = value;
    }
  }

  get muted(): boolean {
    return this._muted;
  }

  set muted(value: boolean) {
    this._muted = value;
    if (value) {
      _innerAudioContextMap[this._$sn].volume = 0;
    } else {
      _innerAudioContextMap[this._$sn].volume = this._volume;
    }
  }

  cloneNode(): any {
    const newAudio = new Audio();
    newAudio.loop = this.loop;
    newAudio.autoplay = this.autoplay;
    newAudio.src = this.src;
    return newAudio;
  }
}

export default Audio;
