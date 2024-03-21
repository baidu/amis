import {Paragraph} from '../../openxml/word/Paragraph';
import Word from '../../Word';
import {Drawing} from '../../openxml/drawing/Drawing';
import {Pic} from '../../openxml/drawing/Pic';
import {appendChild, applyStyle} from '../../util/dom';
import renderParagraph from './renderParagraph';
import renderTable from './renderTable';
import {Table} from '../../openxml/word/Table';
import {renderGeom} from './renderGeom';
import {renderCustGeom} from './renderCustGeom';
import {WPS} from '../../openxml/word/wps/WPS';
import {WPG} from '../../openxml/word/wps/WPG';
import {Transform} from '../../openxml/drawing/Transform';

/**
 * 渲染图片
 */
function renderPic(pic: Pic, word: Word, wpg: WPG | null = null) {
  const blip = pic.blipFill?.blip;
  if (blip && blip.src) {
    const img = document.createElement('img') as HTMLImageElement;
    img.style.position = 'relative';
    img.alt = pic.alt || '';
    img.src = blip.src;

    if (pic.alt && word.renderOptions.enableVar) {
      if (pic.altVar) {
        img.src = pic.altVar;
      } else if (pic.alt.startsWith('{{')) {
        const src = word.replaceText(pic.alt);
        if (src) {
          img.src = src;
        }
      }
    }

    const xfrm = pic.spPr?.xfrm;

    if (xfrm) {
      if (wpg) {
        const rect = getRectInGroup(xfrm, wpg.spPr?.xfrm!);
        if (rect) {
          img.style.position = 'absolute';
          img.style.left = rect.left + 'px';
          img.style.top = rect.top + 'px';
          img.style.width = rect.width + 'px';
          img.style.height = rect.height + 'px';
        }
      } else {
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

      if (xfrm.rot) {
        img.style.transform = `rotate(${xfrm.rot}deg)`;
      }
    }

    return img;
  }
  return null;
}

/**
 * 获取在 group 中的位置
 * @param xfrm 元素的位置定义
 *  @param groupXfrm 分组中的位置定义
 */
function getRectInGroup(xfrm: Transform, groupXfrm: Transform) {
  const off = xfrm.off;

  let width = parseFloat(xfrm.ext!.cx.replace('px', ''));
  let height = parseFloat(xfrm.ext!.cy.replace('px', ''));
  if (off && groupXfrm.chOff && groupXfrm.ext && groupXfrm.chExt) {
    // 先算缩放比
    const scaleX =
      parseFloat(groupXfrm.ext!.cx.replace('px', '')) /
      parseFloat(groupXfrm.chExt!.cx.replace('px', ''));
    const scaleY =
      parseFloat(groupXfrm.ext!.cy.replace('px', '')) /
      parseFloat(groupXfrm.chExt!.cy.replace('px', ''));

    const groupOffX = parseFloat(groupXfrm.chOff!.x.replace('px', ''));
    const groupOffY = parseFloat(groupXfrm.chOff!.y.replace('px', ''));
    const x = parseFloat(off.x.replace('px', ''));
    const y = parseFloat(off.y.replace('px', ''));
    return {
      left: scaleX * (x - groupOffX),
      top: scaleY * (y - groupOffY),
      width: scaleX * width,
      height: scaleY * height
    };
  }
  return null;
}

/**
 * 渲染文本框
 */
function renderWps(
  word: Word,
  container: HTMLElement,
  wps: WPS,
  wpg: WPG | null = null
) {
  const wpsStyle = wps.wpsStyle;
  const spPr = wps.spPr;

  applyStyle(container, wps.style);

  if (wpsStyle?.fontColor) {
    container.style.color = wpsStyle.fontColor;
  }

  if (spPr?.xfrm) {
    const ext = spPr.xfrm.ext;
    if (ext) {
      let width = parseFloat(ext.cx.replace('px', ''));
      let height = parseFloat(ext.cy.replace('px', ''));

      // 在分组中的计算方式不一样，另外在分组中还需要绝对定位
      // 这个计算方法在官方文档里没找到
      if (wpg) {
        container.style.position = 'absolute';
        const rect = getRectInGroup(spPr.xfrm, wpg.spPr?.xfrm!);
        if (rect) {
          container.style.left = rect.left + 'px';
          container.style.top = rect.top + 'px';
          width = rect.width;
          height = rect.height;
        }
      }

      container.style.width = width + 'px';
      container.style.height = height + 'px';

      if (spPr.geom) {
        appendChild(
          container,
          renderGeom(spPr.geom, spPr, width, height, wps.wpsStyle)
        );
      }
      if (spPr.custGeom) {
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

  if (txbxContent.length) {
    // 为了实现垂直居中，将父容器改成 table 布局
    const textContainer = document.createElement('div');
    textContainer.dataset.name = 'textContainer';
    container.style.display = 'table';
    textContainer.style.display = 'table-cell';
    textContainer.style.verticalAlign = 'middle';
    if (wps.style && wps.style['vertical-align']) {
      textContainer.style.verticalAlign = wps.style['vertical-align'] as string;
      // 容器的 vertical-align 需要去掉，虽然也不影响
      container.style.verticalAlign = '';
    }
    appendChild(container, textContainer);

    for (const txbxContentChild of txbxContent) {
      if (txbxContentChild instanceof Paragraph) {
        appendChild(textContainer, renderParagraph(word, txbxContentChild));
      } else if (txbxContentChild instanceof Table) {
        appendChild(textContainer, renderTable(word, txbxContentChild));
      }
    }
  }
}

function renderWpg(word: Word, wpg: WPG) {
  const container = document.createElement('div');
  const wpgContainer = document.createElement('div');
  const spPr = wpg.spPr;
  if (spPr?.xfrm) {
    const ext = spPr?.xfrm?.ext;
    if (ext) {
      wpgContainer.style.width = ext.cx;
      wpgContainer.style.height = ext.cy;
    }
    const rot = spPr?.xfrm?.rot;
    if (rot) {
      wpgContainer.style.transform = `rotate(${rot}deg)`;
    }
  }
  for (const wps of wpg.wps) {
    const wpsContainer = document.createElement('div');
    renderWps(word, wpsContainer, wps, wpg);
    appendChild(wpgContainer, wpsContainer);
  }
  for (const childWpg of wpg.wpg) {
    appendChild(container, renderWpg(word, childWpg));
  }
  if (wpg.pic) {
    appendChild(wpgContainer, renderPic(wpg.pic, word, wpg));
  }
  appendChild(container, wpgContainer);
  return container;
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
    appendChild(container, renderPic(drawing.pic, word));
  }

  if (drawing.relativeFromV === 'page') {
    console.warn('暂不支持 drawing.relativeFromV === "page"');
  }

  applyStyle(container, drawing.containerStyle);

  container.dataset.id = drawing.id || '';
  container.dataset.name = drawing.name || '';

  if (drawing.wps) {
    renderWps(word, container, drawing.wps);
  }

  if (drawing.wpg) {
    appendChild(container, renderWpg(word, drawing.wpg));
  }

  // 如果没内容就不渲染了，避免高度导致撑开父节点
  if (container.children.length === 0) {
    return null;
  }

  return container;
}
