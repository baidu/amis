import {CellValue} from '../../types/CellValue';
import {gt, lt} from '../../../util/number';

export function getMinMax(rangeValues: CellValue[]) {
  let min;
  let max;

  for (const value of rangeValues) {
    const val = value.value;
    if (val === '' || val === undefined) {
      continue;
    }
    let num: number;
    if (typeof val === 'boolean') {
      num = val ? 1 : 0;
    }
    if (typeof val === 'string') {
      num = parseFloat(val);
    }
    if (typeof val === 'number') {
      num = val;
    }
    if (val === undefined) {
      continue;
    }
    if (min === undefined || lt(num!, min)) {
      min = num!;
    }
    if (max === undefined || gt(num!, max)) {
      max = num!;
    }
  }

  return {
    min,
    max
  };
}
