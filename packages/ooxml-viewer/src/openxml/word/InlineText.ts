/**
 * 通用的文本元素
 */

import Word from '../../Word';
import {BookmarkStart} from './Bookmark';
import {Hyperlink} from './Hyperlink';
import {Run} from './Run';

type InlineChild = Run | BookmarkStart | Hyperlink;

export class InlineText {
  children: InlineChild[] = [];

  addChild(child: InlineChild) {
    this.children.push(child);
  }

  static fromXML(word: Word, element: Element): InlineText {
    const smartTag = new InlineText();

    for (const child of element.children) {
      const tagName = child.tagName;
      switch (tagName) {
        case 'w:r':
          smartTag.addChild(Run.fromXML(word, child));
          break;

        case 'w:hyperlink':
          smartTag.addChild(Hyperlink.fromXML(word, child));
          break;

        case 'w:bookmarkStart':
          smartTag.addChild(BookmarkStart.fromXML(word, child));

        case 'w:bookmarkEnd':
          // 没啥用所以不解析了
          break;

        case 'w:proofErr':
        case 'w:noProof':
          // 语法检查
          break;

        case 'w:smartTagPr':
          // 看起来对渲染没用
          break;

        case 'w:del':
          // del 看起来主要是用于跟踪历史的，先不支持
          break;

        default:
          console.warn('parse Inline: Unknown key', tagName, child);
      }
    }

    return smartTag;
  }
}
