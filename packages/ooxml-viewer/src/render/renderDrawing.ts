import {Paragraph} from './../openxml/word/Paragraph';
import Word from '../Word';
import {Drawing} from '../openxml/word/drawing/Drawing';
import {Pic} from '../openxml/word/drawing/Pic';
import {appendChild, applyStyle} from '../util/dom';
import renderParagraph from './renderParagraph';
import renderTable from './renderTable';
import {Table} from '../openxml/word/Table';
import {renderGeom} from './renderGeom';
import {renderCustGeom} from './renderCustGeom';
import {fixAbsolutePosition} from './fixAbsolutePosition';

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

      if (xfrm.rot) {
        img.style.transform = `rotate(${xfrm.rot}deg)`;
      }
    }

    return img;
  }
  return null;
}

/**
 * 渲染图片，目前只支持 picture
 * http://officeopenxml.com/drwOverview.php
 * @param inHeader，如果在 header 中，位置计算要特殊处理
 *
 */
export function renderDrawing(
  word: Word,
  drawing: Drawing,
  inHeader: boolean = false
): HTMLElement | null {
  const container = document.createElement('div');

  if (drawing.position === 'inline') {
    container.style.display = 'inline-block';
  } else if (drawing.position === 'anchor') {
  }

  if (drawing.pic) {
    appendChild(container, renderPic(drawing.pic, word, drawing));
  }

  if (!drawing.relativeFromParagraph && !inHeader) {
    fixAbsolutePosition(word, drawing.containerStyle || {});
  }

  applyStyle(container, drawing.containerStyle);

  if (drawing.wps) {
    const wps = drawing.wps;
    const spPr = wps.spPr;

    applyStyle(container, wps.style);

    if (spPr?.xfrm) {
      const ext = spPr.xfrm.ext;
      if (ext) {
        container.style.width = ext.cx;
        container.style.height = ext.cy;

        if (spPr.geom) {
          const width = parseFloat(ext.cx.replace('pt', ''));
          const height = parseFloat(ext.cy.replace('pt', ''));
          appendChild(
            container,
            renderGeom(spPr.geom, spPr, width, height, wps.wpsStyle)
          );
        }
        if (spPr.custGeom) {
          const width = parseFloat(ext.cx.replace('pt', ''));
          const height = parseFloat(ext.cy.replace('pt', ''));
          appendChild(
            container,
            renderCustGeom(spPr.custGeom, spPr, width, height, wps.wpsStyle)
          );
        }
      }
      if (spPr.xfrm.rot) {
        container.style.transform = `rotate(${spPr.xfrm.rot}deg)`;
      }
    }

    const txbxContent = wps.txbxContent;
    for (const txbxContentChild of txbxContent) {
      if (txbxContentChild instanceof Paragraph) {
        appendChild(container, renderParagraph(word, txbxContentChild));
      } else if (txbxContentChild instanceof Table) {
        appendChild(container, renderTable(word, txbxContentChild));
      }
    }
  }

  // 如果没内容就不渲染了，避免高度导致撑开父节点
  if (container.children.length === 0) {
    return null;
  }

  return container;
}
