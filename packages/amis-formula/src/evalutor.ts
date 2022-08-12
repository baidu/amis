/**
 * @file 公式内置函数
 */

import moment from 'moment';
import upperFirst from 'lodash/upperFirst';
import padStart from 'lodash/padStart';
import capitalize from 'lodash/capitalize';
import escape from 'lodash/escape';
import truncate from 'lodash/truncate';
import uniqWith from 'lodash/uniqWith';
import uniqBy from 'lodash/uniqBy';
import isEqual from 'lodash/isEqual';
import {EvaluatorOptions, FilterContext, FilterMap, FunctionMap} from './types';

export class Evaluator {
  readonly filters: FilterMap;
  readonly functions: FunctionMap = {};
  readonly context: {
    [propName: string]: any;
  };
  contextStack: Array<(varname: string) => any> = [];

  static defaultFilters: FilterMap = {};
  static setDefaultFilters(filters: FilterMap) {
    Evaluator.defaultFilters = {
      ...Evaluator.defaultFilters,
      ...filters
    };
  }

  constructor(
    context: {
      [propName: string]: any;
    },
    readonly options: EvaluatorOptions = {
      defaultFilter: 'html'
    }
  ) {
    this.context = context;
    this.contextStack.push((varname: string) =>
      varname === '&' ? context : context?.[varname]
    );

    this.filters = {
      ...Evaluator.defaultFilters,
      ...this.filters,
      ...options?.filters
    };
    this.functions = {
      ...this.functions,
      ...options?.functions
    };
  }

  // 主入口
  evalute(ast: any) {
    if (ast && ast.type) {
      const name = (ast.type as string).replace(/(?:_|\-)(\w)/g, (_, l) =>
        l.toUpperCase()
      );
      const fn = this.functions[name] || (this as any)[name];

      if (!fn) {
        throw new Error(`${ast.type} unkown.`);
      }

      return fn.call(this, ast);
    } else {
      return ast;
    }
  }

  document(ast: {type: 'document'; body: Array<any>}) {
    if (!ast.body.length) {
      return undefined;
    }
    const isString = ast.body.length > 1;
    const content = ast.body.map(item => {
      let result = this.evalute(item);

      if (isString && result == null) {
        // 不要出现 undefined, null 之类的文案
        return '';
      }

      return result;
    });
    return content.length === 1 ? content[0] : content.join('');
  }

  filter(ast: {
    type: 'filter';
    input: any;
    filters: Array<{name: string; args: Array<any>}>;
  }) {
    let input = this.evalute(ast.input);
    const filters = ast.filters.concat();
    const context: FilterContext = {
      filter: undefined,
      data: this.context,
      restFilters: filters
    };

    while (filters.length) {
      const filter = filters.shift()!;
      const fn = this.filters[filter.name];
      if (!fn) {
        throw new Error(`filter \`${filter.name}\` not exits`);
      }
      context.filter = filter;
      input = fn.apply(
        context,
        [input].concat(
          filter.args.map((item: any) => {
            if (item?.type === 'mixed') {
              return item.body
                .map((item: any) =>
                  typeof item === 'string' ? item : this.evalute(item)
                )
                .join('');
            } else if (item.type) {
              return this.evalute(item);
            }
            return item;
          })
        )
      );
    }
    return input;
  }

  raw(ast: {type: 'raw'; value: string}) {
    return ast.value;
  }

  script(ast: {type: 'script'; body: any}) {
    const defaultFilter = this.options.defaultFilter;

    // 只给简单的变量取值用法自动补fitler
    if (defaultFilter && ~['getter', 'variable'].indexOf(ast.body?.type)) {
      ast.body = {
        type: 'filter',
        input: ast.body,
        filters: [
          {
            name: defaultFilter.replace(/^\s*\|\s*/, ''),
            args: []
          }
        ]
      };
    }

    return this.evalute(ast.body);
  }

  expressionList(ast: {type: 'expression-list'; body: Array<any>}) {
    return ast.body.reduce((prev, current) => this.evalute(current));
  }

  template(ast: {type: 'template'; body: Array<any>}) {
    return ast.body.map(arg => this.evalute(arg)).join('');
  }

  templateRaw(ast: {type: 'template_raw'; value: any}) {
    return ast.value;
  }

  // 下标获取
  getter(ast: {host: any; key: any}) {
    const host = this.evalute(ast.host);
    let key = this.evalute(ast.key);
    if (typeof key === 'undefined' && ast.key?.type === 'variable') {
      key = ast.key.name;
    }
    return host?.[key];
  }

  // 位操作如 +2 ~3 !
  unary(ast: {op: '+' | '-' | '~' | '!'; value: any}) {
    let value = this.evalute(ast.value);

    switch (ast.op) {
      case '+':
        return +value;
      case '-':
        return -value;
      case '~':
        return ~value;
      case '!':
        return !value;
    }
  }

  formatNumber(value: any, int = false) {
    const typeName = typeof value;
    if (typeName === 'string') {
      return (int ? parseInt(value, 10) : parseFloat(value)) || 0;
    } else if (typeName === 'number' && int) {
      return Math.round(value);
    }

    return value ?? 0;
  }

  power(ast: {left: any; right: any}) {
    const left = this.evalute(ast.left);
    const right = this.evalute(ast.right);
    return Math.pow(this.formatNumber(left), this.formatNumber(right));
  }

  multiply(ast: {left: any; right: any}) {
    const left = this.evalute(ast.left);
    const right = this.evalute(ast.right);
    return stripNumber(this.formatNumber(left) * this.formatNumber(right));
  }

  divide(ast: {left: any; right: any}) {
    const left = this.evalute(ast.left);
    const right = this.evalute(ast.right);
    return stripNumber(this.formatNumber(left) / this.formatNumber(right));
  }

  remainder(ast: {left: any; right: any}) {
    const left = this.evalute(ast.left);
    const right = this.evalute(ast.right);
    return this.formatNumber(left) % this.formatNumber(right);
  }

  add(ast: {left: any; right: any}) {
    const left = this.evalute(ast.left);
    const right = this.evalute(ast.right);
    return stripNumber(this.formatNumber(left) + this.formatNumber(right));
  }

  minus(ast: {left: any; right: any}) {
    const left = this.evalute(ast.left);
    const right = this.evalute(ast.right);
    return stripNumber(this.formatNumber(left) - this.formatNumber(right));
  }

