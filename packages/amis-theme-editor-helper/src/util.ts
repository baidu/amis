import {PlainObject, filter} from 'amis-core';
import cloneDeep from 'lodash/cloneDeep';

const THEME_CSS_VAR = [
  '--colors',
  '--sizes',
  '--borders',
  '--fonts',
  '--shadows'
];

function getCssKey(key: string) {
  return key?.replace('var(', '').replace(')', '');
}

function isThemeCssVar(key: string) {
  // 是否以主题变量开头
  return THEME_CSS_VAR.some(item => getCssKey(key)?.startsWith(item));
}
/**
 * 根据路径获取默认值
 */
export function getDefaultValue(
  editorValue?: string | {[key: string]: string},
  data?: any
): any {
  if (editorValue) {
    if (typeof editorValue === 'string') {
      const key = filter(editorValue, data);
      const value = data.cssVars[key]?.replace(/\n/g, '').replace(/\s/g, '');
      if (!value) {
        if (key.startsWith('--')) {
          return undefined;
        }
        return key;
      } else if (isThemeCssVar(value)) {
        return value;
      } else {
        return getDefaultValue(getCssKey(value), data);
      }
    } else {
      const res: PlainObject = {};
      Object.keys(editorValue).forEach(k => {
        const key = filter(editorValue[k], data);
        const value = data.cssVars[key];
        if (!value) {
          if (key.startsWith('--')) {
            return;
          }
          res[k] = key;
        } else if (isThemeCssVar(value)) {
          res[k] = value;
        } else {
          res[k] = getDefaultValue(getCssKey(value), data);
        }
        return;
      });
      return res;
    }
  }
}

/**
 * 获取继承值
 */
export function getInheritValue(path: string | string[], data: any): any {
  try {
    if (!path || !data) {
      return null;
    }
    let res = {};
    const getValue = (p: string) => {
      const keys = p.split('.');
      let value = cloneDeep(data.themeConfig.component);
      let defaultToken = '';
      for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        const isVar = /\$\{(.*)\}/.exec(key) || [];
        if (isVar[1]) {
          key = data[isVar[1]] || 'default';
        }

        if (Array.isArray(value)) {
          value = value.find(n => n.type === key);
        } else {
          if (key === 'hover' || key === 'active' || key === 'disabled') {
            defaultToken = value['default'].token;
            value = value['default'];
          } else {
            value = value[key];
          }
        }

        if (!value) {
          break;
        }
      }
      if (defaultToken && value) {
        return value;
      }
      return null;
    };
    if (Array.isArray(path)) {
      path.forEach(p => {
        let value = getValue(p);
        if (typeof value === 'string') {
          value = {color: value};
        }
        res = Object.assign(res, value);
      });
    } else {
      res = getValue(path);
    }
    return res;
  } catch (e) {
    return null;
  }
}

// 处理传入的继承数据
export function formatInheritData(data: any) {
  if (typeof data === 'string' && data.indexOf('inherit:') > -1) {
    return 'inherit';
  }
  if (!data || typeof data !== 'object') {
    return data;
  }
  data = cloneDeep(data);
  for (let key in data) {
    if (typeof data[key] === 'string' && data[key].indexOf('inherit:') > -1) {
      data[key] = 'inherit';
    }
  }
  return data;
}

// 设置继承数据
export function setInheritData(value: any, editorInheritValue: any) {
  if (value && editorInheritValue) {
    if (typeof value === 'string') {
      if (value === 'inherit') {
        value = 'inherit:' + (editorInheritValue || '');
      }
    } else {
      value = cloneDeep(value);
      for (let key in value) {
        if (value[key] === 'inherit') {
          value[key] = 'inherit:' + (editorInheritValue[key] || '');
        }
      }
    }
  }
  return value;
}
