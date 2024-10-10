import {makeBlankValue} from '../makeBlankValue';

test('makeBlankValue', () => {
  const cellData: any[] = [];
  makeBlankValue(cellData, {
    startRow: 3,
    endRow: 6,
    startCol: 2,
    endCol: 4
  });

  expect(cellData[3][3]).toEqual({
    type: 'blank'
  });
});
