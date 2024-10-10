/**
 * section 属性
 * word 文档是按 section 组织的
 * 参考了 docx 里的类型定义
 */

import Word from '../../Word';
import {parseSize} from '../../word/parse/parseSize';
import {ST_PageOrientation} from '../Types';
import {Hyperlink} from './Hyperlink';
import {Paragraph} from './Paragraph';
import {Table} from './Table';
import {Body} from './Body';
import {getAttrNumber} from '../../OpenXML';
import {Header} from './Header';

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

/**
 * 列设置，其实这里支持
 */
export interface Column {
  num?: number;
  space?: string;
}

export type SectionChild = Paragraph | Table;

export interface SectionPr {
  pageSize?: PageSize;
  pageMargin?: PageMargin;
  cols?: Column;
  headers?: {[key in HeaderType]?: Header};
  footers?: {[key in HeaderType]?: Header};
}

export type HeaderType = 'default' | 'first' | 'even';

function parseHeader(word: Word, element: Element, type: 'header' | 'footer') {
  const headerType = element.getAttribute('w:type') as HeaderType;
  const headerId = element.getAttribute('r:id');
  if (headerType && headerId) {
    const headerRel = word.getDocumentRels(headerId);
    if (headerRel) {
      const headerDoc = word.getXML('/word/' + headerRel.target);
      if (headerDoc) {
        const header = Header.fromXML(word, headerDoc);
        return {
          headerType,
          header
        };
      }
    }
  }
  return null;
}

export class Section {
  properties: SectionPr = {};
  children: SectionChild[] = [];

  addChild(child: SectionChild) {
    this.children.push(child);
  }

  static parsePr(word: Word, element: Element, body: Body): SectionPr {
    const properties: SectionPr = {};
    properties.headers = {};
    properties.footers = {};

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
          const header = parseHeader(word, child, 'header');
          if (header) {
            properties.headers[header.headerType] = header.header;
          }
          break;

        case 'w:footerReference':
          const footer = parseHeader(word, child, 'footer');
          if (footer) {
            properties.footers[footer.headerType] = footer.header;
          }
          break;

        case 'w:cols':
          const cols: Column = {};
          const num = getAttrNumber(child, 'w:num', 1);
          cols.num = num;
          const space = parseSize(child, 'w:space');
          if (space) {
            cols.space = space;
          }
          properties.cols = cols;
          break;

        default:
          break;
      }
    }

    return properties;
  }
}
