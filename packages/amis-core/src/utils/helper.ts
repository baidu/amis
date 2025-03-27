import React from 'react';
import moment from 'moment';
import {isObservable, isObservableArray} from 'mobx';
import uniq from 'lodash/uniq';
import last from 'lodash/last';
import merge from 'lodash/merge';
import isPlainObject from 'lodash/isPlainObject';
import isEqual from 'lodash/isEqual';
import isNaN from 'lodash/isNaN';
import isNumber from 'lodash/isNumber';
import isString from 'lodash/isString';
import qs from 'qs';
import {compile} from 'path-to-regexp';
import {matchSorter} from 'match-sorter';

import type {Schema, PlainObject, FunctionPropertyNames} from '../types';

import {
  evalExpression,
  evalExpressionWithConditionBuilder,
  filter
} from './tpl';
import {IIRendererStore} from '../store';
import {IFormStore} from '../store/form';
import {autobindMethod} from './autobind';
import {
  isPureVariable,
  resolveVariable,
  resolveVariableAndFilter,
  tokenize
} from './tpl-builtin';
import {
  cloneObject,
  createObject,
  deleteVariable,
  extendObject,
  isObject,
  setVariable
} from './object';
import {string2regExp} from './string2regExp';
import {getVariable} from './getVariable';
import {keyToPath} from './keyToPath';
import {isExpression, replaceExpression} from './formula';
import type {IStatusStore} from '../store/status';
import {isAlive} from 'mobx-state-tree';

export {
  createObject,
  cloneObject,
  isObject,
  string2regExp,
  getVariable,
  setVariable,
  deleteVariable,
  keyToPath,
  extendObject
};

export function preventDefault(event: TouchEvent | Event): void {
  if (typeof event.cancelable !== 'boolean' || event.cancelable) {
    event.preventDefault();
  }
}

// isMobile根据media宽度判断是否是移动端
export function isMobile() {
  return (window as any).matchMedia?.('(max-width: 768px)').matches;
}

// isMobileDevice根据userAgent判断是否为移动端设备
export function isMobileDevice() {
  const userAgent = navigator.userAgent;
  const isMobileUA =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone|Opera Mini|IEMobile|Mobile/i.test(
      userAgent
    );
  return isMobileUA;
}

export function range(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max);
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

