/**
 * section 属性
 * word 文档是按 section 组织的
 * 参考了 docx 里的类型定义
 */

import {loopChildren, WAttr, WTag, XMLData} from '../../OpenXML';
import {parseSize} from '../../parse/parseSize';
import {
  ST_ChapterSep,
  ST_DocGrid,
  ST_LineNumberRestart,
  ST_NumberFormat,
  ST_PageBorderDisplay,
  ST_PageBorderOffset,
  ST_PageBorderZOrder,
  ST_PageOrientation,
  ST_SectionMark,
  ST_TextDirection
} from '../Types';
import {BorderOptions} from './Border';
import {Hyperlink} from './Hyperlink';
import {Paragraph} from './Paragraph';
import {Table} from './Table';
import {VerticalAlign} from './VerticalAlign';

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

export interface SectionProperties {
  pageSize?: PageSize;
  pageMargin?: PageMargin;
}

export class Section {
  properties: SectionProperties = {};
  children: SectionChild[] = [];

  addChild(child: SectionChild) {
    this.children.push(child);
  }

  static parseProperties(data: XMLData): SectionProperties {
    const properties: SectionProperties = {};

    loopChildren(data, (key, value) => {
      if (typeof value !== 'object') {
        return;
      }

      switch (key) {
        case WTag.pgSz:
          properties.pageSize = {
            width: parseSize(value, WAttr.w),
            height: parseSize(value, WAttr.h)
          };

          break;

        case WTag.pgMar:
          properties.pageMargin = {
            left: parseSize(value, WAttr.left),
            right: parseSize(value, WAttr.right),
            top: parseSize(value, WAttr.top),
            bottom: parseSize(value, WAttr.bottom),
            header: parseSize(value, WAttr.header),
            footer: parseSize(value, WAttr.footer),
            gutter: parseSize(value, WAttr.gutter)
          };
          break;

        default:
          break;
      }
    });

    return properties;
  }
}
