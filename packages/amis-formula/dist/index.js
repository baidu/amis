/**
 * amis-formula v2.0.0-beta.0
 * Copyright 2021-2022 fex
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var moment = require('moment');
var upperFirst = require('lodash/upperFirst');
var padStart = require('lodash/padStart');
var capitalize = require('lodash/capitalize');
var escape = require('lodash/escape');
var truncate = require('lodash/truncate');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var moment__default = /*#__PURE__*/_interopDefaultLegacy(moment);
var upperFirst__default = /*#__PURE__*/_interopDefaultLegacy(upperFirst);
var padStart__default = /*#__PURE__*/_interopDefaultLegacy(padStart);
var capitalize__default = /*#__PURE__*/_interopDefaultLegacy(capitalize);
var escape__default = /*#__PURE__*/_interopDefaultLegacy(escape);
var truncate__default = /*#__PURE__*/_interopDefaultLegacy(truncate);

/**
 * @file 公式内置函数
 */
var Evaluator = /** @class */ (function () {
    function Evaluator(context, options) {
        if (options === void 0) { options = {
            defaultFilter: 'html'
        }; }
        this.options = options;
        this.functions = {};
        this.contextStack = [];
        this.context = context;
        this.contextStack.push(function (varname) {
            return varname === '&' ? context : context === null || context === void 0 ? void 0 : context[varname];
        });
        this.filters = tslib.__assign(tslib.__assign(tslib.__assign({}, Evaluator.defaultFilters), this.filters), options === null || options === void 0 ? void 0 : options.filters);
        this.functions = tslib.__assign(tslib.__assign({}, this.functions), options === null || options === void 0 ? void 0 : options.functions);
    }
    Evaluator.setDefaultFilters = function (filters) {
        Evaluator.defaultFilters = tslib.__assign(tslib.__assign({}, Evaluator.defaultFilters), filters);
    };
    // 主入口
    Evaluator.prototype.evalute = function (ast) {
        if (ast && ast.type) {
            var name = ast.type.replace(/(?:_|\-)(\w)/g, function (_, l) {
                return l.toUpperCase();
            });
            var fn = this.functions[name] || this[name];
            if (!fn) {
                throw new Error("".concat(ast.type, " unkown."));
            }
            return fn.call(this, ast);
        }
        else {
            return ast;
        }
    };
    Evaluator.prototype.document = function (ast) {
        var _this = this;
        if (!ast.body.length) {
            return undefined;
        }
        var isString = ast.body.length > 1;
        var content = ast.body.map(function (item) {
            var result = _this.evalute(item);
            if (isString && result == null) {
                // 不要出现 undefined, null 之类的文案
                return '';
            }
            return result;
        });
        return content.length === 1 ? content[0] : content.join('');
    };
    Evaluator.prototype.filter = function (ast) {
        var _this = this;
        var input = this.evalute(ast.input);
        var filters = ast.filters.concat();
        var context = {
            filter: undefined,
            data: this.context,
            restFilters: filters
        };
        while (filters.length) {
            var filter = filters.shift();
            var fn = this.filters[filter.name];
            if (!fn) {
                throw new Error("filter `".concat(filter.name, "` not exits"));
            }
            context.filter = filter;
            input = fn.apply(context, [input].concat(filter.args.map(function (item) {
                if ((item === null || item === void 0 ? void 0 : item.type) === 'mixed') {
                    return item.body
                        .map(function (item) {
                        return typeof item === 'string' ? item : _this.evalute(item);
                    })
                        .join('');
                }
                else if (item.type) {
                    return _this.evalute(item);
                }
                return item;
            })));
        }
        return input;
    };
    Evaluator.prototype.raw = function (ast) {
        return ast.value;
    };
    Evaluator.prototype.script = function (ast) {
        var _a;
        var defaultFilter = this.options.defaultFilter;
        // 只给简单的变量取值用法自动补fitler
        if (defaultFilter && ~['getter', 'variable'].indexOf((_a = ast.body) === null || _a === void 0 ? void 0 : _a.type)) {
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
    };
    Evaluator.prototype.expressionList = function (ast) {
        var _this = this;
        return ast.body.reduce(function (prev, current) { return _this.evalute(current); });
    };
    Evaluator.prototype.template = function (ast) {
        var _this = this;
        return ast.body.map(function (arg) { return _this.evalute(arg); }).join('');
    };
    Evaluator.prototype.templateRaw = function (ast) {
        return ast.value;
    };
    // 下标获取
    Evaluator.prototype.getter = function (ast) {
        var _a;
        var host = this.evalute(ast.host);
        var key = this.evalute(ast.key);
        if (typeof key === 'undefined' && ((_a = ast.key) === null || _a === void 0 ? void 0 : _a.type) === 'variable') {
            key = ast.key.name;
        }
        return host === null || host === void 0 ? void 0 : host[key];
    };
    // 位操作如 +2 ~3 !
    Evaluator.prototype.unary = function (ast) {
        var value = this.evalute(ast.value);
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
    };
    Evaluator.prototype.formatNumber = function (value, int) {
        if (int === void 0) { int = false; }
        var typeName = typeof value;
        if (typeName === 'string') {
            return (int ? parseInt(value, 10) : parseFloat(value)) || 0;
        }
        else if (typeName === 'number' && int) {
            return Math.round(value);
        }
        return value !== null && value !== void 0 ? value : 0;
    };
    Evaluator.prototype.power = function (ast) {
        var left = this.evalute(ast.left);
        var right = this.evalute(ast.right);
        return Math.pow(this.formatNumber(left), this.formatNumber(right));
    };
    Evaluator.prototype.multiply = function (ast) {
        var left = this.evalute(ast.left);
        var right = this.evalute(ast.right);
        return stripNumber(this.formatNumber(left) * this.formatNumber(right));
    };
    Evaluator.prototype.divide = function (ast) {
        var left = this.evalute(ast.left);
        var right = this.evalute(ast.right);
        return stripNumber(this.formatNumber(left) / this.formatNumber(right));
    };
    Evaluator.prototype.remainder = function (ast) {
        var left = this.evalute(ast.left);
        var right = this.evalute(ast.right);
        return this.formatNumber(left) % this.formatNumber(right);
    };
    Evaluator.prototype.add = function (ast) {
        var left = this.evalute(ast.left);
        var right = this.evalute(ast.right);
        return stripNumber(this.formatNumber(left) + this.formatNumber(right));
    };
    Evaluator.prototype.minus = function (ast) {
        var left = this.evalute(ast.left);
        var right = this.evalute(ast.right);
        return stripNumber(this.formatNumber(left) - this.formatNumber(right));
    };
    Evaluator.prototype.shift = function (ast) {
        var left = this.evalute(ast.left);
        var right = this.formatNumber(this.evalute(ast.right), true);
        if (ast.op === '<<') {
            return left << right;
        }
        else if (ast.op == '>>') {
            return left >> right;
        }
        else {
            return left >>> right;
        }
    };
    Evaluator.prototype.lt = function (ast) {
        var left = this.evalute(ast.left);
        var right = this.evalute(ast.right);
        // todo 如果是日期的对比，这个地方可以优化一下。
        return left < right;
    };
    Evaluator.prototype.gt = function (ast) {
        var left = this.evalute(ast.left);
        var right = this.evalute(ast.right);
        // todo 如果是日期的对比，这个地方可以优化一下。
        return left > right;
    };
    Evaluator.prototype.le = function (ast) {
        var left = this.evalute(ast.left);
        var right = this.evalute(ast.right);
        // todo 如果是日期的对比，这个地方可以优化一下。
        return left <= right;
    };
    Evaluator.prototype.ge = function (ast) {
        var left = this.evalute(ast.left);
        var right = this.evalute(ast.right);
        // todo 如果是日期的对比，这个地方可以优化一下。
        return left >= right;
    };
    Evaluator.prototype.eq = function (ast) {
        var left = this.evalute(ast.left);
        var right = this.evalute(ast.right);
        // todo 如果是日期的对比，这个地方可以优化一下。
        return left == right;
    };
    Evaluator.prototype.ne = function (ast) {
        var left = this.evalute(ast.left);
        var right = this.evalute(ast.right);
        // todo 如果是日期的对比，这个地方可以优化一下。
        return left != right;
    };
    Evaluator.prototype.streq = function (ast) {
        var left = this.evalute(ast.left);
        var right = this.evalute(ast.right);
        // todo 如果是日期的对比，这个地方可以优化一下。
        return left === right;
    };
    Evaluator.prototype.strneq = function (ast) {
        var left = this.evalute(ast.left);
        var right = this.evalute(ast.right);
        // todo 如果是日期的对比，这个地方可以优化一下。
        return left !== right;
    };
    Evaluator.prototype.binary = function (ast) {
        var left = this.evalute(ast.left);
        var right = this.evalute(ast.right);
        if (ast.op === '&') {
            return left & right;
        }
        else if (ast.op === '^') {
            return left ^ right;
        }
        else {
            return left | right;
        }
    };
    Evaluator.prototype.and = function (ast) {
        var left = this.evalute(ast.left);
        return left && this.evalute(ast.right);
    };
    Evaluator.prototype.or = function (ast) {
        var left = this.evalute(ast.left);
        return left || this.evalute(ast.right);
    };
    Evaluator.prototype.number = function (ast) {
        // todo 以后可以在这支持大数字。
        return ast.value;
    };
    Evaluator.prototype.nsVariable = function (ast) {
        if (ast.namespace === 'window') {
            this.contextStack.push(function (name) {
                return name === '&' ? window : window[name];
            });
        }
        else if (ast.namespace === 'cookie') {
            this.contextStack.push(function (name) {
                return getCookie(name);
            });
        }
        else if (ast.namespace === 'ls' || ast.namespace === 'ss') {
            var ns_1 = ast.namespace;
            this.contextStack.push(function (name) {
                var raw = ns_1 === 'ss'
                    ? sessionStorage.getItem(name)
                    : localStorage.getItem(name);
                if (typeof raw === 'string') {
                    // 判断字符串是否一个纯数字字符串，如果是，则对比parse后的值和原值是否相同，
                    // 如果不同则返回原值，因为原值如果是一个很长的纯数字字符串，则 parse 后可能会丢失精度
                    if (/^\d+$/.test(raw)) {
                        var parsed = JSON.parse(raw);
                        return "".concat(parsed) === raw ? parsed : raw;
                    }
                    return parseJson(raw, raw);
                }
                return undefined;
            });
        }
        else {
            throw new Error('Unsupported namespace: ' + ast.namespace);
        }
        var result = this.evalute(ast.body);
        this.contextStack.pop();
        return result;
    };
    Evaluator.prototype.variable = function (ast) {
        var contextGetter = this.contextStack[this.contextStack.length - 1];
        return contextGetter(ast.name);
    };
    Evaluator.prototype.identifier = function (ast) {
        return ast.name;
    };
    Evaluator.prototype.array = function (ast) {
        var _this = this;
        return ast.members.map(function (member) { return _this.evalute(member); });
    };
    Evaluator.prototype.literal = function (ast) {
        return ast.value;
    };
    Evaluator.prototype.string = function (ast) {
        return ast.value;
    };
    Evaluator.prototype.object = function (ast) {
        var _this = this;
        var object = {};
        ast.members.forEach(function (_a) {
            var key = _a.key, value = _a.value;
            object[_this.evalute(key)] = _this.evalute(value);
        });
        return object;
    };
    Evaluator.prototype.conditional = function (ast) {
        return this.evalute(ast.test)
            ? this.evalute(ast.consequent)
            : this.evalute(ast.alternate);
    };
    Evaluator.prototype.funcCall = function (ast) {
        var _this = this;
        var fnName = "fn".concat(ast.identifier);
        var fn = this.functions[fnName] || this[fnName] || this.filters[ast.identifier];
        if (!fn) {
            throw new Error("".concat(ast.identifier, "\u51FD\u6570\u6CA1\u6709\u5B9A\u4E49"));
        }
        var args = ast.args;
        // 逻辑函数特殊处理，因为有时候有些运算是可以跳过的。
        if (~['IF', 'AND', 'OR', 'XOR', 'IFS'].indexOf(ast.identifier)) {
            args = args.map(function (a) { return function () { return _this.evalute(a); }; });
        }
        else {
            args = args.map(function (a) { return _this.evalute(a); });
        }
        return fn.apply(this, args);
    };
    Evaluator.prototype.anonymousFunction = function (ast) {
        return ast;
    };
    Evaluator.prototype.callAnonymousFunction = function (ast, args) {
        var ctx = createObject(this.contextStack[this.contextStack.length - 1]('&') || {}, {});
        ast.args.forEach(function (arg) {
            if (arg.type !== 'variable') {
                throw new Error('expected a variable as argument');
            }
            ctx[arg.name] = args.shift();
        });
        this.contextStack.push(function (varName) {
            return varName === '&' ? ctx : ctx[varName];
        });
        var result = this.evalute(ast.return);
        this.contextStack.pop();
        return result;
    };
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
    Evaluator.prototype.fnIF = function (condition, trueValue, falseValue) {
        return condition() ? trueValue() : falseValue();
    };
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
    Evaluator.prototype.fnAND = function () {
        var condtions = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            condtions[_i] = arguments[_i];
        }
        return condtions.every(function (c) { return c(); });
    };
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
    Evaluator.prototype.fnOR = function () {
        var condtions = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            condtions[_i] = arguments[_i];
        }
        return condtions.some(function (c) { return c(); });
    };
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
    Evaluator.prototype.fnXOR = function (c1, c2) {
        return !!c1() === !!c2();
    };
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
    Evaluator.prototype.fnIFS = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (args.length % 2) {
            args.splice(args.length - 1, 0, function () { return true; });
        }
        while (args.length) {
            var c = args.shift();
            var v = args.shift();
            if (c()) {
                return v();
            }
        }
        return;
    };
    /**
     * 返回传入数字的绝对值
     *
     * @example ABS(num)
     * @param {number} num - 数值
     * @namespace 数学函数
     *
     * @returns {number} 传入数值的绝对值
     */
    Evaluator.prototype.fnABS = function (a) {
        a = this.formatNumber(a);
        return Math.abs(a);
    };
    /**
     * 获取最大值，如果只有一个参数且是数组，则计算这个数组内的值
     *
     * @example MAX(num1, num2, ...numN)
     * @param {...number} num - 数值
     * @namespace 数学函数
     *
     * @returns {number} 所有传入值中最大的那个
     */
    Evaluator.prototype.fnMAX = function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var arr = args;
        if (args.length === 1 && Array.isArray(args[0])) {
            arr = args[0];
        }
        return Math.max.apply(Math, arr.map(function (item) { return _this.formatNumber(item); }));
    };
    /**
     * 获取最小值，如果只有一个参数且是数组，则计算这个数组内的值
     *
     * @example MIN(num1, num2, ...numN)
     * @param {...number} num - 数值
     * @namespace 数学函数
     *
     * @returns {number} 所有传入值中最小的那个
     */
    Evaluator.prototype.fnMIN = function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var arr = args;
        if (args.length === 1 && Array.isArray(args[0])) {
            arr = args[0];
        }
        return Math.min.apply(Math, arr.map(function (item) { return _this.formatNumber(item); }));
    };
    /**
     * 求和，如果只有一个参数且是数组，则计算这个数组内的值
     *
     * @example SUM(num1, num2, ...numN)
     * @param {...number} num - 数值
     * @namespace 数学函数
     *
     * @returns {number} 所有传入数值的总和
     */
    Evaluator.prototype.fnSUM = function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var arr = args;
        if (args.length === 1 && Array.isArray(args[0])) {
            arr = args[0];
        }
        return arr.reduce(function (sum, a) { return sum + _this.formatNumber(a) || 0; }, 0);
    };
    /**
     * 将数值向下取整为最接近的整数
     *
     * @example INT(num)
     * @param {number} num - 数值
     * @namespace 数学函数
     *
     * @returns {number} 数值对应的整形
     */
    Evaluator.prototype.fnINT = function (n) {
        return Math.floor(this.formatNumber(n));
    };
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
    Evaluator.prototype.fnMOD = function (a, b) {
        return this.formatNumber(a) % this.formatNumber(b);
    };
    /**
     * 圆周率 3.1415...
     *
     * @example PI()
     * @namespace 数学函数
     *
     * @returns {number} 圆周率数值
     */
    Evaluator.prototype.fnPI = function () {
        return Math.PI;
    };
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
    Evaluator.prototype.fnROUND = function (a, b) {
        a = this.formatNumber(a);
        b = this.formatNumber(b);
        var bResult = Math.round(b);
        if (bResult) {
            var c = Math.pow(10, bResult);
            return Math.round(a * c) / c;
        }
        return Math.round(a);
    };
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
    Evaluator.prototype.fnFLOOR = function (a, b) {
        a = this.formatNumber(a);
        b = this.formatNumber(b);
        var bResult = Math.round(b);
        if (bResult) {
            var c = Math.pow(10, bResult);
            return Math.floor(a * c) / c;
        }
        return Math.floor(a);
    };
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
    Evaluator.prototype.fnCEIL = function (a, b) {
        a = this.formatNumber(a);
        b = this.formatNumber(b);
        var bResult = Math.round(b);
        if (bResult) {
            var c = Math.pow(10, bResult);
            return Math.ceil(a * c) / c;
        }
        return Math.ceil(a);
    };
    /**
     * 开平方，参数 number 为非负数
     *
     * @example SQRT(num)
     * @param {number} num - 要处理的数字
     * @namespace 数学函数
     *
     * @returns {number} 开平方的结果
     */
    Evaluator.prototype.fnSQRT = function (n) {
        return Math.sqrt(this.formatNumber(n));
    };
    /**
     * 返回所有参数的平均值，如果只有一个参数且是数组，则计算这个数组内的值
     *
     * @example AVG(num1, num2, ...numN)
     * @param {...number} num - 要处理的数字
     * @namespace 数学函数
     *
     * @returns {number} 所有数值的平均值
     */
    Evaluator.prototype.fnAVG = function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var arr = args;
        if (args.length === 1 && Array.isArray(args[0])) {
            arr = args[0];
        }
        return (this.fnSUM.apply(this, arr.map(function (item) { return _this.formatNumber(item); })) / arr.length);
    };
    /**
     * 返回数据点与数据均值点之差（数据偏差）的平方和，如果只有一个参数且是数组，则计算这个数组内的值
     *
     * @example DEVSQ(num1, num2, ...numN)
     * @param {...number} num - 要处理的数字
     * @namespace 数学函数
     *
     * @returns {number} 所有数值的平均值
     */
    Evaluator.prototype.fnDEVSQ = function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (args.length === 0) {
            return null;
        }
        var arr = args;
        if (args.length === 1 && Array.isArray(args[0])) {
            arr = args[0];
        }
        var nums = arr.map(function (item) { return _this.formatNumber(item); });
        var sum = nums.reduce(function (sum, a) { return sum + a || 0; }, 0);
        var mean = sum / nums.length;
        var result = 0;
        for (var _a = 0, nums_1 = nums; _a < nums_1.length; _a++) {
            var num = nums_1[_a];
            result += Math.pow(num - mean, 2);
        }
        return result;
    };
    /**
     * 数据点到其算术平均值的绝对偏差的平均值
     *
     * @example AVEDEV(num1, num2, ...numN)
     * @param {...number} num - 要处理的数字
     * @namespace 数学函数
     *
     * @returns {number} 所有数值的平均值
     */
    Evaluator.prototype.fnAVEDEV = function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (args.length === 0) {
            return null;
        }
        var arr = args;
        if (args.length === 1 && Array.isArray(args[0])) {
            arr = args[0];
        }
        var nums = arr.map(function (item) { return _this.formatNumber(item); });
        var sum = nums.reduce(function (sum, a) { return sum + a || 0; }, 0);
        var mean = sum / nums.length;
        var result = 0;
        for (var _a = 0, nums_2 = nums; _a < nums_2.length; _a++) {
            var num = nums_2[_a];
            result += Math.abs(num - mean);
        }
        return result / nums.length;
    };
    /**
     * 数据点的调和平均值，如果只有一个参数且是数组，则计算这个数组内的值
     *
     * @example HARMEAN(num1, num2, ...numN)
     * @param {...number} num - 要处理的数字
     * @namespace 数学函数
     *
     * @returns {number} 所有数值的平均值
     */
    Evaluator.prototype.fnHARMEAN = function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (args.length === 0) {
            return null;
        }
        var arr = args;
        if (args.length === 1 && Array.isArray(args[0])) {
            arr = args[0];
        }
        var nums = arr.map(function (item) { return _this.formatNumber(item); });
        var den = 0;
        for (var _a = 0, nums_3 = nums; _a < nums_3.length; _a++) {
            var num = nums_3[_a];
            den += 1 / num;
        }
        return nums.length / den;
    };
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
    Evaluator.prototype.fnLARGE = function (nums, k) {
        var _this = this;
        if (nums.length === 0) {
            return null;
        }
        var numsFormat = nums.map(function (item) { return _this.formatNumber(item); });
        if (k < 0 || numsFormat.length < k) {
            return null;
        }
        return numsFormat.sort(function (a, b) {
            return b - a;
        })[k - 1];
    };
    /**
     * 将数值转为中文大写金额
     *
     * @example UPPERMONEY(num)
     * @param {number} num - 要处理的数字
     * @namespace 数学函数
     *
     * @returns {string} 数值中文大写字符
     */
    Evaluator.prototype.fnUPPERMONEY = function (n) {
        n = this.formatNumber(n);
        var fraction = ['角', '分'];
        var digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
        var unit = [
            ['元', '万', '亿'],
            ['', '拾', '佰', '仟']
        ];
        var head = n < 0 ? '欠' : '';
        n = Math.abs(n);
        var s = '';
        for (var i = 0; i < fraction.length; i++) {
            s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
        }
        s = s || '整';
        n = Math.floor(n);
        for (var i = 0; i < unit[0].length && n > 0; i++) {
            var p = '';
            for (var j = 0; j < unit[1].length && n > 0; j++) {
                p = digit[n % 10] + unit[1][j] + p;
                n = Math.floor(n / 10);
            }
            s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
        }
        return (head +
            s
                .replace(/(零.)*零元/, '元')
                .replace(/(零.)+/g, '零')
                .replace(/^整$/, '零元整'));
    };
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
    Evaluator.prototype.fnRAND = function () {
        return Math.random();
    };
    /**
     * 取数据最后一个
     *
     * @example LAST(array)
     * @param {...number} arr - 要处理的数组
     * @namespace 数学函数
     *
     * @returns {any} 最后一个值
     */
    Evaluator.prototype.fnLAST = function (arr) {
        return arr.length ? arr[arr.length - 1] : null;
    };
    // 文本函数
    Evaluator.prototype.normalizeText = function (raw) {
        if (raw instanceof Date) {
            return moment__default["default"](raw).format();
        }
        return "".concat(raw);
    };
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
    Evaluator.prototype.fnLEFT = function (text, len) {
        text = this.normalizeText(text);
        return text.substring(0, len);
    };
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
    Evaluator.prototype.fnRIGHT = function (text, len) {
        text = this.normalizeText(text);
        return text.substring(text.length - len, text.length);
    };
    /**
     * 计算文本的长度
     *
     * @example LEN(text)
     * @param {string} text - 要处理的文本
     * @namespace 文本函数
     *
     * @returns {number} 长度
     */
    Evaluator.prototype.fnLEN = function (text) {
        text = this.normalizeText(text);
        return text === null || text === void 0 ? void 0 : text.length;
    };
    /**
     * 计算文本集合中所有文本的长度
     *
     * @example LENGTH(textArr)
     * @param {string[]} textArr - 要处理的文本集合
     * @namespace 文本函数
     *
     * @returns {number[]} 长度集合
     */
    Evaluator.prototype.fnLENGTH = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this.fnLEN.call(this, args);
    };
    /**
     * 判断文本是否为空
     *
     * @example ISEMPTY(text)
     * @param {string} text - 要处理的文本
     * @namespace 文本函数
     *
     * @returns {boolean} 判断结果
     */
    Evaluator.prototype.fnISEMPTY = function (text) {
        return !text || !String(text).trim();
    };
    /**
     * 将多个传入值连接成文本
     *
     * @example CONCATENATE(text1, text2, ...textN)
     * @param {...string} text - 文本集合
     * @namespace 文本函数
     *
     * @returns {string} 连接后的文本
     */
    Evaluator.prototype.fnCONCATENATE = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return args.join('');
    };
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
    Evaluator.prototype.fnCHAR = function (code) {
        return String.fromCharCode(code);
    };
    /**
     * 将传入文本转成小写
     *
     * @example LOWER(text)
     * @param {string} text - 文本
     * @namespace 文本函数
     *
     * @returns {string} 结果文本
     */
    Evaluator.prototype.fnLOWER = function (text) {
        text = this.normalizeText(text);
        return text.toLowerCase();
    };
    /**
     * 将传入文本转成大写
     *
     * @example UPPER(text)
     * @param {string} text - 文本
     * @namespace 文本函数
     *
     * @returns {string} 结果文本
     */
    Evaluator.prototype.fnUPPER = function (text) {
        text = this.normalizeText(text);
        return text.toUpperCase();
    };
    /**
     * 将传入文本首字母转成大写
     *
     * @example UPPERFIRST(text)
     * @param {string} text - 文本
     * @namespace 文本函数
     *
     * @returns {string} 结果文本
     */
    Evaluator.prototype.fnUPPERFIRST = function (text) {
        text = this.normalizeText(text);
        return upperFirst__default["default"](text);
    };
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
    Evaluator.prototype.fnPADSTART = function (text, num, pad) {
        text = this.normalizeText(text);
        return padStart__default["default"](text, num, pad);
    };
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
    Evaluator.prototype.fnCAPITALIZE = function (text) {
        text = this.normalizeText(text);
        return capitalize__default["default"](text);
    };
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
    Evaluator.prototype.fnESCAPE = function (text) {
        text = this.normalizeText(text);
        return escape__default["default"](text);
    };
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
    Evaluator.prototype.fnTRUNCATE = function (text, length) {
        text = this.normalizeText(text);
        return truncate__default["default"](text, { length: length });
    };
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
    Evaluator.prototype.fnBEFORELAST = function (text, delimiter) {
        if (delimiter === void 0) { delimiter = '.'; }
        text = this.normalizeText(text);
        return text.split(delimiter).slice(0, -1).join(delimiter) || text + '';
    };
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
    Evaluator.prototype.fnSPLIT = function (text, sep) {
        if (sep === void 0) { sep = ','; }
        text = this.normalizeText(text);
        return text.split(sep);
    };
    /**
     * 将文本去除前后空格
     *
     * @example TRIM(text)
     * @param {string} text - 文本
     * @namespace 文本函数
     *
     * @returns {string} 处理后的文本
     */
    Evaluator.prototype.fnTRIM = function (text) {
        text = this.normalizeText(text);
        return text.trim();
    };
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
    Evaluator.prototype.fnSTRIPTAG = function (text) {
        text = this.normalizeText(text);
        return text.replace(/<\/?[^>]+(>|$)/g, '');
    };
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
    Evaluator.prototype.fnLINEBREAK = function (text) {
        text = this.normalizeText(text);
        return text.replace(/(?:\r\n|\r|\n)/g, '<br/>');
    };
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
    Evaluator.prototype.fnSTARTSWITH = function (text, search) {
        if (!search) {
            return false;
        }
        text = this.normalizeText(text);
        return text.indexOf(search) === 0;
    };
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
    Evaluator.prototype.fnENDSWITH = function (text, search) {
        if (!search) {
            return false;
        }
        text = this.normalizeText(text);
        return text.indexOf(search, text.length - search.length) !== -1;
    };
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
    Evaluator.prototype.fnCONTAINS = function (text, search) {
        if (!search) {
            return false;
        }
        text = this.normalizeText(text);
        return !!~text.indexOf(search);
    };
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
    Evaluator.prototype.fnREPLACE = function (text, search, replace) {
        text = this.normalizeText(text);
        var result = text;
        while (true) {
            var idx = result.indexOf(search);
            if (!~idx) {
                break;
            }
            result =
                result.substring(0, idx) +
                    replace +
                    result.substring(idx + search.length);
        }
        return result;
    };
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
    Evaluator.prototype.fnSEARCH = function (text, search, start) {
        if (start === void 0) { start = 0; }
        text = this.normalizeText(text);
        start = this.formatNumber(start);
        var idx = text.indexOf(search, start);
        if (~idx) {
            return idx;
        }
        return -1;
    };
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
    Evaluator.prototype.fnMID = function (text, from, len) {
        text = this.normalizeText(text);
        return text.substring(from, from + len);
    };
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
    Evaluator.prototype.fnBASENAME = function (text) {
        text = this.normalizeText(text);
        return text.split(/[\\/]/).pop();
    };
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
    Evaluator.prototype.fnDATE = function (year, month, day, hour, minute, second) {
        if (month === undefined) {
            return new Date(year);
        }
        return new Date(year, month, day, hour, minute, second);
    };
    /**
     * 返回时间的时间戳
     *
     * @example TIMESTAMP(date[, format = "X"])
     * @namespace 日期函数
     * @param {date} date 日期对象
     * @param {string} format 时间戳格式，带毫秒传入 'x'。默认为 'X' 不带毫秒的。
     *
     * @returns {number} 时间戳
     */
    Evaluator.prototype.fnTIMESTAMP = function (date, format) {
        return parseInt(moment__default["default"](date).format(format === 'x' ? 'x' : 'X'), 10);
    };
    /**
     * 返回今天的日期
     *
     * @example TODAY()
     * @namespace 日期函数
     *
     * @returns {number} 日期
     */
    Evaluator.prototype.fnTODAY = function () {
        return new Date();
    };
    /**
     * 返回现在的日期
     *
     * @example NOW()
     * @namespace 日期函数
     *
     * @returns {number} 日期
     */
    Evaluator.prototype.fnNOW = function () {
        return new Date();
    };
    /**
     * 将日期转成日期字符串
     *
     * @example DATETOSTR(date[, format="YYYY-MM-DD HH:mm:ss"])
     * @namespace 日期函数
     * @param {date} date 日期对象
     * @param {string} format 日期格式，默认为 "YYYY-MM-DD HH:mm:ss"
     *
     * @returns {number} 日期字符串
     */
    Evaluator.prototype.fnDATETOSTR = function (date, format) {
        if (format === void 0) { format = 'YYYY-MM-DD HH:mm:ss'; }
        return moment__default["default"](date).format(format);
    };
    /**
     * 返回日期的指定范围的开端
     *
     * @namespace 日期函数
     * @example STARTOF(date[unit = "day"])
     * @param {date} date 日期对象
     * @param {string} unit 比如可以传入 'day'、'month'、'year' 或者 `week` 等等
     * @returns {date} 新的日期对象
     */
    Evaluator.prototype.fnSTARTOF = function (date, unit) {
        return moment__default["default"](date)
            .startOf(unit || 'day')
            .toDate();
    };
    /**
     * 返回日期的指定范围的末尾
     * @namespace 日期函数
     * @example ENDOF(date[unit = "day"])
     * @param {date} date 日期对象
     * @param {string} unit 比如可以传入 'day'、'month'、'year' 或者 `week` 等等
     * @returns {date} 新的日期对象
     */
    Evaluator.prototype.fnENDOF = function (date, unit) {
        return moment__default["default"](date)
            .endOf(unit || 'day')
            .toDate();
    };
    Evaluator.prototype.normalizeDate = function (raw) {
        if (typeof raw === 'string') {
            var formats = ['', 'YYYY-MM-DD HH:mm:ss'];
            while (formats.length) {
                var format = formats.shift();
                var date = moment__default["default"](raw, format);
                if (date.isValid()) {
                    return date.toDate();
                }
            }
        }
        else if (typeof raw === 'number') {
            return new Date(raw);
        }
        return raw;
    };
    /**
     * 返回日期的年份
     * @namespace 日期函数
     * @example YEAR(date)
     * @param {date} date 日期对象
     * @returns {number} 数值
     */
    Evaluator.prototype.fnYEAR = function (date) {
        date = this.normalizeDate(date);
        return date.getFullYear();
    };
    /**
     * 返回日期的月份，这里就是自然月份。
     *
     * @namespace 日期函数
     * @example MONTH(date)
     * @param {date} date 日期对象
     * @returns {number} 数值
     */
    Evaluator.prototype.fnMONTH = function (date) {
        date = this.normalizeDate(date);
        return date.getMonth() + 1;
    };
    /**
     * 返回日期的天
     * @namespace 日期函数
     * @example DAY(date)
     * @param {date} date 日期对象
     * @returns {number} 数值
     */
    Evaluator.prototype.fnDAY = function (date) {
        date = this.normalizeDate(date);
        return date.getDate();
    };
    /**
     * 返回日期的小时
     * @param {date} date 日期对象
     * @namespace 日期函数
     * @example HOUR(date)
     * @returns {number} 数值
     */
    Evaluator.prototype.fnHOUR = function (date) {
        date = this.normalizeDate(date);
        return date.getHours();
    };
    /**
     * 返回日期的分
     * @param {date} date 日期对象
     * @namespace 日期函数
     * @example MINUTE(date)
     * @returns {number} 数值
     */
    Evaluator.prototype.fnMINUTE = function (date) {
        date = this.normalizeDate(date);
        return date.getMinutes();
    };
    /**
     * 返回日期的秒
     * @param {date} date 日期对象
     * @namespace 日期函数
     * @example SECOND(date)
     * @returns {number} 数值
     */
    Evaluator.prototype.fnSECOND = function (date) {
        date = this.normalizeDate(date);
        return date.getSeconds();
    };
    /**
     * 返回两个日期相差多少年
     * @param {date} endDate 日期对象
     * @param {date} startDate 日期对象
     * @namespace 日期函数
     * @example YEARS(endDate, startDate)
     * @returns {number} 数值
     */
    Evaluator.prototype.fnYEARS = function (endDate, startDate) {
        endDate = this.normalizeDate(endDate);
        startDate = this.normalizeDate(startDate);
        return moment__default["default"](endDate).diff(moment__default["default"](startDate), 'year');
    };
    /**
     * 返回两个日期相差多少分钟
     * @param {date} endDate 日期对象
     * @param {date} startDate 日期对象
     * @namespace 日期函数
     * @example MINUTES(endDate, startDate)
     * @returns {number} 数值
     */
    Evaluator.prototype.fnMINUTES = function (endDate, startDate) {
        endDate = this.normalizeDate(endDate);
        startDate = this.normalizeDate(startDate);
        return moment__default["default"](endDate).diff(moment__default["default"](startDate), 'minutes');
    };
    /**
     * 返回两个日期相差多少天
     * @param {date} endDate 日期对象
     * @param {date} startDate 日期对象
     * @namespace 日期函数
     * @example DAYS(endDate, startDate)
     * @returns {number} 数值
     */
    Evaluator.prototype.fnDAYS = function (endDate, startDate) {
        endDate = this.normalizeDate(endDate);
        startDate = this.normalizeDate(startDate);
        return moment__default["default"](endDate).diff(moment__default["default"](startDate), 'days');
    };
    /**
     * 返回两个日期相差多少小时
     * @param {date} endDate 日期对象
     * @param {date} startDate 日期对象
     * @namespace 日期函数
     * @example HOURS(endDate, startDate)
     * @returns {number} 数值
     */
    Evaluator.prototype.fnHOURS = function (endDate, startDate) {
        endDate = this.normalizeDate(endDate);
        startDate = this.normalizeDate(startDate);
        return moment__default["default"](endDate).diff(moment__default["default"](startDate), 'hour');
    };
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
    Evaluator.prototype.fnDATEMODIFY = function (date, num, format) {
        date = this.normalizeDate(date);
        return moment__default["default"](date).add(num, format).toDate();
    };
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
    Evaluator.prototype.fnSTRTODATE = function (value, format) {
        if (format === void 0) { format = ''; }
        return moment__default["default"](value, format).toDate();
    };
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
    Evaluator.prototype.fnISBEFORE = function (a, b, unit) {
        if (unit === void 0) { unit = 'day'; }
        a = this.normalizeDate(a);
        b = this.normalizeDate(b);
        return moment__default["default"](a).isBefore(moment__default["default"](b), unit);
    };
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
    Evaluator.prototype.fnISAFTER = function (a, b, unit) {
        if (unit === void 0) { unit = 'day'; }
        a = this.normalizeDate(a);
        b = this.normalizeDate(b);
        return moment__default["default"](a).isAfter(moment__default["default"](b), unit);
    };
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
    Evaluator.prototype.fnISSAMEORBEFORE = function (a, b, unit) {
        if (unit === void 0) { unit = 'day'; }
        a = this.normalizeDate(a);
        b = this.normalizeDate(b);
        return moment__default["default"](a).isSameOrBefore(moment__default["default"](b), unit);
    };
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
    Evaluator.prototype.fnISSAMEORAFTER = function (a, b, unit) {
        if (unit === void 0) { unit = 'day'; }
        a = this.normalizeDate(a);
        b = this.normalizeDate(b);
        return moment__default["default"](a).isSameOrAfter(moment__default["default"](b), unit);
    };
    /**
     * 返回数组的长度
     *
     * @param {Array<any>} arr 数组
     * @namespace 数组
     * @example COUNT(arr)
     * @returns {boolean} 结果
     */
    Evaluator.prototype.fnCOUNT = function (value) {
        return Array.isArray(value) ? value.length : value ? 1 : 0;
    };
    /**
     * 数组做数据转换，需要搭配箭头函数一起使用，注意箭头函数只支持单表达式用法。
     *
     * @param {Array<any>} arr 数组
     * @param {Function<any>} iterator 箭头函数
     * @namespace 数组
     * @example ARRAYMAP(arr, item => item)
     * @returns {boolean} 结果
     */
    Evaluator.prototype.fnARRAYMAP = function (value, iterator) {
        var _this = this;
        if (!iterator || iterator.type !== 'anonymous_function') {
            throw new Error('expected an anonymous function get ' + iterator);
        }
        return (Array.isArray(value) ? value : []).map(function (item, index) {
            return _this.callAnonymousFunction(iterator, [item, index]);
        });
    };
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
    Evaluator.prototype.fnCOMPACT = function (arr) {
        if (Array.isArray(arr)) {
            var resIndex = 0;
            var result = [];
            for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
                var item = arr_1[_i];
                if (item) {
                    result[resIndex++] = item;
                }
            }
            return result;
        }
        else {
            return [];
        }
    };
    /**
     * 数组转成字符串
     *
     * 示例：
     *
     * JOIN(['a', 'b', 'c'], '~') 得到 'a~b~c'
     *
     * @param {Array<any>} arr 数组
     * @param { String} separator 分隔符
     * @namespace 数组
     * @example JOIN(arr, string)
     * @returns {String} 结果
     */
    Evaluator.prototype.fnJOIN = function (arr, separator) {
        if (separator === void 0) { separator = ''; }
        if (Array.isArray(arr)) {
            return arr.join(separator);
        }
        else {
            return '';
        }
    };
    Evaluator.defaultFilters = {};
    return Evaluator;
}());
function getCookie(name) {
    var value = "; ".concat(document.cookie);
    var parts = value.split("; ".concat(name, "="));
    if (parts.length === 2) {
        return parts.pop().split(';').shift();
    }
    return undefined;
}
function parseJson(str, defaultValue) {
    try {
        return JSON.parse(str);
    }
    catch (e) {
        return defaultValue;
    }
}
function stripNumber(number) {
    if (typeof number === 'number') {
        return parseFloat(number.toPrecision(12));
    }
    else {
        return number;
    }
}
function createObject(superProps, props, properties) {
    var obj = superProps
        ? Object.create(superProps, tslib.__assign(tslib.__assign({}, properties), { __super: {
                value: superProps,
                writable: false,
                enumerable: false
            } }))
        : Object.create(Object.prototype, properties);
    props && Object.keys(props).forEach(function (key) { return (obj[key] = props[key]); });
    return obj;
}

