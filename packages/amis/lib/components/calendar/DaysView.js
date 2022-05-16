"use strict";
// 最早基于 react-datetime 2.16.2 版本，后来大部分都自己写了
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomDaysView = void 0;
var tslib_1 = require("tslib");
var moment_1 = (0, tslib_1.__importDefault)(require("moment"));
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var downshift_1 = (0, tslib_1.__importDefault)(require("downshift"));
var findIndex_1 = (0, tslib_1.__importDefault)(require("lodash/findIndex"));
var merge_1 = (0, tslib_1.__importDefault)(require("lodash/merge"));
var locale_1 = require("../../locale");
var helper_1 = require("../../utils/helper");
var Picker_1 = (0, tslib_1.__importDefault)(require("../Picker"));
var CustomDaysView = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(CustomDaysView, _super);
    function CustomDaysView(props) {
        var _this = _super.call(this, props) || this;
        _this.timeConstraints = {
            hours: {
                min: 0,
                max: 23,
                step: 1
            },
            minutes: {
                min: 0,
                max: 59,
                step: 1
            },
            seconds: {
                min: 0,
                max: 59,
                step: 1
            },
            milliseconds: {
                min: 0,
                max: 999,
                step: 1
            }
        };
        _this.updateSelectedDate = function (event) {
            // need confirm
            if (_this.props.requiredConfirm) {
                var viewDate = _this.props.viewDate.clone();
                var currentDate = _this.props.selectedDate || viewDate;
                var target = event.target;
                var modifier = 0;
                if (~target.className.indexOf('rdtNew')) {
                    modifier = 1;
                }
                if (~target.className.indexOf('rdtOld')) {
                    modifier = -1;
                }
                viewDate
                    .month(viewDate.month() + modifier)
                    .date(parseInt(target.getAttribute('data-value'), 10))
                    .hours(currentDate.hours())
                    .minutes(currentDate.minutes())
                    .seconds(currentDate.seconds())
                    .milliseconds(currentDate.milliseconds());
                _this.props.setDateTimeState({
                    viewDate: viewDate,
                    selectedDate: viewDate.clone()
                });
                return;
            }
            _this.props.updateSelectedDate(event, true);
        };
        _this.showTime = function () {
            var _a = _this.props, selectedDate = _a.selectedDate, viewDate = _a.viewDate, timeFormat = _a.timeFormat;
            return (react_1.default.createElement("div", { key: "stb", className: "rdtShowTime" }, (selectedDate || viewDate || (0, moment_1.default)()).format(timeFormat)));
        };
        _this.setTime = function (type, value) {
            var date = (_this.props.selectedDate || _this.props.viewDate).clone();
            date[type](value);
            _this.props.setDateTimeState({
                viewDate: date.clone(),
                selectedDate: date.clone()
            });
            if (!_this.props.requiredConfirm) {
                _this.props.onChange(date);
            }
        };
        _this.scrollToTop = function (type, value, i, label) {
            var _a;
            var elf = document.getElementById("".concat(_this.state.uniqueTag, "-").concat(i, "-input"));
            var _b = _this.timeConstraints[type], min = _b.min, step = _b.step;
            var offset = (value - min) / step;
            var height = 28; /** 单个选项的高度 */
            (_a = elf === null || elf === void 0 ? void 0 : elf.parentNode) === null || _a === void 0 ? void 0 : _a.scrollTo({
                top: offset * height,
                behavior: label === 'init' ? 'auto' : 'smooth'
            });
        };
        _this.confirm = function () {
            var _a, _b;
            var date = (_this.props.selectedDate || _this.props.viewDate).clone();
            // 如果 minDate 是可用的，且比当前日期晚，则用 minDate
            if (((_a = _this.props.minDate) === null || _a === void 0 ? void 0 : _a.isValid()) && ((_b = _this.props.minDate) === null || _b === void 0 ? void 0 : _b.isAfter(date))) {
                date = _this.props.minDate.clone();
            }
            _this.props.setDateTimeState({
                selectedDate: date
            });
            _this.props.onChange(date);
            _this.props.onClose && _this.props.onClose();
        };
        _this.cancel = function () {
            _this.props.onClose && _this.props.onClose();
        };
        _this.renderDay = function (props, currentDate) {
            if (_this.props.schedules) {
                var schedule_1 = [];
                _this.props.schedules.forEach(function (item) {
                    if (currentDate.isSameOrAfter((0, moment_1.default)(item.startTime).subtract(1, 'days')) &&
                        currentDate.isSameOrBefore(item.endTime)) {
                        schedule_1.push(item);
                    }
                });
                if (schedule_1.length > 0) {
                    var cx_1 = _this.props.classnames;
                    var __ = _this.props.translate;
                    // 日程数据
                    var scheduleData_1 = {
                        scheduleData: schedule_1.map(function (item) {
                            return (0, tslib_1.__assign)((0, tslib_1.__assign)({}, item), { time: (0, moment_1.default)(item.startTime).format('YYYY-MM-DD HH:mm:ss') +
                                    ' - ' +
                                    (0, moment_1.default)(item.endTime).format('YYYY-MM-DD HH:mm:ss') });
                        }),
                        currentDate: currentDate
                    };
                    // 放大模式
                    if (_this.props.largeMode) {
                        var showSchedule_1 = [];
                        for (var i = 0; i < schedule_1.length; i++) {
                            if (showSchedule_1.length > 3) {
                                break;
                            }
                            if ((0, moment_1.default)(schedule_1[i].startTime).isSame(currentDate, 'day')) {
                                showSchedule_1.push(schedule_1[i]);
                            }
                            else if (currentDate.weekday() === 0) {
                                var width = Math.min((0, moment_1.default)(schedule_1[i].endTime).diff(currentDate, 'days') + 1, 7);
                                // 周一重新设置日程
                                showSchedule_1.push((0, tslib_1.__assign)((0, tslib_1.__assign)({}, schedule_1[i]), { width: width, startTime: (0, moment_1.default)(currentDate), endTime: (0, moment_1.default)(currentDate).add(width - 1, 'days') }));
                                schedule_1[i].height === undefined && (schedule_1[i].height = 0);
                            }
                            else {
                                // 生成空白格占位
                                showSchedule_1.push({
                                    width: 1,
                                    className: 'bg-transparent',
                                    content: '',
                                    height: schedule_1[i].height
                                });
                            }
                        }
                        [0, 1, 2].forEach(function (i) {
                            // 排序
                            var tempIndex = (0, findIndex_1.default)(showSchedule_1, function (item) { return item.height === i; });
                            if (tempIndex === -1) {
                                tempIndex = (0, findIndex_1.default)(showSchedule_1, function (item) { return item.height === undefined; });
                            }
                            if (tempIndex > -1 && tempIndex !== i) {
                                var temp = showSchedule_1[i];
                                showSchedule_1[i] = showSchedule_1[tempIndex];
                                showSchedule_1[tempIndex] = temp;
                            }
                            if (showSchedule_1[i] && showSchedule_1[i].height === undefined) {
                                showSchedule_1[i].height = i;
                            }
                        });
                        // 最多展示3个
                        showSchedule_1 = showSchedule_1.slice(0, 3);
                        var scheduleDiv = showSchedule_1.map(function (item, index) {
                            var width = item.width ||
                                Math.min((0, moment_1.default)(item.endTime).diff((0, moment_1.default)(item.startTime), 'days') + 1, 7 - (0, moment_1.default)(item.startTime).weekday());
                            return (react_1.default.createElement("div", { key: props.key + 'content' + index, className: cx_1('ScheduleCalendar-large-schedule-content', item.className), style: { width: width + '00%' }, onClick: function () {
                                    return _this.props.onScheduleClick &&
                                        _this.props.onScheduleClick(scheduleData_1);
                                } },
                                react_1.default.createElement("div", { className: cx_1('ScheduleCalendar-text-overflow') }, item.content)));
                        });
                        return (react_1.default.createElement("td", (0, tslib_1.__assign)({}, props),
                            react_1.default.createElement("div", { className: cx_1('ScheduleCalendar-large-day-wrap') },
                                react_1.default.createElement("div", { className: cx_1('ScheduleCalendar-large-schedule-header') }, currentDate.date()),
                                scheduleDiv,
                                schedule_1.length > 3 && (react_1.default.createElement("div", { className: cx_1('ScheduleCalendar-large-schedule-footer') },
                                    schedule_1.length - 3,
                                    " ",
                                    __('more'))))));
                    }
                    // 正常模式
                    var ScheduleIcon = (react_1.default.createElement("span", { className: cx_1('ScheduleCalendar-icon', schedule_1[0].className), onClick: function () {
                            return _this.props.onScheduleClick &&
                                _this.props.onScheduleClick(scheduleData_1);
                        } }));
                    return (react_1.default.createElement("td", (0, tslib_1.__assign)({}, props),
                        currentDate.date(),
                        ScheduleIcon));
                }
            }
            return react_1.default.createElement("td", (0, tslib_1.__assign)({}, props), currentDate.date());
        };
        _this.renderTimes = function () {
            var _a = _this.props, timeFormat = _a.timeFormat, selectedDate = _a.selectedDate, viewDate = _a.viewDate, isEndDate = _a.isEndDate, cx = _a.classnames;
            var date = selectedDate || (isEndDate ? viewDate.endOf('day') : viewDate);
            var inputs = [];
            var timeConstraints = _this.timeConstraints;
            inputs.push(_this.showTime());
            timeFormat.split(':').forEach(function (format, i) {
                var type = /h/i.test(format)
                    ? 'hours'
                    : /m/.test(format)
                        ? 'minutes'
                        : /s/.test(format)
                            ? 'seconds'
                            : '';
                if (type) {
                    var min_1 = timeConstraints[type].min;
                    var max_1 = timeConstraints[type].max;
                    var options_1 = _this.computedTimeOptions(type);
                    var formatMap_1 = {
                        hours: 'HH',
                        minutes: 'mm',
                        seconds: 'ss'
                    };
                    inputs.push(react_1.default.createElement(downshift_1.default, { key: i + 'input', inputValue: date.format(formatMap_1[type]) }, function (_a) {
                        var getInputProps = _a.getInputProps, openMenu = _a.openMenu, closeMenu = _a.closeMenu;
                        var inputProps = getInputProps({
                            onFocus: function () { return openMenu(); },
                            onChange: function (e) {
                                return _this.setTime(type, Math.max(min_1, Math.min(parseInt(e.currentTarget.value.replace(/\D/g, ''), 10) || 0, max_1)));
                            }
                        });
                        return (react_1.default.createElement("div", { className: cx('CalendarInputWrapper', 'CalendarInputWrapperMT') },
                            react_1.default.createElement("div", { className: cx('CalendarInput-sugs', type === 'hours'
                                    ? 'CalendarInput-sugsHours'
                                    : 'CalendarInput-sugsTimes'), id: "".concat(_this.state.uniqueTag, "-").concat(i, "-input") }, options_1.map(function (option) {
                                var _a;
                                return (react_1.default.createElement("div", { key: option.value, className: cx('CalendarInput-sugsItem', {
                                        'is-highlight': selectedDate
                                            ? option.value === date.format(formatMap_1[type])
                                            : option.value === ((_a = options_1 === null || options_1 === void 0 ? void 0 : options_1[0]) === null || _a === void 0 ? void 0 : _a.value)
                                    }), onClick: function () {
                                        _this.setTime(type, parseInt(option.value, 10));
                                        _this.scrollToTop(type, parseInt(option.value, 10), i);
                                        closeMenu();
                                    } }, option.value));
                            }))));
                    }));
                    inputs.push(react_1.default.createElement("span", { key: i + 'divider' }));
                }
            });
            inputs.length && inputs.pop();
            return react_1.default.createElement("div", null, inputs);
        };
        _this.renderFooter = function () {
            if (!_this.props.requiredConfirm) {
                return null;
            }
            var _a = _this.props, __ = _a.translate, cx = _a.classnames;
            return (react_1.default.createElement("tfoot", { key: "tf" },
                react_1.default.createElement("tr", null,
                    react_1.default.createElement("td", { colSpan: 7 }, _this.props.requiredConfirm ? (react_1.default.createElement("div", { key: "button", className: "rdtActions" },
                        react_1.default.createElement("a", { className: cx('Button', 'Button--default'), onClick: _this.cancel }, __('cancel')),
                        react_1.default.createElement("a", { className: cx('Button', 'Button--primary', 'm-l-sm'), onClick: _this.confirm }, __('confirm')))) : null))));
        };
        _this.onPickerConfirm = function (value) {
            _this.props.onConfirm && _this.props.onConfirm(value, _this.state.types);
        };
        _this.onPickerChange = function (value, index) {
            var _a = _this.props, selectedDate = _a.selectedDate, viewDate = _a.viewDate;
            // 变更年份、月份的时候，需要更新columns
            if (index === 1 || index === 0) {
                var currentDate = (selectedDate || viewDate || (0, moment_1.default)()).clone();
                // 只需计算year 、month
                var selectDate = (0, helper_1.convertArrayValueToMoment)(value, ['year', 'month'], currentDate);
                var dateBoundary = _this.props.getDateBoundary(selectDate);
                _this.setState({
                    columns: _this.props.getColumns(_this.state.types, dateBoundary),
                    pickerValue: value
                });
            }
        };
        _this.renderPicker = function () {
            var __ = _this.props.translate;
            var title = _this.state.types.length > 3 ? __('Date.titleTime') : __('Date.titleDate');
            return (react_1.default.createElement(Picker_1.default, { translate: _this.props.translate, locale: _this.props.locale, title: title, columns: _this.state.columns, value: _this.state.pickerValue, onChange: _this.onPickerChange, onConfirm: _this.onPickerConfirm, onClose: _this.cancel }));
        };
        var selectedDate = props.selectedDate, viewDate = props.viewDate, timeFormat = props.timeFormat;
        var currentDate = selectedDate || (0, moment_1.default)();
        var types = ['year', 'month', 'date'];
        timeFormat.split(':').forEach(function (format) {
            var type = /h/i.test(format)
                ? 'hours'
                : /m/.test(format)
                    ? 'minutes'
                    : /s/.test(format)
                        ? 'seconds'
                        : '';
            type && types.push(type);
        });
        var dateBoundary = _this.props.getDateBoundary(currentDate);
        var columns = _this.props.getColumns(types, dateBoundary);
        _this.state = {
            columns: columns,
            types: types,
            pickerValue: currentDate.toArray(),
            uniqueTag: 0
        };
        if (_this.props.timeConstraints) {
            _this.timeConstraints = (0, merge_1.default)(_this.timeConstraints, props.timeConstraints);
        }
        return _this;
    }
    CustomDaysView.prototype.getDaysOfWeek = function (locale) {
        var days = locale._weekdaysMin, first = locale.firstDayOfWeek(), dow = [], i = 0;
        days.forEach(function (day) {
            dow[(7 + i++ - first) % 7] = day;
        });
        return dow;
    };
    CustomDaysView.prototype.alwaysValidDate = function () {
        return 1;
    };
    CustomDaysView.prototype.renderDays = function () {
        var date = this.props.viewDate, selected = this.props.selectedDate && this.props.selectedDate.clone(), prevMonth = date.clone().subtract(1, 'months'), currentYear = date.year(), currentMonth = date.month(), weeks = [], days = [], renderer = this.props.renderDay || this.renderDay, isValid = this.props.isValidDate || this.alwaysValidDate, classes, isDisabled, dayProps, currentDate;
        // Go to the last week of the previous month
        prevMonth.date(prevMonth.daysInMonth()).startOf('week');
        var lastDay = prevMonth.clone().add(42, 'd');
        while (prevMonth.isBefore(lastDay)) {
            classes = 'rdtDay';
            currentDate = prevMonth.clone();
            if ((prevMonth.year() === currentYear &&
                prevMonth.month() < currentMonth) ||
                prevMonth.year() < currentYear)
                classes += ' rdtOld';
            else if ((prevMonth.year() === currentYear &&
                prevMonth.month() > currentMonth) ||
                prevMonth.year() > currentYear)
                classes += ' rdtNew';
            if (selected && prevMonth.isSame(selected, 'day'))
                classes += ' rdtActive';
            if (prevMonth.isSame((0, moment_1.default)(), 'day'))
                classes += ' rdtToday';
            isDisabled = !isValid(currentDate, selected);
            if (isDisabled)
                classes += ' rdtDisabled';
            dayProps = {
                'key': prevMonth.format('M_D'),
                'data-value': prevMonth.date(),
                'className': classes
            };
            if (!isDisabled)
                dayProps.onClick = this.updateSelectedDate;
            days.push(renderer(dayProps, currentDate, selected));
            if (days.length === 7) {
                weeks.push(react_1.default.createElement('tr', { key: prevMonth.format('M_D') }, days));
                days = [];
            }
            prevMonth.add(1, 'd');
        }
        return weeks;
    };
    CustomDaysView.prototype.componentWillMount = function () {
        this.setState({ uniqueTag: new Date().valueOf() });
    };
    CustomDaysView.prototype.componentDidMount = function () {
        var _this = this;
        var _a = this.props, timeFormat = _a.timeFormat, selectedDate = _a.selectedDate, viewDate = _a.viewDate, isEndDate = _a.isEndDate;
        var formatMap = {
            hours: 'HH',
            minutes: 'mm',
            seconds: 'ss'
        };
        var date = selectedDate || (isEndDate ? viewDate.endOf('day') : viewDate);
        timeFormat.split(':').forEach(function (format, i) {
            var type = /h/i.test(format)
                ? 'hours'
                : /m/.test(format)
                    ? 'minutes'
                    : /s/.test(format)
                        ? 'seconds'
                        : '';
            if (type) {
                _this.scrollToTop(type, parseInt(date.format(formatMap[type]), 10), i, 'init');
            }
        });
    };
    /** 时间选择器数据源 */
    CustomDaysView.prototype.computedTimeOptions = function (timeScale) {
        var _a;
        var _b = (_a = this.timeConstraints) === null || _a === void 0 ? void 0 : _a[timeScale], min = _b.min, max = _b.max, step = _b.step;
        return Array.from({ length: max - min + 1 }, function (item, index) {
            var value = (index + min)
                .toString()
                .padStart(timeScale !== 'milliseconds' ? 2 : 3, '0');
            return index % step === 0 ? { label: value, value: value } : undefined;
        }).filter(function (item) { return !!item; });
    };
    CustomDaysView.prototype.render = function () {
        var _a = this.props, date = _a.viewDate, useMobileUI = _a.useMobileUI, embed = _a.embed, timeFormat = _a.timeFormat, cx = _a.classnames;
        var locale = date.localeData();
        var __ = this.props.translate;
        if ((0, helper_1.isMobile)() && useMobileUI && !embed) {
            return react_1.default.createElement("div", { className: "rdtYears" }, this.renderPicker());
        }
        var tableChildren = [
            this.props.hideHeader ? null : (react_1.default.createElement("thead", { key: "th" },
                react_1.default.createElement("tr", null,
                    react_1.default.createElement("th", { colSpan: 7 },
                        react_1.default.createElement("div", { className: "rdtHeader" },
                            react_1.default.createElement("a", { className: "rdtPrev", onClick: this.props.subtractTime(1, 'years') }, "\u00AB"),
                            react_1.default.createElement("a", { className: "rdtPrev", onClick: this.props.subtractTime(1, 'months') }, "\u2039"),
                            react_1.default.createElement("div", { className: "rdtCenter" },
                                react_1.default.createElement("a", { className: "rdtSwitch", onClick: this.props.showView('years') }, date.format(__('dateformat.year'))),
                                react_1.default.createElement("a", { className: "rdtSwitch", onClick: this.props.showView('months') }, date.format(__('MMM')))),
                            react_1.default.createElement("a", { className: "rdtNext", onClick: this.props.addTime(1, 'months') }, "\u203A"),
                            react_1.default.createElement("a", { className: "rdtNext", onClick: this.props.addTime(1, 'years') }, "\u00BB")))),
                react_1.default.createElement("tr", null, this.getDaysOfWeek(locale).map(function (day, index) { return (react_1.default.createElement("th", { key: day + index, className: "dow" }, day)); })))),
            react_1.default.createElement("tbody", { key: "tb" }, this.renderDays())
        ];
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement("div", { className: timeFormat ? 'rdtDays' : '' },
                react_1.default.createElement("table", { className: timeFormat ? 'rdtDaysPart' : '' }, tableChildren),
                timeFormat ? (react_1.default.createElement("div", { className: timeFormat.toLowerCase().indexOf('s') > 0
                        ? 'rdtTimePartWithS'
                        : 'rdtTimePart' }, this.renderTimes())) : null),
            react_1.default.createElement("table", null, this.renderFooter())));
    };
    return CustomDaysView;
}(react_1.default.Component));
exports.CustomDaysView = CustomDaysView;
exports.default = (0, locale_1.localeable)(CustomDaysView);
//# sourceMappingURL=./components/calendar/DaysView.js.map
