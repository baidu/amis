import {IWorkbook} from '../types/IWorkbook';

const themeColorMap: Record<string, string> = {
  dk1: '#000000',
  lt1: '#FFFFFF',
  dk2: '#1F497D',
  lt2: '#EEECE1',
  accent1: '#4F81BD',
  accent2: '#C0504D',
  accent3: '#9BBB59',
  accent4: '#8064A2',
  accent5: '#4BACC6',
  accent6: '#F79646',
  hlink: '#0000FF',
  folHlink: '#800080'
};

function normalizeColor(color: string) {
  switch (color) {
    case 'light1':
    case 'bg1':
      return 'lt1';
    case 'light2':
    case 'bg2':
      return 'lt2';

    case 'dark1':
    case 'tx1':
      return 'dk1';

    case 'dark2':
      return 'dk2';

    default:
      break;
  }

  return color;
}

export function getThemeColor(themeId: number | string, workbook?: IWorkbook) {
  if (typeof themeId === 'string') {
    themeId = normalizeColor(themeId);
  }
  // TODO: 这个主要是为了支持图形
  if (themeId in themeColorMap) {
    return themeColorMap[themeId];
  }

  const theme = workbook?.theme?.themeElements?.clrSchemes;
  // TODO: 从 LuckyExcel 抄来的，不知道为啥这几个是反的
  if (themeId == 0) {
    themeId = 1;
  } else if (themeId == 1) {
    themeId = 0;
  } else if (themeId == 2) {
    themeId = 3;
  } else if (themeId == 3) {
    themeId = 2;
  }
  if (theme) {
    const color = theme[themeId as number];
    if (color) {
      const rgbColor = color.srgbClr;
      if (rgbColor) {
        return rgbColor.val!;
      }
      const sysColor = color.sysClr;
      if (sysColor) {
        return sysColor.lastClr!;
      }
    }
  }
  console.warn('unknown theme color', themeId, theme);
  return 'none';
}
