"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WrapperRenderer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var factory_1 = require("../factory");
var style_1 = require("../utils/style");
var Wrapper = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Wrapper, _super);
    function Wrapper() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Wrapper.prototype.renderBody = function () {
        var _a = this.props, children = _a.children, body = _a.body, render = _a.render, disabled = _a.disabled;
        return children
            ? typeof children === 'function'
                ? children(this.props)
                : children
            : body
                ? render('body', body, { disabled: disabled })
                : null;
    };
    Wrapper.prototype.render = function () {
        var _a = this.props, className = _a.className, size = _a.size, cx = _a.classnames, style = _a.style, data = _a.data, wrap = _a.wrap;
        // 期望不要使用，给 form controls 用法自动转换时使用的。
        if (wrap === false) {
            return this.renderBody();
        }
        return (react_1.default.createElement("div", { className: cx('Wrapper', size && size !== 'none' ? "Wrapper--".concat(size) : '', className), style: (0, style_1.buildStyle)(style, data) }, this.renderBody()));
    };
    Wrapper.propsList = ['body', 'className', 'children', 'size'];
    Wrapper.defaultProps = {
        className: '',
        size: 'md'
    };
    return Wrapper;
}(react_1.default.Component));
exports.default = Wrapper;
var WrapperRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(WrapperRenderer, _super);
    function WrapperRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WrapperRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'wrapper'
        })
    ], WrapperRenderer);
    return WrapperRenderer;
}(Wrapper));
exports.WrapperRenderer = WrapperRenderer;
//# sourceMappingURL=./renderers/Wrapper.js.map
