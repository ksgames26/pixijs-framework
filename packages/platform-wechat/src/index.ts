// Event system
export { Event } from './event/Event';
export { EventTarget } from './event/EventTarget';
export { TouchEvent } from './event/TouchEvent';

// DOM API
export { Node } from './dom/Node';
export { Element } from './dom/Element';
export { HTMLElement } from './dom/HTMLElement';
export { DocumentElement } from './dom/DocumentElement';
export { Body } from './dom/Body';
export { Canvas } from './dom/Canvas';
export { HTMLCanvasElement } from './dom/HTMLCanvasElement';
export { HTMLImageElement } from './dom/HTMLImageElement';
export { HTMLMediaElement } from './dom/HTMLMediaElement';
export { HTMLAudioElement } from './dom/HTMLAudioElement';
export { HTMLVideoElement } from './dom/HTMLVideoElement';
export { Image } from './dom/Image';
export { document } from './dom/document';

// Media
export { Audio } from './media/Audio';

// Network
export { XMLHttpRequest } from './network/XMLHttpRequest';
export { WebSocket } from './network/WebSocket';

// Storage
export { localStorage } from './storage/localStorage';
export { FileReader } from './storage/FileReader';
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

// Utilities
export { noop } from './util/noop';

// Injection
export { inject } from './inject';

// Keep existing exports for compatibility
export { WechatAdapter } from './wechat-adapter';
export { WechatStorage } from './wechat-storage';

// Auto-inject on import
import './inject';
