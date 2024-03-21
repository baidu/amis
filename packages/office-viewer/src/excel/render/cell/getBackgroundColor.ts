import {CT_Fill} from '../../../openxml/ExcelTypes';
import {IDataProvider} from '../../types/IDataProvider';

export function getBackgroundColor(
  dataProvider: IDataProvider,
  fill?: CT_Fill
) {
  if (fill) {
    const patternFill = fill.patternFill;
    if (patternFill) {
      const patternType = patternFill.patternType;

      // TODO: 很多不支持，比如 darkHorizontal，实现成本有点高
      switch (patternType) {
        case 'solid':
          const fgColor = patternFill.fgColor;
          if (fgColor) {
            return dataProvider.getColor(fgColor);
          }
          break;

        // 这些颜色主要是 copilot 生成的，没验证过
        case 'mediumGray':
          return '#808080';

        case 'darkGray':
          return '#A9A9A9';

        case 'lightGray':
          return '#D3D3D3';

        case 'gray125':
          return '#E0E0E0';

        case 'gray0625':
          return '#F2F2F2';

        case 'none':
          return 'none';

        default:
          break;
      }

      if (patternFill.bgColor) {
        return dataProvider.getColor(patternFill.bgColor);
      }
    }
    // TODO: 还未支持
    const gradientFill = fill.gradientFill;
    if (gradientFill) {
    }
  }
  return 'none';
}
