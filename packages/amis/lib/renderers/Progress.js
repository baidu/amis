"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressFieldRenderer = exports.ProgressField = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var factory_1 = require("../factory");
var helper_1 = require("../utils/helper");
var Progress_1 = (0, tslib_1.__importDefault)(require("../components/Progress"));
var ProgressField = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(ProgressField, _super);
    function ProgressField() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ProgressField.prototype.format = function (value) {
        var _a = this.props, valueTpl = _a.valueTpl, render = _a.render, data = _a.data;
        return render("progress-value", valueTpl || '${value}%', {
            data: (0, helper_1.createObject)(data, { value: value })
        });
    };
    ProgressField.prototype.render = function () {
        var _a = this.props, mode = _a.mode, className = _a.className, placeholder = _a.placeholder, progressClassName = _a.progressClassName, map = _a.map, stripe = _a.stripe, animate = _a.animate, showLabel = _a.showLabel, strokeWidth = _a.strokeWidth, gapDegree = _a.gapDegree, gapPosition = _a.gapPosition, cx = _a.classnames;
        var value = (0, helper_1.getPropValue)(this.props);
        if (/^\d*\.?\d+$/.test(value)) {
            value = parseFloat(value);
        }
        return (react_1.default.createElement(Progress_1.default, { value: value, type: mode, map: map, stripe: stripe, animate: animate, showLabel: showLabel, placeholder: placeholder, format: this.format, strokeWidth: strokeWidth, gapDegree: gapDegree, gapPosition: gapPosition, className: className, progressClassName: progressClassName }));
    };
    ProgressField.defaultProps = {
        placeholder: '-',
        progressClassName: '',
        progressBarClassName: '',
        map: ['bg-danger', 'bg-warning', 'bg-info', 'bg-success', 'bg-success'],
        valueTpl: '${value}%',
        showLabel: true,
        stripe: false,
        animate: false
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Number]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], ProgressField.prototype, "format", null);
    return ProgressField;
}(react_1.default.Component));
exports.ProgressField = ProgressField;
var ProgressFieldRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(ProgressFieldRenderer, _super);
    function ProgressFieldRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ProgressFieldRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'progress'
        })
    ], ProgressFieldRenderer);
    return ProgressFieldRenderer;
}(ProgressField));
exports.ProgressFieldRenderer = ProgressFieldRenderer;
//# sourceMappingURL=./renderers/Progress.js.map
