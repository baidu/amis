import FormulaError from '../../FormulaError';
import {EvalResult} from '../../eval/EvalResult';
import {evalCriterial} from '../../eval/evalCriterial';
import {parseCriteria} from '../../parser/parseCriteria';
import {flattenArgs} from './flattenArgs';
import {getArray} from './getArray';
import {getString} from './getString';

export function evalIFS(args: EvalResult[]): EvalResult[] {
  const range = getArray(args.shift());

  const criteriaes = args;
  const criteriaLength = criteriaes.length / 2;

  if (criteriaLength === 0) {
    throw FormulaError.VALUE;
  }

  if (criteriaes.length !== 1 && criteriaes.length % 2 !== 0) {
    throw FormulaError.VALUE;
  }

  if (criteriaLength > 1) {
    for (let i = 0; i < criteriaLength; i++) {
      criteriaes[i * 2] = flattenArgs([criteriaes[i * 2]]);
    }
  }

  if (criteriaes.length === 1) {
    criteriaes[1] = criteriaes[0];
    criteriaes[0] = range;
  }

  let values: EvalResult[] = [];

  for (let i = 0; i < range.length; i++) {
    let isMetCondition = false;

    for (let j = 0; j < criteriaLength; j++) {
      const valueToTest = (criteriaes[j * 2] as EvalResult[])[i];
      const criteria = criteriaes[j * 2 + 1];

      const parsedCriteria = parseCriteria(criteria as string);
      if (evalCriterial(parsedCriteria, valueToTest as string)) {
        isMetCondition = true;
      } else {
        isMetCondition = false;
        break;
      }
    }

    if (isMetCondition) {
      values.push(range[i]);
    }
  }
  return values;
}
