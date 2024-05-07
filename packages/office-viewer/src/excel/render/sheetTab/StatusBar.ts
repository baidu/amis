import {H} from '../../../util/H';
import {stripNumber} from '../../../util/stripNumber';
import {Workbook} from '../../Workbook';
import {ExcelRenderOptions} from '../../sheet/ExcelRenderOptions';

/**
 * 状态栏，主要是显示平均值、求和等
 */
export class StatusBar {
  status: HTMLElement;
  workbook: Workbook;
  constructor(
    container: HTMLElement,
    workbook: Workbook,
    renderOptions: ExcelRenderOptions
  ) {
    this.workbook = workbook;
    const status = H('div', {
      className: 'ov-excel-sheet-tab-bar__status',
      parent: container
    });
    this.status = status;

    workbook.uiEvent.on('CHANGE_SELECTION', () => {
      this.syncStatus();
    });
  }

  /**
   * 选区变化的时候更新底部状态栏
   */
  syncStatus() {
    const workbook = this.workbook;
    const status = this.status;

    const currentSheet = workbook.getActiveSheet();
    const selection = currentSheet.getSelection();
    if (!selection) {
      status.textContent = '';
      return;
    }

    const rangesData = currentSheet.getCellValueByRanges(
      selection.cellRanges,
      false
    );

    const count = rangesData.length;

    let sum = 0;

    let numberCount = 0;

    for (const data of rangesData) {
      if (data) {
        if (data.isDate) {
          continue;
        }
        const numberVal = parseFloat((data.value || data.text) + ''.trim());
        if (isNaN(numberVal)) {
          continue;
        }
        sum += numberVal;
        numberCount++;
      }
    }

    sum = stripNumber(sum, 10);

    const average = numberCount ? stripNumber(sum / numberCount, 10) : 0;

    status.innerHTML = '';
    const averageTextElement = H('span', {
      class: 'ov-excel-sheet-tab-bar__status-text',
      parent: status,
      innerText: `${workbook.translator('average')}: ${average}`
    });
    const countTextElement = H('span', {
      class: 'ov-excel-sheet-tab-bar__status-text',
      parent: status,
      innerText: `${workbook.translator('count')}: ${count}`
    });

    const sumTextElement = H('span', {
      class: 'ov-excel-sheet-tab-bar__status-text',
      parent: status,
      innerText: `${workbook.translator('sum')}: ${sum}`
    });
  }
}
