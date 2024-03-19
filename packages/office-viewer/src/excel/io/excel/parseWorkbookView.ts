import {autoParse} from '../../../common/autoParse';
import {CT_BookView, CT_BookView_Attributes} from '../../../openxml/ExcelTypes';
import {XMLNode, getNodeByTagName} from '../../../util/xml';

/**
 * workbookView 配置项，后续依赖这个来延迟解析 sheet
 */
export function parseWorkbookView(workbookNode: XMLNode): CT_BookView {
  const workbookViewNode = getNodeByTagName(workbookNode, 'workbookView', true);
  return autoParse(workbookViewNode, CT_BookView_Attributes);
}