  shift(ast: {op: '<<' | '>>' | '>>>'; left: any; right: any}) {
    const left = this.evalute(ast.left);
    const right = this.formatNumber(this.evalute(ast.right), true);

    if (ast.op === '<<') {
      return left << right;
    } else if (ast.op == '>>') {
      return left >> right;
    } else {
      return left >>> right;
    }
  }

  lt(ast: {left: any; right: any}) {
    const left = this.evalute(ast.left);
    const right = this.evalute(ast.right);

    // todo 如果是日期的对比，这个地方可以优化一下。

    return left < right;
  }

  gt(ast: {left: any; right: any}) {
    const left = this.evalute(ast.left);
    const right = this.evalute(ast.right);

    // todo 如果是日期的对比，这个地方可以优化一下。
    return left > right;
  }

  le(ast: {left: any; right: any}) {
    const left = this.evalute(ast.left);
    const right = this.evalute(ast.right);

    // todo 如果是日期的对比，这个地方可以优化一下。

    return left <= right;
  }

  ge(ast: {left: any; right: any}) {
    const left = this.evalute(ast.left);
    const right = this.evalute(ast.right);

    // todo 如果是日期的对比，这个地方可以优化一下。

    return left >= right;
  }

  eq(ast: {left: any; right: any}) {
    const left = this.evalute(ast.left);
    const right = this.evalute(ast.right);

    // todo 如果是日期的对比，这个地方可以优化一下。

    return left == right;
  }

  ne(ast: {left: any; right: any}) {
    const left = this.evalute(ast.left);
    const right = this.evalute(ast.right);

    // todo 如果是日期的对比，这个地方可以优化一下。

    return left != right;
  }

  streq(ast: {left: any; right: any}) {
    const left = this.evalute(ast.left);
    const right = this.evalute(ast.right);

    // todo 如果是日期的对比，这个地方可以优化一下。

    return left === right;
  }

  strneq(ast: {left: any; right: any}) {
    const left = this.evalute(ast.left);
    const right = this.evalute(ast.right);

    // todo 如果是日期的对比，这个地方可以优化一下。

    return left !== right;
  }

  binary(ast: {op: '&' | '^' | '|'; left: any; right: any}) {
    const left = this.evalute(ast.left);
    const right = this.evalute(ast.right);

    if (ast.op === '&') {
      return left & right;
    } else if (ast.op === '^') {
      return left ^ right;
    } else {
      return left | right;
    }
  }

  and(ast: {left: any; right: any}) {
    const left = this.evalute(ast.left);
    return left && this.evalute(ast.right);
  }

  or(ast: {left: any; right: any}) {
    const left = this.evalute(ast.left);
    return left || this.evalute(ast.right);
  }

  number(ast: {value: any; raw: string}) {
    // todo 以后可以在这支持大数字。
    return ast.value;
  }

  nsVariable(ast: {namespace: string; body: any}) {
    if (ast.namespace === 'window') {
      this.contextStack.push((name: string) =>
        name === '&' ? window : (window as any)[name]
      );
    } else if (ast.namespace === 'cookie') {
      this.contextStack.push((name: string) => {
        return getCookie(name);
      });
    } else if (ast.namespace === 'ls' || ast.namespace === 'ss') {
      const ns = ast.namespace;
      this.contextStack.push((name: string) => {
        const raw =
          ns === 'ss'
            ? sessionStorage.getItem(name)
            : localStorage.getItem(name);

        if (typeof raw === 'string') {
          // 判断字符串是否一个纯数字字符串，如果是，则对比parse后的值和原值是否相同，
          // 如果不同则返回原值，因为原值如果是一个很长的纯数字字符串，则 parse 后可能会丢失精度
          if (/^\d+$/.test(raw)) {
            const parsed = JSON.parse(raw);
            return `${parsed}` === raw ? parsed : raw;
          }

          return parseJson(raw, raw);
        }

        return undefined;
      });
    } else {
      throw new Error('Unsupported namespace: ' + ast.namespace);
    }

    const result = this.evalute(ast.body);
    this.contextStack.pop();
    return result;
  }

  variable(ast: {name: string}) {
    const contextGetter = this.contextStack[this.contextStack.length - 1];
    return contextGetter(ast.name);
  }

  identifier(ast: {name: string}) {
    return ast.name;
  }

  array(ast: {type: 'array'; members: Array<any>}) {
    return ast.members.map(member => this.evalute(member));
  }

  literal(ast: {type: 'literal'; value: any}) {
    return ast.value;
  }

  string(ast: {type: 'string'; value: string}) {
    return ast.value;
  }

  object(ast: {members: Array<{key: string; value: any}>}) {
    let object: any = {};
    ast.members.forEach(({key, value}) => {
      object[this.evalute(key)] = this.evalute(value);
    });
    return object;
  }

  conditional(ast: {
    type: 'conditional';
    test: any;
    consequent: any;
    alternate: any;
  }) {
    return this.evalute(ast.test)
      ? this.evalute(ast.consequent)
      : this.evalute(ast.alternate);
  }

  funcCall(this: any, ast: {identifier: string; args: Array<any>}) {
    const fnName = `fn${ast.identifier}`;
    const fn =
      this.functions[fnName] || this[fnName] || this.filters[ast.identifier];

    if (!fn) {
      throw new Error(`${ast.identifier}函数没有定义`);
    }

    let args: Array<any> = ast.args;

    // 逻辑函数特殊处理，因为有时候有些运算是可以跳过的。
    if (~['IF', 'AND', 'OR', 'XOR', 'IFS'].indexOf(ast.identifier)) {
      args = args.map(a => () => this.evalute(a));
    } else {
      args = args.map(a => this.evalute(a));
    }

    return fn.apply(this, args);
  }

  anonymousFunction(ast: any) {
    return ast;
  }

  callAnonymousFunction(
    ast: {
      args: any[];
      return: any;
    },
    args: Array<any>
  ) {
    const ctx: any = createObject(
      this.contextStack[this.contextStack.length - 1]('&') || {},
      {}
    );
    ast.args.forEach((arg: any) => {
      if (arg.type !== 'variable') {
        throw new Error('expected a variable as argument');
      }
      ctx[arg.name] = args.shift();
    });
    this.contextStack.push((varName: string) =>
      varName === '&' ? ctx : ctx[varName]
    );
    const result = this.evalute(ast.return);
    this.contextStack.pop();
    return result;
  }

