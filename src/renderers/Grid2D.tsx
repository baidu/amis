import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {Api, SchemaNode, Schema, Action} from '../types';
import {isVisible} from '../utils/helper';
import {BaseSchema, SchemaObject} from '../Schema';

export type GridObject = {
  /**
   * 起始横坐标位置，以 1 为起点
   */
  x: number;

  /**
   * 起始纵坐标位置，以 1 为起点
   */
  y: number;

  /**
   * 宽度，跨几列，如果设置 auto 会使得那一列变成 auto
   */
  w: number | 'auto';

  /**
   * 高度，跨几行，auto 用于支持高度不确定的容器，最终高度由内容决定
   */
  h: number | 'auto';

  /**
   * 水平展示方式，用于内容宽度比 grid 小的情况，默认是 auto 自动撑满
   */
  align?: 'left' | 'right' | 'center' | 'auto';

  /**
   * 垂直展示方式，用于内容高度比 grid 小的情况，默认是 auto 自动撑满
   */
  vAlign?: 'top' | 'bottom' | 'middle' | 'auto';
};

export type Grid = GridObject & SchemaObject;

/**
 * 二维布局渲染器。
 * 文档：https://baidu.gitee.io/amis/docs/components/grid-2d
 */
export interface Grid2DSchema extends BaseSchema {
  /**
   * 指定为each展示类型
   */
  type: 'grid-2d';

  /**
   * 列数量，默认是 12
   */
  cols?: number;

  /**
   * 移动端下的列数量，默认是 1，也就是移动端只有一列，如果加大这个值，比如 6，则两个宽度是 3 的 grid 就能并排展示
   */
  colsMobile?: number;

  /**
   * grid 2d 容器宽度，默认是 auto
   */
  width?: number | string | 'auto';

  /**
   * grid 间距，默认 0，包含行和列
   */
  gap?: number | string;

  /**
   * grid 行级别的间距，如果不设置就和 gap 一样
   */
  gapRow?: number | string;

  /**
   * 单位行高度，默认 50 px
   */
  rowHeight?: number | string;

  /**
   * 每个 grid 的配置
   */
  grids: Array<Grid>;
}

export interface Grid2DProps extends RendererProps, Grid2DSchema {
  className: string;
  itemRender?: (
    item: any,
    key: number,
    length: number,
    props: any
  ) => JSX.Element;
}

export default class Grid2D extends React.Component<Grid2DProps, object> {
  static propsList: Array<string> = ['grids'];

  static defaultProps: Partial<Grid2DProps> = {
    cols: 12,
    width: 'auto',
    gap: 0,
    rowHeight: '3.125rem'
  };

  constructor(props: Grid2DProps) {
    super(props);
  }

  renderChild(region: string, node: Schema) {
    const {render} = this.props;

    return render(region, node);
  }

  renderGrid(grid: Grid, key: number, length: number) {
    const {itemRender, data, className} = this.props;

    if (!isVisible(grid, data)) {
      return null;
    }

    let style = {
      gridColumnStart: grid.x,
      gridColumnEnd: grid.w === 'auto' ? 'auto' : grid.x + grid.w,
      gridRowStart: grid.y,
      gridRowEnd: grid.h === 'auto' ? 'auto' : grid.y + grid.h
    };

    return (
      <div key={key} style={style} className={grid.className}>
        {itemRender
          ? itemRender(grid, key, length, this.props)
          : this.renderChild(`grid2d/${key}`, grid)}
      </div>
    );
  }

  renderGrids() {
    const {grids} = this.props;

    return grids.map((grid, key) => this.renderGrid(grid, key, grids.length));
  }

  render() {
    const {grids, cols, gap, gapRow, width, rowHeight} = this.props;

    const templateColumns = new Array(cols);
    templateColumns.fill('1fr');

    let maxRow = 0;

    // 计算最大有多少行
    grids.forEach((grid, index) => {
      let row = grid.y + (grid.h === 'auto' ? 0 : grid.h) - 1;
      if (row > maxRow) {
        maxRow = row;
      }
    });

    const templateRows = new Array(maxRow);
    templateRows.fill(rowHeight);

    // 自适应高宽的情况
    grids.forEach((grid, index) => {
      if (grid.h === 'auto') {
        templateColumns[grid.y - 1] = 'auto';
      }
      if (grid.w === 'auto') {
        templateColumns[grid.x - 1] = 'auto';
      }
    });

    const style = {
      display: 'grid',
      columnGap: gap,
      rowGap: typeof gapRow === 'undefined' ? gap : gapRow,
      width,
      gridTemplateColumns: templateColumns.join(' '),
      gridTemplateRows: templateRows.join(' ')
    };

    return <div style={style}>{this.renderGrids()}</div>;
  }
}

@Renderer({
  test: /(^|\/)grid-2d$/,
  name: 'grid-2d'
})
export class Grid2DRenderer extends Grid2D {}
