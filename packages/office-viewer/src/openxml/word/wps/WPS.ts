import {Paragraph} from './../Paragraph';
import {ShapePr} from './../drawing/ShapeProperties';
/**
 * wps 指的是 wordprocessingShape，在 drawing 里 word 相关的 shape 定义
 * 目前主要是支持 textbox，
 */

import Word from '../../../Word';
import {Table} from '../Table';

export type TxbxContentChild = Paragraph | Table;

export class WPS {
  spPr?: ShapePr;
  txbxContent: TxbxContentChild[];

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
                  wps.txbxContent.push(Table.fromXML(word, txbxContentChild));
                  break;
              }
            }
          } else {
            console.warn('unknown wps:txbx', child);
          }
          break;

        default:
          console.warn('WPS: Unknown tag ', tagName, child);
      }
    }

    return wps;
  }
}
