"use strict";
/**
 * @file Checkboxes
 * @description 多选输入框
 * @author fex
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Selection = exports.BaseSelection = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var uncontrollable_1 = require("uncontrollable");
var Checkbox_1 = (0, tslib_1.__importDefault)(require("./Checkbox"));
var theme_1 = require("../theme");
var helper_1 = require("../utils/helper");
var isEqual_1 = (0, tslib_1.__importDefault)(require("lodash/isEqual"));
var locale_1 = require("../locale");
var BaseSelection = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(BaseSelection, _super);
    function BaseSelection() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseSelection.itemRender = function (option, states) {
        return react_1.default.createElement("span", null, option.label);
    };
    BaseSelection.value2array = function (value, options, option2value) {
        if (option2value === void 0) { option2value = function (option) { return option; }; }
        if (value === void 0) {
            return [];
        }
        if (!Array.isArray(value)) {
            value = [value];
        }
        return value.map(function (value) {
            var option = (0, helper_1.findTree)(options, function (option) {
                return (0, isEqual_1.default)(option2value(option), value);
            });
            return option || value;
        });
    };
    BaseSelection.resolveSelected = function (value, options, option2value) {
        if (option2value === void 0) { option2value = function (option) { return option; }; }
        value = Array.isArray(value) ? value[0] : value;
        return (0, helper_1.findTree)(options, function (option) { return (0, isEqual_1.default)(option2value(option), value); });
    };
    // 获取两个数组的交集
    BaseSelection.prototype.intersectArray = function (arr1, arr2) {
        if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
            return [];
        }
        var len1 = arr1.length;
        var len2 = arr2.length;
        if (len1 < len2) {
            return this.intersectArray(arr2, arr1);
        }
        return Array.from(new Set(arr1.filter(function (item) { return arr2.includes(item); })));
    };
    BaseSelection.prototype.toggleOption = function (option) {
        var _a = this.props, value = _a.value, onChange = _a.onChange, option2value = _a.option2value, options = _a.options, disabled = _a.disabled, multiple = _a.multiple, clearable = _a.clearable;
        if (disabled || option.disabled) {
            return;
        }
        var valueArray = BaseSelection.value2array(value, options, option2value);
        var idx = valueArray.indexOf(option);
        if (~idx && (multiple || clearable)) {
            valueArray.splice(idx, 1);
        }
        else if (multiple) {
            valueArray.push(option);
        }
        else {
            valueArray = [option];
        }
        var newValue = option2value
            ? valueArray.map(function (item) { return option2value(item); })
            : valueArray;
        onChange && onChange(multiple ? newValue : newValue[0]);
    };
    BaseSelection.prototype.toggleAll = function () {
        var _a = this.props, value = _a.value, onChange = _a.onChange, option2value = _a.option2value, options = _a.options;
        var valueArray = [];
        var availableOptions = options.filter(function (option) { return !option.disabled; });
        var intersectOptions = this.intersectArray(value, availableOptions);
        if (!Array.isArray(value)) {
            valueArray = availableOptions;
        }
        else if (intersectOptions.length < availableOptions.length) {
            valueArray = Array.from(new Set((0, tslib_1.__spreadArray)((0, tslib_1.__spreadArray)([], value, true), availableOptions, true)));
        }
        else {
            valueArray = value.filter(function (item) { return !availableOptions.includes(item); });
        }
        var newValue = option2value
            ? valueArray.map(function (item) { return option2value(item); })
            : valueArray;
        onChange && onChange(newValue);
    };
    BaseSelection.prototype.render = function () {
        var _this = this;
        var _a = this.props, value = _a.value, options = _a.options, className = _a.className, placeholder = _a.placeholder, inline = _a.inline, labelClassName = _a.labelClassName, disabled = _a.disabled, cx = _a.classnames, option2value = _a.option2value, itemClassName = _a.itemClassName, itemRender = _a.itemRender, multiple = _a.multiple, onClick = _a.onClick;
        var __ = this.props.translate;
        var valueArray = BaseSelection.value2array(value, options, option2value);
        var body = [];
        if (Array.isArray(options) && options.length) {
            body = options.map(function (option, key) { return (react_1.default.createElement(Checkbox_1.default, { type: multiple ? 'checkbox' : 'radio', className: cx(itemClassName, option.className), key: key, onChange: function () { return _this.toggleOption(option); }, checked: !!~valueArray.indexOf(option), disabled: disabled || option.disabled, labelClassName: labelClassName, description: option.description }, itemRender(option, {
                index: key,
                multiple: multiple,
                checked: !!~valueArray.indexOf(option),
                onChange: function () { return _this.toggleOption(option); },
                disabled: disabled || option.disabled
            }))); });
        }
        return (react_1.default.createElement("div", { className: cx('Selection', className, inline ? 'Selection--inline' : ''), onClick: onClick }, body && body.length ? body : react_1.default.createElement("div", null, __(placeholder))));
    };
    BaseSelection.defaultProps = {
        placeholder: 'placeholder.noOption',
        itemRender: BaseSelection.itemRender,
        multiple: true,
        clearable: false
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], BaseSelection.prototype, "toggleAll", null);
    return BaseSelection;
}(react_1.default.Component));
exports.BaseSelection = BaseSelection;
var Selection = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Selection, _super);
    function Selection() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Selection;
}(BaseSelection));
exports.Selection = Selection;
exports.default = (0, theme_1.themeable)((0, locale_1.localeable)((0, uncontrollable_1.uncontrollable)(Selection, {
    value: 'onChange'
})));
//# sourceMappingURL=./components/Selection.js.map
