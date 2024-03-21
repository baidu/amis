/**
 * 底部 sheet 页签及其它状态栏
 */

import {H} from '../../../util/H';
import {Workbook} from '../../Workbook';
import {ExcelRenderOptions} from '../../sheet/ExcelRenderOptions';
import {SheetList} from './SheetList';
import {StatusBar} from './StatusBar';
import {ZoomLevel} from './ZoomLevel';

export class SheetTabBar {
  constructor(
    container: HTMLElement,
    workbook: Workbook,
    renderOptions: ExcelRenderOptions
  ) {
    if (!renderOptions.showSheetTabBar) {
      return;
    }

    const sheetList = new SheetList(container, workbook, renderOptions);

    const statusBar = new StatusBar(container, workbook, renderOptions);

    const zoomLevel = new ZoomLevel(container, workbook, renderOptions);
  }
}
