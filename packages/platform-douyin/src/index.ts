/**
 * Douyin WebApp Adapter
 * Browser API compatibility layer for Douyin Mini Games
 *
 * @package @ksgames26/platform-douyin
 */

// Event system
export { Event } from './event/Event';
export { EventTarget } from './event/EventTarget';
export type { EventListenerOptions } from './event/EventTarget';
export { TouchEvent } from './event/TouchEvent';
export type { Touch } from './event/TouchEvent';
export { PointerEvent, touchToPointer, eventHandlerFactory } from './event/PointerEvent';
export { MouseEvent } from './event/MouseEvent';

// DOM API
export { Node } from './dom/Node';
export { Element } from './dom/Element';
export { HTMLElement } from './dom/HTMLElement';
export { DocumentElement } from './dom/DocumentElement';
export { Body } from './dom/Body';
export { Canvas } from './dom/Canvas';
export { HTMLCanvasElement } from './dom/HTMLCanvasElement';
export { Image } from './dom/Image';
export { ImageBitmap } from './dom/ImageBitmap';
export { HTMLVideoElement } from './dom/HTMLVideoElement';
export { document } from './dom/document';

// Media
export { HTMLMediaElement } from './media/HTMLMediaElement';
export { HTMLAudioElement } from './media/HTMLAudioElement';
export { Audio } from './media/Audio';
export { AudioContext } from './media/AudioContext';

// Network
export { XMLHttpRequest } from './network/XMLHttpRequest';
export { WebSocket } from './network/WebSocket';

// Worker
export { Worker } from './worker/Worker';

// Storage
export { localStorage } from './storage/localStorage';
export { FileReader } from './storage/FileReader';
export { TextDecoder } from './storage/TextDecoder';
export { Blob } from './storage/Blob';
export { URL } from './storage/URL';

// Browser globals
export { navigator } from './navigator/navigator';
export { performance } from './performance/performance';
export { screen } from './screen/screen';
export { matchMedia } from './screen/matchMedia';
export { location } from './window/location';
export { window } from './window/window';
export { getComputedStyle } from './window/getComputedStyle';
export { scrollTo } from './window/scrollTo';
export { scrollBy } from './window/scrollBy';
export { alert } from './window/alert';
export { focus } from './window/focus';
export { blur } from './window/blur';
export { WebGLRenderingContext } from './window/WebGLRenderingContext';

// Utilities
export { noop } from './util/noop';
export { defaultStyles, cssStyles, getImageComputedStyle, getCanvasComputedStyle } from './util/css-style';
export { parentNode, setDocumentReference } from './util/parent-node';
export { initializeStyle } from './util/style';
export { clientRegion } from './util/client-region';
export { offsetRegion } from './util/offset-region';
export { scrollRegion } from './util/scroll-region';
export { classList } from './util/class-list';
export { dataset } from './util/dataset';
export { btoa } from './util/btoa';
export { atob } from './util/atob';

// Injection
export { inject } from './inject';

// Keep existing exports for compatibility
export { DouyinAdapter } from './douyin-adapter';
export { DouyinStorage } from './douyin-storage';

// Auto-inject on import
import './inject';
