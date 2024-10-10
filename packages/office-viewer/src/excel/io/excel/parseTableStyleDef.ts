import {autoParse} from '../../../common/autoParse';
import {
  CT_Dxfs_Attributes,
  CT_TableStyles_Attributes
} from '../../../openxml/ExcelTypes';
import {XMLNode} from '../../../util/xml';
import {TableStyleDef} from '../../types/TableStyleDef';

export function parseTableStyleDef(node: XMLNode): TableStyleDef | null {
  let dxfs;
  let tableStyles;
  for (const child of node.children) {
    if (child.tag === 'dxfs') {
      dxfs = autoParse(child, CT_Dxfs_Attributes);
    } else if (child.tag === 'tableStyles') {
      tableStyles = autoParse(child, CT_TableStyles_Attributes);
    }
  }
  if (!dxfs || !tableStyles) {
    return null;
  }
  return {
    dxfs,
    tableStyles
  };
}
