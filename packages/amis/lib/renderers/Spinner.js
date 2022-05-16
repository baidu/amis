"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpinnerRenderer = void 0;
var tslib_1 = require("tslib");
var Spinner_1 = (0, tslib_1.__importDefault)(require("../components/Spinner"));
var factory_1 = require("../factory");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var SpinnerRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(SpinnerRenderer, _super);
    function SpinnerRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SpinnerRenderer.prototype.renderBody = function () {
        var _a = this.props, body = _a.body, render = _a.render;
        return body ? render('body', body) : null;
    };
    SpinnerRenderer.prototype.render = function () {
        var _a = this.props, cx = _a.classnames, spinnerWrapClassName = _a.spinnerWrapClassName, body = _a.body, rest = (0, tslib_1.__rest)(_a, ["classnames", "spinnerWrapClassName", "body"]);
        return body ? (react_1.default.createElement("div", { className: cx("Spinner-wrap", spinnerWrapClassName) },
            react_1.default.createElement(Spinner_1.default, (0, tslib_1.__assign)({}, rest)),
            this.renderBody())) : (react_1.default.createElement(Spinner_1.default, (0, tslib_1.__assign)({}, rest)));
    };
    SpinnerRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'spinner'
        })
    ], SpinnerRenderer);
    return SpinnerRenderer;
}(react_1.default.Component));
exports.SpinnerRenderer = SpinnerRenderer;
//# sourceMappingURL=./renderers/Spinner.js.map
