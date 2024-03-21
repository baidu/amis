/**
 * Excel 文件定义主入口，包括所有相关文件
 */

import {ContentTypes} from '../../openxml/ContentType';
import {IWorkbook} from './IWorkbook';

export interface ExcelFile {
  /**
   * [Content_Types].xml，暂时不详细解析
   */
  contentTypes: ContentTypes;

  workbook: IWorkbook;
}