var TokenEnum;
(function (TokenEnum) {
    TokenEnum[TokenEnum["BooleanLiteral"] = 1] = "BooleanLiteral";
    TokenEnum[TokenEnum["RAW"] = 2] = "RAW";
    TokenEnum[TokenEnum["Variable"] = 3] = "Variable";
    TokenEnum[TokenEnum["OpenScript"] = 4] = "OpenScript";
    TokenEnum[TokenEnum["CloseScript"] = 5] = "CloseScript";
    TokenEnum[TokenEnum["EOF"] = 6] = "EOF";
    TokenEnum[TokenEnum["Identifier"] = 7] = "Identifier";
    TokenEnum[TokenEnum["Literal"] = 8] = "Literal";
    TokenEnum[TokenEnum["NumericLiteral"] = 9] = "NumericLiteral";
    TokenEnum[TokenEnum["Punctuator"] = 10] = "Punctuator";
    TokenEnum[TokenEnum["StringLiteral"] = 11] = "StringLiteral";
    TokenEnum[TokenEnum["RegularExpression"] = 12] = "RegularExpression";
    TokenEnum[TokenEnum["TemplateRaw"] = 13] = "TemplateRaw";
    TokenEnum[TokenEnum["TemplateLeftBrace"] = 14] = "TemplateLeftBrace";
    TokenEnum[TokenEnum["TemplateRightBrace"] = 15] = "TemplateRightBrace";
    TokenEnum[TokenEnum["OpenFilter"] = 16] = "OpenFilter";
    TokenEnum[TokenEnum["Char"] = 17] = "Char";
})(TokenEnum || (TokenEnum = {}));
var TokenName = {};
TokenName[TokenEnum.BooleanLiteral] = 'Boolean';
TokenName[TokenEnum.RAW] = 'Raw';
TokenName[TokenEnum.Variable] = 'Variable';
TokenName[TokenEnum.OpenScript] = 'OpenScript';
TokenName[TokenEnum.CloseScript] = 'CloseScript';
TokenName[TokenEnum.EOF] = 'EOF';
TokenName[TokenEnum.Identifier] = 'Identifier';
TokenName[TokenEnum.Literal] = 'Literal';
TokenName[TokenEnum.NumericLiteral] = 'Numeric';
TokenName[TokenEnum.Punctuator] = 'Punctuator';
TokenName[TokenEnum.StringLiteral] = 'String';
TokenName[TokenEnum.RegularExpression] = 'RegularExpression';
TokenName[TokenEnum.TemplateRaw] = 'TemplateRaw';
TokenName[TokenEnum.TemplateLeftBrace] = 'TemplateLeftBrace';
TokenName[TokenEnum.TemplateRightBrace] = 'TemplateRightBrace';
TokenName[TokenEnum.OpenFilter] = 'OpenFilter';
TokenName[TokenEnum.Char] = 'Char';
var mainStates = {
    START: 0,
    SCRIPT: 1,
    EXPRESSION: 2,
    BLOCK: 3,
    Template: 4,
    Filter: 5
};
var rawStates = {
    START: 0,
    ESCAPE: 1
};
var numberStates = {
    START: 0,
    ZERO: 1,
    DIGIT: 2,
    POINT: 3,
    DIGIT_FRACTION: 4,
    EXP: 5
};
var stringStates = {
    START: 0,
    START_QUOTE_OR_CHAR: 1,
    ESCAPE: 2
};
var punctuatorList = [
    '===',
    '!==',
    '>>>',
    '==',
    '!=',
    '<>',
    '<=',
    '>=',
    '||',
    '&&',
    '++',
    '--',
    '<<',
    '>>',
    '**',
    '+=',
    '*=',
    '/=',
    '<',
    '>',
    '=',
    '*',
    '/',
    '-',
    '+',
    '^',
    '!',
    '~',
    '%',
    '&',
    '|',
    '(',
    ')',
    '[',
    ']',
    '{',
    '}',
    '?',
    ':',
    ';',
    ',',
    '.',
    '$'
];
var escapes = {
    '"': 0,
    '\\': 1,
    '/': 2,
    'b': 3,
    'f': 4,
    'n': 5,
    'r': 6,
    't': 7,
    'u': 8 // 4 hexadecimal digits
};
function isDigit1to9(char) {
    return char >= '1' && char <= '9';
}
function isDigit(char) {
    return char >= '0' && char <= '9';
}
function isExp(char) {
    return char === 'e' || char === 'E';
}
function escapeString(text, allowedLetter) {
    if (allowedLetter === void 0) { allowedLetter = []; }
    return text.replace(/\\(.)/g, function (_, text) {
        return text === 'b'
            ? '\b'
            : text === 'f'
                ? '\f'
                : text === 'n'
                    ? '\n'
                    : text === 'r'
                        ? '\r'
                        : text === 't'
                            ? '\t'
                            : text === 'v'
                                ? '\v'
                                : ~allowedLetter.indexOf(text)
                                    ? text
                                    : _;
    });
}
function formatNumber(value) {
    return Number(value);
}
function lexer(input, options) {
    var line = 1;
    var column = 1;
    var index = 0;
    var mainState = mainStates.START;
    var states = [mainState];
    var tokenCache = [];
    var allowFilter = (options === null || options === void 0 ? void 0 : options.allowFilter) !== false;
    if ((options === null || options === void 0 ? void 0 : options.evalMode) || (options === null || options === void 0 ? void 0 : options.variableMode)) {
        pushState(mainStates.EXPRESSION);
    }
    function pushState(state) {
        states.push((mainState = state));
    }
    function popState() {
        states.pop();
        mainState = states[states.length - 1];
    }
    function position(value) {
        if (value && typeof value === 'string') {
            var lines = value.split(/[\r\n]+/);
            return {
                index: index + value.length,
                line: line + lines.length - 1,
                column: column + lines[lines.length - 1].length
            };
        }
        return { index: index, line: line, column: column };
    }
    function eof() {
        if (index >= input.length) {
            return {
                type: TokenName[TokenEnum.EOF],
                value: undefined,
                start: position(),
                end: position()
            };
        }
    }
    function raw() {
        if (mainState !== mainStates.START) {
            return null;
        }
        var buffer = '';
        var state = rawStates.START;
        var i = index;
        while (i < input.length) {
            var ch = input[i];
            if (state === rawStates.ESCAPE) {
                if (escapes.hasOwnProperty(ch) || ch === '$') {
                    buffer += ch;
                    i++;
                    state = rawStates.START;
                }
                else {
                    var pos = position(buffer + ch);
                    throw new SyntaxError("Unexpected token ".concat(ch, " in ").concat(pos.line, ":").concat(pos.column));
                }
            }
            else {
                if (ch === '\\') {
                    buffer += ch;
                    i++;
                    state = rawStates.ESCAPE;
                    continue;
                }
                else if (ch === '$') {
                    var nextCh = input[i + 1];
                    if (nextCh === '{') {
                        break;
                    }
                    else if (nextCh === '$') {
                        // $$ 用法兼容
                        tokenCache.push({
                            type: TokenName[TokenEnum.Variable],
                            value: '&',
                            raw: '$$',
                            start: position(input.substring(index, i)),
                            end: position(input.substring(index, i + 2))
                        });
                        break;
                    }
                    else {
                        // 支持旧的 $varName 的取值方法
                        var match = /^[a-zA-Z0-9_]+(?:\.[a-zA-Z0-9_]+)*/.exec(input.substring(i + 1));
                        if (match) {
                            tokenCache.push({
                                type: TokenName[TokenEnum.Variable],
                                value: match[0],
                                raw: match[0],
                                start: position(input.substring(index, i)),
                                end: position(input.substring(index, i + 1 + match[0].length))
                            });
                            break;
                        }
                    }
                }
                i++;
                buffer += ch;
            }
        }
        if (i > index) {
            return {
                type: TokenName[TokenEnum.RAW],
                value: escapeString(buffer, ['`', '$']),
                raw: buffer,
                start: position(),
                end: position(buffer)
            };
        }
        return tokenCache.length ? tokenCache.shift() : null;
    }
    function openScript() {
        if (mainState === mainStates.Template) {
            return null;
        }
        var ch = input[index];
        if (ch === '$') {
            var nextCh = input[index + 1];
            if (nextCh === '{') {
                pushState(mainStates.SCRIPT);
                var value = input.substring(index, index + 2);
                return {
                    type: TokenName[TokenEnum.OpenScript],
                    value: value,
                    start: position(),
                    end: position(value)
                };
            }
        }
        return null;
    }
    function expression() {
        if (mainState !== mainStates.SCRIPT &&
            mainState !== mainStates.EXPRESSION &&
            mainState !== mainStates.BLOCK &&
            mainState !== mainStates.Filter) {
            return null;
        }
        var token = literal() ||
            identifier() ||
            numberLiteral() ||
            stringLiteral() ||
            punctuator() ||
            char();
        if ((token === null || token === void 0 ? void 0 : token.value) === '{') {
            pushState(mainStates.BLOCK);
        }
        else if ((token === null || token === void 0 ? void 0 : token.value) === '}') {
            if (mainState === mainStates.Filter) {
                popState();
            }
            var prevState = mainState;
            popState();
            if (prevState === mainStates.SCRIPT ||
                prevState === mainStates.EXPRESSION) {
                return {
                    type: TokenName[prevState === mainStates.EXPRESSION
                        ? TokenEnum.TemplateRightBrace
                        : TokenEnum.CloseScript],
                    value: token.value,
                    start: position(),
                    end: position(token.value)
                };
            }
        }
        // filter 过滤器部分需要特殊处理
        if (mainState === mainStates.SCRIPT &&
            (token === null || token === void 0 ? void 0 : token.value) === '|' &&
            allowFilter) {
            pushState(mainStates.Filter);
            return {
                type: TokenName[TokenEnum.OpenFilter],
                value: '|',
                start: position(),
                end: position('|')
            };
        }
        else if (mainState === mainStates.Filter && (token === null || token === void 0 ? void 0 : token.value) === '|') {
            return {
                type: TokenName[TokenEnum.OpenFilter],
                value: '|',
                start: position(),
                end: position('|')
            };
        }
        if (!token && input[index] === '`') {
            pushState(mainStates.Template);
            return {
                type: TokenName[TokenEnum.Punctuator],
                value: '`',
                start: position(),
                end: position('`')
            };
        }
        return token;
    }
    function char() {
        if (mainState !== mainStates.Filter) {
            return null;
        }
        var i = index;
        var ch = input[i];
        if (ch === '\\') {
            var nextCh = input[i + 1];
            if (nextCh === '$' ||
                ~punctuatorList.indexOf(nextCh) ||
                escapes.hasOwnProperty(nextCh)) {
                i++;
                ch =
                    nextCh === 'b'
                        ? '\b'
                        : nextCh === 'f'
                            ? '\f'
                            : nextCh === 'n'
                                ? '\n'
                                : nextCh === 'r'
                                    ? '\r'
                                    : nextCh === 't'
                                        ? '\t'
                                        : nextCh === 'v'
                                            ? '\v'
                                            : nextCh;
            }
            else {
                var pos = position(input.substring(index, index + 2));
                throw new SyntaxError("Unexpected token ".concat(nextCh, " in ").concat(pos.line, ":").concat(pos.column));
            }
        }
        var token = {
            type: TokenName[TokenEnum.Char],
            value: ch,
            start: position(),
            end: position(input.substring(index, i + 1))
        };
        return token;
    }
    function template() {
        if (mainState !== mainStates.Template) {
            return null;
        }
        var state = stringStates.START;
        var i = index;
        while (i < input.length) {
            var ch = input[i];
            if (state === stringStates.ESCAPE) {
                if (escapes.hasOwnProperty(ch) || ch === '`' || ch === '$') {
                    i++;
                    state = stringStates.START_QUOTE_OR_CHAR;
                }
                else {
                    var pos = position(input.substring(index, i + 1));
                    throw new SyntaxError("Unexpected token ".concat(ch, " in ").concat(pos.line, ":").concat(pos.column));
                }
            }
            else if (ch === '\\') {
                i++;
                state = stringStates.ESCAPE;
            }
            else if (ch === '`') {
                popState();
                tokenCache.push({
                    type: TokenName[TokenEnum.Punctuator],
                    value: '`',
                    start: position(input.substring(index, i)),
                    end: position(input.substring(index, i + 1))
                });
                break;
            }
            else if (ch === '$') {
                var nextCh = input[i + 1];
                if (nextCh === '{') {
                    pushState(mainStates.EXPRESSION);
                    tokenCache.push({
                        type: TokenName[TokenEnum.TemplateLeftBrace],
                        value: '${',
                        start: position(input.substring(index, i)),
                        end: position(input.substring(index, i + 2))
                    });
                    break;
                }
                i++;
            }
            else {
                i++;
            }
        }
        if (i > index) {
            var value = input.substring(index, i);
            return {
                type: TokenName[TokenEnum.TemplateRaw],
                value: escapeString(value, ['`', '$']),
                raw: value,
                start: position(),
                end: position(value)
            };
        }
        return tokenCache.length ? tokenCache.shift() : null;
    }
    function skipWhiteSpace() {
        while (index < input.length) {
            var ch = input[index];
            if (ch === '\r') {
                // CR (Unix)
                index++;
                line++;
                column = 1;
                if (input.charAt(index) === '\n') {
                    // CRLF (Windows)
                    index++;
                }
            }
            else if (ch === '\n') {
                // LF (MacOS)
                index++;
                line++;
                column = 1;
            }
            else if (ch === '\t' || ch === ' ') {
                index++;
                column++;
            }
            else {
                break;
            }
        }
    }
    function punctuator() {
        var find = punctuatorList.find(function (punctuator) {
            return input.substring(index, index + punctuator.length) === punctuator;
        });
        if (find) {
            return {
                type: TokenName[TokenEnum.Punctuator],
                value: find,
                start: position(),
                end: position(find)
            };
        }
        return null;
    }
    function literal() {
        var keyword = input.substring(index, index + 4).toLowerCase();
        var value = keyword;
        var isLiteral = false;
        if (keyword === 'true' || keyword === 'null') {
            isLiteral = true;
            value = keyword === 'true' ? true : null;
        }
        else if ((keyword = input.substring(index, index + 5).toLowerCase()) === 'false') {
            isLiteral = true;
            value = false;
        }
        else if ((keyword = input.substring(index, index + 9).toLowerCase()) ===
            'undefined') {
            isLiteral = true;
            value = undefined;
        }
        if (isLiteral) {
            return {
                type: value === true || value === false
                    ? TokenName[TokenEnum.BooleanLiteral]
                    : TokenName[TokenEnum.Literal],
                value: value,
                raw: keyword,
                start: position(),
                end: position(keyword)
            };
        }
        return null;
    }
    function numberLiteral() {
        var i = index;
        var passedValueIndex = i;
        var state = numberStates.START;
        iterator: while (i < input.length) {
            var char_1 = input.charAt(i);
            switch (state) {
                case numberStates.START: {
                    if (char_1 === '0') {
                        passedValueIndex = i + 1;
                        state = numberStates.ZERO;
                    }
                    else if (isDigit1to9(char_1)) {
                        passedValueIndex = i + 1;
                        state = numberStates.DIGIT;
                    }
                    else {
                        return null;
                    }
                    break;
                }
                case numberStates.ZERO: {
                    if (char_1 === '.') {
                        state = numberStates.POINT;
                    }
                    else if (isExp(char_1)) {
                        state = numberStates.EXP;
                    }
                    else {
                        break iterator;
                    }
                    break;
                }
                case numberStates.DIGIT: {
                    if (isDigit(char_1)) {
                        passedValueIndex = i + 1;
                    }
                    else if (char_1 === '.') {
                        state = numberStates.POINT;
                    }
                    else if (isExp(char_1)) {
                        state = numberStates.EXP;
                    }
                    else {
                        break iterator;
                    }
                    break;
                }
                case numberStates.POINT: {
                    if (isDigit(char_1)) {
                        passedValueIndex = i + 1;
                        state = numberStates.DIGIT_FRACTION;
                    }
                    else {
                        break iterator;
                    }
                    break;
                }
                case numberStates.DIGIT_FRACTION: {
                    if (isDigit(char_1)) {
                        passedValueIndex = i + 1;
                    }
                    else if (isExp(char_1)) {
                        state = numberStates.EXP;
                    }
                    else {
                        break iterator;
                    }
                    break;
                }
            }
            i++;
        }
        if (passedValueIndex > 0) {
            var value = input.slice(index, passedValueIndex);
            return {
                type: TokenName[TokenEnum.NumericLiteral],
                value: formatNumber(value),
                raw: value,
                start: position(),
                end: position(value)
            };
        }
        return null;
    }
    function stringLiteral() {
        var startQuote = '"';
        var state = stringStates.START;
        var i = index;
        while (i < input.length) {
            var ch = input[i];
            if (state === stringStates.START) {
                if (ch === '"' || ch === "'") {
                    startQuote = ch;
                    i++;
                    state = stringStates.START_QUOTE_OR_CHAR;
                }
                else {
                    break;
                }
            }
            else if (state === stringStates.ESCAPE) {
                if (escapes.hasOwnProperty(ch) || ch === startQuote) {
                    i++;
                    state = stringStates.START_QUOTE_OR_CHAR;
                }
                else {
                    var pos = position(input.substring(index, i + 1));
                    throw new SyntaxError("Unexpected token ".concat(ch, " in ").concat(pos.line, ":").concat(pos.column));
                }
            }
            else if (ch === '\\') {
                i++;
                state = stringStates.ESCAPE;
            }
            else if (ch === startQuote) {
                i++;
                break;
            }
            else {
                i++;
            }
        }
        if (i > index) {
            var value = input.substring(index, i);
            return {
                type: TokenName[TokenEnum.StringLiteral],
                value: escapeString(value.substring(1, value.length - 1), [startQuote]),
                raw: value,
                start: position(),
                end: position(value)
            };
        }
        return null;
    }
    function identifier() {
        // 变量模式是 resolveVariable 的时候使用的
        // 这个纯变量获取模式，不支持其他什么表达式
        // 仅仅支持 xxx.xxx 或者 xxx[ exression ] 这类语法
        // 所以纯变量模式支持纯数字作为变量名
        var reg = (options === null || options === void 0 ? void 0 : options.variableMode)
            ? /^[\u4e00-\u9fa5A-Za-z0-9_$@][\u4e00-\u9fa5A-Za-z0-9_\-$@]*/
            : /^(?:[\u4e00-\u9fa5A-Za-z_$@]([\u4e00-\u9fa5A-Za-z0-9_\-$@]|\\(?:\.|\[|\]|\(|\)|\{|\}|\s|=|!|>|<|\||&|\+|-|\*|\/|\^|~|%|&|\?|:|;|,))*|\d+[\u4e00-\u9fa5A-Za-z_$@](?:[\u4e00-\u9fa5A-Za-z0-9_\-$@]|\\(?:\.|\[|\]|\(|\)|\{|\}|\s|=|!|>|<|\||&|\+|-|\*|\/|\^|~|%|&|\?|:|;|,))*)/;
        var match = reg.exec(input.substring(index, index + 256) // 变量长度不能超过 256
        );
        if (match) {
            return {
                type: TokenName[TokenEnum.Identifier],
                value: match[0].replace(/\\(\.|\[|\]|\(|\)|\{|\}|\s|=|!|>|<|\||&|\+|-|\*|\/|\^|~|%|&|\?|:|;|,)/g, function (_, v) { return v; }),
                start: position(),
                end: position(match[0])
            };
        }
        return null;
    }
    function getNextToken() {
        if (tokenCache.length) {
            return tokenCache.shift();
        }
        if (mainState === mainStates.SCRIPT ||
            mainState === mainStates.EXPRESSION ||
            mainState === mainStates.BLOCK) {
            skipWhiteSpace();
        }
        return eof() || raw() || openScript() || expression() || template();
    }
    return {
        next: function () {
            var token = getNextToken();
            if (token) {
                index = token.end.index;
                line = token.end.line;
                column = token.end.column;
                return token;
            }
            var pos = position();
            throw new SyntaxError("unexpected character \"".concat(input[index], "\" at ").concat(pos.line, ":").concat(pos.column));
        }
    };
}

