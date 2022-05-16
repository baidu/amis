"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RadiosControlRenderer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var Options_1 = require("./Options");
var helper_1 = require("../../utils/helper");
var ChartRadiosControl = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(ChartRadiosControl, _super);
    function ChartRadiosControl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.highlightIndex = -1;
        _this.prevIndex = -1;
        return _this;
    }
    ChartRadiosControl.prototype.chartRef = function (chart) {
        var _this = this;
        var _a;
        this.chart = chart;
        (_a = this.chart) === null || _a === void 0 ? void 0 : _a.on('click', 'series', function (params) {
            _this.props.onToggle(_this.props.options[params.dataIndex]);
        });
        // 因为会要先 setOptions 再来。
        setTimeout(function () { return _this.highlight(); });
    };
    ChartRadiosControl.prototype.highlight = function (index) {
        if (index === void 0) { index = this.highlightIndex; }
        this.highlightIndex = index;
        if (!this.chart || this.prevIndex === index) {
            return;
        }
        if (~this.prevIndex) {
            this.chart.dispatchAction({
                type: 'downplay',
                seriesIndex: 0,
                dataIndex: this.prevIndex
            });
        }
        if (~index) {
            this.chart.dispatchAction({
                type: 'highlight',
                seriesIndex: 0,
                dataIndex: index
            });
            // 显示 tooltip
            if (this.props.showTooltipOnHighlight) {
                this.chart.dispatchAction({
                    type: 'showTip',
                    seriesIndex: 0,
                    dataIndex: index
                });
            }
        }
        this.prevIndex = index;
    };
    ChartRadiosControl.prototype.compoonentDidMount = function () {
        if (this.props.selectedOptions.length) {
            this.highlight(this.props.options.indexOf(this.props.selectedOptions[0]));
        }
    };
    ChartRadiosControl.prototype.componentDidUpdate = function () {
        if (this.props.selectedOptions.length) {
            this.highlight(this.props.options.indexOf(this.props.selectedOptions[0]));
        }
    };
    ChartRadiosControl.prototype.render = function () {
        var _a = this.props, options = _a.options, labelField = _a.labelField, chartValueField = _a.chartValueField, valueField = _a.valueField, render = _a.render;
        var config = (0, tslib_1.__assign)((0, tslib_1.__assign)({ legend: {
                top: 10
            }, tooltip: {
                formatter: function (params) {
                    return "".concat(params.name, "\uFF1A").concat(params.value[chartValueField || valueField || 'value'], "\uFF08").concat(params.percent, "%\uFF09");
                }
            }, series: [
                {
                    type: 'pie',
                    top: 30,
                    bottom: 0
                }
            ] }, this.props.config), { dataset: {
                dimensions: [
                    labelField || 'label',
                    chartValueField || valueField || 'value'
                ],
                source: options
            } });
        return render('chart', {
            type: 'chart'
        }, {
            config: config,
            chartRef: this.chartRef
        });
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], ChartRadiosControl.prototype, "chartRef", null);
    return ChartRadiosControl;
}(react_1.default.Component));
exports.default = ChartRadiosControl;
var RadiosControlRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(RadiosControlRenderer, _super);
    function RadiosControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RadiosControlRenderer.defaultProps = {
        multiple: false
    };
    RadiosControlRenderer = (0, tslib_1.__decorate)([
        (0, Options_1.OptionsControl)({
            type: 'chart-radios',
            sizeMutable: false
        })
    ], RadiosControlRenderer);
    return RadiosControlRenderer;
}(ChartRadiosControl));
exports.RadiosControlRenderer = RadiosControlRenderer;
//# sourceMappingURL=./renderers/Form/ChartRadios.js.map
