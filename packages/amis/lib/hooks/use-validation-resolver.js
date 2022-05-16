"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useValidationResolver = void 0;
var tslib_1 = require("tslib");
/**
 * @file 用 amis 内置的验证来验证 react-hook-form 里面的表单数据
 */
var pick_1 = (0, tslib_1.__importDefault)(require("lodash/pick"));
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var validations_1 = require("../utils/validations");
function formatErrors(errors) {
    var formated = {};
    Object.keys(errors).forEach(function (key) {
        var origin = errors[key][0];
        if (origin) {
            formated[key] = {
                type: origin.rule,
                message: origin.msg
            };
        }
    });
    return formated;
}
function useValidationResolver(__) {
    var _this = this;
    if (__ === void 0) { __ = function (str) { return str; }; }
    return react_1.default.useCallback(function (values, context, config) { return (0, tslib_1.__awaiter)(_this, void 0, void 0, function () {
        var rules, ruleKeys, _i, _a, key, field, errors;
        return (0, tslib_1.__generator)(this, function (_b) {
            rules = {};
            ruleKeys = Object.keys(validations_1.validations);
            for (_i = 0, _a = Object.keys(config.fields); _i < _a.length; _i++) {
                key = _a[_i];
                field = config.fields[key];
                rules[key] = (0, pick_1.default)(field, ruleKeys);
                if (field.required) {
                    rules[key].isRequired = true;
                }
            }
            errors = (0, validations_1.validateObject)(values, rules, undefined, __);
            return [2 /*return*/, {
                    values: values,
                    errors: formatErrors(errors)
                }];
        });
    }); }, [__]);
}
exports.useValidationResolver = useValidationResolver;
//# sourceMappingURL=./hooks/use-validation-resolver.js.map
