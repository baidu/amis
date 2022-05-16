"use strict";
/**
 * @file Tag
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckableTag = exports.Tag = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var theme_1 = require("../theme");
var icons_1 = require("./icons");
var icon_1 = require("../utils/icon");
var helper_1 = require("../utils/helper");
var PRESET_COLOR = [
    'inactive',
    'active',
    'success',
    'processing',
    'error',
    'warning'
];
var Tag = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Tag, _super);
    function Tag() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Tag.prototype.renderCloseIcon = function () {
        var _a = this.props, closeIcon = _a.closeIcon, cx = _a.classnames, closable = _a.closable;
        if (!closable) {
            return null;
        }
        var icon = typeof closeIcon === 'string' ? ((0, icons_1.getIcon)(closeIcon) ? (react_1.default.createElement(icons_1.Icon, { icon: closeIcon, className: "icon" })) : ((0, icon_1.generateIcon)(cx, closeIcon, 'Icon'))) : react_1.default.isValidElement(closeIcon) ? (closeIcon) : (react_1.default.createElement(icons_1.Icon, { icon: "close", className: "icon" }));
        return (react_1.default.createElement("span", { className: cx("Tag--close"), onClick: this.handleClose }, icon));
    };
    Tag.prototype.handleClose = function (e) {
        var onClose = this.props.onClose;
        e.stopPropagation();
        onClose === null || onClose === void 0 ? void 0 : onClose(e);
    };
    Tag.prototype.render = function () {
        var _a;
        var _b = this.props, children = _b.children, cx = _b.classnames, className = _b.className, displayMode = _b.displayMode, disabled = _b.disabled, color = _b.color, icon = _b.icon, style = _b.style, label = _b.label;
        var isPresetColor = color && PRESET_COLOR.indexOf(color) !== -1;
        var customColor = color && !isPresetColor ? color : undefined;
        var tagStyle = (0, tslib_1.__assign)({ backgroundColor: displayMode === 'normal' ? customColor : undefined, borderColor: displayMode === 'rounded' ? customColor : undefined, color: displayMode === 'rounded' ? customColor : undefined }, style);
        var prevIcon = displayMode === 'status' && (react_1.default.createElement("span", { className: cx('Tag--prev') }, typeof icon === 'string' ? ((0, icons_1.getIcon)(icon) ? (react_1.default.createElement(icons_1.Icon, { icon: icon, className: "icon" })) : ((0, icon_1.generateIcon)(cx, icon, 'Icon'))) : react_1.default.isValidElement(icon) ? (icon) : (react_1.default.createElement(icons_1.Icon, { icon: "dot", className: "icon" }))));
        return (react_1.default.createElement("span", { className: cx('Tag', "Tag--".concat(displayMode), className, (_a = {},
                _a["Tag--".concat(displayMode, "--").concat(color)] = isPresetColor,
                _a["Tag--".concat(displayMode, "--hasColor")] = color,
                _a["Tag--disabled"] = disabled,
                _a)), style: tagStyle },
            prevIcon,
            label || children,
            this.renderCloseIcon()));
    };
    var _a;
    Tag.defaultProps = {
        displayMode: 'normal'
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof react_1.default !== "undefined" && react_1.default.MouseEvent) === "function" ? _a : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Tag.prototype, "handleClose", null);
    return Tag;
}(react_1.default.Component));
exports.Tag = Tag;
var CheckableTagComp = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(CheckableTagComp, _super);
    function CheckableTagComp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CheckableTagComp.prototype.handleClick = function (e) {
        var _a = this.props, onChange = _a.onChange, onClick = _a.onClick, checked = _a.checked;
        onChange === null || onChange === void 0 ? void 0 : onChange(!checked);
        onClick === null || onClick === void 0 ? void 0 : onClick(e);
    };
    CheckableTagComp.prototype.render = function () {
        var _a = this.props, cx = _a.classnames, className = _a.className, disabled = _a.disabled, label = _a.label, children = _a.children, checked = _a.checked, _b = _a.style, style = _b === void 0 ? {} : _b;
        return (react_1.default.createElement("span", { className: cx(className, 'Tag', 'Tag--checkable', {
                'Tag--checkable--checked': checked,
                'Tag--checkable--disabled': disabled
            }), onClick: disabled ? helper_1.noop : this.handleClick, style: style }, label || children));
    };
    var _b;
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_b = typeof react_1.default !== "undefined" && react_1.default.MouseEvent) === "function" ? _b : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], CheckableTagComp.prototype, "handleClick", null);
    return CheckableTagComp;
}(react_1.default.Component));
exports.CheckableTag = (0, theme_1.themeable)(CheckableTagComp);
exports.default = (0, theme_1.themeable)(Tag);
//# sourceMappingURL=./components/Tag.js.map
