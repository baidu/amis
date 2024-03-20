/**
 * 数据表总入口
 */

import {IRelationship} from './IRelationship';
import {ISheet} from './ISheet';

import {
  CT_BookView,
  CT_CalcPr,
  CT_DefinedName,
  CT_Stylesheet,
  CT_WorkbookPr
} from '../../openxml/ExcelTypes';
import {CT_Theme} from './CT_Theme';

export interface IWorkbook {
  /**
   * sheet 列表
   */
  sheets: ISheet[];

  /**
   * calc配置，只有部分配置
   */
  calcPr?: CT_CalcPr;

  /**
   * Defined Names
   */
  definedNames?: CT_DefinedName[];

  /**
   * workbookPr
   */
  workbookPr?: CT_WorkbookPr;

  /**
   * workbookView
   */
  workbookView?: CT_BookView;

  /**
   * workbookRelationships
   */
  workbookRelationships?: IRelationship[];

  /**
   * styles.xml
   */
  styleSheet?: CT_Stylesheet;

  /**
   * theme.xml
   */
  theme: CT_Theme;
}
