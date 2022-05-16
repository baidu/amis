"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControlRenderer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var factory_1 = require("../../factory");
var helper_1 = require("../../utils/helper");
var tpl_builtin_1 = require("../../utils/tpl-builtin");
var Item_1 = require("./Item");
var ControlRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(ControlRenderer, _super);
    function ControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ControlRenderer.prototype.renderInput = function () {
        var _a = this.props, render = _a.render, body = _a.body, name = _a.name, data = _a.data;
        return render('inner', body, {
            value: typeof name === 'string' ? (0, tpl_builtin_1.resolveVariable)(name, data) : undefined
        });
    };
    ControlRenderer.prototype.render = function () {
        var _a;
        var _b = this.props, render = _b.render, label = _b.label, control = _b.control, rest = (0, tslib_1.__rest)(_b, ["render", "label", "control"]);
        return (react_1.default.createElement(Item_1.FormItemWrap, (0, tslib_1.__assign)({}, rest, { formMode: (_a = rest.mode) !== null && _a !== void 0 ? _a : rest.formMode, render: render, sizeMutable: false, label: label, renderControl: this.renderInput })));
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], ControlRenderer.prototype, "renderInput", null);
    ControlRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'control'
        })
    ], ControlRenderer);
    return ControlRenderer;
}(react_1.default.Component));
exports.ControlRenderer = ControlRenderer;
//# sourceMappingURL=./renderers/Form/Control.js.map
