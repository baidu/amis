import {RangeRef} from '../../../types/RangeRef';
import {calcTableRelativePosition} from '../calcTableRelativePosition';

// 一个 9 行列的表格，有 1 个表头、一个汇总行
// 第 3 行和第 3 列是隐藏的

const range: RangeRef = {
  startRow: 0,
  startCol: 0,
  endRow: 9,
  endCol: 9
};

const isRowHidden = (rowIndex: number) => rowIndex === 2;

const isColHidden = (colIndex: number) => colIndex === 2;

const headerRowCount = 1;

const totalsRowCount = 1;

const totalsRowShown = true;

test('header', () => {
  // 有 header 的时候第一行是 header
  expect(
    calcTableRelativePosition(
      range,
      isRowHidden,
      isColHidden,
      0,
      0,
      headerRowCount,
      totalsRowCount,
      totalsRowShown
    )
  ).toEqual({
    rowType: 'header',
    colType: 'odd',
    rowPosition: 'header',
    colPosition: 'first'
  });
});

test('without header', () => {
  // 如果没有 header 的时候第一行是第一行
  expect(
    calcTableRelativePosition(
      range,
      isRowHidden,
      isColHidden,
      0,
      0,
      0,
      totalsRowCount,
      totalsRowShown
    )
  ).toEqual({
    rowType: 'odd',
    colType: 'odd',
    rowPosition: 'first',
    colPosition: 'first'
  });
});

test('firstRow', () => {
  // 有 header 的时候第二个数据是 first
  expect(
    calcTableRelativePosition(
      range,
      isRowHidden,
      isColHidden,
      1,
      0,
      headerRowCount,
      totalsRowCount,
      totalsRowShown
    )
  ).toEqual({
    colPosition: 'first',
    colType: 'odd',
    rowPosition: 'first',
    rowType: 'odd'
  });
});

test('row two', () => {
  // 有 header 的时候第 4 个数据是偶数，也就是相对位置第 2 个
  expect(
    calcTableRelativePosition(
      range,
      isRowHidden,
      isColHidden,
      3,
      0,
      headerRowCount,
      totalsRowCount,
      totalsRowShown
    )
  ).toEqual({
    colPosition: 'first',
    colType: 'odd',
    rowPosition: 'middle',
    rowType: 'even'
  });
});

test('odd', () => {
  // 有 header 的时候第 3 个数据是第 0 个
  expect(
    calcTableRelativePosition(
      range,
      isRowHidden,
      isColHidden,
      2,
      0,
      headerRowCount,
      totalsRowCount,
      totalsRowShown
    )
  ).toEqual({
    rowType: 'odd',
    rowPosition: 'first',
    colType: 'odd',
    colPosition: 'first'
  });
});

test('event', () => {
  // 因为第 3 行是隐藏的，所以第 6 行变成第 4 行，因为要减去 header 和 totals
  expect(
    calcTableRelativePosition(
      range,
      isRowHidden,
      isColHidden,
      5,
      0,
      headerRowCount,
      totalsRowCount,
      totalsRowShown
    )
  ).toEqual({
    colPosition: 'first',
    colType: 'odd',
    rowType: 'even',
    rowPosition: 'middle'
  });
});

test('last row', () => {
  // 因为第 3 行隐藏的，所以第 9 行是最后一行
  expect(
    calcTableRelativePosition(
      range,
      isRowHidden,
      isColHidden,
      8,
      0,
      headerRowCount,
      totalsRowCount,
      totalsRowShown
    )
  ).toEqual({
    colPosition: 'first',
    colType: 'odd',
    rowPosition: 'last',
    rowType: 'odd'
  });
});
