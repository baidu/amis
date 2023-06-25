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
 * 更新组件上下文中label为带层级说明
 * @param variables 变量列表
 * @returns
 */
export const updateComponentContext = (variables: any[]) => {
  const items = [...variables];
  const idx = items.findIndex(item => item.label === '组件上下文');
  if (~idx) {
    items.splice(idx, 1, {
      ...items[idx],
      children: items[idx].children.map((child: any, index: number) => ({
        ...child,
        label:
          index === 0
            ? `当前数据域${child.label ? '(' + child.label + ')' : ''}`
            : `上${index}层${child.label ? '(' + child.label + ')' : ''}`
      }))
    });
  }
  return items;
};
