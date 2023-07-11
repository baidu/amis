import {resolveVariableAndFilter} from 'amis';
import isString from 'lodash/isString';

/**
 * 布局配置项，数值设置时需要
 */
export const isAuto = (value: any) => {
  if (value && isString(value) && /^((a)|(au)|(aut)|(auto))$/.test(value)) {
    return true;
  }
  return false;
};

/**
 * 用于列表类展示组件在 filterProps 中获取编辑态 value 值
 */
export const resolveArrayDatasource = (
  {
    data,
    value,
    source
  }: {
    value?: any;
    data: any;
    source: string;
  },
  defaultSource: string = '$items'
) =>
  Array.isArray(value)
    ? value
    : // resolveVariable 不支持 ${items} 格式，导致预览态无数据
      resolveVariableAndFilter(
        typeof source === 'string' ? source : defaultSource,
        data,
        '| raw'
      );

export const schemaToArray = (value: any) => {
  return value && Array.isArray(value) ? value : [value];
};

export const schemaArrayFormat = (value: any) => {
  return value && Array.isArray(value) && value.length === 1 ? value[0] : value;
};

/**
 * 解析选项值类型
 * @param options
 * @returns
 */
export const resolveOptionType = (options: any) => {
  // 默认options内选项是同类型
  const value =
    typeof options?.[0] === 'object' ? options?.[0]?.value : options?.[0];
  return options ? (value !== undefined ? typeof value : 'string') : 'string';
};
