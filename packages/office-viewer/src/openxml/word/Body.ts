import Word from '../../Word';
import {Paragraph} from './Paragraph';
import {Section, SectionChild, SectionProperties} from './Section';
import {Table} from './Table';

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

  static fromXML(word: Word, element: Element): Body {
    const body = new Body();

    for (const child of element.children) {
      const tagName = child.tagName;
      switch (tagName) {
        case 'w:p':
          const paragraph = Paragraph.fromXML(word, child);
          body.addChild(paragraph);
          break;

        case 'w:sectPr':
          body.addSection(Section.parseProperties(child));
          break;

        case 'w:tbl':
          const table = Table.fromXML(word, child);
          body.addChild(table);

        default:
          console.warn('Body.fromXML Unknown key', tagName);
      }
    }

    return body;
  }
}
