"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TplRenderer = exports.Tpl = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var factory_1 = require("../factory");
var tpl_1 = require("../utils/tpl");
var helper_1 = require("../utils/helper");
var tpl_builtin_1 = require("../utils/tpl-builtin");
var Badge_1 = require("../components/Badge");
var style_1 = require("../utils/style");
var Tpl = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Tpl, _super);
    function Tpl(props) {
        var _this = _super.call(this, props) || this;
        _this.htmlRef = _this.htmlRef.bind(_this);
        return _this;
    }
    Tpl.prototype.componentDidUpdate = function (prevProps) {
        if ((0, helper_1.anyChanged)(['data', 'tpl', 'html', 'text', 'raw', 'value'], this.props, prevProps)) {
            this._render();
        }
    };
    Tpl.prototype.htmlRef = function (dom) {
        this.dom = dom;
        this._render();
    };
    Tpl.prototype.getContent = function () {
        var _a = this.props, tpl = _a.tpl, html = _a.html, text = _a.text, raw = _a.raw, data = _a.data, placeholder = _a.placeholder;
        var value = (0, helper_1.getPropValue)(this.props);
        if (raw) {
            return raw;
        }
        else if (html) {
            return (0, tpl_1.filter)(html, data);
        }
        else if (tpl) {
            return (0, tpl_1.filter)(tpl, data);
        }
        else if (text) {
            return (0, tpl_builtin_1.escapeHtml)((0, tpl_1.filter)(text, data));
        }
        else {
            return value == null || value === ''
                ? "<span class=\"text-muted\">".concat(placeholder, "</span>")
                : typeof value === 'string'
                    ? value
                    : JSON.stringify(value);
        }
    };
    Tpl.prototype._render = function () {
        if (!this.dom) {
            return;
        }
        this.dom.firstChild.innerHTML = this.props.env.filterHtml(this.getContent());
    };
    Tpl.prototype.render = function () {
        var _a = this.props, className = _a.className, wrapperComponent = _a.wrapperComponent, inline = _a.inline, cx = _a.classnames, style = _a.style, data = _a.data;
        var Component = wrapperComponent || (inline ? 'span' : 'div');
        return (react_1.default.createElement(Component, { ref: this.htmlRef, className: cx('TplField', className), style: (0, style_1.buildStyle)(style, data) },
            react_1.default.createElement("span", null, this.getContent())));
    };
    Tpl.defaultProps = {
        inline: true,
        placeholder: ''
    };
    return Tpl;
}(react_1.default.Component));
exports.Tpl = Tpl;
var TplRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(TplRenderer, _super);
    function TplRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TplRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            test: /(^|\/)(?:tpl|html)$/,
            name: 'tpl'
        })
        // @ts-ignore 类型没搞定
        ,
        Badge_1.withBadge
    ], TplRenderer);
    return TplRenderer;
}(Tpl));
exports.TplRenderer = TplRenderer;
//# sourceMappingURL=./renderers/Tpl.js.map
