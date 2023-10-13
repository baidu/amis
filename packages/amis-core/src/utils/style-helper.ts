import {PlainObject} from '../types';
import {uuid} from './helper';
import cloneDeep from 'lodash/cloneDeep';
import isObject from 'lodash/isObject';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import kebabCase from 'lodash/kebabCase';

export const valueMap: PlainObject = {
  'marginTop': 'margin-top',
  'marginRight': 'margin-right',
  'marginBottom': 'margin-bottom',
  'marginLeft': 'margin-left',
  'paddingTop': 'padding-top',
  'paddingRight': 'padding-right',
  'paddingBottom': 'padding-bottom',
  'paddingLeft': 'padding-left',
  'top-border-width': 'border-top-width',
  'right-border-width': 'border-right-width',
  'bottom-border-width': 'border-bottom-width',
  'left-border-width': 'border-left-width',
  'top-border-style': 'border-top-style',
  'right-border-style': 'border-right-style',
  'bottom-border-style': 'border-bottom-style',
  'left-border-style': 'border-left-style',
  'top-border-color': 'border-top-color',
  'right-border-color': 'border-right-color',
  'bottom-border-color': 'border-bottom-color',
  'left-border-color': 'border-left-color',
  'fontSize': 'font-size',
  'fontWeight': 'font-weight',
  'lineHeight': 'line-height'
};

export const inheritValueMap: PlainObject = {
  background: 'bg-color',
  radius: 'border'
};

interface extra {
  important?: boolean;
  inner?: string;
  pre?: string;
  suf?: string;
}

export function findOrCreateStyle(id: string, doc?: Document) {
  doc = doc || document;
  let varStyleTag = doc.getElementById(id);
  if (!varStyleTag) {
    varStyleTag = doc.createElement('style');
    varStyleTag.id = id;
    doc.body.appendChild(varStyleTag);
  }
  return varStyleTag;
}

export function insertStyle(style: string, id: string, doc?: Document) {
  const varStyleTag = findOrCreateStyle(id, doc);

  // bca-disable-line
  varStyleTag.innerHTML = style;

  if (!style) {
    varStyleTag.remove();
  }
}

export function addStyle(style: string, id: string) {
  const varStyleTag = findOrCreateStyle(id);
  // bca-disable-line
  varStyleTag.innerHTML += style;
}

// 继承数据处理
function handleInheritData(statusMap: any, data: any) {
  if (!data) {
    return;
  }
  // 检查是否存在inherit
  ['hover', 'active'].forEach(status => {
    Object.keys(statusMap[status]).forEach(key => {
      if (typeof statusMap[status][key] === 'object') {
        Object.keys(statusMap[status][key]).forEach(style => {
          if (statusMap[status][key][style] === 'inherit') {
            // 值为inherit时设置为default的值或者主题中的default值
            if (statusMap['default'][key] && statusMap['default'][key][style]) {
              statusMap[status][key][style] = statusMap.default[key][style];
            } else {
              const value = inheritValueMap[key] || key;
              statusMap[status][key][style] =
                data['default'].body[value][style];
            }
          }
        });
      } else {
        if (statusMap[status][key] === 'inherit') {
          if (statusMap['default'][key] && statusMap['default'][key]) {
            statusMap[status][key] = statusMap.default[key];
          } else {
            const value = inheritValueMap[key] || key;
            statusMap[status][key] = data['default'].body[value];
          }
        }
      }
    });
  });
}

export function formatStyle(
  themeCss: any,
  classNames?: CustomStyleClassName[],
  id?: string,
  defaultData?: any
) {
  // 没有具体的样式，或者没有对应的classname
  if (!themeCss || !classNames) {
    return {value: '', origin: []};
  }
  const res: {className: string; content: string}[] = [];
  const status2string: PlainObject = {
    default: '',
    hover: ':hover',
    active: ':hover:active',
    disabled: '.is-disabled'
  };

  for (let item of classNames) {
    const body = themeCss[item.key];

    if (!body) {
      continue;
    }

    const className = item.key + '-' + id?.replace('u:', '');
    const weightsList: PlainObject = item.weights || {};

    const statusMap: PlainObject = {
      default: {},
      hover: {},
      active: {},
      disabled: {}
    };
    Object.keys(body).forEach(key => {
      if (key !== '$$id' && body[key]) {
        if (!!~key.indexOf(':default')) {
          statusMap.default[key.replace(':default', '')] = body[key];
        } else if (!!~key.indexOf(':hover')) {
          statusMap.hover[key.replace(':hover', '')] = body[key];
        } else if (!!~key.indexOf(':active')) {
          statusMap.active[key.replace(':active', '')] = body[key];
        } else if (!!~key.indexOf(':disabled')) {
          statusMap.disabled[key.replace(':disabled', '')] = body[key];
        } else {
          statusMap.default[key] = body[key];
        }
      }
    });
    handleInheritData(statusMap, defaultData);

    Object.keys(statusMap).forEach(status => {
      const weights = weightsList[status];
      const styles: string[] = [];
      const fn = (key: string, value: string) => {
        key = valueMap[key] || key;
        styles.push(`${kebabCase(key)}: ${value};`);
      };
      Object.keys(statusMap[status]).forEach(key => {
        if (key !== '$$id') {
          const style = statusMap[status][key];
          if (typeof style === 'object') {
            // 圆角特殊处理
            if (key === 'radius') {
              fn(
                'border-radius',
                [
                  style['top-left-border-radius'] || 0,
                  style['top-right-border-radius'] || 0,
                  style['bottom-right-border-radius'] || 0,
                  style['bottom-left-border-radius'] || 0
                ].join(' ')
              );
            } else {
              Object.keys(style).forEach(k => {
                if (k !== '$$id') {
                  const value = style[k];
                  value && fn(k, value);
                }
              });
            }
          } else {
            const value = style;
            if (key === 'iconSize') {
              fn('width', value + (weights?.important ? ' !important' : ''));
              fn('height', value + (weights?.important ? ' !important' : ''));
              fn(
                'font-size',
                value + (weights?.important ? ' !important' : '')
              );
            } else {
              value &&
                fn(key, value + (weights?.important ? ' !important' : ''));
            }
          }
        }
      });
      if (styles.length > 0) {
        const cx = (weights?.pre || '') + className + (weights?.suf || '');
        const inner = weights?.inner || '';
        res.push({
          className: cx + status2string[status] + inner,
          content: `.${cx + status2string[status]} ${inner}{\n  ${styles.join(
            '\n  '
          )}\n}`
        });
        // TODO:切换状态暂时先不改变组件的样式
        // if (['hover', 'active', 'disabled'].includes(status)) {
        //   res.push({
        //     className: cx + '.' + status,
        //     content: `.${cx}.${status} {\n  ${styles.join('\n  ')}\n}`
        //   });
        // }
      }
    });
  }
  return {
    value: res.map(n => n.content).join('\n'),
    origin: res
  };
}

