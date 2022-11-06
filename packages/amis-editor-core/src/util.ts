/**
 * @file 功能类函数集合。
 */
import {utils, hasIcon} from 'amis';
import isEqual from 'lodash/isEqual';
import {isObservable, reaction} from 'mobx';
import DeepDiff, {Diff} from 'deep-diff';
import isPlainObject from 'lodash/isPlainObject';
import isNumber from 'lodash/isNumber';
import type {Schema} from 'amis/lib/types';
import {SchemaObject} from 'amis/lib/Schema';

const {
  guid,
  omitControls,
  isObjectShallowModified,
  // isObject,
  cloneObject,
  anyChanged,
  noop,
  makeHorizontalDeeper,
  findIndex,
  isEmpty,
  eachTree,
  createObject
} = utils;

export {
  guid,
  isObjectShallowModified,
  // isObject,
  anyChanged,
  noop,
  makeHorizontalDeeper,
  omitControls,
  isEmpty,
  cloneObject,
  eachTree,
  createObject
};

export function __uri(id: string) {
  return id;
}

export function cleanUndefined(obj: any) {
  if (!isObject(obj)) {
    return obj;
  }

  Object.keys(obj).forEach((key: string) => {
    const prop = obj[key];
    if (typeof prop === 'undefined') {
      delete obj[key];
    }
  });

  return obj;
}

/**
 * 把 schema 处理一下传给 Preview 去渲染
 * 给每个节点加个 $$id 这样方便编辑
 * @param obj
 */
export function JSONPipeIn(obj: any): any {
  if (!isObject(obj) || obj.$$typeof) {
    return obj;
  } else if (Array.isArray(obj)) {
    return obj.map(JSONPipeIn);
  }

  let toUpdate: any = {};
  let flag = false;

  if (!obj.$$id) {
    flag = true;
    toUpdate.$$id = guid();
  }

  // ['visible', 'visibleOn', 'hidden', 'hiddenOn', 'toggled'].forEach(key => {
  //   if (obj.hasOwnProperty(key)) {
  //     flag = true;
  //     toUpdate[key] = undefined;
  //     toUpdate[`$$${key}`] = obj[key];
  //   }
  // });

  Object.keys(obj).forEach(key => {
    let prop = obj[key];

    if (Array.isArray(prop)) {
      // 如果没有修改过还是用原来的对象
      // 为了方便上层diff。
      let flag2 = false;

      let patched = prop.map((item: any) => {
        let patched = JSONPipeIn(item);

        if (patched !== item) {
          flag2 = true;
        }

        return patched;
      });

      if (flag2) {
        flag = true;
        toUpdate[key] = patched;
      }
    } else {
      let patched = JSONPipeIn(prop);

      if (patched !== prop) {
        flag = true;
        toUpdate[key] = patched;
      }
    }
  });

  if (flag) {
    obj = cleanUndefined({
      ...obj,
      ...toUpdate
    });
  }

  return obj;
}

// 将 json 去掉每层的 $$id，
// 同时可以选择性的去掉一些隐藏属性。
export function JSONPipeOut(
  obj: any,
  filterHiddenProps?: boolean | ((key: string, prop: any) => boolean)
) {
  if (Array.isArray(obj)) {
    let flag = false; // 有必要时才去改变对象的引用
    const ret: any = obj.map((item: any) => {
      const newItem = JSONPipeOut(item, filterHiddenProps);

      if (newItem !== item) {
        flag = true;
      }

      return newItem;
    });
    return flag ? ret : obj;
  }
  if (!isObject(obj) || isObservable(obj)) {
    return obj;
  }

  let flag = false;
  let toUpdate: any = {};

  if (obj.$$id) {
    flag = true;
    toUpdate.$$id = undefined;
  }

  // idOnly ||
  //   ['visible', 'visibleOn', 'hidden', 'hiddenOn', 'toggled'].forEach(key => {
  //     if (obj.hasOwnProperty(`$$${key}`)) {
  //       flag = true;
  //       toUpdate[`$$${key}`] = undefined;
  //       toUpdate[key] = obj[`$$${key}`];
  //     }
  //   });

  Object.keys(obj).forEach(key => {
    let prop = obj[key];

    if (
      typeof filterHiddenProps === 'function'
        ? filterHiddenProps(key, prop)
        : filterHiddenProps !== false && key.substring(0, 2) === '__'
    ) {
      toUpdate[key] = undefined;
      flag = true;
      return;
    }

    let patched = JSONPipeOut(prop, filterHiddenProps);
    if (patched !== prop) {
      flag = true;
      toUpdate[key] = patched;
    }
  });

  flag &&
    (obj = cleanUndefined({
      ...obj,
      ...toUpdate
    }));

  return obj;
}

