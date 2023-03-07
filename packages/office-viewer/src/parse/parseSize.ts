/**
 * 单位相关的解析，参考了 docxjs 里的实现
 */

import {WAttr, XMLData, XMLKeys} from '../OpenXML';

export type LengthType = 'px' | 'pt' | '%' | '';

export type LengthUsageType = {mul: number; unit: LengthType};

export const LengthUsage: Record<string, LengthUsageType> = {
  Dxa: {mul: 0.05, unit: 'pt'}, //twips
  Emu: {mul: 1 / 12700, unit: 'pt'},
  FontSize: {mul: 0.5, unit: 'pt'},
  Border: {mul: 0.125, unit: 'pt'},
  Point: {mul: 1, unit: 'pt'},
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

export function convertPercentage(val: string): number {
  return val ? parseInt(val) / 100 : 0;
}

export function parseSize(
  data: XMLData,
  attrName: XMLKeys = WAttr.sz,
  usage: LengthUsageType = LengthUsage.Dxa
) {
  const size = String(data[attrName]);
  if (size) {
    return convertLength(size, usage);
  }
  return '';
}
