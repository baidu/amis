"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var tpl_1 = require("./tpl");
var helper_1 = require("./helper");
var isPlainObject_1 = (0, tslib_1.__importDefault)(require("lodash/isPlainObject"));
var classnames_1 = (0, tslib_1.__importDefault)(require("classnames"));
/**
 * 处理 Props 数据，所有带 On 结束的做一次
 *
 * xxxOn
 * xxxExpr
 *
 *
 * @param schema
 * @param data
 */
function getExprProperties(schema, data, blackList, props) {
    if (data === void 0) { data = {}; }
    if (blackList === void 0) { blackList = ['addOn']; }
    var exprProps = {};
    var ctx = null;
    Object.getOwnPropertyNames(schema).forEach(function (key) {
        if (blackList && ~blackList.indexOf(key)) {
            return;
        }
        var parts = /^(.*)(On|Expr|(?:c|C)lassName)(Raw)?$/.exec(key);
        var value = schema[key];
        if (value &&
            typeof value === 'string' &&
            (parts === null || parts === void 0 ? void 0 : parts[1]) &&
            (parts[2] === 'On' || parts[2] === 'Expr')) {
            key = parts[1];
            if (parts[2] === 'On' || parts[2] === 'Expr') {
                if (!ctx &&
                    props &&
                    typeof value === 'string' &&
                    ~value.indexOf('__props')) {
                    ctx = (0, helper_1.injectPropsToObject)(data, {
                        __props: props
                    });
                }
                value =
                    parts[2] === 'On'
                        ? (0, tpl_1.evalExpression)(value, ctx || data)
                        : (0, tpl_1.filter)(value, ctx || data);
            }
            exprProps[key] = value;
        }
        else if (value &&
            (0, isPlainObject_1.default)(value) &&
            ((parts === null || parts === void 0 ? void 0 : parts[2]) === 'className' || (parts === null || parts === void 0 ? void 0 : parts[2]) === 'ClassName')) {
            key = parts[1] + parts[2];
            exprProps["".concat(key, "Raw")] = value;
            exprProps[key] = (0, classnames_1.default)((0, helper_1.mapObject)(value, function (value) {
                return typeof value === 'string' ? (0, tpl_1.evalExpression)(value, data) : value;
            }));
        }
    });
    return exprProps;
}
exports.default = getExprProperties;
//# sourceMappingURL=./utils/filter-schema.js.map
