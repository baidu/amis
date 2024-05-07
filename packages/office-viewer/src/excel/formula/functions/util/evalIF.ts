import {EvalResult} from '../../eval/EvalResult';
import {evalCriterial} from '../../eval/evalCriterial';
import {parseCriteria} from '../../parser/parseCriteria';
import {getArray} from './getArray';

export function evalIF(args: EvalResult[]): EvalResult[] {
  const range = getArray(args.shift());

  const criteria = args.shift();

  const testRange = args[2] ? getArray(args[2]) : range;

  const values: EvalResult[] = [];

  for (let i = 0; i < range.length; i++) {
    const valueToTest = testRange[i];

    const parsedCriteria = parseCriteria(criteria as string);
    if (evalCriterial(parsedCriteria, valueToTest as string)) {
      values.push(valueToTest);
    }
  }
  return values;
}
