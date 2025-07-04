import {PlainObject} from '../types';
import {uuid} from './helper';
import cloneDeep from 'lodash/cloneDeep';
import isObject from 'lodash/isObject';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import kebabCase from 'lodash/kebabCase';
import {resolveVariableAndFilter} from './resolveVariableAndFilter';

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
  parent?: string;
  inner?: string;
  pre?: string;
  suf?: string;
}

/**
 * 查找或创建style标签
 * @param param
 * @param param.classId 根据classId查找或创建style标签
 * @param param.id 用于赋值给style的class
 * @param param.doc 文档对象，默认为document
 * @param param.before 插入到某个class为id的style标签之前
 */

export function findOrCreateStyle({
  classId,
  doc,
  before,
  id
}: {
  classId: string;
  doc?: Document;
  before?: string;
  id?: string;
}) {
  doc = doc || document;
  let varStyleTag = doc.getElementById(classId);
  if (!varStyleTag) {
    varStyleTag = doc.createElement('style');
    varStyleTag.id = classId;
    varStyleTag.setAttribute('class', id || '');
    const beforeStyleTag = doc.getElementsByClassName(
      before || ''
    )?.[0] as HTMLElement;
    // 如果存在before则插入到before之前，否则插入到body中
    if (beforeStyleTag) {
      beforeStyleTag.before(varStyleTag);
    } else {
      doc.body.appendChild(varStyleTag);
    }
  }

  return varStyleTag;
}

/*
 * 插入样式
 * @param param
 * @param param.style 样式内容
 * @param param.classId 样式标识，会绑定到id上
 * @param param.id id,会绑定到class上
 * @param param.doc 文档对象
 * @param param.before 插入到某个id之前
 */
export function insertStyle({
  style,
  classId,
  id,
  doc,
  before
}: {
  style: string;
  classId: string;
  id?: string;
  doc?: Document;
  before?: string;
}) {
  const varStyleTag = findOrCreateStyle({
    classId: 'amis-' + classId,
    doc,
    before,
    id
  });

  // bca-disable-line
  varStyleTag.innerHTML = style;

  if (!style) {
    varStyleTag.remove();
  }
}

