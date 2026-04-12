# @ksgames26/platform-douyin

Douyin Mini Game WebApp Adapter - TypeScript implementation

## Overview

This package provides a browser-compatible API layer for Douyin Mini Games, allowing web-based game frameworks (like PixiJS) to run seamlessly in the Douyin Mini Game environment.

## Installation

```bash
npm install @ksgames26/platform-douyin
```

## Usage

Simply import the package at the entry point of your Douyin Mini Game:

```typescript
import '@ksgames26/platform-douyin';

// Now you can use standard browser APIs
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

const img = new Image();
img.src = 'https://example.com/image.png';

const xhr = new XMLHttpRequest();
xhr.open('GET', 'https://api.example.com/data');
xhr.send();
```

## Supported APIs

### Event System
- `Event`
- `EventTarget`
- `TouchEvent`
- `PointerEvent`
- `MouseEvent`

### DOM API
- `Node`
- `Element`
- `HTMLElement`
- `DocumentElement`
- `Body`
- `Canvas`
- `Image`
- `ImageBitmap`
- `HTMLVideoElement`
- `document`

### Media
- `HTMLMediaElement`
- `HTMLAudioElement`
- `Audio`
- `AudioContext`

### Network
- `XMLHttpRequest`
- `WebSocket`

### Worker
- `Worker`

### Storage
- `localStorage`
- `FileReader`
- `TextDecoder`
- `Blob`
- `URL`

### Browser Globals
- `navigator`
- `performance`
- `screen`
- `matchMedia`
- `location`
- `window`

### Utilities
- `btoa` / `atob`
- `getComputedStyle`
- `scrollTo` / `scrollBy`
- `alert` / `focus` / `blur`

## Implementation Details

- **Auto-injection**: The adapter automatically injects browser-compatible globals when imported
- **Douyin API Mapping**: Maps `tt.*` APIs to browser-standard equivalents
- **TypeScript**: Full TypeScript support with type declarations
- **Tree-shaking**: Modular structure supports tree-shaking for unused code elimination

## File Structure

```
src/
├── types/tt.d.ts          # Douyin API type declarations
├── util/                  # Utility functions
├── event/                 # Event system
├── dom/                   # DOM API
├── media/                 # Media elements
├── network/               # Network APIs
├── storage/               # Storage APIs
├── worker/                # Web Worker
├── navigator/             # Navigator object
├── performance/           # Performance API
├── screen/                # Screen API
├── window/                # Window object
├── inject.ts              # Global injection logic
└── index.ts               # Package exports
```

## License

MIT
