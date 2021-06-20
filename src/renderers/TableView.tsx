/**
 * @file 用于表格类型的展现效果，界面可定制化能力更强
 */

import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {Api, SchemaNode, Schema, Action} from '../types';
import {isVisible} from '../utils/helper';
import {BaseSchema, SchemaObject} from '../Schema';

// 为了方便编辑器，目前考虑不区分 th 和 td，但因为可以控制展现，所以能实现一样的效果，同时后续这个组件还承担复杂布局的功能，不适合用 th
export type TdObject = {
  /**
   * 单元格背景色
   */
  background?: string;

  /**
   * 单元格文字颜色
   */
  color?: string;

  /**
   * 单元格的内边距
   */
  padding?: number;

  /**
   * 单元格宽度
   */
  width?: number;

  /**
   * 单元格内的组件
   */
  body?: SchemaObject;

  /**
   * 水平对齐
   */
  align?: 'left' | 'center' | 'right' | 'justify';

  /**
   * 垂直对齐
   */
  valign?: 'top' | 'middle' | 'bottom' | 'baseline';

  /**
   * 跨几行
   */
  colspan?: number;

  /**
   * 跨几列
   */
  rowspan?: number;
};

export type TrObject = {
  /**
   * 行背景色
   */
  background: string;

  /**
   * 行高度
   */
  height: number;

  /**
   * 单元格配置
   */
  tds: TdObject[];
};

/**
 * 表格展现渲染器
 * 文档：https://baidu.gitee.io/amis/docs/components/table-view
 */
export interface TableViewSchema extends BaseSchema {
  /**
   * 指定为 table-view 展示类型
   */
  type: 'table-view';

  /**
   * table 容器宽度，默认是 auto
   */
  width?: number | string;

  /**
   *  默认单元格内边距
   */
  padding?: number;

  /**
   * 是否显示边框
   */
  border?: boolean;

  /**
   * 边框颜色
   */
  borderColor?: string;

  /**
   * 行设置
   */
  trs: TrObject[];
}

export interface TableViewProps
  extends RendererProps,
    Omit<TableViewSchema, 'type' | 'className'> {
  itemRender?: (
    item: any,
    key: number,
    length: number,
    props: any
  ) => JSX.Element;
}

export default class TableView extends React.Component<TableViewProps, object> {
  static defaultProps: Partial<TableViewProps> = {
    padding: 8,
    width: '100%',
    border: true,
    borderColor: 'var(--borderColor)'
  };

  constructor(props: TableViewProps) {
    super(props);
  }

  renderTds(tds: TdObject[]) {
    const {border, borderColor, render} = this.props;
    let styleBorder: string;
    if (border) {
      styleBorder = `1px solid ${borderColor}`;
    }
    const td = tds.map(td => {
      return (
        <td
          style={{
            border: styleBorder,
            color: td.color,
            background: td.background,
            padding: td.padding || 8,
            width: td.width || 'auto',
            textAlign: td.align || 'left',
            verticalAlign: td.valign || 'center'
          }}
          align={td.align}
          valign={td.valign}
          rowSpan={td.rowspan}
          colSpan={td.colspan}
        >
          {render('td', td.body || '')}
        </td>
      );
    });
    return td;
  }

  renderTrs(trs: TrObject[]) {
    const tr = trs.map(tr => {
      return (
        <tr style={{height: tr.height, background: tr.background}}>
          {this.renderTds(tr.tds)}
        </tr>
      );
    });

    return tr;
  }

  render() {
    const {
      width,
      border,
      borderColor,
      trs,
      classnames: cx,
      className
    } = this.props;
    let styleBorder;
    if (border) {
      styleBorder = `1px solid ${borderColor}`;
    }
    return (
      <table
        className={cx('TableView', className)}
        style={{width: width, border: styleBorder, borderCollapse: 'collapse'}}
      >
        {this.renderTrs(trs)}
      </table>
    );
  }
}

@Renderer({
  type: 'table-view'
})
export class TableViewRenderer extends TableView {}
