/**
 * @file 公式内置函数
 */
import {FilterContext} from './types';
import {createObject, Evaluator, stripNumber} from './evalutor';
import {FormulaEvalError} from './error';

export async function runSequence<T, U>(
  arr: Array<T>,
  fn: (item: T, index: number) => Promise<U>
) {
  const result: Array<U> = [];

  await arr.reduce(async (promise, item: T, index: number) => {
    await promise;
    result.push(await fn(item, index));
  }, Promise.resolve());

  return result;
}

export class AsyncEvaluator extends (Evaluator as any) {
  constructor(data: any, options?: any) {
    super(data, options);
  }

  async document(ast: {type: 'document'; body: Array<any>}) {
    if (!ast.body.length) {
      return undefined;
    }
    const isString = ast.body.length > 1;
    const content = await runSequence(ast.body, async item => {
      let result = this.evalute(item);

      if (isString && result == null) {
        // 不要出现 undefined, null 之类的文案
        return '';
      }

      return result;
    });

    return content.length === 1 ? content[0] : content.join('');
  }

  async filter(ast: {
    type: 'filter';
    input: any;
    filters: Array<{name: string; args: Array<any>}>;
  }) {
    let input = await this.evalute(ast.input);
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
        throw new Error(`filter \`${filter.name}\` not exists.`);
      }
      context.filter = filter;

      const argsRes = await runSequence(filter.args, async item => {
        if (item?.type === 'mixed') {
          const res = await runSequence(item.body, item =>
            typeof item === 'string' ? item : this.evalute(item)
          );

          return res.join('');
        } else if (item.type) {
          return this.evalute(item);
        }
        return item;
      });

