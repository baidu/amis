"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Progress = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var rc_progress_1 = require("rc-progress");
var theme_1 = require("../theme");
var Progress = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Progress, _super);
    function Progress() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Progress.prototype.getCurrentColor = function () {
        var color = this.props.map;
        if (!color || !color.length) {
            return 'bg-primary';
        }
        if (typeof color === 'string') {
            return color;
        }
        else {
            return this.getLevelColor(color);
        }
    };
    Progress.prototype.getLevelColor = function (color) {
        var value = this.props.value;
        var colorArray = this.getColorArray(color).sort(function (a, b) { return a.value - b.value; });
        for (var i = 0; i < colorArray.length; i++) {
            if (colorArray[i].value >= value) {
                return colorArray[i].color;
            }
        }
        return colorArray[colorArray.length - 1].color;
    };
    Progress.prototype.getColorArray = function (color) {
        var span = 100 / color.length;
        return color.map(function (item, index) {
            if (typeof item === 'string') {
                return {
                    color: item,
                    value: (index + 1) * span
                };
            }
            return item;
        });
    };
    Progress.prototype.getLabel = function (prefixCls) {
        var _a = this.props, value = _a.value, format = _a.format, showLabel = _a.showLabel, cx = _a.classnames;
        if (!showLabel) {
            return null;
        }
        var textFormatter = format || (function (value) { return "".concat(value, "%"); });
        var content = textFormatter(value);
        return (react_1.default.createElement("span", { className: cx("".concat(prefixCls, "-text")), key: "value" }, content));
    };
    Progress.prototype.render = function () {
        var _a, _b, _c, _d;
        var _e = this.props, className = _e.className, progressClassName = _e.progressClassName, type = _e.type, value = _e.value, placeholder = _e.placeholder, stripe = _e.stripe, animate = _e.animate, gapDegree = _e.gapDegree, gapPosition = _e.gapPosition, strokeWidth = _e.strokeWidth, cx = _e.classnames;
        var isLineType = type === 'line';
        var prefixCls = isLineType ? 'Progress-line' : 'Progress-circle';
        var bgColor = this.getCurrentColor();
        var isColorClass = /bg-/.test(bgColor);
        var viewValue;
        if (typeof value !== 'number') {
            viewValue = react_1.default.createElement("span", { className: "text-muted" }, placeholder);
        }
        else if (type === 'line') {
            var barStyle = {
                width: "".concat(value, "%")
            };
            strokeWidth && (barStyle.height = strokeWidth);
            !isColorClass && (barStyle.backgroundColor = bgColor);
            viewValue = [
                react_1.default.createElement("div", { key: "progress", className: cx(prefixCls, progressClassName) },
                    react_1.default.createElement("div", { className: cx("".concat(prefixCls, "-inter")) },
                        react_1.default.createElement("div", { className: cx("".concat(prefixCls, "-bar"), (_a = {}, _a[bgColor] = isColorClass, _a), (_b = {}, _b["".concat(prefixCls, "-bar--stripe")] = stripe, _b), (_c = {}, _c["".concat(prefixCls, "-bar--animate")] = animate && !stripe, _c), (_d = {}, _d["".concat(prefixCls, "-bar--stripe-animate")] = animate && stripe, _d)), title: "".concat(value, "%"), style: barStyle }))),
                this.getLabel(prefixCls)
            ];
        }
        else if (type === 'circle' || type === 'dashboard') {
            var circleWidth = strokeWidth || 6;
            var gapPos = gapPosition || (type === 'dashboard' && 'bottom') || 'top';
            var getGapDegree = function () {
                if (gapDegree || gapDegree === 0) {
                    return gapDegree;
                }
                if (type === 'dashboard') {
                    return 75;
                }
                return undefined;
            };
            viewValue = [
                react_1.default.createElement("div", { className: cx(prefixCls, progressClassName || 'w-ssm'), key: "circle" },
                    react_1.default.createElement(rc_progress_1.Circle, { percent: value, strokeColor: !isColorClass ? bgColor : '', strokeWidth: circleWidth, trailWidth: circleWidth, prefixCls: isColorClass ? bgColor : '', gapDegree: getGapDegree(), gapPosition: gapPos }),
                    this.getLabel(prefixCls))
            ];
        }
        return react_1.default.createElement("div", { className: cx('Progress', className) }, viewValue);
    };
    Progress.defaultProps = {
        type: 'line',
        placeholder: '-',
        progressClassName: '',
        map: ['bg-danger', 'bg-warning', 'bg-info', 'bg-success', 'bg-success'],
        showLabel: true
    };
    return Progress;
}(react_1.default.Component));
exports.Progress = Progress;
exports.default = (0, theme_1.themeable)(Progress);
//# sourceMappingURL=./components/Progress.js.map