export function JSONGetByPath(
  json: any,
  paths: Array<string>,
  stacks?: Array<any>
) {
  let target = json;
  stacks && stacks.push(json);
  paths.forEach(key => {
    target = target[key];
    stacks && stacks.push(target);
  });
  return target;
}

export function JSONGetPathById(json: any, id: string, idKey: string = '$$id'): Array<string> | null {
  let paths: Array<string> = [];
  let resolved: boolean = false;
  let stack: Array<any> = [
    {
      path: '.',
      data: json
    }
  ];

  while (stack.length) {
    let cur = stack.shift();
    let data = cur.data;
    let path = cur.path;

    if (data[idKey] === id) {
      resolved = true;
      paths = path.split('.').filter((item: any) => item);
      break;
    }

    Object.keys(data).forEach(key => {
      let prop = data[key];

      if (Array.isArray(prop)) {
        prop.forEach((item, index) => {
          if (isObject(item)) {
            stack.push({
              data: item,
              path: `${path}.${key}.${index}`
            });
          }
        });
      } else if (isObject(prop)) {
        stack.push({
          data: prop,
          path: `${path}.${key}`
        });
      }
    });
  }

  return resolved ? paths : null;
}

export function JSONGetById(json: any, id: string, idKey?: string): any {
  let paths = JSONGetPathById(json, id, idKey);
  if (paths === null) {
    return null;
  }

  return JSONGetByPath(json, paths);
}

export function JSONGetParentById(
  json: any,
  id: string,
  skipArray: boolean = false
): any {
  let paths = JSONGetPathById(json, id);
  if (paths === null || !paths.length) {
    return null;
  }

  let target = json;
  let targets: Array<any> = [target];
  paths.pop();
  paths.forEach(key => {
    target = target[key];
    targets.unshift(target);
  });

  while (skipArray && Array.isArray(targets[0])) {
    targets.shift();
  }

  return targets[0];
}

export function JSONUpdate(
  json: any,
  id: string,
  value: any,
  replace: boolean = false
): any {
  let paths = JSONGetPathById(json, id);

  if (paths === null) {
    return json;
  }

  let changes: Array<any> = [];
  let target = JSONGetByPath(json, paths, changes);

  // 把节点替换成数组的情况
  if (
    Array.isArray(value) &&
    changes[changes.length - 2] &&
    Array.isArray(changes[changes.length - 2])
  ) {
    const idx = changes[changes.length - 2].indexOf(
      changes[changes.length - 1]
    );
    changes[changes.length - 2] = changes[changes.length - 2].concat();
    changes[changes.length - 2].splice.apply(
      changes[changes.length - 2],
      [idx, 1].concat(value)
    );
    changes.pop();
  } else {
    changes[changes.length - 1] = target = {
      ...(replace ? null : target),
      ...value,
      $$id: id
    };
  }

  // 改变被修改节点的祖先节点引用
  while (changes.length > 1) {
    let cur = changes.pop();

    if (Array.isArray(changes[changes.length - 1])) {
      changes[changes.length - 1] = changes[changes.length - 1].concat();
    } else {
      changes[changes.length - 1] = {
        ...changes[changes.length - 1]
      };
    }

    changes[changes.length - 1][paths[changes.length - 1]] = cur;
  }

  return changes[0];
}

export function JSONDelete(
  json: any,
  id: string,
  pathsRef?: Array<string>,
  deleteIfEmpty?: boolean
) {
  let paths = JSONGetPathById(json, id);

  if (paths === null) {
    return json;
  }

  if (Array.isArray(pathsRef)) {
    pathsRef.push.apply(pathsRef, paths);
  }

  let key: string = paths.pop() as string;
  let changes: Array<any> = [];
  let target = JSONGetByPath(json, paths, changes);

  if (Array.isArray(target)) {
    changes[changes.length - 1] = target = target.concat();
    target.splice(key, 1);

    if (deleteIfEmpty && !target.length) {
      changes[changes.length - 1] = undefined;
    }
  } else {
    changes[changes.length - 1] = target = {
      ...target
    };
    delete target[key];
  }

  // 改变被修改节点的祖先节点引用
  while (changes.length > 1) {
    let cur = changes.pop();

    if (Array.isArray(changes[changes.length - 1])) {
      changes[changes.length - 1] = changes[changes.length - 1].concat();
    } else {
      changes[changes.length - 1] = {
        ...changes[changes.length - 1]
      };
    }

    if (cur === void 0) {
      delete changes[changes.length - 1][paths[changes.length - 1]];
    } else {
      changes[changes.length - 1][paths[changes.length - 1]] = cur;
    }
  }

  return changes[0];
}

