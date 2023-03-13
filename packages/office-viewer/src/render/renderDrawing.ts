import {LengthUsage} from './../parse/parseSize';
/**
 * 渲染图片，目前只支持 picture
 * http://officeopenxml.com/drwOverview.php
 *
 */

import Word from '../Word';
import {Drawing} from '../openxml/word/drawing/Drawing';

export function renderDrawing(
  word: Word,
  drawing: Drawing
): HTMLElement | null {
  const pic = drawing.pic;

  if (pic) {
    const blip = pic.blipFill?.blip;
    if (blip && blip.embled) {
      const img = document.createElement('img') as HTMLImageElement;
      img.style.position = 'relative';
      word.loadImage(blip.embled).then(url => {
        if (url) {
          img.src = url;
        }
      });

      const xfrm = pic.spPr?.xfrm;

      if (xfrm) {
        const off = xfrm.off;
        if (off) {
          img.style.left = off.x;
          img.style.top = off.y;
        }
        const ext = xfrm.ext;
        if (ext) {
          img.style.width = ext.cx;
          img.style.height = ext.cy;
        }
      }

      return img;
    }
  }

  return null;
}
