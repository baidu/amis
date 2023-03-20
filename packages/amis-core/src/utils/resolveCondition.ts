import get from 'lodash/get';
import endsWith from 'lodash/endsWith';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import startsWith from 'lodash/startsWith';
import {resolveVariableAndFilterForAsync} from './resolveVariableAndFilterForAsync';

const opFuncs: {[op: string]: Function} = {};

export async function resolveCondition(conditions: any, data: any) {
  if (
    !conditions ||
    !conditions.conjunction ||
    !Array.isArray(conditions.children) ||
    !conditions.children.length
  ) {
    return Promise.resolve();
  }

  const expression = await computeConditions(
    conditions.children,
    conditions.conjunction,
    data
  );

  return eval(expression.join(' '));
}

async function computeConditions(
  conditions: any[],
  conjunction: 'or' | 'and' = 'and',
  data: any
): Promise<any[]> {
  const CONJUNCTION_MAP = {
    and: '&&',
    or: '||'
  };

  return await conditions.reduce(async (prev, item, index) => {
    const prevResult = await prev;
    if (
      item.conjunction &&
      Array.isArray(item.children) &&
      item.children.length
    ) {
      const result = await computeConditions(
        item.children,
        item.conjunction,
        data
      );

      return prevResult.concat('(', result, ')');
    } else {
      // get result
      const result = await computeCondition(item, index, data);

      if (prevResult[prevResult.length - 1] === ')') {
        // operator
        prev = prevResult.concat(CONJUNCTION_MAP[conjunction], result);
      } else {
        prev = prevResult.concat(result);
      }

      // operator
      if (index < conditions.length - 1) {
        prev = prev.concat(CONJUNCTION_MAP[conjunction]);
      }

      return prev;
    }
  }, []);
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

  const func = opFuncs[rule.op];

  return func ? func(leftValue, rightValue) : false;
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

export function registerOpFunc(op: string, func: Function) {
  opFuncs[op] = func;
}

export function getPlugins() {
  return opFuncs;
}

registerOpFunc('between', betweenFunc);
registerOpFunc('ends_with', endsWithFunc);
registerOpFunc('equal', equalFunc);
registerOpFunc('greater_or_equal', greaterOrEqualFunc);
registerOpFunc('greater', greaterFunc);
registerOpFunc('is_empty', isEmptyFunc);
registerOpFunc('is_not_empty', isNotEmptyFunc);
registerOpFunc('less_or_equal', lessOrEqualFunc);
registerOpFunc('less', lessFunc);
registerOpFunc('like', likeFunc);
registerOpFunc('not_between', notBetweenFunc);
registerOpFunc('not_equal', notEqualFunc);
registerOpFunc('not_like', notLikeFunc);
registerOpFunc('select_any_in', selectAnyInFunc);
registerOpFunc('select_not_any_in', selectNotAnyInFunc);
registerOpFunc('starts_with', startsWithFunc);
