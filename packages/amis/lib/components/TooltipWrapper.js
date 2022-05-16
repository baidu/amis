"use strict";
/**
 * @file TooltipWrapper
 * @description
 * @author fex
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TooltipWrapper = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var Html_1 = (0, tslib_1.__importDefault)(require("./Html"));
var uncontrollable_1 = require("uncontrollable");
var react_dom_1 = require("react-dom");
var Tooltip_1 = (0, tslib_1.__importDefault)(require("./Tooltip"));
var theme_1 = require("../theme");
var Overlay_1 = (0, tslib_1.__importDefault)(require("./Overlay"));
var helper_1 = require("../utils/helper");
var waitToHide = null;
var TooltipWrapper = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(TooltipWrapper, _super);
    function TooltipWrapper(props) {
        var _this = _super.call(this, props) || this;
        _this.moutned = true;
        _this.tooltipMouseEnter = function (e) {
            var _a, _b;
            var tooltip = _this.props.tooltip;
            var enterable = (_b = (_a = tooltip) === null || _a === void 0 ? void 0 : _a.enterable) !== null && _b !== void 0 ? _b : true;
            enterable && clearTimeout(_this.timer);
        };
        _this.tooltipMouseLeave = function (e) {
            var _a, _b;
            var tooltip = _this.props.tooltip;
            var enterable = (_b = (_a = tooltip) === null || _a === void 0 ? void 0 : _a.enterable) !== null && _b !== void 0 ? _b : true;
            enterable && clearTimeout(_this.timer);
            _this.hide();
        };
        _this.getTarget = _this.getTarget.bind(_this);
        _this.show = _this.show.bind(_this);
        _this.hide = _this.hide.bind(_this);
        _this.handleShow = _this.handleShow.bind(_this);
        _this.handleHide = _this.handleHide.bind(_this);
        _this.handleClick = _this.handleClick.bind(_this);
        _this.handleFocus = _this.handleFocus.bind(_this);
        _this.handleBlur = _this.handleBlur.bind(_this);
        _this.handleMouseOver = _this.handleMouseOver.bind(_this);
        _this.handleMouseOut = _this.handleMouseOut.bind(_this);
        _this.state = {
            show: false
        };
        return _this;
    }
    TooltipWrapper.prototype.componentWillUnmount = function () {
        clearTimeout(this.timer);
        this.moutned = false;
    };
    TooltipWrapper.prototype.getTarget = function () {
        return (0, react_dom_1.findDOMNode)(this);
    };
    TooltipWrapper.prototype.show = function () {
        var _this = this;
        this.setState({
            show: true
        }, function () {
            if (_this.props.onVisibleChange) {
                _this.props.onVisibleChange(true);
            }
        });
    };
    TooltipWrapper.prototype.hide = function () {
        var _this = this;
        waitToHide = null;
        this.moutned &&
            this.setState({
                show: false
            }, function () {
                if (_this.props.onVisibleChange) {
                    _this.props.onVisibleChange(false);
                }
            });
    };
    TooltipWrapper.prototype.getChildProps = function () {
        var child = react_1.default.Children.only(this.props.children);
        return child && child.props;
    };
    TooltipWrapper.prototype.handleShow = function () {
        this.timer && clearTimeout(this.timer);
        waitToHide && waitToHide();
        var tooltip = this.props.tooltip;
        if ((0, helper_1.isObject)(tooltip)) {
            var _a = tooltip.mouseEnterDelay, mouseEnterDelay = _a === void 0 ? 0 : _a;
            this.timer = setTimeout(this.show, mouseEnterDelay);
        }
        else {
            this.timer = setTimeout(this.show, 0);
        }
    };
    TooltipWrapper.prototype.handleHide = function () {
        clearTimeout(this.timer);
        var _a = this.props, delay = _a.delay, tooltip = _a.tooltip;
        waitToHide = this.hide.bind(this);
        if ((0, helper_1.isObject)(tooltip)) {
            var _b = tooltip.mouseLeaveDelay, mouseLeaveDelay = _b === void 0 ? 300 : _b;
            this.timer = setTimeout(this.hide, mouseLeaveDelay);
        }
        else {
            this.timer = setTimeout(this.hide, delay);
        }
    };
    TooltipWrapper.prototype.handleFocus = function (e) {
        var onFocus = this.getChildProps().onFocus;
        this.handleShow();
        onFocus && onFocus(e);
    };
    TooltipWrapper.prototype.handleBlur = function (e) {
        var onBlur = this.getChildProps().onBlur;
        this.handleHide();
        onBlur && onBlur(e);
    };
    TooltipWrapper.prototype.handleMouseOver = function (e) {
        this.handleMouseOverOut(this.handleShow, e, 'fromElement');
    };
    TooltipWrapper.prototype.handleMouseOut = function (e) {
        this.handleMouseOverOut(this.handleHide, e, 'toElement');
    };
    TooltipWrapper.prototype.handleMouseOverOut = function (handler, e, relatedNative) {
        var target = e.currentTarget;
        var related = e.relatedTarget || e.nativeEvent[relatedNative];
        if ((!related || related !== target) && !target.contains(related)) {
            handler(e);
        }
    };
    TooltipWrapper.prototype.handleClick = function (e) {
        var onClick = this.getChildProps().onClick;
        this.state.show ? this.hide() : this.show();
        onClick && onClick(e);
    };
    TooltipWrapper.prototype.render = function () {
        var props = this.props;
        var child = react_1.default.Children.only(props.children);
        if (!props.tooltip) {
            return child;
        }
        // tooltip 对象内属性优先级更高
        var tooltipObj = (0, tslib_1.__assign)({ placement: props.placement, container: props.container, trigger: props.trigger, rootClose: props.rootClose, tooltipClassName: props.tooltipClassName, style: props.style, mouseLeaveDelay: props.delay, tooltipTheme: props.tooltipTheme }, (typeof props.tooltip === 'string'
            ? { content: props.tooltip }
            : props.tooltip));
        var title = tooltipObj.title, content = tooltipObj.content, placement = tooltipObj.placement, container = tooltipObj.container, trigger = tooltipObj.trigger, rootClose = tooltipObj.rootClose, tooltipClassName = tooltipObj.tooltipClassName, style = tooltipObj.style, _a = tooltipObj.disabled, disabled = _a === void 0 ? false : _a, offset = tooltipObj.offset, _b = tooltipObj.tooltipTheme, tooltipTheme = _b === void 0 ? 'light' : _b, _c = tooltipObj.showArrow, showArrow = _c === void 0 ? true : _c, children = tooltipObj.children;
        var childProps = {
            key: 'target'
        };
        var triggers = Array.isArray(trigger) ? trigger.concat() : [trigger];
        if (~triggers.indexOf('click')) {
            childProps.onClick = this.handleClick;
        }
        if (~triggers.indexOf('focus')) {
            childProps.onFocus = this.handleShow;
            childProps.onBlur = this.handleHide;
        }
        if (~triggers.indexOf('hover')) {
            childProps.onMouseOver = this.handleMouseOver;
            childProps.onMouseOut = this.handleMouseOut;
        }
        return [
            child ? react_1.default.cloneElement(child, childProps) : null,
            react_1.default.createElement(Overlay_1.default, { key: "overlay", target: this.getTarget, show: this.state.show && !disabled, onHide: this.handleHide, rootClose: rootClose, placement: placement, container: container, offset: Array.isArray(offset) ? offset : [0, 0] },
                react_1.default.createElement(Tooltip_1.default, { title: typeof title === 'string' ? title : undefined, style: style, className: tooltipClassName, tooltipTheme: tooltipTheme, showArrow: showArrow, onMouseEnter: ~triggers.indexOf('hover') ? this.tooltipMouseEnter : function () { }, onMouseLeave: ~triggers.indexOf('hover') ? this.tooltipMouseLeave : function () { } }, children ? (react_1.default.createElement(react_1.default.Fragment, null, typeof children === 'function' ? children() : children)) : (react_1.default.createElement(Html_1.default, { html: typeof content === 'string' ? content : '' }))))
        ];
    };
    TooltipWrapper.defaultProps = {
        placement: 'top',
        trigger: ['hover', 'focus'],
        rootClose: false,
        delay: 300
    };
    return TooltipWrapper;
}(react_1.default.Component));
exports.TooltipWrapper = TooltipWrapper;
exports.default = (0, theme_1.themeable)((0, uncontrollable_1.uncontrollable)(TooltipWrapper, {
    show: 'onVisibleChange'
}));
//# sourceMappingURL=./components/TooltipWrapper.js.map
