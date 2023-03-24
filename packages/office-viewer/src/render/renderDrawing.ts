import {Paragraph} from './../openxml/word/Paragraph';
import Word from '../Word';
import {Drawing} from '../openxml/word/drawing/Drawing';
import {Pic} from '../openxml/word/drawing/Pic';
import {appendChild, applyStyle} from '../util/dom';
import renderParagraph from './renderParagraph';
import renderTable from './renderTable';
import {Table} from '../openxml/word/Table';

/**
 * 渲染图片
 */
function renderPic(pic: Pic, word: Word, drawing: Drawing) {
  const blip = pic.blipFill?.blip;
  if (blip && blip.src) {
    const img = document.createElement('img') as HTMLImageElement;
    img.style.position = 'relative';

    img.src = blip.src;

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
  return null;
}

/**
 * 渲染图片，目前只支持 picture
 * http://officeopenxml.com/drwOverview.php
 *
 */
export function renderDrawing(word: Word, drawing: Drawing): HTMLElement {
  const container = document.createElement('div');

  if (drawing.position === 'inline') {
    container.style.display = 'inline-block';
  } else if (drawing.position === 'anchor') {
  }

  if (drawing.pic) {
    appendChild(container, renderPic(drawing.pic, word, drawing));
  }

  applyStyle(container, drawing.containerStyle);

  if (drawing.wps) {
    const spPr = drawing.wps.spPr;
    applyStyle(container, spPr?.style);
    if (spPr?.xfrm) {
      const ext = spPr.xfrm.ext;
      if (ext) {
        container.style.width = ext.cx;
        container.style.height = ext.cy;
      }
    }

    const txbxContent = drawing.wps.txbxContent;
    for (const txbxContentChild of txbxContent) {
      if (txbxContentChild instanceof Paragraph) {
        appendChild(container, renderParagraph(word, txbxContentChild));
      } else if (txbxContentChild instanceof Table) {
        appendChild(container, renderTable(word, txbxContentChild));
      }
    }
  }

  return container;
}
