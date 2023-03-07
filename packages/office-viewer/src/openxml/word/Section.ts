/**
 * section 属性
 * word 文档是按 section 组织的
 * 参考了 docx 里的类型定义
 */

import {BorderOptions} from './Border';
import {Hyperlink} from './Hyperlink';
import {Paragraph} from './Paragraph';
import {Table} from './Table';
import {NumberFormat} from './type/NumberFormat';
import {VerticalAlign} from './VerticalAlign';

export enum PageOrientation {
  PORTRAIT = 'portrait',
  LANDSCAPE = 'landscape'
}

export type IPageSizeAttributes = {
  readonly width?: number;
  readonly height?: number;
  readonly orientation?: PageOrientation;
};

export type IPageMarginAttributes = {
  readonly top?: number;
  readonly right?: number;
  readonly bottom?: number;
  readonly left?: number;
  readonly header?: number;
  readonly footer?: number;
  readonly gutter?: number;
};

export interface IPageNumberTypeAttributes {
  readonly start?: number;
  readonly formatType?: NumberFormat;
  readonly separator?: PageNumberSeparator;
}

export enum PageNumberSeparator {
  HYPHEN = 'hyphen',
  PERIOD = 'period',
  COLON = 'colon',
  EM_DASH = 'emDash',
  EN_DASH = 'endash'
}

export enum PageBorderDisplay {
  ALL_PAGES = 'allPages',
  FIRST_PAGE = 'firstPage',
  NOT_FIRST_PAGE = 'notFirstPage'
}

export enum PageBorderOffsetFrom {
  PAGE = 'page',
  TEXT = 'text'
}

export enum PageBorderZOrder {
  BACK = 'back',
  FRONT = 'front'
}

export interface IPageBorderAttributes {
  readonly display?: PageBorderDisplay;
  readonly offsetFrom?: PageBorderOffsetFrom;
  readonly zOrder?: PageBorderZOrder;
}

export interface IPageBordersOptions {
  readonly pageBorders?: IPageBorderAttributes;
  readonly pageBorderTop?: BorderOptions;
  readonly pageBorderRight?: BorderOptions;
  readonly pageBorderBottom?: BorderOptions;
  readonly pageBorderLeft?: BorderOptions;
}

export enum DocumentGridType {
  DEFAULT = 'default',
  LINES = 'lines',
  LINES_AND_CHARS = 'linesAndChars',
  SNAP_TO_CHARS = 'snapToChars'
}
export interface IDocGridAttributesProperties {
  readonly type?: DocumentGridType;
  readonly linePitch?: number;
  readonly charSpace?: number;
}

export enum PageTextDirectionType {
  LEFT_TO_RIGHT_TOP_TO_BOTTOM = 'lrTb',
  TOP_TO_BOTTOM_RIGHT_TO_LEFT = 'tbRl'
}

export enum LineNumberRestartFormat {
  NEW_PAGE = 'newPage',
  NEW_SECTION = 'newSection',
  CONTINUOUS = 'continuous'
}

type IColumnAttributes = {
  readonly width: number;
  readonly space?: number;
};

export interface Column {
  readonly width?: number;
  readonly space?: number;
}

export type IColumnsAttributes = {
  readonly space?: number;
  readonly count?: number;
  readonly separate?: boolean;
  readonly equalWidth?: boolean;
  readonly children?: readonly Column[];
};

export interface ILineNumberAttributes {
  readonly countBy?: number;
  readonly start?: number;
  readonly restart?: LineNumberRestartFormat;
  readonly distance?: number;
}

export enum SectionType {
  NEXT_PAGE = 'nextPage',
  NEXT_COLUMN = 'nextColumn',
  CONTINUOUS = 'continuous',
  EVEN_PAGE = 'evenPage',
  ODD_PAGE = 'oddPage'
}

export type SectionChild = Paragraph | Table | Hyperlink;

export interface SectionProperties {
  readonly page?: {
    readonly size?: IPageSizeAttributes;
    readonly margin?: IPageMarginAttributes;
    readonly pageNumbers?: IPageNumberTypeAttributes;
    readonly borders?: IPageBordersOptions;
    readonly textDirection?: PageTextDirectionType;
  };
  readonly grid?: IDocGridAttributesProperties;
  readonly lineNumbers?: ILineNumberAttributes;
  readonly titlePage?: boolean;
  readonly verticalAlign?: VerticalAlign;
  readonly column?: IColumnsAttributes;
  readonly type?: SectionType;
}

export class Section {
  properties: SectionProperties = {};
  children: SectionChild[] = [];

  addChild(child: SectionChild) {
    this.children.push(child);
  }
}
