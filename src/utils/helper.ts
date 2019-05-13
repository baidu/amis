import isPlainObject = require('lodash/isPlainObject');
import transform = require('lodash/transform');
import isEqual = require('lodash/isEqual');
import lodashIsObject = require('lodash/isObject');
import {
    Schema, PlainObject, FunctionPropertyNames
} from '../types';
import { evalExpression } from './tpl';
import { boundMethod } from 'autobind-decorator';

// 方便取值的时候能够把上层的取到，但是获取的时候不会全部把所有的数据获取到。
export function createObject(superProps?: { [propName: string]: any }, props?: { [propName: string]: any }, properties?: any): object {
    if (superProps && Object.isFrozen(superProps)) {
        superProps = cloneObject(superProps);
    }

    const obj = superProps ? Object.create(superProps, {
        ...properties,
        '__super': {
            value: superProps,
            writable: false,
            enumerable: false
        }
    }) : Object.create(Object.prototype, properties);
    props && Object.keys(props).forEach(key => obj[key] = props[key]);
    return obj;
}

export function cloneObject(from: any) {
    const obj = from && from.__super ? Object.create(from.__super, {
        '__super': {
            value: from.__super,
            writable: false,
            enumerable: false
        }
    }) : Object.create(Object.prototype);
    from && Object.keys(from).forEach(key => obj[key] = from[key]);
    return obj;
}

export function extendObject(to: any, from?: any) {
    const obj = cloneObject(to);
    from && Object.keys(from).forEach(key => obj[key] = from[key]);
    return obj;
}

