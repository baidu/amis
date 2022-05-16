"use strict";
/**
 * @file Checkbox
 * @author fex
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Checkbox = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var theme_1 = require("../theme");
var helper_1 = require("../utils/helper");
var preventEvent = function (e) { return e.stopPropagation(); };
var Checkbox = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Checkbox, _super);
    function Checkbox() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Checkbox.prototype.handleCheck = function (e) {
        var _a = this.props, trueValue = _a.trueValue, falseValue = _a.falseValue, onChange = _a.onChange;
        if (!onChange) {
            return;
        }
        onChange(e.currentTarget.checked ? trueValue : falseValue, e.nativeEvent.shiftKey);
    };
    Checkbox.prototype.render = function () {
        var _a;
        var _b = this.props, size = _b.size, className = _b.className, cx = _b.classnames, value = _b.value, label = _b.label, partial = _b.partial, trueValue = _b.trueValue, children = _b.children, disabled = _b.disabled, description = _b.description, readOnly = _b.readOnly, checked = _b.checked, type = _b.type, name = _b.name, labelClassName = _b.labelClassName, optionType = _b.optionType;
        return (react_1.default.createElement("label", { className: cx("Checkbox Checkbox--".concat(type), className, (_a = {
                    'Checkbox--full': !partial
                },
                // 'Checkbox--partial': partial
                _a["Checkbox--".concat(size)] = size,
                _a['Checkbox--button'] = optionType === 'button',
                _a['Checkbox--button--checked'] = optionType === 'button' && checked,
                _a['Checkbox--button--disabled--unchecked'] = optionType === 'button' && disabled && !checked,
                _a)) },
            react_1.default.createElement("input", { type: type, checked: typeof checked !== 'undefined'
                    ? checked
                    : typeof value === 'undefined'
                        ? value
                        : value == trueValue, onChange: this.handleCheck, onClick: preventEvent // 当点击 i 的时候，这个地方也会触发 click，很奇怪，干脆禁掉
                , disabled: disabled, readOnly: readOnly, name: name }),
            react_1.default.createElement("i", null),
            react_1.default.createElement("span", { className: cx(labelClassName) }, children || label),
            description ? (react_1.default.createElement("div", { className: cx('Checkbox-desc') }, description)) : null));
    };
    var _a;
    Checkbox.defaultProps = {
        trueValue: true,
        falseValue: false,
        type: 'checkbox'
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof react_1.default !== "undefined" && react_1.default.ChangeEvent) === "function" ? _a : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Checkbox.prototype, "handleCheck", null);
    return Checkbox;
}(react_1.default.Component));
exports.Checkbox = Checkbox;
exports.default = (0, theme_1.themeable)(Checkbox);
//# sourceMappingURL=./components/Checkbox.js.map
