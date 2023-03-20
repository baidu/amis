/**
 * 段落的定义和解析
 */

import {getVal} from '../../OpenXML';
import {parsePr} from '../../parse/parsePr';
import Word from '../../Word';
import {BookmarkStart} from './Bookmark';
import {Hyperlink} from './Hyperlink';
import {NumberPr} from './numbering/NumberProperties';
import {Properties} from './properties/Properties';
import {Run, RunPr} from './Run';
import {Tab} from './Tab';
import {SmartTag} from './SmartTag';
import {FldSimple} from './FldSimple';

/**
 * 这里简化了很多，如果能用 CSS 表示就直接用 CSS 表示
 */
export interface ParagraphPr extends Properties {
  numPr?: NumberPr;
  runPr?: RunPr;
  tabs?: Tab[];
}

export type ParagraphChild =
  | Run
  | BookmarkStart
  | Hyperlink
  | SmartTag
  | FldSimple;
// | SymbolRun
// | PageBreak
// | ColumnBreak
// | SequentialIdentifier
// | FootnoteReferenceRun
// | InsertedTextRun
// | DeletedTextRun
// | Math
// | SimpleField
// | SimpleMailMergeField
// | Comments
// | Comment
// | CommentRangeStart
// | CommentRangeEnd
// | CommentReference;

export class Paragraph {
  // 主要是为了方便调试用的
  paraId?: string;
  properties: ParagraphPr = {};
  children: ParagraphChild[] = [];
  fldSimples: FldSimple[] = [];

  addChild(child: ParagraphChild) {
    this.children.push(child);
  }

  static parseParagraphPr(word: Word, element: Element): ParagraphPr {
    const cssStyle = parsePr(word, element, 'p');

    let pStyle;
    const pStyleTag = element.querySelector('pStyle');
    if (pStyleTag) {
      pStyle = getVal(pStyleTag);
    }

    let numPr;
    const numPrTag = element.querySelector('numPr');
    if (numPrTag) {
      numPr = NumberPr.fromXML(word, numPrTag);
    }

    const tabs = [];

    const tabElements = element.getElementsByTagName('w:tab');
    for (const tabElement of tabElements) {
      tabs.push(Tab.fromXML(word, tabElement));
    }

    return {cssStyle, pStyle, numPr, tabs};
  }

  static fromXML(word: Word, element: Element): Paragraph {
    const paragraph = new Paragraph();
    paragraph.fldSimples = [];
    paragraph.paraId = element.getAttribute('w14:paraId') || '';

    for (const child of element.children) {
      const tagName = child.tagName;
      switch (tagName) {
        case 'w:pPr':
          paragraph.properties = Paragraph.parseParagraphPr(word, child);
          break;

        case 'w:r':
          paragraph.addChild(Run.fromXML(word, child));
          break;

        case 'w:hyperlink':
          paragraph.addChild(Hyperlink.fromXML(word, child));
          break;

        case 'w:bookmarkStart':
          paragraph.addChild(BookmarkStart.fromXML(word, child));

        case 'w:bookmarkEnd':
          // 没啥用所以不解析了
          break;

        case 'w:proofErr':
        case 'w:noProof':
          // 语法检查
          break;

        case 'w:del':
        case 'w:moveTo':
        case 'w:moveFrom':
          // del 看起来主要是用于跟踪历史的，先不支持
          break;

        case 'w:smartTag':
        case 'w:customXml':
          paragraph.addChild(SmartTag.fromXML(word, child));
          break;

        case 'w:fldSimple':
          // 这个目前还不想支持
          paragraph.fldSimples.push(FldSimple.fromXML(word, child));
          break;

        default:
          console.warn('parse Paragraph: Unknown key', tagName, child);
      }
    }

    return paragraph;
  }
}
