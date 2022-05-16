"use strict";
/**
 * @file Radios
 * @description
 * @author fex
 *
 * @param 参数说明：
 * options: [
 *   {
 *      label: '显示的名字',
 *      value: '值',
 *      disabled: false
 *   }
 * ]
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Radios = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var uncontrollable_1 = require("uncontrollable");
var Checkbox_1 = (0, tslib_1.__importDefault)(require("./Checkbox"));
var Button_1 = (0, tslib_1.__importDefault)(require("./Button"));
var Select_1 = require("./Select");
var theme_1 = require("../theme");
var columnsSplit_1 = require("../utils/columnsSplit");
var Radios = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Radios, _super);
    function Radios() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Radios.prototype.toggleOption = function (option) {
        var _a = this.props, value = _a.value, onChange = _a.onChange, valueField = _a.valueField, clearable = _a.clearable, delimiter = _a.delimiter, options = _a.options;
        var valueArray = (0, Select_1.value2array)(value, {
            multiple: false,
            delimiter: delimiter,
            valueField: valueField,
            options: options
        });
        var idx = valueArray.indexOf(option);
        if (~idx) {
            clearable && valueArray.splice(idx, 1);
        }
        else {
            valueArray = [option];
        }
        var newValue = valueArray[0];
        onChange && onChange(newValue);
    };
    Radios.prototype.renderGroup = function (option, index, valueArray) {
        var _this = this;
        var _a = this.props, cx = _a.classnames, optionType = _a.optionType, ns = _a.classPrefix;
        return (react_1.default.createElement("div", { key: index, className: cx('RadiosControl-group', option.className) },
            react_1.default.createElement("label", { className: cx('RadiosControl-groupLabel', option.labelClassName) }, option.label),
            option.children && option.children.length
                ? option.children.map(function (option, index) {
                    return _this.renderItem(option, index, valueArray);
                })
                : null));
    };
    Radios.prototype.renderItem = function (option, index, valueArray) {
        var _this = this;
        if (option.children) {
            return this.renderGroup(option, index, valueArray);
        }
        var _a = this.props, disabled = _a.disabled, inline = _a.inline, itemClassName = _a.itemClassName, cx = _a.classnames, labelClassName = _a.labelClassName, labelField = _a.labelField, optionType = _a.optionType, level = _a.level, btnActiveLevel = _a.btnActiveLevel, ns = _a.classPrefix;
        if (optionType === 'button') {
            var active = !!~valueArray.indexOf(option);
            return (react_1.default.createElement(Button_1.default, { key: index, active: active, onClick: function () { return _this.toggleOption(option); }, className: cx(itemClassName, option.className), disabled: disabled || option.disabled, level: (active ? btnActiveLevel : '') || level },
                react_1.default.createElement("span", null, "".concat(option[labelField || 'label']))));
        }
        return (react_1.default.createElement(Checkbox_1.default, { type: "radio", key: index, onChange: function () { return _this.toggleOption(option); }, checked: !!~valueArray.indexOf(option), className: cx(itemClassName, option.className), disabled: disabled || option.disabled, description: option.description, inline: inline, labelClassName: labelClassName }, "".concat(option[labelField || 'label'])));
    };
    Radios.prototype.render = function () {
        var _this = this;
        var _a = this.props, value = _a.value, options = _a.options, className = _a.className, cx = _a.classnames, placeholder = _a.placeholder, columnsCount = _a.columnsCount, joinValues = _a.joinValues, extractValue = _a.extractValue, disabled = _a.disabled, inline = _a.inline, delimiter = _a.delimiter, valueField = _a.valueField;
        var valueArray = (0, Select_1.value2array)(value, {
            multiple: false,
            delimiter: delimiter,
            valueField: valueField,
            options: options
        });
        var body = [];
        if (options) {
            body = options.map(function (option, key) {
                return _this.renderItem(option, key, valueArray);
            });
        }
        if (!inline) {
            body = (0, columnsSplit_1.columnsSplit)(body, cx, columnsCount);
        }
        return (react_1.default.createElement("div", { className: className }, body && body.length ? body : placeholder));
    };
    Radios.defaultProps = {
        type: 'radio',
        optionType: 'default',
        btnActiveLevel: 'primary',
        resetValue: '',
        inline: true,
        joinValues: true,
        clearable: false,
        columnsCount: 1 // 一行显示一个
    };
    return Radios;
}(react_1.default.Component));
exports.Radios = Radios;
exports.default = (0, theme_1.themeable)((0, uncontrollable_1.uncontrollable)(Radios, {
    value: 'onChange'
}));
//# sourceMappingURL=./components/Radios.js.map