export function syncDataFromSuper(data: any, superObject: any, prevSuperObject: any, force?: boolean) {
    const obj = {
        ...data
    };

    if (superObject || prevSuperObject) {
        Object.keys(obj).forEach(key => {
            if (
                (
                    superObject && typeof superObject[key] !== "undefined"
                    || prevSuperObject && typeof prevSuperObject[key] !== "undefined"
                )

                && (
                    force
                    || prevSuperObject && !superObject
                    || !prevSuperObject && superObject
                    || prevSuperObject[key] !== superObject[key]
                )) {

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

export function findIndex(arr: Array<any>, detect: (item?: any, index?: number) => boolean) {
    for (let i = 0, len = arr.length; i < len; i++) {
        if (detect(arr[i], i)) {
            return i;
        }
    }

    return -1;
}

export function getVariable(data: { [propName: string]: any }, key: string, canAccessSuper: boolean = true): any {
    if (!data || !key) {
        return undefined;
    } else if (canAccessSuper ? key in data : data.hasOwnProperty(key)) {
        return data[key];
    }

    return key.split('.')
        .reduce(
            (obj, key) => obj && typeof obj === 'object' && (canAccessSuper ? key in obj : obj.hasOwnProperty(key)) ? obj[key] : undefined
            , data
        );
}

export function setVariable(data: { [propName: string]: any }, key: string, value: any) {
    data = data || {};

    if (key in data) {
        data[key] = value;
        return;
    }


    const parts = key.split('.');
    const last = parts.pop() as string;

    while (parts.length) {
        let key = parts.shift() as string;
        if (isPlainObject(data[key])) {
            data = data[key] = {
                ...data[key]
            };
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

export function deleteVariable(data: { [propName: string]: any }, key: string) {
    if (!data) {
        return;
    } else if (data.hasOwnProperty(key)) {
        delete data[key];
        return;
    }



    const parts = key.split('.');
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

export function hasOwnProperty(data: { [propName: string]: any }, key: string): boolean {
    const parts = key.split('.');

    while (parts.length) {
        let key = parts.shift() as string;
        if (!isObject(data) || !data.hasOwnProperty(key)) {
            return false;
        }

        data = data[key];
    }

    return true;
}

export function noop() { }

export function anyChanged(attrs: string | Array<string>, from: { [propName: string]: any }, to: { [propName: string]: any }, strictMode: boolean = true): boolean {
    return (typeof attrs === 'string' ? attrs.split(/\s*,\s*/) : attrs).some(key => strictMode ? from[key] !== to[key] : from[key] != to[key]);
}

export function rmUndefined(obj: PlainObject) {
    const newObj: PlainObject = {};

    if (typeof obj !== "object") {
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

export function isObjectShallowModified(prev: any, next: any, strictMode: boolean = true, ignoreUndefined: boolean = false) {
    if (null == prev || null == next || typeof prev !== "object" || typeof next !== "object") {
        return strictMode ? prev !== next : prev != next;
    }

    if (ignoreUndefined) {
        prev = rmUndefined(prev);
        next = rmUndefined(next);
    }

    const keys = Object.keys(prev);
    const nextKeys = Object.keys(next);
    if (keys.length !== nextKeys.length || keys.join(',') !== nextKeys.join(',')) {
        return true;
    }
    for (let i: number = keys.length - 1; i >= 0; i--) {
        let key = keys[i];
        if (strictMode ? next[key] !== prev[key] : isObjectShallowModified(next[key], prev[key], false, ignoreUndefined)) {
            return true;
        }
    }
    return false;
}

export function isArrayChilrenModified(prev: Array<any>, next: Array<any>, strictMode: boolean = true) {
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

// 即将抛弃
export function makeColumnClassBuild(steps: number, classNameTpl:string = "col-sm-$value") {
    let count = 12;
    let step = Math.floor(count / steps);

    return function (schema: Schema) {
        if (schema.columnClassName && /\bcol-(?:xs|sm|md|lg)-(\d+)\b/.test(schema.columnClassName)) {
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
        return classNameTpl.replace("$value", '' + step);
    }
}

export function isVisible(schema: {
    visibleOn?: string;
    hiddenOn?: string;
    visible?: boolean;
    hidden?: boolean;
}, data?: object) {
    return !(
        schema.hidden
        || schema.visible === false
        || schema.hiddenOn && evalExpression(schema.hiddenOn, data) === true
        || schema.visibleOn && evalExpression(schema.visibleOn, data) === false
    )
}

export function isDisabled(schema: {
    disabledOn?: string;
    disabled?: string;
}, data?: object) {
    return schema.disabled || schema.disabledOn && evalExpression(schema.disabledOn, data);
}

export function makeHorizontalDeeper(horizontal: {
    left: string;
    right: string;
    offset: string;
    leftFixed?: any;
}, count: number): {
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

export function promisify<T extends Function>(fn: T): ((...args: Array<any>) => Promise<any> & {
    raw: T
}) {
    let promisified = function () {
        try {
            const ret = fn.apply(null, arguments);
            if (ret && ret.then) {
                return ret;
            } else if (typeof ret === 'function') {
                // thunk support
                return new Promise((resolve, reject) => ret((error: boolean, value: any) => error ? reject(error) : resolve(value)));
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
    const text = style.getPropertyValue('overflow') + style.getPropertyValue('overflow-x') + style.getPropertyValue('overflow-y');

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
export function difference<T extends { [propName: string]: any }, U extends { [propName: string]: any }>(object: T, base: U): { [propName: string]: any } {
    function changes(object: T, base: U) {
        return transform(object, function (result, value, key) {
            if (!isEqual(value, base[key])) {
                result[key] = (lodashIsObject(value) && lodashIsObject(base[key])) ? changes(value, base[key]) : value;
            }
        });
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
    return obj && typename !== 'string' && typename !== 'number' && typename !== 'boolean' && typename !== 'function' && !Array.isArray(obj);
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

    if (window.matchMedia) {
        return breaks.some(item =>
            item === '*'
            || item === 'xs' && matchMedia(`screen and (max-width: 767px)`).matches
            || item === 'sm' && matchMedia(`screen and (min-width: 768px) and (max-width: 991px)`).matches
            || item === 'md' && matchMedia(`screen and (min-width: 992px) and (max-width: 1199px)`).matches
            || item === 'lg' && matchMedia(`screen and (min-width: 1200px)`).matches
        );
    } else {
        const width = window.innerWidth;
        return breaks.some(item =>
            item === '*'
            || item === 'xs' && width < 768
            || item === 'sm' && width >= 768 && width < 992
            || item === 'md' && width >= 992 && width < 1200
            || item === 'lg' && width >= 1200
        );
    }
}

export function until(fn: () => Promise<any>, when: (ret: any) => boolean, getCanceler: (fn: () => any) => void, interval: number = 5000) {
    let timer: NodeJS.Timer;
    let stoped: boolean = false;

    return new Promise((resolve, reject) => {
        let cancel = () => {
            clearTimeout(timer);
            stoped = true;
        };

        let check = async () => {
            const ret = await fn();

            if (stoped) {
                return;
            } else if (when(ret)) {
                stoped = true;
                resolve(ret);
            } else {
                timer = setTimeout(check, interval);
            }
        }

        check();
        getCanceler && getCanceler(cancel);
    });
}

export function omitControls(controls: Array<any>, omitItems: Array<string>): Array<any> {
    return controls.filter(control => !~omitItems.indexOf(control.name || control._name));
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
}

export interface TreeItem {
    children?: TreeArray;
    [propName: string]: any;
};
export interface TreeArray extends Array<TreeItem> { };

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
export function mapTree<T extends TreeItem>(tree: Array<T>, iterator: (item: T, key: number, level: number, paths: Array<T>) => T, level: number = 1, depthFirst: boolean = false, paths: Array<T> = []) {
    return tree.map((item: any, index) => {
        if (depthFirst) {
            let children: TreeArray | undefined = item.children ? mapTree(item.children, iterator, level + 1, depthFirst, paths.concat(item)) : undefined;
            children && (item = { ...item, children: children });
            item = iterator(item, index, level, paths) || { ...item as object };
            return item;
        }

        item = iterator(item, index, level, paths) || { ...item as object };

        if (item.children && Array.isArray(item.children)) {
            item.children = mapTree(item.children, iterator, level + 1, depthFirst, paths.concat(item));
        }

        return item;
    });
}

export function eachTree<T extends TreeItem>(tree: Array<T>, iterator: (item: T, key: number, level: number) => void, level: number = 1) {
    return tree.map((item, index) => {
        iterator(item, index, level)

        if (item.children && Array.isArray(item.children)) {
            eachTree(item.children, iterator, level + 1);
        }
    });
}

export function filterTree<T extends TreeItem>(tree: Array<T>, iterator: (item: T, key: number, level: number) => boolean, level: number = 1) {
    return tree.filter((item, index) => {
        if (!iterator(item, index, level)) {
            return false;
        }

        if (item.children && Array.isArray(item.children)) {
            item.children = filterTree(item.children, iterator, level + 1);
        }

        return true;
    });
}

export function someTree<T extends TreeItem>(tree: Array<T>, iterator: (item: T, key: number, level: number) => boolean, level: number = 1):boolean {
    return tree.some((item, index) => {
        const value:any = iterator(item, index, level);

        if (!value && item.children && Array.isArray(item.children)) {
            return someTree(item.children, iterator, level + 1);
        }

        return value;
    });
}

export function flattenTree<T extends TreeItem>(tree: Array<T>): Array<T> {
    let flattened: Array<T> = [];
    eachTree(tree, item => flattened.push(item));
    return flattened;
}

export function ucFirst(str?:string) {
    return str ? (str.substring(0, 1).toUpperCase() + str.substring(1)) : '';
}

export function lcFirst(str?:string) {
    return str ? (str.substring(0, 1).toLowerCase() + str.substring(1)) : '';
}

export function camel(str?:string) {
    return str ? str.split(/[\s_\-]/).map((item, index) => index === 0 ? lcFirst(item) : ucFirst(item)).join('') : '';
}

export function getWidthRate(value:any):number {
    if (typeof value === "string" && /\bcol\-\w+\-(\d+)\b/.test(value)) {
        return parseInt(RegExp.$1, 10);
    }

    return value || 0;
}

export function getLevelFromClassName(value:string, defaultValue: string = 'default') {
    if (/\b(?:btn|text)-(link|primary|secondary|info|success|warning|danger|light|dark)\b/.test(value)) {
        return RegExp.$1;
    }

    return defaultValue;
}

export function pickEventsProps(props:any) {
    const ret:any = {};
    props && Object.keys(props).forEach(key => /^on/.test(key) && (ret[key] = props[key]));
    return ret;
}

export const autobind = boundMethod;


export const bulkBindFunctions = function<T extends {
    [propName:string]: any
}>(context:T, funNames:Array<FunctionPropertyNames<T>>) {
    funNames.forEach(key => context[key] = context[key].bind(context));
}

export function sortArray<T extends any>(items:Array<T>, field:string, dir: -1 | 1):Array<T> {
    return items.sort((a, b) => {
        let ret: number;
        const a1 = a[field];
        const b1 = b[field];

        if (typeof a1 === 'number' && typeof b1 === 'number') {
            ret = a1 < b1 ? -1 : a1 === b1 ? 0 : 1;
        } else {
            ret = String(a1).localeCompare(String(b1));
        }

        return ret * dir;
    })
}