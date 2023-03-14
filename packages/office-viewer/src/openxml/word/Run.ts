import {getVal} from '../../OpenXML';
import {parsePr} from '../../parse/parsePr';
import Word from '../../Word';
import {ST_VerticalAlignRun} from '../Types';
import {Break} from './Break';
import {Drawing} from './drawing/Drawing';
import {Properties} from './properties/Properties';
import {Tab} from './Tab';
/**
 * 一段文本
 * http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/Run_1.html
 */

export interface RunProperties extends Properties {
  vertAlign?: ST_VerticalAlignRun;
}

export class Text {
  preserveSpace: boolean = false;
  text: string;
  constructor(text: string | number) {
    this.text = String(text);
  }
}

type RunChild = Break | Drawing | Text | Tab;

export class Run {
  properties: RunProperties = {};
  children: RunChild[] = [];

  addChild(child: RunChild | null) {
    if (child) {
      this.children.push(child);
    }
  }

  static parseRunProperties(word: Word, element: Element): RunProperties {
    const cssStyle = parsePr(word, element, 'r');
    let rStyle;
    const rStyleElement = element.getElementsByTagName('w:rStyle').item(0);
    if (rStyleElement) {
      rStyle = getVal(rStyleElement);
    }

    return {cssStyle, rStyle};
  }

  static fromXML(word: Word, element: Element): Run {
    const run = new Run();

    for (const child of element.children) {
      const tagName = child.tagName;
      switch (tagName) {
        case 'w:t':
          const textContent = child.textContent || '';
          const text = new Text(textContent);
          run.addChild(text);

          break;

        case 'w:rPr':
          run.properties = Run.parseRunProperties(word, child);
          break;

        case 'w:br':
          run.addChild(Break.fromXML(word, child));
          break;

        case 'w:drawing':
          run.addChild(Drawing.fromXML(word, child));
          break;

        case 'w:tab':
          run.addChild(Tab.fromXML(word, child));
          break;

        case 'w:fldChar':
          // 似乎只需要支持 instrText
          break;

        case 'w:instrText':
          // 目前先当文本处理
          const instrTextContent = child.textContent || '';
          const instrText = new Text(instrTextContent);
          run.addChild(instrText);
          break;

        case 'w:lastRenderedPageBreak':
          // 目前也不支持分页显示
          break;

        default:
          console.warn('parse Run: Unknown key', tagName);
      }
    }

    return run;
  }
}
