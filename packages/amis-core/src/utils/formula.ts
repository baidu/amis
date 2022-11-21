import isObjectByLodash from 'lodash/isObject';
import isString from 'lodash/isString';
import isBoolean from 'lodash/isBoolean';
import {evaluate} from 'amis-formula';

import {filter} from './tpl';
import {getFilters, resolveVariableAndFilter} from './tpl-builtin';
import {collectVariables} from './grammar';
import {getVariable} from './getVariable';

/**
 * formulaExec 运算器：根据当前字符串类型执行对应运算，也可按指定执行模式执行运算
 *
 * 运算模式（execMode）支持以下取值:
 * 1. tpl: 按模板字符串执行（JavaScript 模板引擎），比如：Hello ${amisUser.email}、<h1>Hello</h1>, <span>${amisUser.email}</span>；
 *    备注: 在模板中可以自由访问变量，详细请见：https://www.lodashjs.com/docs/lodash.template；
 * 2. formula: 按新版公式表达式执行，用于执行 ${ xxx } 格式的表达式；
 *    支持从window、localStorage、sessionStorage获取数据，比如：${num1 + 2}、${ls:env}、${window:document}、${window:document.URL}、${amisUser.email}；
 *    详细请见：https://aisuda.bce.baidu.com/amis/zh-CN/docs/concepts/data-mapping#namespace
 * 3. evalFormula: 按新版公式表达式执行，用于执行 ${ xxx } 和 非${ xxx } 格式的表达式（evalMode 为 true，不用 ${} 包裹也可以执行），功能同 formula 运算模式；
 * 4. js: 按Javascript执行，表达式中可以通过data.xxx来获取指定数据，并且支持简单运算；
 *    比如：data.num1 + 2、this.num1 + 2、num1 + 2；（备注：三个表达式是等价的，这里的 this 就是 data。）
 * 5. var: 以此字符串作为key值从当前数据域data中获取数值；性能最高（运行期间不会生成ast和表达式运算）；
 * 6. true 或者 false: 当execMode设置为true时，不用 ${} 包裹也可以执行表达式；
 * 7. collect: 用于从表达式中获取所有变量；
 *
 * 备注1: 用户也可以使用 registerFormulaExec 注册一个自定义运算器；
 * 备注2: 模板字符串 和 Javascript 模板引擎 不可以交叉使用；
 * 备注3: amis 现有的 evalFormula 方法，可执行 ${} 格式类表达式，但不支持 filter 过滤器，所以这里用 resolveValueByName 实现；
 * 备注4: 后续可考虑将 amis现有的运算器都放这里管理，充当统一的运算器入口。
 */

// 缓存，用于提升性能
const FORMULA_EVAL_CACHE: {[key: string]: Function} = {};

/**
 * 用于存储当前可用运算器，默认支持 tpl、formula、js、var 四种类型运算器
 * 备注：在这里统一参数。
 */
export const FormulaExec: {
  [key: string]: Function;
} = {
  tpl: (expression: string, data?: object) => {
    const curData = data || {};
    return filter(expression, curData);
  },
  formula: (expression: string, data?: object) => {
    // 邮箱格式直接返回，后续需要在 amis-formula 中处理
    if (
      /^\$\{([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})\}$/.test(
        expression
      )
    ) {
      return expression.substring(2, expression.length - 1); // 剔除前后特殊字符
    }
    const curData = data || {};
    let result = undefined;
    try {
      // 执行 ${} 格式类表达式，且支持 filter 过滤器。（备注: isPureVariable 可用于判断是否有 过滤器。）
      result = resolveVariableAndFilter(expression, curData, '| raw');
    } catch (e) {
      console.warn(
        '[formula]表达式执行异常，当前表达式: ',
        expression,
        '，当前上下文数据: ',
        data
      );
      return expression;
    }
    // 备注: 此处不用 result ?? expression 是为了避免 没有对应结果时直接显示 expression: ${xxx}
    return result;
  },
  evalFormula: (expression: string, data?: object) => {
    const curData = data || {};
    let result = undefined;
    try {
      result = evaluate(expression, curData, {
        evalMode: true, // evalMode 为 true 时，不用 ${} 包裹也可以执行，
        allowFilter: false
      });
    } catch (e) {
      console.warn(
        '[evalFormula]表达式执行异常，当前表达式: ',
        expression,
        '，当前上下文数据: ',
        data
      );
      return expression;
    }
    return result ?? expression;
  },
  js: (expression: string, data?: object) => {
    let debug = false;
    const idx = expression.indexOf('debugger');
    if (~idx) {
      debug = true;
      expression = expression.replace(/debugger;?/, '');
    }

    let fn;
    if (expression in FORMULA_EVAL_CACHE) {
      fn = FORMULA_EVAL_CACHE[expression];
    } else {
      fn = new Function(
        'data',
        'utils',
        `with(data) {${debug ? 'debugger;' : ''}return (${expression});}`
      );
      FORMULA_EVAL_CACHE[expression] = fn;
    }

    data = data || {};

    let curResult = undefined;
    try {
      curResult = fn.call(data, data, getFilters());
    } catch (e) {
      console.warn(
        '[formula:js]表达式执行异常，当前表达式: ',
        expression,
        '，当前上下文数据: ',
        data
      );
      return expression;
    }
    return curResult;
  },
  var: (expression: string, data?: object) => {
    const curData = data || {};
    const result = getVariable(curData, expression); // 不支持过滤器
    return result ?? expression;
  },
  collect: (expression: any) => {
    let variables: Array<string> = [];
    if (isObjectByLodash(expression) || isString(expression)) {
      // 仅对 Object类型 和 String类型 进行变量提取
      variables = collectVariables(expression);
    } else {
      variables = [];
    }
    return variables;
  }
};

