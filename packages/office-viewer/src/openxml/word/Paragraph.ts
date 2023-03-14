/**
 * 段落的定义和解析
 */

import {getVal} from '../../OpenXML';
import {parsePr} from '../../parse/parsePr';
import Word from '../../Word';
import {BookmarkStart} from './Bookmark';
import {Hyperlink} from './Hyperlink';
import {NumberProperties} from './numbering/NumberProperties';
import {Properties} from './properties/Properties';
import {Run, RunProperties} from './Run';
import {Tab} from './Tab';

/**
 * 这里简化了很多，如果能用 CSS 表示就直接用 CSS 表示
 */
export interface ParagraphProperties extends Properties {
  numPr?: NumberProperties;
  runProperties?: RunProperties;
  tabs?: Tab[];
}

export type ParagraphChild = Run | BookmarkStart | Hyperlink;
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
  properties: ParagraphProperties = {};
  children: ParagraphChild[] = [];

  addChild(child: ParagraphChild) {
    this.children.push(child);
  }

  static parseParagraphProperties(
    word: Word,
    element: Element
  ): ParagraphProperties {
    const cssStyle = parsePr(word, element, 'p');

    let pStyle;
    const pStyleTag = element.querySelector('pStyle');
    if (pStyleTag) {
      pStyle = getVal(pStyleTag);
    }

    let numPr;
    const numPrTag = element.querySelector('numPr');
    if (numPrTag) {
      numPr = NumberProperties.fromXML(word, numPrTag);
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

    for (const child of element.children) {
      const tagName = child.tagName;
      switch (tagName) {
        case 'w:pPr':
          paragraph.properties = Paragraph.parseParagraphProperties(
            word,
            child
          );
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
          // del 看起来主要是用于跟踪历史的，先不支持
          break;

        default:
          console.warn('parse Paragraph: Unknown key', tagName);
      }
    }

    return paragraph;
  }
}
