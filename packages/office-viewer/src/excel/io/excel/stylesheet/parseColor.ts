/**
 * 这个比较常用就封装了一下
 */

import {autoParse} from '../../../../common/autoParse';
import {CT_Color_Attributes} from '../../../../openxml/ExcelTypes';
import {XMLNode} from '../../../../util/xml';

export function parseColor(node: XMLNode) {
  return autoParse(node, CT_Color_Attributes);
}
