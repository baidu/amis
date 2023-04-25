/**
 * openxml 一些辅助函数
 */

/**
 * 获取 w:val 的值
 */
export function getVal(element: Element) {
  return (
    element.getAttribute('w:val') ||
    element.getAttribute('w14:val') ||
    element.getAttribute('val') ||
    ''
  );
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

/**
 * 获取属性值，转成数字
 *
 * @param attr 属性名
 * @param defaultValue 默认值
 * @returns 解析后的数字
 */
export function getAttrNumber(
  element: Element,
  attr: string,
  defaultValue: number = 0
) {
  const value = element.getAttribute(attr);
  if (value) {
    return parseInt(value, 10);
  } else {
    return defaultValue;
  }
}

/**
 * 获取百分比值，没测过
 * http://webapp.docx4java.org/OnlineDemo/ecma376/DrawingML/ST_Percentage.html
 * https://c-rex.net/projects/samples/ooxml/e1/Part4/OOXML_P4_DOCX_ST_Percentage_topic_ID0EY3XNB.html#topic_ID0EY3XNB
 *
 * @returns 0-1 之间的小数
 */
export function getAttrPercent(element: Element, attr: string) {
  const value = element.getAttribute(attr);

  if (value) {
    if (value.endsWith('%')) {
      return parseInt(value, 10) / 100;
    }
    const num = parseInt(value, 10);
    return num / 100000;
  }

  return 1;
}

/**
 * 获取属性的 hex 值
 */
export function getValHex(element: Element) {
  return parseInt(getVal(element) || '0', 16);
}
