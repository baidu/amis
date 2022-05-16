"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Expression = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var Field_1 = (0, tslib_1.__importDefault)(require("./Field"));
var helper_1 = require("../../utils/helper");
var Value_1 = (0, tslib_1.__importDefault)(require("./Value"));
var InputSwitch_1 = (0, tslib_1.__importDefault)(require("./InputSwitch"));
var Func_1 = (0, tslib_1.__importDefault)(require("./Func"));
var theme_1 = require("../../theme");
var Formula_1 = (0, tslib_1.__importDefault)(require("./Formula"));
var locale_1 = require("../../locale");
var fieldMap = {
    value: '值',
    field: '字段',
    func: '函数',
    formula: '公式'
};
var Expression = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Expression, _super);
    function Expression() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Expression.prototype.handleInputTypeChange = function (type) {
        var _a;
        var value = this.props.value;
        var onChange = this.props.onChange;
        if (type === 'value') {
            value = '';
        }
        else if (type === 'func') {
            value = {
                type: 'func',
                func: (_a = (0, helper_1.findTree)(this.props.funcs, function (item) { return item.type; })) === null || _a === void 0 ? void 0 : _a.type,
                args: []
            };
        }
        else if (type === 'field') {
            value = {
                type: 'field',
                field: ''
            };
        }
        else if (type === 'formula') {
            value = {
                type: 'formula',
                value: ''
            };
        }
        onChange(value, this.props.index);
    };
    Expression.prototype.handleValueChange = function (data) {
        this.props.onChange(data, this.props.index);
    };
    Expression.prototype.handleFieldChange = function (field) {
        var value = this.props.value;
        var onChange = this.props.onChange;
        value = {
            type: 'field',
            field: field
        };
        onChange(value, this.props.index);
    };
    Expression.prototype.handleFuncChange = function (func) {
        var value = this.props.value;
        var onChange = this.props.onChange;
        value = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, func), { type: 'func' });
        onChange(value, this.props.index);
    };
    Expression.prototype.handleFormulaChange = function (formula) {
        var value = this.props.value;
        var onChange = this.props.onChange;
        value = {
            type: 'formula',
            value: formula
        };
        onChange(value, this.props.index);
    };
    Expression.prototype.render = function () {
        var _a, _b, _c, _d, _e;
        var _f = this.props, value = _f.value, valueField = _f.valueField, allowedTypes = _f.allowedTypes, funcs = _f.funcs, fields = _f.fields, op = _f.op, cx = _f.classnames, fieldClassName = _f.fieldClassName, config = _f.config, data = _f.data, disabled = _f.disabled, searchable = _f.searchable, formula = _f.formula, popOverContainer = _f.popOverContainer, renderEtrValue = _f.renderEtrValue;
        var inputType = (((_a = value) === null || _a === void 0 ? void 0 : _a.type) === 'field'
            ? 'field'
            : ((_b = value) === null || _b === void 0 ? void 0 : _b.type) === 'func'
                ? 'func'
                : ((_c = value) === null || _c === void 0 ? void 0 : _c.type) === 'formula'
                    ? 'formula'
                    : value !== undefined
                        ? 'value'
                        : undefined) ||
            (allowedTypes === null || allowedTypes === void 0 ? void 0 : allowedTypes[0]) ||
            'value';
        var types = allowedTypes || ['value', 'field', 'func'];
        if ((!Array.isArray(funcs) || !funcs.length) && ~types.indexOf('func')) {
            types.splice(types.indexOf('func'), 1);
        }
        return (react_1.default.createElement(react_1.default.Fragment, null,
            inputType === 'value' ? (react_1.default.createElement(Value_1.default, { field: valueField, value: value, onChange: this.handleValueChange, op: op, data: data, disabled: disabled, formula: formula, popOverContainer: popOverContainer, renderEtrValue: renderEtrValue })) : null,
            inputType === 'field' ? (react_1.default.createElement(Field_1.default, { value: (_d = value) === null || _d === void 0 ? void 0 : _d.field, onChange: this.handleFieldChange, fieldClassName: fieldClassName, disabled: disabled, searchable: searchable, popOverContainer: popOverContainer, options: valueField
                    ? (0, helper_1.filterTree)(fields, function (item) {
                        return item.children ||
                            item.type === valueField.type;
                    })
                    : fields })) : null,
            inputType === 'func' ? (react_1.default.createElement(Func_1.default, { config: config, value: value, onChange: this.handleFuncChange, fieldClassName: fieldClassName, funcs: funcs, fields: fields, allowedTypes: allowedTypes, disabled: disabled })) : null,
            inputType === 'formula' ? (react_1.default.createElement(Formula_1.default, { value: (_e = value) === null || _e === void 0 ? void 0 : _e.value, onChange: this.handleFormulaChange, disabled: disabled })) : null,
            types.length > 1 ? (react_1.default.createElement(InputSwitch_1.default, { disabled: disabled, value: inputType, popOverContainer: popOverContainer, onChange: this.handleInputTypeChange, options: types.map(function (item) { return ({
                    label: fieldMap[item],
                    value: item
                }); }) })) : null));
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [String]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Expression.prototype, "handleInputTypeChange", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Expression.prototype, "handleValueChange", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [String]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Expression.prototype, "handleFieldChange", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Expression.prototype, "handleFuncChange", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [String]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Expression.prototype, "handleFormulaChange", null);
    return Expression;
}(react_1.default.Component));
exports.Expression = Expression;
exports.default = (0, theme_1.themeable)((0, locale_1.localeable)(Expression));
//# sourceMappingURL=./components/condition-builder/Expression.js.map