export function addStyle(style: string, id: string) {
  const varStyleTag = findOrCreateStyle({classId: id});
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
  defaultData?: any,
  data?: any
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
    focused: '',
    disabled: ''
  };

  for (let item of classNames) {
    const body = themeCss[item.key];

    if (!body) {
      continue;
    }

    let className = item.key + '-' + id?.replace('u:', '');
    const weightsList: PlainObject = item.weights || {};

    if (typeof data?.index === 'number') {
      className += `-${data.index}`;
    }

    const statusMap: PlainObject = {
      default: {},
      hover: {},
      active: {},
      focused: {},
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
        } else if (!!~key.indexOf(':focused')) {
          statusMap.focused[key.replace(':focused', '')] = body[key];
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
        value = resolveVariableAndFilter(value, data, '| raw') || value;
        styles.push(
          `${key.startsWith('--') ? key : kebabCase(key)}: ${
            value + (weights?.important ? ' !important' : '')
          };`
        );
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
              fn('width', value);
              fn('height', value);
              fn('font-size', value);
            } else {
              value && fn(key, value);
            }
          }
        }
      });
      if (styles.length > 0) {
        const cx = (weights?.pre || '') + className + (weights?.suf || '');
        const inner = weights?.inner || '';
        const parent = weights?.parent || '';

        res.push({
          className: parent + cx + status2string[status] + inner,
          content: `${parent} .${
            cx + status2string[status]
          } ${inner}{\n  ${styles.join('\n  ')}\n}`
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
    focused?: extra;
    disabled?: extra;
  };
}

export function insertCustomStyle(params: {
  themeCss: any;
  classNames: CustomStyleClassName[];
  id: string;
  defaultData?: any;
  customStyleClassPrefix?: string;
  doc?: Document;
  [propName: string]: any;
}) {
  const {
    themeCss,
    classNames,
    id,
    defaultData,
    customStyleClassPrefix,
    doc,
    data
  } = params;
  if (!themeCss) {
    return;
  }

  let {value} = formatStyle(themeCss, classNames, id, defaultData, data);
  value = customStyleClassPrefix ? `${customStyleClassPrefix} ${value}` : value;
  let classId = id?.replace?.('u:', '') || id + '';
  if (typeof data?.index === 'number') {
    classId += `-${data.index}`;
  }
  // 这里需要插入到wrapperCustomStyle的前面
  insertStyle({
    style: value,
    classId,
    doc,
    id: classId.replace(/(-.*)/, ''),
    before: classId.replace(/(-.*)/, '')
  });
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
        const keys = key.split(',');
        const nowPath = path
          ? keys
              .map(key => {
                const paths = path.split(',');
                return paths.map(path => `${path} ${key}`).join(',');
              })
              .join(',')
          : key;
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

export function formatCustomStyle(params: {
  customStyle: any;
  id?: string;
  doc?: Document;
  customStyleClassPrefix?: string;
  [propName: string]: any;
}): {
  content: string;
  index?: string;
  id: string;
} {
  const {customStyle, doc, data, customStyleClassPrefix} = params;
  const id = params.id?.replace?.('u:', '') || params.id + '';
  let styles: any = {};
  traverseStyle(customStyle, '', styles);

  let content = '';
  let index = '';
  if (typeof data?.index === 'number') {
    index = `-${data.index}`;
  }
  if (!isEmpty(styles)) {
    let className = `.wrapperCustomStyle-${id}${index}`;
    if (customStyleClassPrefix) {
      className = `${customStyleClassPrefix} ${className}`;
    }
    Object.keys(styles).forEach((key: string) => {
      if (!isObject(styles[key])) {
        content += `\n${className} {\n  ${key}: ${
          resolveVariableAndFilter(
            styles[key].replace(/['|"]/g, ''),
            data,
            '| raw'
          ) || styles[key]
        }\n}`;
      } else if (key.startsWith('root')) {
        const res = map(
          styles[key],
          (value: any, key) =>
            `${key}: ${
              resolveVariableAndFilter(
                value.replace(/['|"]/g, ''),
                data,
                '| raw'
              ) || value
            };`
        );
        content += `\n${key.replace(/root/g, className)} {\n  ${res.join(
          '\n  '
        )}\n}`;
      } else {
        const res = map(
          styles[key],
          (value: any, key) =>
            `${key}: ${
              resolveVariableAndFilter(
                value.replace(/['|"]/g, ''),
                data,
                '| raw'
              ) || value
            };`
        );
        const keys = key.split(',');
        content += `\n${keys.map(key => `${className} ${key}`)} {\n  ${res.join(
          '\n  '
        )}\n}`;
      }
    });
  }
  return {
    content: content,
    index: index,
    id: id
  };
}

/**
 * 设置源码编辑自定义样式
 */
export function insertEditCustomStyle(params: {
  customStyle: any;
  id?: string;
  doc?: Document;
  customStyleClassPrefix?: string;
  [propName: string]: any;
}) {
  const {doc} = params;
  const {content, index, id} = formatCustomStyle(params);
  insertStyle({
    style: content,
    classId: 'wrapperCustomStyle-' + (id || uuid()) + index,
    doc,
    id: id.replace(/(-.*)/, '')
  });
  return content;
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
export function removeCustomStyle(
  type: string,
  id: string,
  doc?: Document,
  data?: any
) {
  let styleId =
    'amis-' + (type ? type + '-' : '') + (id.replace?.('u:', '') || id + '');
  if (typeof data?.index === 'number') {
    styleId += `-${data.index}`;
  }
  const style = (doc || document).getElementById(styleId);
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

export function setThemeClassName(params: {
  name: string | string[];
  id?: string;
  themeCss: any;
  extra?: string;
  [propName: string]: any;
}) {
  const {name, id, themeCss, extra, data} = params;
  if (!id || !themeCss) {
    return '';
  }

  let index = '';
  if (typeof data?.index === 'number') {
    index = `-${data.index}`;
  }

  function setClassName(name: string, id: string) {
    if (name !== 'wrapperCustomStyle' && !themeCss[name]) {
      return '';
    }
    return (
      `${name}-${id.replace?.('u:', '') || id}` +
      (extra ? `-${extra}` : '') +
      index
    );
  }

  if (typeof name === 'string') {
    return setClassName(name, id);
  } else {
    return name.map(n => setClassName(n, id)).join(' ');
  }
}