var argListStates = {
    START: 0,
    COMMA: 1,
    SET: 2
};
var tempalteStates = {
    START: 0,
    SCRIPTING: 1
};
var objectStates = {
    START: 0,
    KEY: 1,
    COLON: 2,
    VALUE: 3,
    COMMA: 4
};
function parse(input, options) {
    var _a, _b;
    var token;
    var lexer$1 = lexer(input, options);
    var tokens = [];
    var tokenChunk = [];
    // 允许的变量名字空间
    var variableNamespaces = (_a = options === null || options === void 0 ? void 0 : options.variableNamespaces) !== null && _a !== void 0 ? _a : [
        'window',
        'cookie',
        'ls',
        'ss'
    ];
    if (!Array.isArray(variableNamespaces)) {
        variableNamespaces = [];
    }
    function next() {
        token = tokenChunk.length ? tokenChunk.shift() : lexer$1.next();
        if (!token) {
            throw new TypeError('next token is undefined');
        }
        tokens.push(token);
    }
    function back() {
        tokenChunk.unshift(tokens.pop());
        token = tokens[tokens.length - 1];
    }
    function matchPunctuator(operator) {
        return (token.type === TokenName[TokenEnum.Punctuator] &&
            (Array.isArray(operator)
                ? ~operator.indexOf(token.value)
                : token.value === operator));
    }
    function fatal() {
        throw TypeError("Unexpected token ".concat(token.value, " in ").concat(token.start.line, ":").concat(token.start.column));
    }
    function assert(result) {
        if (!result) {
            fatal();
        }
        return result;
    }
    function expression() {
        return assignmentExpression();
    }
    function skipWhiteSpaceChar() {
        while (token.type === TokenName[TokenEnum.Char] &&
            /^\s+$/m.test(token.value)) {
            next();
        }
    }
    function collectFilterArg() {
        var arg = [];
        while (!matchPunctuator(':') &&
            token.type !== TokenName[TokenEnum.OpenFilter] &&
            token.type !== TokenName[TokenEnum.CloseScript]) {
            var item = literal() ||
                numberLiteral() ||
                stringLiteral() ||
                template() ||
                arrayLiteral() ||
                rawScript() ||
                objectLiteral();
            if (item) {
                arg.push(item);
            }
            else {
                assert(~[
                    TokenName[TokenEnum.Identifier],
                    TokenName[TokenEnum.Punctuator],
                    TokenName[TokenEnum.Char]
                ].indexOf(token.type));
                // 其他的都当字符处理
                if (arg.length && typeof arg[arg.length - 1] === 'string') {
                    arg[arg.length - 1] += token.raw || token.value;
                }
                else {
                    arg.push(token.raw || token.value);
                }
                next();
            }
        }
        if (arg.length && typeof arg[arg.length - 1] === 'string') {
            arg[arg.length - 1] = arg[arg.length - 1].replace(/\s+$/, '');
            if (!arg[arg.length - 1]) {
                arg.pop();
            }
        }
        return arg;
    }
    function complexExpression() {
        var ast = expression();
        var filters = [];
        while (token.type === TokenName[TokenEnum.OpenFilter]) {
            next();
            skipWhiteSpaceChar();
            var name = assert(identifier());
            var fnName = name.name;
            var args = [];
            skipWhiteSpaceChar();
            while (matchPunctuator(':')) {
                next();
                skipWhiteSpaceChar();
                var argContents = collectFilterArg();
                if (argContents.length === 1) {
                    argContents = argContents[0];
                }
                else if (!argContents.length) {
                    argContents = '';
                }
                args.push(Array.isArray(argContents)
                    ? {
                        type: 'mixed',
                        body: argContents
                    }
                    : argContents);
            }
            filters.push({
                name: fnName,
                args: args
            });
        }
        if (filters.length) {
            ast = {
                type: 'filter',
                input: ast,
                filters: filters,
                start: ast.start,
                end: filters[filters.length - 1].end
            };
        }
        return ast;
    }
    function arrowFunction() {
        var ast = argList() || variable();
        var args = [];
        var start;
        if ((ast === null || ast === void 0 ? void 0 : ast.type) === 'variable') {
            args = [ast];
            start = ast.start;
        }
        else if ((ast === null || ast === void 0 ? void 0 : ast.type) === 'arg-list') {
            start = ast.start;
            args = ast.body;
        }
        if (Array.isArray(args) && matchPunctuator('=')) {
            next();
            if (matchPunctuator('>')) {
                next();
                var body = assert(expression());
                return {
                    type: 'anonymous_function',
                    args: args,
                    return: body,
                    start: start,
                    end: body.end
                };
            }
            else {
                back();
            }
        }
        return ast;
    }
    function conditionalExpression() {
        var ast = logicalOrExpression();
        if (!ast) {
            return null;
        }
        if (matchPunctuator('?')) {
            next();
            var consequent = assignmentExpression();
            assert(consequent);
            assert(matchPunctuator(':'));
            next();
            var alternate = assignmentExpression();
            assert(alternate);
            return {
                type: 'conditional',
                test: ast,
                consequent: consequent,
                alternate: alternate,
                start: ast.start,
                end: alternate.end
            };
        }
        return ast;
    }
    function binaryExpressionParser(type, operator, parseFunction, rightParseFunction, leftKey, rightKey) {
        var _a;
        if (rightParseFunction === void 0) { rightParseFunction = parseFunction; }
        if (leftKey === void 0) { leftKey = 'left'; }
        if (rightKey === void 0) { rightKey = 'right'; }
        var ast = parseFunction();
        if (!ast) {
            return null;
        }
        if (matchPunctuator(operator)) {
            while (matchPunctuator(operator)) {
                next();
                var right = assert(rightParseFunction());
                ast = (_a = {
                        type: type,
                        op: operator
                    },
                    _a[leftKey] = ast,
                    _a[rightKey] = right,
                    _a.start = ast.start,
                    _a.end = right.end,
                    _a);
            }
        }
        return ast;
    }
    function logicalOrExpression() {
        return binaryExpressionParser('or', '||', logicalAndExpression);
    }
    function logicalAndExpression() {
        return binaryExpressionParser('and', '&&', bitwiseOrExpression);
    }
    function bitwiseOrExpression() {
        return binaryExpressionParser('binary', '|', bitwiseXOrExpression);
    }
    function bitwiseXOrExpression() {
        return binaryExpressionParser('binary', '^', bitwiseAndExpression);
    }
    function bitwiseAndExpression() {
        return binaryExpressionParser('binary', '&', equalityExpression);
    }
    function equalityExpression() {
        return binaryExpressionParser('eq', '==', function () {
            return binaryExpressionParser('ne', '!=', function () {
                return binaryExpressionParser('streq', '===', function () {
                    return binaryExpressionParser('strneq', '!==', relationalExpression);
                });
            });
        });
    }
    function relationalExpression() {
        return binaryExpressionParser('lt', '<', function () {
            return binaryExpressionParser('gt', '>', function () {
                return binaryExpressionParser('le', '<=', function () {
                    return binaryExpressionParser('ge', '>=', shiftExpression);
                });
            });
        });
    }
    function shiftExpression() {
        return binaryExpressionParser('shift', '<<', function () {
            return binaryExpressionParser('shift', '>>', function () {
                return binaryExpressionParser('shift', '>>>', additiveExpression);
            });
        });
    }
    function additiveExpression() {
        return binaryExpressionParser('add', '+', function () {
            return binaryExpressionParser('minus', '-', multiplicativeExpression);
        });
    }
    function multiplicativeExpression() {
        return binaryExpressionParser('multiply', '*', function () {
            return binaryExpressionParser('divide', '/', function () {
                return binaryExpressionParser('remainder', '%', powerExpression);
            });
        });
    }
    function powerExpression() {
        return binaryExpressionParser('power', '**', unaryExpression);
    }
    function unaryExpression() {
        var unaryOperators = ['+', '-', '~', '!'];
        var stack = [];
        while (matchPunctuator(unaryOperators)) {
            stack.push(token);
            next();
        }
        var ast = postfixExpression();
        assert(!stack.length || ast);
        while (stack.length) {
            var op = stack.pop();
            ast = {
                type: 'unary',
                op: op.value,
                value: ast,
                start: op.start,
                end: op.end
            };
        }
        return ast;
    }
    function postfixExpression(parseFunction) {
        if (parseFunction === void 0) { parseFunction = leftHandSideExpression; }
        var ast = parseFunction();
        if (!ast) {
            return null;
        }
        while (matchPunctuator('[') || matchPunctuator('.')) {
            var isDot = matchPunctuator('.');
            next();
            var right = assert(isDot ? identifier() || numberLiteral() || rawScript() : expression());
            if (!isDot) {
                assert(matchPunctuator(']'));
                next();
            }
            ast = {
                type: 'getter',
                host: ast,
                key: right,
                start: ast.start,
                end: right.end
            };
        }
        return ast;
    }
    function leftHandSideExpression() {
        return functionCall() || arrowFunction() || primaryExpression();
    }
    function varibleKey(allowVariable, inObject) {
        if (allowVariable === void 0) { allowVariable = false; }
        if (inObject === void 0) { inObject = false; }
        return ((allowVariable ? variable() : identifier()) ||
            stringLiteral() ||
            numberLiteral() ||
            (inObject ? objectTemplateKey() : template()));
    }
    function objectTemplateKey() {
        if (matchPunctuator('[')) {
            next();
            var key = assert(template());
            assert(matchPunctuator(']'));
            next();
            return key;
        }
        return null;
    }
    function stringLiteral() {
        if (token.type === TokenName[TokenEnum.StringLiteral]) {
            var cToken = token;
            next();
            return {
                type: 'string',
                value: cToken.value,
                start: cToken.start,
                end: cToken.end
            };
        }
        return null;
    }
    function numberLiteral() {
        if (token.type === TokenName[TokenEnum.NumericLiteral]) {
            var value = token.value;
            var cToken = token;
            next();
            return {
                type: 'literal',
                value: value,
                start: cToken.start,
                end: cToken.end
            };
        }
        return null;
    }
    function template() {
        if (matchPunctuator('`')) {
            var start = token;
            var end = start;
            next();
            var state = tempalteStates.START;
            var ast_1 = {
                type: 'template',
                body: [],
                start: start.start,
                end: start.end
            };
            while (true) {
                if (state === tempalteStates.SCRIPTING) {
                    var exp = assert(expression());
                    ast_1.body.push(exp);
                    assert(token.type === TokenName[TokenEnum.TemplateRightBrace]);
                    next();
                    state = tempalteStates.START;
                }
                else {
                    if (matchPunctuator('`')) {
                        end = token;
                        next();
                        break;
                    }
                    else if (token.type === TokenName[TokenEnum.TemplateLeftBrace]) {
                        next();
                        state = tempalteStates.SCRIPTING;
                    }
                    else if (token.type === TokenName[TokenEnum.TemplateRaw]) {
                        ast_1.body.push({
                            type: 'template_raw',
                            value: token.value,
                            start: token.start,
                            end: token.end
                        });
                        next();
                    }
                    else {
                        fatal();
                    }
                }
            }
            ast_1.end = end.end;
            return ast_1;
        }
        return null;
    }
    function identifier() {
        if (token.type === TokenName[TokenEnum.Identifier]) {
            var cToken = token;
            next();
            return {
                type: 'identifier',
                name: cToken.value,
                start: cToken.start,
                end: cToken.end
            };
        }
        return null;
    }
    function primaryExpression() {
        return (variable() ||
            literal() ||
            numberLiteral() ||
            stringLiteral() ||
            template() ||
            arrayLiteral() ||
            objectLiteral() ||
            (function () {
                var ast = expressionList();
                if ((ast === null || ast === void 0 ? void 0 : ast.body.length) === 1) {
                    return ast.body[0];
                }
                return ast;
            })() ||
            rawScript());
    }
    function literal() {
        if (token.type === TokenName[TokenEnum.Literal] ||
            token.type === TokenName[TokenEnum.BooleanLiteral]) {
            var value = token.value;
            var cToken = token;
            next();
            return {
                type: 'literal',
                value: value,
                start: cToken.start,
                end: cToken.end
            };
        }
        return null;
    }
    function functionCall() {
        if (token.type === TokenName[TokenEnum.Identifier]) {
            var id = token;
            next();
            if (matchPunctuator('(')) {
                var argList_1 = expressionList();
                assert(argList_1);
                return {
                    type: 'func_call',
                    identifier: id.value,
                    args: argList_1 === null || argList_1 === void 0 ? void 0 : argList_1.body,
                    start: id.start,
                    end: argList_1.end
                };
            }
            else {
                back();
            }
        }
        return null;
    }
    function arrayLiteral() {
        if (matchPunctuator('[')) {
            var argList_2 = expressionList('[', ']');
            assert(argList_2);
            return {
                type: 'array',
                members: argList_2 === null || argList_2 === void 0 ? void 0 : argList_2.body,
                start: argList_2.start,
                end: argList_2.end
            };
        }
        return null;
    }
    function expressionList(startOP, endOp) {
        if (startOP === void 0) { startOP = '('; }
        if (endOp === void 0) { endOp = ')'; }
        if (matchPunctuator(startOP)) {
            var start = token;
            var end = void 0;
            next();
            var args = [];
            var state = argListStates.START;
            while (true) {
                if (state === argListStates.COMMA || !matchPunctuator(endOp)) {
                    var arg = assert(expression());
                    args.push(arg);
                    state = argListStates.START;
                    if (matchPunctuator(',')) {
                        next();
                        state = argListStates.COMMA;
                    }
                }
                else if (matchPunctuator(endOp)) {
                    end = token;
                    next();
                    break;
                }
            }
            return {
                type: 'expression-list',
                body: args,
                start: start.start,
                end: end.end
            };
        }
        return null;
    }
    function argList(startOP, endOp) {
        if (startOP === void 0) { startOP = '('; }
        if (endOp === void 0) { endOp = ')'; }
        var count = 0;
        var rollback = function () {
            while (count-- > 0) {
                back();
            }
            return null;
        };
        if (matchPunctuator(startOP)) {
            var start = token;
            var end = start;
            next();
            count++;
            var args = [];
            var state = argListStates.START;
            while (!matchPunctuator(endOp)) {
                if (state === argListStates.COMMA || state === argListStates.START) {
                    var arg = variable(false);
                    if (!arg) {
                        return rollback();
                    }
                    count++;
                    args.push(arg);
                    state = argListStates.SET;
                }
                else if (state === argListStates.SET && matchPunctuator(',')) {
                    next();
                    count++;
                    state = argListStates.COMMA;
                }
                else {
                    return rollback();
                }
            }
            if (matchPunctuator(endOp)) {
                end = token;
                next();
                return {
                    type: 'arg-list',
                    body: args,
                    start: start.start,
                    end: end.end
                };
            }
            else {
                return rollback();
            }
        }
        return null;
    }
    function objectLiteral() {
        if (matchPunctuator('{')) {
            var start = token;
            var end = start;
            next();
            var ast_2 = {
                type: 'object',
                members: [],
                start: start.start,
                end: start.end
            };
            var state = objectStates.START;
            var key = void 0, value = void 0;
            while (true) {
                if (state === objectStates.KEY) {
                    assert(matchPunctuator(':'));
                    next();
                    state = objectStates.COLON;
                }
                else if (state === objectStates.COLON) {
                    value = assert(expression());
                    ast_2.members.push({
                        key: key,
                        value: value
                    });
                    state = objectStates.VALUE;
                }
                else if (state === objectStates.VALUE) {
                    if (matchPunctuator(',')) {
                        next();
                        state = objectStates.COMMA;
                    }
                    else if (matchPunctuator('}')) {
                        end = token;
                        next();
                        break;
                    }
                    else {
                        fatal();
                    }
                }
                else {
                    if (state != objectStates.COMMA && matchPunctuator('}')) {
                        end = token;
                        next();
                        break;
                    }
                    key = assert(varibleKey(false, true));
                    state = objectStates.KEY;
                }
            }
            ast_2.end = end.end;
            return ast_2;
        }
        return null;
    }
    function assignmentExpression() {
        return conditionalExpression();
    }
    function contents() {
        var node = {
            type: 'document',
            body: [],
            start: token.start,
            end: token.end
        };
        while (token.type !== TokenName[TokenEnum.EOF]) {
            var ast_3 = raw() || rawScript() || oldVariable();
            if (!ast_3) {
                break;
            }
            node.body.push(ast_3);
        }
        if (node.body.length) {
            node.end = node.body[node.body.length - 1].end;
        }
        return node;
    }
    function raw() {
        if (token.type !== TokenName[TokenEnum.RAW]) {
            return null;
        }
        var cToken = token;
        next();
        return {
            type: 'raw',
            value: cToken.value,
            start: cToken.start,
            end: cToken.end
        };
    }
    function rawScript() {
        if (token.type !== TokenName[TokenEnum.OpenScript]) {
            return null;
        }
        var start = token;
        var end = start;
        next();
        var exp = assert(complexExpression());
        assert(token.type === TokenName[TokenEnum.CloseScript]);
        end = token;
        next();
        return {
            type: 'script',
            body: exp,
            start: start.start,
            end: end.end
        };
    }
    function variable(allowNameSpace) {
        if (allowNameSpace === void 0) { allowNameSpace = true; }
        if (token.type === TokenName[TokenEnum.Identifier]) {
            var cToken = token;
            next();
            if (allowNameSpace &&
                matchPunctuator(':') &&
                ~variableNamespaces.indexOf(cToken.value)) {
                next();
                var body = assert(postfixExpression());
                return {
                    type: 'ns-variable',
                    namespace: cToken.value,
                    body: body,
                    start: cToken.start,
                    end: body.end
                };
            }
            return {
                type: 'variable',
                name: cToken.value,
                start: cToken.start,
                end: cToken.end
            };
        }
        else if (matchPunctuator('&')) {
            var v = token;
            next();
            return {
                type: 'variable',
                name: '&',
                start: v.start,
                end: v.end
            };
        }
        return null;
    }
    function oldVariable() {
        if (token.type !== TokenName[TokenEnum.Variable]) {
            return null;
        }
        var prevToken = token;
        next();
        return {
            type: 'script',
            body: prevToken.value.split('.').reduce(function (prev, key) {
                return prev
                    ? {
                        type: 'getter',
                        host: prev,
                        key: key,
                        start: prevToken.start,
                        end: prevToken.end
                    }
                    : {
                        type: 'variable',
                        name: key,
                        start: prevToken.start,
                        end: prevToken.end
                    };
            }, null),
            start: prevToken.start,
            end: prevToken.end
        };
    }
    next();
    var ast = (options === null || options === void 0 ? void 0 : options.variableMode)
        ? postfixExpression(variable)
        : (options === null || options === void 0 ? void 0 : options.evalMode)
            ? expression()
            : contents();
    assert(((_b = token) === null || _b === void 0 ? void 0 : _b.type) === TokenName[TokenEnum.EOF]);
    return ast;
}

