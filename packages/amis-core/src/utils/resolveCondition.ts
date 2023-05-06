import get from 'lodash/get';
import endsWith from 'lodash/endsWith';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import startsWith from 'lodash/startsWith';
import {resolveVariableAndFilterForAsync} from './resolveVariableAndFilterForAsync';
import moment from 'moment';
import capitalize from 'lodash/capitalize';

const conditionResolverMap: {
  [op: string]: (left: any, right: any, fieldType?: string) => boolean;
} = {};
const DEFAULT_RESULT = true;

let conditionComputeErrorHandler: (
  conditions: any,
  data: any,
  defaultResult: boolean
) => boolean | Promise<boolean>;

export async function resolveCondition(
  conditions: any,
  data: any,
  defaultResult: boolean = true
) {
  if (
    !conditions ||
    !conditions.conjunction ||
    !Array.isArray(conditions.children) ||
    !conditions.children.length
  ) {
    return defaultResult;
  }

  try {
    return await computeConditions(
      conditions.children,
      conditions.conjunction,
      data
    );
  } catch (e) {
    // 如果函数未定义，则交给handler
    if (e.name === 'FormulaEvalError') {
      return await conditionComputeErrorHandler?.(
        conditions.children,
        conditions.conjunction,
        data
      );
    }
    return defaultResult;
  }
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
    data,
    undefined,
    undefined,
    true
  );

  const func =
    conditionResolverMap[`${rule.op}For${capitalize(rule.left.type)}`] ??
    conditionResolverMap[rule.op];

  return func ? func(leftValue, rightValue, rule.left.type) : DEFAULT_RESULT;
}

function startsWithFunc(left: any, right: any) {
  if (left === undefined || right === undefined) {
    return DEFAULT_RESULT;
  }
  return startsWith(left, right);
}

