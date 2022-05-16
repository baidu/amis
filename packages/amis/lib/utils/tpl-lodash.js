"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
var tslib_1 = require("tslib");
var template_1 = (0, tslib_1.__importDefault)(require("lodash/template"));
var tpl_builtin_1 = require("./tpl-builtin");
var moment_1 = (0, tslib_1.__importDefault)(require("moment"));
var imports = {
    default: undefined,
    moment: moment_1.default,
    countDown: function (end) {
        if (!end) {
            return '--';
        }
        var date = new Date(parseInt(end, 10) * 1000);
        var now = Date.now();
        if (date.getTime() < now) {
            return '已结束';
        }
        return Math.ceil((date.getTime() - now) / (1000 * 60 * 60 * 24)) + '天';
    },
    formatDate: function (value, format, inputFormat) {
        if (format === void 0) { format = 'LLL'; }
        if (inputFormat === void 0) { inputFormat = ''; }
        return (0, moment_1.default)(value, inputFormat).format(format);
    }
};
// 缓存一下提升性能
var EVAL_CACHE = {};
function lodashCompile(str, data) {
    try {
        var filters = (0, tpl_builtin_1.getFilters)();
        var finnalImports = (0, tslib_1.__assign)((0, tslib_1.__assign)((0, tslib_1.__assign)({}, filters), { formatTimeStamp: filters.date, formatNumber: filters.number, defaultValue: filters.defaut }), imports);
        delete finnalImports.default; // default 是个关键字，不能 imports 到 lodash 里面去。
        var fn = EVAL_CACHE[str] ||
            (EVAL_CACHE[str] = (0, template_1.default)(str, {
                imports: finnalImports,
                variable: 'data',
                // 如果不传这个，默认模板语法也存在 ${xxx} 语法，这个跟内置语法规则冲突。
                // 为了不带来困惑，禁用掉这种用法。
                interpolate: /<%=([\s\S]+?)%>/g
            }));
        return fn.call(data, data);
    }
    catch (e) {
        return "<span class=\"text-danger\">".concat(e.message, "</span>");
    }
}
function register() {
    return {
        name: 'lodash',
        test: function (str) { return !!~str.indexOf('<%'); },
        compile: function (str, data) { return lodashCompile(str, data); }
    };
}
exports.register = register;
//# sourceMappingURL=./utils/tpl-lodash.js.map
