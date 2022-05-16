"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SparkLine = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var locale_1 = require("../locale");
var theme_1 = require("../theme");
var SparkLine = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(SparkLine, _super);
    function SparkLine() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SparkLine.prototype.normalizeValue = function (item) {
        if (typeof item === 'number') {
            return item;
        }
        else if (item && typeof item.value === 'number') {
            return item.value;
        }
        else {
            return Number(item) || 0;
        }
    };
    SparkLine.prototype.renderLines = function () {
        var _this = this;
        var _a = this.props, width = _a.width, height = _a.height, value = _a.value, cx = _a.classnames;
        var values = value.map(function (item) { return _this.normalizeValue(item); });
        var max = Math.max.apply(Math, values);
        var min = Math.min.apply(Math, values);
        var duration = max - min || 1;
        var gap = width / (values.length - 1);
        var points = [];
        values.forEach(function (value, index) {
            points.push({
                x: index * gap,
                y: height - ((value - min) * height) / duration
            });
        });
        var lineD = points
            .map(function (value, index) { return "".concat(index === 0 ? 'M' : 'L', " ").concat(value.x, " ").concat(value.y); })
            .join(' ');
        var areaD = "".concat(lineD, " V ").concat(height, " L 0 ").concat(height, " Z");
        // todo 支持鼠标 hover 显示对应数据。
        return (react_1.default.createElement("g", null,
            react_1.default.createElement("path", { className: cx("Sparkline-area"), d: areaD, stroke: "none" }),
            react_1.default.createElement("path", { className: cx("Sparkline-line"), d: lineD, fill: "none" })));
    };
    SparkLine.prototype.render = function () {
        var _a = this.props, cx = _a.classnames, className = _a.className, value = _a.value, width = _a.width, height = _a.height, placeholder = _a.placeholder, __ = _a.translate, onClick = _a.onClick;
        return (react_1.default.createElement("div", { className: cx('Sparkline', className, onClick ? 'Sparkline--clickable' : ''), onClick: onClick }, Array.isArray(value) && value.length > 1 ? (react_1.default.createElement("svg", { className: cx('Sparkline-svg'), width: width, height: height, viewBox: "0 0 ".concat(width, " ").concat(height) }, this.renderLines())) : (placeholder !== null && placeholder !== void 0 ? placeholder : __('placeholder.empty'))));
    };
    SparkLine.defaultProps = {
        width: 100,
        height: 50
    };
    return SparkLine;
}(react_1.default.Component));
exports.SparkLine = SparkLine;
exports.default = (0, theme_1.themeable)((0, locale_1.localeable)(SparkLine));
//# sourceMappingURL=./components/SparkLine.js.map
