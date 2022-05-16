"use strict";
/**
 * @file Alert2
 * @author fex
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Alert = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var theme_1 = require("../theme");
var icon_1 = require("../utils/icon");
var icons_1 = require("./icons");
var Alert = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Alert, _super);
    function Alert(props) {
        var _this = _super.call(this, props) || this;
        _this.handleClick = _this.handleClick.bind(_this);
        _this.state = {
            show: true
        };
        return _this;
    }
    Alert.prototype.handleClick = function () {
        this.setState({
            show: false
        }, this.props.onClose);
    };
    Alert.prototype.render = function () {
        var _a;
        var _b = this.props, cx = _b.classnames, className = _b.className, level = _b.level, children = _b.children, showCloseButton = _b.showCloseButton, title = _b.title, icon = _b.icon, showIcon = _b.showIcon, iconClassName = _b.iconClassName, closeButtonClassName = _b.closeButtonClassName;
        // 优先使用内置svg，其次使用icon库
        var iconNode = icon ? (typeof icon === 'string' ? ((0, icons_1.getIcon)(icon) ? (react_1.default.createElement(icons_1.Icon, { icon: icon, className: cx("icon") })) : ((0, icon_1.generateIcon)(cx, icon, 'icon'))) : react_1.default.isValidElement(icon) ? (react_1.default.cloneElement(icon, {
            className: cx("Alert-icon", (_a = icon.props) === null || _a === void 0 ? void 0 : _a.className)
        })) : null) : showIcon ? (react_1.default.createElement(icons_1.Icon, { icon: "alert-".concat(level), className: cx("icon") })) : null;
        return this.state.show ? (react_1.default.createElement("div", { className: cx('Alert', level ? "Alert--".concat(level) : '', className) },
            showIcon && iconNode ? (react_1.default.createElement("div", { className: cx('Alert-icon', iconClassName) }, iconNode)) : null,
            react_1.default.createElement("div", { className: cx('Alert-content') },
                title ? react_1.default.createElement("div", { className: cx('Alert-title') }, title) : null,
                react_1.default.createElement("div", { className: cx('Alert-desc') }, children)),
            showCloseButton ? (react_1.default.createElement("button", { className: cx('Alert-close', closeButtonClassName), onClick: this.handleClick, type: "button" },
                react_1.default.createElement(icons_1.Icon, { icon: "close", className: "icon" }))) : null)) : null;
    };
    Alert.defaultProps = {
        level: 'info',
        className: '',
        showCloseButton: false
    };
    Alert.propsList = [
        'level',
        'className',
        'showCloseButton',
        'onClose'
    ];
    return Alert;
}(react_1.default.Component));
exports.Alert = Alert;
exports.default = (0, theme_1.themeable)(Alert);
//# sourceMappingURL=./components/Alert2.js.map
