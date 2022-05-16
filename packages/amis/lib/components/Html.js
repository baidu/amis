"use strict";
/**
 * @file Html
 * @description
 * @author fex
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Html = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var theme_1 = require("../theme");
var Html = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Html, _super);
    function Html(props) {
        var _this = _super.call(this, props) || this;
        _this.htmlRef = _this.htmlRef.bind(_this);
        return _this;
    }
    Html.prototype.componentDidUpdate = function (prevProps) {
        if (this.props.html !== prevProps.html) {
            this._render();
        }
    };
    Html.prototype.htmlRef = function (dom) {
        this.dom = dom;
        if (!dom) {
            return;
        }
        this._render();
    };
    Html.prototype._render = function () {
        var html = this.props.html;
        if (html) {
            this.dom.innerHTML = html;
        }
    };
    Html.prototype.render = function () {
        var _a = this.props, className = _a.className, wrapperComponent = _a.wrapperComponent, inline = _a.inline, ns = _a.classPrefix, cx = _a.classnames;
        var Component = wrapperComponent || (inline ? 'span' : 'div');
        return (react_1.default.createElement(Component, { ref: this.htmlRef, className: cx("Html", className) }));
    };
    Html.defaultProps = {
        inline: true
    };
    return Html;
}(react_1.default.Component));
exports.Html = Html;
exports.default = (0, theme_1.themeable)(Html);
//# sourceMappingURL=./components/Html.js.map
