import { parentNode } from '../util/parent-node';
import { classList } from '../util/class-list';

/**
 * Image constructor function
 * Wraps tt.createImage() for DOM compatibility
 */



export function Image(): HTMLImageElement {
  const image = tt.createImage();

  if (!('tagName' in image)) {
    (image as any).tagName = 'IMG';
  }

  parentNode(image, 2);
  classList(image);

  return image as HTMLImageElement;
}

export default Image;
