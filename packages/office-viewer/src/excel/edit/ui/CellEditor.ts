import {onClickOutside} from '../../../util/onClickOutside';
import {Workbook} from '../../Workbook';
import {HitTestResult} from '../../render/selection/hitTest';
import {Input} from '../../render/ui/Input';
import {Sheet} from '../../sheet/Sheet';
import {CellData, updateValue} from '../../types/worksheet/CellData';

/**
 * 单元格编辑
 */
export class CellEditor {
  /**
   * 编辑器容器
   */
  editorContainer: HTMLElement;

  workbook: Workbook;

  hitTestResult: HitTestResult;

  value?: string;

  initValue?: string;

  cellData: CellData | undefined;

  sheet: Sheet;

  row: number;

  col: number;

  constructor(
    dataContainer: HTMLElement,
    workbook: Workbook,
    hitTest: HitTestResult
  ) {
    this.workbook = workbook;
    this.editorContainer = document.createElement('div');
    this.editorContainer.className = 'excel-cell-editor';
    dataContainer.appendChild(this.editorContainer);
    this.hitTestResult = hitTest;

    const activeSheet = this.workbook.getActiveSheet();
    this.sheet = activeSheet;

    this.row = hitTest.startRow;
    this.col = hitTest.startCol;

    const cellInfo = activeSheet.getCellInfo(
      hitTest.startRow,
      hitTest.startCol
    );

    this.cellData = activeSheet.getCellData(hitTest.startRow, hitTest.startCol);

    let {x, y, width, height} = activeSheet.getCellDisplaySize(
      hitTest.realRow ?? hitTest.startRow,
      hitTest.realCol ?? hitTest.startCol,
      hitTest.x,
      hitTest.y
    );

    const {rowHeaderWidth, colHeaderHeight} = activeSheet.getRowColSize();
    const padding = 1;

    x = x - rowHeaderWidth + padding;
    y = y - colHeaderHeight + padding;
    width = width - padding * 2;
    height = height - padding * 2;

    this.initValue = cellInfo.value;
    this.value = cellInfo.value;

    const input = new Input(
      this.editorContainer,
      '',
      cellInfo.value,
      value => {
        this.handleInput(value);
      },
      'borderLess'
    );

    input.force();

    this.editorContainer.style.left = `${x}px`;
    this.editorContainer.style.top = `${y}px`;
    this.editorContainer.style.width = `${width}px`;
    this.editorContainer.style.height = `${height}px`;

    onClickOutside(this.editorContainer, () => {
      this.close();
    });
  }

  handleInput(value: string) {
    this.value = value;
  }

  /**
   * 关闭编辑器
   */
  close() {
    this.editorContainer.remove();

    if (this.value !== undefined && this.value !== this.initValue) {
      this.sheet.updateCellValue(
        this.row,
        this.col,
        updateValue(this.value, this.cellData)
      );

      this.workbook.uiEvent.emit('UPDATE_RANGE', this.sheet.getIndex(), {
        startRow: this.row,
        startCol: this.col,
        endRow: this.row,
        endCol: this.col
      });
    }
  }
}
