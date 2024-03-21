/**
 * 选区使用的 canvas，独立是为了提高渲染性能，在选取变的时候只有这里变化
 */

import {Workbook} from '../Workbook';
import {ExcelRenderOptions} from '../sheet/ExcelRenderOptions';
import {IDataProvider} from '../types/IDataProvider';
import {Canvas} from './Canvas';
import {SheetSelection} from './selection/SheetSelection';
import {drawCellRanges} from './selection/drawCellRanges';

export class SelectionCanvas extends Canvas {
  workbook: Workbook;

  dataProvider: IDataProvider;

  renderOptions: ExcelRenderOptions;

  /**
   * 选区的信息
   */
  selection?: SheetSelection;

  /**
   * 临时行线网格线位置
   */
  tmpRowGridLineY?: number;

  /**
   * 临时列线网格线位置
   */
  tmpColGridLineX?: number;

  constructor(workbook: Workbook, dataProvider: IDataProvider) {
    const {width, height} = workbook.getViewpointSize();
    super(
      width,
      height,
      workbook.renderOptions.scale || 1,
      'ov-excel-selection-canvas ov-excel-canvas'
    );

    this.workbook = workbook;
    this.renderOptions = workbook.renderOptions;
    this.dataProvider = dataProvider;
    workbook.uiEvent.on(
      'CHANGE_SELECTION',
      this.handleChangeSelection.bind(this)
    );
    workbook.uiEvent.on('AFTER_SCROLL', this.draw.bind(this));
    workbook.uiEvent.on('SWITCH_SHEET', this.draw.bind(this));
    workbook.uiEvent.on('DRAG_ROW_GRID_LINE', this.dragRowGridLine.bind(this));
    workbook.uiEvent.on('DRAG_COL_GRID_LINE', this.dragColGridLine.bind(this));
    workbook.uiEvent.on(
      'DRAG_COL_GRID_LINE_END',
      (col: number, width: number) => {
        const sheet = this.workbook.getActiveSheet();
        sheet.setColWidth(col, width);
        this.clearTmpGridLine();
        workbook.uiEvent.emit('UPDATE_COL_WIDTH', col, width);
        this.draw();
      }
    );
    workbook.uiEvent.on(
      'DRAG_ROW_GRID_LINE_END',
      (row: number, height: number) => {
        const sheet = this.workbook.getActiveSheet();
        sheet.setRowHeight(row, height);
        this.clearTmpGridLine();
        workbook.uiEvent.emit('UPDATE_ROW_HEIGHT', row, height);
        this.draw();
      }
    );
  }

  handleChangeSelection(selection: SheetSelection) {
    this.selection = selection;
    this.draw();
  }

  dragRowGridLine(y: number) {
    if (y !== this.tmpRowGridLineY) {
      this.tmpRowGridLineY = y;
      this.draw();
    }
  }

  dragColGridLine(x: number) {
    if (x !== this.tmpColGridLineX) {
      this.tmpColGridLineX = x;
      this.draw();
    }
  }

  clearTmpGridLine() {
    this.tmpRowGridLineY = 0;
    this.tmpColGridLineX = 0;
    this.draw();
  }

  draw() {
    this.clear();
    this.drawTmpGridLine();
    if (this.selection) {
      drawCellRanges(this.workbook, this, this.selection);
    }
  }

  clearSelection() {
    this.selection = undefined;
    this.draw();
  }

  drawTmpGridLine() {
    const {width, height} = this.workbook.getViewpointSize();
    if (this.tmpColGridLineX) {
      this.drawLine(
        {
          x1: this.tmpColGridLineX,
          y1: 0,
          x2: this.tmpColGridLineX,
          y2: height
        },
        this.renderOptions.dragGridLineColor
      );
    }
    if (this.tmpRowGridLineY) {
      this.drawLine(
        {
          x1: 0,
          y1: this.tmpRowGridLineY,
          x2: width,
          y2: this.tmpRowGridLineY
        },
        this.renderOptions.dragGridLineColor
      );
    }
  }
}