export function JSONMerge(json: any, target: any) {
  if (!isObject(json) || !isObject(target)) {
    return target;
  } else if (!isObjectShallowModified(json, target)) {
    return json;
  }

  let ret: any = {};

  json.$$id && (ret.$$id = json.$$id);
  Object.keys(target).forEach(key => {
    if (
      Array.isArray(target[key]) &&
      Array.isArray(json[key]) &&
      target[key] !== json[key]
    ) {
      ret[key] = target[key].map((item: any, index: number) => {
        return json[key][index] ? JSONMerge(json[key][index], item) : item;
      });
    } else if (typeof json[key] === 'undefined') {
      ret[key] = target[key];
    } else {
      ret[key] = JSONMerge(json[key], target[key]);
    }
  });

  return ret;
}

export function JSONChangeInArray(
  json: any,
  id: string,
  operation: (arr: Array<any>, node: any, index: number) => void
) {
  let paths = JSONGetPathById(json, id);

  if (paths === null) {
    return json;
  }

  let key: number = parseInt(paths.pop() as string, 10);
  let changes: Array<any> = [];
  let target = JSONGetByPath(json, paths, changes);

  if (Array.isArray(target)) {
    changes[changes.length - 1] = target = target.concat();
    let node = target[key];
    operation(target, node, key);
  } else {
    return json;
  }

  while (changes.length > 1) {
    let cur = changes.pop();

    if (Array.isArray(changes[changes.length - 1])) {
      changes[changes.length - 1] = changes[changes.length - 1].concat();
    } else {
      changes[changes.length - 1] = {
        ...changes[changes.length - 1]
      };
    }

    changes[changes.length - 1][paths[changes.length - 1]] = cur;
  }

  return changes[0];
}

export function JSONCanMoveUp(json: any, id: string) {
  const parent = JSONGetParentById(json, id);

  if (!parent || !Array.isArray(parent)) {
    return false;
  }

  const idx = findIndex(parent, item => item.$$id === id);
  return idx > 0;
}

export function JSONMoveUpById(json: any, id: string) {
  return JSONChangeInArray(json, id, (arr: any[], node: any, index: number) => {
    if (index === 0) {
      return;
    }
    arr.splice(index, 1);
    arr.splice(index - 1, 0, node);
  });
}

export function JSONCanMoveDown(json: any, id: string) {
  const parent = JSONGetParentById(json, id);

  if (!parent || !Array.isArray(parent)) {
    return false;
  }

  const idx = findIndex(parent, item => item.$$id === id);
  return ~idx && idx < parent.length - 1;
}

export function JSONMoveDownById(json: any, id: string) {
  return JSONChangeInArray(json, id, (arr: any[], node: any, index: number) => {
    if (index === arr.length - 1) {
      return;
    }

    arr.splice(index, 1);
    arr.splice(index + 1, 0, node);
  });
}

export function JSONDuplicate(
  json: any,
  id: string,
  // 有时候复制时因为局部会有事件动作等内容，需要改为复制部分的新id，这里把老id与新id的关系存下来
  reIds: {[propKey: string]: string} = {}
) {
  return JSONChangeInArray(json, id, (arr: any[], node: any, index: number) => {
    const copy = JSONPipeIn(JSONPipeOut(node));
    arr.splice(index + 1, 0, reGenerateID(copy, reIds));
  });
}

/**
 * 用于复制或粘贴的时候重新生成
 * @param json
 */
export function reGenerateID(
  json: any,
  // 有时候复制时因为局部会有事件动作等内容，需要改为复制部分的新id，这里把老id与新id的关系存下来
  reIds: {[propKey: string]: string} = {}
) {
  JSONTraverse(json, (value: any, key: string, host: any) => {
    const isNodeIdFormat =
      typeof value === 'string' && value.indexOf('u:') === 0;
    if (key === 'id' && isNodeIdFormat && host) {
      const newID = generateNodeId();
      reIds[host.id] = newID;
      host.id = newID;
    }
    // 组件ID，给新的id内容
    else if (key === 'componentId' && isNodeIdFormat) {
      host.componentId = reIds[value] ?? value;
    }

    return value;
  });
  return json;
}

