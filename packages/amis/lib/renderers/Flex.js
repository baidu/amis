"use strict";
/**
 * @file 简化版 Flex 布局，主要用于不熟悉 CSS 的开发者
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlexItemRenderer = exports.FlexRenderer = exports.FlexItem = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var factory_1 = require("../factory");
var Flex = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Flex, _super);
    function Flex(props) {
        return _super.call(this, props) || this;
    }
    Flex.prototype.render = function () {
        var _a = this.props, items = _a.items, direction = _a.direction, justify = _a.justify, alignItems = _a.alignItems, alignContent = _a.alignContent, style = _a.style, className = _a.className, render = _a.render, disabled = _a.disabled;
        var flexStyle = (0, tslib_1.__assign)({ display: 'flex', flexDirection: direction, justifyContent: justify, alignItems: alignItems, alignContent: alignContent }, style);
        return (react_1.default.createElement("div", { style: flexStyle, className: className }, (Array.isArray(items) ? items : items ? [items] : []).map(function (item, key) {
            return render("flexItem/".concat(key), item, {
                key: "flexItem/".concat(key),
                disabled: disabled
            });
        })));
    };
    Flex.defaultProps = {
        direction: 'row',
        justify: 'center',
        alignItems: 'center',
        alignContent: 'center'
    };
    return Flex;
}(react_1.default.Component));
exports.default = Flex;
var FlexItem = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(FlexItem, _super);
    function FlexItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FlexItem.prototype.renderBody = function () {
        var _a = this.props, children = _a.children, body = _a.body, render = _a.render, disabled = _a.disabled;
        return children
            ? typeof children === 'function'
                ? children(this.props)
                : children
            : body
                ? render('body', body, { disabled: disabled })
                : null;
    };
    FlexItem.prototype.render = function () {
        var _a = this.props, className = _a.className, size = _a.size, cx = _a.classnames, style = _a.style;
        return (react_1.default.createElement("div", { className: className, style: style }, this.renderBody()));
    };
    FlexItem.propsList = ['body', 'className', 'children'];
    return FlexItem;
}(react_1.default.Component));
exports.FlexItem = FlexItem;
var FlexRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(FlexRenderer, _super);
    function FlexRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FlexRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'flex'
        })
    ], FlexRenderer);
    return FlexRenderer;
}(Flex));
exports.FlexRenderer = FlexRenderer;
var FlexItemRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(FlexItemRenderer, _super);
    function FlexItemRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FlexItemRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'flex-item'
        })
    ], FlexItemRenderer);
    return FlexItemRenderer;
}(FlexItem));
exports.FlexItemRenderer = FlexItemRenderer;
//# sourceMappingURL=./renderers/Flex.js.map
