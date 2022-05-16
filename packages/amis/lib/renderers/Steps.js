"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StepsRenderer = exports.StepsCmpt = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var factory_1 = require("../factory");
var Steps_1 = tslib_1.__importStar(require("../components/Steps"));
var WithRemoteConfig_1 = require("../components/WithRemoteConfig");
var tpl_builtin_1 = require("../utils/tpl-builtin");
var tpl_1 = require("../utils/tpl");
var helper_1 = require("../utils/helper");
function StepsCmpt(props) {
    var _a;
    var className = props.className, steps = props.steps, status = props.status, mode = props.mode, labelPlacement = props.labelPlacement, progressDot = props.progressDot, data = props.data, source = props.source, config = props.config, render = props.render, useMobileUI = props.useMobileUI;
    var stepsRow = (0, tpl_builtin_1.resolveVariable)(source, data) ||
        config ||
        steps ||
        [];
    var resolveRender = function (val) {
        return typeof val === 'string' ? (0, tpl_1.filter)(val, data) : val && render('inner', val);
    };
    var value = (_a = (0, helper_1.getPropValue)(props)) !== null && _a !== void 0 ? _a : 0;
    var resolveValue = typeof value === 'string' && isNaN(+value)
        ? +(0, tpl_builtin_1.resolveVariable)(value, data) || +value
        : +value;
    var valueIndex = stepsRow.findIndex(function (item) { return item.value && item.value === resolveValue; });
    var currentValue = valueIndex !== -1 ? valueIndex : resolveValue;
    var resolveSteps = stepsRow.map(function (step, i) {
        var stepStatus = getStepStatus(step, i);
        return (0, tslib_1.__assign)((0, tslib_1.__assign)({}, step), { status: stepStatus, title: resolveRender(step.title), subTitle: resolveRender(step.subTitle), description: resolveRender(step.description) });
    });
    function getStepStatus(step, i) {
        var stepStatus;
        if (typeof status === 'string') {
            if (i === currentValue) {
                var resolveStatus = (0, tpl_builtin_1.resolveVariable)(status, data);
                stepStatus = resolveStatus || status || Steps_1.StepStatus.process;
            }
        }
        else if (typeof status === 'object') {
            var key = step.value;
            key && status[key] && (stepStatus = status[key]);
        }
        return stepStatus;
    }
    return (react_1.default.createElement(Steps_1.default, { current: currentValue, steps: resolveSteps, className: className, status: status, mode: mode, progressDot: progressDot, labelPlacement: labelPlacement, useMobileUI: useMobileUI }));
}
exports.StepsCmpt = StepsCmpt;
var StepsWithRemoteConfig = (0, WithRemoteConfig_1.withRemoteConfig)({
    adaptor: function (data) { return data.steps || data; }
})(/** @class */ (function (_super) {
    (0, tslib_1.__extends)(class_1, _super);
    function class_1() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    class_1.prototype.render = function () {
        var _a = this.props, config = _a.config, deferLoad = _a.deferLoad, loading = _a.loading, updateConfig = _a.updateConfig, rest = (0, tslib_1.__rest)(_a, ["config", "deferLoad", "loading", "updateConfig"]);
        return react_1.default.createElement(StepsCmpt, (0, tslib_1.__assign)({ config: config }, rest));
    };
    return class_1;
}(react_1.default.Component)));
var StepsRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(StepsRenderer, _super);
    function StepsRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StepsRenderer.prototype.render = function () {
        return react_1.default.createElement(StepsWithRemoteConfig, (0, tslib_1.__assign)({}, this.props));
    };
    StepsRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'steps'
        })
    ], StepsRenderer);
    return StepsRenderer;
}(react_1.default.Component));
exports.StepsRenderer = StepsRenderer;
//# sourceMappingURL=./renderers/Steps.js.map
