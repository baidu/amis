"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/**
 * @file 基于 react-datetime 改造。
 */
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var CalendarContainer_1 = (0, tslib_1.__importDefault)(require("./CalendarContainer"));
var classnames_1 = (0, tslib_1.__importDefault)(require("classnames"));
var moment_1 = (0, tslib_1.__importDefault)(require("moment"));
var theme_1 = require("../../theme");
var helper_1 = require("../../utils/helper");
var viewModes = Object.freeze({
    YEARS: 'years',
    MONTHS: 'months',
    DAYS: 'days',
    TIME: 'time'
});
var BaseDatePicker = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(BaseDatePicker, _super);
    function BaseDatePicker(props) {
        var _this = _super.call(this, props) || this;
        _this.timeCellLength = {
            year: 4,
            month: 2,
            date: 2,
            hours: 2,
            minutes: 2,
            seconds: 2,
            milliseconds: 3
        };
        _this.getUpdateOn = function (formats) {
            if (formats.date.match(/[lLD]/)) {
                return 'days';
            }
            else if (formats.date.indexOf('M') !== -1) {
                return 'months';
            }
            else if (formats.date.indexOf('Q') !== -1) {
                return 'quarters';
            }
            else if (formats.date.indexOf('Y') !== -1) {
                return 'years';
            }
            return 'days';
        };
        _this.componentProps = {
            fromProps: [
                'value',
                'isValidDate',
                'renderDay',
                'renderMonth',
                'renderYear',
                'timeConstraints'
            ],
            fromState: ['viewDate', 'selectedDate', 'updateOn'],
            fromThis: [
                'setDate',
                'setTime',
                'showView',
                'addTime',
                'subtractTime',
                'updateSelectedDate',
                'localMoment',
                'handleClickOutside'
            ]
        };
        _this.showView = function (view) {
            return function () {
                _this.setState({ currentView: view });
            };
        };
        _this.subtractTime = function (amount, type, toSelected) {
            return function () {
                _this.updateTime('subtract', amount, type, toSelected);
            };
        };
        _this.addTime = function (amount, type, toSelected) {
            return function () {
                _this.updateTime('add', amount, type, toSelected);
            };
        };
        _this.allowedSetTime = ['hours', 'minutes', 'seconds', 'milliseconds'];
        _this.setTime = function (type, value) {
            var index = _this.allowedSetTime.indexOf(type) + 1, state = _this.state, date = (state.selectedDate || state.viewDate).clone(), nextType;
            // It is needed to set all the time properties
            // to not to reset the time
            date[type](value);
            for (; index < _this.allowedSetTime.length; index++) {
                nextType = _this.allowedSetTime[index];
                date[nextType](date[nextType]());
            }
            if (!_this.props.value) {
                _this.setState({
                    selectedDate: date,
                    inputValue: date.format(state.inputFormat)
                });
            }
            _this.props.onChange && _this.props.onChange(date);
        };
        _this.setDate = function (type) {
            // todo 没看懂这个是啥意思，好像没啥用
            var currentShould = _this.props.viewMode === 'months' &&
                !/^mm$/i.test(_this.props.inputFormat || '');
            var nextViews = {
                month: currentShould ? 'months' : 'days',
                year: currentShould ? 'months' : 'days',
                quarters: ''
            };
            if (_this.props.viewMode === 'quarters') {
                nextViews.year = 'quarters';
            }
            return function (e) {
                _this.setState({
                    viewDate: _this.state.viewDate
                        .clone()[type](parseInt(e.target.closest('td').getAttribute('data-value'), 10)).startOf(type),
                    currentView: nextViews[type]
                });
            };
        };
        _this.updateSelectedDate = function (e, close) {
            var that = _this;
            var target = e.currentTarget, modifier = 0, viewDate = _this.state.viewDate, currentDate = _this.state.selectedDate || viewDate, date;
            if (target.className.indexOf('rdtDay') !== -1) {
                if (target.className.indexOf('rdtNew') !== -1)
                    modifier = 1;
                else if (target.className.indexOf('rdtOld') !== -1)
                    modifier = -1;
                date = viewDate
                    .clone()
                    .month(viewDate.month() + modifier)
                    .date(parseInt(target.getAttribute('data-value'), 10));
            }
            else if (target.className.indexOf('rdtMonth') !== -1) {
                date = viewDate
                    .clone()
                    .month(parseInt(target.getAttribute('data-value'), 10))
                    .date(currentDate.date());
            }
            else if (target.className.indexOf('rdtQuarter') !== -1) {
                date = viewDate
                    .clone()
                    .quarter(parseInt(target.getAttribute('data-value'), 10))
                    .startOf('quarter')
                    .date(currentDate.date());
            }
            else if (target.className.indexOf('rdtYear') !== -1) {
                date = viewDate
                    .clone()
                    .month(currentDate.month())
                    .date(currentDate.date())
                    .year(parseInt(target.getAttribute('data-value'), 10));
            }
            date === null || date === void 0 ? void 0 : date.hours(currentDate.hours()).minutes(currentDate.minutes()).seconds(currentDate.seconds()).milliseconds(currentDate.milliseconds());
            if (!_this.props.value) {
                var open = !(_this.props.closeOnSelect && close);
                if (!open) {
                    that.props.onBlur(date);
                }
                _this.setState({
                    selectedDate: date,
                    viewDate: date === null || date === void 0 ? void 0 : date.clone().startOf('month'),
                    inputValue: date === null || date === void 0 ? void 0 : date.format(_this.state.inputFormat),
                    open: open
                });
            }
            else {
                _this.setState({
                    selectedDate: date,
                    viewDate: date === null || date === void 0 ? void 0 : date.clone().startOf('month'),
                    inputValue: date === null || date === void 0 ? void 0 : date.format(_this.state.inputFormat)
                });
                if (_this.props.closeOnSelect && close) {
                    that.closeCalendar();
                }
            }
            that.props.onChange(date);
        };
        _this.getDateBoundary = function (currentDate) {
            var _a, _b;
            var _c = currentDate.toObject(), years = _c.years, months = _c.months;
            var maxDateObject = (_a = _this.props.maxDate) === null || _a === void 0 ? void 0 : _a.toObject();
            var minDateObject = (_b = _this.props.minDate) === null || _b === void 0 ? void 0 : _b.toObject();
            var yearBoundary = {
                max: maxDateObject ? maxDateObject.years : years + 100,
                min: minDateObject ? minDateObject.years : years - 100
            };
            var monthBoundary = {
                max: years === (maxDateObject === null || maxDateObject === void 0 ? void 0 : maxDateObject.years) ? maxDateObject.months : 11,
                min: years === (minDateObject === null || minDateObject === void 0 ? void 0 : minDateObject.years) ? minDateObject.months : 0
            };
            var dateBoundary = {
                max: years === (maxDateObject === null || maxDateObject === void 0 ? void 0 : maxDateObject.years) && months === (maxDateObject === null || maxDateObject === void 0 ? void 0 : maxDateObject.months)
                    ? maxDateObject.date
                    : currentDate.daysInMonth(),
                min: years === (minDateObject === null || minDateObject === void 0 ? void 0 : minDateObject.years) && months === (minDateObject === null || minDateObject === void 0 ? void 0 : minDateObject.months)
                    ? minDateObject.date
                    : 1
            };
            return {
                year: yearBoundary,
                month: monthBoundary,
                date: dateBoundary,
                hours: { max: 23, min: 0 },
                minutes: { max: 59, min: 0 },
                seconds: { max: 59, min: 0 }
            };
        };
        _this.timeCell = function (value, type) {
            var str = value + '';
            while (str.length < _this.timeCellLength[type])
                str = '0' + str;
            return str;
        };
        _this.getColumns = function (types, dateBoundary) {
            var columns = [];
            types.map(function (type) {
                var options = (0, helper_1.getRange)(dateBoundary[type].min, dateBoundary[type].max, 1).map(function (item) {
                    return {
                        text: type === 'month'
                            ? _this.timeCell(item + 1, type)
                            : _this.timeCell(item, type),
                        value: item
                    };
                });
                columns.push({ options: options });
            });
            return columns;
        };
        _this.onConfirm = function (value, types) {
            var currentDate = (_this.state.selectedDate ||
                _this.state.viewDate ||
                (0, moment_1.default)()).clone();
            var date = (0, helper_1.convertArrayValueToMoment)(value, types, currentDate);
            if (!_this.props.value) {
                _this.setState({
                    selectedDate: date,
                    inputValue: date.format(_this.state.inputFormat)
                });
            }
            _this.props.onChange && _this.props.onChange(date);
            _this.props.onClose && _this.props.onClose();
        };
        var state = _this.getStateFromProps(_this.props);
        if (state.open === undefined) {
            state.open = !_this.props.input;
        }
        state.currentView = _this.props.dateFormat
            ? _this.props.viewMode || state.updateOn || 'days'
            : _this.props.viewMode || 'time';
        _this.state = state;
        return _this;
    }
    BaseDatePicker.prototype.getFormats = function (props) {
        var formats = {
            date: props.dateFormat || '',
            time: props.timeFormat || ''
        }, locale = this.localMoment(props.date, undefined, props).localeData();
        if (formats.date === true) {
            formats.date = locale.longDateFormat('L');
        }
        else if (this.getUpdateOn(formats) !== viewModes.DAYS) {
            formats.time = '';
        }
        if (formats.time === true) {
            formats.time = locale.longDateFormat('LT');
        }
        formats.datetime =
            formats.date && formats.time
                ? formats.date + ' ' + formats.time
                : formats.date || formats.time;
        return formats;
    };
    BaseDatePicker.prototype.componentDidUpdate = function (prevProps) {
        var props = this.props;
        var formats = this.getFormats(props), updatedState = {};
        if (props.value !== prevProps.value ||
            formats.datetime !== this.getFormats(prevProps).datetime) {
            updatedState = this.getStateFromProps(props);
        }
        if (props.viewMode !== prevProps.viewMode) {
            updatedState.currentView = props.viewMode;
        }
        if (props.locale !== prevProps.locale) {
            if (this.state.viewDate) {
                var updatedViewDate = this.state.viewDate.clone().locale(props.locale);
                updatedState.viewDate = updatedViewDate;
            }
            if (this.state.selectedDate) {
                var updatedSelectedDate = this.state.selectedDate
                    .clone()
                    .locale(props.locale);
                updatedState.selectedDate = updatedSelectedDate;
                updatedState.inputValue = updatedSelectedDate.format(formats.datetime);
            }
        }
        if (props.utc !== prevProps.utc ||
            props.displayTimeZone !== prevProps.displayTimeZone) {
            if (props.utc) {
                if (this.state.viewDate)
                    updatedState.viewDate = this.state.viewDate.clone().utc();
                if (this.state.selectedDate) {
                    updatedState.selectedDate = this.state.selectedDate.clone().utc();
                    updatedState.inputValue = updatedState.selectedDate.format(formats.datetime);
                }
            }
            else if (props.displayTimeZone) {
                if (this.state.viewDate)
                    updatedState.viewDate = this.state.viewDate
                        .clone()
                        // @ts-ignore 其实目前不支持，需要自己 import "moment-timezone";
                        .tz(props.displayTimeZone);
                if (this.state.selectedDate) {
                    updatedState.selectedDate = this.state.selectedDate
                        .clone()
                        // @ts-ignore
                        .tz(props.displayTimeZone);
                    updatedState.inputValue = updatedState.selectedDate
                        .tz(props.displayTimeZone)
                        .format(formats.datetime);
                }
            }
            else {
                if (this.state.viewDate)
                    updatedState.viewDate = this.state.viewDate.clone().local();
                if (this.state.selectedDate) {
                    updatedState.selectedDate = this.state.selectedDate.clone().local();
                    updatedState.inputValue = updatedState.selectedDate.format(formats.datetime);
                }
            }
        }
        if (props.viewDate !== prevProps.viewDate) {
            updatedState.viewDate = (0, moment_1.default)(props.viewDate);
        }
        if (Object.keys(updatedState).length) {
            this.setState(updatedState);
        }
        this.checkTZ(props);
    };
    BaseDatePicker.prototype.checkTZ = function (props) {
        var con = console;
        // @ts-ignore
        if (props.displayTimeZone && !this.tzWarning && !moment_1.default.tz) {
            this.tzWarning = true;
            con &&
                con.error('react-datetime: displayTimeZone prop with value "' +
                    props.displayTimeZone +
                    '" is used but moment.js timezone is not loaded.');
        }
    };
    BaseDatePicker.prototype.localMoment = function (date, format, props) {
        props = props || this.props;
        var m = null;
        if (props.utc) {
            m = moment_1.default.utc(date, format, props.strictParsing);
        }
        else if (props.displayTimeZone) {
            // @ts-ignore 以后再修
            m = moment_1.default.tz(date, format, props.displayTimeZone);
        }
        else {
            m = (0, moment_1.default)(date, format, props.strictParsing);
        }
        if (props.locale)
            m.locale(props.locale);
        return m;
    };
    BaseDatePicker.prototype.parseDate = function (date, formats) {
        var parsedDate;
        if (date && typeof date === 'string')
            parsedDate = this.localMoment(date, formats.datetime);
        else if (date)
            parsedDate = this.localMoment(date);
        if (parsedDate && !parsedDate.isValid())
            parsedDate = null;
        return parsedDate;
    };
    BaseDatePicker.prototype.getStateFromProps = function (props) {
        var formats = this.getFormats(props), date = props.value || props.defaultValue || '', selectedDate, viewDate, updateOn, inputValue;
        selectedDate = this.parseDate(date, formats);
        viewDate = this.parseDate(props.viewDate, formats);
        viewDate = selectedDate
            ? selectedDate.clone().startOf('month')
            : viewDate
                ? viewDate.clone().startOf('month')
                : this.localMoment().startOf('month');
        updateOn = this.getUpdateOn(formats);
        if (selectedDate)
            inputValue = selectedDate.format(formats.datetime);
        else if (date.isValid && !date.isValid())
            inputValue = '';
        else
            inputValue = date || '';
        return {
            updateOn: updateOn,
            inputFormat: formats.datetime,
            viewDate: viewDate,
            selectedDate: selectedDate,
            inputValue: inputValue,
            open: props.open
        };
    };
    BaseDatePicker.prototype.getComponentProps = function () {
        var _this = this;
        var me = this, formats = this.getFormats(this.props), props = { dateFormat: formats.date, timeFormat: formats.time };
        this.componentProps.fromProps.forEach(function (name) {
            props[name] = me.props[name];
        });
        this.componentProps.fromState.forEach(function (name) {
            props[name] = me.state[name];
        });
        this.componentProps.fromThis.forEach(function (name) {
            props[name] = me[name];
        });
        props.setDateTimeState = this.setState.bind(this);
        [
            'inputFormat',
            'onChange',
            'onClose',
            'requiredConfirm',
            'classPrefix',
            'prevIcon',
            'nextIcon',
            'isEndDate',
            'classnames',
            'minDate',
            'maxDate',
            'schedules',
            'largeMode',
            'onScheduleClick',
            'hideHeader',
            'updateOn',
            'useMobileUI',
            'showToolbar',
            'embed'
        ].forEach(function (key) { return (props[key] = _this.props[key]); });
        return props;
    };
    BaseDatePicker.prototype.updateTime = function (op, amount, type, toSelected) {
        var update = {}, date = toSelected ? 'selectedDate' : 'viewDate';
        // @ts-ignore
        update[date] = this.state[date].clone()[op](amount, type);
        this.setState(update);
    };
    BaseDatePicker.prototype.render = function () {
        var _a;
        var _b = this.props, viewMode = _b.viewMode, timeFormat = _b.timeFormat, dateFormat = _b.dateFormat, timeRangeHeader = _b.timeRangeHeader;
        var Component = CalendarContainer_1.default;
        var viewProps = this.getComponentProps();
        if (viewMode === 'quarters') {
            _a = [
                'quarters',
                this.props.renderQuarter
            ], viewProps.updateOn = _a[0], viewProps.renderQuarter = _a[1];
        }
        else if (viewMode === 'years') {
            viewProps.updateOn = 'years';
        }
        else if (viewMode === 'months') {
            viewProps.updateOn = 'months';
        }
        viewProps.onConfirm = this.onConfirm;
        viewProps.getDateBoundary = this.getDateBoundary;
        viewProps.getColumns = this.getColumns;
        viewProps.timeCell = this.timeCell;
        viewProps.timeRangeHeader = this.props.timeRangeHeader;
        return (react_1.default.createElement("div", { className: (0, classnames_1.default)('rdt rdtStatic rdtOpen', this.props.className, (timeFormat && !dateFormat || typeof dateFormat !== 'string')
                ? 'rdtTimeWithoutD'
                : (timeFormat && timeFormat.toLowerCase().indexOf('s') > 0)
                    ? 'rdtTimeWithS'
                    : timeFormat
                        ? 'rdtTime'
                        : '') },
            react_1.default.createElement("div", { key: "dt", className: (0, classnames_1.default)('rdtPicker', (timeFormat && !dateFormat)
                    ? 'rdtPickerTimeWithoutD'
                    : (timeFormat && dateFormat)
                        ? 'rdtPickerTime'
                        : (dateFormat && !timeFormat)
                            ? 'rdtPickerDate'
                            : '') },
                react_1.default.createElement(Component, { view: this.state.currentView, viewProps: viewProps, timeRangeHeader: timeRangeHeader }))));
    };
    return BaseDatePicker;
}(react_1.default.Component));
var Calendar = (0, theme_1.themeable)(BaseDatePicker);
exports.default = Calendar;
//# sourceMappingURL=./components/calendar/Calendar.js.map
