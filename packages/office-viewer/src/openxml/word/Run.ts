import {getVal} from '../../OpenXML';
import {parsePr} from '../../word/parse/parsePr';
import Word from '../../Word';
import {ST_FldCharType, ST_VerticalAlignRun} from '../Types';
import {Break} from './Break';
import {Drawing} from '../drawing/Drawing';
import {InstrText} from './InstrText';
import {NoBreakHyphen} from './NoBreakHyphen';
import {Pict} from './Pict';
import {Properties} from './properties/Properties';
import {Ruby} from './Ruby';
import {Separator} from './Separator';
import {SoftHyphen} from './SoftHyphen';
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

type RunChild =
  | Break
  | Drawing
  | Text
  | Tab
  | Pict
  | Ruby
  | InstrText
  | Sym
  | SoftHyphen
  | Separator
  | NoBreakHyphen;

export class Run {
  properties: RunPr = {};
  children: RunChild[] = [];
  fldChar?: ST_FldCharType;

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
        case 'w:cr':
          run.addChild(Break.fromXML(word, child));
          break;

        case 'w:drawing':
          run.addChild(Drawing.fromXML(word, child));
          break;

        case 'w:tab':
          run.addChild(Tab.fromXML(word, child));
          break;

        case 'w:fldChar':
          run.fldChar = child.getAttribute('w:fldCharType') as ST_FldCharType;
          break;

        case 'w:instrText':
          run.addChild(new InstrText(child.textContent || ''));
          break;

        case 'w:lastRenderedPageBreak':
          const pageBreak = new Break();
          pageBreak.type = 'page';
          run.addChild(pageBreak);
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

        case 'mc:AlternateContent':
          const drawingChild = child.getElementsByTagName('w:drawing').item(0);
          if (drawingChild) {
            run.addChild(Drawing.fromXML(word, drawingChild));
          }
          break;

        case 'w:softHyphen':
          run.addChild(new SoftHyphen());
          break;

        case 'w:noBreakHyphen':
          run.addChild(new NoBreakHyphen());
          break;

        case 'w:separator':
          run.addChild(new Separator());
          break;

        case 'w:continuationSeparator':
          // TODO: 还不知道是啥
          break;

        default:
          console.warn('parse Run: Unknown key', tagName, child);
      }
    }

    return run;
  }
}
