/**
 * openxml 一些辅助函数
 */

/**
 * 获取 w:val 的值
 */
export function getVal(element: Element) {
  return element.getAttribute('w:val') || '';
}

/**
 * 获取 w:val 的值，转成 number 类型
 */
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
  value: string | boolean | null,
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

export function getAttrBoolean(
  element: Element,
  attr: string,
  defaultValue: boolean = true
) {
  return normalizeBoolean(element.getAttribute(attr), defaultValue);
}

export function getValHex(element: Element) {
  return parseInt(getVal(element) || '0', 16);
}
