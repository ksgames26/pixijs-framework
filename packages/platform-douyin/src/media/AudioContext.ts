/**
 * AudioContext class
 * Wraps tt.getAudioContext() for Web Audio API compatibility
 *
 * Note: Original adapter extends Audio to provide audio playback
 * through the Audio interface while also providing Web Audio API methods.
 */

/// <reference path="../types/tt.d.ts" />

declare const tt: TT.TTAPI;

import { Audio } from './Audio';

export class AudioContext extends Audio {
  private _audioContext: any;

  constructor() {
    super();
    if (tt.getAudioContext) {
      this._audioContext = tt.getAudioContext();
    } else {
      this._audioContext = null;
    }
  }

  getContext(): void {
    // Stub
  }

  decodeAudioData(
    arrayBuffer: ArrayBuffer,
    successCallback?: (decodedData: AudioBuffer) => void,
    _errorCallback?: (error: Error) => void
  ): void {
    if (successCallback) {
      successCallback(arrayBuffer as unknown as AudioBuffer);
    }
  }

  createAnalyser(): AnalyserNode {
    return this._audioContext?.createAnalyser();
  }

  createBufferSource(): AudioBufferSourceNode {
    return this._audioContext?.createBufferSource?.() || this._audioContext?.creataBufferSource?.();
  }

  createGain(): GainNode {
    const gainNode = this._audioContext?.createGain();
    if (gainNode?.gain) {
      const originalSetValue = gainNode.gain.setValueAtTime;
      gainNode.gain.setValueAtTime = function (value: number) {
        gainNode.gain.value = value;
        return originalSetValue?.apply(this, arguments as any);
      };
    }
    return gainNode;
  }

  createMediaElementSource(element: HTMLMediaElement): MediaElementAudioSourceNode {
    return this._audioContext?.createMediaElementSource(element);
  }

  get destination(): AudioDestinationNode {
    return this._audioContext?.destination;
  }

  get state(): AudioContextState {
    return this._audioContext?.state || 'running';
  }
}

export default AudioContext;
