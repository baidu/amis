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
import {FldSimple} from './FldSimple';
import {OMath} from '../math/OMath';
import {mergeSdt} from '../../parse/mergeSdt';

/**
 * 这里简化了很多，如果能用 CSS 表示就直接用 CSS 表示
 */
export interface ParagraphPr extends Properties {
  numPr?: NumberPr;
  runPr?: RunPr;
  tabs?: Tab[];

  /**
   * 其实是区分 autoSpaceDN 和 autoSpaceDE 的，但这里简化了
   */
  autoSpace?: boolean;
}

export type ParagraphChild =
  | Run
  | BookmarkStart
  | Hyperlink
  | FldSimple
  | OMath;
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

function parseAutoSpace(element: Element): boolean {
  const autoSpaceDE = element.getElementsByTagName('w:autoSpaceDE').item(0);
  const autoSpaceDN = element.getElementsByTagName('w:autoSpaceDN').item(0);
  return !!autoSpaceDE || !!autoSpaceDN;
}

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
    const pStyleTag = element.getElementsByTagName('w:pStyle').item(0);
    if (pStyleTag) {
      pStyle = getVal(pStyleTag);
    }

    let numPr;
    const numPrTag = element.getElementsByTagName('w:numPr').item(0);
    if (numPrTag) {
      numPr = NumberPr.fromXML(word, numPrTag);
    }

    const tabs = [];

    const tabElements = element.getElementsByTagName('w:tab');
    for (const tabElement of tabElements) {
      tabs.push(Tab.fromXML(word, tabElement));
    }

    const autoSpace = parseAutoSpace(element);

    return {cssStyle, pStyle, numPr, tabs, autoSpace};
  }

  static fromXML(word: Word, element: Element): Paragraph {
    const paragraph = new Paragraph();
    paragraph.fldSimples = [];
    paragraph.paraId = element.getAttribute('w14:paraId') || '';

    for (const child of mergeSdt(element)) {
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

        case 'w:fldSimple':
          // 这个目前还不想支持
          paragraph.fldSimples.push(FldSimple.fromXML(word, child));
          break;

        case 'm:oMathPara':
        case 'm:oMath':
          paragraph.addChild(OMath.fromXML(word, child));
          break;

        default:
          console.warn('parse Paragraph: Unknown key', tagName, child);
      }
    }

    return paragraph;
  }
}
