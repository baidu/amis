"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YearControlRenderer = exports.QuarterControlRenderer = exports.MonthControlRenderer = exports.TimeControlRenderer = exports.DatetimeControlRenderer = exports.DateControlRenderer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var Item_1 = require("./Item");
var tpl_builtin_1 = require("../../utils/tpl-builtin");
var moment_1 = (0, tslib_1.__importDefault)(require("moment"));
require("moment/locale/zh-cn");
var DatePicker_1 = tslib_1.__importStar(require("../../components/DatePicker"));
var helper_1 = require("../../utils/helper");
var DateControl = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(DateControl, _super);
    function DateControl(props) {
        var _this = _super.call(this, props) || this;
        var minDate = props.minDate, maxDate = props.maxDate, value = props.value, defaultValue = props.defaultValue, setPrinstineValue = props.setPrinstineValue, data = props.data, format = props.format, utc = props.utc;
        if (defaultValue && value === defaultValue) {
            var date = (0, tpl_builtin_1.filterDate)(defaultValue, data, format);
            setPrinstineValue((utc ? moment_1.default.utc(date) : date).format(format));
        }
        var schedulesData = props.schedules;
        if (typeof schedulesData === 'string') {
            var resolved = (0, tpl_builtin_1.resolveVariableAndFilter)(schedulesData, data, '| raw');
            if (Array.isArray(resolved)) {
                schedulesData = resolved;
            }
        }
        _this.state = {
            minDate: minDate ? (0, tpl_builtin_1.filterDate)(minDate, data, format) : undefined,
            maxDate: maxDate ? (0, tpl_builtin_1.filterDate)(maxDate, data, format) : undefined,
            schedules: schedulesData
        };
        return _this;
    }
    DateControl.prototype.componentDidUpdate = function (prevProps) {
        var props = this.props;
        if (prevProps.defaultValue !== props.defaultValue) {
            var date = (0, tpl_builtin_1.filterDate)(props.defaultValue, props.data, props.format);
            props.setPrinstineValue((props.utc ? moment_1.default.utc(date) : date).format(props.format));
        }
        if (prevProps.minDate !== props.minDate ||
            prevProps.maxDate !== props.maxDate ||
            prevProps.data !== props.data) {
            this.setState({
                minDate: props.minDate
                    ? (0, tpl_builtin_1.filterDate)(props.minDate, props.data, this.props.format)
                    : undefined,
                maxDate: props.maxDate
                    ? (0, tpl_builtin_1.filterDate)(props.maxDate, props.data, this.props.format)
                    : undefined
            });
        }
        if ((0, helper_1.anyChanged)(['schedules', 'data'], prevProps, props) &&
            typeof props.schedules === 'string' &&
            (0, tpl_builtin_1.isPureVariable)(props.schedules)) {
            var schedulesData = (0, tpl_builtin_1.resolveVariableAndFilter)(props.schedules, props.data, '| raw');
            var preSchedulesData = (0, tpl_builtin_1.resolveVariableAndFilter)(prevProps.schedules, prevProps.data, '| raw');
            if (Array.isArray(schedulesData) && preSchedulesData !== schedulesData) {
                this.setState({
                    schedules: schedulesData
                });
            }
        }
    };
    // 日程点击事件
    DateControl.prototype.onScheduleClick = function (scheduleData) {
        var _a = this.props, scheduleAction = _a.scheduleAction, onAction = _a.onAction, data = _a.data, __ = _a.translate;
        var defaultscheduleAction = {
            actionType: 'dialog',
            dialog: {
                title: __('Schedule'),
                actions: [],
                body: {
                    type: 'table',
                    columns: [
                        {
                            name: 'time',
                            label: __('Time')
                        },
                        {
                            name: 'content',
                            label: __('Content')
                        }
                    ],
                    data: '${scheduleData}'
                }
            }
        };
        onAction &&
            onAction(null, scheduleAction || defaultscheduleAction, (0, helper_1.createObject)(data, scheduleData));
    };
    DateControl.prototype.getRef = function (ref) {
        this.dateRef = ref;
    };
    // 派发有event的事件
    DateControl.prototype.dispatchEvent = function (e) {
        var _a = this.props, dispatchEvent = _a.dispatchEvent, data = _a.data;
        dispatchEvent(e, data);
    };
    // 动作
    DateControl.prototype.doAction = function (action, data, throwErrors) {
        var _a, _b;
        var resetValue = this.props.resetValue;
        if (action.actionType === 'clear') {
            (_a = this.dateRef) === null || _a === void 0 ? void 0 : _a.clear();
            return;
        }
        if (action.actionType === 'reset' && resetValue) {
            (_b = this.dateRef) === null || _b === void 0 ? void 0 : _b.reset(resetValue);
        }
    };
    // 值的变化
    DateControl.prototype.handleChange = function (nextValue) {
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
    DateControl.prototype.render = function () {
        var _a = this.props, className = _a.className, defaultValue = _a.defaultValue, defaultData = _a.defaultData, cx = _a.classnames, minDate = _a.minDate, maxDate = _a.maxDate, type = _a.type, format = _a.format, timeFormat = _a.timeFormat, valueFormat = _a.valueFormat, env = _a.env, largeMode = _a.largeMode, render = _a.render, useMobileUI = _a.useMobileUI, rest = (0, tslib_1.__rest)(_a, ["className", "defaultValue", "defaultData", "classnames", "minDate", "maxDate", "type", "format", "timeFormat", "valueFormat", "env", "largeMode", "render", "useMobileUI"]);
        var mobileUI = useMobileUI && (0, helper_1.isMobile)();
        if (type === 'time' && timeFormat) {
            format = timeFormat;
        }
        return (react_1.default.createElement("div", { className: cx("DateControl", {
                'is-date': /date$/.test(type),
                'is-datetime': /datetime$/.test(type)
            }, className) },
            react_1.default.createElement(DatePicker_1.default, (0, tslib_1.__assign)({}, rest, { useMobileUI: useMobileUI, popOverContainer: mobileUI && env && env.getModalContainer
                    ? env.getModalContainer
                    : mobileUI
                        ? undefined
                        : rest.popOverContainer, timeFormat: timeFormat, format: valueFormat || format }, this.state, { classnames: cx, onRef: this.getRef, schedules: this.state.schedules, largeMode: largeMode, onScheduleClick: this.onScheduleClick.bind(this), onChange: this.handleChange, onFocus: this.dispatchEvent, onBlur: this.dispatchEvent }))));
    };
    var _a, _b;
    DateControl.defaultProps = {
        format: 'X',
        viewMode: 'days',
        inputFormat: 'YYYY-MM-DD',
        timeConstraints: {
            minutes: {
                step: 1
            }
        },
        clearable: true
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof DatePicker_1.DatePicker !== "undefined" && DatePicker_1.DatePicker) === "function" ? _a : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], DateControl.prototype, "getRef", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_b = typeof react_1.default !== "undefined" && react_1.default.SyntheticEvent) === "function" ? _b : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], DateControl.prototype, "dispatchEvent", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", Promise)
    ], DateControl.prototype, "handleChange", null);
    return DateControl;
}(react_1.default.PureComponent));
exports.default = DateControl;
var DateControlRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(DateControlRenderer, _super);
    function DateControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DateControlRenderer.defaultProps = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, DateControl.defaultProps), { placeholder: 'Date.placeholder', dateFormat: 'YYYY-MM-DD', timeFormat: '', strictMode: false });
    DateControlRenderer = (0, tslib_1.__decorate)([
        (0, Item_1.FormItem)({
            type: 'input-date',
            weight: -150
        })
    ], DateControlRenderer);
    return DateControlRenderer;
}(DateControl));
exports.DateControlRenderer = DateControlRenderer;
var DatetimeControlRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(DatetimeControlRenderer, _super);
    function DatetimeControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DatetimeControlRenderer.defaultProps = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, DateControl.defaultProps), { placeholder: 'DateTime.placeholder', inputFormat: 'YYYY-MM-DD HH:mm:ss', dateFormat: 'LL', timeFormat: 'HH:mm:ss', closeOnSelect: false, strictMode: false });
    DatetimeControlRenderer = (0, tslib_1.__decorate)([
        (0, Item_1.FormItem)({
            type: 'input-datetime'
        })
    ], DatetimeControlRenderer);
    return DatetimeControlRenderer;
}(DateControl));
exports.DatetimeControlRenderer = DatetimeControlRenderer;
var TimeControlRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(TimeControlRenderer, _super);
    function TimeControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TimeControlRenderer.defaultProps = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, DateControl.defaultProps), { placeholder: 'Time.placeholder', inputFormat: 'HH:mm', dateFormat: '', timeFormat: 'HH:mm', viewMode: 'time', closeOnSelect: false });
    TimeControlRenderer = (0, tslib_1.__decorate)([
        (0, Item_1.FormItem)({
            type: 'input-time'
        })
    ], TimeControlRenderer);
    return TimeControlRenderer;
}(DateControl));
exports.TimeControlRenderer = TimeControlRenderer;
var MonthControlRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(MonthControlRenderer, _super);
    function MonthControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MonthControlRenderer.defaultProps = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, DateControl.defaultProps), { placeholder: 'Month.placeholder', inputFormat: 'YYYY-MM', dateFormat: 'MM', timeFormat: '', viewMode: 'months', closeOnSelect: true });
    MonthControlRenderer = (0, tslib_1.__decorate)([
        (0, Item_1.FormItem)({
            type: 'input-month'
        })
    ], MonthControlRenderer);
    return MonthControlRenderer;
}(DateControl));
exports.MonthControlRenderer = MonthControlRenderer;
var QuarterControlRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(QuarterControlRenderer, _super);
    function QuarterControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    QuarterControlRenderer.defaultProps = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, DateControl.defaultProps), { placeholder: 'Quarter.placeholder', inputFormat: 'YYYY [Q]Q', dateFormat: 'YYYY [Q]Q', timeFormat: '', viewMode: 'quarters', closeOnSelect: true });
    QuarterControlRenderer = (0, tslib_1.__decorate)([
        (0, Item_1.FormItem)({
            type: 'input-quarter'
        })
    ], QuarterControlRenderer);
    return QuarterControlRenderer;
}(DateControl));
exports.QuarterControlRenderer = QuarterControlRenderer;
var YearControlRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(YearControlRenderer, _super);
    function YearControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    YearControlRenderer.defaultProps = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, DateControl.defaultProps), { placeholder: 'Year.placeholder', inputFormat: 'YYYY', dateFormat: 'YYYY', timeFormat: '', viewMode: 'years', closeOnSelect: true });
    YearControlRenderer = (0, tslib_1.__decorate)([
        (0, Item_1.FormItem)({
            type: 'input-year'
        })
    ], YearControlRenderer);
    return YearControlRenderer;
}(DateControl));
exports.YearControlRenderer = YearControlRenderer;
//# sourceMappingURL=./renderers/Form/InputDate.js.map
