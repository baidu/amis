"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TooltipWrapperRenderer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var factory_1 = require("../factory");
var tpl_1 = require("../utils/tpl");
var style_1 = require("../utils/style");
var components_1 = require("../components");
var TooltipWrapper = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(TooltipWrapper, _super);
    function TooltipWrapper(props) {
        return _super.call(this, props) || this;
    }
    TooltipWrapper.prototype.renderBody = function () {
        var _a = this.props, render = _a.render, cx = _a.classnames, body = _a.body, className = _a.className, wrapperComponent = _a.wrapperComponent, inline = _a.inline, style = _a.style, data = _a.data, wrap = _a.wrap;
        var Comp = wrapperComponent ||
            (inline ? 'span' : 'div');
        return (react_1.default.createElement(Comp, { className: cx('TooltipWrapper', className, {
                'TooltipWrapper--inline': inline
            }), style: (0, style_1.buildStyle)(style, data) }, render('body', body)));
    };
    TooltipWrapper.prototype.render = function () {
        var _a = this.props, ns = _a.classPrefix, cx = _a.classnames, tooltipClassName = _a.tooltipClassName, tooltipTheme = _a.tooltipTheme, container = _a.container, placement = _a.placement, rootClose = _a.rootClose, tooltipStyle = _a.tooltipStyle, title = _a.title, content = _a.content, tooltip = _a.tooltip, mouseEnterDelay = _a.mouseEnterDelay, mouseLeaveDelay = _a.mouseLeaveDelay, trigger = _a.trigger, offset = _a.offset, showArrow = _a.showArrow, disabled = _a.disabled, enterable = _a.enterable, data = _a.data;
        var tooltipObj = {
            title: (0, tpl_1.filter)(title, data),
            content: (0, tpl_1.filter)(content || tooltip, data),
            style: (0, style_1.buildStyle)(tooltipStyle, data),
            placement: placement,
            trigger: trigger,
            rootClose: rootClose,
            container: container,
            tooltipTheme: tooltipTheme,
            tooltipClassName: tooltipClassName,
            mouseEnterDelay: mouseEnterDelay,
            mouseLeaveDelay: mouseLeaveDelay,
            offset: offset,
            showArrow: showArrow,
            disabled: disabled,
            enterable: enterable
        };
        return (react_1.default.createElement(components_1.TooltipWrapper, { classPrefix: ns, classnames: cx, tooltip: tooltipObj }, this.renderBody()));
    };
    TooltipWrapper.defaultProps = {
        placement: 'top',
        trigger: 'hover',
        rootClose: true,
        mouseEnterDelay: 0,
        mouseLeaveDelay: 200,
        inline: false,
        wrap: false,
        tooltipTheme: 'light'
    };
    return TooltipWrapper;
}(react_1.default.Component));
exports.default = TooltipWrapper;
var TooltipWrapperRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(TooltipWrapperRenderer, _super);
    function TooltipWrapperRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TooltipWrapperRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'tooltip-wrapper'
        })
    ], TooltipWrapperRenderer);
    return TooltipWrapperRenderer;
}(TooltipWrapper));
exports.TooltipWrapperRenderer = TooltipWrapperRenderer;
//# sourceMappingURL=./renderers/TooltipWrapper.js.map
