"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollapseGroupRenderer = exports.CollapseGroupRender = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var factory_1 = require("../factory");
var CollapseGroup_1 = (0, tslib_1.__importDefault)(require("../components/CollapseGroup"));
var CollapseGroupRender = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(CollapseGroupRender, _super);
    function CollapseGroupRender(props) {
        return _super.call(this, props) || this;
    }
    CollapseGroupRender.prototype.render = function () {
        var _a = this.props, defaultActiveKey = _a.defaultActiveKey, accordion = _a.accordion, expandIcon = _a.expandIcon, expandIconPosition = _a.expandIconPosition, body = _a.body, className = _a.className, render = _a.render;
        return (react_1.default.createElement(CollapseGroup_1.default, { defaultActiveKey: defaultActiveKey, accordion: accordion, expandIcon: expandIcon, expandIconPosition: expandIconPosition, className: className }, render('body', body || '')));
    };
    return CollapseGroupRender;
}(react_1.default.Component));
exports.CollapseGroupRender = CollapseGroupRender;
var CollapseGroupRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(CollapseGroupRenderer, _super);
    function CollapseGroupRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CollapseGroupRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'collapse-group'
        })
    ], CollapseGroupRenderer);
    return CollapseGroupRenderer;
}(CollapseGroupRender));
exports.CollapseGroupRenderer = CollapseGroupRenderer;
//# sourceMappingURL=./renderers/CollapseGroup.js.map
