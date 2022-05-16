"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebComponentRenderer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var factory_1 = require("../factory");
var tpl_builtin_1 = require("../utils/tpl-builtin");
var mapValues_1 = (0, tslib_1.__importDefault)(require("lodash/mapValues"));
var WebComponent = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(WebComponent, _super);
    function WebComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WebComponent.prototype.renderBody = function () {
        var _a = this.props, body = _a.body, render = _a.render;
        return body ? render('body', body) : null;
    };
    WebComponent.prototype.render = function () {
        var _a = this.props, tag = _a.tag, props = _a.props, data = _a.data;
        var propsValues = (0, mapValues_1.default)(props, function (s) {
            if (typeof s === 'string') {
                return (0, tpl_builtin_1.resolveVariableAndFilter)(s, data, '| raw') || s;
            }
            else {
                return s;
            }
        });
        var Component = tag || 'div';
        return react_1.default.createElement(Component, (0, tslib_1.__assign)({}, propsValues), this.renderBody());
    };
    return WebComponent;
}(react_1.default.Component));
exports.default = WebComponent;
var WebComponentRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(WebComponentRenderer, _super);
    function WebComponentRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WebComponentRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'web-component'
        })
    ], WebComponentRenderer);
    return WebComponentRenderer;
}(WebComponent));
exports.WebComponentRenderer = WebComponentRenderer;
//# sourceMappingURL=./renderers/WebComponent.js.map
