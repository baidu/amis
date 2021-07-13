import {createObject} from './helper';
import {register as registerBulitin, getFilters} from './tpl-builtin';
import {register as registerLodash} from './tpl-lodash';

export interface Enginer {
  test: (tpl: string) => boolean;
  removeEscapeToken?: (tpl: string) => string;
  compile: (tpl: string, data: object, ...rest: Array<any>) => string;
}

const enginers: {
  [propName: string]: Enginer;
} = {};

export function registerTplEnginer(name: string, enginer: Enginer) {
  enginers[name] = enginer;
}

export function filter(
  tpl?: any,
  data: object = {},
  ...rest: Array<any>
): string {
  if (!tpl || typeof tpl !== 'string') {
    return '';
  }

  let keys = Object.keys(enginers);
  for (let i = 0, len = keys.length; i < len; i++) {
    let enginer = enginers[keys[i]];
    if (enginer.test(tpl)) {
      return enginer.compile(tpl, data, ...rest);
    } else if (enginer.removeEscapeToken) {
      tpl = enginer.removeEscapeToken(tpl);
    }
  }

  return tpl;
}

// 缓存一下提升性能
const EVAL_CACHE: {[key: string]: Function} = {};

let customEvalExpressionFn: (expression: string, data?: any) => boolean;
export function setCustomEvalExpression(
  fn: (expression: string, data?: any) => boolean
) {
  customEvalExpressionFn = fn;
}

// 几乎所有的 visibleOn requiredOn 都是通过这个方法判断出来结果，很粗暴也存在风险，建议自己实现。
// 如果想自己实现，请通过 setCustomEvalExpression 来替换。
export function evalExpression(expression: string, data?: object): boolean {
  if (typeof customEvalExpressionFn === 'function') {
    return customEvalExpressionFn(expression, data);
  }

  if (!expression || typeof expression !== 'string') {
    return false;
  }

  /* jshint evil:true */
  try {
    let debug = false;
    const idx = expression.indexOf('debugger');
    if (~idx) {
      debug = true;
      expression = expression.replace(/debugger;?/, '');
    }

    let fn;
    if (expression in EVAL_CACHE) {
      fn = EVAL_CACHE[expression];
    } else {
      fn = new Function(
        'data',
        'utils',
        `with(data) {${debug ? 'debugger;' : ''}return !!(${expression});}`
      );
      EVAL_CACHE[expression] = fn;
    }

    data = data || {};
    return fn.call(data, data, getFilters());
  } catch (e) {
    console.warn(expression, e);
    return false;
  }
}

let customEvalJsFn: (expression: string, data?: any) => any;
export function setCustomEvalJs(fn: (expression: string, data?: any) => any) {
  customEvalJsFn = fn;
}

// 这个主要用在 formula 里面，用来动态的改变某个值。也很粗暴，建议自己实现。
// 如果想自己实现，请通过 setCustomEvalJs 来替换。
export function evalJS(js: string, data: object): any {
  if (typeof customEvalJsFn === 'function') {
    return customEvalJsFn(js, data);
  }

  /* jshint evil:true */
  try {
    const fn = new Function(
      'data',
      'utils',
      `with(data) {${/^\s*return\b/.test(js) ? '' : 'return '}${js};}`
    );
    data = data || {};
    return fn.call(data, data, getFilters());
  } catch (e) {
    console.warn(js, e);
    return null;
  }
}

[registerBulitin, registerLodash].forEach(fn => {
  const info = fn();

  registerTplEnginer(info.name, {
    test: info.test,
    compile: info.compile,
    removeEscapeToken: info.removeEscapeToken
  });
});
