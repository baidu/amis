/**
 * OpenXML 数据类型定义，针对 fast-xml-parser 的解析结果
 * 主要目的是避免到处都是 any 容易漏检查类型
 */

/**
 * 获取 w:val 的值
 */
export function getVal(element: Element) {
  return element.getAttribute('w:val') || '';
}

export function getValNumber(element: Element) {
  return parseInt(getVal(element), 10);
}

/**
 * 有可能是 on 或 off 之类的值，都归一化为 boolean
 * @param value
 * @param defaultValue 默认值
 * @returns
 */

export function normalizeBoolean(
  value: string | boolean,
  defaultValue: boolean = false
): boolean {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'string') {
    switch (value) {
      case '1':
        return true;
      case '0':
        return false;
      case 'on':
        return true;
      case 'off':
        return false;
      case 'true':
        return true;
      case 'false':
        return false;
    }
    if (typeof value === 'number') {
      return value !== 0;
    }
  }
  return defaultValue;
}

export function getValBoolean(element: Element, defaultValue: boolean = true) {
  return normalizeBoolean(getVal(element), defaultValue);
}