function endsWithFunc(left: any, right: any) {
  if (left === undefined || right === undefined) {
    return DEFAULT_RESULT;
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
  return DEFAULT_RESULT;
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
  return DEFAULT_RESULT;
}

function greaterFunc(left: any, right: any) {
  if (left === undefined || right === undefined) {
    return DEFAULT_RESULT;
  }
  return parseFloat(left as any) > parseFloat(right as any);
}

function normalizeDate(raw: any): Date {
  if (typeof raw === 'string' || typeof raw === 'number') {
    let formats = ['', 'YYYY-MM-DD HH:mm:ss', 'X'];

    if (/^\d{10}((\.\d+)*)$/.test(raw.toString())) {
      formats = ['X', 'x', 'YYYY-MM-DD HH:mm:ss', ''];
    } else if (/^\d{13}((\.\d+)*)$/.test(raw.toString())) {
      formats = ['x', 'X', 'YYYY-MM-DD HH:mm:ss', ''];
    }
    while (formats.length) {
      const format = formats.shift()!;
      const date = moment(raw, format);

      if (date.isValid()) {
        return date.toDate();
      }
    }
  }

  return raw;
}

function normalizeDateRange(raw: string | Date[]): Date[] {
  return (Array.isArray(raw) ? raw : raw.split(',')).map((item: any) =>
    normalizeDate(String(item).trim())
  );
}

function greaterForDateFunc(left: any, right: any) {
  left = normalizeDate(left);
  right = normalizeDate(right);
  return moment(left).isAfter(moment(right), 's');
}

function greaterOrEqualForDateFunc(left: any, right: any) {
  left = normalizeDate(left);
  right = normalizeDate(right);
  return moment(left).isSameOrAfter(moment(right), 's');
}

function greaterOrEqualFunc(left: any, right: any) {
  if (left === undefined || right === undefined) {
    return DEFAULT_RESULT;
  }
  return parseFloat(left as any) >= parseFloat(right as any);
}

function lessFunc(left: any, right: any) {
  if (left === undefined || right === undefined) {
    return DEFAULT_RESULT;
  }
  return parseFloat(left as any) < parseFloat(right as any);
}

function lessForDateFunc(left: any, right: any) {
  left = normalizeDate(left);
  right = normalizeDate(right);
  return moment(left).isBefore(moment(right), 's');
}

function lessOrEqualForDateFunc(left: any, right: any) {
  left = normalizeDate(left);
  right = normalizeDate(right);
  return moment(left).isSameOrBefore(moment(right), 's');
}

function lessOrEqualFunc(left: any, right: any) {
  if (left === undefined || right === undefined) {
    return DEFAULT_RESULT;
  }
  return parseFloat(left as any) <= parseFloat(right as any);
}

function likeFunc(left: any, right: any) {
  if (left === undefined || right === undefined) {
    return DEFAULT_RESULT;
  }
  return !!~left.indexOf(right);
}

function notLikeFunc(left: any, right: any) {
  if (left === undefined || right === undefined) {
    return DEFAULT_RESULT;
  }
  return !~left.indexOf(right);
}

function betweenFunc(left: any, right: any) {
  if (typeof left === 'number' && right !== undefined) {
    const [min, max] = right.sort();
    return left >= parseFloat(min) && left <= parseFloat(max);
  }
  return DEFAULT_RESULT;
}

function betweenForDateFunc(left: any, right: any) {
  if (right !== undefined) {
    const [min, max] = normalizeDateRange(right);
    return moment(normalizeDate(left)).isBetween(min, max, 's', '[]');
  }
  return DEFAULT_RESULT;
}

function notBetweenFunc(left: any, right: any) {
  if (typeof left === 'number' && right !== undefined) {
    const [min, max] = right.sort();
    return left < parseFloat(min) && left > parseFloat(max);
  }
  return DEFAULT_RESULT;
}

function notBetweenForDateFunc(left: any, right: any) {
  if (right !== undefined) {
    const [min, max] = normalizeDateRange(right);
    return !moment(normalizeDate(left)).isBetween(min, max, 's', '[]');
  }
  return DEFAULT_RESULT;
}

function selectAnyInFunc(left: any, right: any) {
  if (!Array.isArray(right)) {
    return DEFAULT_RESULT;
  }

  if (Array.isArray(left)) {
    return right.every((item: any) => left.includes(item));
  }
  return right.includes(left);
}

function selectNotAnyInFunc(left: any, right: any) {
  if (!Array.isArray(right)) {
    return DEFAULT_RESULT;
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
  conditionResolverMap[
    `${op}${fieldType ? 'For' + capitalize(fieldType) : ''}`
  ] = func;
}

export function getConditionComputers() {
  return conditionResolverMap;
}

export function setConditionComputeErrorHandler(
  fn: (
    conditions: any,
    data: any,
    defaultResult: boolean
  ) => boolean | Promise<boolean>
) {
  conditionComputeErrorHandler = fn;
}

registerConditionComputer('greater', greaterFunc);
registerConditionComputer('greater', greaterForDateFunc, 'date');
registerConditionComputer('greater', greaterForDateFunc, 'time');
registerConditionComputer('greater', greaterForDateFunc, 'datetime');
registerConditionComputer('greater_or_equal', greaterOrEqualFunc);
registerConditionComputer(
  'greater_or_equal',
  greaterOrEqualForDateFunc,
  'date'
);
registerConditionComputer(
  'greater_or_equal',
  greaterOrEqualForDateFunc,
  'time'
);
registerConditionComputer(
  'greater_or_equal',
  greaterOrEqualForDateFunc,
  'datetime'
);
registerConditionComputer('less', lessFunc);
registerConditionComputer('less', lessForDateFunc, 'date');
registerConditionComputer('less', lessForDateFunc, 'time');
registerConditionComputer('less', lessForDateFunc, 'datetime');
registerConditionComputer('less_or_equal', lessOrEqualFunc);
registerConditionComputer('less_or_equal', lessOrEqualForDateFunc, 'date');
registerConditionComputer('less_or_equal', lessOrEqualForDateFunc, 'time');
registerConditionComputer('less_or_equal', lessOrEqualForDateFunc, 'datetime');
registerConditionComputer('is_empty', isEmptyFunc);
registerConditionComputer('is_not_empty', isNotEmptyFunc);
registerConditionComputer('between', betweenFunc);
registerConditionComputer('between', betweenForDateFunc, 'date');
registerConditionComputer('between', betweenForDateFunc, 'time');
registerConditionComputer('between', betweenForDateFunc, 'datetime');
registerConditionComputer('not_between', notBetweenFunc);
registerConditionComputer('not_between', notBetweenForDateFunc, 'date');
registerConditionComputer('not_between', notBetweenForDateFunc, 'time');
registerConditionComputer('not_between', notBetweenForDateFunc, 'datetime');
registerConditionComputer('equal', equalFunc);
registerConditionComputer('not_equal', notEqualFunc);
registerConditionComputer('like', likeFunc);
registerConditionComputer('not_like', notLikeFunc);
registerConditionComputer('select_any_in', selectAnyInFunc);
registerConditionComputer('select_not_any_in', selectNotAnyInFunc);
registerConditionComputer('starts_with', startsWithFunc);
registerConditionComputer('ends_with', endsWithFunc);
