/**
 * 注音
 * http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/ruby.html
 */

import Word from '../../Word';
import {Run} from './Run';

export class RubyPr {}

class RubyBase {
  children: Run[];

  static fromXML(word: Word, element: Element): RubyBase {
    const rubyBase = new RubyBase();
    rubyBase.children = [];

    for (const child of element.children) {
      const tagName = child.tagName;
      switch (tagName) {
        case 'w:r':
          const run = Run.fromXML(word, child);
          if (run) {
            rubyBase.children.push(run);
          }
          break;

        default:
          console.warn('parse Ruby: Unknown key', tagName, child);
      }
    }

    return rubyBase;
  }
}

// 看起来应该是一样的
class RubyText extends RubyBase {}

export class Ruby {
  rt?: RubyText;
  rubyBase?: RubyBase;

  static fromXML(word: Word, element: Element): Ruby {
    const ruby = new Ruby();

    for (const child of element.children) {
      const tagName = child.tagName;
      switch (tagName) {
        case 'w:rubyPr':
          // 应该是没法控制的
          break;

        case 'w:rt':
          ruby.rt = RubyBase.fromXML(word, child);
          break;

        case 'w:rubyBase':
          ruby.rubyBase = RubyBase.fromXML(word, child);
          break;

        default:
          console.warn('parse Ruby: Unknown key', tagName, child);
      }
    }

    return ruby;
  }
}
