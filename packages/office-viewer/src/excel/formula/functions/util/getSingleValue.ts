import {EvalResult} from '../../eval/EvalResult';

/**
 * 获取数据，如果遇到数组会持续找到数组内的值
 */
export function getSingleValue(value: EvalResult): EvalResult {
  if (Array.isArray(value)) {
    return getSingleValue(value[0]);
  }
  return value;
}
