"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Textarea = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var react_dom_1 = require("react-dom");
var react_textarea_autosize_1 = (0, tslib_1.__importDefault)(require("react-textarea-autosize"));
var locale_1 = require("../locale");
var theme_1 = require("../theme");
var helper_1 = require("../utils/helper");
var icons_1 = require("./icons");
var Textarea = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Textarea, _super);
    function Textarea() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            focused: false
        };
        _this.inputRef = function (ref) { return (_this.input = (0, react_dom_1.findDOMNode)(ref)); };
        return _this;
    }
    Textarea.prototype.valueToString = function (value) {
        return typeof value === 'undefined' || value === null
            ? ''
            : typeof value === 'string'
                ? value
                : JSON.stringify(value);
    };
    Textarea.prototype.focus = function () {
        var _this = this;
        if (!this.input) {
            return;
        }
        this.setState({
            focused: true
        }, function () {
            if (!_this.input) {
                return;
            }
            _this.input.focus();
            // 光标放到最后
            var len = _this.input.value.length;
            len && _this.input.setSelectionRange(len, len);
        });
    };
    Textarea.prototype.handleChange = function (e) {
        var onChange = this.props.onChange;
        var value = e.currentTarget.value;
        onChange === null || onChange === void 0 ? void 0 : onChange(value);
    };
    Textarea.prototype.handleFocus = function (e) {
        var onFocus = this.props.onFocus;
        this.setState({
            focused: true
        }, function () {
            onFocus === null || onFocus === void 0 ? void 0 : onFocus(e);
        });
    };
    Textarea.prototype.handleBlur = function (e) {
        var _a = this.props, onBlur = _a.onBlur, trimContents = _a.trimContents, value = _a.value, onChange = _a.onChange;
        this.setState({
            focused: false
        }, function () {
            if (trimContents && value && typeof value === 'string') {
                onChange === null || onChange === void 0 ? void 0 : onChange(value.trim());
            }
            onBlur && onBlur(e);
        });
    };
    Textarea.prototype.handleClear = function () {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var _a, onChange, resetValue;
            return (0, tslib_1.__generator)(this, function (_b) {
                _a = this.props, onChange = _a.onChange, resetValue = _a.resetValue;
                onChange === null || onChange === void 0 ? void 0 : onChange(resetValue);
                this.focus();
                return [2 /*return*/];
            });
        });
    };
    Textarea.prototype.render = function () {
        var _a;
        var _b = this.props, className = _b.className, ns = _b.classPrefix, value = _b.value, placeholder = _b.placeholder, disabled = _b.disabled, minRows = _b.minRows, maxRows = _b.maxRows, readOnly = _b.readOnly, name = _b.name, borderMode = _b.borderMode, cx = _b.classnames, maxLength = _b.maxLength, showCounter = _b.showCounter, clearable = _b.clearable;
        var counter = showCounter ? this.valueToString(value).length : 0;
        return (react_1.default.createElement("div", { className: cx("TextareaControl", (_a = {},
                _a["TextareaControl--border".concat((0, helper_1.ucFirst)(borderMode))] = borderMode,
                _a['is-focused'] = this.state.focused,
                _a['is-disabled'] = disabled,
                _a), className) },
            react_1.default.createElement(react_textarea_autosize_1.default, { className: cx("TextareaControl-input"), autoComplete: "off", ref: this.inputRef, name: name, disabled: disabled, value: this.valueToString(value), placeholder: placeholder, autoCorrect: "off", spellCheck: "false", readOnly: readOnly, minRows: minRows || undefined, maxRows: maxRows || undefined, onChange: this.handleChange, onFocus: this.handleFocus, onBlur: this.handleBlur }),
            clearable && !disabled && value ? (react_1.default.createElement("a", { onClick: this.handleClear, className: cx('TextareaControl-clear') },
                react_1.default.createElement(icons_1.Icon, { icon: "input-clear", className: "icon" }))) : null,
            showCounter ? (react_1.default.createElement("span", { className: cx('TextareaControl-counter', {
                    'is-empty': counter === 0,
                    'is-clearable': clearable && !disabled && value
                }) }, "".concat(counter).concat(typeof maxLength === 'number' && maxLength ? "/".concat(maxLength) : ''))) : null));
    };
    var _a, _b, _c;
    Textarea.defaultProps = {
        minRows: 3,
        maxRows: 20,
        trimContents: true,
        resetValue: '',
        clearable: false
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof react_1.default !== "undefined" && react_1.default.ChangeEvent) === "function" ? _a : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Textarea.prototype, "handleChange", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_b = typeof react_1.default !== "undefined" && react_1.default.FocusEvent) === "function" ? _b : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Textarea.prototype, "handleFocus", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_c = typeof react_1.default !== "undefined" && react_1.default.FocusEvent) === "function" ? _c : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Textarea.prototype, "handleBlur", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", Promise)
    ], Textarea.prototype, "handleClear", null);
    return Textarea;
}(react_1.default.Component));
exports.Textarea = Textarea;
exports.default = (0, theme_1.themeable)((0, locale_1.localeable)(Textarea));
//# sourceMappingURL=./components/Textarea.js.map
