"use strict";
/**
 * @file Toast
 * @description toast提示组件, 单例模式，App级别只需要一个ToastComponent，引入了多个会兼容，也只有第一个生效
 * @author fex
 */
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.toast = exports.ToastMessage = exports.ToastComponent = void 0;
var tslib_1 = require("tslib");
var Transition_1 = tslib_1.__importStar(require("react-transition-group/Transition"));
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var Html_1 = (0, tslib_1.__importDefault)(require("./Html"));
var helper_1 = require("../utils/helper");
var theme_1 = require("../theme");
var icons_1 = require("./icons");
var locale_1 = require("../locale");
var groupBy_1 = (0, tslib_1.__importDefault)(require("lodash/groupBy"));
var fadeStyles = (_a = {},
    _a[Transition_1.ENTERING] = 'in',
    _a[Transition_1.ENTERED] = 'in',
    _a[Transition_1.EXITING] = 'out',
    _a);
var toastRef = null;
var show = function (content, conf, method) {
    if (conf === void 0) { conf = {}; }
    if (!toastRef || !toastRef[method]) {
        return;
    }
    toastRef[method](content, (0, tslib_1.__assign)({}, conf));
};
var ToastComponent = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(ToastComponent, _super);
    function ToastComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 当前ToastComponent是否真正render了
        _this.hasRendered = false;
        _this.state = {
            items: []
        };
        return _this;
    }
    ToastComponent.prototype.componentDidMount = function () {
        this.hasRendered = true;
        toastRef = this;
    };
    ToastComponent.prototype.componentWillUnmount = function () {
        if (this.hasRendered) {
            toastRef = null;
        }
    };
    ToastComponent.prototype.notifiy = function (level, content, config) {
        var useMobileUI = (config.useMobileUI || this.props.useMobileUI) && (0, helper_1.isMobile)();
        this.setState(function (state) {
            var items = state.items.concat();
            if (useMobileUI) {
                // 移动端只能存在一个
                items = [];
            }
            items.push((0, tslib_1.__assign)((0, tslib_1.__assign)({ body: content, level: level }, config), { id: (0, helper_1.guid)(), position: config.position || (useMobileUI ? 'center' : config.position), timeout: config.timeout || (useMobileUI ? 3000 : undefined) }));
            return {
                items: items,
                useMobileUI: useMobileUI
            };
        });
    };
    ToastComponent.prototype.success = function (content, config) {
        this.notifiy('success', content, config);
    };
    ToastComponent.prototype.error = function (content, config) {
        this.notifiy('error', content, config);
    };
    ToastComponent.prototype.info = function (content, config) {
        this.notifiy('info', content, config);
    };
    ToastComponent.prototype.warning = function (content, config) {
        this.notifiy('warning', content, config);
    };
    ToastComponent.prototype.handleDismissed = function (index) {
        var _a;
        var items = this.state.items.concat();
        var item = items.splice(index, 1)[0];
        (_a = item === null || item === void 0 ? void 0 : item.onDissmiss) === null || _a === void 0 ? void 0 : _a.call(item);
        this.setState({
            items: items
        });
    };
    ToastComponent.prototype.render = function () {
        var _this = this;
        if (toastRef && !this.hasRendered) {
            return null;
        }
        var _a = this.props, cx = _a.classnames, className = _a.className, timeout = _a.timeout, errorTimeout = _a.errorTimeout, position = _a.position, showIcon = _a.showIcon, translate = _a.translate, closeButton = _a.closeButton, useMobileUI = _a.useMobileUI;
        var items = this.state.items;
        var mobileUI = (useMobileUI || this.state.useMobileUI) && (0, helper_1.isMobile)();
        var groupedItems = (0, groupBy_1.default)(items, function (item) { return item.position || position; });
        return Object.keys(groupedItems).map(function (position) {
            var toasts = groupedItems[position];
            return (react_1.default.createElement("div", { key: position, className: cx("Toast-wrap Toast-wrap--".concat(position.replace(/\-(\w)/g, function (_, l) {
                    return l.toUpperCase();
                })), {
                    'Toast-mobile': mobileUI
                }, className) }, toasts.map(function (item, index) {
                var _a, _b, _c;
                var level = item.level || 'info';
                var toastTimeout = (_a = item.timeout) !== null && _a !== void 0 ? _a : (level === 'error' ? errorTimeout : timeout);
                return (react_1.default.createElement(ToastMessage, { classnames: cx, key: item.id || index, title: item.title, body: item.body, level: level, timeout: toastTimeout, closeButton: !mobileUI && ((_b = item.closeButton) !== null && _b !== void 0 ? _b : closeButton), onDismiss: _this.handleDismissed.bind(_this, items.indexOf(item)), translate: translate, showIcon: (_c = item.showIcon) !== null && _c !== void 0 ? _c : showIcon, useMobileUI: mobileUI }));
            })));
        });
    };
    ToastComponent.defaultProps = {
        position: 'top-center',
        closeButton: false,
        timeout: 4000,
        errorTimeout: 6000,
        items: []
    };
    ToastComponent.themeKey = 'toast';
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [String, Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], ToastComponent.prototype, "success", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [String, Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], ToastComponent.prototype, "error", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [String, Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], ToastComponent.prototype, "info", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [String, Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], ToastComponent.prototype, "warning", null);
    return ToastComponent;
}(react_1.default.Component));
exports.ToastComponent = ToastComponent;
exports.default = (0, theme_1.themeable)((0, locale_1.localeable)(ToastComponent));
var ToastMessage = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(ToastMessage, _super);
    function ToastMessage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            visible: false
        };
        _this.mounted = false;
        return _this;
    }
    ToastMessage.prototype.componentDidMount = function () {
        this.mounted = true;
        this.setState({
            visible: true
        });
    };
    ToastMessage.prototype.componentWillUnmount = function () {
        clearTimeout(this.timer);
        this.mounted = false;
    };
    ToastMessage.prototype.handleMouseEnter = function () {
        clearTimeout(this.timer);
    };
    ToastMessage.prototype.handleMouseLeave = function () {
        this.handleEntered();
    };
    ToastMessage.prototype.handleEntered = function () {
        var timeout = this.props.timeout;
        if (this.mounted && timeout) {
            this.timer = setTimeout(this.close, timeout);
        }
    };
    ToastMessage.prototype.close = function () {
        clearTimeout(this.timer);
        this.setState({
            visible: false
        });
    };
    ToastMessage.prototype.render = function () {
        var _this = this;
        var _a = this.props, onDismiss = _a.onDismiss, cx = _a.classnames, closeButton = _a.closeButton, title = _a.title, body = _a.body, allowHtml = _a.allowHtml, level = _a.level, showIcon = _a.showIcon, useMobileUI = _a.useMobileUI, __ = _a.translate;
        var iconName = useMobileUI ? '' : 'status-';
        return (react_1.default.createElement(Transition_1.default, { mountOnEnter: true, unmountOnExit: true, in: this.state.visible, timeout: 750, onEntered: this.handleEntered, onExited: onDismiss }, function (status) {
            var _a, _b, _c, _d;
            return (react_1.default.createElement("div", { className: cx("Toast Toast--".concat(level), fadeStyles[status], {
                    'Toast-mobile--has-icon': useMobileUI && showIcon !== false
                }), onMouseEnter: _this.handleMouseEnter, onMouseLeave: _this.handleMouseLeave, onClick: closeButton ? helper_1.noop : _this.close },
                showIcon === false ? null : (react_1.default.createElement("div", { className: cx('Toast-icon') }, level === 'success' ? (react_1.default.createElement(icons_1.Icon, { icon: iconName + 'success', className: "icon" })) : level == 'error' ? (react_1.default.createElement(icons_1.Icon, { icon: iconName + 'fail', className: "icon" })) : level == 'info' ? (react_1.default.createElement(icons_1.Icon, { icon: iconName + 'info', className: "icon" })) : level == 'warning' ? (react_1.default.createElement(icons_1.Icon, { icon: iconName + 'warning', className: "icon" })) : null)),
                react_1.default.createElement("div", { className: cx('Toast-content') },
                    typeof title === 'string' ? (react_1.default.createElement("span", { className: cx("Toast-title") }, title)) : react_1.default.isValidElement(title) ? (react_1.default.cloneElement(title, {
                        className: cx("Toast-title", (_b = (_a = title === null || title === void 0 ? void 0 : title.props) === null || _a === void 0 ? void 0 : _a.className) !== null && _b !== void 0 ? _b : '')
                    })) : null,
                    typeof body === 'string' ? (react_1.default.createElement("div", { className: cx('Toast-body') }, allowHtml ? react_1.default.createElement(Html_1.default, { html: body }) : body)) : react_1.default.isValidElement(body) ? (react_1.default.cloneElement(body, {
                        className: cx("Toast-body", (_d = (_c = body === null || body === void 0 ? void 0 : body.props) === null || _c === void 0 ? void 0 : _c.className) !== null && _d !== void 0 ? _d : '')
                    })) : null),
                closeButton ? (react_1.default.createElement("a", { onClick: _this.close, className: cx("Toast-close") },
                    react_1.default.createElement(icons_1.Icon, { icon: "status-close", className: "icon" }))) : null));
        }));
    };
    ToastMessage.defaultProps = {
        timeout: 5000,
        classPrefix: '',
        position: 'top-center',
        allowHtml: true,
        level: 'info'
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], ToastMessage.prototype, "handleMouseEnter", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], ToastMessage.prototype, "handleMouseLeave", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], ToastMessage.prototype, "handleEntered", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], ToastMessage.prototype, "close", null);
    return ToastMessage;
}(react_1.default.Component));
exports.ToastMessage = ToastMessage;
exports.toast = {
    container: toastRef,
    success: function (content, conf) { return show(content, conf, 'success'); },
    error: function (content, conf) { return show(content, conf, 'error'); },
    info: function (content, conf) { return show(content, conf, 'info'); },
    warning: function (content, conf) { return show(content, conf, 'warning'); }
};
//# sourceMappingURL=./components/Toast.js.map
