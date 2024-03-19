import {RangeRef} from '../../types/RangeRef';
import {FrozenViewRange} from '../cell/frozen/drawFrozen';
import {Position} from './Position';
import {hitTestInRange} from './hitTestInRange';
import {CellInfo} from '../../types/CellInfo';
import {
  IAbsoluteAnchor,
  IOneCellAnchor,
  ITwoCellAnchor
} from '../../types/IDrawing';
import {Region, ViewRange} from '../../sheet/ViewRange';

export type HitTestCommon = Position & RangeRef;

/**
 * 点击到表头的最左上角
 */
export type HitTestResult = HitTestCommon & {
  /**
   * 点击到的类型
   */
  type:
    | 'drawing' // 图形，包括图片、图表、文本框
    | 'corner' // 最左上角的角落，全选所有数据
    | 'cell' // 单元格
    | 'row-header' // 左侧 header
    | 'col-header' // 顶部 header
    | 'row-grid' // 左侧 header 的网格线
    | 'col-grid'; // 顶部 header 的网格线
  /**
   * 点击到的区域
   */
  region: Region;

  /**
   * 点到图形
   */
  drawing?: IOneCellAnchor | ITwoCellAnchor | IAbsoluteAnchor;

  /**
   * 点击到的单元格信息，这个不受合并单元格的影响
   */
  realRow?: number;

  /**
   * 点击到的单元格信息，这个不受合并单元格的影响
   */
  realCol?: number;
};

/**
 * 判断当前点击位置下是什么
 * @param offsetX 鼠标点击的 x 坐标
 * @param offsetY 鼠标点击的 y 坐标
 * @param rowHeaderWidth 表头行高
 * @param colHeaderHeight 表头列宽
 * @param viewRange 内容显示区的范围
 * @param frozenViewRange 冻结区域的范围
 */
export function hitTest(
  offsetX: number,
  offsetY: number,
  rowHeaderWidth: number,
  colHeaderHeight: number,
  gridLineHitRange: number,
  viewRange: ViewRange | undefined,
  frozenViewRange: FrozenViewRange | undefined,
  mergeCells: RangeRef[]
): HitTestResult | null {
  // 点击到表头左上角，这个行为是选中所有行和列
  if (offsetX < rowHeaderWidth && offsetY < colHeaderHeight) {
    return {
      type: 'corner',
      region: 'normal',
      startRow: 0,
      startCol: 0,
      endCol: 0,
      endRow: 0,
      x: 0,
      y: 0,
      width: rowHeaderWidth,
      height: colHeaderHeight
    };
  }

  if (frozenViewRange) {
    const {topViewRange, leftViewRange, topLeftViewRange} = frozenViewRange;

    const hitTestTopLeft = hitTestInRange(
      'top-left-frozen',
      topLeftViewRange,
      offsetX,
      offsetY,
      rowHeaderWidth,
      colHeaderHeight,
      gridLineHitRange,
      mergeCells
    );
    if (hitTestTopLeft) {
      return hitTestTopLeft;
    }

    const hitTestLeft = hitTestInRange(
      'left-frozen',
      leftViewRange,
      offsetX,
      offsetY,
      rowHeaderWidth,
      colHeaderHeight,
      gridLineHitRange,
      mergeCells
    );

    if (hitTestLeft) {
      return hitTestLeft;
    }

    const hitTestTop = hitTestInRange(
      'top-frozen',
      topViewRange,
      offsetX,
      offsetY,
      rowHeaderWidth,
      colHeaderHeight,
      gridLineHitRange,
      mergeCells
    );
    if (hitTestTop) {
      return hitTestTop;
    }
  }

  return hitTestInRange(
    'normal',
    viewRange,
    offsetX,
    offsetY,
    rowHeaderWidth,
    colHeaderHeight,
    gridLineHitRange,
    mergeCells
  );
}
