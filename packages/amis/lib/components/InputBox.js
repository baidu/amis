"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputBox = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var theme_1 = require("../theme");
var Input_1 = (0, tslib_1.__importDefault)(require("./Input"));
var helper_1 = require("../utils/helper");
var icons_1 = require("./icons");
var InputBox = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(InputBox, _super);
    function InputBox() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            isFocused: false
        };
        return _this;
    }
    InputBox.prototype.clearValue = function (e) {
        e.preventDefault();
        e.stopPropagation();
        var onClear = this.props.onClear;
        var onChange = this.props.onChange;
        onClear === null || onClear === void 0 ? void 0 : onClear(e);
        onChange === null || onChange === void 0 ? void 0 : onChange('');
    };
    InputBox.prototype.handleChange = function (e) {
        var onChange = this.props.onChange;
        onChange && onChange(e.currentTarget.value);
    };
    InputBox.prototype.handleFocus = function (e) {
        var onFocus = this.props.onFocus;
        onFocus && onFocus(e);
        this.setState({
            isFocused: true
        });
    };
    InputBox.prototype.handleBlur = function (e) {
        var onBlur = this.props.onBlur;
        onBlur && onBlur(e);
        this.setState({
            isFocused: false
        });
    };
    InputBox.prototype.render = function () {
        var _a;
        var _b = this.props, className = _b.className, cx = _b.classnames, classPrefix = _b.classPrefix, clearable = _b.clearable, disabled = _b.disabled, hasError = _b.hasError, value = _b.value, placeholder = _b.placeholder, result = _b.prefix, children = _b.children, borderMode = _b.borderMode, onClick = _b.onClick, rest = (0, tslib_1.__rest)(_b, ["className", "classnames", "classPrefix", "clearable", "disabled", "hasError", "value", "placeholder", "prefix", "children", "borderMode", "onClick"]);
        var isFocused = this.state.isFocused;
        return (react_1.default.createElement("div", { className: cx('InputBox', className, (_a = {
                    'is-focused': isFocused,
                    'is-disabled': disabled,
                    'is-error': hasError,
                    'is-clickable': onClick
                },
                _a["InputBox--border".concat((0, helper_1.ucFirst)(borderMode))] = borderMode,
                _a)), onClick: onClick },
            result,
            react_1.default.createElement(Input_1.default, (0, tslib_1.__assign)({}, rest, { value: value || '', onChange: this.handleChange, placeholder: placeholder, onFocus: this.handleFocus, onBlur: this.handleBlur, size: 12, disabled: disabled })),
            children,
            clearable && !disabled && value ? (react_1.default.createElement("a", { onClick: this.clearValue, className: cx('InputBox-clear') },
                react_1.default.createElement(icons_1.Icon, { icon: "close", className: "icon" }))) : null));
    };
    var _a;
    InputBox.defaultProps = {
        clearable: true,
        placeholder: ''
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], InputBox.prototype, "clearValue", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof react_1.default !== "undefined" && react_1.default.ChangeEvent) === "function" ? _a : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], InputBox.prototype, "handleChange", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], InputBox.prototype, "handleFocus", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], InputBox.prototype, "handleBlur", null);
    return InputBox;
}(react_1.default.Component));
exports.InputBox = InputBox;
exports.default = (0, theme_1.themeable)(InputBox);
//# sourceMappingURL=./components/InputBox.js.map
