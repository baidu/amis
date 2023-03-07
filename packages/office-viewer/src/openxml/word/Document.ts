/**
 * Document 解析及类型定义
 * http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/document.html
 * http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/Main%20Document%20Story.html
 */

import {WAttr, WTag, XMLData} from '../../OpenXML';
import {parseColorAttr} from '../../parse/parseColor';
import Word from '../../Word';
import {DocumentBackground} from './Background';
import {Body} from './Body';

export class Document {
  body: Body;
  documentBackground?: DocumentBackground;

  static fromXML(word: Word, data: XMLData): Document {
    const doc = new Document();
    const wDocument = data[WTag.document];
    if (typeof wDocument === 'object') {
      if (WTag.body in wDocument) {
        doc.body = Body.fromXML(word, wDocument[WTag.body] as XMLData);
      }

      if (WTag.background in wDocument) {
        const wBackground = wDocument[WTag.background] as XMLData;
        const documentBackground: DocumentBackground = {};
        if (WAttr.color in wBackground) {
          documentBackground.color = parseColorAttr(wBackground, WAttr.color);
        }

        if (WAttr.themeColor in wBackground) {
          documentBackground.themeColor = parseColorAttr(
            wBackground,
            WAttr.themeColor
          );
        }

        if (WAttr.themeShade in wBackground) {
          documentBackground.themeShade = parseColorAttr(
            wBackground,
            WAttr.themeShade
          );
        }

        if (WAttr.themeTint in wBackground) {
          documentBackground.themeTint = parseColorAttr(
            wBackground,
            WAttr.themeTint
          );
        }
      }
    }

    return doc;
  }
}
