import isPlainObject from 'lodash/isPlainObject';
import isEqual from 'lodash/isEqual';
import uniq from 'lodash/uniq';
import {Schema, PlainObject, FunctionPropertyNames} from '../types';
import {evalExpression} from './tpl';
import qs from 'qs';
import {IIRendererStore} from '../store';
import {IFormStore} from '../store/form';
import {autobindMethod} from './autobind';

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

/**
 * 给目标对象添加其他属性，可读取但是不会被遍历。
 * @param target
 * @param props
 */
export function injectPropsToObject(target: any, props: any) {
  const sup = Object.create(target.__super || null);
  Object.keys(props).forEach(key => (sup[key] = props[key]));
  const result = Object.create(sup);
  Object.keys(target).forEach(key => (result[key] = target[key]));
  return result;
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

export function syncDataFromSuper(
  data: any,
  superObject: any,
  prevSuperObject: any,
  store: IIRendererStore,
  force: boolean
) {
  const obj = {
    ...data
  };

  let keys: Array<string> = [];

  // 如果是 form store，则从父级同步 formItem 种东西。
  if (store && store.storeType === 'FormStore') {
    keys = uniq(
      (store as IFormStore).items
        .map(item => `${item.name}`.replace(/\..*$/, ''))
        .concat(Object.keys(obj))
    );
  } else if (force) {
    keys = Object.keys(obj);
  }

  if (superObject || prevSuperObject) {
    keys.forEach(key => {
      if (!key) {
        return;
      }

      if (
        ((superObject && typeof superObject[key] !== 'undefined') ||
          (prevSuperObject && typeof prevSuperObject[key] !== 'undefined')) &&
        ((prevSuperObject && !superObject) ||
          (!prevSuperObject && superObject) ||
          prevSuperObject[key] !== superObject[key])
      ) {
        obj[key] = superObject[key];
      }
    });
  }

  return obj;
}

/**
 * 生成 8 位随机数字。
 *
 * @return {string} 8位随机数字
 */
export function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + s4();
}

export function findIndex(
  arr: Array<any>,
  detect: (item?: any, index?: number) => boolean
) {
  for (let i = 0, len = arr.length; i < len; i++) {
    if (detect(arr[i], i)) {
      return i;
    }
  }

  return -1;
}

export function getVariable(
  data: {[propName: string]: any},
  key: string,
  canAccessSuper: boolean = true
): any {
  if (!data || !key) {
    return undefined;
  } else if (canAccessSuper ? key in data : data.hasOwnProperty(key)) {
    return data[key];
  }

  return keyToPath(key).reduce(
    (obj, key) =>
      obj &&
      typeof obj === 'object' &&
      (canAccessSuper ? key in obj : obj.hasOwnProperty(key))
        ? obj[key]
        : undefined,
    data
  );
}

