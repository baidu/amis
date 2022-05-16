"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TplRenderer = void 0;
var tslib_1 = require("tslib");
var factory_1 = require("../factory");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var Alert2_1 = (0, tslib_1.__importDefault)(require("../components/Alert2"));
var tpl_builtin_1 = require("../utils/tpl-builtin");
var TplRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(TplRenderer, _super);
    function TplRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TplRenderer.prototype.render = function () {
        var _a = this.props, render = _a.render, body = _a.body, level = _a.level, icon = _a.icon, showIcon = _a.showIcon, rest = (0, tslib_1.__rest)(_a, ["render", "body", "level", "icon", "showIcon"]);
        if ((0, tpl_builtin_1.isPureVariable)(level)) {
            level = (0, tpl_builtin_1.resolveVariableAndFilter)(level, this.props.data);
        }
        if ((0, tpl_builtin_1.isPureVariable)(icon)) {
            icon = (0, tpl_builtin_1.resolveVariableAndFilter)(icon, this.props.data);
        }
        if ((0, tpl_builtin_1.isPureVariable)(showIcon)) {
            showIcon = (0, tpl_builtin_1.resolveVariableAndFilter)(showIcon, this.props.data);
        }
        return (react_1.default.createElement(Alert2_1.default, (0, tslib_1.__assign)({}, rest, { level: level, icon: icon, showIcon: showIcon }), render('body', body)));
    };
    TplRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'alert'
        })
    ], TplRenderer);
    return TplRenderer;
}(react_1.default.Component));
exports.TplRenderer = TplRenderer;
//# sourceMappingURL=./renderers/Alert.js.map