  /**
   * 示例：IF(A, B, C)
   *
   * 如果满足条件A，则返回B，否则返回C，支持多层嵌套IF函数。
   *
   * 也可以用表达式如：A ? B : C
   *
   * @example IF(condition, consequent, alternate)
   * @param {expression} condition - 条件表达式.
   * @param {any} consequent 条件判断通过的返回结果
   * @param {any} alternate 条件判断不通过的返回结果
   * @namespace 逻辑函数
   *
   * @returns {any} 根据条件返回不同的结果
   */
  fnIF(condition: () => any, trueValue: () => any, falseValue: () => any) {
    return condition() ? trueValue() : falseValue();
  }

  /**
   * 条件全部符合，返回 true，否则返回 false
   *
   * 示例：AND(语文成绩>80, 数学成绩>80)
   *
   * 语文成绩和数学成绩都大于 80，则返回 true，否则返回 false
   *
   * 也可以直接用表达式如：语文成绩>80 && 数学成绩>80
   *
   * @example AND(expression1, expression2, ...expressionN)
   * @param {...expression} conditions - 条件表达式.
   * @namespace 逻辑函数
   *
   * @returns {boolean}
   */
  fnAND(...condtions: Array<() => any>) {
    return condtions.every(c => c());
  }

  /**
   * 条件任意一个满足条件，返回 true，否则返回 false
   *
   * 示例：OR(语文成绩>80, 数学成绩>80)
   *
   * 语文成绩和数学成绩任意一个大于 80，则返回 true，否则返回 false
   *
   * 也可以直接用表达式如：语文成绩>80 || 数学成绩>80
   *
   * @example OR(expression1, expression2, ...expressionN)
   * @param {...expression} conditions - 条件表达式.
   * @namespace 逻辑函数
   *
   * @returns {boolean}
   */
  fnOR(...condtions: Array<() => any>) {
    return condtions.some(c => c());
  }

  /**
   * 异或处理，两个表达式同时为「真」，或者同时为「假」，则结果返回为「真」
   *
   * @example XOR(condition1, condition2)
   * @param {expression} condition1 - 条件表达式1
   * @param {expression} condition2 - 条件表达式2
   * @namespace 逻辑函数
   *
   * @returns {boolean}
   */
  fnXOR(c1: () => any, c2: () => any) {
    return !!c1() === !!c2();
  }

  /**
   * 判断函数集合，相当于多个 else if 合并成一个。
   *
   * 示例：IFS(语文成绩 > 80, "优秀", 语文成绩 > 60, "良", "继续努力")
   *
   * 如果语文成绩大于 80，则返回优秀，否则判断大于 60 分，则返回良，否则返回继续努力。
   *
   * @example IFS(condition1, result1, condition2, result2,...conditionN, resultN)
   * @param {...any} args - 条件，返回值集合
   * @namespace 逻辑函数
   * @returns {any} 第一个满足条件的结果，没有命中的返回 false。
   */
  fnIFS(...args: Array<() => any>) {
    if (args.length % 2) {
      args.splice(args.length - 1, 0, () => true);
    }

    while (args.length) {
      const c = args.shift()!;
      const v = args.shift()!;

      if (c()) {
        return v();
      }
    }
    return;
  }

  /**
   * 返回传入数字的绝对值
   *
   * @example ABS(num)
   * @param {number} num - 数值
   * @namespace 数学函数
   *
   * @returns {number} 传入数值的绝对值
   */
  fnABS(a: number) {
    a = this.formatNumber(a);
    return Math.abs(a);
  }

  /**
   * 获取最大值，如果只有一个参数且是数组，则计算这个数组内的值
   *
   * @example MAX(num1, num2, ...numN)
   * @param {...number} num - 数值
   * @namespace 数学函数
   *
   * @returns {number} 所有传入值中最大的那个
   */
  fnMAX(...args: Array<any>) {
    const arr = normalizeArgs(args);
    return Math.max.apply(
      Math,
      arr.map(item => this.formatNumber(item))
    );
  }

  /**
   * 获取最小值，如果只有一个参数且是数组，则计算这个数组内的值
   *
   * @example MIN(num1, num2, ...numN)
   * @param {...number} num - 数值
   * @namespace 数学函数
   *
   * @returns {number} 所有传入值中最小的那个
   */
  fnMIN(...args: Array<number>) {
    const arr = normalizeArgs(args);
    return Math.min.apply(
      Math,
      arr.map(item => this.formatNumber(item))
    );
  }

  /**
   * 求和，如果只有一个参数且是数组，则计算这个数组内的值
   *
   * @example SUM(num1, num2, ...numN)
   * @param {...number} num - 数值
   * @namespace 数学函数
   *
   * @returns {number} 所有传入数值的总和
   */
  fnSUM(...args: Array<number>) {
    const arr = normalizeArgs(args);
    return arr.reduce((sum, a) => sum + this.formatNumber(a) || 0, 0);
  }

  /**
   * 将数值向下取整为最接近的整数
   *
   * @example INT(num)
   * @param {number} num - 数值
   * @namespace 数学函数
   *
   * @returns {number} 数值对应的整形
   */
  fnINT(n: number) {
    return Math.floor(this.formatNumber(n));
  }

  /**
   * 返回两数相除的余数，参数 number 是被除数，divisor 是除数
   *
   * @example MOD(num, divisor)
   * @param {number} num - 被除数
   * @param {number} divisor - 除数
   * @namespace 数学函数
   *
   * @returns {number} 两数相除的余数
   */
  fnMOD(a: number, b: number) {
    return this.formatNumber(a) % this.formatNumber(b);
  }

  /**
   * 圆周率 3.1415...
   *
   * @example PI()
   * @namespace 数学函数
   *
   * @returns {number} 圆周率数值
   */
  fnPI() {
    return Math.PI;
  }

  /**
   * 将数字四舍五入到指定的位数，可以设置小数位。
   *
   * @example ROUND(num[, numDigits = 2])
   * @param {number} num - 要处理的数字
   * @param {number} numDigits - 小数位数
   * @namespace 数学函数
   *
   * @returns {number} 传入数值四舍五入后的结果
   */
  fnROUND(a: number, b: number) {
    a = this.formatNumber(a);
    b = this.formatNumber(b);
    const bResult = Math.round(b);

    if (bResult) {
      const c = Math.pow(10, bResult);
      return Math.round(a * c) / c;
    }

    return Math.round(a);
  }

