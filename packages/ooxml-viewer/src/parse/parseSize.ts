/**
 * 单位相关的解析，参考了 docxjs 里的实现
 */

export type LengthType = 'px' | 'pt' | '%' | '';

export type LengthUsageType = {mul: number; unit: LengthType};

/**
 * 单位转成 px，这样才能和 svg 里的一致
 */
const ptToPx = 1.3333;

export const LengthUsage: Record<string, LengthUsageType> = {
  Dxa: {mul: ptToPx * 0.05, unit: 'px'}, //twips
  Emu: {mul: (ptToPx * 1) / 12700, unit: 'px'},
  FontSize: {mul: ptToPx * 0.5, unit: 'px'},
  Border: {mul: ptToPx * 0.125, unit: 'px'},
  Point: {mul: ptToPx * 1, unit: 'px'},
  Percent: {mul: 0.02, unit: '%'},
  LineHeight: {mul: 1 / 240, unit: ''},
  VmlEmu: {mul: 1 / 12700, unit: ''}
};

export function convertLength(
  val: string,
  usage: LengthUsageType = LengthUsage.Dxa
): string {
  if (val == null || /.+(p[xt]|[%])$/.test(val)) {
    return val;
  }
  return `${(parseInt(val) * usage.mul).toFixed(2)}${usage.unit}`;
}

/**
 * 转换布尔值
 */
export function convertBoolean(v: string, defaultValue = false): boolean {
  switch (v) {
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

export function convertPercentage(val: string | null): number {
  return val ? parseInt(val) / 100 : 0;
}

export function convertAngle(val: string | null): number {
  return val ? parseInt(val) / 60000 : 0;
}

/**
 * 解析尺寸，返回 css 值
 *
 * @param element 节点
 * @param attrName 属性名
 * @param usage 类型
 */
export function parseSize(
  element: Element,
  attrName: string,
  usage: LengthUsageType = LengthUsage.Dxa
) {
  const size = element.getAttribute(attrName);
  if (size) {
    return convertLength(String(size), usage);
  }
  return '';
}

/**
 * 参考 docxjs 的方法，后面可以优化一下，不使用 calc
 */
export function addSize(a: string, b: string): string {
  if (a == null) return b;
  if (b == null) return a;
  return `calc(${a} + ${b})`;
}
