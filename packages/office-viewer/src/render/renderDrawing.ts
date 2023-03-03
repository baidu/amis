import {LengthUsage} from './../parse/parseSize';
/**
 * 渲染图片，目前只支持 picture
 * http://officeopenxml.com/drwOverview.php
 *
 */

import {ATag, Attr, PicTag, RAttr, WPTag} from '../parse/Names';
import {parseSize} from '../parse/parseSize';
import Word from '../Word';

function renderGraphic(word: Word, data: any) {
  const graphic = data[ATag.graphicData];
  if (graphic && PicTag.pic in graphic) {
    const pic = graphic[PicTag.pic];
    const blipFill = pic?.[PicTag.blipFill];
    const blip = blipFill?.[ATag.blip];

    const spPr = pic?.[PicTag.spPr];
    const xfrm = spPr?.[ATag.xfrm];

    if (blip) {
      const embed = blip[RAttr.embed];
      const rel = word.getRelationship(embed);
      if (rel) {
        const img = document.createElement('img') as HTMLImageElement;
        img.style.position = 'relative';
        word.loadImage(rel).then(url => {
          if (url) {
            img.src = url;
          }
        });

        if (xfrm) {
          const off = xfrm[ATag.off];
          if (off) {
            img.style.left = parseSize(off, Attr.x, LengthUsage.Emu);
            img.style.top = parseSize(off, Attr.y, LengthUsage.Emu);
          }
          const ext = xfrm[ATag.ext];
          if (ext) {
            img.style.width = parseSize(ext, Attr.cx, LengthUsage.Emu);
            img.style.height = parseSize(ext, Attr.cy, LengthUsage.Emu);
          }
        }

        return img;
      }
    }
  }
  return null;
}

/**
 * TODO: 还有大量格式不支持
 */
export function renderDrawing(word: Word, data: any): HTMLElement | null {
  let isAnchor = false;
  let xmlData;
  if (WPTag.inline in data) {
    xmlData = data[WPTag.inline];
  } else if (WPTag.anchor in data) {
    xmlData = data[WPTag.anchor];
    isAnchor = true;
  } else {
    console.log('renderDrawing: only support inline or anchor tag');
    return null;
  }

  if (ATag.graphic in xmlData) {
    return renderGraphic(word, xmlData[ATag.graphic]);
  }

  return null;
}
