"use strict";
/**
 * @file Switch
 * @description
 * @author fex
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Switch = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var theme_1 = require("../theme");
var sizeMap = {
    md: 'i-switch-md',
    lg: 'i-switch-lg',
    middle: 'i-switch-md',
    large: 'i-switch-lg'
};
var levelMap = {
    info: 'bg-info',
    primary: 'bg-primary',
    danger: 'bg-danger'
};
var Switch = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Switch, _super);
    function Switch(props) {
        var _this = _super.call(this, props) || this;
        _this.hanldeCheck = _this.hanldeCheck.bind(_this);
        return _this;
    }
    Switch.prototype.hanldeCheck = function (e) {
        var _a = this.props, trueValue = _a.trueValue, falseValue = _a.falseValue, onChange = _a.onChange;
        if (!onChange) {
            return;
        }
        onChange(e.currentTarget.checked ? trueValue : falseValue);
    };
    Switch.prototype.render = function () {
        var _a = this.props, size = _a.size, level = _a.level, className = _a.className, classPrefix = _a.classPrefix, onChange = _a.onChange, value = _a.value, inline = _a.inline, trueValue = _a.trueValue, falseValue = _a.falseValue, _b = _a.onText, onText = _b === void 0 ? '' : _b, _c = _a.offText, offText = _c === void 0 ? '' : _c, disabled = _a.disabled, readOnly = _a.readOnly, checked = _a.checked, cx = _a.classnames, rest = (0, tslib_1.__rest)(_a, ["size", "level", "className", "classPrefix", "onChange", "value", "inline", "trueValue", "falseValue", "onText", "offText", "disabled", "readOnly", "checked", "classnames"]);
        className =
            (className ? className : '') +
                (size && sizeMap[size] ? " ".concat(sizeMap[size]) : '') +
                (level && levelMap[level] ? " ".concat(levelMap[level]) : '');
        var isChecked = typeof checked !== 'undefined'
            ? checked
            : typeof value === 'undefined'
                ? false
                : value == trueValue;
        return (react_1.default.createElement("label", { className: cx("Switch", isChecked ? 'is-checked' : '', disabled ? 'is-disabled' : '', className) },
            react_1.default.createElement("input", (0, tslib_1.__assign)({ type: "checkbox", checked: isChecked, onChange: this.hanldeCheck, disabled: disabled, readOnly: readOnly }, rest)),
            react_1.default.createElement("span", { className: "text" }, isChecked ? onText : offText),
            react_1.default.createElement("span", { className: "slider" })));
    };
    Switch.defaultProps = {
        trueValue: true,
        falseValue: false
    };
    return Switch;
}(react_1.default.PureComponent));
exports.Switch = Switch;
exports.default = (0, theme_1.themeable)(Switch);
//# sourceMappingURL=./components/Switch.js.map