  /**
   * 将数字向下取整到指定的位数，可以设置小数位。
   *
   * @example FLOOR(num[, numDigits=2])
   * @param {number} num - 要处理的数字
   * @param {number} numDigits - 小数位数
   * @namespace 数学函数
   *
   * @returns {number} 传入数值向下取整后的结果
   */
  fnFLOOR(a: number, b: number) {
    a = this.formatNumber(a);
    b = this.formatNumber(b);
    const bResult = Math.round(b);

    if (bResult) {
      const c = Math.pow(10, bResult);
      return Math.floor(a * c) / c;
    }

    return Math.floor(a);
  }

  /**
   * 将数字向上取整到指定的位数，可以设置小数位。
   *
   * @example CEIL(num[, numDigits=2])
   * @param {number} num - 要处理的数字
   * @param {number} numDigits - 小数位数
   * @namespace 数学函数
   *
   * @returns {number} 传入数值向上取整后的结果
   */
  fnCEIL(a: number, b: number) {
    a = this.formatNumber(a);
    b = this.formatNumber(b);
    const bResult = Math.round(b);

    if (bResult) {
      const c = Math.pow(10, bResult);
      return Math.ceil(a * c) / c;
    }

    return Math.ceil(a);
  }

  /**
   * 开平方，参数 number 为非负数
   *
   * @example SQRT(num)
   * @param {number} num - 要处理的数字
   * @namespace 数学函数
   *
   * @returns {number} 开平方的结果
   */
  fnSQRT(n: number) {
    return Math.sqrt(this.formatNumber(n));
  }

  /**
   * 返回所有参数的平均值，如果只有一个参数且是数组，则计算这个数组内的值
   *
   * @example AVG(num1, num2, ...numN)
   * @param {...number} num - 要处理的数字
   * @namespace 数学函数
   *
   * @returns {number} 所有数值的平均值
   */
  fnAVG(...args: Array<any>) {
    const arr = normalizeArgs(args);
    return (
      this.fnSUM.apply(
        this,
        arr.map(item => this.formatNumber(item))
      ) / arr.length
    );
  }

  /**
   * 返回数据点与数据均值点之差（数据偏差）的平方和，如果只有一个参数且是数组，则计算这个数组内的值
   *
   * @example DEVSQ(num1, num2, ...numN)
   * @param {...number} num - 要处理的数字
   * @namespace 数学函数
   *
   * @returns {number} 所有数值的平均值
   */
  fnDEVSQ(...args: Array<any>) {
    if (args.length === 0) {
      return null;
    }
    const arr = normalizeArgs(args);

    const nums = arr.map(item => this.formatNumber(item));
    const sum = nums.reduce((sum, a) => sum + a || 0, 0);
    const mean = sum / nums.length;
    let result = 0;
    for (const num of nums) {
      result += Math.pow(num - mean, 2);
    }
    return result;
  }

  /**
   * 数据点到其算术平均值的绝对偏差的平均值
   *
   * @example AVEDEV(num1, num2, ...numN)
   * @param {...number} num - 要处理的数字
   * @namespace 数学函数
   *
   * @returns {number} 所有数值的平均值
   */
  fnAVEDEV(...args: Array<any>) {
    if (args.length === 0) {
      return null;
    }
    let arr = args;
    if (args.length === 1 && Array.isArray(args[0])) {
      arr = args[0];
    }
    const nums = arr.map(item => this.formatNumber(item));
    const sum = nums.reduce((sum, a) => sum + a || 0, 0);
    const mean = sum / nums.length;
    let result = 0;
    for (const num of nums) {
      result += Math.abs(num - mean);
    }
    return result / nums.length;
  }

  /**
   * 数据点的调和平均值，如果只有一个参数且是数组，则计算这个数组内的值
   *
   * @example HARMEAN(num1, num2, ...numN)
   * @param {...number} num - 要处理的数字
   * @namespace 数学函数
   *
   * @returns {number} 所有数值的平均值
   */
  fnHARMEAN(...args: Array<any>) {
    if (args.length === 0) {
      return null;
    }
    let arr = args;
    if (args.length === 1 && Array.isArray(args[0])) {
      arr = args[0];
    }
    const nums = arr.map(item => this.formatNumber(item));
    let den = 0;
    for (const num of nums) {
      den += 1 / num;
    }
    return nums.length / den;
  }

  /**
   * 数据集中第 k 个最大值
   *
   * @example LARGE(array, k)
   * @param {array} nums - 要处理的数字
   * @param {number}  k - 第几大
   * @namespace 数学函数
   *
   * @returns {number} 所有数值的平均值
   */
  fnLARGE(nums: Array<any>, k: number) {
    if (nums.length === 0) {
      return null;
    }
    const numsFormat = nums.map(item => this.formatNumber(item));
    if (k < 0 || numsFormat.length < k) {
      return null;
    }
    return numsFormat.sort(function (a, b) {
      return b - a;
    })[k - 1];
  }

