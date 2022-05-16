"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.dataMapping = exports.resolveMapping = exports.stripNumber = exports.tokenize = exports.resolveVariableAndFilter = exports.isPureVariable = exports.resolveVariable = exports.pickValues = exports.registerFilter = exports.getFilters = exports.parseDuration = exports.relativeValueRe = exports.filterDate = exports.formatDuration = exports.escapeHtml = exports.prettyBytes = void 0;
var tslib_1 = require("tslib");
var isPlainObject_1 = (0, tslib_1.__importDefault)(require("lodash/isPlainObject"));
var helper_1 = require("./helper");
var amis_formula_1 = require("amis-formula");
Object.defineProperty(exports, "prettyBytes", { enumerable: true, get: function () { return amis_formula_1.prettyBytes; } });
Object.defineProperty(exports, "escapeHtml", { enumerable: true, get: function () { return amis_formula_1.escapeHtml; } });
Object.defineProperty(exports, "formatDuration", { enumerable: true, get: function () { return amis_formula_1.formatDuration; } });
Object.defineProperty(exports, "filterDate", { enumerable: true, get: function () { return amis_formula_1.filterDate; } });
Object.defineProperty(exports, "relativeValueRe", { enumerable: true, get: function () { return amis_formula_1.relativeValueRe; } });
Object.defineProperty(exports, "parseDuration", { enumerable: true, get: function () { return amis_formula_1.parseDuration; } });
Object.defineProperty(exports, "getFilters", { enumerable: true, get: function () { return amis_formula_1.getFilters; } });
Object.defineProperty(exports, "registerFilter", { enumerable: true, get: function () { return amis_formula_1.registerFilter; } });
Object.defineProperty(exports, "pickValues", { enumerable: true, get: function () { return amis_formula_1.pickValues; } });
Object.defineProperty(exports, "resolveVariable", { enumerable: true, get: function () { return amis_formula_1.resolveVariable; } });
Object.defineProperty(exports, "isPureVariable", { enumerable: true, get: function () { return amis_formula_1.isPureVariable; } });
Object.defineProperty(exports, "resolveVariableAndFilter", { enumerable: true, get: function () { return amis_formula_1.resolveVariableAndFilter; } });
Object.defineProperty(exports, "tokenize", { enumerable: true, get: function () { return amis_formula_1.tokenize; } });
Object.defineProperty(exports, "stripNumber", { enumerable: true, get: function () { return amis_formula_1.stripNumber; } });
function resolveMapping(value, data, defaultFilter) {
    if (defaultFilter === void 0) { defaultFilter = '| raw'; }
    return typeof value === 'string' && (0, amis_formula_1.isPureVariable)(value)
        ? (0, amis_formula_1.resolveVariableAndFilter)(value, data, defaultFilter, function () { return ''; })
        : typeof value === 'string' && ~value.indexOf('$')
            ? (0, amis_formula_1.tokenize)(value, data, defaultFilter)
            : value;
}
exports.resolveMapping = resolveMapping;
function dataMapping(to, from, ignoreFunction, convertKeyToPath) {
    if (from === void 0) { from = {}; }
    if (ignoreFunction === void 0) { ignoreFunction = false; }
    if (Array.isArray(to)) {
        return to.map(function (item) {
            return dataMapping(item, from, ignoreFunction, convertKeyToPath);
        });
    }
    else if (typeof to === 'string') {
        return resolveMapping(to, from);
    }
    else if (!(0, isPlainObject_1.default)(to)) {
        return to;
    }
    var ret = {};
    Object.keys(to).forEach(function (key) {
        var value = to[key];
        var keys;
        if (typeof ignoreFunction === 'function' && ignoreFunction(key, value)) {
            // 如果被ignore，不做数据映射处理。
            (0, helper_1.setVariable)(ret, key, value, convertKeyToPath);
        }
        else if (key === '&' && value === '$$') {
            ret = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, ret), from);
        }
        else if (key === '&') {
            var v = (0, isPlainObject_1.default)(value) &&
                (keys = Object.keys(value)) &&
                keys.length === 1 &&
                from[keys[0].substring(1)] &&
                Array.isArray(from[keys[0].substring(1)])
                ? from[keys[0].substring(1)].map(function (raw) {
                    return dataMapping(value[keys[0]], (0, helper_1.createObject)(from, raw), ignoreFunction, convertKeyToPath);
                })
                : resolveMapping(value, from);
            if (Array.isArray(v) || typeof v === 'string') {
                ret = v;
            }
            else if (typeof v === 'function') {
                ret = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, ret), v(from));
            }
            else {
                ret = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, ret), v);
            }
        }
        else if (value === '$$') {
            (0, helper_1.setVariable)(ret, key, from, convertKeyToPath);
        }
        else if (value && value[0] === '$') {
            var v = resolveMapping(value, from);
            (0, helper_1.setVariable)(ret, key, v, convertKeyToPath);
            if (v === '__undefined') {
                (0, helper_1.deleteVariable)(ret, key);
            }
        }
        else if ((0, isPlainObject_1.default)(value) &&
            (keys = Object.keys(value)) &&
            keys.length === 1 &&
            keys[0][0] === '$' &&
            (0, isPlainObject_1.default)(value[keys[0]])) {
            // from[keys[0].substring(1)] &&
            // Array.isArray(from[keys[0].substring(1)])
            // 支持只取数组中的部分值这个需求
            // 如:
            // data: {
            //   items: {
            //     '$rows': {
            //        id: '$id',
            //        forum_id: '$forum_id'
            //      }
            //   }
            // }
            var arr = Array.isArray(from[keys[0].substring(1)])
                ? from[keys[0].substring(1)]
                : [];
            var mapping_1 = value[keys[0]];
            ret[key] = arr.map(function (raw) {
                return dataMapping(mapping_1, (0, helper_1.createObject)(from, raw), ignoreFunction, convertKeyToPath);
            });
        }
        else if ((0, isPlainObject_1.default)(value)) {
            (0, helper_1.setVariable)(ret, key, dataMapping(value, from, ignoreFunction, convertKeyToPath), convertKeyToPath);
        }
        else if (Array.isArray(value)) {
            (0, helper_1.setVariable)(ret, key, value.map(function (value) {
                return (0, isPlainObject_1.default)(value)
                    ? dataMapping(value, from, ignoreFunction, convertKeyToPath)
                    : resolveMapping(value, from);
            }), convertKeyToPath);
        }
        else if (typeof value == 'string' && ~value.indexOf('$')) {
            (0, helper_1.setVariable)(ret, key, resolveMapping(value, from), convertKeyToPath);
        }
        else if (typeof value === 'function' && ignoreFunction !== true) {
            (0, helper_1.setVariable)(ret, key, value(from), convertKeyToPath);
        }
        else {
            (0, helper_1.setVariable)(ret, key, value, convertKeyToPath);
            if (value === '__undefined') {
                (0, helper_1.deleteVariable)(ret, key);
            }
        }
    });
    return ret;
}
exports.dataMapping = dataMapping;
function matchSynatax(str) {
    var from = 0;
    while (true) {
        var idx = str.indexOf('$', from);
        if (~idx) {
            var nextToken = str[idx + 1];
            // 如果没有下一个字符，或者下一个字符是引号或者空格
            // 这个一般不是取值用法
            if (!nextToken || ~['"', "'", ' '].indexOf(nextToken)) {
                from = idx + 1;
                continue;
            }
            // 如果上个字符是转义也不是取值用法
            var prevToken = str[idx - 1];
            if (prevToken && prevToken === '\\') {
                from = idx + 1;
                continue;
            }
            return true;
        }
        else {
            break;
        }
    }
    return false;
}
function register() {
    return {
        name: 'builtin',
        test: function (str) { return typeof str === 'string' && matchSynatax(str); },
        removeEscapeToken: function (str) {
            return typeof str === 'string' ? str.replace(/\\\$/g, '$') : str;
        },
        compile: function (str, data, defaultFilter) {
            if (defaultFilter === void 0) { defaultFilter = '| html'; }
            try {
                return (0, amis_formula_1.tokenize)(str, data, defaultFilter);
            }
            catch (e) {
                return "error: ".concat(e.message);
            }
        }
    };
}
exports.register = register;
//# sourceMappingURL=./utils/tpl-builtin.js.map
