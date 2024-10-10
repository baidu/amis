/**
 * 公式栏
 */

import {H} from '../../../util/H';
import {Workbook} from '../../Workbook';
import {isSingleCell} from '../../io/excel/util/Range';
import {numberToLetters} from '../../io/excel/util/numberToLetters';
import {ExcelRenderOptions} from '../../sheet/ExcelRenderOptions';
import {CellData, updateValue} from '../../types/worksheet/CellData';
import {Input} from '../ui/Input';

export class FormulaBar {
  dom: HTMLElement;

  /**
   * 左侧的单元格名称
   */
  nameBox?: HTMLElement;

  /**
   * 右侧的输入框
   */
  textBox?: HTMLElement;

  workbook: Workbook;

  textInput: Input;

  cellData?: CellData;

  constructor(
    dom: HTMLElement,
    workbook: Workbook,
    renderOptions: ExcelRenderOptions
  ) {
    this.dom = dom;
    this.workbook = workbook;

    if (!renderOptions.showFormulaBar) {
      return;
    }

    this.initDom();
    workbook.uiEvent.on('SWITCH_SHEET', () => {
      this.sync();
    });
    workbook.uiEvent.on('CHANGE_SELECTION', () => {
      this.sync();
    });
  }

  initDom() {
    const nameBox = H('div', {
      className: 'ov-excel-formula-bar__name-box',
      parent: this.dom
    });
    this.nameBox = nameBox;

    const textBox = H('div', {
      className: 'ov-excel-formula-bar__text-box',
      parent: this.dom
    });
    this.textBox = textBox;

    const textInput = new Input({
      container: textBox,
      onChange: value => {
        this.changeCellValue(value);
      },
      style: 'borderLess'
    });
    this.textInput = textInput;
  }

  getActiveCell() {
    const currentSheet = this.workbook.getActiveSheet();
    const selection = currentSheet.getSelection();
    if (!selection) {
      return null;
    }

    return selection.activeCell;
  }

  /**
   * 同步 dom 节点
   */
  sync() {
    const currentSheet = this.workbook.getActiveSheet();
    const activeCell = this.getActiveCell();
    if (!activeCell) {
      return;
    }
    if (isSingleCell(activeCell) || currentSheet.isMergeCell(activeCell)) {
      const cellInfo = this.workbook
        .getActiveSheet()
        .getCellInfo(activeCell.startRow, activeCell.startCol);
      this.textInput.setValue(cellInfo.text);
      this.cellData = currentSheet.getCellData(
        activeCell.startRow,
        activeCell.startCol
      );
    } else {
      this.textInput.setValue('');
    }

    this.nameBox!.innerText = `${numberToLetters(activeCell.startCol)}${
      activeCell.startRow + 1
    }`;
  }

  changeCellValue(value: string) {
    const currentSheet = this.workbook.getActiveSheet();
    const activeCell = this.getActiveCell();
    if (!activeCell) {
      return;
    }
    if (isSingleCell(activeCell) || currentSheet.isMergeCell(activeCell)) {
      currentSheet.updateCellValue(
        activeCell.startRow,
        activeCell.startCol,
        updateValue(value, this.cellData)
      );

      this.workbook.uiEvent.emit(
        'UPDATE_RANGE',
        currentSheet.getIndex(),
        activeCell
      );
    }
  }
}
