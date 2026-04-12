import { HTMLElement } from '../dom/HTMLElement';

/**
 * HTMLMediaElement base class
 * Base class for media elements (audio, video)
 */
export class HTMLMediaElement extends HTMLElement {
  constructor(tagName: string) {
    super(tagName);
  }

  addTextTrack(): void {
    // Stub
  }

  captureStream(): MediaStream {
    return {} as MediaStream;
  }

  fastSeek(_time: number): void {
    // Stub
  }

  load(): void {
    // Stub
  }

  pause(): void {
    // Stub
  }

  play(): Promise<void> {
    return Promise.resolve();
  }
}

export default HTMLMediaElement;
