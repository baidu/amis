import {JSONValueMap, findTree, resolveVariableAndFilter} from 'amis';
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
  if (!options) {
    return 'string';
  }

  // 默认options内选项是同类型
  let option = options[0];

  if (typeof option === 'object') {
    option = findTree(options, item => item.value !== undefined);
  }

  const value = option?.value ?? option;

  return value !== undefined ? typeof value : 'string';
};

/**
 * 将组件配置里面的公式进行转义，一般是文本组件编辑器里直接显示公式所用
 *
 * @param conf 组件schema 配置
 * @param keys 转义的字段key列表
 * @returns 转义后的配置
 */
export function escapeFormula(conf: any, keys: string[] = ['tpl']) {
  return JSONValueMap(conf, (value: any, key: string | number) => {
    if (keys.includes(String(key)) && /(^|[^\\])\$\{.+\}/.test(value)) {
      return value.replace(/\${/g, ' \\${');
    }
    return value;
  });
}

/**
 * 判断给定的 schema 是否为 model 组件
 *
 * @param schema schema 对象
 * @returns 如果给定的 schema 是 model 组件则返回 true，否则返回 false
 */
export function _isModelComp(schema: Record<string, any>): boolean {
  if (!schema) {
    return false;
  }

  if (
    schema.hasOwnProperty('$$m') &&
    (schema.$$m?.type === 'list' || schema.$$m?.type === 'form')
  ) {
    return true;
  }

  const extraEvaluation = ['source', 'api', 'initApi'].some(key => {
    if (schema?.[key] && typeof schema[key] === 'string') {
      return schema?.[key].startsWith('model://');
    }

    if (schema?.[key]?.url && typeof schema[key].url === 'string') {
      return (
        schema[key].url.startsWith('model://') &&
        !schema[key].hasOwnProperty('strategy')
      );
    }

    return false;
  });

  return extraEvaluation;
}
