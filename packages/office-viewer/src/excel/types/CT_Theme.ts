/**
 * 补充了 clrSchemes 方便查找
 */

import {
  CT_BaseStyles,
  CT_Color,
  CT_ColorSchemeList,
  CT_CustomColorList,
  CT_ObjectStyleDefaults,
  CT_OfficeArtExtensionList,
  CT_OfficeStyleSheet
} from '../../openxml/DMLTypes';

export interface CT_Theme extends CT_OfficeStyleSheet {
  themeElements?: CT_MyBaseStyles;
  objectDefaults?: CT_ObjectStyleDefaults;
  extraClrSchemeLst?: CT_ColorSchemeList;
  custClrLst?: CT_CustomColorList;
  extLst?: CT_OfficeArtExtensionList;
  name?: string;
}

export interface CT_MyBaseStyles extends CT_BaseStyles {
  // 数组格式方便按索引查
  clrSchemes?: CT_Color[];
}
