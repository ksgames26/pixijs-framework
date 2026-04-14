

import { HTMLAudioElement } from '../dom/HTMLAudioElement';

const HAVE_NOTHING = 0;
const HAVE_METADATA = 1;
const HAVE_CURRENT_DATA = 2;
const HAVE_FUTURE_DATA = 3;
const HAVE_ENOUGH_DATA = 4;

const _innerAudioContext = new WeakMap<Audio, WechatMinigame.InnerAudioContext>();
const _src = new WeakMap<Audio, string>();

export class Audio extends HTMLAudioElement {
  static readonly HAVE_NOTHING = HAVE_NOTHING;
  static readonly HAVE_METADATA = HAVE_METADATA;
  static readonly HAVE_CURRENT_DATA = HAVE_CURRENT_DATA;
  static readonly HAVE_FUTURE_DATA = HAVE_FUTURE_DATA;
  static readonly HAVE_ENOUGH_DATA = HAVE_ENOUGH_DATA;

  public readyState: number = HAVE_NOTHING;

  constructor(url?: string) {
    super();

    _src.set(this, '');

    const innerAudioContext = wx.createInnerAudioContext();
    _innerAudioContext.set(this, innerAudioContext);

    innerAudioContext.onCanplay(() => {
      this.dispatchEvent({ type: 'load' });
      this.dispatchEvent({ type: 'loadend' });
      this.dispatchEvent({ type: 'canplay' });
      this.dispatchEvent({ type: 'canplaythrough' });
      this.dispatchEvent({ type: 'loadedmetadata' });
      this.readyState = HAVE_CURRENT_DATA;
    });

    innerAudioContext.onPlay(() => {
      this.dispatchEvent({ type: 'play' });
    });

    innerAudioContext.onPause(() => {
      this.dispatchEvent({ type: 'pause' });
    });

    innerAudioContext.onEnded(() => {
      this.dispatchEvent({ type: 'ended' });
      this.readyState = HAVE_ENOUGH_DATA;
    });

    innerAudioContext.onError(() => {
      this.dispatchEvent({ type: 'error' });
    });

    if (url) {
      _innerAudioContext.get(this)!.src = url;
    }
  }

  load(): void {
    console.warn('HTMLAudioElement.load() is not implemented.');
  }

  play(): void {
    _innerAudioContext.get(this)!.play();
  }

  pause(): void {
    _innerAudioContext.get(this)!.pause();
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

  get currentTime(): number {
    return _innerAudioContext.get(this)!.currentTime;
  }

  set currentTime(value: number) {
    _innerAudioContext.get(this)!.seek(value);
  }

  get src(): string {
    return _src.get(this) || '';
  }

  set src(value: string) {
    _src.set(this, value);
    _innerAudioContext.get(this)!.src = value;
  }

  get loop(): boolean {
    return _innerAudioContext.get(this)!.loop;
  }

  set loop(value: boolean) {
    _innerAudioContext.get(this)!.loop = value;
  }

  get autoplay(): boolean {
    return _innerAudioContext.get(this)!.autoplay;
  }

  set autoplay(value: boolean) {
    _innerAudioContext.get(this)!.autoplay = value;
  }

  get paused(): boolean {
    return _innerAudioContext.get(this)!.paused;
  }

  cloneNode(): Audio {
    const newAudio = new Audio();
    newAudio.loop = this.loop;
    newAudio.autoplay = this.autoplay;
    newAudio.src = this.src;
    return newAudio;
  }
}

export default Audio;
