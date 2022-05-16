"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultBox = void 0;
var tslib_1 = require("tslib");
var theme_1 = require("../theme");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var uncontrollable_1 = require("uncontrollable");
var icons_1 = require("./icons");
var Input_1 = (0, tslib_1.__importDefault)(require("./Input"));
var helper_1 = require("../utils/helper");
var locale_1 = require("../locale");
var isPlainObject = require("lodash/isPlainObject");
var ResultBox = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(ResultBox, _super);
    function ResultBox() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            isFocused: false
        };
        _this.inputRef = react_1.default.createRef();
        return _this;
    }
    ResultBox.prototype.focus = function () {
        var _a;
        (_a = this.inputRef.current) === null || _a === void 0 ? void 0 : _a.focus();
    };
    ResultBox.prototype.blur = function () {
        var _a;
        (_a = this.inputRef.current) === null || _a === void 0 ? void 0 : _a.blur();
    };
    ResultBox.prototype.clearValue = function (e) {
        e.preventDefault();
        this.props.onClear && this.props.onClear(e);
        this.props.onResultChange && this.props.onResultChange([]);
    };
    ResultBox.prototype.handleFocus = function (e) {
        var onFocus = this.props.onFocus;
        onFocus && onFocus(e);
        this.setState({
            isFocused: true
        });
    };
    ResultBox.prototype.handleBlur = function (e) {
        var onBlur = this.props.onBlur;
        onBlur && onBlur(e);
        this.setState({
            isFocused: false
        });
    };
    ResultBox.prototype.removeItem = function (e) {
        e.stopPropagation();
        e.preventDefault();
        var _a = this.props, result = _a.result, onResultChange = _a.onResultChange;
        var index = parseInt(e.currentTarget.getAttribute('data-index'), 10);
        var newResult = Array.isArray(result) ? result.concat() : [];
        newResult.splice(index, 1);
        onResultChange && onResultChange(newResult);
    };
    ResultBox.prototype.handleChange = function (e) {
        var onChange = this.props.onChange;
        onChange === null || onChange === void 0 ? void 0 : onChange(e.currentTarget.value);
    };
    ResultBox.prototype.render = function () {
        var _a;
        var _this = this;
        var _b = this.props, className = _b.className, cx = _b.classnames, classPrefix = _b.classPrefix, clearable = _b.clearable, disabled = _b.disabled, hasError = _b.hasError, result = _b.result, value = _b.value, placeholder = _b.placeholder, children = _b.children, itemRender = _b.itemRender, allowInput = _b.allowInput, inputPlaceholder = _b.inputPlaceholder, onResultChange = _b.onResultChange, onChange = _b.onChange, onResultClick = _b.onResultClick, __ = _b.translate, locale = _b.locale, onKeyPress = _b.onKeyPress, onFocus = _b.onFocus, onBlur = _b.onBlur, borderMode = _b.borderMode, useMobileUI = _b.useMobileUI, hasDropDownArrow = _b.hasDropDownArrow, onClear = _b.onClear, rest = (0, tslib_1.__rest)(_b, ["className", "classnames", "classPrefix", "clearable", "disabled", "hasError", "result", "value", "placeholder", "children", "itemRender", "allowInput", "inputPlaceholder", "onResultChange", "onChange", "onResultClick", "translate", "locale", "onKeyPress", "onFocus", "onBlur", "borderMode", "useMobileUI", "hasDropDownArrow", "onClear"]);
        var isFocused = this.state.isFocused;
        var mobileUI = useMobileUI && (0, helper_1.isMobile)();
        return (react_1.default.createElement("div", { className: cx('ResultBox', className, (_a = {
                    'is-focused': isFocused,
                    'is-disabled': disabled,
                    'is-error': hasError,
                    'is-clickable': onResultClick,
                    'is-clearable': clearable,
                    'is-mobile': mobileUI
                },
                _a["ResultBox--border".concat((0, helper_1.ucFirst)(borderMode))] = borderMode,
                _a)), onClick: onResultClick, tabIndex: !allowInput && !disabled && onFocus ? 0 : -1, onKeyPress: allowInput ? undefined : onKeyPress, onFocus: allowInput ? undefined : onFocus, onBlur: allowInput ? undefined : onBlur },
            Array.isArray(result) && result.length ? (result.map(function (item, index) { return (react_1.default.createElement("div", { className: cx('ResultBox-value'), key: index },
                react_1.default.createElement("span", { className: cx('ResultBox-valueLabel') }, itemRender(item)),
                !disabled ? (react_1.default.createElement("a", { "data-index": index, onClick: _this.removeItem },
                    react_1.default.createElement(icons_1.Icon, { icon: "close", className: "icon" }))) : null)); })) : result && !Array.isArray(result) ? (react_1.default.createElement("span", { className: cx('ResultBox-singleValue') }, isPlainObject(result) ? itemRender(result) : result)) : allowInput && !disabled ? null : (react_1.default.createElement("span", { className: cx('ResultBox-placeholder') }, __(placeholder || 'placeholder.noData'))),
            allowInput && !disabled ? (react_1.default.createElement(Input_1.default, (0, tslib_1.__assign)({}, rest, { onKeyPress: onKeyPress, ref: this.inputRef, value: value || '', onChange: this.handleChange, placeholder: __(Array.isArray(result) && result.length
                    ? inputPlaceholder
                    : placeholder), onFocus: this.handleFocus, onBlur: this.handleBlur }))) : null,
            children,
            clearable &&
                !disabled &&
                (Array.isArray(result) ? result.length : result) ? (react_1.default.createElement("a", { onClick: this.clearValue, className: cx('ResultBox-clear', {
                    'ResultBox-clear-with-arrow': hasDropDownArrow
                }) },
                react_1.default.createElement("div", { className: cx('ResultBox-clear-wrap') },
                    react_1.default.createElement(icons_1.Icon, { icon: "input-clear", className: "icon" })))) : null,
            hasDropDownArrow && !mobileUI && (react_1.default.createElement("span", { className: cx('ResultBox-pc-arrow') },
                react_1.default.createElement(icons_1.Icon, { icon: "caret", className: "icon" }))),
            !allowInput && mobileUI ? (react_1.default.createElement("span", { className: cx('ResultBox-arrow') },
                react_1.default.createElement(icons_1.Icon, { icon: "caret", className: "icon" }))) : null));
    };
    var _a, _b, _c;
    ResultBox.defaultProps = {
        clearable: false,
        placeholder: 'placeholder.noData',
        inputPlaceholder: 'placeholder.enter',
        itemRender: function (option) { return (react_1.default.createElement("span", null, "".concat(option.scopeLabel || '').concat(option.label))); }
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof react_1.default !== "undefined" && react_1.default.MouseEvent) === "function" ? _a : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], ResultBox.prototype, "clearValue", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], ResultBox.prototype, "handleFocus", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], ResultBox.prototype, "handleBlur", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_b = typeof react_1.default !== "undefined" && react_1.default.MouseEvent) === "function" ? _b : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], ResultBox.prototype, "removeItem", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_c = typeof react_1.default !== "undefined" && react_1.default.ChangeEvent) === "function" ? _c : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], ResultBox.prototype, "handleChange", null);
    return ResultBox;
}(react_1.default.Component));
exports.ResultBox = ResultBox;
exports.default = (0, theme_1.themeable)((0, locale_1.localeable)((0, uncontrollable_1.uncontrollable)(ResultBox, {
    value: 'onChange',
    result: 'onResultChange'
})));
//# sourceMappingURL=./components/ResultBox.js.map
