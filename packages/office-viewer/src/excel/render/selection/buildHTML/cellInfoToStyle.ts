import {Workbook} from '../../../Workbook';
import {CellInfo} from '../../../types/CellInfo';
import {getBackgroundColor} from '../../cell/getBackgroundColor';
import {buildBorder} from './buildBorder';

/**
 * 生成单元格样式
 */
export function cellInfoToStyle(workbook: Workbook, cellInfo: CellInfo) {
  let style = '';
  const dataProvider = workbook.getDataProvider();
  const fontStyle = dataProvider.getFontStyle(cellInfo.font);
  if (fontStyle.b) {
    style += 'font-weight: bold;';
  }

  if (fontStyle.i) {
    style += 'font-style: italic;';
  }

  if (fontStyle.u === 'single') {
    style += 'text-decoration: underline;';
  }

  if (fontStyle.strike) {
    style += 'text-decoration: line-through;';
  }

  if (fontStyle.color) {
    style += `color: ${fontStyle.color};`;
  }

  if (fontStyle.size) {
    style += `font-size: ${fontStyle.size}pt;`;
  }

  if (fontStyle.family) {
    style += `font-family: ${fontStyle.family};`;
  }

  if (cellInfo.fill) {
    const dataProvider = workbook.getDataProvider();
    const backgroundColor = getBackgroundColor(dataProvider, cellInfo.fill);
    if (backgroundColor !== 'none') {
      style += `background-color: ${backgroundColor};`;
    }
  }

  if (cellInfo.alignment) {
    if (cellInfo.alignment.horizontal) {
      style += `text-align: ${cellInfo.alignment.horizontal};`;
    }

    if (cellInfo.alignment.vertical) {
      style += `vertical-align: ${cellInfo.alignment.vertical};`;
    }
  }

  if (cellInfo.border) {
    const dataProvider = workbook.getDataProvider();
    const border = cellInfo.border;
    if (border.left) {
      style += buildBorder('border-left', border.left, dataProvider);
    }

    if (border.right) {
      style += buildBorder('border-right', border.right, dataProvider);
    }

    if (border.top) {
      style += buildBorder('border-top', border.top, dataProvider);
    }

    if (border.bottom) {
      style += buildBorder('border-bottom', border.bottom, dataProvider);
    }
  }

  return style;
}
