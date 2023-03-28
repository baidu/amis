import {Paragraph} from './../Paragraph';
import {ShapePr} from './../drawing/ShapeProperties';
/**
 * wps 指的是 wordprocessingShape，在 drawing 里 word 相关的 shape 定义
 * 目前主要是支持 textbox，
 */

import Word from '../../../Word';
import {Table} from '../Table';
import {parseTable} from '../../../parse/parseTable';
import {CSSStyle} from '../../../openxml/Style';
import {ST_TextVerticalType} from '../../../openxml/Types';

export type TxbxContentChild = Paragraph | Table;

/**
 * 文档 20.4.2.22，不过大部分属性不支持
 */
function parseBodyPr(element: Element, style: CSSStyle) {
  for (const attribute of element.attributes) {
    const name = attribute.name;
    const value = attribute.value;
    switch (name) {
      case 'numCol':
        style['column-count'] = value;
        break;

      case 'vert':
        const val = value as ST_TextVerticalType;
        switch (val) {
          case 'vert':
            style['writing-mode'] = 'vertical-rl';
            style['text-orientation'] = 'sideways';
            break;

          case 'vert270':
          case 'eaVert':
            // 不太准确，但 css 也只能做到这样
            style['writing-mode'] = 'vertical-rl';
            style['text-orientation'] = 'mixed';
            break;

          default:
            break;
        }

        break;
    }
  }
}

export class WPS {
  spPr?: ShapePr;
  txbxContent: TxbxContentChild[];
  // 外层容器样式
  style: CSSStyle = {};

  static fromXML(word: Word, element: Element) {
    const wps = new WPS();
    wps.txbxContent = [];

    for (const child of element.children) {
      const tagName = child.tagName;
      switch (tagName) {
        case 'wps:cNvSpPr':
          // 和展现无关
          break;

        case 'wps:spPr':
          wps.spPr = ShapePr.fromXML(word, child);
          break;

        case 'wps:txbx':
          // 文本框内容
          // http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/txbxContent.html
          const txbxContent = child.firstElementChild;
          if (txbxContent) {
            for (const txbxContentChild of txbxContent.children) {
              const txbxContentTagName = txbxContentChild.tagName;
              switch (txbxContentTagName) {
                case 'w:p':
                  wps.txbxContent.push(
                    Paragraph.fromXML(word, txbxContentChild)
                  );
                  break;

                case 'w:tbl':
                  wps.txbxContent.push(parseTable(word, txbxContentChild));
                  break;
              }
            }
          } else {
            console.warn('unknown wps:txbx', child);
          }
          break;

        case 'wps:style':
          // http://webapp.docx4java.org/OnlineDemo/ecma376/DrawingML/style_1.html
          // 里面都是引用，感觉是辅助信息，暂时不处理
          break;

        case 'wps:bodyPr':
          parseBodyPr(child, wps.style);
          break;

        default:
          console.warn('WPS: Unknown tag ', tagName, child);
      }
    }

    return wps;
  }
}
