"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Link = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var theme_1 = require("../theme");
var helper_1 = require("../utils/helper");
var icon_1 = require("../utils/icon");
var Link = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Link, _super);
    function Link(props) {
        return _super.call(this, props) || this;
    }
    Link.prototype.handleClick = function (e) {
        var _a = this.props, disabled = _a.disabled, onClick = _a.onClick;
        if (disabled) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        onClick === null || onClick === void 0 ? void 0 : onClick(e);
    };
    Link.prototype.render = function () {
        var _a = this.props, className = _a.className, href = _a.href, cx = _a.classnames, disabled = _a.disabled, htmlTarget = _a.htmlTarget, title = _a.title, icon = _a.icon, rightIcon = _a.rightIcon, children = _a.children, classPrefix = _a.classPrefix, theme = _a.theme, rest = (0, tslib_1.__rest)(_a, ["className", "href", "classnames", "disabled", "htmlTarget", "title", "icon", "rightIcon", "children", "classPrefix", "theme"]);
        return (react_1.default.createElement("a", (0, tslib_1.__assign)({}, rest, { href: href, target: htmlTarget, className: cx("Link", {
                'is-disabled': disabled
            }, className), title: title, onClick: this.handleClick }),
            icon ? (0, icon_1.generateIcon)(cx, icon, 'Link-icon') : null,
            children,
            rightIcon ? (0, icon_1.generateIcon)(cx, rightIcon, 'Link-icon') : null));
    };
    var _a;
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof react_1.default !== "undefined" && react_1.default.MouseEvent) === "function" ? _a : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Link.prototype, "handleClick", null);
    return Link;
}(react_1.default.Component));
exports.Link = Link;
exports.default = (0, theme_1.themeable)(Link);
//# sourceMappingURL=./components/Link.js.map
