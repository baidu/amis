import isPlainObject from 'lodash/isPlainObject';
import {keyToPath} from './keyToPath';
import {resolveVariable} from './resolveVariable';

// 方便取值的时候能够把上层的取到，但是获取的时候不会全部把所有的数据获取到。
export function createObject(
  superProps?: {[propName: string]: any},
  props?: {[propName: string]: any},
  properties?: any
): object {
  if (superProps && Object.isFrozen(superProps)) {
    superProps = cloneObject(superProps);
  }

  const obj = superProps
    ? Object.create(superProps, {
        ...properties,
        __super: {
          value: superProps,
          writable: false,
          enumerable: false
        }
      })
    : Object.create(Object.prototype, properties);

  props &&
    isObject(props) &&
    Object.keys(props).forEach(key => (obj[key] = props[key]));

  return obj;
}

export function cloneObject(target: any, persistOwnProps: boolean = true) {
  const obj =
    target && target.__super
      ? Object.create(target.__super, {
          __super: {
            value: target.__super,
            writable: false,
            enumerable: false
          }
        })
      : Object.create(Object.prototype);
  persistOwnProps &&
    target &&
    Object.keys(target).forEach(key => (obj[key] = target[key]));
  return obj;
}

export function extendObject(
  target: any,
  src?: any,
  persistOwnProps: boolean = true
) {
  const obj = cloneObject(target, persistOwnProps);
  src && Object.keys(src).forEach(key => (obj[key] = src[key]));
  return obj;
}

export function isObject(obj: any) {
  const typename = typeof obj;
  return (
    obj &&
    typename !== 'string' &&
    typename !== 'number' &&
    typename !== 'boolean' &&
    typename !== 'function' &&
    !Array.isArray(obj)
  );
}

export function setVariable(
  data: {[propName: string]: any},
  key: string,
  value: any,
  convertKeyToPath?: boolean
) {
  data = data || {};

  if (key in data) {
    data[key] = value;
    return;
  }

  const parts = convertKeyToPath !== false ? keyToPath(key) : [key];
  const last = parts.pop() as string;

  while (parts.length) {
    let key = parts.shift() as string;
    if (isPlainObject(data[key])) {
      data = data[key] = {
        ...data[key]
      };
    } else if (Array.isArray(data[key])) {
      data[key] = data[key].concat();
      data = data[key];
    } else if (data[key]) {
      // throw new Error(`目标路径不是纯对象，不能覆盖`);
      // 强行转成对象
      data[key] = {};
      data = data[key];
    } else {
      data[key] = {};
      data = data[key];
    }
  }

  data[last] = value;
}

export function deleteVariable(data: {[propName: string]: any}, key: string) {
  if (!data) {
    return;
  } else if (data.hasOwnProperty(key)) {
    delete data[key];
    return;
  }

  const parts = keyToPath(key);
  const last = parts.pop() as string;

  while (parts.length) {
    let key = parts.shift() as string;
    if (isPlainObject(data[key])) {
      data = data[key] = {
        ...data[key]
      };
    } else if (data[key]) {
      throw new Error(`目标路径不是纯对象，不能修改`);
    } else {
      break;
    }
  }

  if (data && data.hasOwnProperty && data.hasOwnProperty(last)) {
    delete data[last];
  }
}

export function pickValues(names: string, data: object) {
  let arr: Array<string>;
  if (!names || ((arr = names.split(',')) && arr.length < 2)) {
    let idx = names.indexOf('~');
    if (~idx) {
      let key = names.substring(0, idx);
      let target = names.substring(idx + 1);
      return {
        [key]: resolveVariable(target, data)
      };
    }
    return resolveVariable(names, data);
  }

  let ret: any = {};
  arr.forEach(name => {
    let idx = name.indexOf('~');
    let target = name;

    if (~idx) {
      target = name.substring(idx + 1);
      name = name.substring(0, idx);
    }

    setVariable(ret, name, resolveVariable(target, data));
  });
  return ret;
}
