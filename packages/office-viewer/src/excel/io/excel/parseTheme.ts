/**
 * 解析主题，由于类型冲突，这里是用 DMLTypes
 * @param xml
 */

import {autoParse} from '../../../common/autoParse';
import {CT_OfficeStyleSheet_Attributes} from '../../../openxml/DMLTypes';
import {xml2json} from '../../../util/xml';
import {CT_Theme} from '../../types/CT_Theme';

export async function parseTheme(xml: string): Promise<CT_Theme> {
  if (!xml) {
    throw new Error('xml is empty');
  }
  const node = await xml2json(xml);
  const theme = autoParse(node, CT_OfficeStyleSheet_Attributes, true);

  // 因为后面查询是根据索引，所以这里将属性转成索引
  const colorList: string[] = [];
  for (const key in theme?.themeElements?.clrScheme || {}) {
    // 解析后包含了 name 属性，这里要过滤掉
    if (key === 'name') {
      continue;
    }
    const color = theme?.themeElements?.clrScheme[key];
    colorList.push(color);
  }

  if (theme.themeElements) {
    theme.themeElements.clrSchemes = colorList;
  }

  return theme;
}
