import {toExcelDate} from '../../io/excel/util/fromExcelDate';
import {getNumber} from '../functions/util/getNumber';
import {EvalResult} from './EvalResult';

export function toNum(evalResult: EvalResult) {
  if (evalResult instanceof Date) {
    return toExcelDate(evalResult);
  }
  const num = getNumber(evalResult, undefined, true);
  if (num !== undefined) {
    return num;
  }
  return 0;
}
