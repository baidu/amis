"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkFieldRenderer = exports.LinkCmpt = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var factory_1 = require("../factory");
var helper_1 = require("../utils/helper");
var tpl_1 = require("../utils/tpl");
var Badge_1 = require("../components/Badge");
var Link_1 = (0, tslib_1.__importDefault)(require("../components/Link"));
var LinkCmpt = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(LinkCmpt, _super);
    function LinkCmpt() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LinkCmpt.prototype.handleClick = function (e) {
        var _a = this.props, env = _a.env, href = _a.href, blank = _a.blank, body = _a.body;
        env === null || env === void 0 ? void 0 : env.tracker({
            eventType: 'url',
            // 需要和 action 里命名一致方便后续分析
            eventData: { url: href, blank: blank, label: body }
        }, this.props);
    };
    LinkCmpt.prototype.getHref = function () { };
    LinkCmpt.prototype.render = function () {
        var _a = this.props, className = _a.className, body = _a.body, href = _a.href, cx = _a.classnames, blank = _a.blank, disabled = _a.disabled, htmlTarget = _a.htmlTarget, data = _a.data, render = _a.render, __ = _a.translate, title = _a.title, icon = _a.icon, rightIcon = _a.rightIcon;
        var value = (typeof href === 'string' && href
            ? (0, tpl_1.filter)(href, data, '| raw')
            : undefined) || (0, helper_1.getPropValue)(this.props);
        return (react_1.default.createElement(Link_1.default, { className: className, href: value, disabled: disabled, title: title, htmlTarget: htmlTarget || (blank ? '_blank' : '_self'), icon: icon, rightIcon: rightIcon, onClick: this.handleClick }, body ? render('body', body) : value || __('link')));
    };
    var _a;
    LinkCmpt.defaultProps = {
        blank: true,
        disabled: false,
        htmlTarget: ''
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof react_1.default !== "undefined" && react_1.default.MouseEvent) === "function" ? _a : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], LinkCmpt.prototype, "handleClick", null);
    return LinkCmpt;
}(react_1.default.Component));
exports.LinkCmpt = LinkCmpt;
var LinkFieldRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(LinkFieldRenderer, _super);
    function LinkFieldRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LinkFieldRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'link'
        })
        // @ts-ignore 类型没搞定
        ,
        Badge_1.withBadge
    ], LinkFieldRenderer);
    return LinkFieldRenderer;
}(LinkCmpt));
exports.LinkFieldRenderer = LinkFieldRenderer;
//# sourceMappingURL=./renderers/Link.js.map