export function setVariable(
  data: {[propName: string]: any},
  key: string,
  value: any
) {
  data = data || {};

  if (key in data) {
    data[key] = value;
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

export function hasOwnProperty(
  data: {[propName: string]: any},
  key: string
): boolean {
  const parts = keyToPath(key);

  while (parts.length) {
    let key = parts.shift() as string;
    if (!isObject(data) || !data.hasOwnProperty(key)) {
      return false;
    }

    data = data[key];
  }

  return true;
}

export function noop() {}

export function anyChanged(
  attrs: string | Array<string>,
  from: {[propName: string]: any},
  to: {[propName: string]: any},
  strictMode: boolean = true
): boolean {
  return (typeof attrs === 'string'
    ? attrs.split(/\s*,\s*/)
    : attrs
  ).some(key => (strictMode ? from[key] !== to[key] : from[key] != to[key]));
}

export function rmUndefined(obj: PlainObject) {
  const newObj: PlainObject = {};

  if (typeof obj !== 'object') {
    return obj;
  }

  const keys = Object.keys(obj);
  keys.forEach(key => {
    if (obj[key] !== undefined) {
      newObj[key] = obj[key];
    }
  });

  return newObj;
}

export function isObjectShallowModified(
  prev: any,
  next: any,
  strictMode: boolean = true,
  ignoreUndefined: boolean = false
): boolean {
  if (Array.isArray(prev) && Array.isArray(next)) {
    return prev.length !== next.length
      ? true
      : prev.some((prev, index) =>
          isObjectShallowModified(
            prev,
            next[index],
            strictMode,
            ignoreUndefined
          )
        );
  } else if (
    null == prev ||
    null == next ||
    !isObject(prev) ||
    !isObject(next)
  ) {
    return strictMode ? prev !== next : prev != next;
  }

  if (ignoreUndefined) {
    prev = rmUndefined(prev);
    next = rmUndefined(next);
  }

  const keys = Object.keys(prev);
  const nextKeys = Object.keys(next);
  if (
    keys.length !== nextKeys.length ||
    keys.sort().join(',') !== nextKeys.sort().join(',')
  ) {
    return true;
  }
  for (let i: number = keys.length - 1; i >= 0; i--) {
    let key = keys[i];
    if (
      strictMode
        ? next[key] !== prev[key]
        : isObjectShallowModified(next[key], prev[key], false, ignoreUndefined)
    ) {
      return true;
    }
  }
  return false;
}

export function isArrayChildrenModified(
  prev: Array<any>,
  next: Array<any>,
  strictMode: boolean = true
) {
  if (!Array.isArray(prev) || !Array.isArray(next)) {
    return strictMode ? prev !== next : prev != next;
  }

  if (prev.length !== next.length) {
    return true;
  }

  for (let i: number = prev.length - 1; i >= 0; i--) {
    if (strictMode ? prev[i] !== next[i] : prev[i] != next[i]) {
      return true;
    }
  }

  return false;
}

export function immutableExtends(to: any, from: any, deep = false) {
  // 不是对象，不可以merge
  if (!isObject(to) || !isObject(from)) {
    return to;
  }

  let ret = to;

  Object.keys(from).forEach(key => {
    const origin = to[key];
    const value = from[key];

    // todo 支持深度merge
    if (origin !== value) {
      // 一旦有修改，就创建个新对象。
      ret = ret !== to ? ret : {...to};
      ret[key] = value;
    }
  });

  return ret;
}

// 即将抛弃
export function makeColumnClassBuild(
  steps: number,
  classNameTpl: string = 'col-sm-$value'
) {
  let count = 12;
  let step = Math.floor(count / steps);

  return function (schema: Schema) {
    if (
      schema.columnClassName &&
      /\bcol-(?:xs|sm|md|lg)-(\d+)\b/.test(schema.columnClassName)
    ) {
      const flex = parseInt(RegExp.$1, 10);
      count -= flex;
      steps--;
      step = Math.floor(count / steps);
      return schema.columnClassName;
    } else if (schema.columnClassName) {
      count -= step;
      steps--;
      return schema.columnClassName;
    }

    count -= step;
    steps--;
    return classNameTpl.replace('$value', '' + step);
  };
}

export function hasVisibleExpression(schema: {
  visibleOn?: string;
  hiddenOn?: string;
  visible?: boolean;
  hidden?: boolean;
}) {
  return schema?.visibleOn || schema?.hiddenOn;
}

export function isVisible(
  schema: {
    visibleOn?: string;
    hiddenOn?: string;
    visible?: boolean;
    hidden?: boolean;
  },
  data?: object
) {
  return !(
    schema.hidden ||
    schema.visible === false ||
    (schema.hiddenOn && evalExpression(schema.hiddenOn, data) === true) ||
    (schema.visibleOn && evalExpression(schema.visibleOn, data) === false)
  );
}

export function isDisabled(
  schema: {
    disabledOn?: string;
    disabled?: boolean;
  },
  data?: object
) {
  return (
    schema.disabled ||
    (schema.disabledOn && evalExpression(schema.disabledOn, data))
  );
}

export function hasAbility(
  schema: any,
  ability: string,
  data?: object,
  defaultValue: boolean = true
): boolean {
  return schema.hasOwnProperty(ability)
    ? schema[ability]
    : schema.hasOwnProperty(`${ability}On`)
    ? evalExpression(schema[`${ability}On`], data || schema)
    : defaultValue;
}

export function makeHorizontalDeeper(
  horizontal: {
    left: string;
    right: string;
    offset: string;
    leftFixed?: any;
  },
  count: number
): {
  left: string | number;
  right: string | number;
  offset: string | number;
  leftFixed?: any;
} {
  if (count > 1 && /\bcol-(xs|sm|md|lg)-(\d+)\b/.test(horizontal.left)) {
    const flex = parseInt(RegExp.$2, 10) * count;
    return {
      leftFixed: horizontal.leftFixed,
      left: flex,
      right: 12 - flex,
      offset: flex
    };
  } else if (count > 1 && typeof horizontal.left === 'number') {
    const flex = horizontal.left * count;

    return {
      leftFixed: horizontal.leftFixed,
      left: flex,
      right: 12 - flex,
      offset: flex
    };
  }

  return horizontal;
}

export function promisify<T extends Function>(
  fn: T
): (
  ...args: Array<any>
) => Promise<any> & {
  raw: T;
} {
  let promisified = function () {
    try {
      const ret = fn.apply(null, arguments);
      if (ret && ret.then) {
        return ret;
      } else if (typeof ret === 'function') {
        // thunk support
        return new Promise((resolve, reject) =>
          ret((error: boolean, value: any) =>
            error ? reject(error) : resolve(value)
          )
        );
      }
      return Promise.resolve(ret);
    } catch (e) {
      Promise.reject(e);
    }
  };
  (promisified as any).raw = fn;
  return promisified;
}

export function getScrollParent(node: HTMLElement): HTMLElement | null {
  if (node == null) {
    return null;
  }

  const style = getComputedStyle(node);

  if (!style) {
    return null;
  }

  const text =
    style.getPropertyValue('overflow') +
    style.getPropertyValue('overflow-x') +
    style.getPropertyValue('overflow-y');

  if (/auto|scroll/.test(text) || node.nodeName === 'BODY') {
    return node;
  }

  return getScrollParent(node.parentNode as HTMLElement);
}

/**
 * Deep diff between two object, using lodash
 * @param  {Object} object Object compared
 * @param  {Object} base   Object to compare with
 * @return {Object}        Return a new object who represent the diff
 */
export function difference<
  T extends {[propName: string]: any},
  U extends {[propName: string]: any}
>(object: T, base: U, keepProps?: Array<string>): {[propName: string]: any} {
  function changes(object: T, base: U) {
    if (isObject(object) && isObject(base)) {
      const keys: Array<keyof T & keyof U> = uniq(
        Object.keys(object).concat(Object.keys(base))
      );
      let result: any = {};

      keys.forEach(key => {
        const a: any = object[key as keyof T];
        const b: any = base[key as keyof U];

        if (keepProps && ~keepProps.indexOf(key as string)) {
          result[key] = a;
        }

        if (isEqual(a, b)) {
          return;
        }

        if (!object.hasOwnProperty(key)) {
          result[key] = undefined;
        } else if (Array.isArray(a) && Array.isArray(b)) {
          result[key] = a;
        } else {
          result[key] = changes(a as any, b as any);
        }
      });

      return result;
    } else {
      return object;
    }
  }
  return changes(object, base);
}

export const padArr = (arr: Array<any>, size = 4): Array<Array<any>> => {
  const ret: Array<Array<any>> = [];
  const pool: Array<any> = arr.concat();
  let from = 0;

  while (pool.length) {
    let host: Array<any> = ret[from] || (ret[from] = []);

    if (host.length >= size) {
      from += 1;
      continue;
    }

    host.push(pool.shift());
  }

  return ret;
};

export function __uri(id: string) {
  return id;
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

// xs < 768px
// sm >= 768px
// md >= 992px
// lg >= 1200px
export function isBreakpoint(str: string): boolean {
  if (typeof str !== 'string') {
    return !!str;
  }

  const breaks = str.split(/\s*,\s*|\s+/);

  if ((window as any).matchMedia) {
    return breaks.some(
      item =>
        item === '*' ||
        (item === 'xs' &&
          matchMedia(`screen and (max-width: 767px)`).matches) ||
        (item === 'sm' &&
          matchMedia(`screen and (min-width: 768px) and (max-width: 991px)`)
            .matches) ||
        (item === 'md' &&
          matchMedia(`screen and (min-width: 992px) and (max-width: 1199px)`)
            .matches) ||
        (item === 'lg' && matchMedia(`screen and (min-width: 1200px)`).matches)
    );
  } else {
    const width = window.innerWidth;
    return breaks.some(
      item =>
        item === '*' ||
        (item === 'xs' && width < 768) ||
        (item === 'sm' && width >= 768 && width < 992) ||
        (item === 'md' && width >= 992 && width < 1200) ||
        (item === 'lg' && width >= 1200)
    );
  }
}

export function until(
  fn: () => Promise<any>,
  when: (ret: any) => boolean,
  getCanceler: (fn: () => any) => void,
  interval: number = 5000
) {
  let timer: NodeJS.Timeout;
  let stoped: boolean = false;

  return new Promise((resolve, reject) => {
    let cancel = () => {
      clearTimeout(timer);
      stoped = true;
    };

    let check = async () => {
      try {
        const ret = await fn();

        if (stoped) {
          return;
        } else if (when(ret)) {
          stoped = true;
          resolve(ret);
        } else {
          timer = setTimeout(check, interval);
        }
      } catch (e) {
        reject(e);
      }
    };

    check();
    getCanceler && getCanceler(cancel);
  });
}

export function omitControls(
  controls: Array<any>,
  omitItems: Array<string>
): Array<any> {
  return controls.filter(
    control => !~omitItems.indexOf(control.name || control._name)
  );
}

export function isEmpty(thing: any) {
  if (isObject(thing) && Object.keys(thing).length) {
    return false;
  }

  return true;
}

/**
 * 基于时间戳的 uuid
 *
 * @returns uniqueId
 */
export const uuid = () => {
  return (+new Date()).toString(36);
};

// 参考 https://github.com/streamich/v4-uuid
const str = () =>
  (
    '00000000000000000' + (Math.random() * 0xffffffffffffffff).toString(16)
  ).slice(-16);

export const uuidv4 = () => {
  const a = str();
  const b = str();
  return (
    a.slice(0, 8) +
    '-' +
    a.slice(8, 12) +
    '-4' +
    a.slice(13) +
    '-a' +
    b.slice(1, 4) +
    '-' +
    b.slice(4)
  );
};

export interface TreeItem {
  children?: TreeArray;
  [propName: string]: any;
}
export interface TreeArray extends Array<TreeItem> {}

/**
 * 类似于 arr.map 方法，此方法主要针对类似下面示例的树形结构。
 * [
 *     {
 *         children: []
 *     },
 *     // 其他成员
 * ]
 *
 * @param {Tree} tree 树形数据
 * @param {Function} iterator 处理函数，返回的数据会被替换成新的。
 * @return {Tree} 返回处理过的 tree
 */
export function mapTree<T extends TreeItem>(
  tree: Array<T>,
  iterator: (item: T, key: number, level: number, paths: Array<T>) => T,
  level: number = 1,
  depthFirst: boolean = false,
  paths: Array<T> = []
) {
  return tree.map((item: any, index) => {
    if (depthFirst) {
      let children: TreeArray | undefined = item.children
        ? mapTree(
            item.children,
            iterator,
            level + 1,
            depthFirst,
            paths.concat(item)
          )
        : undefined;
      children && (item = {...item, children: children});
      item = iterator(item, index, level, paths) || {...(item as object)};
      return item;
    }

    item = iterator(item, index, level, paths) || {...(item as object)};

    if (item.children && item.children.splice) {
      item.children = mapTree(
        item.children,
        iterator,
        level + 1,
        depthFirst,
        paths.concat(item)
      );
    }

    return item;
  });
}

/**
 * 遍历树
 * @param tree
 * @param iterator
 */
export function eachTree<T extends TreeItem>(
  tree: Array<T>,
  iterator: (item: T, key: number, level: number) => any,
  level: number = 1
) {
  tree.map((item, index) => {
    iterator(item, index, level);

    if (item.children && item.children.splice) {
      eachTree(item.children, iterator, level + 1);
    }
  });
}

/**
 * 在树中查找节点。
 * @param tree
 * @param iterator
 */
export function findTree<T extends TreeItem>(
  tree: Array<T>,
  iterator: (item: T, key: number, level: number, paths: Array<T>) => any
): T | null {
  let result: T | null = null;

  everyTree(tree, (item, key, level, paths) => {
    if (iterator(item, key, level, paths)) {
      result = item;
      return false;
    }
    return true;
  });

  return result;
}

/**
 * 在树中查找节点, 返回下标数组。
 * @param tree
 * @param iterator
 */
export function findTreeIndex<T extends TreeItem>(
  tree: Array<T>,
  iterator: (item: T, key: number, level: number, paths: Array<T>) => any
): Array<number> | undefined {
  let idx: Array<number> = [];

  findTree(tree, (item, index, level, paths) => {
    if (iterator(item, index, level, paths)) {
      idx = [index];

      paths = paths.concat();
      paths.unshift({
        children: tree
      } as any);

      for (let i = paths.length - 1; i > 0; i--) {
        const prev = paths[i - 1];
        const current = paths[i];
        idx.unshift(prev.children!.indexOf(current));
      }

      return true;
    }
    return false;
  });

  return idx.length ? idx : undefined;
}

export function getTree<T extends TreeItem>(
  tree: Array<T>,
  idx: Array<number> | number
): T | undefined | null {
  const indexes = Array.isArray(idx) ? idx.concat() : [idx];
  const lastIndex = indexes.pop()!;
  let list: Array<T> | null = tree;
  for (let i = 0, len = indexes.length; i < len; i++) {
    const index = indexes[i];
    if (!list![index]) {
      list = null;
      break;
    }
    list = list![index].children as any;
  }
  return list ? list[lastIndex] : undefined;
}

/**
 * 过滤树节点
 *
 * @param tree
 * @param iterator
 */
export function filterTree<T extends TreeItem>(
  tree: Array<T>,
  iterator: (item: T, key: number, level: number) => boolean,
  level: number = 1,
  depthFirst: boolean = false
) {
  if (depthFirst) {
    return tree
      .map(item => {
        let children: TreeArray | undefined = item.children
          ? filterTree(item.children, iterator, level + 1, depthFirst)
          : undefined;
        children && (item = {...item, children: children});
        return item;
      })
      .filter((item, index) => iterator(item, index, level));
  }

  return tree
    .filter((item, index) => iterator(item, index, level))
    .map(item => {
      if (item.children && item.children.splice) {
        item = {
          ...item,
          children: filterTree(item.children, iterator, level + 1, depthFirst)
        };
      }
      return item;
    });
}

/**
 * 判断树中每个节点是否满足某个条件。
 * @param tree
 * @param iterator
 */
export function everyTree<T extends TreeItem>(
  tree: Array<T>,
  iterator: (
    item: T,
    key: number,
    level: number,
    paths: Array<T>,
    indexes: Array<number>
  ) => boolean,
  level: number = 1,
  paths: Array<T> = [],
  indexes: Array<number> = []
): boolean {
  return tree.every((item, index) => {
    const value: any = iterator(item, index, level, paths, indexes);

    if (value && item.children && item.children.splice) {
      return everyTree(
        item.children,
        iterator,
        level + 1,
        paths.concat(item),
        indexes.concat(index)
      );
    }

    return value;
  });
}

/**
 * 判断树中是否有某些节点满足某个条件。
 * @param tree
 * @param iterator
 */
export function someTree<T extends TreeItem>(
  tree: Array<T>,
  iterator: (item: T, key: number, level: number, paths: Array<T>) => boolean
): boolean {
  let result = false;

  everyTree(tree, (item: T, key: number, level: number, paths: Array<T>) => {
    if (iterator(item, key, level, paths)) {
      result = true;
      return false;
    }
    return true;
  });

  return result;
}

/**
 * 将树打平变成一维数组，可以传入第二个参数实现打平节点中的其他属性。
 *
 * 比如：
 *
 * flattenTree([
 *     {
 *         id: 1,
 *         children: [
 *              { id: 2 },
 *              { id: 3 },
 *         ]
 *     }
 * ], item => item.id); // 输出位 [1, 2, 3]
 *
 * @param tree
 * @param mapper
 */
export function flattenTree<T extends TreeItem>(tree: Array<T>): Array<T>;
export function flattenTree<T extends TreeItem, U>(
  tree: Array<T>,
  mapper: (value: T, index: number) => U
): Array<U>;
export function flattenTree<T extends TreeItem, U>(
  tree: Array<T>,
  mapper?: (value: T, index: number) => U
): Array<U> {
  let flattened: Array<any> = [];
  eachTree(tree, (item, index) =>
    flattened.push(mapper ? mapper(item, index) : item)
  );
  return flattened;
}

/**
 * 操作树，遵循 imutable, 每次返回一个新的树。
 * 类似数组的 splice 不同的地方这个方法不修改原始数据，
 * 同时第二个参数不是下标，而是下标数组，分别代表每一层的下标。
 *
 * 至于如何获取下标数组，请查看 findTreeIndex
 *
 * @param tree
 * @param idx
 * @param deleteCount
 * @param ...items
 */
export function spliceTree<T extends TreeItem>(
  tree: Array<T>,
  idx: Array<number> | number,
  deleteCount: number = 0,
  ...items: Array<T>
): Array<T> {
  const list = tree.concat();
  if (typeof idx === 'number') {
    list.splice(idx, deleteCount, ...items);
  } else if (Array.isArray(idx) && idx.length) {
    idx = idx.concat();
    const lastIdx = idx.pop()!;
    let host = idx.reduce((list: Array<T>, idx) => {
      const child = {
        ...list[idx],
        children: list[idx].children ? list[idx].children!.concat() : []
      };
      list[idx] = child;
      return child.children;
    }, list);
    host.splice(lastIdx, deleteCount, ...items);
  }

  return list;
}

/**
 * 计算树的深度
 * @param tree
 */
export function getTreeDepth<T extends TreeItem>(tree: Array<T>): number {
  return Math.max(
    ...tree.map(item => {
      if (Array.isArray(item.children)) {
        return 1 + getTreeDepth(item.children);
      }

      return 1;
    })
  );
}

/**
 * 从树中获取某个值的所有祖先
 * @param tree
 * @param value
 */
export function getTreeAncestors<T extends TreeItem>(
  tree: Array<T>,
  value: T,
  includeSelf = false
): Array<T> | null {
  let ancestors: Array<T> | null = null;

  findTree(tree, (item, index, level, paths) => {
    if (item === value) {
      ancestors = paths;
      if (includeSelf) {
        ancestors.push(item);
      }
      return true;
    }
    return false;
  });

  return ancestors;
}

/**
 * 从树中获取某个值的上级
 * @param tree
 * @param value
 */
export function getTreeParent<T extends TreeItem>(tree: Array<T>, value: T) {
  const ancestors = getTreeAncestors(tree, value);
  return ancestors?.length ? ancestors[ancestors.length - 1] : null;
}

export function ucFirst(str?: string) {
  return str ? str.substring(0, 1).toUpperCase() + str.substring(1) : '';
}

export function lcFirst(str?: string) {
  return str ? str.substring(0, 1).toLowerCase() + str.substring(1) : '';
}

export function camel(str?: string) {
  return str
    ? str
        .split(/[\s_\-]/)
        .map((item, index) => (index === 0 ? lcFirst(item) : ucFirst(item)))
        .join('')
    : '';
}

export function getWidthRate(value: any, strictMode = false): number {
  if (typeof value === 'string' && /\bcol\-\w+\-(\d+)\b/.test(value)) {
    return parseInt(RegExp.$1, 10);
  }

  return strictMode ? 0 : value || 0;
}

export function getLevelFromClassName(
  value: string,
  defaultValue: string = 'default'
) {
  if (
    /\b(?:btn|text)-(link|primary|secondary|info|success|warning|danger|light|dark)\b/.test(
      value
    )
  ) {
    return RegExp.$1;
  }

  return defaultValue;
}

export function string2regExp(value: string, caseSensitive = false) {
  if (typeof value !== 'string') {
    throw new TypeError('Expected a string');
  }

  return new RegExp(
    value.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d'),
    !caseSensitive ? 'i' : ''
  );
}

export function pickEventsProps(props: any) {
  const ret: any = {};
  props &&
    Object.keys(props).forEach(
      key => /^on/.test(key) && (ret[key] = props[key])
    );
  return ret;
}

export const autobind = autobindMethod;

export const bulkBindFunctions = function <
  T extends {
    [propName: string]: any;
  }
>(context: T, funNames: Array<FunctionPropertyNames<T>>) {
  funNames.forEach(key => (context[key] = context[key].bind(context)));
};

export function sortArray<T extends any>(
  items: Array<T>,
  field: string,
  dir: -1 | 1
): Array<T> {
  return items.sort((a: any, b: any) => {
    let ret: number;
    const a1 = a[field];
    const b1 = b[field];

    if (typeof a1 === 'number' && typeof b1 === 'number') {
      ret = a1 < b1 ? -1 : a1 === b1 ? 0 : 1;
    } else {
      ret = String(a1).localeCompare(String(b1));
    }

    return ret * dir;
  });
}

// 只判断一层, 如果层级很深，form-data 也不好表达。
export function hasFile(object: any): boolean {
  return Object.keys(object).some(key => {
    let value = object[key];

    return (
      value instanceof File ||
      (Array.isArray(value) && value.length && value[0] instanceof File)
    );
  });
}

export function qsstringify(
  data: any,
  options: any = {
    arrayFormat: 'indices',
    encodeValuesOnly: true
  }
) {
  return qs.stringify(data, options);
}

export function object2formData(
  data: any,
  options: any = {
    arrayFormat: 'indices',
    encodeValuesOnly: true
  },
  fd: FormData = new FormData()
): any {
  let fileObjects: any = [];
  let others: any = {};

  Object.keys(data).forEach(key => {
    const value = data[key];

    if (value instanceof File) {
      fileObjects.push([key, value]);
    } else if (
      Array.isArray(value) &&
      value.length &&
      value[0] instanceof File
    ) {
      value.forEach(value => fileObjects.push([`${key}[]`, value]));
    } else {
      others[key] = value;
    }
  });

  // 因为 key 的格式太多了，偷个懒，用 qs 来处理吧。
  qsstringify(others, options)
    .split('&')
    .forEach(item => {
      let parts = item.split('=');
      // form-data/multipart 是不需要 encode 值的。
      parts[0] && fd.append(parts[0], decodeURIComponent(parts[1]));
    });

  // Note: File类型字段放在后面，可以支持第三方云存储鉴权
  fileObjects.forEach((fileObject: any[]) =>
    fd.append(fileObject[0], fileObject[1], fileObject[1].name)
  );

  return fd;
}

export function chainFunctions(
  ...fns: Array<(...args: Array<any>) => void>
): (...args: Array<any>) => void {
  return (...args: Array<any>) =>
    fns.reduce(
      (ret: any, fn: any) =>
        ret === false
          ? false
          : typeof fn == 'function'
          ? fn(...args)
          : undefined,
      undefined
    );
}

export function chainEvents(props: any, schema: any) {
  const ret: any = {};

  Object.keys(props).forEach(key => {
    if (
      key.substr(0, 2) === 'on' &&
      typeof props[key] === 'function' &&
      typeof schema[key] === 'function' &&
      schema[key] !== props[key]
    ) {
      ret[key] = chainFunctions(schema[key], props[key]);
    } else {
      ret[key] = props[key];
    }
  });

  return ret;
}

export function mapObject(value: any, fn: Function): any {
  if (Array.isArray(value)) {
    return value.map(item => mapObject(item, fn));
  }
  if (isObject(value)) {
    let tmpValue = {...value};
    Object.keys(tmpValue).forEach(key => {
      (tmpValue as PlainObject)[key] = mapObject(
        (tmpValue as PlainObject)[key],
        fn
      );
    });
    return tmpValue;
  }
  return fn(value);
}

export function loadScript(src: string) {
  return new Promise<void>((ok, fail) => {
    const script = document.createElement('script');
    script.onerror = reason => fail(reason);

    if (~src.indexOf('{{callback}}')) {
      const callbackFn = `loadscriptcallback_${uuid()}`;
      (window as any)[callbackFn] = () => {
        ok();
        delete (window as any)[callbackFn];
      };
      src = src.replace('{{callback}}', callbackFn);
    } else {
      script.onload = () => ok();
    }

    script.src = src;
    document.head.appendChild(script);
  });
}

export class SkipOperation extends Error {}

/**
 * 将例如像 a.b.c 或 a[1].b 的字符串转换为路径数组
 *
 * @param string 要转换的字符串
 */
export const keyToPath = (string: string) => {
  const result = [];

  if (string.charCodeAt(0) === '.'.charCodeAt(0)) {
    result.push('');
  }

  string.replace(
    new RegExp(
      '[^.[\\]]+|\\[(?:([^"\'][^[]*)|(["\'])((?:(?!\\2)[^\\\\]|\\\\.)*?)\\2)\\]|(?=(?:\\.|\\[\\])(?:\\.|\\[\\]|$))',
      'g'
    ),
    (match, expression, quote, subString) => {
      let key = match;
      if (quote) {
        key = subString.replace(/\\(\\)?/g, '$1');
      } else if (expression) {
        key = expression.trim();
      }
      result.push(key);
      return '';
    }
  );

  return result;
};

/**
 * 深度查找具有某个 key 名字段的对象
 * @param obj
 * @param key
 */
export function findObjectsWithKey(obj: any, key: string) {
  let objects: any[] = [];
  for (const k in obj) {
    if (!obj.hasOwnProperty(k)) continue;
    if (k === key) {
      objects.push(obj);
    } else if (typeof obj[k] === 'object') {
      objects = objects.concat(findObjectsWithKey(obj[k], key));
    }
  }
  return objects;
}