export function createElementFromHTML(htmlString: string): HTMLElement {
  var div = document.createElement('div');
  // bca-disable-next-line
  div.innerHTML = htmlString.trim();

  // Change this to div.childNodes to support multiple top-level nodes
  return div.firstChild as HTMLElement;
}

export function deepFind(schema: any, keyValue: any, result: any = {}): any {
  if (schema?.$$commonSchema === keyValue) {
    result[keyValue] = schema;
  } else if (isPlainObject(schema)) {
    Object.keys(schema).forEach(key => {
      const value = schema[key];
      deepFind(value, keyValue, result);
    });
  } else if (Array.isArray(schema)) {
    schema.map(item => deepFind(item, keyValue, result));
  }
  return result;
}

/**
 * 处理一下schema的$$commonSchema
 * @param schema
 * @valueWithConfig 带commonConfig 配置项的schema
 */
export function filterSchemaForConfig(schema: any, valueWithConfig?: any): any {
  if (Array.isArray(schema)) {
    return schema.map(item => filterSchemaForConfig(item, valueWithConfig));
  } else if (isPlainObject(schema)) {
    let mapped: any = {};
    let modified = false;

    Object.keys(schema).forEach(key => {
      const value = schema[key];
      const filtered = filterSchemaForConfig(value, valueWithConfig);

      if (schema.$$commonSchema) {
        mapped[key] && (mapped[key] = filtered);
      } else {
        mapped[key] = filtered;
      }
      if (filtered !== value) {
        modified = true;
      }

      if (key === '$$commonSchema' && !valueWithConfig) {
        schema = mapped = {$$commonSchema: value};
      } else if (key === '$$commonSchema' && valueWithConfig) {
        let config: any = deepFind(valueWithConfig, value);
        config[value] &&
          (schema = mapped =
            {
              ...config[value]
            });
      }
    });
    return modified ? mapped : schema;
  }

  return schema;
}

/**
 * 给编辑器前处理一下，把 visibleOn, hiddenOn 什么的处理掉，要不没办法编辑。
 * @param schema
 */
export function filterSchemaForEditor(schema: any): any {
  if (Array.isArray(schema)) {
    return schema.map(item => filterSchemaForEditor(item));
  } else if (isPlainObject(schema)) {
    const mapped: any = {};
    let modified = false;

    Object.keys(schema).forEach(key => {
      const value = schema[key];
      if (
        ~['visible', 'visibleOn', 'hidden', 'hiddenOn', 'toggled'].indexOf(key)
      ) {
        key = `$$${key}`;
        modified = true;
      }
      const filtered = filterSchemaForEditor(value);
      mapped[key] = filtered;

      if (filtered !== value) {
        modified = true;
      }
    });
    return modified ? mapped : schema;
  }

  return schema;
}

export function blackList(list: Array<string>) {
  return (str: string) => !~list.indexOf(str);
}

export function sortByList(list: Array<string>, attr: string | Function) {
  let getter = attr
    ? typeof attr === 'function'
      ? attr
      : (item: any) => item[attr]
    : (item: any) => item;

  return (a: any, b: any) => {
    let left = list.indexOf(getter(a));
    let right = list.indexOf(getter(b));

    left = ~left ? left : 999999;
    right = ~right ? right : 999999;

    return left > right ? 1 : left === right ? 0 : -1;
  };
}

export function persistGet(key: string, defaultValue?: any): any {
  let value: any = localStorage.getItem(`amis-editor-${key}`);

  if (value) {
    value = JSON.parse(value);
  }

  return value || defaultValue;
}

export function persistSet(key: string, value: any) {
  value = JSON.stringify(value);
  localStorage.setItem(`amis-editor-${key}`, value);
}

export function normalizeId(id: string) {
  return id.replace(/\-[a-z0-9]+$/g, '');
}

export const autobind = utils.autobind;

export function addDragingClass(el: HTMLElement) {
  while (el) {
    el.classList.add('ae-is-draging');

    el = el.parentElement as HTMLElement;

    if (el?.hasAttribute('data-region')) {
      break;
    }
  }
}

export function removeDragingClass(el: HTMLElement) {
  while (el) {
    el.classList.remove('ae-is-draging');

    el = el.parentElement as HTMLElement;

    if (el?.hasAttribute('data-region')) {
      break;
    }
  }
}

export function camelize(str: string) {
  return str.replace(/\W+(.)/g, function (match, chr) {
    return chr.toUpperCase();
  });
}

export const reactionWithOldValue = <T>(
  expression: () => T,
  effect: (newValue: T, oldValue?: T) => void
) => {
  let oldValue: T;
  return reaction(expression, v => {
    if (!isEqual(v, oldValue)) {
      effect(v, oldValue);
      oldValue = v;
    }
  });
};

