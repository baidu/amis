/**
 * 处理样式相关的工具方法，不放 helper 里是为了避免循环依赖
 */

import {resolveVariableAndFilter} from './tpl-builtin';
import mapValues from 'lodash/mapValues';
import camelCase from 'lodash/camelCase';
import {valueMap} from './style-helper';

function autoAddImageURL(image: string) {
  // 只支持单个的情况，并简单滤掉 linear-gradient 等情况
  if (
    typeof image === 'string' &&
    image.indexOf(',') === -1 &&
    image.indexOf('(') === -1
  ) {
    return `url("${image}")`;
  }
  return image;
}

/**
 * 处理配置中的 style，主要做三件事：
 * 1. 变量解析
 * 2. 将 font-size 之类的错误写法转成 fontSize
 * 3. 针对 image 自动加 url
 */
export function buildStyle(style: any, data: any) {
  if (!style) {
    return style;
  }
  let styleVar =
    typeof style === 'string'
      ? resolveVariableAndFilter(style, data, '| raw') || {}
      : mapValues(style, s => resolveVariableAndFilter(s, data, '| raw') || s);

  Object.keys(styleVar).forEach((key: string) => {
    if (key === 'radius') {
      styleVar['borderRadius'] =
        styleVar.radius['top-left-border-radius'] +
        ' ' +
        styleVar.radius['top-right-border-radius'] +
        ' ' +
        styleVar.radius['bottom-right-border-radius'] +
        ' ' +
        styleVar.radius['bottom-left-border-radius'];
      delete styleVar['radius'];
    }
    // 将属性短横线命名转换为驼峰命名，如background-color => backgroundColor。但不处理css variable，如--colors-brand-5
    if (key.indexOf('-') > 0) {
      styleVar[camelCase(valueMap[key] || key)] = styleVar[key];
      delete styleVar[key];
    }
  });

  if (styleVar.backgroundImage) {
    styleVar.backgroundImage = autoAddImageURL(styleVar.backgroundImage);
  }

  if (styleVar.borderImage) {
    styleVar.borderImage = autoAddImageURL(styleVar.borderImage);
  }

  if (styleVar.listStyleImage) {
    styleVar.listStyleImage = autoAddImageURL(styleVar.listStyleImage);
  }

  return styleVar;
}

/**
 * 将 style 转换为对象
 * @param style
 * @returns
 */
export function normalizeStyle(style: any) {
  if (!style) {
    return {};
  } else if (typeof style === 'string') {
    return style.split(';').reduce((acc, item) => {
      const [key, value] = item.split(':').map(item => item.trim());
      if (key && value) {
        acc[camelCase(key)] = value;
      }
      return acc;
    }, {} as any);
  } else {
    return style;
  }
}

/**
 * 合并 style
 * @param to
 * @param from
 * @returns
 */
export function mergeStyle(to: any, from: any) {
  if (!to && !from) {
    return {};
  }

  if (!to) {
    return from;
  }

  if (!from) {
    return to;
  }

  return Object.assign({}, normalizeStyle(to), normalizeStyle(from));
}
