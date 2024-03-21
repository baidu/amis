/**
 * 判断是否是简单对象
 * @param obj
 * @returns
 */

export function isObject(obj: any) {
  return typeof obj === 'object' && !Array.isArray(obj) && obj !== null;
}
