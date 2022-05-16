"use strict";
/**
 * @file DateRangePicker
 * @description 自定义日期范围时间选择器组件
 * @author fex
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateRangePicker = exports.advancedRanges = exports.availableRanges = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var moment_1 = (0, tslib_1.__importDefault)(require("moment"));
var react_dom_1 = require("react-dom");
var icons_1 = require("./icons");
var Overlay_1 = (0, tslib_1.__importDefault)(require("./Overlay"));
var Calendar_1 = (0, tslib_1.__importDefault)(require("./calendar/Calendar"));
var PopOver_1 = (0, tslib_1.__importDefault)(require("./PopOver"));
var PopUp_1 = (0, tslib_1.__importDefault)(require("./PopUp"));
var theme_1 = require("../theme");
var helper_1 = require("../utils/helper");
var locale_1 = require("../locale");
var CalendarMobile_1 = (0, tslib_1.__importDefault)(require("./CalendarMobile"));
var Input_1 = (0, tslib_1.__importDefault)(require("./Input"));
exports.availableRanges = {
    'today': {
        label: 'Date.today',
        startDate: function (now) {
            return now.startOf('day');
        },
        endDate: function (now) {
            return now;
        }
    },
    'yesterday': {
        label: 'Date.yesterday',
        startDate: function (now) {
            return now.add(-1, 'days').startOf('day');
        },
        endDate: function (now) {
            return now.add(-1, 'days').endOf('day');
        }
    },
    'tomorrow': {
        label: 'Date.tomorrow',
        startDate: function (now) {
            return now.add(1, 'days').startOf('day');
        },
        endDate: function (now) {
            return now.add(1, 'days').endOf('day');
        }
    },
    // 兼容一下错误的用法
    '1daysago': {
        label: 'DateRange.1daysago',
        startDate: function (now) {
            return now.add(-1, 'days');
        },
        endDate: function (now) {
            return now;
        }
    },
    '1dayago': {
        label: 'DateRange.1daysago',
        startDate: function (now) {
            return now.add(-1, 'days');
        },
        endDate: function (now) {
            return now;
        }
    },
    '7daysago': {
        label: 'DateRange.7daysago',
        startDate: function (now) {
            return now.add(-7, 'days').startOf('day');
        },
        endDate: function (now) {
            return now.add(-1, 'days').endOf('day');
        }
    },
    '30daysago': {
        label: 'DateRange.30daysago',
        startDate: function (now) {
            return now.add(-30, 'days').startOf('day');
        },
        endDate: function (now) {
            return now.add(-1, 'days').endOf('day');
        }
    },
    '90daysago': {
        label: 'DateRange.90daysago',
        startDate: function (now) {
            return now.add(-90, 'days').startOf('day');
        },
        endDate: function (now) {
            return now.add(-1, 'days').endOf('day');
        }
    },
    'prevweek': {
        label: 'DateRange.lastWeek',
        startDate: function (now) {
            return now.startOf('week').add(-1, 'weeks');
        },
        endDate: function (now) {
            return now.startOf('week').add(-1, 'days').endOf('day');
        }
    },
    'thisweek': {
        label: 'DateRange.thisWeek',
        startDate: function (now) {
            return now.startOf('week');
        },
        endDate: function (now) {
            return now.endOf('week');
        }
    },
    'thismonth': {
        label: 'DateRange.thisMonth',
        startDate: function (now) {
            return now.startOf('month');
        },
        endDate: function (now) {
            return now.endOf('month');
        }
    },
    'thisquarter': {
        label: 'DateRange.thisQuarter',
        startDate: function (now) {
            return now.startOf('quarter');
        },
        endDate: function (now) {
            return now.endOf('quarter');
        }
    },
    'prevmonth': {
        label: 'DateRange.lastMonth',
        startDate: function (now) {
            return now.startOf('month').add(-1, 'month');
        },
        endDate: function (now) {
            return now.startOf('month').add(-1, 'day').endOf('day');
        }
    },
    'prevquarter': {
        label: 'DateRange.lastQuarter',
        startDate: function (now) {
            return now.startOf('quarter').add(-1, 'quarter');
        },
        endDate: function (now) {
            return now.startOf('quarter').add(-1, 'day').endOf('day');
        }
    },
    'thisyear': {
        label: 'DateRange.thisYear',
        startDate: function (now) {
            return now.startOf('year');
        },
        endDate: function (now) {
            return now.endOf('year');
        }
    },
    // 兼容一下之前的用法 'lastYear'
    'prevyear': {
        label: 'DateRange.lastYear',
        startDate: function (now) {
            return now.startOf('year').add(-1, 'year');
        },
        endDate: function (now) {
            return now.endOf('year').add(-1, 'year').endOf('day');
        }
    },
    'lastYear': {
        label: 'DateRange.lastYear',
        startDate: function (now) {
            return now.startOf('year').add(-1, 'year');
        },
        endDate: function (now) {
            return now.endOf('year').add(-1, 'year').endOf('day');
        }
    }
};
exports.advancedRanges = [
    {
        regexp: /^(\d+)hoursago$/,
        resolve: function (__, _, hours) {
            return {
                label: __('DateRange.hoursago', { hours: hours }),
                startDate: function (now) {
                    return now.add(-hours, 'hours').startOf('hour');
                },
                endDate: function (now) {
                    return now.add(-1, 'hours').endOf('hours');
                }
            };
        }
    },
    {
        regexp: /^(\d+)hourslater$/,
        resolve: function (__, _, hours) {
            return {
                label: __('DateRange.hourslater', { hours: hours }),
                startDate: function (now) {
                    return now.startOf('hour');
                },
                endDate: function (now) {
                    return now.add(hours, 'hours').endOf('hour');
                }
            };
        }
    },
    {
        regexp: /^(\d+)daysago$/,
        resolve: function (__, _, days) {
            return {
                label: __('DateRange.daysago', { days: days }),
                startDate: function (now) {
                    return now.add(-days, 'days').startOf('day');
                },
                endDate: function (now) {
                    return now.add(-1, 'days').endOf('day');
                }
            };
        }
    },
    {
        regexp: /^(\d+)dayslater$/,
        resolve: function (__, _, days) {
            return {
                label: __('DateRange.dayslater', { days: days }),
                startDate: function (now) {
                    return now.startOf('day');
                },
                endDate: function (now) {
                    return now.add(days, 'days').endOf('day');
                }
            };
        }
    },
    {
        regexp: /^(\d+)weeksago$/,
        resolve: function (__, _, weeks) {
            return {
                label: __('DateRange.weeksago', { weeks: weeks }),
                startDate: function (now) {
                    return now.startOf('week').add(-weeks, 'weeks');
                },
                endDate: function (now) {
                    return now.startOf('week').add(-1, 'days').endOf('day');
                }
            };
        }
    },
    {
        regexp: /^(\d+)weekslater$/,
        resolve: function (__, _, weeks) {
            return {
                label: __('DateRange.weekslater', { weeks: weeks }),
                startDate: function (now) {
                    return now.startOf('week');
                },
                endDate: function (now) {
                    return now.startOf('week').add(weeks, 'weeks').endOf('day');
                }
            };
        }
    },
    {
        regexp: /^(\d+)monthsago$/,
        resolve: function (__, _, months) {
            return {
                label: __('DateRange.monthsago', { months: months }),
                startDate: function (now) {
                    return now.startOf('months').add(-months, 'months');
                },
                endDate: function (now) {
                    return now.startOf('month').add(-1, 'days').endOf('day');
                }
            };
        }
    },
    {
        regexp: /^(\d+)monthslater$/,
        resolve: function (__, _, months) {
            return {
                label: __('DateRange.monthslater', { months: months }),
                startDate: function (now) {
                    return now.startOf('month');
                },
                endDate: function (now) {
                    return now.startOf('month').add(months, 'months').endOf('day');
                }
            };
        }
    },
    {
        regexp: /^(\d+)quartersago$/,
        resolve: function (__, _, quarters) {
            return {
                label: __('DateRange.quartersago', { quarters: quarters }),
                startDate: function (now) {
                    return now.startOf('quarters').add(-quarters, 'quarters');
                },
                endDate: function (now) {
                    return now.startOf('quarter').add(-1, 'days').endOf('day');
                }
            };
        }
    },
    {
        regexp: /^(\d+)quarterslater$/,
        resolve: function (__, _, quarters) {
            return {
                label: __('DateRange.quarterslater', { quarters: quarters }),
                startDate: function (now) {
                    return now.startOf('quarter');
                },
                endDate: function (now) {
                    return now.startOf('quarter').add(quarters, 'quarters').endOf('day');
                }
            };
        }
    },
    {
        regexp: /^(\d+)yearsago$/,
        resolve: function (__, _, years) {
            return {
                label: __('DateRange.yearsago', { years: years }),
                startDate: function (now) {
                    return now.startOf('years').add(-years, 'years');
                },
                endDate: function (now) {
                    return now.startOf('year').add(-1, 'days').endOf('day');
                }
            };
        }
    },
    {
        regexp: /^(\d+)yearslater$/,
        resolve: function (__, _, years) {
            return {
                label: __('DateRange.yearslater', { years: years }),
                startDate: function (now) {
                    return now.startOf('year');
                },
                endDate: function (now) {
                    return now.startOf('year').add(years, 'years').endOf('day');
                }
            };
        }
    }
];
var DateRangePicker = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(DateRangePicker, _super);
    function DateRangePicker(props) {
        var _this = _super.call(this, props) || this;
        // 是否是第一次点击，如果是第一次点击就可以点任意地址
        _this.isFirstClick = true;
        _this.nextMonth = (0, moment_1.default)().add(1, 'months');
        _this.startInputRef = react_1.default.createRef();
        _this.endInputRef = react_1.default.createRef();
        _this.calendarRef = react_1.default.createRef();
        _this.open = _this.open.bind(_this);
        _this.openStart = _this.openStart.bind(_this);
        _this.openEnd = _this.openEnd.bind(_this);
        _this.close = _this.close.bind(_this);
        _this.startInputChange = _this.startInputChange.bind(_this);
        _this.endInputChange = _this.endInputChange.bind(_this);
        _this.handleDateChange = _this.handleDateChange.bind(_this);
        _this.handleStartDateChange = _this.handleStartDateChange.bind(_this);
        _this.handeleEndDateChange = _this.handeleEndDateChange.bind(_this);
        _this.handleTimeStartChange = _this.handleTimeStartChange.bind(_this);
        _this.handleTimeEndChange = _this.handleTimeEndChange.bind(_this);
        _this.handleFocus = _this.handleFocus.bind(_this);
        _this.handleBlur = _this.handleBlur.bind(_this);
        _this.checkStartIsValidDate = _this.checkStartIsValidDate.bind(_this);
        _this.checkEndIsValidDate = _this.checkEndIsValidDate.bind(_this);
        _this.confirm = _this.confirm.bind(_this);
        _this.clearValue = _this.clearValue.bind(_this);
        _this.dom = react_1.default.createRef();
        _this.handleClick = _this.handleClick.bind(_this);
        _this.handleKeyPress = _this.handleKeyPress.bind(_this);
        _this.handlePopOverClick = _this.handlePopOverClick.bind(_this);
        _this.renderDay = _this.renderDay.bind(_this);
        _this.renderMonth = _this.renderMonth.bind(_this);
        _this.renderQuarter = _this.renderQuarter.bind(_this);
        _this.renderYear = _this.renderYear.bind(_this);
        _this.handleMobileChange = _this.handleMobileChange.bind(_this);
        _this.handleOutClick = _this.handleOutClick.bind(_this);
        var _a = _this.props, format = _a.format, joinValues = _a.joinValues, delimiter = _a.delimiter, value = _a.value, inputFormat = _a.inputFormat;
        var _b = DateRangePicker.unFormatValue(value, format, joinValues, delimiter), startDate = _b.startDate, endDate = _b.endDate;
        _this.state = {
            isOpened: false,
            isFocused: false,
            editState: 'start',
            startDate: startDate,
            endDate: endDate,
            startInputValue: startDate === null || startDate === void 0 ? void 0 : startDate.format(inputFormat),
            endInputValue: endDate === null || endDate === void 0 ? void 0 : endDate.format(inputFormat)
        };
        return _this;
    }
    DateRangePicker.formatValue = function (newValue, format, joinValues, delimiter, utc) {
        if (utc === void 0) { utc = false; }
        newValue = [
            (utc ? moment_1.default.utc(newValue.startDate) : newValue.startDate).format(format),
            (utc ? moment_1.default.utc(newValue.endDate) : newValue.endDate).format(format)
        ];
        if (joinValues) {
            newValue = newValue.join(delimiter);
        }
        return newValue;
    };
    DateRangePicker.unFormatValue = function (value, format, joinValues, delimiter) {
        if (!value) {
            return {
                startDate: undefined,
                endDate: undefined
            };
        }
        if (joinValues && typeof value === 'string') {
            value = value.split(delimiter);
        }
        return {
            startDate: value[0] ? (0, moment_1.default)(value[0], format) : undefined,
            endDate: value[1] ? (0, moment_1.default)(value[1], format) : undefined
        };
    };
    DateRangePicker.prototype.componentDidMount = function () {
        var _a, _b;
        document.body.addEventListener('click', this.handleOutClick, true);
        (_b = (_a = this.props) === null || _a === void 0 ? void 0 : _a.onRef) === null || _b === void 0 ? void 0 : _b.call(_a, this);
    };
    DateRangePicker.prototype.componentWillUnmount = function () {
        document.body.removeEventListener('click', this.handleOutClick, true);
    };
    DateRangePicker.prototype.handleOutClick = function (e) {
        if (!e.target ||
            !this.dom.current ||
            this.dom.current.contains(e.target) ||
            !this.calendarRef.current ||
            this.calendarRef.current.contains(e.target)) {
            return;
        }
        if (this.state.isOpened) {
            e.preventDefault();
            this.close();
        }
    };
    DateRangePicker.prototype.componentDidUpdate = function (prevProps) {
        var props = this.props;
        var value = props.value, format = props.format, joinValues = props.joinValues, inputFormat = props.inputFormat, delimiter = props.delimiter;
        if (prevProps.value !== value) {
            var _a = DateRangePicker.unFormatValue(value, format, joinValues, delimiter), startDate = _a.startDate, endDate = _a.endDate;
            this.setState({
                startDate: startDate,
                endDate: endDate,
                startInputValue: startDate === null || startDate === void 0 ? void 0 : startDate.format(inputFormat),
                endInputValue: endDate === null || endDate === void 0 ? void 0 : endDate.format(inputFormat)
            });
        }
    };
    DateRangePicker.prototype.focus = function () {
        if (!this.dom.current || this.props.disabled) {
            return;
        }
        this.dom.current.focus();
    };
    DateRangePicker.prototype.blur = function () {
        if (!this.dom.current || this.props.disabled) {
            return;
        }
        this.dom.current.blur();
    };
    DateRangePicker.prototype.handleFocus = function (e) {
        this.setState({
            isFocused: true
        });
        var onFocus = this.props.onFocus;
        onFocus && onFocus(e);
    };
    DateRangePicker.prototype.handleBlur = function (e) {
        this.setState({
            isFocused: false
        });
        var onBlur = this.props.onBlur;
        onBlur && onBlur(e);
    };
    DateRangePicker.prototype.open = function () {
        if (this.props.disabled) {
            return;
        }
        this.setState({
            isOpened: true
        });
    };
    DateRangePicker.prototype.openStart = function () {
        if (this.props.disabled) {
            return;
        }
        this.setState({
            isOpened: true,
            editState: 'start'
        });
    };
    DateRangePicker.prototype.openEnd = function () {
        if (this.props.disabled) {
            return;
        }
        this.setState({
            isOpened: true,
            editState: 'end'
        });
    };
    DateRangePicker.prototype.close = function () {
        this.setState({
            isOpened: false,
            editState: undefined
        }, this.blur);
    };
    DateRangePicker.prototype.handleClick = function () {
        this.state.isOpened ? this.close() : this.open();
    };
    DateRangePicker.prototype.handlePopOverClick = function (e) {
        e.stopPropagation();
        e.preventDefault();
    };
    DateRangePicker.prototype.handleKeyPress = function (e) {
        if (e.key === ' ') {
            this.handleClick();
            e.preventDefault();
        }
    };
    DateRangePicker.prototype.confirm = function () {
        if (!this.state.startDate || !this.state.endDate) {
            return;
        }
        else if (this.state.startDate.isAfter(this.state.endDate)) {
            return;
        }
        this.props.onChange(DateRangePicker.formatValue({
            startDate: this.state.startDate,
            endDate: this.state.endDate
        }, this.props.format, this.props.joinValues, this.props.delimiter, this.props.utc));
        this.close();
    };
    DateRangePicker.prototype.filterDate = function (date, originValue, timeFormat, type) {
        if (type === void 0) { type = 'start'; }
        var value = date.clone();
        // 没有初始值
        if (!originValue) {
            value = value[type === 'start' ? 'startOf' : 'endOf']('day');
        }
        else if (typeof timeFormat === 'string' && /ss/.test(timeFormat)) {
            value = value[type === 'start' ? 'startOf' : 'endOf']('second');
        }
        else if (typeof timeFormat === 'string' && /mm/.test(timeFormat)) {
            value = value[type === 'start' ? 'startOf' : 'endOf']('minute');
        }
        else if (typeof timeFormat === 'string' && /HH/i.test(timeFormat)) {
            value = value[type === 'start' ? 'startOf' : 'endOf']('hour');
        }
        else if (typeof timeFormat === 'string' && /Q/i.test(timeFormat)) {
            value = value[type === 'start' ? 'startOf' : 'endOf']('quarter');
        }
        else {
            value = value[type === 'start' ? 'startOf' : 'endOf']('day');
        }
        return value;
    };
    DateRangePicker.prototype.handleDateChange = function (newValue) {
        var editState = this.state.editState;
        if (editState === 'start') {
            this.handleStartDateChange(newValue);
        }
        else if (editState === 'end') {
            this.handeleEndDateChange(newValue);
        }
    };
    DateRangePicker.prototype.handleStartDateChange = function (newValue) {
        var _a = this.props, timeFormat = _a.timeFormat, minDate = _a.minDate, inputFormat = _a.inputFormat, type = _a.type;
        var startDate = this.state.startDate;
        if (minDate && newValue.isBefore(minDate)) {
            newValue = minDate;
        }
        var date = this.filterDate(newValue, startDate || minDate, timeFormat, 'start');
        var newState = {
            startDate: date,
            startInputValue: date.format(inputFormat)
        };
        // 这些没有时间的选择点第一次后第二次就是选结束时间
        if (type === 'input-date-range' ||
            type === 'input-year-range' ||
            type === 'input-quarter-range' ||
            type === 'input-month-range') {
            newState.editState = 'end';
        }
        this.setState(newState);
    };
    DateRangePicker.prototype.handeleEndDateChange = function (newValue) {
        var _this = this;
        var _a = this.props, embed = _a.embed, timeFormat = _a.timeFormat, inputFormat = _a.inputFormat;
        var _b = this.state, startDate = _b.startDate, endDate = _b.endDate;
        newValue = this.getEndDateByDuration(newValue);
        // 如果结束时间在前面，需要清空开始时间
        if (newValue.isBefore(startDate)) {
            this.setState({
                startDate: undefined,
                startInputValue: ''
            });
        }
        var date = this.filterDate(newValue, endDate, timeFormat, 'end');
        this.setState({
            endDate: date,
            endInputValue: date.format(inputFormat)
        }, function () {
            embed && _this.confirm();
        });
    };
    // 手动控制输入时间
    DateRangePicker.prototype.startInputChange = function (e) {
        var _a = this.props, onChange = _a.onChange, inputFormat = _a.inputFormat, format = _a.format, utc = _a.utc;
        var value = e.currentTarget.value;
        this.setState({ startInputValue: value });
        if (value === '') {
            onChange('');
        }
        else {
            var newDate = this.getStartDateByDuration((0, moment_1.default)(value, inputFormat));
            this.setState({ startDate: newDate });
        }
    };
    DateRangePicker.prototype.endInputChange = function (e) {
        var _a = this.props, onChange = _a.onChange, inputFormat = _a.inputFormat, format = _a.format, utc = _a.utc;
        var value = e.currentTarget.value;
        this.setState({ endInputValue: value });
        if (value === '') {
            onChange('');
        }
        else {
            var newDate = this.getEndDateByDuration((0, moment_1.default)(value, inputFormat));
            this.setState({ endDate: newDate });
        }
    };
    // 根据 duration 修复结束时间
    DateRangePicker.prototype.getEndDateByDuration = function (newValue) {
        var _a = this.props, minDuration = _a.minDuration, maxDuration = _a.maxDuration, type = _a.type;
        var _b = this.state, startDate = _b.startDate, endDate = _b.endDate, editState = _b.editState;
        if (!startDate) {
            return newValue;
        }
        // 时间范围必须统一成同一天，不然会不一致
        if (type === 'input-time-range' && startDate) {
            newValue.set({
                year: startDate.year(),
                month: startDate.month(),
                date: startDate.date()
            });
        }
        if (minDuration && newValue.isBefore(startDate.clone().add(minDuration))) {
            newValue = startDate.clone().add(minDuration);
        }
        if (maxDuration && newValue.isAfter(startDate.clone().add(maxDuration))) {
            newValue = startDate.clone().add(maxDuration);
        }
        return newValue;
    };
    // 根据 duration 修复起始时间
    DateRangePicker.prototype.getStartDateByDuration = function (newValue) {
        var _a = this.props, minDuration = _a.minDuration, maxDuration = _a.maxDuration, type = _a.type;
        var _b = this.state, endDate = _b.endDate, editState = _b.editState;
        if (!endDate) {
            return newValue;
        }
        // 时间范围必须统一成同一天，不然会不一致
        if (type === 'input-time-range' && endDate) {
            newValue.set({
                year: endDate.year(),
                month: endDate.month(),
                date: endDate.date()
            });
        }
        if (minDuration &&
            newValue.isBefore(endDate.clone().subtract(minDuration))) {
            newValue = endDate.clone().subtract(minDuration);
        }
        if (maxDuration &&
            newValue.isAfter(endDate.clone().subtract(maxDuration))) {
            newValue = endDate.clone().subtract(maxDuration);
        }
        return newValue;
    };
    // 主要用于处理时间的情况
    DateRangePicker.prototype.handleTimeStartChange = function (newValue) {
        var _this = this;
        var _a = this.props, embed = _a.embed, timeFormat = _a.timeFormat, inputFormat = _a.inputFormat, minDuration = _a.minDuration, maxDuration = _a.maxDuration, minDate = _a.minDate;
        var _b = this.state, startDate = _b.startDate, endDate = _b.endDate;
        // 时间范围必须统一成同一天，不然会不一致
        if (endDate) {
            newValue.set({
                year: endDate.year(),
                month: endDate.month(),
                date: endDate.date()
            });
        }
        if (minDate && newValue && newValue.isBefore(minDate, 'second')) {
            newValue = minDate;
        }
        this.setState({
            startDate: newValue,
            startInputValue: newValue.format(inputFormat)
        }, function () {
            embed && _this.confirm();
        });
    };
    DateRangePicker.prototype.handleTimeEndChange = function (newValue) {
        var _this = this;
        var _a = this.props, embed = _a.embed, timeFormat = _a.timeFormat, inputFormat = _a.inputFormat, minDuration = _a.minDuration, maxDuration = _a.maxDuration, maxDate = _a.maxDate;
        var _b = this.state, startDate = _b.startDate, endDate = _b.endDate;
        if (startDate) {
            newValue.set({
                year: startDate.year(),
                month: startDate.month(),
                date: startDate.date()
            });
        }
        if (maxDate && newValue && newValue.isAfter(maxDate, 'second')) {
            newValue = maxDate;
        }
        if (startDate &&
            minDuration &&
            newValue.isAfter(startDate.clone().add(minDuration))) {
            newValue = startDate.clone().add(minDuration);
        }
        if (startDate &&
            maxDuration &&
            newValue.isBefore(startDate.clone().add(maxDuration))) {
            newValue = startDate.clone().add(maxDuration);
        }
        this.setState({
            endDate: newValue,
            endInputValue: newValue.format(inputFormat)
        }, function () {
            embed && _this.confirm();
        });
    };
    DateRangePicker.prototype.handleMobileChange = function (data, callback) {
        this.setState({
            startDate: data.startDate,
            endDate: data.endDate
        }, callback);
    };
    DateRangePicker.prototype.selectRannge = function (range) {
        var _a = this.props, closeOnSelect = _a.closeOnSelect, minDate = _a.minDate, maxDate = _a.maxDate;
        var now = (0, moment_1.default)();
        this.setState({
            startDate: minDate && minDate.isValid()
                ? moment_1.default.max(range.startDate(now.clone()), minDate)
                : range.startDate(now.clone()),
            endDate: maxDate && maxDate.isValid()
                ? moment_1.default.min(maxDate, range.endDate(now.clone()))
                : range.endDate(now.clone())
        }, closeOnSelect ? this.confirm : helper_1.noop);
    };
    DateRangePicker.prototype.renderRanges = function (ranges) {
        var _this = this;
        if (!ranges) {
            return null;
        }
        var ns = this.props.classPrefix;
        var rangeArr;
        if (typeof ranges === 'string') {
            rangeArr = ranges.split(',');
        }
        else {
            rangeArr = ranges;
        }
        var __ = this.props.translate;
        return (react_1.default.createElement("ul", { className: "".concat(ns, "DateRangePicker-rangers") }, rangeArr.map(function (item) {
            if (!item) {
                return null;
            }
            var range = {};
            if (typeof item === 'string') {
                if (exports.availableRanges[item]) {
                    range = exports.availableRanges[item];
                    range.key = item;
                }
                else {
                    // 通过正则尝试匹配
                    for (var i = 0, len = exports.advancedRanges.length; i < len; i++) {
                        var value = exports.advancedRanges[i];
                        var m = value.regexp.exec(item);
                        if (m) {
                            range = value.resolve.apply(item, (0, tslib_1.__spreadArray)([__], m, true));
                            range.key = item;
                        }
                    }
                }
            }
            else if (item.startDate &&
                item.endDate) {
                range = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, item), { startDate: function () { return item.startDate; }, endDate: function () { return item.endDate; } });
            }
            if (Object.keys(range).length) {
                return (react_1.default.createElement("li", { className: "".concat(ns, "DateRangePicker-ranger"), onClick: function () { return _this.selectRannge(range); }, key: range.key || range.label },
                    react_1.default.createElement("a", null, __(range.label))));
            }
            else {
                return null;
            }
        })));
    };
    DateRangePicker.prototype.clearValue = function (e) {
        e.preventDefault();
        e.stopPropagation();
        var onChange = this.props.onChange;
        this.setState({ startInputValue: '', endInputValue: '' });
        onChange('');
    };
    // 清空
    DateRangePicker.prototype.clear = function () {
        var onChange = this.props.onChange;
        this.setState({ startInputValue: '', endInputValue: '' });
        onChange('');
    };
    // 重置
    DateRangePicker.prototype.reset = function () {
        var _a = this.props, resetValue = _a.resetValue, onChange = _a.onChange, format = _a.format, joinValues = _a.joinValues, delimiter = _a.delimiter, inputFormat = _a.inputFormat;
        if (!resetValue) {
            return;
        }
        var _b = DateRangePicker.unFormatValue(resetValue, format, joinValues, delimiter), startDate = _b.startDate, endDate = _b.endDate;
        onChange(resetValue);
        this.setState({
            startInputValue: startDate === null || startDate === void 0 ? void 0 : startDate.format(inputFormat),
            endInputValue: endDate === null || endDate === void 0 ? void 0 : endDate.format(inputFormat)
        });
    };
    DateRangePicker.prototype.checkStartIsValidDate = function (currentDate) {
        var _a = this.state, endDate = _a.endDate, startDate = _a.startDate;
        var _b = this.props, minDate = _b.minDate, maxDate = _b.maxDate, minDuration = _b.minDuration, maxDuration = _b.maxDuration, viewMode = _b.viewMode;
        var precision = viewMode === 'time' ? 'hours' : viewMode || 'day';
        maxDate =
            maxDate && endDate
                ? maxDate.isBefore(endDate)
                    ? maxDate
                    : endDate
                : undefined;
        if (minDate && currentDate.isBefore(minDate, precision)) {
            return false;
        }
        else if (maxDate && currentDate.isAfter(maxDate, precision)) {
            return false;
        }
        else if (
        // 如果配置了 minDuration 那么 EndDate - minDuration 之后的天数也不能选
        endDate &&
            minDuration &&
            currentDate.isAfter(endDate.clone().subtract(minDuration))) {
            return false;
        }
        else if (endDate &&
            maxDuration &&
            currentDate.isBefore(endDate.clone().subtract(maxDuration))) {
            return false;
        }
        return true;
    };
    DateRangePicker.prototype.checkEndIsValidDate = function (currentDate) {
        var startDate = this.state.startDate;
        var _a = this.props, minDate = _a.minDate, maxDate = _a.maxDate, minDuration = _a.minDuration, maxDuration = _a.maxDuration, viewMode = _a.viewMode;
        var precision = viewMode === 'time' ? 'hours' : viewMode || 'day';
        minDate =
            minDate && startDate
                ? minDate.isAfter(startDate)
                    ? minDate
                    : startDate
                : undefined;
        if (minDate && currentDate.isBefore(minDate, precision)) {
            return false;
        }
        else if (maxDate && currentDate.isAfter(maxDate, precision)) {
            return false;
        }
        else if (startDate &&
            minDuration &&
            currentDate.isBefore(startDate.clone().add(minDuration))) {
            return false;
        }
        else if (startDate &&
            maxDuration &&
            currentDate.isAfter(startDate.clone().add(maxDuration))) {
            return false;
        }
        return true;
    };
    DateRangePicker.prototype.renderDay = function (props, currentDate) {
        var _a = this.state, startDate = _a.startDate, endDate = _a.endDate;
        if (startDate &&
            endDate &&
            currentDate.isBetween(startDate, endDate, 'day', '[]')) {
            props.className += ' rdtBetween';
        }
        return react_1.default.createElement("td", (0, tslib_1.__assign)({}, props), currentDate.date());
    };
    DateRangePicker.prototype.renderMonth = function (props, month, year, date) {
        var m = (0, moment_1.default)();
        var currentDate = m.year(year).month(month);
        var _a = this.state, startDate = _a.startDate, endDate = _a.endDate;
        var localMoment = m.localeData().monthsShort(m.month(month));
        var strLength = 3;
        var monthStrFixedLength = localMoment.substring(0, strLength);
        if (startDate &&
            endDate &&
            currentDate.isBetween(startDate, endDate, 'month', '[]')) {
            props.className += ' rdtBetween';
        }
        return (react_1.default.createElement("td", (0, tslib_1.__assign)({}, props),
            react_1.default.createElement("span", null, monthStrFixedLength)));
    };
    DateRangePicker.prototype.renderQuarter = function (props, quarter, year) {
        var currentDate = (0, moment_1.default)().year(year).quarter(quarter);
        var _a = this.state, startDate = _a.startDate, endDate = _a.endDate;
        if (startDate &&
            endDate &&
            currentDate.isBetween(startDate, endDate, 'quarter', '[]')) {
            props.className += ' rdtBetween';
        }
        return (react_1.default.createElement("td", (0, tslib_1.__assign)({}, props),
            react_1.default.createElement("span", null,
                "Q",
                quarter)));
    };
    DateRangePicker.prototype.renderYear = function (props, year) {
        var currentDate = (0, moment_1.default)().year(year);
        var _a = this.state, startDate = _a.startDate, endDate = _a.endDate;
        if (startDate &&
            endDate &&
            currentDate.isBetween(startDate, endDate, 'year', '[]')) {
            props.className += ' rdtBetween';
        }
        return (react_1.default.createElement("td", (0, tslib_1.__assign)({}, props),
            react_1.default.createElement("span", null, year)));
    };
    DateRangePicker.prototype.renderCalendar = function () {
        var _a;
        var _b = this.props, ns = _b.classPrefix, cx = _b.classnames, dateFormat = _b.dateFormat, timeFormat = _b.timeFormat, inputFormat = _b.inputFormat, ranges = _b.ranges, locale = _b.locale, embed = _b.embed, type = _b.type, _c = _b.viewMode, viewMode = _c === void 0 ? 'days' : _c;
        var __ = this.props.translate;
        var _d = this.state, startDate = _d.startDate, endDate = _d.endDate;
        return (react_1.default.createElement("div", { className: "".concat(ns, "DateRangePicker-wrap"), ref: this.calendarRef },
            this.renderRanges(ranges),
            react_1.default.createElement(Calendar_1.default, { className: "".concat(ns, "DateRangePicker-start"), value: startDate, 
                // 区分的原因是 time-range 左侧就只能选起始时间，而其它都能在左侧同时同时选择起始和结束
                // TODO: 后续得把 time-range 代码拆分出来
                onChange: type === 'input-datetime-range'
                    ? this.handleStartDateChange
                    : viewMode === 'time'
                        ? this.handleTimeStartChange
                        : this.handleDateChange, requiredConfirm: false, dateFormat: dateFormat, inputFormat: inputFormat, timeFormat: timeFormat, isValidDate: this.checkStartIsValidDate, viewMode: viewMode, input: false, onClose: this.close, renderDay: this.renderDay, renderMonth: this.renderMonth, renderQuarter: this.renderQuarter, renderYear: this.renderYear, locale: locale, timeRangeHeader: "\u5F00\u59CB\u65F6\u95F4" }),
            react_1.default.createElement(Calendar_1.default, { className: "".concat(ns, "DateRangePicker-end"), value: endDate, onChange: type === 'input-datetime-range'
                    ? this.handeleEndDateChange
                    : viewMode === 'time'
                        ? this.handleTimeEndChange
                        : this.handleDateChange, requiredConfirm: false, dateFormat: dateFormat, inputFormat: inputFormat, timeFormat: timeFormat, viewDate: this.nextMonth, isEndDate: true, isValidDate: this.checkEndIsValidDate, viewMode: viewMode, input: false, onClose: this.close, renderDay: this.renderDay, renderMonth: this.renderMonth, renderQuarter: this.renderQuarter, renderYear: this.renderYear, locale: locale, timeRangeHeader: "\u7ED3\u675F\u65F6\u95F4" }),
            embed ? null : (react_1.default.createElement("div", { key: "button", className: "".concat(ns, "DateRangePicker-actions") },
                react_1.default.createElement("a", { className: cx('Button', 'Button--default'), onClick: this.close }, __('cancel')),
                react_1.default.createElement("a", { className: cx('Button', 'Button--primary', 'm-l-sm', {
                        'is-disabled': !this.state.startDate ||
                            !this.state.endDate ||
                            ((_a = this.state.endDate) === null || _a === void 0 ? void 0 : _a.isBefore(this.state.startDate))
                    }), onClick: this.confirm }, __('confirm'))))));
    };
    DateRangePicker.prototype.render = function () {
        var _a;
        var _this = this;
        var _b = this.props, className = _b.className, popoverClassName = _b.popoverClassName, ns = _b.classPrefix, cx = _b.classnames, value = _b.value, startPlaceholder = _b.startPlaceholder, endPlaceholder = _b.endPlaceholder, popOverContainer = _b.popOverContainer, inputFormat = _b.inputFormat, format = _b.format, joinValues = _b.joinValues, delimiter = _b.delimiter, clearable = _b.clearable, disabled = _b.disabled, embed = _b.embed, overlayPlacement = _b.overlayPlacement, borderMode = _b.borderMode, useMobileUI = _b.useMobileUI, timeFormat = _b.timeFormat, minDate = _b.minDate, maxDate = _b.maxDate, minDuration = _b.minDuration, maxDuration = _b.maxDuration, dateFormat = _b.dateFormat, _c = _b.viewMode, viewMode = _c === void 0 ? 'days' : _c, ranges = _b.ranges;
        var useCalendarMobile = useMobileUI &&
            (0, helper_1.isMobile)() &&
            ['days', 'months', 'quarters'].indexOf(viewMode) > -1;
        var _d = this.state, isOpened = _d.isOpened, isFocused = _d.isFocused, startDate = _d.startDate, endDate = _d.endDate;
        var __ = this.props.translate;
        var calendarMobile = (react_1.default.createElement(CalendarMobile_1.default, { timeFormat: timeFormat, inputFormat: inputFormat, startDate: startDate, endDate: endDate, minDate: minDate, maxDate: maxDate, minDuration: minDuration, maxDuration: maxDuration, dateFormat: dateFormat, embed: embed, viewMode: viewMode, close: this.close, confirm: this.confirm, onChange: this.handleMobileChange, footerExtra: this.renderRanges(ranges), showViewMode: viewMode === 'quarters' || viewMode === 'months' ? 'years' : 'months' }));
        if (embed) {
            return (react_1.default.createElement("div", { className: cx("".concat(ns, "DateRangeCalendar"), {
                    'is-disabled': disabled
                }, className) }, useCalendarMobile ? calendarMobile : this.renderCalendar()));
        }
        var CalendarMobileTitle = (react_1.default.createElement("div", { className: "".concat(ns, "CalendarMobile-title") }, __('Calendar.datepicker')));
        return (react_1.default.createElement("div", { tabIndex: 0, onKeyPress: this.handleKeyPress, onFocus: this.handleFocus, onBlur: this.handleBlur, className: cx("".concat(ns, "DateRangePicker"), (_a = {
                    'is-disabled': disabled,
                    'is-focused': isFocused
                },
                _a["".concat(ns, "DateRangePicker--border").concat((0, helper_1.ucFirst)(borderMode))] = borderMode,
                _a['is-mobile'] = useMobileUI && (0, helper_1.isMobile)(),
                _a), className), ref: this.dom },
            react_1.default.createElement(Input_1.default, { className: cx('DateRangePicker-input', {
                    isActive: this.state.editState === 'start'
                }), onChange: this.startInputChange, onClick: this.openStart, ref: this.startInputRef, placeholder: __(startPlaceholder), autoComplete: "off", value: this.state.startInputValue || '', disabled: disabled }),
            react_1.default.createElement("span", { className: cx('DateRangePicker-input-separator') }, "~"),
            react_1.default.createElement(Input_1.default, { className: cx('DateRangePicker-input', {
                    isActive: this.state.editState === 'end'
                }), onChange: this.endInputChange, onClick: this.openEnd, ref: this.endInputRef, placeholder: __(endPlaceholder), autoComplete: "off", value: this.state.endInputValue || '', disabled: disabled }),
            clearable && !disabled && value ? (react_1.default.createElement("a", { className: "".concat(ns, "DateRangePicker-clear"), onClick: this.clearValue },
                react_1.default.createElement(icons_1.Icon, { icon: "input-clear", className: "icon" }))) : null,
            react_1.default.createElement("a", { className: "".concat(ns, "DateRangePicker-toggler") },
                react_1.default.createElement(icons_1.Icon, { icon: "clock", className: "icon" })),
            isOpened ? (useMobileUI && (0, helper_1.isMobile)() ? (react_1.default.createElement(PopUp_1.default, { isShow: isOpened, container: popOverContainer, className: cx("".concat(ns, "CalendarMobile-pop")), onHide: this.close, header: CalendarMobileTitle }, useCalendarMobile ? calendarMobile : this.renderCalendar())) : (react_1.default.createElement(Overlay_1.default, { target: function () { return _this.dom.current; }, onHide: this.close, container: popOverContainer || (function () { return (0, react_dom_1.findDOMNode)(_this); }), rootClose: false, placement: overlayPlacement, show: true },
                react_1.default.createElement(PopOver_1.default, { classPrefix: ns, className: cx("".concat(ns, "DateRangePicker-popover"), popoverClassName), onHide: this.close, onClick: this.handlePopOverClick }, this.renderCalendar())))) : null));
    };
    DateRangePicker.defaultProps = {
        startPlaceholder: 'Calendar.startPick',
        endPlaceholder: 'Calendar.endPick',
        format: 'X',
        inputFormat: 'YYYY-MM-DD',
        joinValues: true,
        clearable: true,
        delimiter: ',',
        ranges: 'yesterday,7daysago,prevweek,thismonth,prevmonth,prevquarter',
        resetValue: '',
        closeOnSelect: true,
        overlayPlacement: 'auto'
    };
    return DateRangePicker;
}(react_1.default.Component));
exports.DateRangePicker = DateRangePicker;
exports.default = (0, theme_1.themeable)((0, locale_1.localeable)(DateRangePicker));
//# sourceMappingURL=./components/DateRangePicker.js.map
