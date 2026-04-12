/// <reference path="../types/wx.d.ts" />

export function Image(): HTMLImageElement {
  const image = wx.createImage();
  return image;
}

export default Image;
