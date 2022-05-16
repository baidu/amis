"use strict";
/**
 * @file scoped.jsx.
 * @author fex
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.HocPopOver = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var react_dom_1 = require("react-dom");
var hoist_non_react_statics_1 = (0, tslib_1.__importDefault)(require("hoist-non-react-statics"));
var PopOver_1 = (0, tslib_1.__importDefault)(require("../components/PopOver"));
var Overlay_1 = (0, tslib_1.__importDefault)(require("../components/Overlay"));
var icons_1 = require("../components/icons");
var RootClose_1 = require("../utils/RootClose");
var HocPopOver = function (config) {
    if (config === void 0) { config = {}; }
    return function (Component) {
        var lastOpenedInstance = null;
        var PopOverComponent = /** @class */ (function (_super) {
            (0, tslib_1.__extends)(PopOverComponent, _super);
            function PopOverComponent(props) {
                var _this = _super.call(this, props) || this;
                _this.openPopOver = _this.openPopOver.bind(_this);
                _this.closePopOver = _this.closePopOver.bind(_this);
                _this.closePopOverLater = _this.closePopOverLater.bind(_this);
                _this.clearCloseTimer = _this.clearCloseTimer.bind(_this);
                _this.targetRef = _this.targetRef.bind(_this);
                // this.handleClickOutside = this.handleClickOutside.bind(this);
                _this.state = {
                    isOpened: false
                };
                return _this;
            }
            PopOverComponent.prototype.targetRef = function (ref) {
                this.target = ref;
            };
            PopOverComponent.prototype.openPopOver = function () {
                var _this = this;
                var onPopOverOpened = this.props.onPopOverOpened;
                lastOpenedInstance === null || lastOpenedInstance === void 0 ? void 0 : lastOpenedInstance.closePopOver();
                lastOpenedInstance = this;
                this.setState({
                    isOpened: true
                }, function () { return onPopOverOpened && onPopOverOpened(_this.props.popOver); });
            };
            PopOverComponent.prototype.closePopOver = function () {
                var _this = this;
                clearTimeout(this.timer);
                if (!this.state.isOpened) {
                    return;
                }
                lastOpenedInstance = null;
                var onPopOverClosed = this.props.onPopOverClosed;
                this.setState({
                    isOpened: false
                }, function () { return onPopOverClosed && onPopOverClosed(_this.props.popOver); });
            };
            PopOverComponent.prototype.closePopOverLater = function () {
                // 5s 后自动关闭。
                this.timer = setTimeout(this.closePopOver, 2000);
            };
            PopOverComponent.prototype.clearCloseTimer = function () {
                clearTimeout(this.timer);
            };
            PopOverComponent.prototype.buildSchema = function () {
                var _a = this.props, popOver = _a.popOver, name = _a.name, label = _a.label, __ = _a.translate;
                var schema;
                if (popOver === true) {
                    schema = {
                        type: 'panel',
                        body: "${".concat(name, "}")
                    };
                }
                else if (popOver &&
                    (popOver.mode === 'dialog' || popOver.mode === 'drawer')) {
                    schema = (0, tslib_1.__assign)((0, tslib_1.__assign)({ actions: [
                            {
                                label: __('Dialog.close'),
                                type: 'button',
                                actionType: 'cancel'
                            }
                        ] }, popOver), { type: popOver.mode });
                }
                else if (typeof popOver === 'string') {
                    schema = {
                        type: 'panel',
                        body: popOver
                    };
                }
                else if (popOver) {
                    schema = (0, tslib_1.__assign)({ type: 'panel' }, popOver);
                }
                return schema || 'error';
            };
            PopOverComponent.prototype.renderPopOver = function () {
                var _this = this;
                var _a, _b;
                var _c = this.props, popOver = _c.popOver, render = _c.render, popOverContainer = _c.popOverContainer, cx = _c.classnames, ns = _c.classPrefix;
                if (popOver &&
                    (popOver.mode === 'dialog' ||
                        popOver.mode === 'drawer')) {
                    return render('popover-detail', this.buildSchema(), {
                        show: true,
                        onClose: this.closePopOver,
                        onConfirm: this.closePopOver
                    });
                }
                var content = render('popover-detail', this.buildSchema(), {
                    className: cx(popOver.className)
                });
                if (!popOverContainer) {
                    popOverContainer = function () { return (0, react_dom_1.findDOMNode)(_this); };
                }
                var position = (popOver && popOver.position) || '';
                var isFixed = /^fixed\-/.test(position);
                return isFixed ? (react_1.default.createElement(RootClose_1.RootClose, { disabled: !this.state.isOpened, onRootClose: this.closePopOver }, function (ref) {
                    var _a, _b;
                    return (react_1.default.createElement("div", { className: cx("PopOverAble--fixed PopOverAble--".concat(position)), onMouseLeave: ((_a = popOver) === null || _a === void 0 ? void 0 : _a.trigger) === 'hover'
                            ? _this.closePopOver
                            : undefined, onMouseEnter: ((_b = popOver) === null || _b === void 0 ? void 0 : _b.trigger) === 'hover'
                            ? _this.clearCloseTimer
                            : undefined, ref: ref }, content));
                })) : (react_1.default.createElement(Overlay_1.default, { container: popOverContainer, placement: position || config.position || 'center', target: function () { return _this.target; }, onHide: this.closePopOver, rootClose: true, show: true },
                    react_1.default.createElement(PopOver_1.default, { classPrefix: ns, className: cx('PopOverAble-popover', popOver.popOverClassName), offset: popOver.offset, onMouseLeave: ((_a = popOver) === null || _a === void 0 ? void 0 : _a.trigger) === 'hover'
                            ? this.closePopOver
                            : undefined, onMouseEnter: ((_b = popOver) === null || _b === void 0 ? void 0 : _b.trigger) === 'hover'
                            ? this.clearCloseTimer
                            : undefined }, content)));
            };
            PopOverComponent.prototype.render = function () {
                var _a, _b;
                var _c = this.props, popOver = _c.popOver, popOverEnabled = _c.popOverEnabled, popOverEnable = _c.popOverEnable, className = _c.className, noHoc = _c.noHoc, cx = _c.classnames, showIcon = _c.showIcon;
                if (!popOver ||
                    popOverEnabled === false ||
                    noHoc ||
                    popOverEnable === false) {
                    return react_1.default.createElement(Component, (0, tslib_1.__assign)({}, this.props));
                }
                var triggerProps = {};
                var trigger = (_a = popOver) === null || _a === void 0 ? void 0 : _a.trigger;
                if (trigger === 'hover') {
                    triggerProps.onMouseEnter = this.openPopOver;
                    triggerProps.onMouseLeave = this.closePopOverLater;
                }
                else {
                    triggerProps.onClick = this.openPopOver;
                }
                return (react_1.default.createElement(Component, (0, tslib_1.__assign)({}, this.props, { className: cx("Field--popOverAble", className, {
                        in: this.state.isOpened
                    }), ref: config.targetOutter ? this.targetRef : undefined }), ((_b = popOver) === null || _b === void 0 ? void 0 : _b.showIcon) !== false ? (react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement(Component, (0, tslib_1.__assign)({}, this.props, { wrapperComponent: '', noHoc: true })),
                    react_1.default.createElement("span", (0, tslib_1.__assign)({ key: "popover-btn", className: cx('Field-popOverBtn') }, triggerProps, { ref: config.targetOutter ? undefined : this.targetRef }),
                        react_1.default.createElement(icons_1.Icon, { icon: "zoom-in", className: "icon" })),
                    this.state.isOpened ? this.renderPopOver() : null)) : (react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement("div", (0, tslib_1.__assign)({ className: cx('Field-popOverWrap') }, triggerProps, { ref: config.targetOutter ? undefined : this.targetRef }),
                        react_1.default.createElement(Component, (0, tslib_1.__assign)({}, this.props, { wrapperComponent: '', noHoc: true }))),
                    this.state.isOpened ? this.renderPopOver() : null))));
            };
            PopOverComponent.ComposedComponent = Component;
            return PopOverComponent;
        }(react_1.default.Component));
        (0, hoist_non_react_statics_1.default)(PopOverComponent, Component);
        return PopOverComponent;
    };
};
exports.HocPopOver = HocPopOver;
exports.default = exports.HocPopOver;
//# sourceMappingURL=./renderers/PopOver.js.map
