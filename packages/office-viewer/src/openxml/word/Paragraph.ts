/**
 * 段落的定义和解析
 */

import {loopChildren, WAttr, WTag, XMLData} from '../../OpenXML';
import {parsePr} from '../../parse/parsePr';
import Word from '../../Word';
import {BookmarkStart} from './Bookmark';
import {Hyperlink} from './Hyperlink';
import {NumberProperties} from './numbering/NumberProperties';
import {Properties} from './properties/Properties';
import {Run, RunProperties} from './Run';

/**
 * 这里简化了很多，如果能用 CSS 表示就直接用 CSS 表示
 */
export interface ParagraphProperties extends Properties {
  readonly numPr?: NumberProperties;
  readonly runProperties?: RunProperties;
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
    data: XMLData
  ): ParagraphProperties {
    const cssStyle = parsePr(word, data, 'p');

    let pStyle;
    if (WTag.pStyle in data) {
      const pStyleTag = data[WTag.pStyle] as XMLData;
      if (typeof pStyleTag === 'object') {
        pStyle = pStyleTag[WAttr.val] as string;
      }
    }

    let numPr;
    if (WTag.numPr in data) {
      numPr = NumberProperties.fromXML(word, data[WTag.numPr] as XMLData);
    }

    return {cssStyle, pStyle, numPr};
  }

  static fromXML(word: Word, data: XMLData): Paragraph {
    const paragraph = new Paragraph();

    loopChildren(data, (key, value) => {
      if (typeof value !== 'object') {
        return;
      }

      switch (key) {
        case WTag.pPr:
          paragraph.properties = Paragraph.parseParagraphProperties(
            word,
            value
          );
          break;

        case WTag.r:
          paragraph.addChild(Run.fromXML(word, value));
          break;

        case WTag.hyperlink:
          paragraph.addChild(Hyperlink.fromXML(word, value));
          break;

        case WTag.bookmarkStart:
          paragraph.addChild(BookmarkStart.fromXML(word, value));

        case WTag.bookmarkEnd:
          // 没啥用所以不解析了
          break;

        case WTag.proofErr:
        case WTag.noProof:
          // 语法检查
          break;

        default:
          console.warn('parse Paragraph: Unknown key', key);
      }
    });
    return paragraph;
  }
}
