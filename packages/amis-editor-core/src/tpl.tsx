import {SchemaObject} from 'amis/lib/Schema';

/**
 * @file amis schema 配置模板，主要很多地方都要全部配置的化，
 * 会有很多份，而且改起来很麻烦，复用率高的放在这管理。
 */
const tpls: {
  [propName: string]: any;
} = {};

export function getSchemaTpl(
  name: string,
  patch?: object,
  rendererSchema?: any
): any {
  const tpl = tpls[name] || {};
  let schema = null;

  if (typeof tpl === 'function') {
    schema = tpl(patch, rendererSchema);
  } else {
    schema = tpl
      ? patch
        ? {
            ...tpl,
            ...patch
          }
        : tpl
      : null;
  }

  return schema;
}

export function setSchemaTpl(name: string, value: any) {
  tpls[name] = value;
}

export function valuePipeOut(value: any) {
  try {
    if (value === 'undefined') {
      return undefined;
    }

    return JSON.parse(value);
  } catch (e) {
    return value;
  }
}

export function undefinedPipeOut(value: any) {
  if (Array.isArray(value)) {
    return value.length ? value : undefined;
  }

  if (typeof value === 'string') {
    return value ? value : undefined;
  }

  if (typeof value === 'object') {
    return Object.keys(value).length ? value : undefined;
  }
  return value;
}

export function defaultValue(defaultValue: any, strictMode: boolean = true) {
  return strictMode
    ? (value: any) => (typeof value === 'undefined' ? defaultValue : value)
    : (value: any) => value || defaultValue;
}

/**
 * 配置面板带提示信息的label
 */
export function tipedLabel(
  body: string | Array<SchemaObject>,
  tip: string,
  style?: React.CSSProperties
) {
  return {
    type: 'tooltip-wrapper',
    tooltip: tip,
    tooltipTheme: 'dark',
    placement: 'top',
    tooltipStyle: {
      fontSize: '12px',
      ...(style || {})
    },
    className: 'ae-formItemControl-label-tip',
    body
  };
}
