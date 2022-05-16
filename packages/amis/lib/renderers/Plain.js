"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlainRenderer = exports.Plain = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var factory_1 = require("../factory");
var tpl_1 = require("../utils/tpl");
var helper_1 = require("../utils/helper");
var Plain = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Plain, _super);
    function Plain() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Plain.prototype.render = function () {
        var _a = this.props, className = _a.className, wrapperComponent = _a.wrapperComponent, text = _a.text, data = _a.data, tpl = _a.tpl, inline = _a.inline, placeholder = _a.placeholder, cx = _a.classnames;
        var value = (0, helper_1.getPropValue)(this.props);
        var Component = wrapperComponent || (inline ? 'span' : 'div');
        return (react_1.default.createElement(Component, { className: cx('PlainField', className) }, tpl || text ? ((0, tpl_1.filter)(tpl || text, data)) : typeof value === 'undefined' || value === '' || value === null ? (react_1.default.createElement("span", { className: "text-muted" }, placeholder)) : (String(value))));
    };
    Plain.defaultProps = {
        wrapperComponent: '',
        inline: true,
        placeholder: '-'
    };
    return Plain;
}(react_1.default.Component));
exports.Plain = Plain;
var PlainRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(PlainRenderer, _super);
    function PlainRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PlainRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            test: /(^|\/)(?:plain|text)$/,
            name: 'plain'
        })
    ], PlainRenderer);
    return PlainRenderer;
}(Plain));
exports.PlainRenderer = PlainRenderer;
//# sourceMappingURL=./renderers/Plain.js.map