export function repeatArray<T>(child: T, count: number = 1): Array<T> {
  const arr: Array<T> = [];

  while (count-- > 0) {
    arr.push(child);
  }

  return arr;
}

export type DiffChange = Diff<any, any>;

export function diff(
  left: any,
  right: any,
  prefilter?: (currentPath: Array<string>, key: string) => boolean
): Array<DiffChange> | undefined {
  return DeepDiff.diff(left, right, prefilter);
}

export function patchDiff(left: any, changes: Array<DiffChange> | undefined) {
  if (!changes) {
    return left;
  }

  return changes.reduce(
    (target: any, change: DiffChange) => applyChange(target, left, change),
    left
  );
}

function applyChange(target: any, source: any, change: DiffChange) {
  if (target && Array.isArray(change?.path)) {
    target = target === source ? {...target} : target;

    const path = change.path.concat();

    if (change.kind !== 'A') {
      path.pop();
    }

    path.reduce(
      ({target, source}, key) => {
        const nextSource = source[key];
        let nextTarget = target[key];

        if (nextSource === nextTarget) {
          nextTarget = Array.isArray(nextTarget)
            ? nextTarget.concat()
            : {...nextTarget};
          target[key] = nextTarget;
        }

        return {
          source: nextSource,
          target: nextTarget
        };
      },
      {
        target,
        source
      }
    );

    DeepDiff.applyChange(target, source, change);
  }

  return target;
}

/**
 * 遍历 schema
 * @param json
 * @param mapper
 */
export function JSONTraverse(
  json: any,
  mapper: (value: any, key: string | number, host: Object) => any
) {
  Object.keys(json).forEach(key => {
    const value: any = json[key];
    if (isPlainObject(value) || Array.isArray(value)) {
      JSONTraverse(value, mapper);
    } else {
      mapper(value, key, json);
    }
  });
}

export type PanelSchemaObject = Schema;

/**
 * 判断输入内容是否为数字格式
 */
export const isNumeric = (value: any) => {
  return isNumber(value) || !isNaN(parseFloat(String(value).toString()));
};

export const string2CSSUnit = (value: any, unit: string = 'px') => {
  return value
    ? isNumeric(value)
      ? `${parseFloat(String(value).toString())}${unit}`
      : value
    : undefined;
};

// 判断是否是字符串类型
export function isString(obj: any) {
  return Object.prototype.toString.call(obj).slice(8, -1) === 'String';
}

/**
 *  判断是否是对象类型
 * */
export function isObject(curObj: any) {
  let isObject = false;
  if (Object.prototype.toString.call(curObj).slice(8, -1) === 'Object') {
    isObject = true;
  }
  return isObject;
}

export function jsonToJsonSchema(json: any = {}) {
  const jsonschema: any = {
    type: 'object',
    properties: {}
  };
  Object.keys(json).forEach(key => {
    const value = json[key];
    const type = typeof value;

    if (~['string', 'number'].indexOf(type)) {
      jsonschema.properties[key] = {
        type: type,
        title: key
      };
    } else if (type === 'object' && value) {
      jsonschema.properties[key] = {
        type: 'object',
        title: key
      };
    } else {
      jsonschema.properties[key] = {
        type: '',
        title: key
      };
    }
  });
  return jsonschema;
}

/**
 * 生成节点id
 */
export function generateNodeId() {
  return 'u:' + guid();
}

// 是否使用 plugin 自带的 svg 版 icon
export function isHasPluginIcon(plugin: any) {
  return plugin.pluginIcon && hasIcon(plugin.pluginIcon);
}

/**
 * 判断是否是布局容器类组件
 * 备注：当前只有一个flex布局容器
 */
export function isLayoutPlugin(plugin: any) {
  if (plugin && plugin.type === 'flex') {
    return true;
  }
  return false;
}

/**
 * 单位数值运算
 * 备注：支持带单位的数值进行运算
 */
export function unitFormula(insetStr: string, offsetVal: number) {
  const insetNum = parseInt(insetStr);
  let curOffsetVal = offsetVal;
  if (!isNumber(offsetVal)) {
    curOffsetVal = parseInt(offsetVal);
  }
  let insetUnit = insetStr.substring(insetNum.toString().length);
  if (!insetUnit) {
    insetUnit = 'px';
  }
  const newOffsetVal = insetNum + curOffsetVal;
  return `${newOffsetVal >= 0 ? newOffsetVal : '0'}${insetUnit}`;
}