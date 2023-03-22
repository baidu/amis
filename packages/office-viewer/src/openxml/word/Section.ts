/**
 * section 属性
 * word 文档是按 section 组织的
 * 参考了 docx 里的类型定义
 */

import {parseSize} from '../../parse/parseSize';
import {ST_PageOrientation} from '../Types';
import {Hyperlink} from './Hyperlink';
import {Paragraph} from './Paragraph';
import {Table} from './Table';

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

  static parsePr(element: Element): SectionPr {
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

        default:
          break;
      }
    }

    return properties;
  }
}
