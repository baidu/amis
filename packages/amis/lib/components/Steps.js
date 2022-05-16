"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Steps = exports.StepStatus = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var theme_1 = require("../theme");
var icons_1 = require("./icons");
var helper_1 = require("../utils/helper");
var StepStatus;
(function (StepStatus) {
    StepStatus["wait"] = "wait";
    StepStatus["process"] = "process";
    StepStatus["finish"] = "finish";
    StepStatus["error"] = "error";
})(StepStatus = exports.StepStatus || (exports.StepStatus = {}));
function Steps(props) {
    var stepsRow = props.steps, cx = props.classnames, className = props.className, current = props.current, status = props.status, _a = props.mode, mode = _a === void 0 ? 'horizontal' : _a, _b = props.labelPlacement, labelPlacement = _b === void 0 ? 'horizontal' : _b, _c = props.progressDot, progressDot = _c === void 0 ? false : _c, useMobileUI = props.useMobileUI;
    var FINISH_ICON = 'check';
    var ERROR_ICON = 'close';
    function getStepStatus(step, i) {
        var stepStatus = StepStatus.wait;
        var icon = step.icon;
        if (i < current) {
            stepStatus = StepStatus.finish;
            !icon && (icon = FINISH_ICON);
        }
        else if (i === current) {
            stepStatus = StepStatus.process;
        }
        if (typeof status === 'string') {
            if (i === current) {
                stepStatus = step.status || status || StepStatus.process;
                stepStatus === StepStatus.error && !icon && (icon = ERROR_ICON);
            }
        }
        else if (typeof status === 'object') {
            var key = step.value;
            key && status[key] && (stepStatus = status[key]);
        }
        return {
            stepStatus: stepStatus,
            icon: icon
        };
    }
    var mobileUI = useMobileUI && (0, helper_1.isMobile)();
    return (react_1.default.createElement("ul", { className: cx(// 纵向步骤条暂时不支持labelPlacement属性
        'Steps', "Steps--Placement-".concat((progressDot || (labelPlacement === 'vertical' && mode != 'vertical')) ? 'vertical' : ''), "Steps--".concat(progressDot ? 'ProgressDot' : ''), "Steps--".concat(mode), mobileUI ? 'Steps-mobile' : '', className) }, stepsRow.map(function (step, i) {
        var _a = getStepStatus(step, i), stepStatus = _a.stepStatus, icon = _a.icon;
        return (react_1.default.createElement("li", { key: i, className: cx('StepsItem', "is-".concat(stepStatus), step.className, "StepsItem-".concat(progressDot ? 'ProgressDot' : '')) },
            react_1.default.createElement("div", { className: cx('StepsItem-container') },
                react_1.default.createElement("div", { className: cx('StepsItem-containerTail') }),
                progressDot ? react_1.default.createElement("div", { className: cx('StepsItem-containerProgressDot') })
                    : react_1.default.createElement("div", { className: cx('StepsItem-containerIcon', i < current && 'is-success') },
                        react_1.default.createElement("span", { className: cx('StepsItem-icon') }, icon ? react_1.default.createElement(icons_1.Icon, { icon: icon, className: "icon" }) : i + 1)),
                react_1.default.createElement("div", { className: cx('StepsItem-containerWrapper') },
                    react_1.default.createElement("div", { className: cx('StepsItem-body') },
                        react_1.default.createElement("div", { className: cx('StepsItem-title', "StepsItem-".concat(progressDot ? 'vertical-ProgressDot' : ''), i < current && 'is-success') },
                            react_1.default.createElement("span", { className: cx('StepsItem-ellText'), title: String(step.title) }, step.title),
                            react_1.default.createElement("span", { className: cx('StepsItem-subTitle', 'StepsItem-ellText'), title: String(step.subTitle) }, step.subTitle)),
                        react_1.default.createElement("div", { className: cx('StepsItem-description', 'StepsItem-ellText'), title: String(step.description) },
                            react_1.default.createElement("span", null, step.description)))))));
    })));
}
exports.Steps = Steps;
exports.default = (0, theme_1.themeable)(Steps);
//# sourceMappingURL=./components/Steps.js.map
