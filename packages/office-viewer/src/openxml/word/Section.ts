/**
 * section 属性
 * word 文档是按 section 组织的
 * 参考了 docx 里的类型定义
 */

import Word from '../../Word';
import {parseSize} from '../../parse/parseSize';
import {ST_PageOrientation} from '../Types';
import {Hyperlink} from './Hyperlink';
import {Paragraph} from './Paragraph';
import {Table} from './Table';
import {Body} from './Body';

export type PageSize = {
  width: string;
  height: string;
  orientation?: ST_PageOrientation;
};

export type PageMargin = {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  header?: string;
  footer?: string;
  gutter?: string;
};

export interface Column {
  width?: number;
  space?: number;
}

export type SectionChild = Paragraph | Table | Hyperlink;

export interface SectionPr {
  pageSize?: PageSize;
  pageMargin?: PageMargin;
}

export class Section {
  properties: SectionPr = {};
  children: SectionChild[] = [];

  addChild(child: SectionChild) {
    this.children.push(child);
  }

  static parsePr(word: Word, element: Element, body: Body): SectionPr {
    const properties: SectionPr = {};

    for (const child of element.children) {
      const tagName = child.tagName;
      switch (tagName) {
        case 'w:pgSz':
          properties.pageSize = {
            width: parseSize(child, 'w:w'),
            height: parseSize(child, 'w:h')
          };

          break;

        case 'w:pgMar':
          properties.pageMargin = {
            left: parseSize(child, 'w:left'),
            right: parseSize(child, 'w:right'),
            top: parseSize(child, 'w:top'),
            bottom: parseSize(child, 'w:bottom'),
            header: parseSize(child, 'w:header'),
            footer: parseSize(child, 'w:footer'),
            gutter: parseSize(child, 'w:gutter')
          };
          break;

        case 'w:headerReference':
          const headerType = child.getAttribute('w:type');
          const headerId = child.getAttribute('r:id');
          // 目前只支持 default 且只支持背景图
          // TODO: 这里 rel 不对，需要用 "/word/_rels/header1.xml.rels，后面得想想怎么改
          if (headerType === 'default' && headerId) {
            const headerRel = word.getDocumentRels(headerId);
            if (headerRel) {
              const headerDoc = word.getXML('/word/' + headerRel.target);
              const headerP = headerDoc.getElementsByTagName('w:p').item(0);
              if (headerP) {
                const p = Paragraph.fromXML(word, headerP);
                body.addChild(p);
              }
            }
          }
          break;

        default:
          break;
      }
    }

    return properties;
  }
}
