"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Value = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var theme_1 = require("../../theme");
var InputBox_1 = (0, tslib_1.__importDefault)(require("../InputBox"));
var NumberInput_1 = (0, tslib_1.__importDefault)(require("../NumberInput"));
var DatePicker_1 = (0, tslib_1.__importDefault)(require("../DatePicker"));
var Select_1 = require("../Select");
var Switch_1 = (0, tslib_1.__importDefault)(require("../Switch"));
var locale_1 = require("../../locale");
var Picker_1 = require("../formula/Picker");
var Value = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Value, _super);
    function Value() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Value.prototype.render = function () {
        var _a;
        var _b = this.props, cx = _b.classnames, field = _b.field, value = _b.value, onChange = _b.onChange, op = _b.op, __ = _b.translate, data = _b.data, disabled = _b.disabled, formula = _b.formula, popOverContainer = _b.popOverContainer, renderEtrValue = _b.renderEtrValue;
        var input = undefined;
        if (formula) {
            // 如果配置了 formula 字段，则所有的输入变为 formula 形式
            formula = Object.assign(formula, {
                translate: __,
                classnames: cx,
                data: data,
                value: value !== null && value !== void 0 ? value : field.defaultValue,
                onChange: onChange,
                disabled: disabled
            });
            input = react_1.default.createElement(Picker_1.FormulaPicker, (0, tslib_1.__assign)({}, formula));
        }
        else if (field.type === 'text') {
            input = (react_1.default.createElement(InputBox_1.default, { value: value !== null && value !== void 0 ? value : field.defaultValue, onChange: onChange, placeholder: __(field.placeholder), disabled: disabled }));
        }
        else if (field.type === 'number') {
            input = (react_1.default.createElement(NumberInput_1.default, { placeholder: __(field.placeholder) || __('NumberInput.placeholder'), step: field.step, min: field.minimum, max: field.maximum, precision: field.precision, value: value !== null && value !== void 0 ? value : field.defaultValue, onChange: onChange, disabled: disabled }));
        }
        else if (field.type === 'date') {
            input = (react_1.default.createElement(DatePicker_1.default, { placeholder: __(field.placeholder) || __('Date.placeholder'), format: field.format || 'YYYY-MM-DD', inputFormat: field.inputFormat || 'YYYY-MM-DD', value: value !== null && value !== void 0 ? value : field.defaultValue, onChange: onChange, timeFormat: "", disabled: disabled, popOverContainer: popOverContainer }));
        }
        else if (field.type === 'time') {
            input = (react_1.default.createElement(DatePicker_1.default, { viewMode: "time", placeholder: __(field.placeholder) || __('Time.placeholder'), format: field.format || 'HH:mm', inputFormat: field.inputFormat || 'HH:mm', value: value !== null && value !== void 0 ? value : field.defaultValue, onChange: onChange, dateFormat: "", timeFormat: field.format || 'HH:mm', disabled: disabled, popOverContainer: popOverContainer }));
        }
        else if (field.type === 'datetime') {
            input = (react_1.default.createElement(DatePicker_1.default, { placeholder: __(field.placeholder) || 'Time.placeholder', format: field.format || '', inputFormat: field.inputFormat || 'YYYY-MM-DD HH:mm', value: value !== null && value !== void 0 ? value : field.defaultValue, onChange: onChange, timeFormat: field.timeFormat || 'HH:mm', disabled: disabled, popOverContainer: popOverContainer }));
        }
        else if (field.type === 'select') {
            var autoComplete = field.autoComplete;
            input = (react_1.default.createElement(Select_1.SelectWithRemoteOptions, { simpleValue: true, options: field.options, source: field.source, autoComplete: autoComplete, searchable: field.searchable, value: (_a = value !== null && value !== void 0 ? value : field.defaultValue) !== null && _a !== void 0 ? _a : '', data: data, onChange: onChange, multiple: op === 'select_any_in' || op === 'select_not_any_in', disabled: disabled, popOverContainer: popOverContainer }));
        }
        else if (field.type === 'boolean') {
            input = (react_1.default.createElement(Switch_1.default, { value: value !== null && value !== void 0 ? value : field.defaultValue, onChange: onChange, disabled: disabled }));
        }
        else if (field.type === 'custom') {
            input = renderEtrValue
                ? renderEtrValue(field.value, {
                    data: data,
                    onChange: onChange,
                    value: value !== null && value !== void 0 ? value : field.defaultValue
                })
                : null;
        }
        else {
            var res = value !== null && value !== void 0 ? value : field.defaultValue;
            input = renderEtrValue
                ? renderEtrValue(field, {
                    data: data,
                    onChange: onChange,
                    value: res ? res[field.name] : res
                })
                : null;
        }
        return react_1.default.createElement("div", { className: cx('CBValue') }, input);
    };
    return Value;
}(react_1.default.Component));
exports.Value = Value;
exports.default = (0, theme_1.themeable)((0, locale_1.localeable)(Value));
//# sourceMappingURL=./components/condition-builder/Value.js.map