  /**
   * 将数值转为中文大写金额
   *
   * @example UPPERMONEY(num)
   * @param {number} num - 要处理的数字
   * @namespace 数学函数
   *
   * @returns {string} 数值中文大写字符
   */
  fnUPPERMONEY(n: number) {
    n = this.formatNumber(n);
    const fraction = ['角', '分'];
    const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
    const unit = [
      ['元', '万', '亿'],
      ['', '拾', '佰', '仟']
    ];
    const head = n < 0 ? '欠' : '';
    n = Math.abs(n);
    let s = '';
    for (let i = 0; i < fraction.length; i++) {
      s += (
        digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]
      ).replace(/零./, '');
    }
    s = s || '整';
    n = Math.floor(n);
    for (let i = 0; i < unit[0].length && n > 0; i++) {
      let p = '';
      for (let j = 0; j < unit[1].length && n > 0; j++) {
        p = digit[n % 10] + unit[1][j] + p;
        n = Math.floor(n / 10);
      }
      s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
    }
    return (
      head +
      s
        .replace(/(零.)*零元/, '元')
        .replace(/(零.)+/g, '零')
        .replace(/^整$/, '零元整')
    );
  }

  /**
   * 返回大于等于 0 且小于 1 的均匀分布随机实数。每一次触发计算都会变化。
   *
   * 示例：`RAND()*100`
   *
   * 返回 0-100 之间的随机数
   *
   * @example RAND()
   * @namespace 数学函数
   *
   * @returns {number} 随机数
   */
  fnRAND() {
    return Math.random();
  }

  /**
   * 取数据最后一个
   *
   * @example LAST(array)
   * @param {...number} arr - 要处理的数组
   * @namespace 数学函数
   *
   * @returns {any} 最后一个值
   */
  fnLAST(arr: Array<any>) {
    return arr.length ? arr[arr.length - 1] : null;
  }

  // 文本函数

  normalizeText(raw: any) {
    if (raw instanceof Date) {
      return moment(raw).format();
    }

    return `${raw}`;
  }

  /**
   * 返回传入文本左侧的指定长度字符串。
   *
   * @example LEFT(text, len)
   * @param {string} text - 要处理的文本
   * @param {number} len - 要处理的长度
   * @namespace 文本函数
   *
   * @returns {string} 对应字符串
   */
  fnLEFT(text: string, len: number) {
    text = this.normalizeText(text);
    return text.substring(0, len);
  }

  /**
   * 返回传入文本右侧的指定长度字符串。
   *
   * @example RIGHT(text, len)
   * @param {string} text - 要处理的文本
   * @param {number} len - 要处理的长度
   * @namespace 文本函数
   *
   * @returns {string} 对应字符串
   */
  fnRIGHT(text: string, len: number) {
    text = this.normalizeText(text);
    return text.substring(text.length - len, text.length);
  }

  /**
   * 计算文本的长度
   *
   * @example LEN(text)
   * @param {string} text - 要处理的文本
   * @namespace 文本函数
   *
   * @returns {number} 长度
   */
  fnLEN(text: string) {
    text = this.normalizeText(text);
    return text?.length;
  }

  /**
   * 计算文本集合中所有文本的长度
   *
   * @example LENGTH(textArr)
   * @param {string[]} textArr - 要处理的文本集合
   * @namespace 文本函数
   *
   * @returns {number[]} 长度集合
   */
  fnLENGTH(...args: any[]) {
    return this.fnLEN.call(this, args);
  }

  /**
   * 判断文本是否为空
   *
   * @example ISEMPTY(text)
   * @param {string} text - 要处理的文本
   * @namespace 文本函数
   *
   * @returns {boolean} 判断结果
   */
  fnISEMPTY(text: string) {
    return !text || !String(text).trim();
  }

  /**
   * 将多个传入值连接成文本
   *
   * @example CONCATENATE(text1, text2, ...textN)
   * @param {...string} text - 文本集合
   * @namespace 文本函数
   *
   * @returns {string} 连接后的文本
   */
  fnCONCATENATE(...args: Array<any>) {
    return args.join('');
  }

  /**
   * 返回计算机字符集的数字代码所对应的字符。
   *
   * `CHAR(97)` 等价于 "a"
   *
   * @example CHAR(code)
   * @param {number} code - 编码值
   * @namespace 文本函数
   *
   * @returns {string} 指定位置的字符
   */
  fnCHAR(code: number) {
    return String.fromCharCode(code);
  }

  /**
   * 将传入文本转成小写
   *
   * @example LOWER(text)
   * @param {string} text - 文本
   * @namespace 文本函数
   *
   * @returns {string} 结果文本
   */
  fnLOWER(text: string) {
    text = this.normalizeText(text);
    return text.toLowerCase();
  }

  /**
   * 将传入文本转成大写
   *
   * @example UPPER(text)
   * @param {string} text - 文本
   * @namespace 文本函数
   *
   * @returns {string} 结果文本
   */
  fnUPPER(text: string) {
    text = this.normalizeText(text);
    return text.toUpperCase();
  }

  /**
   * 将传入文本首字母转成大写
   *
   * @example UPPERFIRST(text)
   * @param {string} text - 文本
   * @namespace 文本函数
   *
   * @returns {string} 结果文本
   */
  fnUPPERFIRST(text: string) {
    text = this.normalizeText(text);
    return upperFirst(text);
  }

  /**
   * 向前补齐文本长度
   *
   * 示例 `PADSTART("6", 2, "0")`
   *
   * 返回 `06`
   *
   * @example PADSTART(text)
   * @param {string} text - 文本
   * @param {number} num - 目标长度
   * @param {string} pad - 用于补齐的文本
   * @namespace 文本函数
   *
   * @returns {string} 结果文本
   */
  fnPADSTART(text: string, num: number, pad: string): string {
    text = this.normalizeText(text);
    return padStart(text, num, pad);
  }

  /**
   * 将文本转成标题
   *
   * 示例 `CAPITALIZE("star")`
   *
   * 返回 `Star`
   *
   * @example CAPITALIZE(text)
   * @param {string} text - 文本
   * @namespace 文本函数
   *
   * @returns {string} 结果文本
   */
  fnCAPITALIZE(text: string): string {
    text = this.normalizeText(text);
    return capitalize(text);
  }

  /**
   * 对文本进行 HTML 转义
   *
   * 示例 `ESCAPE("star")`
   *
   * 返回 `Star`
   *
   * @example ESCAPE(text)
   * @param {string} text - 文本
   * @namespace 文本函数
   *
   * @returns {string} 结果文本
   */
  fnESCAPE(text: string): string {
    text = this.normalizeText(text);
    return escape(text);
  }

  /**
   * 对文本长度进行截断
   *
   * 示例 `TRUNCATE("amis.baidu.com", 6)`
   *
   * 返回 `amis...`
   *
   * @example TRUNCATE(text, 6)
   * @param {string} text - 文本
   * @param {number} text - 最长长度
   * @namespace 文本函数
   *
   * @returns {string} 结果文本
   */
  fnTRUNCATE(text: string, length: number): string {
    text = this.normalizeText(text);
    return truncate(text, {length});
  }

  /**
   *  取在某个分隔符之前的所有字符串
   *
   * @example  BEFORELAST(text, '.')
   * @param {string} text - 文本
   * @param {string} delimiter - 结束文本
   * @namespace 文本函数
   *
   * @returns {string} 判断结果
   */
  fnBEFORELAST(text: string, delimiter: string = '.') {
    text = this.normalizeText(text);
    return text.split(delimiter).slice(0, -1).join(delimiter) || text + '';
  }

  /**
   * 将文本根据指定片段分割成数组
   *
   * 示例：`SPLIT("a,b,c", ",")`
   *
   * 返回 `["a", "b", "c"]`
   *
   * @example SPLIT(text, ',')
   * @param {string} text - 文本
   * @param {string} delimiter - 文本片段
   * @namespace 文本函数
   *
   * @returns {Array<string>} 文本集
   */
  fnSPLIT(text: string, sep: string = ',') {
    text = this.normalizeText(text);
    return text.split(sep);
  }

  /**
   * 将文本去除前后空格
   *
   * @example TRIM(text)
   * @param {string} text - 文本
   * @namespace 文本函数
   *
   * @returns {string} 处理后的文本
   */
  fnTRIM(text: string) {
    text = this.normalizeText(text);
    return text.trim();
  }

  /**
   * 去除文本中的 HTML 标签
   *
   * 示例：`STRIPTAG("<b>amis</b>")`
   *
   * 返回：`amis`
   *
   * @example STRIPTAG(text)
   * @param {string} text - 文本
   * @namespace 文本函数
   *
   * @returns {string} 处理后的文本
   */
  fnSTRIPTAG(text: string) {
    text = this.normalizeText(text);
    return text.replace(/<\/?[^>]+(>|$)/g, '');
  }

  /**
   * 将字符串中的换行转成 HTML `<br>`，用于简单换行的场景
   *
   * 示例：`LINEBREAK("\n")`
   *
   * 返回：`<br/>`
   *
   * @example LINEBREAK(text)
   * @param {string} text - 文本
   * @namespace 文本函数
   *
   * @returns {string} 处理后的文本
   */
  fnLINEBREAK(text: string) {
    text = this.normalizeText(text);
    return text.replace(/(?:\r\n|\r|\n)/g, '<br/>');
  }

  /**
   * 判断字符串(text)是否以特定字符串(startString)开始，是则返回 True，否则返回 False
   *
   * @example STARTSWITH(text, '片段')
   * @param {string} text - 文本
   * @param {string} startString - 起始文本
   * @namespace 文本函数
   *
   * @returns {string} 判断结果
   */
  fnSTARTSWITH(text: string, search: string) {
    if (!search) {
      return false;
    }

    text = this.normalizeText(text);
    return text.indexOf(search) === 0;
  }

  /**
   * 判断字符串(text)是否以特定字符串(endString)结束，是则返回 True，否则返回 False
   *
   * @example ENDSWITH(text, '片段')
   * @param {string} text - 文本
   * @param {string} endString - 结束文本
   * @namespace 文本函数
   *
   * @returns {string} 判断结果
   */
  fnENDSWITH(text: string, search: string) {
    if (!search) {
      return false;
    }

    text = this.normalizeText(text);
    return text.indexOf(search, text.length - search.length) !== -1;
  }

  /**
   * 判断参数 1 中的文本是否包含参数 2 中的文本。
   *
   * @example CONTAINS(text, searchText)
   * @param {string} text - 文本
   * @param {string} searchText - 搜索文本
   * @namespace 文本函数
   *
   * @returns {string} 判断结果
   */
  fnCONTAINS(text: string, search: string) {
    if (!search) {
      return false;
    }

    text = this.normalizeText(text);
    return !!~text.indexOf(search);
  }

  /**
   * 对文本进行全量替换。
   *
   * @example REPLACE(text, search, replace)
   * @param {string} text - 要处理的文本
   * @param {string} search - 要被替换的文本
   * @param {string} replace - 要替换的文本
   * @namespace 文本函数
   *
   * @returns {string} 处理结果
   */
  fnREPLACE(text: string, search: string, replace: string) {
    text = this.normalizeText(text);
    let result = text;

    while (true) {
      const idx = result.indexOf(search);

      if (!~idx) {
        break;
      }

      result =
        result.substring(0, idx) +
        replace +
        result.substring(idx + search.length);
    }

    return result;
  }

  /**
   * 对文本进行搜索，返回命中的位置
   *
   * @example SEARCH(text, search, 0)
   * @param {string} text - 要处理的文本
   * @param {string} search - 用来搜索的文本
   * @param {number} start - 起始位置
   * @namespace 文本函数
   *
   * @returns {number} 命中的位置
   */
  fnSEARCH(text: string, search: string, start: number = 0) {
    text = this.normalizeText(text);
    start = this.formatNumber(start);

    const idx = text.indexOf(search, start);
    if (~idx) {
      return idx;
    }

    return -1;
  }

  /**
   * 返回文本字符串中从指定位置开始的特定数目的字符
   *
   * @example MID(text, from, len)
   * @param {string} text - 要处理的文本
   * @param {number} from - 起始位置
   * @param {number} len - 处理长度
   * @namespace 文本函数
   *
   * @returns {number} 命中的位置
   */
  fnMID(text: string, from: number, len: number) {
    text = this.normalizeText(text);
    return text.substring(from, from + len);
  }

  /**
   * 返回路径中的文件名
   *
   * 示例：`/home/amis/a.json`
   *
   * 返回：a.json`
   *
   * @example BASENAME(text)
   * @param {string} text - 要处理的文本
   * @namespace 文本函数
   *
   * @returns {string}  文件名
   */
  fnBASENAME(text: string) {
    text = this.normalizeText(text);
    return text.split(/[\\/]/).pop();
  }

  // 日期函数

  /**
   * 创建日期对象，可以通过特定格式的字符串，或者数值。
   *
   * 需要注意的是，其中月份的数值是从0开始的，也就是说，
   * 如果是12月份，你应该传入数值11。
   *
   * @example DATE(2021, 11, 6, 8, 20, 0)
   * @example DATE('2021-12-06 08:20:00')
   * @namespace 日期函数
   *
   * @returns {Date} 日期对象
   */
  fnDATE(
    year: number,
    month: number,
    day: number,
    hour: number,
    minute: number,
    second: number
  ) {
    if (month === undefined) {
      return new Date(year);
    }

    return new Date(year, month, day, hour, minute, second);
  }

  /**
   * 返回时间的时间戳
   *
   * @example TIMESTAMP(date[, format = "X"])
   * @example TIMESTAMP(date, 'x')
   * @namespace 日期函数
   * @param {date} date 日期对象
   * @param {string} format 时间戳格式，带毫秒传入 'x'。默认为 'X' 不带毫秒的。
   *
   * @returns {number} 时间戳
   */
  fnTIMESTAMP(date: Date, format?: 'x' | 'X') {
    return parseInt(moment(date).format(format === 'x' ? 'x' : 'X'), 10);
  }

  /**
   * 返回今天的日期
   *
   * @example TODAY()
   * @namespace 日期函数
   *
   * @returns {number} 日期
   */
  fnTODAY() {
    return new Date();
  }

  /**
   * 返回现在的日期
   *
   * @example NOW()
   * @namespace 日期函数
   *
   * @returns {number} 日期
   */
  fnNOW() {
    return new Date();
  }

  /**
   * 将日期转成日期字符串
   *
   * @example DATETOSTR(date[, format="YYYY-MM-DD HH:mm:ss"])
   * @example DATETOSTR(date, 'YYYY-MM-DD')
   * @namespace 日期函数
   * @param {date} date 日期对象
   * @param {string} format 日期格式，默认为 "YYYY-MM-DD HH:mm:ss"
   *
   * @returns {number} 日期字符串
   */
  fnDATETOSTR(date: Date, format = 'YYYY-MM-DD HH:mm:ss') {
    return moment(date).format(format);
  }

  /**
   * 返回日期的指定范围的开端
   *
   * @namespace 日期函数
   * @example STARTOF(date[unit = "day"])
   * @param {date} date 日期对象
   * @param {string} unit 比如可以传入 'day'、'month'、'year' 或者 `week` 等等
   * @returns {date} 新的日期对象
   */
  fnSTARTOF(date: Date, unit?: any) {
    return moment(date)
      .startOf(unit || 'day')
      .toDate();
  }

  /**
   * 返回日期的指定范围的末尾
   * @namespace 日期函数
   * @example ENDOF(date[unit = "day"])
   * @param {date} date 日期对象
   * @param {string} unit 比如可以传入 'day'、'month'、'year' 或者 `week` 等等
   * @returns {date} 新的日期对象
   */
  fnENDOF(date: Date, unit?: any) {
    return moment(date)
      .endOf(unit || 'day')
      .toDate();
  }

  normalizeDate(raw: any): Date {
    if (typeof raw === 'string') {
      const formats = ['', 'YYYY-MM-DD HH:mm:ss'];

      while (formats.length) {
        const format = formats.shift()!;
        const date = moment(raw, format);

        if (date.isValid()) {
          return date.toDate();
        }
      }
    } else if (typeof raw === 'number') {
      return new Date(raw);
    }

    return raw;
  }

  /**
   * 返回日期的年份
   * @namespace 日期函数
   * @example YEAR(date)
   * @param {date} date 日期对象
   * @returns {number} 数值
   */
  fnYEAR(date: Date) {
    date = this.normalizeDate(date);
    return date.getFullYear();
  }

  /**
   * 返回日期的月份，这里就是自然月份。
   *
   * @namespace 日期函数
   * @example MONTH(date)
   * @param {date} date 日期对象
   * @returns {number} 数值
   */
  fnMONTH(date: Date) {
    date = this.normalizeDate(date);
    return date.getMonth() + 1;
  }

  /**
   * 返回日期的天
   * @namespace 日期函数
   * @example DAY(date)
   * @param {date} date 日期对象
   * @returns {number} 数值
   */
  fnDAY(date: Date) {
    date = this.normalizeDate(date);
    return date.getDate();
  }

  /**
   * 返回日期的小时
   * @param {date} date 日期对象
   * @namespace 日期函数
   * @example HOUR(date)
   * @returns {number} 数值
   */
  fnHOUR(date: Date) {
    date = this.normalizeDate(date);
    return date.getHours();
  }

  /**
   * 返回日期的分
   * @param {date} date 日期对象
   * @namespace 日期函数
   * @example MINUTE(date)
   * @returns {number} 数值
   */
  fnMINUTE(date: Date) {
    date = this.normalizeDate(date);
    return date.getMinutes();
  }

  /**
   * 返回日期的秒
   * @param {date} date 日期对象
   * @namespace 日期函数
   * @example SECOND(date)
   * @returns {number} 数值
   */
  fnSECOND(date: Date) {
    date = this.normalizeDate(date);
    return date.getSeconds();
  }

  /**
   * 返回两个日期相差多少年
   * @param {date} endDate 日期对象
   * @param {date} startDate 日期对象
   * @namespace 日期函数
   * @example YEARS(endDate, startDate)
   * @returns {number} 数值
   */
  fnYEARS(endDate: Date, startDate: Date) {
    endDate = this.normalizeDate(endDate);
    startDate = this.normalizeDate(startDate);
    return moment(endDate).diff(moment(startDate), 'year');
  }

  /**
   * 返回两个日期相差多少分钟
   * @param {date} endDate 日期对象
   * @param {date} startDate 日期对象
   * @namespace 日期函数
   * @example MINUTES(endDate, startDate)
   * @returns {number} 数值
   */
  fnMINUTES(endDate: Date, startDate: Date) {
    endDate = this.normalizeDate(endDate);
    startDate = this.normalizeDate(startDate);
    return moment(endDate).diff(moment(startDate), 'minutes');
  }

  /**
   * 返回两个日期相差多少天
   * @param {date} endDate 日期对象
   * @param {date} startDate 日期对象
   * @namespace 日期函数
   * @example DAYS(endDate, startDate)
   * @returns {number} 数值
   */
  fnDAYS(endDate: Date, startDate: Date) {
    endDate = this.normalizeDate(endDate);
    startDate = this.normalizeDate(startDate);
    return moment(endDate).diff(moment(startDate), 'days');
  }

  /**
   * 返回两个日期相差多少小时
   * @param {date} endDate 日期对象
   * @param {date} startDate 日期对象
   * @namespace 日期函数
   * @example HOURS(endDate, startDate)
   * @returns {number} 数值
   */
  fnHOURS(endDate: Date, startDate: Date) {
    endDate = this.normalizeDate(endDate);
    startDate = this.normalizeDate(startDate);
    return moment(endDate).diff(moment(startDate), 'hour');
  }

  /**
   * 修改日期，对日期进行加减天、月份、年等操作
   *
   * 示例：
   *
   * DATEMODIFY(A, -2, 'month')
   *
   * 对日期 A 进行往前减2月的操作。
   *
   * @param {date} date 日期对象
   * @param {number} num 数值
   * @param {string} unit 单位：支持年、月、天等等
   * @namespace 日期函数
   * @example DATEMODIFY(date, 2, 'days')
   * @returns {date} 日期对象
   */
  fnDATEMODIFY(date: Date, num: number, format: any) {
    date = this.normalizeDate(date);
    return moment(date).add(num, format).toDate();
  }

  /**
   * 将字符日期转成日期对象，可以指定日期格式。
   *
   * 示例：STRTODATE('2021/12/6', 'YYYY/MM/DD')
   *
   * @param {string} value 日期字符
   * @param {string} format 日期格式
   * @namespace 日期函数
   * @example STRTODATE(value[, format=""])
   * @returns {date} 日期对象
   */
  fnSTRTODATE(value: any, format: string = '') {
    return moment(value, format).toDate();
  }

  /**
   * 判断两个日期，是否第一个日期在第二个日期的前面
   *
   * @param {date} a 第一个日期
   * @param {date} b 第二个日期
   * @param {string} unit 单位，默认是 'day'， 即之比较到天
   * @namespace 日期函数
   * @example ISBEFORE(a, b)
   * @returns {boolean} 判断结果
   */
  fnISBEFORE(a: Date, b: Date, unit: any = 'day') {
    a = this.normalizeDate(a);
    b = this.normalizeDate(b);
    return moment(a).isBefore(moment(b), unit);
  }

  /**
   * 判断两个日期，是否第一个日期在第二个日期的后面
   *
   * @param {date} a 第一个日期
   * @param {date} b 第二个日期
   * @param {string} unit 单位，默认是 'day'， 即之比较到天
   * @namespace 日期函数
   * @example ISAFTER(a, b)
   * @returns {boolean} 判断结果
   */
  fnISAFTER(a: Date, b: Date, unit: any = 'day') {
    a = this.normalizeDate(a);
    b = this.normalizeDate(b);
    return moment(a).isAfter(moment(b), unit);
  }

  /**
   * 判断两个日期，是否第一个日期在第二个日期的前面或者相等
   *
   * @param {date} a 第一个日期
   * @param {date} b 第二个日期
   * @param {string} unit 单位，默认是 'day'， 即之比较到天
   * @namespace 日期函数
   * @example ISSAMEORBEFORE(a, b)
   * @returns {boolean} 判断结果
   */
  fnISSAMEORBEFORE(a: Date, b: Date, unit: any = 'day') {
    a = this.normalizeDate(a);
    b = this.normalizeDate(b);
    return moment(a).isSameOrBefore(moment(b), unit);
  }

  /**
   * 判断两个日期，是否第一个日期在第二个日期的后面或者相等
   *
   * @param {date} a 第一个日期
   * @param {date} b 第二个日期
   * @param {string} unit 单位，默认是 'day'， 即之比较到天
   * @namespace 日期函数
   * @example ISSAMEORAFTER(a, b)
   * @returns {boolean} 判断结果
   */
  fnISSAMEORAFTER(a: Date, b: Date, unit: any = 'day') {
    a = this.normalizeDate(a);
    b = this.normalizeDate(b);
    return moment(a).isSameOrAfter(moment(b), unit);
  }

  /**
   * 返回数组的长度
   *
   * @param {Array<any>} arr 数组
   * @namespace 数组
   * @example COUNT(arr)
   * @returns {boolean} 结果
   */
  fnCOUNT(value: any) {
    return Array.isArray(value) ? value.length : value ? 1 : 0;
  }

  /**
   * 数组做数据转换，需要搭配箭头函数一起使用，注意箭头函数只支持单表达式用法。
   *
   * @param {Array<any>} arr 数组
   * @param {Function<any>} iterator 箭头函数
   * @namespace 数组
   * @example ARRAYMAP(arr, item => item)
   * @returns {boolean} 结果
   */
  fnARRAYMAP(value: any, iterator: any) {
    if (!iterator || iterator.type !== 'anonymous_function') {
      throw new Error('expected an anonymous function get ' + iterator);
    }

    return (Array.isArray(value) ? value : []).map((item, index) =>
      this.callAnonymousFunction(iterator, [item, index])
    );
  }

  /**
   * 数组过滤掉 false、null、0 和 ""
   *
   * 示例：
   *
   * COMPACT([0, 1, false, 2, '', 3]) 得到 [1, 2, 3]
   *
   * @param {Array<any>} arr 数组
   * @namespace 数组
   * @example COMPACT(arr)
   * @returns {Array<any>} 结果
   */
  fnCOMPACT(arr: any[]) {
    if (Array.isArray(arr)) {
      let resIndex = 0;
      const result = [];
      for (const item of arr) {
        if (item) {
          result[resIndex++] = item;
        }
      }
      return result;
    } else {
      return [];
    }
  }

  /**
   * 数组转成字符串
   *
   * 示例：
   *
   * JOIN(['a', 'b', 'c'], '=') 得到 'a=b=c'
   *
   * @param {Array<any>} arr 数组
   * @param { String} separator 分隔符
   * @namespace 数组
   * @example JOIN(arr, string)
   * @returns {String} 结果
   */
  fnJOIN(arr: any[], separator = '') {
    if (Array.isArray(arr)) {
      return arr.join(separator);
    } else {
      return '';
    }
  }

  /**
   * 数组合并
   *
   * 示例：
   *
   * CONCAT(['a', 'b', 'c'], ['1'], ['3']) 得到 ['a', 'b', 'c', '1', '3']
   *
   * @param {Array<any>} arr 数组
   * @namespace 数组
   * @example CONCAT(['a', 'b', 'c'], ['1'], ['3'])
   * @returns {Array<any>} 结果
   */
  fnCONCAT(...arr: any[]) {
    if (arr?.[0] && !Array.isArray(arr[0])) {
      arr[0] = [arr[0]];
    }
    return arr.reduce((a, b) => a.concat(b), []).filter((item: any) => item);
  }

  /**
   * 数组去重，第二个参数「field」，可指定根据该字段去重
   *
   * 示例：
   *
   * UNIQ([{a: '1'}, {b: '2'}, {a: '1'}]， 'id')
   *
   * @param {Array<any>} arr 数组
   * @param {string} field 字段
   * @namespace 数组
   * @example UNIQ([{a: '1'}, {b: '2'}, {a: '1'}])
   * @example UNIQ([{a: '1'}, {b: '2'}, {a: '1'}], 'x')
   * @returns {Array<any>} 结果
   */
  fnUNIQ(arr: any[], field?: string) {
    return field ? uniqBy(arr, field) : uniqWith(arr, isEqual);
  }
}

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()!.split(';').shift();
  }
  return undefined;
}

function parseJson(str: string, defaultValue?: any) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return defaultValue;
  }
}

function stripNumber(number: number) {
  if (typeof number === 'number' && !Number.isInteger(number)) {
    return parseFloat(number.toPrecision(12));
  } else {
    return number;
  }
}

// 如果只有一个成员，同时第一个成员为 args
// 则把它展开，当成是多个参数，毕竟公式里面还不支持 ...args 语法，
function normalizeArgs(args: Array<any>) {
  if (args.length === 1 && Array.isArray(args[0])) {
    args = args[0];
  }
  return args;
}

export function createObject(
  superProps?: {[propName: string]: any},
  props?: {[propName: string]: any},
  properties?: any
): object {
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

  props && Object.keys(props).forEach(key => (obj[key] = props[key]));

  return obj;
}
