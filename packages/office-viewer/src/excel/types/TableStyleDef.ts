/**
 * 表格样式定义，包括内置和自定义的
 */

import {CT_Dxfs, CT_TableStyles} from '../../openxml/ExcelTypes';

export type TableStyleDef = {
  dxfs: CT_Dxfs;
  tableStyles: CT_TableStyles;
};
