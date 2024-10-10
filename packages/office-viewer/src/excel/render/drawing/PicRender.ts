import src from '../../..';
import {emuToPx} from '../../../util/emuToPx';
import {IPicture} from '../../types/IDrawing';
import {Rect} from '../Rect';
import {BaseDrawingRender} from './BaseDrawingRender';

export class PicRender extends BaseDrawingRender {
  constructor(
    container: HTMLElement,
    displayRect: Rect,
    gid: string,
    pic: IPicture
  ) {
    super(container, displayRect, gid, 'excel-pic');

    if (!pic.imgURL) {
      console.warn('imgURL do not exist');
      return;
    }

    const srcRect = pic.blipFill?.srcRect;

    const img = new Image();
    img.src = pic.imgURL;

    if (srcRect) {
      // 根据 srcRect 的百分比来设置图片的位置及大小
      const containerWidth = displayRect.width;
      const containerHeight = displayRect.height;
      let leftPercent = 0;
      if (srcRect.l) {
        leftPercent = parseInt(srcRect.l, 10) / 100000;
      }

      let topPercent = 0;
      if (srcRect.t) {
        topPercent = parseInt(srcRect.t, 10) / 100000;
      }

      let bottomPercent = 0;
      if (srcRect.b) {
        bottomPercent = parseInt(srcRect.b, 10) / 100000;
      }

      let rightPercent = 0;
      if (srcRect.r) {
        rightPercent = parseInt(srcRect.r, 10) / 100000;
      }

      const width = containerWidth * (1 + leftPercent + rightPercent);
      const height = containerHeight * (1 + topPercent + bottomPercent);
      const top = -containerHeight * topPercent;
      const left = -containerWidth * leftPercent;

      img.style.width = `${width}px`;
      img.style.height = `${height}px`;
      img.style.top = `${top}px`;
      img.style.left = `${left}px`;
      img.style.position = 'absolute';
    } else {
      img.style.height = '100%';
      img.style.width = '100%';
    }
    this.drawingContainer.appendChild(img);
  }
}
