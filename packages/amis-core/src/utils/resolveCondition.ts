import get from 'lodash/get';
import endsWith from 'lodash/endsWith';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import startsWith from 'lodash/startsWith';
import {resolveVariableAndFilterForAsync} from './resolveVariableAndFilterForAsync';

const conditionResolverMap: {
  [op: string]: (left: any, right: any, fieldType?: string) => boolean;
} = {};

export async function resolveCondition(conditions: any, data: any) {
  if (
    !conditions ||
    !conditions.conjunction ||
    !Array.isArray(conditions.children) ||
    !conditions.children.length
  ) {
    return false;
  }

  return await computeConditions(
    conditions.children,
    conditions.conjunction,
    data
  );
}

async function computeConditions(
  conditions: any[],
  conjunction: 'or' | 'and' = 'and',
  data: any
): Promise<boolean> {
  let computeResult = true;
  for (let index = 0; index < conditions.length; index++) {
    const item = conditions[index];

    if (
      item.conjunction &&
      Array.isArray(item.children) &&
      item.children.length
    ) {
      // get group result
      const result = await computeConditions(
        item.children,
        item.conjunction,
        data
      );

      if (!!result) {
        if (conjunction === 'or') {
          computeResult = true;
          break;
        } else if (conjunction === 'and') {
          computeResult = computeResult && result;
        }
      } else {
        if (conjunction === 'and') {
          computeResult = false;
          break;
        } else if (conjunction === 'or') {
          computeResult = computeResult || result;
        }
      }
    } else {
      // get result
      const result = await computeCondition(item, index, data);
      console.log(result);
      if (!!result) {
        if (conjunction === 'or') {
          computeResult = true;
          break;
        } else if (conjunction === 'and') {
          computeResult = index === 0 ? !!result : computeResult && !!result;
        }
      } else {
        if (conjunction === 'and') {
          computeResult = false;
          break;
        } else if (conjunction === 'or') {
          computeResult = index === 0 ? !!result : computeResult || !!result;
        }
      }
    }
  }
  return computeResult;
}

async function computeCondition(
  rule: {
    op: string;
    left: {
      type: string;
      field: string;
    };
    right: any;
  },
  index: number,
  data: any
) {
  if (
    rule.op !== 'is_not_empty' &&
    rule.op !== 'is_empty' &&
    rule.right === undefined
  ) {
    return Promise.resolve();
  }

  const leftValue = get(data, rule.left.field);
  const rightValue: any = await resolveVariableAndFilterForAsync(
    rule.right,
    data
  );

  const func =
    conditionResolverMap[`${rule.op}For${rule.left.type}`] ??
    conditionResolverMap[rule.op];

  return func ? func(leftValue, rightValue, rule.left.type) : false;
}

function startsWithFunc(left: any, right: any) {
  return startsWith(left, right);
}

function endsWithFunc(left: any, right: any) {
  return endsWith(left, right);
}

function equalFunc(left: any, right: any) {
  return isEqual(left, right);
}

function notEqualFunc(left: any, right: any) {
  return !isEqual(left, right);
}

function isEmptyFunc(left: any) {
  if (typeof left === 'string') {
    return !left;
  } else if (typeof left === 'number') {
    return left === undefined;
  } else if (Array.isArray(left)) {
    return !left.length;
  } else if (typeof left === 'object') {
    return isEmpty(left);
  }
  return false;
}

function isNotEmptyFunc(left: any) {
  if (typeof left === 'string') {
    return !left;
  } else if (typeof left === 'number') {
    return left !== undefined;
  } else if (Array.isArray(left)) {
    return !!left.length;
  } else if (typeof left === 'object') {
    return !isEmpty(left);
  }
  return false;
}

function greaterFunc(left: any, right: any) {
  return parseFloat(left as any) > parseFloat(right as any);
}

function greaterOrEqualFunc(left: any, right: any) {
  return parseFloat(left as any) >= parseFloat(right as any);
}

function lessFunc(left: any, right: any) {
  return parseFloat(left as any) < parseFloat(right as any);
}

function lessOrEqualFunc(left: any, right: any) {
  return parseFloat(left as any) <= parseFloat(right as any);
}

function likeFunc(left: any, right: any) {
  return !!~left.indexOf(right);
}

function notLikeFunc(left: any, right: any) {
  return !~left.indexOf(right);
}

function betweenFunc(left: any, right: any) {
  if (typeof left === 'number') {
    const [min, max] = right.sort();
    return left >= parseFloat(min) && left <= parseFloat(max);
  }
  return false;
}

function notBetweenFunc(left: any, right: any) {
  if (typeof left === 'number') {
    const [min, max] = right.sort();
    return left < parseFloat(min) && left > parseFloat(max);
  }
  return false;
}

function selectAnyInFunc(left: any, right: any) {
  if (Array.isArray(left)) {
    return right.every((item: any) => left.includes(item));
  }
  return right.includes(left);
}

function selectNotAnyInFunc(left: any, right: any) {
  if (Array.isArray(left)) {
    return !right.every((item: any) => left.includes(item));
  }
  return !right.includes(left);
}

export function registerConditionResolver(
  op: string,
  func: (left: any, right: any, fieldType?: string) => boolean,
  fieldType?: string
) {
  conditionResolverMap[`${op}${fieldType ? 'For' + fieldType : ''}`] = func;
}

export function getConditionResolvers() {
  return conditionResolverMap;
}

registerConditionResolver('between', betweenFunc);
registerConditionResolver('ends_with', endsWithFunc);
registerConditionResolver('equal', equalFunc);
registerConditionResolver('greater_or_equal', greaterOrEqualFunc);
registerConditionResolver('greater', greaterFunc);
registerConditionResolver('is_empty', isEmptyFunc);
registerConditionResolver('is_not_empty', isNotEmptyFunc);
registerConditionResolver('less_or_equal', lessOrEqualFunc);
registerConditionResolver('less', lessFunc);
registerConditionResolver('like', likeFunc);
registerConditionResolver('not_between', notBetweenFunc);
registerConditionResolver('not_equal', notEqualFunc);
registerConditionResolver('not_like', notLikeFunc);
registerConditionResolver('select_any_in', selectAnyInFunc);
registerConditionResolver('select_not_any_in', selectNotAnyInFunc);
registerConditionResolver('starts_with', startsWithFunc);
