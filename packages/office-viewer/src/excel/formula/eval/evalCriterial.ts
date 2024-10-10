import {Criteria} from '../parser/parseCriteria';

const type2Number = {boolean: 3, string: 2, number: 1};

type typeName = keyof typeof type2Number;

type Value = string | number | boolean | undefined;

function compareOp(
  value1: Value,
  infix: Criteria['op'],
  value2: Value
): boolean {
  if (!value1) {
    value1 = 0;
  }
  if (!value2) {
    value2 = 0;
  }

  if (Array.isArray(value2)) {
    return compareOp(value1, infix, value2[0]);
  }

  const type1 = typeof value1 as typeName,
    type2 = typeof value2 as typeName;

  if (type1 === type2) {
    // same type comparison
    switch (infix) {
      case '=':
        return value1 === value2;
      case '>':
        return value1 > value2;
      case '<':
        return value1 < value2;
      case '<>':
        return value1 !== value2;
      case '<=':
        return value1 <= value2;
      case '>=':
        return value1 >= value2;
    }
  } else {
    switch (infix) {
      case '=':
        return false;
      case '>':
        return type2Number[type1] > type2Number[type2];
      case '<':
        return type2Number[type1] < type2Number[type2];
      case '<>':
        return true;
      case '<=':
        return type2Number[type1] <= type2Number[type2];
      case '>=':
        return type2Number[type1] >= type2Number[type2];
    }
  }
  throw Error('Infix.compareOp: Should not reach here.');
}

export function evalCriterial(
  criteria: Criteria,
  value: string | number | boolean
): boolean {
  if (criteria.op === 'wc') {
    return criteria.match === (criteria.value as RegExp).test('' + value);
  }

  return compareOp(value, criteria.op, criteria.value as Value);
}
