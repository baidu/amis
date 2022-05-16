"use strict";
/**
 * @file Button
 * @author fex
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Button = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var TooltipWrapper_1 = (0, tslib_1.__importDefault)(require("./TooltipWrapper"));
var helper_1 = require("../utils/helper");
var theme_1 = require("../theme");
var icons_1 = require("./icons");
var Button = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Button, _super);
    function Button() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Button.prototype.renderButton = function () {
        var _a, _b;
        var _c = this.props, level = _c.level, size = _c.size, disabled = _c.disabled, className = _c.className, title = _c.title, Comp = _c.componentClass, cx = _c.classnames, children = _c.children, disabledTip = _c.disabledTip, block = _c.block, type = _c.type, active = _c.active, iconOnly = _c.iconOnly, href = _c.href, loading = _c.loading, loadingClassName = _c.loadingClassName, overrideClassName = _c.overrideClassName, rest = (0, tslib_1.__rest)(_c, ["level", "size", "disabled", "className", "title", "componentClass", "classnames", "children", "disabledTip", "block", "type", "active", "iconOnly", "href", "loading", "loadingClassName", "overrideClassName"]);
        if (href) {
            Comp = 'a';
        }
        else if ((Comp === 'button' && disabled) || loading) {
            Comp = 'div';
        }
        return (react_1.default.createElement(Comp, (0, tslib_1.__assign)({ type: Comp === 'input' || Comp === 'button' ? type : undefined }, (0, helper_1.pickEventsProps)(rest), { onClick: rest.onClick && disabled ? function () { } : rest.onClick, href: href, className: cx(overrideClassName
                ? ''
                : (_a = {
                        'Button': true
                    },
                    _a["Button--".concat(level)] = level,
                    _a["Button--".concat(size)] = size,
                    _a["Button--block"] = block,
                    _a["Button--iconOnly"] = iconOnly,
                    _a['is-disabled'] = disabled,
                    _a['is-active'] = active,
                    _a), className), title: title, disabled: disabled }),
            loading && !disabled ? (react_1.default.createElement("span", { className: cx(overrideClassName
                    ? ''
                    : (_b = {}, _b["Button--loading Button--loading--".concat(level)] = level, _b), loadingClassName) },
                react_1.default.createElement(icons_1.Icon, { icon: "loading-outline", className: "icon" }))) : null,
            children));
    };
    Button.prototype.render = function () {
        var _a = this.props, tooltip = _a.tooltip, tooltipPlacement = _a.tooltipPlacement, tooltipContainer = _a.tooltipContainer, tooltipTrigger = _a.tooltipTrigger, tooltipRootClose = _a.tooltipRootClose, disabled = _a.disabled, disabledTip = _a.disabledTip, cx = _a.classnames;
        return (react_1.default.createElement(TooltipWrapper_1.default, { placement: tooltipPlacement, tooltip: disabled ? disabledTip : tooltip, container: tooltipContainer, trigger: tooltipTrigger, rootClose: tooltipRootClose }, this.renderButton()));
    };
    Button.defaultProps = {
        componentClass: 'button',
        level: 'default',
        type: 'button',
        tooltipPlacement: 'top',
        tooltipTrigger: ['hover', 'focus'],
        tooltipRootClose: false
    };
    return Button;
}(react_1.default.Component));
exports.Button = Button;
exports.default = (0, theme_1.themeable)(Button);
//# sourceMappingURL=./components/Button.js.map
