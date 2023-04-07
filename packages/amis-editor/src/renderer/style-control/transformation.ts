/**
 * @file transformation.ts
 * @description CSS样式解析和编译
 */

import isNumber from 'lodash/isNumber';
import compact from 'lodash/compact';

import type {PlainObject, LengthUnit} from './types';

export interface LengthObj {
  length?: number;
  unit: LengthUnit;
}

export function parseBoxShadow(inputStr: string) {
  // const VALUES_REG = /,(?![^\(]*\))/;
  const PARTS_REG = /\s(?![^(]*\))/;
  const LENGTH_REG = /^[0-9]+[a-zA-Z%]+?$/;

  const isLength = (v: string) => v === '0' || LENGTH_REG.test(v);
  const toNum = (v: string) => {
    if (!v.endsWith('px') && v !== '0') {
      return v;
    }
    const n = parseFloat(v);
    return !isNaN(n) ? n : v;
  };

  const parseValue = (str: string) => {
    const parts = str.split(PARTS_REG);
    const inset = parts.includes('inset');
    const last = parts.slice(-1)[0];
    const color = !isLength(last) ? last : undefined;

    const nums = parts
      .filter(n => n !== 'inset')
      .filter(n => n !== color)
      .map(toNum);
    const [x, y, blur, spread] = nums;

    return {
      inset,
      x,
      y,
      blur,
      spread,
      color
    };
  };

  return parseValue(inputStr);
}

export function normalizeBoxShadow(config: {
  x: LengthObj;
  y: LengthObj;
  blur: LengthObj;
  spread: LengthObj;
  color: string;
  inset: boolean;
}) {
  const {x, y, blur, spread, color, inset} = config;
  const boxShadow = [];

  if (config?.inset) {
    boxShadow.push('inset');
  }

  if (x || y || spread || blur) {
    const normalizeUnit = (props: LengthObj) =>
      isNumber(props?.length) && props.length > 0
        ? Math.round(props?.length) + props?.unit
        : undefined;

    // x偏移量 | y偏移量 | 阴影模糊半径 | 阴影扩散半径
    boxShadow.push(
      compact([
        normalizeUnit(x),
        normalizeUnit(y),
        normalizeUnit(blur),
        normalizeUnit(spread)
      ]).join(' ')
    );
  }

  if (color) {
    boxShadow.push(color);
  }

  return boxShadow.length
    ? {boxShadow: boxShadow.join(' ')}
    : {boxShadow: undefined};
}
