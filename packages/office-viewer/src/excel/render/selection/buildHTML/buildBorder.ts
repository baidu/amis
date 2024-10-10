import {CT_BorderPr} from '../../../../openxml/ExcelTypes';
import {IDataProvider} from '../../../types/IDataProvider';
import {AUTO_COLOR} from '../../Consts';

/**
 * 生成边框样式
 */
export function buildBorder(
  position: string,
  border: CT_BorderPr,
  dataProvider: IDataProvider
) {
  let color = '';
  if (border.color) {
    color = dataProvider.getColor(border.color, AUTO_COLOR);
  }
  let borderStyle = 'solid';

  switch (border.style) {
    case 'dashDot':
    case 'dashDotDot':
    case 'dashed':
    case 'mediumDashed':
    case 'mediumDashDot':
    case 'mediumDashDotDot':
      borderStyle = 'dashed';
      break;

    case 'dotted':
      borderStyle = 'dotted';
      break;

    case 'double':
      borderStyle = 'double';
      break;

    case 'none':
      return '';
  }

  if (color && color !== 'none') {
    return `${position}: 1px ${borderStyle} ${color}: `;
  }
  return '';
}
