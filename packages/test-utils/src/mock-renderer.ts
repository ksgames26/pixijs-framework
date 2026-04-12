/**
 * Minimal mock of PixiJS Renderer for unit testing.
 */
export class MockRenderer {
  width = 800;
  height = 600;
  resolution = 1;

  resize(_width: number, _height: number): void {
    this.width = _width;
    this.height = _height;
  }

  destroy(): void {
    // no-op
  }

  on(): void {
    // no-op
  }

  off(): void {
    // no-op
  }

  generateTexture(): null {
    return null;
  }
}
