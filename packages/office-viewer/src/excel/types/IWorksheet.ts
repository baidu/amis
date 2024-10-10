import {
  CT_AutoFilter,
  CT_Col,
  CT_ConditionalFormatting,
  CT_Row,
  CT_SheetFormatPr,
  CT_SheetPr,
  CT_SheetView,
  CT_Table
} from '../../openxml/ExcelTypes';
import {CT_ExtensionList} from './CT_ExtensionList';
import {IDrawing} from './IDrawing';
import {RangeRef} from './RangeRef';

import {CellData} from './worksheet/CellData';

/**
 * 对应 Worksheet
 */
export interface IWorksheet {
  sheetPr?: CT_SheetPr;

  dimension?: {
    ref: string;
  };

  sheetViews?: CT_SheetView[];

  sheetFormatPr?: CT_SheetFormatPr;

  cols: CT_Col[];

  /**
   * 行属性，因为数据存在二维数据里，所以需要另一个地方来存行属性，这里的索引是行号，以 0 开始
   */
  rows: CT_Row[];

  /**
   * 数据存储，这里和 xml 里不一样，这里是用二维数组，而且值是解析后的值
   */
  cellData: CellData[][];

  mergeCells: RangeRef[];

  /**
   * 条件格式化
   */
  conditionalFormatting: CT_ConditionalFormatting[];

  /**
   * 图片
   */
  drawing?: IDrawing;

  extLst?: CT_ExtensionList;

  tableParts?: CT_Table[];

  autoFilter?: CT_AutoFilter;
}
