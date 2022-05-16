"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationPicker = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var theme_1 = require("../theme");
var Overlay_1 = (0, tslib_1.__importDefault)(require("./Overlay"));
var PopOver_1 = (0, tslib_1.__importDefault)(require("./PopOver"));
var icons_1 = require("./icons");
var helper_1 = require("../utils/helper");
var Alert2_1 = (0, tslib_1.__importDefault)(require("./Alert2"));
var BaiduMapPicker_1 = (0, tslib_1.__importDefault)(require("./BaiduMapPicker"));
var locale_1 = require("../locale");
var LocationPicker = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(LocationPicker, _super);
    function LocationPicker() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.domRef = react_1.default.createRef();
        _this.state = {
            isFocused: false,
            isOpened: false
        };
        return _this;
    }
    LocationPicker.prototype.handleKeyPress = function (e) {
        if (e.key === ' ') {
            this.handleClick();
            e.preventDefault();
        }
    };
    LocationPicker.prototype.handleFocus = function () {
        this.setState({
            isFocused: true
        });
    };
    LocationPicker.prototype.handleBlur = function () {
        this.setState({
            isFocused: true
        });
    };
    LocationPicker.prototype.handleClick = function () {
        this.state.isOpened ? this.close() : this.open();
    };
    LocationPicker.prototype.getTarget = function () {
        return this.domRef.current;
    };
    LocationPicker.prototype.getParent = function () {
        var _a;
        return (_a = this.domRef.current) === null || _a === void 0 ? void 0 : _a.parentElement;
    };
    LocationPicker.prototype.open = function (fn) {
        this.props.disabled ||
            this.setState({
                isOpened: true
            }, fn);
    };
    LocationPicker.prototype.close = function () {
        this.setState({
            isOpened: false
        });
    };
    LocationPicker.prototype.clearValue = function (e) {
        e.preventDefault();
        e.stopPropagation();
        var onChange = this.props.onChange;
        onChange('');
    };
    LocationPicker.prototype.handlePopOverClick = function (e) {
        e.stopPropagation();
        e.preventDefault();
    };
    LocationPicker.prototype.handleChange = function (value) {
        if (value) {
            value = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, value), { vendor: this.props.vendor });
        }
        this.props.onChange(value);
    };
    LocationPicker.prototype.render = function () {
        var _a;
        var _b = this.props, cx = _b.classnames, value = _b.value, className = _b.className, popoverClassName = _b.popoverClassName, disabled = _b.disabled, placeholder = _b.placeholder, clearable = _b.clearable, popOverContainer = _b.popOverContainer, vendor = _b.vendor, coordinatesType = _b.coordinatesType, ak = _b.ak;
        var __ = this.props.translate;
        var _c = this.state, isFocused = _c.isFocused, isOpened = _c.isOpened;
        return (react_1.default.createElement("div", { tabIndex: 0, onKeyPress: this.handleKeyPress, onFocus: this.handleFocus, onBlur: this.handleBlur, className: cx("LocationPicker", {
                'is-disabled': disabled,
                'is-focused': isFocused,
                'is-active': isOpened
            }, className), ref: this.domRef, onClick: this.handleClick },
            value ? (react_1.default.createElement("span", { className: cx('LocationPicker-value') }, value.address)) : (react_1.default.createElement("span", { className: cx('LocationPicker-placeholder') }, __(placeholder))),
            clearable && !disabled && value ? (react_1.default.createElement("a", { className: cx('LocationPicker-clear'), onClick: this.clearValue },
                react_1.default.createElement(icons_1.Icon, { icon: "input-clear", className: "icon" }))) : null,
            react_1.default.createElement("a", { className: cx('LocationPicker-toggler') },
                react_1.default.createElement(icons_1.Icon, { icon: "location", className: "icon" })),
            react_1.default.createElement(Overlay_1.default, { target: this.getTarget, container: popOverContainer || this.getParent, rootClose: false, show: isOpened },
                react_1.default.createElement(PopOver_1.default, { className: cx('LocationPicker-popover', popoverClassName), onHide: this.close, overlay: true, onClick: this.handlePopOverClick, style: { width: (_a = this.getTarget()) === null || _a === void 0 ? void 0 : _a.offsetWidth } }, vendor === 'baidu' ? (react_1.default.createElement(BaiduMapPicker_1.default, { ak: ak, value: value, coordinatesType: coordinatesType, onChange: this.handleChange })) : (react_1.default.createElement(Alert2_1.default, null, __('${vendor} 地图控件不支持', { vendor: vendor })))))));
    };
    var _a, _b, _c;
    LocationPicker.defaultProps = {
        placeholder: 'LocationPicker.placeholder',
        clearable: false
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof react_1.default !== "undefined" && react_1.default.KeyboardEvent) === "function" ? _a : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], LocationPicker.prototype, "handleKeyPress", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], LocationPicker.prototype, "handleFocus", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], LocationPicker.prototype, "handleBlur", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], LocationPicker.prototype, "handleClick", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], LocationPicker.prototype, "getTarget", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], LocationPicker.prototype, "getParent", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Function]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], LocationPicker.prototype, "open", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], LocationPicker.prototype, "close", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_b = typeof react_1.default !== "undefined" && react_1.default.MouseEvent) === "function" ? _b : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], LocationPicker.prototype, "clearValue", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_c = typeof react_1.default !== "undefined" && react_1.default.MouseEvent) === "function" ? _c : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], LocationPicker.prototype, "handlePopOverClick", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], LocationPicker.prototype, "handleChange", null);
    return LocationPicker;
}(react_1.default.Component));
exports.LocationPicker = LocationPicker;
var ThemedCity = (0, theme_1.themeable)((0, locale_1.localeable)(LocationPicker));
exports.default = ThemedCity;
//# sourceMappingURL=./components/LocationPicker.js.map
