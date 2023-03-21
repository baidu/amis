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
  for (let index = 0, len = conditions.length; index < len; index++) {
    const item = conditions[index];
    const result =
      item.conjunction && Array.isArray(item.children) && item.children.length
        ? await computeConditions(item.children, item.conjunction, data)
        : await computeCondition(item, index, data);

    computeResult = !!result;

    if (
      (result && conjunction === 'or') ||
      (!result && conjunction === 'and')
    ) {
      break;
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
  if (left === undefined || right === undefined) {
    return false;
  }
  return startsWith(left, right);
}

function endsWithFunc(left: any, right: any) {
  if (left === undefined || right === undefined) {
    return false;
  }
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
  if (left === undefined || right === undefined) {
    return false;
  }
  return parseFloat(left as any) > parseFloat(right as any);
}

function greaterOrEqualFunc(left: any, right: any) {
  if (left === undefined || right === undefined) {
    return false;
  }
  return parseFloat(left as any) >= parseFloat(right as any);
}

function lessFunc(left: any, right: any) {
  if (left === undefined || right === undefined) {
    return false;
  }
  return parseFloat(left as any) < parseFloat(right as any);
}

function lessOrEqualFunc(left: any, right: any) {
  if (left === undefined || right === undefined) {
    return false;
  }
  return parseFloat(left as any) <= parseFloat(right as any);
}

function likeFunc(left: any, right: any) {
  if (left === undefined || right === undefined) {
    return false;
  }
  return !!~left.indexOf(right);
}

function notLikeFunc(left: any, right: any) {
  if (left === undefined || right === undefined) {
    return false;
  }
  return !~left.indexOf(right);
}

function betweenFunc(left: any, right: any) {
  if (typeof left === 'number' && right !== undefined) {
    const [min, max] = right.sort();
    return left >= parseFloat(min) && left <= parseFloat(max);
  }
  return false;
}

function notBetweenFunc(left: any, right: any) {
  if (typeof left === 'number' && right !== undefined) {
    const [min, max] = right.sort();
    return left < parseFloat(min) && left > parseFloat(max);
  }
  return false;
}

function selectAnyInFunc(left: any, right: any) {
  if (!Array.isArray(right)) {
    return false;
  }

  if (Array.isArray(left)) {
    return right.every((item: any) => left.includes(item));
  }
  return right.includes(left);
}

function selectNotAnyInFunc(left: any, right: any) {
  if (!Array.isArray(right)) {
    return false;
  }

  if (Array.isArray(left)) {
    return !right.every((item: any) => left.includes(item));
  }
  return !right.includes(left);
}

export function registerConditionComputer(
  op: string,
  func: (left: any, right: any, fieldType?: string) => boolean,
  fieldType?: string
) {
  conditionResolverMap[`${op}${fieldType ? 'For' + fieldType : ''}`] = func;
}

export function getConditionComputers() {
  return conditionResolverMap;
}

registerConditionComputer('between', betweenFunc);
registerConditionComputer('ends_with', endsWithFunc);
registerConditionComputer('equal', equalFunc);
registerConditionComputer('greater_or_equal', greaterOrEqualFunc);
registerConditionComputer('greater', greaterFunc);
registerConditionComputer('is_empty', isEmptyFunc);
registerConditionComputer('is_not_empty', isNotEmptyFunc);
registerConditionComputer('less_or_equal', lessOrEqualFunc);
registerConditionComputer('less', lessFunc);
registerConditionComputer('like', likeFunc);
registerConditionComputer('not_between', notBetweenFunc);
registerConditionComputer('not_equal', notEqualFunc);
registerConditionComputer('not_like', notLikeFunc);
registerConditionComputer('select_any_in', selectAnyInFunc);
registerConditionComputer('select_not_any_in', selectNotAnyInFunc);
registerConditionComputer('starts_with', startsWithFunc);
