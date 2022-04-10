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
   * 宽度，跨几列
   */
  w: number;

  /**
   * 高度，跨几行
   */
  h: number;

  /**
   * 宽度，会影响起始位置对应那一列的宽度
   */
  width?: number | string;

  /**
   * 高度，会影响起始位置那一行的高度，设置为 auto 就会自适应
   */
  height?: number | string;

  /**
   * 水平展示方式，用于内容宽度比 grid 小的情况，默认是 auto 自动撑满
   */
  align?: 'left' | 'right' | 'center' | 'auto';

  /**
   * 垂直展示方式，用于内容高度比 grid 小的情况，默认是 auto 自动撑满
   */
  valign?: 'top' | 'bottom' | 'middle' | 'auto';

  /**
   * 每个格子最外层容器的 className
   */
  gridClassName?: string;
};

export type Grid = GridObject & SchemaObject;

/**
 * 二维布局渲染器。
 * 文档：https://baidu.gitee.io/amis/docs/components/grid-2d
 */
export interface Grid2DSchema extends BaseSchema {
  /**
   * 指定为 grid-2d 展示类型
   */
  type: 'grid-2d';

  /**
   * 列数量，默认是 12
   */
  cols?: number;

  /**
   * grid 2d 容器宽度，默认是 auto
   */
  width?: number | string | 'auto';

  /**
   * 格子间距，默认 0，包含行和列
   */
  gap?: number | string;

  /**
   * 格子行级别的间距，如果不设置就和 gap 一样
   */
  gapRow?: number | string;

  /**
   * 单位行高度，默认 50 px
   */
  rowHeight?: number | string;

  /**
   * 每个格子的配置
   */
  grids: Array<Grid>;
}

export interface Grid2DProps
  extends RendererProps,
    Omit<Grid2DSchema, 'type' | 'className'> {
  itemRender?: (
    item: any,
    key: number,
    length: number,
    props: any
  ) => JSX.Element;
}

// Grid 布局默认的这个命名方式和其它 CSS 差异太大，所以我们使用更类似其它 CSS 的命名
const justifySelfMap = {
  left: 'start',
  right: 'end',
  center: 'center',
  auto: 'stretch'
};

const alignSelfMap = {
  top: 'start',
  bottom: 'end',
  middle: 'center',
  auto: 'stretch'
};

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
    const {render, disabled} = this.props;

    return render(region, node, {disabled});
  }

  renderGrid(grid: GridObject, key: number, length: number) {
    const {itemRender, data} = this.props;

    if (!isVisible(grid as Grid, data)) {
      return null;
    }

    let style: any = {
      gridColumnStart: grid.x,
      gridColumnEnd: grid.x + grid.w,
      gridRowStart: grid.y,
      gridRowEnd: grid.y + grid.h,
      justifySelf: grid.align ? justifySelfMap[grid.align] : 'stretch',
      alignSelf: grid.valign ? alignSelfMap[grid.valign] : 'stretch'
    };

    return (
      <div key={key} style={style} className={grid.gridClassName}>
        {itemRender
          ? itemRender(grid, key, length, this.props)
          : this.renderChild(`grid2d/${key}`, grid as Grid)}
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
      let row = grid.y + grid.h - 1;
      if (row > maxRow) {
        maxRow = row;
      }
    });

    const templateRows = new Array(maxRow);
    templateRows.fill(rowHeight);

    // 根据 grid 中的设置自动更新行列高度
    grids.forEach(grid => {
      if (grid.width) {
        templateColumns[grid.x - 1] = Number.isInteger(grid.width)
          ? grid.width + 'px'
          : grid.width;
      }
      if (grid.height) {
        templateRows[grid.y - 1] = Number.isInteger(grid.height)
          ? grid.height + 'px'
          : grid.height;
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
  type: 'grid-2d'
})
export class Grid2DRenderer extends Grid2D {}
