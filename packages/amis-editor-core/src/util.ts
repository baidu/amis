/**
 * @file 功能类函数集合。
 */
import {hasIcon, mapObject, utils} from 'amis';
import type {PlainObject, Schema, SchemaNode} from 'amis';
import {getGlobalData} from 'amis-theme-editor-helper';
import {isExpression, resolveVariableAndFilter} from 'amis-core';
import type {VariableItem} from 'amis-ui';
import {isObservable, reaction} from 'mobx';
import DeepDiff, {Diff} from 'deep-diff';
import assign from 'lodash/assign';
import cloneDeep from 'lodash/cloneDeep';
import isPlainObject from 'lodash/isPlainObject';
import isEqual from 'lodash/isEqual';
import isNumber from 'lodash/isNumber';
import debounce from 'lodash/debounce';

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

export let themeConfig: any = {};
export let themeOptionsData: any = {};

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

let themeUselessPropKeys: Array<string> = [];

/**
 * 把 schema 处理一下传给 Preview 去渲染
 * 给每个节点加个 $$id 这样方便编辑
 * @param obj
 */
export function JSONPipeIn(
  obj: any,
  reGenerateId = false,
  idMap: any = {}
): any {
  if (Array.isArray(obj)) {
    let flag = false; // 有必要时才去改变对象的引用
    const ret = obj.map(item => {
      const patched = JSONPipeIn(item, reGenerateId, idMap);
      if (patched !== item) {
        flag = true;
      }
      return patched;
    });
    return flag ? ret : obj;
  } else if (!isObject(obj) || obj.constructor !== Object) {
    if (typeof obj === 'string') {
      Object.keys(idMap).forEach(oldId => {
        const newId = idMap[oldId];
        obj = obj.replaceAll(oldId, newId);
      });
    }

    return obj;
  }

  let toUpdate: any = {};
  let flag = false;

  if (!obj.$$id) {
    flag = true;
    toUpdate.$$id = guid();
  }

  // 因为旧版本的 bug，导致有些存量页面，出现大量无用配置
  // 所以这里做个兼容，把这些无用的配置清理掉
  // 找特征，只有同时存在前三个属性，说明这是以前的脏数据
  if (
    themeUselessPropKeys.length > 2 &&
    obj[themeUselessPropKeys[0]] &&
    obj[themeUselessPropKeys[1]] &&
    obj[themeUselessPropKeys[2]]
  ) {
    flag = true;
    themeUselessPropKeys.forEach(key => {
      toUpdate[key] = undefined;
    });
  }

  // ['visible', 'visibleOn', 'hidden', 'hiddenOn', 'toggled'].forEach(key => {
  //   if (obj.hasOwnProperty(key)) {
  //     flag = true;
  //     toUpdate[key] = undefined;
  //     toUpdate[`$$${key}`] = obj[key];
  //   }
  // });

  if (obj.type) {
    // 处理下历史style数据，整理到themeCss
    obj = style2ThemeCss(obj);

    // 重新生成组件ID
    if (reGenerateId) {
      flag = true;

      /** 脚手架构建的Schema提前构建好了组件 ID，此时无需生成 ID，避免破坏事件动作 */
      if (
        (!obj.__origin || obj.__origin !== 'scaffold') &&
        typeof obj.id === 'string' &&
        obj.id.startsWith('u:')
      ) {
        const newId = generateNodeId();
        obj.id && (idMap[obj.id] = newId);
        toUpdate.id = newId;
      }
    }
  }

  Object.keys(obj).forEach(key => {
    let item = obj[key];
    let patched = JSONPipeIn(item, reGenerateId, idMap);

    if (patched !== item) {
      flag = true;
      toUpdate[key] = patched;
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

export function JSONGetPathById(
  json: any,
  id: string,
  idKey: string = '$$id'
): Array<string> | null {
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
  const paths = JSONGetPathById(json, id);
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
  }

  if (!isObjectShallowModified(json, target)) {
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
  const paths = JSONGetPathById(json, id);

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

// 遍历json，每层元素自动生成uid。
export function JsonGenerateID(json: any) {
  if (Object.isFrozen(json)) {
    return;
  }
  if (Array.isArray(json)) {
    json.forEach((item: any) => JsonGenerateID(item));
  }
  if (!isObject(json) || isObservable(json)) {
    return;
  }

  /** 脚手架构建的Schema提前构建好了组件 ID，此时无需生成 ID，避免破坏事件动作 */
  if (json.type && (!json.__origin || json.__origin !== 'scaffold')) {
    json.id = generateNodeId();
  }

  Object.keys(json).forEach(key => {
    let curElem = json[key];
    if (isObject(curElem) || Array.isArray(curElem)) {
      // 非对象和数组类型字段不进入递归
      JsonGenerateID(curElem);
    }
  });
}

export function createElementFromHTML(htmlString: string): HTMLElement {
  const div = document.createElement('div');
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
  }

  if (isPlainObject(schema)) {
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

      // 组件切换状态修改classname
      // TODO:切换状态暂时先不改变组件的样式
      // if (/[C|c]lassName/.test(key) && schema.editorState) {
      //   mapped[key] = mapped[key]
      //     ? mapped[key] + ' ' + schema.editorState
      //     : schema.editorState;
      //   modified = true;
      // }

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

/**
 * 因为左侧是个不可变动的对象，所以先 copy 了对应的属性，再传给 DeepDiff.applyChange
 */
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
 * @param ignore
 */
export function JSONTraverse(
  json: any,
  mapper: (value: any, key: string | number, host: Object) => any,
  ignore?: (value: any, key: string | number) => boolean | void
) {
  Object.keys(json).forEach(key => {
    const value: any = json[key];
    if (ignore?.(value, key)) {
      return;
    }
    if (isPlainObject(value) || Array.isArray(value)) {
      JSONTraverse(value, mapper, ignore);
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
  return Object.prototype.toString.call(curObj).slice(8, -1) === 'Object';
}

export function jsonToJsonSchema(
  json: any = {},
  titleBuilder?: (type: string, key: string) => string,
  maxDepth: number = 3
) {
  const jsonschema: any = {
    type: 'object',
    properties: {}
  };

  isObservable(json) ||
    maxDepth <= 0 ||
    Object.keys(json).forEach(key => {
      const value = json[key];
      const type = Array.isArray(value) ? 'array' : typeof value;

      if (~['string', 'number'].indexOf(type)) {
        jsonschema.properties[key] = {
          type,
          title: titleBuilder?.(type, key) || key
        };
      } else if (~['object', 'array'].indexOf(type) && value) {
        jsonschema.properties[key] = {
          type,
          title: titleBuilder?.(type, key) || key,
          ...(type === 'object'
            ? jsonToJsonSchema(value, titleBuilder, maxDepth - 1)
            : typeof value[0] === 'object'
            ? {items: jsonToJsonSchema(value[0], titleBuilder, maxDepth - 1)}
            : {})
        };
      } else {
        jsonschema.properties[key] = {
          type: '',
          title: titleBuilder?.(type, key) || key
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
  return !!(plugin && plugin.type === 'flex');
}

/**
 * 单位数值运算
 * 备注：支持带单位的数值进行运算
 */
export function unitFormula(insetStr: string, offsetVal: number) {
  if (insetStr === 'auto') {
    return 'auto';
  }
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
  return `${newOffsetVal}${insetUnit}`;
  // return `${newOffsetVal >= 0 ? newOffsetVal : '0'}${insetUnit}`; // 限制拖拽区域
}

/**
 * 过滤搜索字段中的特殊字符
 */
export function stringRegExp(keyword: string) {
  return keyword.replace(/[|\\{}()[\]^$+*?.]/g, '');
}

/**
 * 过滤搜索字段中的特殊字符
 */
export function needDefaultWidth(elemType: string) {
  const needDefaultWidthElemType: Array<string> = [
    'divider',
    'crud2',
    'crud',
    'list',
    'picker',
    'table',
    'table-view',
    'grid',
    'cards',
    'card',
    'form',
    'progress',
    'diff-editor',
    'editor',
    'input-range',
    'flex'
  ];
  return needDefaultWidthElemType.includes(elemType);
}

/** 是否开启应用国际化 */
export function getI18nEnabled() {
  return (window as any)?.editorStore?.i18nEnabled ?? false;
}

/** schema 翻译方法 */
export function translateSchema(schema: any, replaceData?: any, skipFn?: any) {
  replaceData = replaceData || (window as any)?.editorStore?.appCorpusData;
  if (!isPlainObject(replaceData)) {
    return schema;
  }
  return mapObject(schema, (item: any) => replaceData[item] || item, skipFn);
}

/** 应用级别的翻译方法 */
export function appTranslate(value?: string) {
  if (!isString(value)) {
    return value;
  }
  return (window as any)?.editorStore?.appCorpusData?.[value!] || value;
}

/**
 * 判断是否需要给组件增加填充占位样式
 */
export function needFillPlaceholder(curProps: any) {
  if (!curProps) {
    return false;
  }
  // 识别page中的aside、body
  if (
    curProps.rendererName === 'page' &&
    (curProps.name === 'aside' || curProps.name === 'body')
  ) {
    return true;
  }
  // 识别自由容器
  if (curProps.node?.schema?.isFreeContainer) {
    return true;
  }

  // 支持在plugin中配置
  return !!(
    curProps.$$editor?.needFillPlaceholder ||
    curProps.regionConfig?.needFillPlaceholder
  );
}

// 设置主题数据
export function setThemeConfig(config: any) {
  themeConfig = config;
  themeOptionsData = getGlobalData(themeConfig);
  themeUselessPropKeys = Object.keys(getThemeConfig());
}

// 获取主题数据和样式选择器数据
export function getThemeConfig() {
  return {themeConfig, ...themeOptionsData};
}

const backgroundMap: PlainObject = {
  'background-color': 'background'
};

/**
 * 将style转换为组件ThemeCSS格式
 *
 * @param data - 组件schema
 * @returns 处理后的数据
 */
export function style2ThemeCss(data: any) {
  if (
    !data?.style ||
    isEmpty(data.style) ||
    !['tpl', 'page', 'container', 'chart', 'flex', 'grid'].includes(data.type)
  ) {
    return data;
  }
  const style = {...data.style};
  let baseControlClassName: PlainObject = {};
  const border: PlainObject = {};
  const paddingAndMargin: PlainObject = {};
  const font: PlainObject = {};
  Object.keys(style).forEach(key => {
    if (
      ['background', 'background-color', 'radius', 'boxShadow'].includes(key)
    ) {
      baseControlClassName[(backgroundMap[key] || key) + ':default'] =
        style[key];
      delete style[key];
    } else if (
      ['color', 'fontSize', 'fontWeight', 'font-family', 'lineHeight'].includes(
        key
      )
    ) {
      font[key] = style[key];
      delete style[key];
    } else if (key.includes('border')) {
      border[key] = style[key];
      delete style[key];
    } else if (key.includes('padding') || key.includes('margin')) {
      paddingAndMargin[key] = style[key];
      delete style[key];
    }
  });
  baseControlClassName = Object.assign(
    isEmpty(baseControlClassName) ? {} : baseControlClassName,
    isEmpty(border) ? {} : {'border:default': border},
    isEmpty(paddingAndMargin)
      ? {}
      : {'padding-and-margin:default': paddingAndMargin},
    isEmpty(font) ? {} : {'font:default': font}
  );
  if (isEmpty(baseControlClassName)) {
    return data;
  }
  let themeCss = {baseControlClassName};
  if (!data.themeCss) {
    themeCss = {
      baseControlClassName
    };
  } else {
    themeCss.baseControlClassName = {
      ...data.themeCss.baseControlClassName,
      ...baseControlClassName
    };
  }
  return {
    ...data,
    style,
    themeCss
  };
}

/**
 * 从amis数据域中取变量数据
 * @param node
 * @param manager
 * @returns
 */
export async function resolveVariablesFromScope(node: any, manager: any) {
  await manager?.getContextSchemas(node);
  // 获取当前组件内相关变量，如表单、增删改查

  let variableOptions =
    (await manager?.dataSchema?.getDataPropsAsOptions()) ?? [];
  // 子编辑器内读取的host节点自定义变量，非数据域方式，如listSelect的选项值
  let hostNodeVaraibles = [];
  if (manager?.store?.isSubEditor) {
    hostNodeVaraibles =
      manager.config?.hostNode?.info?.getSubEditorVariable?.(
        manager.config?.hostNode.schema
      ) || [];

    // 获取父编辑器内组件上下文变量，与当前自编辑器进行拼接
    const hostNodeDataSchema = await manager.config.getHostNodeDataSchema();
    const hostContextVariables = (
      hostNodeDataSchema?.getDataPropsAsOptions() || []
    )
      .filter((item: any) => item.label === '组件上下文')
      .reduce((arr: any, item: any) => {
        arr.push(...(item.children || []));
        return arr;
      }, []);
    if (hostContextVariables?.length) {
      let hasContextVariables = false;
      variableOptions = variableOptions.map((item: any) => {
        if (item.label === '组件上下文' && !hasContextVariables) {
          hasContextVariables = true;
          item.children = item.children.concat(hostContextVariables);
        }
        return item;
      });

      if (!hasContextVariables) {
        variableOptions = [
          {
            label: '组件上下文',
            children: hostContextVariables
          },
          ...variableOptions
        ];
      }
    }
  }
  const dataPropsAsOptions: VariableItem[] =
    updateComponentContext(variableOptions);

  const variables: VariableItem[] =
    manager?.variableManager?.getVariableFormulaOptions() || [];

  return [...hostNodeVaraibles, ...dataPropsAsOptions, ...variables].filter(
    (item: any) => item.children?.length
  );
}

/**
 * 整合 props & amis数据域 中的 variables
 * @param that  为组件的实例 this
 **/
export async function getVariables(that: any) {
  let variablesArr: any[] = [];

  const {variables, requiredDataPropsVariables} = that.props;
  if (!variables || requiredDataPropsVariables) {
    // 从amis数据域中取变量数据
    const {node, manager} = that.props.formProps || that.props;
    let vars = await resolveVariablesFromScope(node, manager);
    if (Array.isArray(vars)) {
      if (!that.isUnmount) {
        variablesArr = vars;
      }
    }
  }
  if (variables) {
    if (Array.isArray(variables)) {
      variablesArr = [...variables, ...variablesArr];
    } else if (typeof variables === 'function') {
      variablesArr = [...variables(that), ...variablesArr];
    } else if (isExpression(variables)) {
      variablesArr = [
        ...resolveVariableAndFilter(
          that.props.variables as any,
          that.props.data,
          '| raw'
        ),
        ...variablesArr
      ];
    }
  }

  // 如果存在应用语言类型，则进行翻译
  if (that.appLocale && that.appCorpusData) {
    return translateSchema(variablesArr, that.appCorpusData);
  }

  return variablesArr;
}

/**
 * 更新组件上下文中label为带层级说明
 * @param variables 变量列表
 * @returns
 */
export const updateComponentContext = (variables: any[]) => {
  const items = [...variables];
  const idx = items.findIndex(item => item.label === '组件上下文');
  if (~idx) {
    items.splice(idx, 1, {
      ...items[idx],
      children: items[idx].children.map((child: any, index: number) => ({
        ...child,
        label:
          index === 0
            ? `当前层${child.label ? '(' + child.label + ')' : ''}`
            : `上${index}层${child.label ? '(' + child.label + ')' : ''}`
      }))
    });
  }
  return items;
};

/**
 * dom 滚动到可见区域
 * @param selector dom 选择器
 */
export const scrollToActive = debounce((selector: string) => {
  const dom = document.querySelector(selector);
  if (dom) {
    (dom as any).scrollIntoViewIfNeeded
      ? (dom as any).scrollIntoViewIfNeeded()
      : dom.scrollIntoView();
  }
}, 200);

/**
 * 获取弹窗事件
 * @param schema 遍历的schema
 * @param listType 列表形式，弹窗list或label value形式的数据源
 * @param filterId 要过滤弹窗的id
 */
export const getDialogActions = (
  schema: Schema,
  listType: 'list' | 'source',
  filterId?: string
) => {
  let dialogActions: any[] = [];
  JSONTraverse(
    schema,
    (value: any, key: string, object: any) => {
      // definitions中的弹窗
      if (key === 'type' && value === 'page') {
        const definitions = object.definitions;
        if (definitions) {
          Object.keys(definitions).forEach(key => {
            if (key.includes('ref-')) {
              if (listType === 'list') {
                dialogActions.push(definitions[key]);
              } else {
                const dialog = definitions[key];
                const dialogTypeName =
                  dialog.type === 'drawer'
                    ? '抽屉式弹窗'
                    : dialog.dialogType
                    ? '确认对话框'
                    : '弹窗';
                dialogActions.push({
                  label: `${dialog.title || '-'}（${dialogTypeName}）`,
                  value: dialog.$$id
                });
              }
            }
          });
        }
      }
      if (
        (key === 'actionType' && value === 'dialog') ||
        (key === 'actionType' && value === 'drawer') ||
        (key === 'actionType' && value === 'confirmDialog')
      ) {
        const dialogBodyMap = new Map([
          [
            'dialog',
            {
              title: '弹窗',
              body: 'dialog'
            }
          ],
          [
            'drawer',
            {
              title: '抽屉式弹窗',
              body: 'drawer'
            }
          ],
          [
            'confirmDialog',
            {
              title: '确认对话框',
              // 兼容历史args参数
              body: ['dialog', 'args']
            }
          ]
        ]);
        let dialogBody = dialogBodyMap.get(value)?.body!;
        let dialogBodyContent = Array.isArray(dialogBody)
          ? object[dialogBody[0]] || object[dialogBody[1]]
          : object[dialogBody];

        if (
          dialogBodyMap.has(value) &&
          dialogBodyContent &&
          !dialogBodyContent.$ref
        ) {
          if (listType == 'list') {
            // 没有 type: dialog的历史数据兼容一下
            dialogActions.push({
              ...dialogBodyContent,
              type: Array.isArray(dialogBody) ? 'dialog' : dialogBody
            });
          } else {
            // 新建弹窗切换到现有弹窗把自身过滤掉
            if (!filterId || (filterId && filterId !== dialogBodyContent.id)) {
              dialogActions.push({
                label: `${dialogBodyContent?.title || '-'}（${
                  dialogBodyMap.get(value)?.title
                }）`,
                value: dialogBodyContent.$$id
              });
            }
          }
        }
      }
    },
    (value, key) => key.toString().startsWith('__')
  );
  return dialogActions;
};

/**
 * 获取弹窗的类型，来源于事件或definitions,由于历史数据可能没有type: dialog,在这里兼容一下
 * @param json
 * @param previewDialogId
 */
export const getFixDialogType = (json: Schema, dialogId: string) => {
  const dialogBodyMap = {
    dialog: 'dialog',
    drawer: 'drawer',
    confirmDialog: 'dialog'
  };
  let parentSchema = JSONGetParentById(json, dialogId);
  // 事件中的弹窗
  if (parentSchema.actionType) {
    return dialogBodyMap[parentSchema.actionType as keyof typeof dialogBodyMap];
  }
  // definitions中的弹窗
  else {
    let dialogRefSchema = JSONGetById(parentSchema, dialogId);
    return dialogRefSchema.type;
  }
};
