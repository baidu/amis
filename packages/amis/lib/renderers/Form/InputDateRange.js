"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeRangeControlRenderer = exports.DateTimeRangeControlRenderer = exports.DateRangeControlRenderer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var Item_1 = require("./Item");
var classnames_1 = (0, tslib_1.__importDefault)(require("classnames"));
var tpl_builtin_1 = require("../../utils/tpl-builtin");
require("moment/locale/zh-cn");
var DateRangePicker_1 = tslib_1.__importStar(require("../../components/DateRangePicker"));
var helper_1 = require("../../utils/helper");
var DateRangeControl = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(DateRangeControl, _super);
    function DateRangeControl(props) {
        var _this = _super.call(this, props) || this;
        var defaultValue = props.defaultValue, setPrinstineValue = props.setPrinstineValue, delimiter = props.delimiter, format = props.format, data = props.data, value = props.value, joinValues = props.joinValues, utc = props.utc;
        if (defaultValue && value === defaultValue) {
            var arr = typeof defaultValue === 'string'
                ? defaultValue.split(delimiter)
                : defaultValue;
            setPrinstineValue(DateRangePicker_1.DateRangePicker.formatValue({
                startDate: (0, tpl_builtin_1.filterDate)(arr[0], data, format),
                endDate: (0, tpl_builtin_1.filterDate)(arr[1], data, format)
            }, format, joinValues, delimiter, utc));
        }
        return _this;
    }
    DateRangeControl.prototype.componentDidUpdate = function (prevProps) {
        var _a = this.props, defaultValue = _a.defaultValue, delimiter = _a.delimiter, joinValues = _a.joinValues, setPrinstineValue = _a.setPrinstineValue, data = _a.data, utc = _a.utc, format = _a.format;
        if (prevProps.defaultValue !== defaultValue) {
            var arr = typeof defaultValue === 'string'
                ? defaultValue.split(delimiter)
                : defaultValue;
            setPrinstineValue(arr
                ? DateRangePicker_1.DateRangePicker.formatValue({
                    startDate: (0, tpl_builtin_1.filterDate)(arr[0], data, format),
                    endDate: (0, tpl_builtin_1.filterDate)(arr[1], data, format)
                }, format, joinValues, delimiter, utc)
                : undefined);
        }
    };
    DateRangeControl.prototype.getRef = function (ref) {
        this.dateRef = ref;
    };
    // 派发有event的事件
    DateRangeControl.prototype.dispatchEvent = function (eventName) {
        var _a = this.props, dispatchEvent = _a.dispatchEvent, data = _a.data, value = _a.value;
        dispatchEvent(eventName, (0, helper_1.createObject)(data, {
            value: value
        }));
    };
    // 动作
    DateRangeControl.prototype.doAction = function (action, data, throwErrors) {
        var _a, _b;
        var resetValue = this.props.resetValue;
        if (action.actionType === 'clear') {
            (_a = this.dateRef) === null || _a === void 0 ? void 0 : _a.clear();
            return;
        }
        if (action.actionType === 'reset' && resetValue) {
            (_b = this.dateRef) === null || _b === void 0 ? void 0 : _b.reset();
        }
    };
    // 值的变化
    DateRangeControl.prototype.handleChange = function (nextValue) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var _a, dispatchEvent, data, dispatcher;
            return (0, tslib_1.__generator)(this, function (_b) {
                _a = this.props, dispatchEvent = _a.dispatchEvent, data = _a.data;
                dispatcher = dispatchEvent('change', (0, helper_1.createObject)(data, { value: nextValue }));
                if (dispatcher === null || dispatcher === void 0 ? void 0 : dispatcher.prevented) {
                    return [2 /*return*/];
                }
                this.props.onChange(nextValue);
                return [2 /*return*/];
            });
        });
    };
    DateRangeControl.prototype.render = function () {
        var _this = this;
        var _a;
        var _b = this.props, className = _b.className, ns = _b.classPrefix, defaultValue = _b.defaultValue, defaultData = _b.defaultData, minDate = _b.minDate, maxDate = _b.maxDate, minDuration = _b.minDuration, maxDuration = _b.maxDuration, data = _b.data, format = _b.format, env = _b.env, useMobileUI = _b.useMobileUI, rest = (0, tslib_1.__rest)(_b, ["className", "classPrefix", "defaultValue", "defaultData", "minDate", "maxDate", "minDuration", "maxDuration", "data", "format", "env", "useMobileUI"]);
        var mobileUI = useMobileUI && (0, helper_1.isMobile)();
        var comptType = (_a = this.props) === null || _a === void 0 ? void 0 : _a.type;
        return (react_1.default.createElement("div", { className: (0, classnames_1.default)("".concat(ns, "DateRangeControl"), {
                'is-date': /date-/.test(comptType),
                'is-datetime': /datetime-/.test(comptType)
            }, className) },
            react_1.default.createElement(DateRangePicker_1.default, (0, tslib_1.__assign)({}, rest, { useMobileUI: useMobileUI, classPrefix: ns, popOverContainer: mobileUI && env && env.getModalContainer
                    ? env.getModalContainer
                    : mobileUI
                        ? undefined
                        : rest.popOverContainer, onRef: this.getRef, data: data, format: format, minDate: minDate ? (0, tpl_builtin_1.filterDate)(minDate, data, format) : undefined, maxDate: maxDate ? (0, tpl_builtin_1.filterDate)(maxDate, data, format) : undefined, minDuration: minDuration ? (0, tpl_builtin_1.parseDuration)(minDuration) : undefined, maxDuration: maxDuration ? (0, tpl_builtin_1.parseDuration)(maxDuration) : undefined, onChange: this.handleChange, onFocus: function () { return _this.dispatchEvent('focus'); }, onBlur: function () { return _this.dispatchEvent('blur'); } }))));
    };
    var _a;
    DateRangeControl.defaultProps = {
        format: 'X',
        joinValues: true,
        delimiter: ','
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof DateRangePicker_1.DateRangePicker !== "undefined" && DateRangePicker_1.DateRangePicker) === "function" ? _a : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], DateRangeControl.prototype, "getRef", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [String]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], DateRangeControl.prototype, "dispatchEvent", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", Promise)
    ], DateRangeControl.prototype, "handleChange", null);
    return DateRangeControl;
}(react_1.default.Component));
exports.default = DateRangeControl;
var DateRangeControlRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(DateRangeControlRenderer, _super);
    function DateRangeControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DateRangeControlRenderer.defaultProps = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, DateRangeControl.defaultProps), { timeFormat: '' });
    DateRangeControlRenderer = (0, tslib_1.__decorate)([
        (0, Item_1.FormItem)({
            type: 'input-date-range'
        })
    ], DateRangeControlRenderer);
    return DateRangeControlRenderer;
}(DateRangeControl));
exports.DateRangeControlRenderer = DateRangeControlRenderer;
var DateTimeRangeControlRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(DateTimeRangeControlRenderer, _super);
    function DateTimeRangeControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DateTimeRangeControlRenderer.defaultProps = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, DateRangeControl.defaultProps), { timeFormat: 'HH:mm', inputFormat: 'YYYY-MM-DD HH:mm' });
    DateTimeRangeControlRenderer = (0, tslib_1.__decorate)([
        (0, Item_1.FormItem)({
            type: 'input-datetime-range',
            sizeMutable: false
        })
    ], DateTimeRangeControlRenderer);
    return DateTimeRangeControlRenderer;
}(DateRangeControl));
exports.DateTimeRangeControlRenderer = DateTimeRangeControlRenderer;
var TimeRangeControlRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(TimeRangeControlRenderer, _super);
    function TimeRangeControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TimeRangeControlRenderer.defaultProps = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, DateRangeControl.defaultProps), { format: 'HH:mm', timeFormat: 'HH:mm', inputFormat: 'HH:mm', viewMode: 'time', ranges: '' });
    TimeRangeControlRenderer = (0, tslib_1.__decorate)([
        (0, Item_1.FormItem)({
            type: 'input-time-range',
            sizeMutable: false
        })
    ], TimeRangeControlRenderer);
    return TimeRangeControlRenderer;
}(DateRangeControl));
exports.TimeRangeControlRenderer = TimeRangeControlRenderer;
//# sourceMappingURL=./renderers/Form/InputDateRange.js.map
