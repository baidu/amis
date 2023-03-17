import {getVal} from '../../OpenXML';
import {parsePr} from '../../parse/parsePr';
import Word from '../../Word';
import {ST_VerticalAlignRun} from '../Types';
import {Break} from './Break';
import {Drawing} from './drawing/Drawing';
import {InstrText} from './InstrText';
import {Pict} from './Pict';
import {Properties} from './properties/Properties';
import {Ruby} from './Ruby';
import {Sym} from './Sym';
import {Tab} from './Tab';
/**
 * 一段文本
 * http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/Run_1.html
 */

export interface RunPr extends Properties {
  vertAlign?: ST_VerticalAlignRun;
}

export class Text {
  preserveSpace: boolean = false;
  text: string;
  constructor(text: string | number) {
    this.text = String(text);
  }
}

type RunChild = Break | Drawing | Text | Tab | Pict | Ruby | InstrText | Sym;

export class Run {
  properties: RunPr = {};
  children: RunChild[] = [];

  addChild(child: RunChild | null) {
    if (child) {
      this.children.push(child);
    }
  }

  static parseRunPr(word: Word, element: Element): RunPr {
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
          run.properties = Run.parseRunPr(word, child);
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
          run.addChild(new InstrText(child.textContent || ''));
          break;

        case 'w:lastRenderedPageBreak':
          // 目前也不支持分页显示
          break;

        case 'w:pict':
          run.addChild(Pict.fromXML(word, child));
          break;

        case 'w:ruby':
          run.addChild(Ruby.fromXML(word, child));
          break;

        case 'w:sym':
          run.addChild(Sym.parseXML(child));
          break;

        default:
          console.warn('parse Run: Unknown key', tagName, child);
      }
    }

    return run;
  }
}