// 根据表达式类型自动匹配指定运算器，也可以通过设置 execMode 直接指定运算器
export function formulaExec(
  value: any,
  data: any,
  execMode?: string | boolean
) {
  if (!value) {
    return '';
  }
  let OpenFormulaExecEvalMode = false;
  let curExecMode = '';
  if (isBoolean(execMode)) {
    // OpenFormulaExecEvalMode 设置为 true 后，非 ${ xxx } 格式也使用表达式运算器
    OpenFormulaExecEvalMode = execMode;
  } else if (isString(execMode)) {
    // 指定 execMode 可以直接选用对应的运算器
    curExecMode = execMode;
  }
  if (!isString(value)) {
    // 非字符串类型，直接返回，比如：boolean、number类型、Object、Array类型
    return value;
  } else if (curExecMode && FormulaExec[curExecMode]) {
    return FormulaExec[curExecMode](value, data);
  }

  const curValue = value.trim(); // 剔除前后空格

  // OpenFormulaExecEvalMode 为 true 时，非 ${ xxx } 格式也会尝试使用表达式运算器
  if (OpenFormulaExecEvalMode && /^[0-9a-zA-Z_]+$/.test(curValue)) {
    // 普通字符串类型（非表达式），先试一下从上下文中获取数据
    const curValueTemp = FormulaExec['var'](curValue, data);
    // 备注: 其他特殊格式，比如邮箱、日期
    return curValueTemp ?? curValue;
  } else if (curValue.startsWith('${') && curValue.endsWith('}')) {
    // ${ xxx } 格式 使用 formula 运算器
    return FormulaExec['formula'](curValue, data);
  } else if (isExpression(curValue)) {
    // 表达式格式使用 formula 运算器
    return FormulaExec['formula'](curValue, data);
  } else if (/(\${).+(\})/.test(curValue)) {
    // 包含 ${ xxx } 则使用 tpl 运算器
    return FormulaExec['tpl'](curValue, data); // 可识别 <% %> 语法
  } else if (OpenFormulaExecEvalMode) {
    // 支持 ${} 和 非 ${} 表达式
    return FormulaExec['evalFormula'](curValue, data);
  } else {
    return curValue;
  }
}

// 用于注册自定义 formulaExec 运算器
export function registerFormulaExec(execMode: string, formulaExec: Function) {
  if (FormulaExec[execMode]) {
    console.error(
      `registerFormulaExec: 运算器注册失败，存在同名运算器（$(execMode)）。`
    );
  } else {
    FormulaExec[execMode] = formulaExec;
  }
}

// 用于判断是否优先使用value。
export function isExpression(expression: any): boolean {
  if (!expression || !isString(expression)) {
    // 非字符串类型，比如：Object、Array类型、boolean、number类型
    return false;
  }
  // 备注1: "\\${xxx}"不作为表达式，至少含一个${xxx}才算是表达式

  // 备注2: safari 不支持 /(?<!\\)(\${).+(\})/.test(expression)
  return /(^|[^\\])\$\{.+\}/.test(expression);
}

// 用于判断是否需要执行表达式:
export function isNeedFormula(
  expression: any,
  prevData: {[propName: string]: any},
  curData: {[propName: string]: any}
): boolean {
  const variables = FormulaExec.collect(expression);
  return variables.some(
    (variable: string) =>
      FormulaExec.var(variable, prevData) !== FormulaExec.var(variable, curData)
  );
}

export function isNowFormula(expression: string): boolean {
  const block = expression.split(/\${|\||}/).filter(item => item);
  return block[1] === 'now';
}

// 将 \${xx} 替换成 ${xx}
export function replaceExpression(expression: any): any {
  if (
    expression &&
    isString(expression) &&
    /(\\)(\${).+(\})/.test(expression)
  ) {
    return expression.replace(/\\\$\{/g, '${');
  }
  return expression;
}
