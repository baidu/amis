import cloneDeep from 'lodash/cloneDeep';

/**
 * 根据路径获取默认值
 */
export function getValueByPath(path: string | string[], data: any): any {
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
          }
          value = value[key];
        }
      }
      if (defaultToken && value) {
        // 继承default
        if (typeof value === 'object') {
          for (let key in value) {
            if (value[key] === `var(${defaultToken}${key})`) {
              value[key] = 'inherit';
            }
          }
        } else {
          if (value === `var(${defaultToken}${keys[keys.length - 1]})`) {
            value = 'inherit';
          }
        }
      }
      return value;
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
