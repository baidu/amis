import {MAX_ROW} from '../../../../render/Consts';
import {parseRange} from '../Range';

test('parseRange', () => {
  expect(parseRange('A1')).toEqual({
    startRow: 0,
    startCol: 0,
    endRow: 0,
    endCol: 0
  });
  expect(parseRange('A')).toEqual({
    startRow: 0,
    startCol: 0,
    endRow: MAX_ROW,
    endCol: 0
  });

  expect(parseRange('A:B')).toEqual({
    startRow: 0,
    startCol: 0,
    endRow: MAX_ROW,
    endCol: 1
  });
});
