/**
 * @file 用于表格类型的展现效果，界面可定制化能力更强
 */

import React from 'react';
import {Renderer, RendererProps, resolveMappingObject} from 'amis-core';
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
   * 单元格文字是否加粗
   */
  bold?: boolean;

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

  /**
   * 自定义样式
   */
  style?: object;
};

/**
 * 行设置
 */
export type TrObject = {
  /**
   * 行背景色
   */
  background?: string;

  /**
   * 行高度
   */
  height?: number;

  /**
   * 单元格配置
   */
  tds: TdObject[];

  style?: object;
};

/**
 * 列设置
 */
export type ColObject = {
  span?: number;
  style?: Object;
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
  padding?: number | string;

  /**
   * 是否显示边框
   */
  border?: boolean;

  /**
   * 边框颜色
   */
  borderColor?: string;

  /**
   * 标题设置
   */
  caption?: string;

  /**
   * 标题位置
   */
  captionSide?: 'top' | 'bottom';

  /**
   * 行设置
   */
  trs: TrObject[];

  /**
   * 列设置
   */
  cols: ColObject[];
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

const defaultPadding = 'var(--TableCell-paddingY) var(--TableCell-paddingX)';

export default class TableView extends React.Component<TableViewProps, object> {
  static defaultProps: Partial<TableViewProps> = {
    padding: defaultPadding,
    width: '100%',
    border: true,
    borderColor: 'var(--borderColor)'
  };

  constructor(props: TableViewProps) {
    super(props);
  }

  renderTd(td: TdObject, colIndex: number, rowIndex: number) {
    const {border, borderColor, render, style, padding} = this.props;
    const key = `td-${colIndex}`;
    let styleBorder;
    if (border) {
      styleBorder = `1px solid ${borderColor}`;
    }
    return (
      <td
        style={{
          border: styleBorder,
          color: td.color,
          fontWeight: td.bold ? 'bold' : 'normal',
          background: td.background,
          padding: td.padding || padding,
          width: td.width || 'auto',
          textAlign: td.align || 'left',
          verticalAlign: td.valign || 'center',
          ...style
        }}
        align={td.align}
        valign={td.valign}
        rowSpan={td.rowspan}
        colSpan={td.colspan}
        key={key}
      >
        {this.renderTdBody(td.body)}
      </td>
    );
  }

  renderTdBody(body?: SchemaObject) {
    const {render} = this.props;
    return render('td', body || '');
  }

  renderTds(tds: TdObject[], rowIndex: number) {
    const {data} = this.props;
    return tds.map((td, colIndex) =>
      this.renderTd(resolveMappingObject(td, data), colIndex, rowIndex)
    );
  }

  renderTr(tr: TrObject, rowIndex: number) {
    const key = `tr-${rowIndex}`;
    return (
      <tr
        style={{height: tr.height, background: tr.background, ...tr.style}}
        key={key}
      >
        {this.renderTds(tr.tds || [], rowIndex)}
      </tr>
    );
  }

  renderTrs(trs: TrObject[]) {
    const {data} = this.props;
    const tr = trs.map((tr, rowIndex) =>
      this.renderTr(resolveMappingObject(tr, data), rowIndex)
    );
    return tr;
  }

  renderCols() {
    const {cols, data} = this.props;
    if (cols) {
      const colsElement = cols.map(col => {
        col = resolveMappingObject(col, data);
        return <col span={col.span} style={col.style}></col>;
      });
      return <colgroup>{colsElement}</colgroup>;
    }
    return null;
  }

  renderCaption() {
    if (this.props.caption) {
      return (
        <caption
          style={{
            captionSide: this.props.captionSide === 'bottom' ? 'bottom' : 'top'
          }}
        >
          {this.props.caption}
        </caption>
      );
    }
    return null;
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
        {this.renderCaption()}
        {this.renderCols()}
        <tbody>{this.renderTrs(trs)}</tbody>
      </table>
    );
  }
}

@Renderer({
  type: 'table-view',
  autoVar: true
})
export class TableViewRenderer extends TableView {}
