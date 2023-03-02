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
      default:
        return defaultValue;
    }
  }
  return defaultValue;
}