var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;'
};
var escapeHtml = function (str) {
    return String(str).replace(/[&<>"'\/]/g, function (s) {
        return entityMap[s];
    });
};
/**
 * filter 是历史包袱，不建议使用。因为这是之前的语法，所以在公式解析里面做了兼容。
 * 建议用 ${ LEFT(xxx) } 这种函数调用语法。
 */
var filters = {
    raw: function (input) { return input; },
    html: function (input) {
        if (input == null) {
            return input;
        }
        return escapeHtml(input);
    }
};
function registerFilter(name, fn) {
    filters[name] = fn;
    Evaluator.setDefaultFilters(filters);
}
function extendsFilters(value) {
    Object.assign(filters, value);
    Evaluator.setDefaultFilters(filters);
}
function getFilters() {
    return filters;
}

function evaluate(astOrString, data, options) {
    var ast = astOrString;
    if (typeof astOrString === 'string') {
        ast = parse(astOrString, options);
    }
    return new Evaluator(data, options).evalute(ast);
}
Evaluator.setDefaultFilters(getFilters());

exports.Evaluator = Evaluator;
exports.evaluate = evaluate;
exports.extendsFilters = extendsFilters;
exports.filters = filters;
exports.getFilters = getFilters;
exports.lexer = lexer;
exports.parse = parse;
exports.registerFilter = registerFilter;
