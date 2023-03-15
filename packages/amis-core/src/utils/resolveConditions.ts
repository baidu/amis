import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import startsWith from 'lodash/startsWith';
import endsWith from 'lodash/endsWith';
import get from 'lodash/get';
import {resolveVariableAndFilterForAsync} from './resolveVariableAndFilterForAsync';

const CONJUNCTION_MAP = {
  and: '&&',
  or: '||'
};

const computeCondition = async (
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
) => {
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

  if (rule.op === 'equal' || rule.op === 'equals') {
    return isEqual(leftValue, rightValue);
  } else if (rule.op === 'not_equal') {
    return !isEqual(leftValue, rightValue);
  } else if (rule.op === 'greater') {
    return parseFloat(leftValue as any) > parseFloat(rightValue as any);
  } else if (rule.op === 'less') {
    return parseFloat(leftValue as any) < parseFloat(rightValue as any);
  } else if (rule.op === 'greater_or_equal') {
    return parseFloat(leftValue as any) >= parseFloat(rightValue as any);
  } else if (rule.op === 'less_or_equal') {
    return parseFloat(leftValue as any) <= parseFloat(rightValue as any);
  } else if (rule.op === 'starts_with') {
    return startsWith(leftValue, rightValue);
  } else if (rule.op === 'ends_with') {
    return endsWith(leftValue, rightValue);
  } else if (rule.op === 'like') {
    return !!~leftValue.indexOf(rightValue);
  } else if (rule.op === 'not_like') {
    return !~leftValue.indexOf(rightValue);
  } else if (rule.op === 'is_empty') {
    if (typeof leftValue === 'string') {
      return !leftValue;
    } else if (typeof leftValue === 'number') {
      return leftValue === undefined;
    } else if (Array.isArray(leftValue)) {
      return !leftValue.length;
    } else if (typeof leftValue === 'object') {
      return isEmpty(leftValue);
    }
  } else if (rule.op === 'is_not_empty') {
    if (typeof leftValue === 'string') {
      return !leftValue;
    } else if (typeof leftValue === 'number') {
      return leftValue !== undefined;
    } else if (Array.isArray(leftValue)) {
      return !!leftValue.length;
    } else if (typeof leftValue === 'object') {
      return !isEmpty(leftValue);
    }
  } else if (rule.op === 'between') {
    if (typeof leftValue === 'number') {
      const [min, max] = rightValue.sort();
      return leftValue >= parseFloat(min) && leftValue <= parseFloat(max);
    }
    return false;
  } else if (rule.op === 'not_between') {
    if (typeof leftValue === 'number') {
      const [min, max] = rightValue.sort();
      return leftValue < parseFloat(min) && leftValue > parseFloat(max);
    }
    return false;
  } else if (rule.op === 'select_any_in') {
    if (Array.isArray(leftValue)) {
      return rightValue.every((item: any) => leftValue.includes(item));
    }
    return rightValue.includes(leftValue);
  } else if (rule.op === 'select_not_any_in') {
    if (Array.isArray(leftValue)) {
      return !rightValue.every((item: any) => leftValue.includes(item));
    }
    return !rightValue.includes(leftValue);
  }
  return false;
};

async function computeConditions(
  conditions: any[],
  conjunction: 'or' | 'and' = 'and',
  data: any
): Promise<any[]> {
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

export async function resolveConditions(conditions: any, data: any) {
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

  return expression.join(' ');
}
