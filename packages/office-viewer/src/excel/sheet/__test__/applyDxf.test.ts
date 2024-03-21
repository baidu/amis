import {CT_Dxf} from '../../../openxml/ExcelTypes';
import {CellInfo} from '../../types/CellInfo';
import {applyDxf} from '../applyDxf';

test('applyF', () => {
  const cellInfo = {
    fill: {
      patternFill: {
        patternType: 'solid',
        fgColor: {
          theme: 4,
          tint: 0.5999938962981048
        },
        bgColor: {
          theme: 4,
          tint: 0.5999938962981048
        }
      }
    }
  } as Partial<CellInfo>;

  const dxf = {
    fill: {
      patternFill: {
        patternType: 'solid',
        fgColor: {
          theme: 4
        },
        bgColor: {
          theme: 4
        }
      }
    }
  } as CT_Dxf;

  applyDxf(cellInfo, dxf);

  expect(cellInfo).toEqual(dxf);
});
