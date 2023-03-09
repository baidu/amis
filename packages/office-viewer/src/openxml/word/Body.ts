import {loopChildren, WTag, XMLData} from '../../OpenXML';
import Word from '../../Word';
import {Paragraph} from './Paragraph';
import {Section, SectionChild, SectionProperties} from './Section';

/**
 * body 类型定义
 * http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/body.html
 */
export class Body {
  sections: Section[] = [];
  // 当前在哪个 section
  currentSection: Section;

  constructor() {
    // 默认构建第一个 section
    this.currentSection = new Section();
    this.sections.push(this.currentSection);
  }

  addChild(child: SectionChild) {
    this.currentSection.addChild(child);
  }

  /**
   * 添加 secetion
   * @param properties 前一个 section 的属性
   */
  addSection(properties: SectionProperties) {
    this.currentSection.properties = properties;
    this.currentSection = new Section();
    this.sections.push(this.currentSection);
  }

  static fromXML(word: Word, data: XMLData): Body {
    const body = new Body();
    loopChildren(data, (key, value) => {
      // 只支持标签
      if (typeof value === 'object') {
        switch (key) {
          case WTag.p:
            const paragraph = Paragraph.fromXML(word, value as XMLData);
            body.addChild(paragraph);
            break;

          case WTag.sectPr:
            body.addSection(Section.parseProperties(value as XMLData));
            break;
          default:
            break;
        }
      }
    });
    return body;
  }
}
