import {CT_AutoFilter} from '../../../openxml/ExcelTypes';
import {parseRange} from '../../io/excel/util/Range';
import {Sheet} from '../../sheet/Sheet';
import {rectIntersect} from '../Rect';
import {AutoFilterIconUI} from './AutoFilterIconUI';

const AutoFilterIconCache: Record<string, AutoFilterIconUI> = {};

/**
 * 渲染 AutoFilter 图标
 */
export function renderAutoFilterIcon(
  sheet: Sheet,
  autoFilter: CT_AutoFilter,
  id: string,
  dataContainer: HTMLElement,
  headerRowCount: number = 1
) {
  const {ref} = autoFilter;
  if (!ref) {
    console.warn('缺少 ref 字段', autoFilter);
    return;
  }

  const sheetDataRect = sheet.getDataDisplayRect();

  const {rowHeaderWidth, colHeaderHeight} = sheet.getRowColSize();

  const rangeRef = parseRange(ref);
  const startRow = rangeRef.startRow;
  const startCol = rangeRef.startCol;
  const endCol = rangeRef.endCol;

  let colIndex = -1;
  // 初始化 dom 结构及对象结构
  for (let i = startCol; i <= endCol; i++) {
    colIndex++;
    const fid = `autoFilter-${id}-${colIndex}`;
    const filterIconElement = dataContainer.querySelector(
      `[data-fid="${fid}"]`
    );
    if (filterIconElement) {
      continue;
    }
    const filterIcon = new AutoFilterIconUI(
      sheet,
      dataContainer,
      autoFilter,
      rangeRef,
      colIndex,
      fid,
      headerRowCount
    );
    AutoFilterIconCache[fid] = filterIcon;
  }

  colIndex = -1;
  // 判断是否需要显示
  for (let i = startCol; i <= endCol; i++) {
    colIndex++;
    const fid = `autoFilter-${id}-${colIndex}`;
    const position = sheet.getCellPosition(startRow, i);
    const autoFilerIcon = AutoFilterIconCache[fid]!;
    if (rectIntersect(sheetDataRect, position)) {
      autoFilerIcon.updatePosition(
        position.x - rowHeaderWidth,
        position.y - colHeaderHeight,
        // 避免过高展示效果不好
        Math.min(28, position.height),
        position.width
      );
    } else {
      autoFilerIcon.hide();
    }
  }
}
