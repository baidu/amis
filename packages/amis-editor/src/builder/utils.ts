/**
 * @file utils
 * @desc builder用到的 utils
 */

import isObjectLike from 'lodash/isObjectLike';
import {DSFeature} from './constants';
import type {DSFeatureType} from './type';

export const getFeatValueByKey = (feat: DSFeatureType) => {
  return `${DSFeature?.[feat]?.value}`;
};

export const getFeatLabelByKey = (feat: DSFeatureType) => {
  return `${DSFeature?.[feat]?.label}`;
};

const _traverseSchemaDeep = (
  schema: Record<string, any>,
  mapper: (originKey: string, originValue: any, origin: any) => any[],
  cache = new WeakMap()
) => {
  const target: Record<string, any> = {};

  if (cache.has(schema)) {
    return cache.get(schema);
  }

  cache.set(schema, target);

  const mapArray = (arr: any[]): any =>
    arr.map((item: any) => {
      return isObjectLike(item)
        ? _traverseSchemaDeep(item, mapper, cache)
        : item;
    });

  if (Array.isArray(schema)) {
    return mapArray(schema);
  }

  for (const [key, value] of Object.entries(schema)) {
    const result = mapper(key, value, schema);

    let [updatedKey, updatedValue] = result;

    if (updatedKey === '__proto__') {
      continue;
    }

    if (isObjectLike(updatedValue)) {
      updatedValue = Array.isArray(updatedValue)
        ? mapArray(updatedValue)
        : _traverseSchemaDeep(updatedValue, mapper, cache);
    }

    target[updatedKey] = updatedValue;
  }

  return target;
};

export const traverseSchemaDeep = (
  schema: Record<string, any>,
  mapper: (originKey: string, originValue: any, origin: any) => any[]
) => {
  if (!isObjectLike(schema)) {
    return schema;
  }

  if (Array.isArray(schema)) {
    return schema;
  }

  return _traverseSchemaDeep(schema, mapper);
};

/** CRUD列类型转 Form 表单类型 */
export const displayType2inputType = (inputType: string): string => {
  if (!inputType || typeof inputType !== 'string') {
    return inputType;
  }

  const map: Record<string, string> = {
    tpl: 'input-text',
    image: 'input-image',
    date: 'input-date',
    progress: 'input-number',
    status: 'tag',
    mapping: 'tag',
    list: 'input-table'
  };

  return map.hasOwnProperty(inputType) ? map[inputType] : inputType;
};