export interface CustomStyleClassName {
  key: string;
  weights?: {
    default?: extra;
    hover?: extra;
    active?: extra;
    disabled?: extra;
  };
}

export function insertCustomStyle(
  themeCss: any,
  classNames: CustomStyleClassName[],
  id: string,
  defaultData?: any,
  customStyleClassPrefix?: string,
  doc?: Document
) {
  if (!themeCss) {
    return;
  }

  let {value} = formatStyle(themeCss, classNames, id, defaultData);
  if (value) {
    value = customStyleClassPrefix
      ? `${customStyleClassPrefix} ${value}`
      : value;
    insertStyle(value, id.replace('u:', ''), doc);
  }
}

/**
 * 根据路径获取默认值
 */
export function getValueByPath(path: string, data: any) {
  try {
    if (!path || !data) {
      return null;
    }
    const keys = path.split('.');
    let value = cloneDeep(data.component);
    for (let i = 0; i < keys.length; i++) {
      value = value[keys[i]];
    }
    return value;
  } catch (e) {
    return null;
  }
}

// 递归处理嵌套的样式，转化成一维对象
function traverseStyle(style: any, path: string, result: any) {
  Object.keys(style).forEach(key => {
    if (key !== '$$id') {
      if (isObject(style[key])) {
        const nowPath = path ? `${path} ${key}` : key;
        traverseStyle(style[key], nowPath, result);
      } else if (path === '') {
        !result[key] && (result[key] = {});
        result[key] = style[key];
      } else {
        !result[path] && (result[path] = {});
        result[path][key] = style[key];
      }
    }
  });
}

/**
 * 设置源码编辑自定义样式
 */
export function insertEditCustomStyle(
  customStyle: any,
  id?: string,
  doc?: Document
) {
  let styles: any = {};
  traverseStyle(customStyle, '', styles);

  let content = '';
  if (!isEmpty(styles)) {
    const className = `wrapperCustomStyle-${id?.replace('u:', '')}`;
    Object.keys(styles).forEach((key: string) => {
      if (!isObject(styles[key])) {
        content += `\n.${className} {\n  ${key}: ${styles[key]}\n}`;
      } else if (key === 'root') {
        const res = map(styles[key], (value, key) => `${key}: ${value};`);
        content += `\n.${className} {\n  ${res.join('\n  ')}\n}`;
      } else if (/^root:/.test(key)) {
        const res = map(styles[key], (value, key) => `${key}: ${value};`);
        const nowKey = key.replace('root', '');
        content += `\n.${className} ${nowKey} {\n  ${res.join('\n  ')}\n}`;
      } else {
        const res = map(styles[key], (value, key) => `${key}: ${value};`);
        content += `\n.${className} ${key} {\n  ${res.join('\n  ')}\n}`;
      }
    });
  }
  insertStyle(
    content,
    'wrapperCustomStyle-' + (id?.replace('u:', '') || uuid()),
    doc
  );
}

export interface InsertCustomStyle {
  themeCss: any;
  classNames: CustomStyleClassName[];
  id?: string;
  defaultData?: any;
  customStyleClassPrefix?: string;
  doc?: Document;
}

/**
 * 移除自定义样式
 */
export function removeCustomStyle(type: string, id: string, doc?: Document) {
  const style = (doc || document).getElementById(
    (type ? type + '-' : '') + id.replace('u:', '')
  );
  if (style) {
    style.remove();
  }
}

export function formatInputThemeCss(themeCss: any) {
  if (!themeCss) {
    return;
  }
  const inputFontThemeCss: any = {inputControlClassName: {}};
  const inputControlClassNameObject = themeCss?.inputControlClassName || {};
  Object.keys(inputControlClassNameObject).forEach((key: string) => {
    if (~key.indexOf('font')) {
      inputFontThemeCss.inputControlClassName[key] =
        inputControlClassNameObject[key];
    }
  });
  return inputFontThemeCss;
}

export function setThemeClassName(
  name: string,
  id?: string,
  themeCss?: any,
  extra?: string
) {
  if (!id || !themeCss) {
    return '';
  }

  if (name !== 'wrapperCustomStyle' && !themeCss[name]) {
    return '';
  }

  return `${name}-${id.replace('u:', '')}` + (extra ? `-${extra}` : '');
}
