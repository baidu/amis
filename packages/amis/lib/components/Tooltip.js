"use strict";
/**
 * @file Tooltip
 * @description
 * @author fex
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tooltip = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var theme_1 = require("../theme");
var Tooltip = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Tooltip, _super);
    function Tooltip() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Tooltip.prototype.render = function () {
        var _a = this.props, ns = _a.classPrefix, className = _a.className, tooltipTheme = _a.tooltipTheme, title = _a.title, children = _a.children, arrowProps = _a.arrowProps, style = _a.style, placement = _a.placement, arrowOffsetLeft = _a.arrowOffsetLeft, arrowOffsetTop = _a.arrowOffsetTop, positionLeft = _a.positionLeft, positionTop = _a.positionTop, cx = _a.classnames, activePlacement = _a.activePlacement, showArrow = _a.showArrow, onMouseEnter = _a.onMouseEnter, onMouseLeave = _a.onMouseLeave, rest = (0, tslib_1.__rest)(_a, ["classPrefix", "className", "tooltipTheme", "title", "children", "arrowProps", "style", "placement", "arrowOffsetLeft", "arrowOffsetTop", "positionLeft", "positionTop", "classnames", "activePlacement", "showArrow", "onMouseEnter", "onMouseLeave"]);
        return (react_1.default.createElement("div", (0, tslib_1.__assign)({}, rest, { className: cx("Tooltip", activePlacement ? "Tooltip--".concat(activePlacement) : '', className, "Tooltip--".concat(tooltipTheme === 'dark' ? 'dark' : 'light')), style: style, onMouseEnter: onMouseEnter, onMouseLeave: onMouseLeave, role: "tooltip" }),
            showArrow ? (react_1.default.createElement("div", (0, tslib_1.__assign)({ className: cx("Tooltip-arrow") }, arrowProps))) : null,
            title ? react_1.default.createElement("div", { className: cx('Tooltip-title') }, title) : null,
            react_1.default.createElement("div", { className: cx('Tooltip-body') }, children)));
    };
    Tooltip.defaultProps = {
        className: '',
        tooltipTheme: 'light',
        showArrow: true
    };
    return Tooltip;
}(react_1.default.Component));
exports.Tooltip = Tooltip;
exports.default = (0, theme_1.themeable)(Tooltip);
//# sourceMappingURL=./components/Tooltip.js.map
