"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemarkRenderer = exports.filterContents = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var factory_1 = require("../factory");
var TooltipWrapper_1 = (0, tslib_1.__importDefault)(require("../components/TooltipWrapper"));
var tpl_1 = require("../utils/tpl");
var theme_1 = require("../theme");
var icons_1 = require("../components/icons");
var helper_1 = require("../utils/helper");
function filterContents(tooltip, data) {
    if (typeof tooltip === 'string') {
        return (0, tpl_1.filter)(tooltip, data);
    }
    else if (tooltip) {
        return tooltip.title
            ? {
                children: tooltip === null || tooltip === void 0 ? void 0 : tooltip.children,
                title: (0, tpl_1.filter)(tooltip.title, data),
                content: tooltip.content || tooltip.body
                    ? (0, tpl_1.filter)(tooltip.content || tooltip.body || '', data)
                    : undefined
            }
            : tooltip.content || tooltip.body
                ? (0, tpl_1.filter)(tooltip.content || tooltip.body || '', data)
                : undefined;
    }
    return tooltip;
}
exports.filterContents = filterContents;
var Remark = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Remark, _super);
    function Remark() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Remark.prototype.showModalTip = function (tooltip) {
        var _a = this.props, onAction = _a.onAction, data = _a.data;
        return function (e) {
            onAction &&
                onAction(e, {
                    actionType: 'dialog',
                    dialog: {
                        title: tooltip && typeof tooltip !== 'string' ? tooltip.title : '',
                        body: tooltip && typeof tooltip !== 'string'
                            ? tooltip.content
                            : tooltip,
                        actions: []
                    }
                }, data);
        };
    };
    Remark.prototype.renderLabel = function (finalIcon, finalLabel, cx, shape) {
        var shapeClass = shape ? "Remark-icon--".concat(shape) : undefined;
        return (react_1.default.createElement(react_1.default.Fragment, null,
            finalLabel ? react_1.default.createElement("span", null, finalLabel) : null,
            finalIcon ? ((0, icons_1.hasIcon)(finalIcon) ? (react_1.default.createElement("span", { className: cx('Remark-icon', shapeClass) },
                react_1.default.createElement(icons_1.Icon, { icon: finalIcon }))) : (react_1.default.createElement("i", { className: cx('Remark-icon', finalIcon) }))) : finalIcon === false && finalLabel ? null : (react_1.default.createElement("span", { className: cx('Remark-icon icon', shapeClass) },
                react_1.default.createElement(icons_1.Icon, { icon: "question-mark" })))));
    };
    Remark.prototype.render = function () {
        var _a, _b;
        var _c = this.props, className = _c.className, icon = _c.icon, label = _c.label, shape = _c.shape, tooltip = _c.tooltip, placement = _c.placement, rootClose = _c.rootClose, trigger = _c.trigger, container = _c.container, ns = _c.classPrefix, cx = _c.classnames, content = _c.content, data = _c.data, env = _c.env, tooltipClassName = _c.tooltipClassName, useMobileUI = _c.useMobileUI;
        var finalIcon = (_a = tooltip === null || tooltip === void 0 ? void 0 : tooltip.icon) !== null && _a !== void 0 ? _a : icon;
        var finalLabel = (_b = tooltip === null || tooltip === void 0 ? void 0 : tooltip.label) !== null && _b !== void 0 ? _b : label;
        var parsedTip = filterContents(tooltip || content, data);
        // 移动端使用弹框提示
        if ((0, helper_1.isMobile)() && useMobileUI) {
            return (react_1.default.createElement("div", { className: cx("Remark", (tooltip && tooltip.className) || className || "Remark--warning"), onClick: this.showModalTip(parsedTip) }, this.renderLabel(finalIcon, finalLabel, cx, shape)));
        }
        return (react_1.default.createElement(TooltipWrapper_1.default, { classPrefix: ns, classnames: cx, tooltip: parsedTip, tooltipClassName: (tooltip && tooltip.tooltipClassName) || tooltipClassName, placement: (tooltip && tooltip.placement) || placement, rootClose: (tooltip && tooltip.rootClose) || rootClose, trigger: (tooltip && tooltip.trigger) || trigger, container: container || env.getModalContainer, delay: tooltip && tooltip.delay },
            react_1.default.createElement("div", { className: cx("Remark", (tooltip && tooltip.className) || className || "Remark--warning") }, this.renderLabel(finalIcon, finalLabel, cx, shape))));
    };
    var _a;
    Remark.propsList = [];
    Remark.defaultProps = {
        icon: '',
        trigger: ['hover', 'focus']
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Remark.prototype, "showModalTip", null);
    return Remark;
}(react_1.default.Component));
exports.default = (0, theme_1.themeable)(Remark);
var RemarkRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(RemarkRenderer, _super);
    function RemarkRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RemarkRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'remark'
        })
    ], RemarkRenderer);
    return RemarkRenderer;
}(Remark));
exports.RemarkRenderer = RemarkRenderer;
//# sourceMappingURL=./renderers/Remark.js.map
