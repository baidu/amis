"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetRenderer = exports.SubmitRenderer = exports.ButtonRenderer = exports.ActionRenderer = exports.Action = exports.createSyntheticEvent = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var hotkeys_js_1 = (0, tslib_1.__importDefault)(require("hotkeys-js"));
var factory_1 = require("../factory");
var tpl_1 = require("../utils/tpl");
var Button_1 = (0, tslib_1.__importDefault)(require("../components/Button"));
var pick_1 = (0, tslib_1.__importDefault)(require("lodash/pick"));
var omit_1 = (0, tslib_1.__importDefault)(require("lodash/omit"));
var ActionProps = [
    'id',
    'dialog',
    'drawer',
    'toast',
    'url',
    'link',
    'confirmText',
    'tooltip',
    'disabledTip',
    'className',
    'asyncApi',
    'redirect',
    'size',
    'level',
    'primary',
    'feedback',
    'api',
    'blank',
    'tooltipPlacement',
    'to',
    'cc',
    'bcc',
    'subject',
    'body',
    'content',
    'required',
    'type',
    'actionType',
    'label',
    'icon',
    'rightIcon',
    'reload',
    'target',
    'close',
    'messages',
    'mergeData',
    'index',
    'copy',
    'copyFormat',
    'payload',
    'requireSelected',
    'countDown'
];
var Remark_1 = require("./Remark");
var theme_1 = require("../theme");
var helper_1 = require("../utils/helper");
var icon_1 = require("../utils/icon");
var Badge_1 = require("../components/Badge");
var api_1 = require("../utils/api");
var TooltipWrapper_1 = require("../components/TooltipWrapper");
// 构造一个假的 React 事件避免可能的报错，主要用于快捷键功能
// 来自 https://stackoverflow.com/questions/27062455/reactjs-can-i-create-my-own-syntheticevent
var createSyntheticEvent = function (event) {
    var isDefaultPrevented = false;
    var isPropagationStopped = false;
    var preventDefault = function () {
        isDefaultPrevented = true;
        event.preventDefault();
    };
    var stopPropagation = function () {
        isPropagationStopped = true;
        event.stopPropagation();
    };
    return {
        nativeEvent: event,
        currentTarget: event.currentTarget,
        target: event.target,
        bubbles: event.bubbles,
        cancelable: event.cancelable,
        defaultPrevented: event.defaultPrevented,
        eventPhase: event.eventPhase,
        isTrusted: event.isTrusted,
        preventDefault: preventDefault,
        isDefaultPrevented: function () { return isDefaultPrevented; },
        stopPropagation: stopPropagation,
        isPropagationStopped: function () { return isPropagationStopped; },
        persist: function () { },
        timeStamp: event.timeStamp,
        type: event.type
    };
};
exports.createSyntheticEvent = createSyntheticEvent;
var allowedType = ['button', 'submit', 'reset'];
var Action = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Action, _super);
    function Action(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            inCountDown: false,
            countDownEnd: 0,
            timeLeft: 0
        };
        _this.localStorageKey = 'amis-countdownend-' + (_this.props.name || '');
        var countDownEnd = parseInt(localStorage.getItem(_this.localStorageKey) || '0');
        if (countDownEnd && _this.props.countDown) {
            if (Date.now() < countDownEnd) {
                _this.state = {
                    inCountDown: true,
                    countDownEnd: countDownEnd,
                    timeLeft: Math.floor((countDownEnd - Date.now()) / 1000)
                };
                _this.handleCountDown();
            }
        }
        return _this;
    }
    Action.prototype.handleAction = function (e) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var _a, onAction, disabled, countDown, env, onClick, result, _b, action, actionType, api, countDownEnd;
            var _this = this;
            return (0, tslib_1.__generator)(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this.props, onAction = _a.onAction, disabled = _a.disabled, countDown = _a.countDown, env = _a.env;
                        // https://reactjs.org/docs/legacy-event-pooling.html
                        e.persist(); // 等 react 17之后去掉 event pooling 了，这个应该就没用了
                        onClick = this.props.onClick;
                        if (typeof onClick === 'string') {
                            onClick = (0, api_1.str2AsyncFunction)(onClick, 'event', 'props');
                        }
                        _b = onClick;
                        if (!_b) return [3 /*break*/, 2];
                        return [4 /*yield*/, onClick(e, this.props)];
                    case 1:
                        _b = (_c.sent());
                        _c.label = 2;
                    case 2:
                        result = _b;
                        if (disabled ||
                            e.isDefaultPrevented() ||
                            result === false ||
                            !onAction ||
                            this.state.inCountDown) {
                            return [2 /*return*/];
                        }
                        e.preventDefault();
                        action = (0, pick_1.default)(this.props, ActionProps);
                        actionType = action.actionType;
                        // ajax 会在 wrapFetcher 里记录，这里再处理就重复了，因此去掉
                        // add 一般是 input-table 之类的，会触发 formItemChange，为了避免重复也去掉
                        if (actionType !== 'ajax' &&
                            actionType !== 'download' &&
                            actionType !== 'add') {
                            env === null || env === void 0 ? void 0 : env.tracker({
                                eventType: actionType || this.props.type || 'click',
                                eventData: (0, omit_1.default)(action, ['type', 'actionType', 'tooltipPlacement'])
                            }, this.props);
                        }
                        // download 是一种 ajax 的简写
                        if (actionType === 'download') {
                            action.actionType = 'ajax';
                            api = (0, api_1.normalizeApi)(action.api);
                            api.responseType = 'blob';
                            action.api = api;
                        }
                        return [4 /*yield*/, onAction(e, action)];
                    case 3:
                        _c.sent();
                        if (countDown) {
                            countDownEnd = Date.now() + countDown * 1000;
                            this.setState({
                                countDownEnd: countDownEnd,
                                inCountDown: true,
                                timeLeft: countDown
                            });
                            localStorage.setItem(this.localStorageKey, String(countDownEnd));
                            setTimeout(function () {
                                _this.handleCountDown();
                            }, 1000);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Action.prototype.handleCountDown = function () {
        var _this = this;
        // setTimeout 一般会晚于 1s，经过几十次后就不准了，所以使用真实时间进行 diff
        var timeLeft = Math.floor((this.state.countDownEnd - Date.now()) / 1000);
        if (timeLeft <= 0) {
            this.setState({
                inCountDown: false,
                timeLeft: timeLeft
            });
        }
        else {
            this.setState({
                timeLeft: timeLeft
            });
            setTimeout(function () {
                _this.handleCountDown();
            }, 1000);
        }
    };
    Action.prototype.componentDidMount = function () {
        var _this = this;
        var hotKey = this.props.hotKey;
        if (hotKey) {
            (0, hotkeys_js_1.default)(hotKey, function (event) {
                event.preventDefault();
                var click = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true
                });
                _this.handleAction((0, exports.createSyntheticEvent)(click));
            });
        }
    };
    Action.prototype.componentWillUnmount = function () {
        var hotKey = this.props.hotKey;
        if (hotKey) {
            hotkeys_js_1.default.unbind(hotKey);
        }
    };
    Action.prototype.render = function () {
        var _a;
        var _b = this.props, type = _b.type, icon = _b.icon, iconClassName = _b.iconClassName, rightIcon = _b.rightIcon, rightIconClassName = _b.rightIconClassName, loadingClassName = _b.loadingClassName, primary = _b.primary, size = _b.size, level = _b.level, countDownTpl = _b.countDownTpl, block = _b.block, className = _b.className, componentClass = _b.componentClass, tooltip = _b.tooltip, disabledTip = _b.disabledTip, tooltipPlacement = _b.tooltipPlacement, actionType = _b.actionType, link = _b.link, data = _b.data, __ = _b.translate, activeClassName = _b.activeClassName, isCurrentUrl = _b.isCurrentUrl, isMenuItem = _b.isMenuItem, active = _b.active, activeLevel = _b.activeLevel, tooltipTrigger = _b.tooltipTrigger, tooltipContainer = _b.tooltipContainer, tooltipRootClose = _b.tooltipRootClose, loading = _b.loading, body = _b.body, render = _b.render, onMouseEnter = _b.onMouseEnter, onMouseLeave = _b.onMouseLeave, cx = _b.classnames, ns = _b.classPrefix;
        if (actionType !== 'email' && body) {
            return (react_1.default.createElement(TooltipWrapper_1.TooltipWrapper, { classPrefix: ns, classnames: cx, placement: tooltipPlacement, tooltip: tooltip, container: tooltipContainer, trigger: tooltipTrigger, rootClose: tooltipRootClose },
                react_1.default.createElement("div", { className: cx('Action', className), onClick: this.handleAction, onMouseEnter: onMouseEnter, onMouseLeave: onMouseLeave }, render('body', body))));
        }
        var label = this.props.label;
        var disabled = this.props.disabled;
        var isActive = !!active;
        if (actionType === 'link' && !isActive && link && isCurrentUrl) {
            isActive = isCurrentUrl(link);
        }
        // 倒计时
        if (this.state.inCountDown) {
            label = (0, Remark_1.filterContents)(__(countDownTpl), (0, tslib_1.__assign)((0, tslib_1.__assign)({}, data), { timeLeft: this.state.timeLeft }));
            disabled = true;
        }
        var iconElement = (0, icon_1.generateIcon)(cx, icon, 'Button-icon', iconClassName);
        var rightIconElement = (0, icon_1.generateIcon)(cx, rightIcon, 'Button-icon', rightIconClassName);
        return (react_1.default.createElement(Button_1.default, { className: cx(className, (_a = {},
                _a[activeClassName || 'is-active'] = isActive,
                _a)), size: size, level: activeLevel && isActive
                ? activeLevel
                : level || (primary ? 'primary' : undefined), loadingClassName: loadingClassName, loading: loading, onClick: this.handleAction, onMouseEnter: onMouseEnter, onMouseLeave: onMouseLeave, type: type && ~allowedType.indexOf(type) ? type : 'button', disabled: disabled, componentClass: isMenuItem ? 'a' : componentClass, overrideClassName: isMenuItem, tooltip: tooltip, disabledTip: disabledTip, tooltipPlacement: tooltipPlacement, tooltipContainer: tooltipContainer, tooltipTrigger: tooltipTrigger, tooltipRootClose: tooltipRootClose, block: block, iconOnly: !!(icon && !label && level !== 'link') },
            !loading ? iconElement : '',
            label ? react_1.default.createElement("span", null, (0, tpl_1.filter)(String(label), data)) : null,
            rightIconElement));
    };
    var _a;
    Action.defaultProps = {
        type: 'button',
        componentClass: 'button',
        tooltipPlacement: 'bottom',
        activeClassName: 'is-active',
        countDownTpl: 'Action.countDown',
        countDown: 0
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof react_1.default !== "undefined" && react_1.default.MouseEvent) === "function" ? _a : Object]),
        (0, tslib_1.__metadata)("design:returntype", Promise)
    ], Action.prototype, "handleAction", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Action.prototype, "handleCountDown", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Action.prototype, "componentDidMount", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Action.prototype, "componentWillUnmount", null);
    return Action;
}(react_1.default.Component));
exports.Action = Action;
exports.default = (0, theme_1.themeable)(Action);
var ActionRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(ActionRenderer, _super);
    function ActionRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ActionRenderer.prototype.handleAction = function (e, action) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var _a, env, onAction, data, ignoreConfirm, dispatchEvent, rendererEvent, confirmed;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, env = _a.env, onAction = _a.onAction, data = _a.data, ignoreConfirm = _a.ignoreConfirm, dispatchEvent = _a.dispatchEvent;
                        return [4 /*yield*/, dispatchEvent(e, data)];
                    case 1:
                        rendererEvent = _b.sent();
                        // 阻止原有动作执行
                        if (rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented) {
                            return [2 /*return*/];
                        }
                        if (!(!ignoreConfirm && action.confirmText && env.confirm)) return [3 /*break*/, 6];
                        return [4 /*yield*/, env.confirm((0, tpl_1.filter)(action.confirmText, data))];
                    case 2:
                        confirmed = _b.sent();
                        if (!confirmed) return [3 /*break*/, 4];
                        return [4 /*yield*/, onAction(e, action, data)];
                    case 3:
                        _b.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        if (action.countDown) {
                            throw new Error('cancel');
                        }
                        _b.label = 5;
                    case 5: return [3 /*break*/, 8];
                    case 6: return [4 /*yield*/, onAction(e, action, data)];
                    case 7:
                        _b.sent();
                        _b.label = 8;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    ActionRenderer.prototype.handleMouseEnter = function (e) {
        this.props.dispatchEvent(e, this.props.data);
    };
    ActionRenderer.prototype.handleMouseLeave = function (e) {
        this.props.dispatchEvent(e, this.props.data);
    };
    ActionRenderer.prototype.isCurrentAction = function (link) {
        var _a = this.props, env = _a.env, data = _a.data;
        return env.isCurrentUrl((0, tpl_1.filter)(link, data));
    };
    ActionRenderer.prototype.render = function () {
        var _a = this.props, env = _a.env, disabled = _a.disabled, btnDisabled = _a.btnDisabled, loading = _a.loading, rest = (0, tslib_1.__rest)(_a, ["env", "disabled", "btnDisabled", "loading"]);
        return (react_1.default.createElement(Action, (0, tslib_1.__assign)({}, rest, { env: env, disabled: disabled || btnDisabled, onAction: this.handleAction, onMouseEnter: this.handleMouseEnter, onMouseLeave: this.handleMouseLeave, loading: loading, isCurrentUrl: this.isCurrentAction, tooltipContainer: env.getModalContainer ? env.getModalContainer : undefined })));
    };
    var _b, _c, _d;
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object, Object]),
        (0, tslib_1.__metadata)("design:returntype", Promise)
    ], ActionRenderer.prototype, "handleAction", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_c = typeof react_1.default !== "undefined" && react_1.default.MouseEvent) === "function" ? _c : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], ActionRenderer.prototype, "handleMouseEnter", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_d = typeof react_1.default !== "undefined" && react_1.default.MouseEvent) === "function" ? _d : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], ActionRenderer.prototype, "handleMouseLeave", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [String]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], ActionRenderer.prototype, "isCurrentAction", null);
    ActionRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'action'
        })
        // @ts-ignore 类型没搞定
        ,
        Badge_1.withBadge
    ], ActionRenderer);
    return ActionRenderer;
}(react_1.default.Component));
exports.ActionRenderer = ActionRenderer;
var ButtonRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(ButtonRenderer, _super);
    function ButtonRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ButtonRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'button'
        })
    ], ButtonRenderer);
    return ButtonRenderer;
}(ActionRenderer));
exports.ButtonRenderer = ButtonRenderer;
var SubmitRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(SubmitRenderer, _super);
    function SubmitRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SubmitRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'submit'
        })
    ], SubmitRenderer);
    return SubmitRenderer;
}(ActionRenderer));
exports.SubmitRenderer = SubmitRenderer;
var ResetRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(ResetRenderer, _super);
    function ResetRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ResetRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'reset'
        })
    ], ResetRenderer);
    return ResetRenderer;
}(ActionRenderer));
exports.ResetRenderer = ResetRenderer;
//# sourceMappingURL=./renderers/Action.js.map