      input = fn.apply(context, [input].concat(argsRes));
    }

    return input;
  }

  async template(ast: {type: 'template'; body: Array<any>}) {
    const args = await runSequence(ast.body, arg => this.evalute(arg));
    return args.join('');
  }

  // 下标获取
  async getter(ast: {host: any; key: any}) {
    const host = await this.evalute(ast.host);
    let key = await this.evalute(ast.key);
    if (typeof key === 'undefined' && ast.key?.type === 'variable') {
      key = ast.key.name;
    }
    return host?.[key];
  }

  // 位操作如 +2 ~3 !
  async unary(ast: {op: '+' | '-' | '~' | '!'; value: any}) {
    let value = await this.evalute(ast.value);

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

  async power(ast: {left: any; right: any}) {
    const left = await this.evalute(ast.left);
    const right = await this.evalute(ast.right);
    return Math.pow(this.formatNumber(left), this.formatNumber(right));
  }

  async multiply(ast: {left: any; right: any}) {
    const left = await this.evalute(ast.left);
    const right = await this.evalute(ast.right);
    return stripNumber(this.formatNumber(left) * this.formatNumber(right));
  }

  async divide(ast: {left: any; right: any}) {
    const left = await this.evalute(ast.left);
    const right = await this.evalute(ast.right);
    return stripNumber(this.formatNumber(left) / this.formatNumber(right));
  }

  async remainder(ast: {left: any; right: any}) {
    const left = await this.evalute(ast.left);
    const right = await this.evalute(ast.right);
    return this.formatNumber(left) % this.formatNumber(right);
  }

  async add(ast: {left: any; right: any}) {
    const left = await this.evalute(ast.left);
    const right = await this.evalute(ast.right);
    // 如果有一个不是数字就变成字符串拼接
    if (isNaN(left) || isNaN(right)) {
      return left + right;
    }
    return stripNumber(this.formatNumber(left) + this.formatNumber(right));
  }

  async minus(ast: {left: any; right: any}) {
    const left = await this.evalute(ast.left);
    const right = await this.evalute(ast.right);
    return stripNumber(this.formatNumber(left) - this.formatNumber(right));
  }

  async shift(ast: {op: '<<' | '>>' | '>>>'; left: any; right: any}) {
    const left = await this.evalute(ast.left);
    const right = await this.formatNumber(this.evalute(ast.right), true);

    if (ast.op === '<<') {
      return left << right;
    } else if (ast.op == '>>') {
      return left >> right;
    } else {
      return left >>> right;
    }
  }

  async lt(ast: {left: any; right: any}) {
    const left = await this.evalute(ast.left);
    const right = await this.evalute(ast.right);

    // todo 如果是日期的对比，这个地方可以优化一下。

    return left < right;
  }

  async gt(ast: {left: any; right: any}) {
    const left = await this.evalute(ast.left);
    const right = await this.evalute(ast.right);

    // todo 如果是日期的对比，这个地方可以优化一下。
    return left > right;
  }

  async le(ast: {left: any; right: any}) {
    const left = await this.evalute(ast.left);
    const right = await this.evalute(ast.right);

    // todo 如果是日期的对比，这个地方可以优化一下。

    return left <= right;
  }

  async ge(ast: {left: any; right: any}) {
    const left = await this.evalute(ast.left);
    const right = await this.evalute(ast.right);

    // todo 如果是日期的对比，这个地方可以优化一下。

    return left >= right;
  }

  async eq(ast: {left: any; right: any}) {
    const left = await this.evalute(ast.left);
    const right = await this.evalute(ast.right);

    // todo 如果是日期的对比，这个地方可以优化一下。

    return left == right;
  }

  async ne(ast: {left: any; right: any}) {
    const left = await this.evalute(ast.left);
    const right = await this.evalute(ast.right);

    // todo 如果是日期的对比，这个地方可以优化一下。

    return left != right;
  }

  async streq(ast: {left: any; right: any}) {
    const left = await this.evalute(ast.left);
    const right = await this.evalute(ast.right);

    // todo 如果是日期的对比，这个地方可以优化一下。

    return left === right;
  }

  async strneq(ast: {left: any; right: any}) {
    const left = await this.evalute(ast.left);
    const right = await this.evalute(ast.right);

    // todo 如果是日期的对比，这个地方可以优化一下。

    return left !== right;
  }

  async binary(ast: {op: '&' | '^' | '|'; left: any; right: any}) {
    const left = await this.evalute(ast.left);
    const right = await this.evalute(ast.right);

    if (ast.op === '&') {
      return left & right;
    } else if (ast.op === '^') {
      return left ^ right;
    } else {
      return left | right;
    }
  }

  async and(ast: {left: any; right: any}) {
    const left = await this.evalute(ast.left);
    return left && this.evalute(ast.right);
  }

  async or(ast: {left: any; right: any}) {
    const left = await this.evalute(ast.left);
    return left || this.evalute(ast.right);
  }

  array(ast: {type: 'array'; members: Array<any>}) {
    return runSequence(ast.members, member => this.evalute(member));
  }

  async object(ast: {members: Array<{key: string; value: any}>}) {
    let object: any = {};
    await ast.members.reduce(
      async (promise: any, {key, value}: any, index: number) => {
        await promise;
        const objKey = await this.evalute(key);
        const objVal = await this.evalute(value);
        object[objKey] = objVal;
      },
      Promise.resolve()
    );

    return object;
  }

  async conditional(ast: {
    type: 'conditional';
    test: any;
    consequent: any;
    alternate: any;
  }) {
    return (await this.evalute(ast.test))
      ? await this.evalute(ast.consequent)
      : await this.evalute(ast.alternate);
  }

  async funcCall(this: any, ast: {identifier: string; args: Array<any>}) {
    const fnName = `fn${ast.identifier}`;
    const fn =
      this.functions[fnName] ||
      this[fnName] ||
      (this.filters.hasOwnProperty(ast.identifier) &&
        this.filters[ast.identifier]);

    if (!fn) {
      throw new FormulaEvalError(`${ast.identifier}函数没有定义`);
    }

    let args: Array<any> = ast.args;

    // 逻辑函数特殊处理，因为有时候有些运算是可以跳过的。
    if (~['IF', 'AND', 'OR', 'XOR', 'IFS'].indexOf(ast.identifier)) {
      args = args.map(a => () => this.evalute(a));
    } else {
      args = await runSequence(args, a => this.evalute(a));
    }

    return fn.apply(this, args);
  }

  async callAnonymousFunction(
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
    const result = await this.evalute(ast.return);
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
  async fnIF(
    condition: () => any,
    trueValue: () => any,
    falseValue: () => any
  ) {
    return (await condition()) ? await trueValue() : await falseValue();
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
  async fnAND(...condtions: Array<() => any>) {
    if (!condtions.length) {
      return false;
    }

    return condtions.reduce(async (promise, c) => {
      const result = await promise;
      if (result) {
        return c();
      }
      return result;
    }, Promise.resolve(true));
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
  async fnOR(...condtions: Array<() => any>) {
    if (!condtions.length) {
      return false;
    }

    return condtions.reduce(async (promise, c) => {
      const result = await promise;
      if (result) {
        return true;
      }
      return c();
    }, Promise.resolve(false));
  }

  /**
   * 异或处理，多个表达式组中存在奇数个真时认为真。
   *
   * @example XOR(condition1, condition2)
   * @param {expression} condition1 - 条件表达式1
   * @param {expression} condition2 - 条件表达式2
   * @namespace 逻辑函数
   *
   * @returns {boolean}
   */
  async fnXOR(...condtions: Array<() => any>) {
    if (!condtions.length) {
      return false;
    }

    return !!(
      (await runSequence(condtions, c => c())).filter(item => item).length % 2
    );
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
  async fnIFS(...args: Array<() => any>) {
    if (args.length % 2) {
      args.splice(args.length - 1, 0, () => true);
    }

    while (args.length) {
      const c = args.shift()!;
      const v = args.shift()!;

      if (await c()) {
        return await v();
      }
    }
    return;
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

    return (Array.isArray(value) ? value : []).reduce(
      async (promise, item, index) => {
        const arr = await promise;
        arr.push(await this.callAnonymousFunction(iterator, [item, index]));
        return arr;
      },
      Promise.resolve([])
    );
  }

  /**
   * 数据做数据过滤，需要搭配箭头函数一起使用，注意箭头函数只支持单表达式用法。
   * 将第二个箭头函数返回为 false 的成员过滤掉。
   *
   * @param {Array<any>} arr 数组
   * @param {Function<any>} iterator 箭头函数
   * @namespace 数组
   * @example ARRAYFILTER(arr, item => item)
   * @returns {boolean} 结果
   */
  async fnARRAYFILTER(value: any, iterator: any) {
    if (!iterator || iterator.type !== 'anonymous_function') {
      throw new Error('expected an anonymous function get ' + iterator);
    }

    return await (Array.isArray(value) ? value : []).reduce(
      async (promise, item, index) => {
        let arr = await promise;
        const hit = await this.callAnonymousFunction(iterator, [item, index]);

        if (hit) {
          arr.push(item);
        }

        return arr;
      },
      Promise.resolve([])
    );
  }

  /**
   * 数据做数据查找，需要搭配箭头函数一起使用，注意箭头函数只支持单表达式用法。
   * 找出第二个箭头函数返回为 true 的成员的索引。
   *
   * 示例：
   *
   * ARRAYFINDINDEX([0, 2, false], item => item === 2) 得到 1
   *
   * @param {Array<any>} arr 数组
   * @param {Function<any>} iterator 箭头函数
   * @namespace 数组
   * @example ARRAYFINDINDEX(arr, item => item === 2)
   * @returns {number} 结果
   */
  async fnARRAYFINDINDEX(arr: any[], iterator: any) {
    if (!iterator || iterator.type !== 'anonymous_function') {
      throw new Error('expected an anonymous function get ' + iterator);
    }

    let hitIndex = -1;
    const items = Array.isArray(arr) ? arr : [];

    for (const [index, item] of items.entries()) {
      const hit = await this.callAnonymousFunction(iterator, [item, index]);
      if (hit) {
        hitIndex = index;
        break;
      }
    }

    return hitIndex;
  }

  /**
   * 数据做数据查找，需要搭配箭头函数一起使用，注意箭头函数只支持单表达式用法。
   * 找出第二个箭头函数返回为 true 的成员。
   *
   * 示例：
   *
   * ARRAYFIND([0, 2, false], item => item === 2) 得到 2
   *
   * @param {Array<any>} arr 数组
   * @param {Function<any>} iterator 箭头函数
   * @namespace 数组
   * @example ARRAYFIND(arr, item => item === 2)
   * @returns {any} 结果
   */
  async fnARRAYFIND(arr: any[], iterator: any) {
    if (!iterator || iterator.type !== 'anonymous_function') {
      throw new Error('expected an anonymous function get ' + iterator);
    }

    let hitItem = undefined;
    const items = Array.isArray(arr) ? arr : [];

    for (const [index, item] of items.entries()) {
      const hit = await this.callAnonymousFunction(iterator, [item, index]);
      if (hit) {
        hitItem = item;
        break;
      }
    }

    return hitItem;
  }

  /**
   * 数据做数据遍历判断，需要搭配箭头函数一起使用，注意箭头函数只支持单表达式用法。
   * 判断第二个箭头函数是否存在返回为 true 的成员。
   *
   * 示例：
   *
   * ARRAYSOME([0, 2, false], item => item === 2) 得到 true
   *
   * @param {Array<any>} arr 数组
   * @param {Function<any>} iterator 箭头函数
   * @namespace 数组
   * @example ARRAYSOME(arr, item => item === 2)
   * @returns {boolean} 结果
   */
  async fnARRAYSOME(arr: any[], iterator: any) {
    if (!iterator || iterator.type !== 'anonymous_function') {
      throw new Error('expected an anonymous function get ' + iterator);
    }

    let result = await (Array.isArray(arr) ? arr : []).reduce(
      async (promise: any, item: any, index: number) => {
        const prev = await promise;
        const hit = await this.callAnonymousFunction(iterator, [item, index]);
        return prev || hit;
      },
      Promise.resolve(false)
    );

    return result;
  }

  /**
   * 数据做数据遍历判断，需要搭配箭头函数一起使用，注意箭头函数只支持单表达式用法。
   * 判断第二个箭头函数返回是否都为 true。
   *
   * 示例：
   *
   * ARRAYEVERY([0, 2, false], item => item === 2) 得到 false
   *
   * @param {Array<any>} arr 数组
   * @param {Function<any>} iterator 箭头函数
   * @namespace 数组
   * @example ARRAYEVERY(arr, item => item === 2)
   * @returns {boolean} 结果
   */
  async fnARRAYEVERY(arr: any[], iterator: any) {
    if (!iterator || iterator.type !== 'anonymous_function') {
      throw new Error('expected an anonymous function get ' + iterator);
    }

    let result = await (Array.isArray(arr) ? arr : []).reduce(
      async (promise: any, item: any, index: number) => {
        const prev = await promise;
        const hit = await this.callAnonymousFunction(iterator, [item, index]);

        return prev && hit;
      },
      Promise.resolve(true)
    );

    return result;
  }
}
