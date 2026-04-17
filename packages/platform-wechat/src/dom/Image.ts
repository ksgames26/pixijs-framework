import { HTMLImageElement as LocalHTMLImageElement } from './HTMLImageElement';

export function Image(): any {
  const image = wx.createImage() as any;

  const originalProto = Object.getPrototypeOf(image);
  if (originalProto) {
    Object.setPrototypeOf(originalProto, LocalHTMLImageElement.prototype);
  } else {
    Object.setPrototypeOf(image, LocalHTMLImageElement.prototype);
  }

  return image;
}

export default Image;