export function isSuperDataModified(
  data: any,
  prevData: any,
  store: IIRendererStore
) {
  let keys: Array<string>;

  if (store && store.storeType === 'FormStore') {
    keys = uniq(
      (store as IFormStore).items
        .map(item => `${item.name}`.replace(/\..*$/, ''))
        .concat(Object.keys(store.data))
    );
  } else {
    keys = Object.keys(store.data);
  }

  if (Array.isArray(keys) && keys.length) {
    return keys.some(key => data[key] !== prevData[key]);
  }

  return false;
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
  if (
    store &&
    store.storeType === 'FormStore' &&
    (store as any).canAccessSuperData !== false
  ) {
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

export function hasOwnPropertyInPath(
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
  return (
    typeof attrs === 'string'
      ? attrs.split(',').map(item => item.trim())
      : attrs
  ).some(key =>
    strictMode ? !Object.is(from[key], to[key]) : from[key] != to[key]
  );
}

type Mutable<T> = {
  -readonly [k in keyof T]: T[k];
};

export function changedEffect<T extends Record<string, any>>(
  attrs: string | Array<string>,
  origin: T,
  data: T,
  effect: (changes: Partial<Mutable<T>>) => void,
  strictMode: boolean = true
) {
  const changes: Partial<T> = {};
  const keys =
    typeof attrs === 'string'
      ? attrs.split(',').map(item => item.trim())
      : attrs;

  keys.forEach(key => {
    if (
      strictMode ? !Object.is(origin[key], data[key]) : origin[key] != data[key]
    ) {
      (changes as any)[key] = data[key];
    }
  });

  Object.keys(changes).length && effect(changes);
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
  strictModeOrFunc: boolean | ((lhs: any, rhs: any) => boolean) = true,
  ignoreUndefined: boolean = false,
  stack: Array<any> = [],
  maxDepth: number = -1
): boolean {
  if (Array.isArray(prev) && Array.isArray(next)) {
    return prev.length !== next.length
      ? true
      : prev.some((prev, index) =>
          isObjectShallowModified(
            prev,
            next[index],
            strictModeOrFunc,
            ignoreUndefined,
            stack
          )
        );
  }

  if (isNaN(prev) && isNaN(next)) {
    return false;
  }

  if (
    null == prev ||
    null == next ||
    !isObject(prev) ||
    !isObject(next) ||
    // 不是 Object.create 创建的对象
    // 不是 plain object
    prev.constructor !== Object ||
    next.constructor !== Object
  ) {
    if (strictModeOrFunc && typeof strictModeOrFunc === 'function') {
      return strictModeOrFunc(prev, next);
    }

    return strictModeOrFunc ? prev !== next : prev != next;
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

  // 避免循环引用死循环。
  if (~stack.indexOf(prev)) {
    return false;
  }

  stack.push(prev);
  if (maxDepth > 0 && stack.length > maxDepth) {
    return true;
  }

  for (let i: number = keys.length - 1; i >= 0; i--) {
    const key = keys[i];
    if (
      isObjectShallowModified(
        prev[key],
        next[key],
        strictModeOrFunc,
        ignoreUndefined,
        stack
      )
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
    if (
      (strictMode ? prev[i] !== next[i] : prev[i] != next[i]) ||
      isArrayChildrenModified(prev[i].children, next[i].children, strictMode)
    ) {
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

  return (schema: Schema) => {
    if (
      schema.columnClassName &&
      /\bcol-(?:xs|sm|md|lg)-(\d+)\b/.test(schema.columnClassName)
    ) {
      const flex = parseInt(RegExp.$1, 10);
      count -= flex;
      steps--;
      step = Math.floor(count / steps);
      return schema.columnClassName;
    }

    if (schema.columnClassName) {
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
  return !!(schema.visibleOn || schema.hiddenOn);
}

export function isVisible(
  schema: {
    id?: string;
    name?: string;
    visibleOn?: string;
    hiddenOn?: string;
    visible?: boolean;
    hidden?: boolean;
  },
  data?: object,
  statusStore?: IStatusStore
) {
  // 有状态时，状态优先
  if ((schema.id || schema.name) && statusStore) {
    const id = filter(schema.id, data);
    const name = filter(schema.name, data);

    const visible = isAlive(statusStore)
      ? statusStore.visibleState[id] ?? statusStore.visibleState[name]
      : undefined;

    if (typeof visible !== 'undefined') {
      return visible;
    }
  }

  return !(
    schema.hidden ||
    schema.visible === false ||
    (schema.hiddenOn &&
      evalExpressionWithConditionBuilder(schema.hiddenOn, data)) ||
    (schema.visibleOn &&
      !evalExpressionWithConditionBuilder(schema.visibleOn, data))
  );
}

export function isUnfolded(
  node: any,
  config: {
    foldedField?: string;
    unfoldedField?: string;
  }
): boolean {
  let {foldedField, unfoldedField} = config;

  unfoldedField ||= 'unfolded';
  foldedField ||= 'folded';

  if (unfoldedField && typeof node[unfoldedField] !== 'undefined') {
    return !!node[unfoldedField];
  }

  if (foldedField && typeof node[foldedField] !== 'undefined') {
    return !node[foldedField];
  }

  return false;
}

/**
 * 过滤掉被隐藏的数组元素
 */
export function visibilityFilter(items: any, data?: object) {
  return items.filter((item: any) => {
    return isVisible(item, data);
  });
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
    (schema.disabledOn &&
      evalExpressionWithConditionBuilder(schema.disabledOn, data))
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
    ? evalExpressionWithConditionBuilder(schema[`${ability}On`], data || schema)
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
): (...args: Array<any>) => Promise<any> & {
  raw: T;
} {
  // 避免重复处理
  if ((fn as any)._promisified) {
    return fn as any;
  }
  const promisified = function () {
    try {
      const ret = fn.apply(null, arguments);
      if (ret && ret.then) {
        return ret;
      }

      if (typeof ret === 'function') {
        // thunk support
        return new Promise((resolve, reject) =>
          ret((error: boolean, value: any) =>
            error ? reject(error) : resolve(value)
          )
        );
      }

      return Promise.resolve(ret);
    } catch (e) {
      return Promise.reject(e);
    }
  };
  (promisified as any).raw = fn;
  (promisified as any)._promisified = true;

  return promisified;
}

/**
 *
 * @param node 当前元素
 * @param compute 自定义计算，找到的父元素是否满足特殊场景
 * @returns 返回控制当前元素滚动的父元素
 */
export function getScrollParent(
  node: HTMLElement,
  compute: (parent: HTMLElement) => boolean = () => true
): HTMLElement | null {
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

  if (node.nodeName === 'BODY' || (/auto|scroll/.test(text) && compute(node))) {
    return node;
  }

  return getScrollParent(node.parentNode as HTMLElement, compute);
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
      const result: any = {};

      keys.forEach(key => {
        const a: any = object[key as keyof T];
        const b: any = base[key as keyof U];

        if (keepProps && ~keepProps.indexOf(key as string)) {
          result[key] = a;
        }

        // isEquals 里面没有处理好递归引用对象的情况
        if (
          object.hasOwnProperty(key) && // 其中一个不是自己的属性，就不要比对了
          base.hasOwnProperty(key) &&
          !isObjectShallowModified(a, b, true, undefined, undefined, 10)
        ) {
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
    }

    return object;
  }
  return changes(object, base);
}

export const padArr = (
  arr: Array<any>,
  size = 4,
  fillUndefined = false
): Array<Array<any>> => {
  const ret: Array<Array<any>> = [[]];
  const pool: Array<any> = arr.concat();
  let from = 0;

  while (pool.length || (fillUndefined && ret[ret.length - 1].length < size)) {
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
  let timer: ReturnType<typeof setTimeout>;
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
  return !(isObject(thing) && Object.keys(thing).length);
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
const createStr = () =>
  (
    '00000000000000000' + (Math.random() * 0xffffffffffffffff).toString(16)
  ).slice(-16);

export const uuidv4 = () => {
  const a = createStr();
  const b = createStr();
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
  iterator: (
    item: T,
    key: number,
    level: number,
    paths: Array<T>,
    indexes: Array<number>
  ) => T,
  level: number = 1,
  depthFirst: boolean = false,
  paths: Array<T> = [],
  indexes: Array<number> = []
) {
  return tree.map((item: any, index) => {
    if (depthFirst) {
      let children: TreeArray | undefined = item.children
        ? mapTree(
            item.children,
            iterator,
            level + 1,
            depthFirst,
            paths.concat(item),
            indexes.concat(index)
          )
        : undefined;
      children && (item = {...item, children: children});
      item = iterator(item, index, level, paths, indexes.concat(index)) || {
        ...(item as object)
      };
      return item;
    }

    item = iterator(item, index, level, paths, indexes.concat(index)) || {
      ...(item as object)
    };

    if (item.children && item.children.splice) {
      item.children = mapTree(
        item.children,
        iterator,
        level + 1,
        depthFirst,
        paths.concat(item),
        indexes.concat(index)
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
  iterator: (item: T, key: number, level: number, paths?: Array<T>) => any,
  level: number = 1,
  paths: Array<T> = []
) {
  const length = tree.length;
  for (let i = 0; i < length; i++) {
    const item = tree[i];
    const res = iterator(item, i, level, paths);
    if (res === 'break') {
      break;
    }
    if (res === 'continue') {
      continue;
    }

    if (item.children?.splice) {
      eachTree(item.children, iterator, level + 1, paths.concat(item));
    }
  }
}

/**
 * 在树中查找节点。
 * @param tree
 * @param iterator
 * @param withCache {Object} 启用缓存（new Map()），多次重复从一颗树中查找时可大幅度提升性能
 * @param withCache.value {string} 必须，需要从缓存Map中匹配的值，使用Map.get(value) 匹配
 * @param withCache.resolve {function} 构建Map 时，存入key 的处理函数
 * @param withCache.foundEffect 匹配到时，额外做的一些副作用
 */
const findTreeCache: {
  tree: any | null;
  map: Map<any, any> | null;
} = {
  tree: null,
  map: null
};
export function findTree<T extends TreeItem>(
  tree: Array<T>,
  iterator: (item: T, key: number, level: number, paths: Array<T>) => any,
  withCache?: {
    value: string | number;
    resolve?: (treeItem: T) => any;
    foundEffect?: (
      item: T,
      key: number,
      level: number,
      paths?: Array<T>
    ) => any;
  }
): T | null {
  const isValidateKey = (value: any) =>
    value !== '' && (isString(value) || isNumber(value));
  // 缓存优化
  if (withCache && isValidateKey(withCache.value)) {
    const {resolve, value, foundEffect} = withCache;
    // 构建缓存
    if (tree !== findTreeCache.tree || !findTreeCache.map) {
      const map = new Map();
      eachTree(tree, (item, key, level, paths) => {
        const mapKey = resolve ? resolve(item) : item;
        isValidateKey(mapKey) &&
          map.set(String(mapKey), [item, key, level, paths]);
      });
      findTreeCache.map = map;
      findTreeCache.tree = tree;
    }

    // 从缓存查找结果
    const res = findTreeCache.map.get(String(value));
    if (res != null) {
      // 副作用
      foundEffect && foundEffect.apply(null, res.slice());
      return res[0];
    }
  }

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
 * 在树中查找节点。
 * @param tree
 * @param iterator
 */
export function findTreeAll<T extends TreeItem>(
  tree: Array<T>,
  iterator: (item: T, key: number, level: number, paths: Array<T>) => any
): Array<T> {
  let result: Array<T> = [];

  everyTree(tree, (item, key, level, paths) => {
    if (iterator(item, key, level, paths)) {
      result.push(item);
    }
    return true;
  });

  return result;
}

/**
 * 在树中查找节点, 返回下标数组。
 * @param tree
 * @param iterator
 * @param withCache {Object} 启用缓存（new Map()），多次重复从一颗树中查找时可大幅度提升性能
 * @param withCache.value {any} 必须，需要从缓存Map中匹配的值，使用Map.get(value) 匹配
 * @param withCache.resolve {function} 构建Map 时，存入key 的处理函数
 */
export function findTreeIndex<T extends TreeItem>(
  tree: Array<T>,
  iterator: (item: T, key: number, level: number, paths: Array<T>) => any,
  withCache?: {
    resolve?: (treeItem: T) => any;
    value: any;
  }
): Array<number> | undefined {
  let idx: Array<number> = [];

  const foundEffect = (
    item: T,
    index: number,
    level: number,
    paths: Array<T>
  ) => {
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
  };

  findTree(
    tree,
    (item, index, level, paths) => {
      if (iterator(item, index, level, paths)) {
        foundEffect(item, index, level, paths);
        return true;
      }
      return false;
    },
    !withCache
      ? undefined
      : {
          ...withCache,
          foundEffect
        }
  );

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
  iterator: (item: T, key: number, level: number, paths: Array<T>) => any,
  level: number = 1,
  depthFirst: boolean = false,
  paths: Array<T> = []
) {
  if (depthFirst) {
    return tree
      .map(item => {
        let children: TreeArray | undefined = item.children
          ? filterTree(
              item.children,
              iterator,
              level + 1,
              depthFirst,
              paths.concat(item)
            )
          : undefined;

        if (Array.isArray(children) && Array.isArray(item.children)) {
          item = {...item, children: children};
        }

        return item as T;
      })
      .filter((item, index) => iterator(item, index, level, paths));
  }

  return tree
    .filter((item, index) => iterator(item, index, level, paths))
    .map(item => {
      if (item.children?.splice) {
        let children = filterTree(
          item.children,
          iterator,
          level + 1,
          depthFirst,
          paths.concat(item)
        );

        if (Array.isArray(children) && Array.isArray(item.children)) {
          item = {...item, children: children};
        }
      }
      return item as T;
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
  const stack: {
    item: T;
    index: number;
    level: number;
    paths: Array<T>;
    indexes: Array<number>;
  }[] = [];
  stack.push({item: null as any, index: -1, level: 1, paths: [], indexes: []});
  while (stack.length > 0) {
    const {item, index, level, paths, indexes} = stack.pop()!;

    if (index >= 0) {
      const value: any = iterator(item, index, level, paths, indexes);

      if (value && item.children?.splice) {
        const children = item.children;
        for (let i = children.length - 1; i >= 0; i--) {
          stack.push({
            item: children[i] as T,
            index: i,
            level: level + 1,
            paths: paths.concat(item),
            indexes: indexes.concat(index)
          });
        }
      } else if (!value) {
        return false;
      }
    } else {
      if (!Array.isArray(tree) && !isObservableArray(tree)) {
        return false;
      }
      for (let i = tree.length - 1; i >= 0; i--) {
        stack.push({
          item: tree[i],
          index: i,
          level: 1,
          paths: [],
          indexes: []
        });
      }
    }
  }
  return true;
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
 * ], item => item.id); // 输出为 [1, 2, 3]
 *
 * @param tree
 * @param mapper
 */
export function flattenTree<T extends TreeItem>(tree: Array<T>): Array<T>;
export function flattenTree<T extends TreeItem, U>(
  tree: Array<T>,
  mapper: (value: T, index: number, level: number, paths?: Array<T>) => U
): Array<U>;
export function flattenTree<T extends TreeItem, U>(
  tree: Array<T>,
  mapper?: (value: T, index: number, level: number, paths?: Array<T>) => U
): Array<U> {
  let flattened: Array<any> = [];
  eachTree(tree, (item, index, level, paths) =>
    flattened.push(mapper ? mapper(item, index, level, paths) : item)
  );
  return flattened;
}

/**
 * 将树打平变成一维数组，用法和flattenTree类似，区别是结果仅保留叶节点
 *
 * 比如：
 *
 * flattenTreeWithLeafNodes([
 *     {
 *         id: 1,
 *         children: [
 *              { id: 2 },
 *              { id: 3 },
 *         ]
 *     }
 * ], item => item.id); // 输出为 [2, 3]
 *
 * @param tree
 * @param mapper
 */
export function flattenTreeWithLeafNodes<T extends TreeItem>(
  tree: Array<T>
): Array<T>;
export function flattenTreeWithLeafNodes<T extends TreeItem, U>(
  tree: Array<T>,
  mapper: (value: T, index: number) => U
): Array<U>;
export function flattenTreeWithLeafNodes<T extends TreeItem, U>(
  tree: Array<T>,
  mapper?: (value: T, index: number) => U
): Array<U> {
  let flattened: Array<any> = [];
  eachTree(tree, (item, index) => {
    if (!item.hasOwnProperty('children')) {
      flattened.push(mapper ? mapper(item, index) : item);
    }
  });
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
  if (Array.isArray(tree) && tree.length === 0) {
    return 0;
  }
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

export function countTree<T extends TreeItem>(
  tree: Array<T>,
  iterator?: (item: T, key: number, level: number, paths?: Array<T>) => any
): number {
  let count = 0;
  eachTree(tree, (item, key, level, paths) => {
    if (!iterator || iterator(item, key, level, paths)) {
      count++;
    }
  });
  return count;
}

export function ucFirst(str?: string) {
  return typeof str === 'string'
    ? str.substring(0, 1).toUpperCase() + str.substring(1)
    : str;
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
  dir: -1 | 1,
  fieldGetter?: (item: T, field: string) => any
): Array<T> {
  return items.sort((a: any, b: any) => {
    let ret: number;
    const a1 = fieldGetter ? fieldGetter(a, field) : a[field];
    const b1 = fieldGetter ? fieldGetter(b, field) : b[field];

    if (typeof a1 === 'number' && typeof b1 === 'number') {
      ret = a1 < b1 ? -1 : a1 === b1 ? 0 : 1;
    } else {
      ret = String(a1).localeCompare(String(b1));
    }

    return ret * dir;
  });
}

export function applyFilters<T extends any>(
  items: Array<T>,
  options: {
    query: any;
    columns?: Array<any>;
    matchFunc?: Function | null;
    filterOnAllColumns?: boolean;
  }
) {
  if (options.matchFunc && typeof options.matchFunc === 'function') {
    items = options.matchFunc(items, items, options);
  } else {
    if (Array.isArray(options.columns)) {
      options.columns.forEach((column: any) => {
        let value: any =
          typeof column.name === 'string'
            ? getVariable(options.query, column.name)
            : undefined;
        const key = column.name;

        if (
          (options.filterOnAllColumns ||
            column.searchable ||
            column.filterable) &&
          key &&
          value != null
        ) {
          // value可能为null、undefined、''、0
          if (Array.isArray(value)) {
            if (value.length > 0) {
              const arr = [...items];
              let arrItems: Array<any> = [];
              value.forEach(item => {
                arrItems = [
                  ...arrItems,
                  ...matchSorter(arr, item, {
                    keys: [key],
                    threshold: matchSorter.rankings.CONTAINS
                  })
                ];
              });
              items = items.filter((item: any) =>
                arrItems.find(a => a === item)
              );
            }
          } else {
            items = matchSorter(items, value, {
              keys: [key],
              threshold: matchSorter.rankings.CONTAINS
            });
          }
        }
      });
    }
  } /** 字段的格式类型无法穷举，所以支持使用函数过滤 */
  return items;
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
  },
  keepEmptyArray?: boolean
) {
  // qs会保留空字符串。fix: Combo模式的空数组，无法清空。改为存为空字符串；
  if (keepEmptyArray) {
    data = JSONValueMap(data, value =>
      Array.isArray(value) && !value.length ? '' : value
    );
  }
  return qs.stringify(data, options);
}

export function qsparse(
  data: string,
  options: any = {
    arrayFormat: 'indices',
    encodeValuesOnly: true,
    depth: 1000, // 默认是 5， 所以condition-builder只要来个条件组就会导致报错
    arrayLimit: 1000 /** array元素数量超出限制，会被自动转化为object格式，默认值1000 */
  }
) {
  return qs.parse(data, options);
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
      // 表单项里面的 onChange 很特殊，这个不要处理。
      if (props.formStore && key === 'onChange') {
        ret[key] = props[key];
      } else {
        ret[key] = chainFunctions(schema[key], props[key]);
      }
    } else {
      ret[key] = props[key] ?? schema[key];
    }
  });

  return ret;
}

export function mapObject(
  value: any,
  valueMapper: (value: any) => any,
  skipFn?: (value: any) => boolean,
  keyMapper?: (key: string) => string
): any {
  // 如果value值满足skipFn条件则不做map操作
  skipFn =
    skipFn && typeof skipFn === 'function'
      ? skipFn
      : (value: any): boolean => {
          // File类型处理之后会变成plain object
          if (value instanceof File) {
            return true;
          }

          return false;
        };

  if (skipFn(value)) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(item => mapObject(item, valueMapper, skipFn, keyMapper));
  }

  if (isObject(value)) {
    let tmpValue = {};
    Object.keys(value).forEach(key => {
      const newKey = keyMapper ? keyMapper(key) : key;

      (tmpValue as PlainObject)[newKey] = mapObject(
        (value as PlainObject)[key],
        valueMapper,
        skipFn,
        keyMapper
      );
    });
    return tmpValue;
  }
  return valueMapper(value);
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

export function loadStyle(href: string) {
  return new Promise<void>((ok, fail) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.onerror = reason => fail(reason);
    link.onload = () => ok();

    link.href = href;
    document.head.appendChild(link);
  });
}

export class SkipOperation extends Error {}

export class ValidateError extends Error {
  name: 'ValidateError';
  detail: {[propName: string]: Array<string> | string};
  rawError?: {[propName: string]: any};

  constructor(
    message: string,
    error: {[propName: string]: Array<string> | string},
    rawError?: {[propName: string]: any}
  ) {
    super();
    this.name = 'ValidateError';
    this.message = message;
    this.detail = error;
    this.rawError = rawError;
  }
}

/**
 * 检查对象是否有循环引用，来自 https://stackoverflow.com/a/34909127
 * @param obj
 */
function isCyclic(obj: any): boolean {
  const seenObjects: any = [];
  function detect(obj: any) {
    if (obj && typeof obj === 'object') {
      if (seenObjects.indexOf(obj) !== -1) {
        return true;
      }
      seenObjects.push(obj);
      for (var key in obj) {
        if (obj.hasOwnProperty(key) && detect(obj[key])) {
          return true;
        }
      }
    }
    return false;
  }
  return detect(obj);
}

function internalFindObjectsWithKey(obj: any, key: string) {
  let objects: any[] = [];
  for (const k in obj) {
    if (!obj.hasOwnProperty(k)) continue;
    if (k === key) {
      objects.push(obj);
    } else if (typeof obj[k] === 'object') {
      objects = objects.concat(internalFindObjectsWithKey(obj[k], key));
    }
  }
  return objects;
}

/**
 * 深度查找具有某个 key 名字段的对象，实际实现是 internalFindObjectsWithKey，这里包一层是为了做循环引用检测
 * @param obj
 * @param key
 */
export function findObjectsWithKey(obj: any, key: string) {
  // 避免循环引用导致死循环
  if (isCyclic(obj)) {
    return [];
  }
  return internalFindObjectsWithKey(obj, key);
}

let scrollbarWidth: number;

/**
 * 获取浏览器滚动条宽度 https://stackoverflow.com/a/13382873
 */

export function getScrollbarWidth() {
  if (typeof scrollbarWidth !== 'undefined') {
    return scrollbarWidth;
  }
  // Creating invisible container
  const outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.overflow = 'scroll'; // forcing scrollbar to appear
  // @ts-ignore
  outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
  document.body.appendChild(outer);

  // Creating inner element and placing it in the container
  const inner = document.createElement('div');
  outer.appendChild(inner);

  // Calculating difference between container's full width and the child width
  scrollbarWidth = outer.offsetWidth - inner.offsetWidth;

  // Removing temporary elements from the DOM
  // @ts-ignore
  outer.parentNode.removeChild(outer);

  return scrollbarWidth;
}

// 后续改用 FormulaExec['formula']
function resolveValueByName(
  data: any,
  name?: string,
  canAccessSuper?: boolean
) {
  return isPureVariable(name)
    ? resolveVariableAndFilter(name, data, '|raw')
    : resolveVariable(name, data, canAccessSuper);
}

// 统一的获取 value 值方法
export function getPropValue<
  T extends {
    value?: any;
    name?: string;
    data?: any;
    defaultValue?: any;
    canAccessSuperData?: boolean;
  }
>(
  props: T,
  getter?: (props: T) => any,
  canAccessSuper = props.canAccessSuperData
) {
  const {name, value, data, defaultValue} = props;
  return (
    value ??
    getter?.(props) ??
    resolveValueByName(data, name, canAccessSuper) ??
    (isExpression(defaultValue)
      ? resolveVariableAndFilter(defaultValue, data)
      : replaceExpression(defaultValue))
  );
}

// 检测 value 是否有变化，有变化就执行 onChange
export function detectPropValueChanged<
  T extends {
    value?: any;
    name?: string;
    data?: any;
    defaultValue?: any;
  }
>(
  props: T,
  prevProps: T,
  onChange: (value: any) => void,
  getter?: (props: T) => any
) {
  let nextValue: any;
  if (typeof props.value !== 'undefined') {
    props.value !== prevProps.value && onChange(props.value);
  } else if ((nextValue = getter?.(props)) !== undefined) {
    nextValue !== getter!(prevProps) && onChange(nextValue);
  } else if (
    typeof props.name === 'string' &&
    (nextValue = resolveValueByName(props.data, props.name)) !== undefined
  ) {
    nextValue !== resolveValueByName(prevProps.data, prevProps.name) &&
      onChange(nextValue);
  } else if (props.defaultValue !== prevProps.defaultValue) {
    onChange(props.defaultValue);
  }
}

// 去掉字符串中的 html 标签，不完全准确但效率比较高
export function removeHTMLTag(str: string) {
  return typeof str === 'string' ? str.replace(/<\/?[^>]+(>|$)/g, '') : str;
}

/**
 * 将路径格式的value转换成普通格式的value值
 *
 * @example
 *
 * 'a/b/c' => 'c';
 * {label: 'A/B/C', value: 'a/b/c'} => {label: 'C', value: 'c'};
 * 'a/b/c,a/d' => 'c,d';
 * ['a/b/c', 'a/d'] => ['c', 'd'];
 * [{label: 'A/B/C', value: 'a/b/c'},{label: 'A/D', value: 'a/d'}] => [{label: 'C', value: 'c'},{label: 'D', value: 'd'}]
 */
export function normalizeNodePath(
  value: any,
  enableNodePath: boolean,
  labelField: string = 'label',
  valueField: string = 'value',
  pathSeparator: string = '/',
  delimiter: string = ','
) {
  const nodeValueArray: any[] = [];
  const nodePathArray: any[] = [];
  const getLastNodeFromPath = (path: any) =>
    last(path ? path.toString().split(pathSeparator) : []);

  if (typeof value === 'undefined' || !enableNodePath) {
    return {nodeValueArray, nodePathArray};
  }

  // 尾节点为当前options中value值
  if (Array.isArray(value)) {
    value.forEach(nodePath => {
      if (nodePath && nodePath.hasOwnProperty(valueField)) {
        nodeValueArray.push({
          ...nodePath,
          [labelField]: getLastNodeFromPath(nodePath[labelField]),
          [valueField]: getLastNodeFromPath(nodePath[valueField])
        });
        nodePathArray.push(nodePath[valueField]);
      } else {
        nodeValueArray.push(getLastNodeFromPath(nodePath));
        nodePathArray.push(nodePath);
      }
    });
  } else if (typeof value === 'string') {
    value
      .toString()
      .split(delimiter)
      .forEach(path => {
        nodeValueArray.push(getLastNodeFromPath(path));
        nodePathArray.push(path);
      });
  } else {
    nodeValueArray.push({
      ...value,
      [labelField]: getLastNodeFromPath(value[labelField]),
      [valueField || 'value']: getLastNodeFromPath(value[valueField])
    });
    nodePathArray.push(value[valueField]);
  }

  return {nodeValueArray, nodePathArray};
}

// 主要用于排除点击输入框和链接等情况
export function isClickOnInput(e: React.MouseEvent<HTMLElement>) {
  const target: HTMLElement = e.target as HTMLElement;
  let formItem;
  return !!(
    !e.currentTarget.contains(target) ||
    ~['INPUT', 'TEXTAREA'].indexOf(target.tagName) ||
    ((formItem = target.closest(
      `button, a, [data-role="form-item"], label[data-role="checkbox"], label[data-role="switch"]`
    )) &&
      e.currentTarget.contains(formItem))
  );
}

// 计算字符串 hash
export function hashCode(s: string): number {
  return s.split('').reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);
}

/**
 * 遍历 schema
 * @param json
 * @param mapper
 */
export function JSONTraverse(
  json: any,
  mapper: (value: any, key: string | number, host: Object) => any,
  maxDeep: number = Number.MAX_VALUE
) {
  if (maxDeep <= 0) {
    return;
  }
  Object.keys(json).forEach(key => {
    const value: any = json[key];
    if (!isObservable(value)) {
      if (isPlainObject(value) || Array.isArray(value)) {
        JSONTraverse(value, mapper, maxDeep - 1);
      } else {
        mapper(value, key, json);
      }
    }
  });
}

/**
 * 每层都会执行，返回新的对象，新对象不会递归下去
 * @param json
 * @param mapper
 * @returns
 */
export function JSONValueMap(
  json: any,
  mapper: (
    value: any,
    key: string | number,
    host: Object,
    stack: Array<Object>
  ) => any,
  deepFirst: boolean = false,
  stack: Array<Object> = []
) {
  if (!isPlainObject(json) && !Array.isArray(json)) {
    return json;
  }

  const iterator = (
    origin: any,
    key: number | string,
    host: any,
    stack: Array<any> = []
  ) => {
    if (deepFirst) {
      const value = JSONValueMap(origin, mapper, deepFirst, stack);
      return mapper(value, key, host, stack) ?? value;
    }

    let maped: any = mapper(origin, key, host, stack) ?? origin;

    // 如果不是深度优先，上层的对象都修改了，就不继续递归进到新返回的对象了
    if (maped === origin) {
      return JSONValueMap(origin, mapper, deepFirst, stack);
    }
    return maped;
  };

  if (Array.isArray(json)) {
    let modified = false;
    let arr = json.map((value, index) => {
      let newValue: any = iterator(value, index, json, [json].concat(stack));
      modified = modified || newValue !== value;
      return newValue;
    });
    return modified ? arr : json;
  }

  let modified = false;
  const toUpdate: any = {};
  Object.keys(json).forEach(key => {
    const value: any = json[key];
    let result: any = iterator(value, key, json, [json].concat(stack));
    if (result !== value) {
      modified = true;
      toUpdate[key] = result;
    }
  });

  return modified
    ? {
        ...json,
        ...toUpdate
      }
    : json;
}

export function convertArrayValueToMoment(
  value: number[],
  types: string[],
  mom: moment.Moment
): moment.Moment {
  if (value.length === 0) return mom;
  for (let i = 0; i < types.length; i++) {
    const type = types[i];
    // @ts-ignore
    mom.set(type, value[i]);
  }
  return mom;
}

export function getRange(min: number, max: number, step: number = 1) {
  const arr = [];
  for (let i = min; i <= max; i += step) {
    arr.push(i);
  }
  return arr;
}

export function repeatCount(count: number, iterator: (index: number) => any) {
  let result: Array<any> = [];
  let index = 0;

  while (count--) {
    result.push(iterator(index++));
  }

  return result;
}

export function isNumeric(value: any): boolean {
  if (typeof value === 'number') {
    return true;
  }
  return /^[-+]?(?:\d*[.])?\d+$/.test(value);
}

export type PrimitiveTypes = 'boolean' | 'number';

/**
 * 解析Query字符串中的原始类型，目前仅支持转化布尔类型
 *
 * @param query 查询字符串
 * @param options 配置参数
 * @returns 解析后的查询字符串
 */
export function parsePrimitiveQueryString(
  rawQuery: Record<string, any>,
  options?: {
    primitiveTypes: PrimitiveTypes[];
  }
) {
  if (!isPlainObject(rawQuery)) {
    return rawQuery;
  }

  options = options || {primitiveTypes: ['boolean']};

  if (
    !Array.isArray(options.primitiveTypes) ||
    options.primitiveTypes.length === 0
  ) {
    options.primitiveTypes = ['boolean'];
  }

  const query = JSONValueMap(rawQuery, value => {
    if (
      (options?.primitiveTypes?.includes('boolean') && value === 'true') ||
      value === 'false'
    ) {
      /** 解析布尔类型 */
      return value === 'true';
    } else if (
      options?.primitiveTypes?.includes('number') &&
      isNumeric(value) &&
      isFinite(value) &&
      value >= -Number.MAX_SAFE_INTEGER &&
      value <= Number.MAX_SAFE_INTEGER
    ) {
      /** 解析数字类型 */
      const result = Number(value);

      return !isNaN(result) ? result : value;
    }

    return value;
  });

  return query;
}

/**
 * 获取URL链接中的query参数（包含hash mode）
 *
 * @param location Location对象，或者类Location结构的对象
 * @param {Object} options 配置项
 * @param {Boolean} options.parsePrimitive 是否将query的值解析为原始类型，目前仅支持转化布尔类型
 */
export function parseQuery(
  location?: Location | {query?: any; search?: any; [propName: string]: any},
  options?: {
    parsePrimitive?: boolean;
    primitiveTypes?: PrimitiveTypes[];
  }
): Record<string, any> {
  const {parsePrimitive = false, primitiveTypes = ['boolean']} = options || {};
  const query =
    (location && !(location instanceof Location) && location?.query) ||
    (location && location?.search && qsparse(location.search.substring(1))) ||
    (window.location.search && qsparse(window.location.search.substring(1)));
  const normalizedQuery = isPlainObject(query)
    ? parsePrimitive
      ? parsePrimitiveQueryString(query, {primitiveTypes})
      : query
    : {};
  /* 处理hash中的query */
  const hash = window.location?.hash;
  let hashQuery = {};
  let idx = -1;

  if (typeof hash === 'string' && ~(idx = hash.indexOf('?'))) {
    hashQuery = qsparse(hash.substring(idx + 1));
  }

  return merge(normalizedQuery, hashQuery);
}

/**
 * 计算两个数组的差集
 *
 * @template T 数组元素类型
 * @param allOptions 包含所有元素的数组
 * @param options 被筛选的数组
 * @param getValue 返回数组元素值的函数
 * @returns 两个数组的差集
 */
const differenceFromAllCache: any = {
  allOptions: null,
  options: null,
  res: []
};
export function differenceFromAll<T>(
  allOptions: Array<T>,
  options: Array<T>,
  getValue: (item: T) => any
): Array<T> {
  if (
    allOptions === differenceFromAllCache.allOptions &&
    options === differenceFromAllCache.options
  ) {
    return differenceFromAllCache.res;
  }
  const map = new Map(allOptions.map(item => [getValue(item), item]));
  const res = options.filter(item => !map.get(getValue(item)));
  differenceFromAllCache.allOptions = allOptions;
  differenceFromAllCache.options = options;
  differenceFromAllCache.res = res;
  return res;
}

/**
 * 基于 schema 自动提取 trackExpression
 * 可能会不准确，建议用户自己配置
 * @param schema
 * @returns
 */
export function buildTrackExpression(schema: any) {
  if (!isPlainObject(schema) && !Array.isArray(schema)) {
    return '';
  }

  const trackExpressions: Array<string> = [];
  JSONTraverse(
    schema,
    (value, key: string) => {
      if (typeof value !== 'string') {
        return;
      }

      if (key === 'name') {
        trackExpressions.push(isPureVariable(value) ? value : `\${${value}}`);
      } else if (key === 'source') {
        trackExpressions.push(value);
      } else if (
        key.endsWith('On') ||
        key === 'condition' ||
        key === 'trackExpression'
      ) {
        trackExpressions.push(
          value.startsWith('${') ? value : `<script>${value}</script>`
        );
      } else if (value.includes('$')) {
        trackExpressions.push(value);
      }
    },
    10 // 最多遍历 10 层
  );

  return trackExpressions.join('|');
}

export function evalTrackExpression(
  expression: string,
  data: Record<string, any>
) {
  if (typeof expression !== 'string') {
    return '';
  }

  const parts: Array<{
    type: 'text' | 'script';
    value: string;
  }> = [];
  while (true) {
    // 这个是自动提取的时候才会用到，用户配置不要用到这个语法
    const idx = expression.indexOf('<script>');
    if (idx === -1) {
      break;
    }
    const endIdx = expression.indexOf('</script>');
    if (endIdx === -1) {
      throw new Error(
        'Invalid trackExpression miss end script token `</script>`'
      );
    }
    if (idx) {
      parts.push({
        type: 'text',
        value: expression.substring(0, idx)
      });
    }

    parts.push({
      type: 'script',
      value: expression.substring(idx + 8, endIdx)
    });
    expression = expression.substring(endIdx + 9);
  }

  expression &&
    parts.push({
      type: 'text',
      value: expression
    });

  return parts
    .map(item => {
      if (item.type === 'text') {
        return tokenize(item.value, data);
      }

      return evalExpression(item.value, data);
    })
    .join('');
}

// 很奇怪的问题，react-json-view import 有些情况下 mod.default 才是 esModule
export function importLazyComponent(mod: any) {
  return mod.default.__esModule ? mod.default : mod;
}

export function replaceUrlParams(path: string, params: Record<string, any>) {
  if (typeof path === 'string' && /\:\w+/.test(path)) {
    return compile(path)(params);
  }

  return path;
}

export const TEST_ID_KEY: 'data-testid' = 'data-testid';

export class TestIdBuilder {
  testId?: string;

  static fast(testId: string) {
    return {
      [TEST_ID_KEY]: testId
    };
  }

  // 为空就表示没有启用testId，后续一直返回都将是空
  constructor(testId?: string) {
    this.testId = testId;
  }

  // 生成子区域的testid生成器
  getChild(childPath: string | number, data?: object) {
    if (this.testId == null) {
      return new TestIdBuilder();
    }

    return new TestIdBuilder(
      data
        ? filter(`${this.testId}-${childPath}`, data)
        : `${this.testId}-${childPath}`
    );
  }

  // 获取当前组件的testid
  getTestId(data?: object) {
    if (this.testId == null) {
      return undefined;
    }

    return {
      [TEST_ID_KEY]: data ? filter(this.testId, data) : this.testId
    };
  }

  getTestIdValue(data?: object) {
    if (this.testId == null) {
      return undefined;
    }

    return data ? filter(this.testId, data) : this.testId;
  }
}

export function supportsMjs() {
  try {
    new Function('import("")');
    return true;
  } catch (e) {
    return false;
  }
}

export function formateId(id: string) {
  if (!id) {
    return guid();
  }
  // 将className非法字符替换为短横线
  id = id.replace(/[^a-zA-Z0-9-]/g, '-');
  // 将连续的-替换为单个-
  id = id.replace(/-{2,}/g, '-');
  // 去掉首尾的-
  id = id.replace(/^-|-$/g, '');
  // 首字母不能为数字
  if (/^\d/.test(id)) {
    id = 'amis-' + id;
  }
  return id;
}

export function formateCheckThemeCss(themeCss: any, type: string) {
  if (!themeCss) {
    return {};
  }
  const className = themeCss[`${type}ClassName`] || {};
  const controlClassName = themeCss[`${type}ControlClassName`] || {};
  const defaultControlThemeCss: any = {};
  const checkedControlThemeCss: any = {};
  const defaultThemeCss: any = {};
  const checkedThemeCss: any = {};
  Object.keys(className).forEach(key => {
    if (key.includes('checked-')) {
      const newKey = key.replace('checked-', '');
      checkedThemeCss[newKey] = className[key];
    } else if (key.includes(`${type}-`)) {
      const newKey = key.replace(`${type}-`, '');
      defaultThemeCss[newKey] = className[key];
    } else {
      defaultThemeCss[key] = className[key];
    }
  });
  Object.keys(controlClassName).forEach(key => {
    if (key.includes('checked-')) {
      const newKey = key.replace('checked-', '');
      checkedControlThemeCss[newKey] = controlClassName[key];
    } else if (key.includes(`${type}-`)) {
      const newKey = key.replace(`${type}-`, '');
      defaultControlThemeCss[newKey] = controlClassName[key];
    } else {
      defaultControlThemeCss[key] = controlClassName[key];
    }
  });
  return {
    ...themeCss,
    [`${type}ControlClassName`]: defaultControlThemeCss,
    [`${type}ControlCheckedClassName`]: checkedControlThemeCss,
    [`${type}ClassName`]: defaultThemeCss,
    [`${type}CheckedClassName`]: checkedThemeCss
  };
}
