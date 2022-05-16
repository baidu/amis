"use strict";
/**
 * @file CalendarMobile
 * @description 移动端日历组件
 * @author hongyang03
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarMobile = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var moment_1 = (0, tslib_1.__importDefault)(require("moment"));
var Calendar_1 = (0, tslib_1.__importDefault)(require("./calendar/Calendar"));
var theme_1 = require("../theme");
var locale_1 = require("../locale");
var helper_1 = require("../utils/helper");
var CalendarMobile = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(CalendarMobile, _super);
    function CalendarMobile(props) {
        var _this = _super.call(this, props) || this;
        _this.mobileBody = react_1.default.createRef();
        _this.mobileHeader = react_1.default.createRef();
        var _a = _this.props, startDate = _a.startDate, endDate = _a.endDate, defaultDate = _a.defaultDate, minDate = _a.minDate, maxDate = _a.maxDate;
        var dateRange = _this.getDateRange(minDate, maxDate, defaultDate);
        _this.state = {
            minDate: dateRange.minDate,
            maxDate: dateRange.maxDate,
            startDate: startDate,
            endDate: endDate,
            showToast: false,
            currentDate: dateRange.currentDate,
            isScrollToBottom: false,
            dateTime: endDate ? [endDate.hour(), endDate.minute()] : [0, 0]
        };
        return _this;
    }
    CalendarMobile.prototype.getDateRange = function (minDate, maxDate, defaultDate) {
        !moment_1.default.isMoment(minDate) || !minDate.isValid() && (minDate = undefined);
        !moment_1.default.isMoment(maxDate) || !maxDate.isValid() && (maxDate = undefined);
        var currentDate = defaultDate || (0, moment_1.default)();
        var dateRange = {
            minDate: currentDate.clone().subtract(1, 'year').startOf('months'),
            maxDate: currentDate.clone().add(1, 'year').endOf('months')
        };
        if (minDate && maxDate) {
            dateRange = {
                minDate: minDate,
                maxDate: maxDate
            };
        }
        else if (minDate && !maxDate) {
            dateRange = {
                minDate: minDate,
                maxDate: (0, moment_1.default)(minDate).add(2, 'year')
            };
            currentDate = minDate.clone();
        }
        else if (!minDate && maxDate) {
            dateRange = {
                minDate: (0, moment_1.default)(maxDate).subtract(2, 'year'),
                maxDate: maxDate
            };
            currentDate = maxDate.clone();
        }
        if (!currentDate.isBetween(dateRange.minDate, dateRange.maxDate, 'days', '[]')) {
            currentDate = dateRange.minDate.clone();
        }
        return (0, tslib_1.__assign)((0, tslib_1.__assign)({}, dateRange), { currentDate: currentDate });
    };
    CalendarMobile.prototype.componentDidMount = function () {
        this.initMonths();
    };
    CalendarMobile.prototype.componentDidUpdate = function (prevProps) {
        var _this = this;
        var props = this.props;
        if (prevProps.minDate !== props.minDate || prevProps.maxDate !== props.maxDate) {
            var currentDate = this.state.currentDate;
            var dateRange = this.getDateRange(props.minDate, props.maxDate, (0, moment_1.default)(currentDate));
            this.setState({
                minDate: dateRange.minDate,
                maxDate: dateRange.maxDate,
                currentDate: dateRange.currentDate,
            }, function () { return _this.initMonths(); });
        }
    };
    CalendarMobile.prototype.componentWillUnmount = function () {
        this.setState({ showToast: false });
        clearTimeout(this.timer);
    };
    CalendarMobile.prototype.initMonths = function () {
        if (this.mobileBody.current) {
            var header = this.mobileHeader.current;
            var monthHeights = [];
            var monthCollection = this.mobileBody.current.children;
            for (var i = 0; i < monthCollection.length; i++) {
                monthHeights[i] = monthCollection[i].offsetTop - header.clientHeight;
            }
            this.setState({
                monthHeights: monthHeights
            });
            var defaultDate = this.props.defaultDate || this.state.currentDate;
            this.scollToDate(defaultDate ? (0, moment_1.default)(defaultDate) : (0, moment_1.default)());
        }
    };
    CalendarMobile.prototype.scollToDate = function (date) {
        var showViewMode = this.props.showViewMode;
        var minDate = this.state.minDate;
        var index = date.diff(minDate, showViewMode);
        var currentEl = this.mobileBody.current.children[index];
        if (!currentEl) {
            return;
        }
        var header = this.mobileHeader.current;
        this.mobileBody.current.scrollBy(0, currentEl.offsetTop - this.mobileBody.current.scrollTop - header.clientHeight);
    };
    CalendarMobile.prototype.onMobileBodyScroll = function (e) {
        var _a, _b;
        var showViewMode = this.props.showViewMode;
        var monthHeights = this.state.monthHeights;
        var minDate = (_a = this.state.minDate) === null || _a === void 0 ? void 0 : _a.clone();
        if (!((_b = this.mobileBody) === null || _b === void 0 ? void 0 : _b.current) || !monthHeights || !minDate) {
            return;
        }
        var scrollTop = this.mobileBody.current.scrollTop;
        var clientHeight = this.mobileBody.current.clientHeight;
        var scrollHeight = this.mobileBody.current.scrollHeight;
        var i = 0;
        for (i; i < monthHeights.length; i++) {
            if (scrollTop < monthHeights[i]) {
                break;
            }
        }
        i--;
        i < 0 && (i = 0);
        var currentDate = minDate.add(i, showViewMode);
        this.setState({
            currentDate: currentDate,
            isScrollToBottom: scrollTop + clientHeight === scrollHeight
        });
    };
    CalendarMobile.prototype.scrollPreYear = function () {
        if (!this.state.currentDate) {
            return;
        }
        var _a = this.state, currentDate = _a.currentDate, minDate = _a.minDate;
        currentDate = currentDate.clone().subtract(1, 'years');
        if (minDate && currentDate.isBefore(minDate)) {
            currentDate = minDate;
        }
        this.setState({
            currentDate: currentDate
        });
        this.scollToDate(currentDate);
    };
    CalendarMobile.prototype.scrollAfterYear = function () {
        if (!this.state.currentDate) {
            return;
        }
        var _a = this.state, currentDate = _a.currentDate, maxDate = _a.maxDate;
        currentDate = currentDate.clone().add(1, 'years');
        if (maxDate && currentDate.isAfter(maxDate)) {
            currentDate = maxDate;
        }
        this.setState({
            currentDate: currentDate
        });
        this.scollToDate(currentDate);
    };
    CalendarMobile.prototype.getDaysOfWeek = function () {
        var locale = (0, moment_1.default)().localeData();
        var days = locale.weekdaysMin();
        var first = locale.firstDayOfWeek();
        var dow = [];
        var i = 0;
        days.forEach(function (day) {
            dow[(7 + (i++) - first) % 7] = day;
        });
        return dow;
    };
    CalendarMobile.prototype.handleCalendarClick = function (isDisabled) {
        var _this = this;
        if (isDisabled) {
            this.setState({ showToast: true });
            this.timer = setTimeout(function () {
                _this.setState({ showToast: false });
            }, 2000);
        }
    };
    CalendarMobile.prototype.getRenderProps = function (props, currentDate) {
        var _a = this.state, startDate = _a.startDate, endDate = _a.endDate;
        var _b = this.props, __ = _b.translate, viewMode = _b.viewMode, isDatePicker = _b.isDatePicker;
        var precision = viewMode === 'time' ? 'hours' : viewMode || 'day';
        var footerText = '';
        if (startDate &&
            endDate &&
            currentDate.isBetween(startDate, endDate, precision, '()')) {
            props.className += ' rdtBetween';
        }
        else if (startDate
            && endDate
            && startDate.isSame(endDate, precision)
            && currentDate.isSame(startDate, precision)) {
            props.className += ' rdtRangeStart';
            footerText = __('Calendar.beginAndEnd');
        }
        else if (startDate && currentDate.isSame(startDate, precision)) {
            props.className += ' rdtRangeStart';
            footerText = __('Calendar.begin');
            if (endDate) {
                props.className += ' rdtRangeHasEnd';
            }
        }
        else if (endDate && currentDate.isSame(endDate, precision)) {
            props.className += ' rdtRangeEnd';
            footerText = __('Calendar.end');
        }
        if (precision === 'day' && currentDate.date() === 1 && currentDate.day() === 1) {
            props.className += ' rdtOldNone';
        }
        if (isDatePicker) {
            footerText = '';
        }
        var rdtDisabled = props.className.indexOf('rdtDisabled') > -1;
        return {
            props: props,
            footerText: footerText,
            rdtDisabled: rdtDisabled
        };
    };
    CalendarMobile.prototype.handleTimeChange = function (newTime) {
        var _this = this;
        if (!newTime) {
            return;
        }
        var onChange = this.props.onChange;
        var _a = this.state, startDate = _a.startDate, endDate = _a.endDate;
        if (startDate) {
            var obj = {
                dateTime: newTime,
                startDate: endDate ? startDate : startDate === null || startDate === void 0 ? void 0 : startDate.clone().set({ hour: newTime[0], minute: newTime[1], second: newTime[2] || 0 }),
                endDate: !endDate ? endDate : endDate === null || endDate === void 0 ? void 0 : endDate.clone().set({ hour: newTime[0], minute: newTime[1], second: newTime[2] || 0 })
            };
            this.setState(obj, function () {
                onChange && onChange(_this.state);
            });
        }
    };
    CalendarMobile.prototype.checkIsValidDate = function (currentDate) {
        var _a = this.state, startDate = _a.startDate, endDate = _a.endDate, minDate = _a.minDate, maxDate = _a.maxDate;
        var _b = this.props, minDuration = _b.minDuration, maxDuration = _b.maxDuration, viewMode = _b.viewMode;
        var precision = viewMode === 'time' ? 'hours' : viewMode || 'day';
        if (minDate && currentDate.isBefore(minDate, precision)) {
            return false;
        }
        else if (maxDate && currentDate.isAfter(maxDate, precision)) {
            return false;
        }
        else if (startDate && !endDate) {
            if (minDuration
                && currentDate.isBefore(startDate.clone().add(minDuration))
                && currentDate.isSameOrAfter(startDate)) {
                return false;
            }
            else if (maxDuration && currentDate.isAfter(startDate.clone().add(maxDuration))) {
                return false;
            }
        }
        return true;
    };
    CalendarMobile.prototype.renderMobileDay = function (props, currentDate) {
        var _this = this;
        var cx = this.props.classnames;
        var renderProps = this.getRenderProps(props, currentDate);
        return react_1.default.createElement("td", (0, tslib_1.__assign)({}, renderProps.props),
            react_1.default.createElement("div", { className: "calendar-wrap", onClick: function () { return _this.handleCalendarClick(renderProps.rdtDisabled); } },
                currentDate.date(),
                react_1.default.createElement("div", { className: cx('CalendarMobile-range-text') }, renderProps.footerText)));
    };
    CalendarMobile.prototype.renderMonth = function (props, month, year) {
        var _this = this;
        var cx = this.props.classnames;
        var currentDate = (0, moment_1.default)().year(year).month(month);
        var monthStr = currentDate
            .localeData()
            .monthsShort(currentDate.month(month));
        var strLength = 3;
        var monthStrFixedLength = monthStr.substring(0, strLength);
        var renderProps = this.getRenderProps(props, currentDate);
        return (react_1.default.createElement("td", (0, tslib_1.__assign)({}, renderProps.props),
            react_1.default.createElement("div", { className: "calendar-wrap", onClick: function () { return _this.handleCalendarClick(renderProps.rdtDisabled); } },
                monthStrFixedLength,
                react_1.default.createElement("div", { className: cx('CalendarMobile-range-text') }, renderProps.footerText))));
    };
    CalendarMobile.prototype.renderQuarter = function (props, quarter, year) {
        var _this = this;
        var cx = this.props.classnames;
        var currentDate = (0, moment_1.default)().year(year).quarter(quarter);
        var renderProps = this.getRenderProps(props, currentDate);
        return (react_1.default.createElement("td", (0, tslib_1.__assign)({}, props),
            react_1.default.createElement("div", { className: "calendar-wrap", onClick: function () { return _this.handleCalendarClick(renderProps.rdtDisabled); } },
                "Q",
                quarter,
                react_1.default.createElement("div", { className: cx('CalendarMobile-range-text') }, renderProps.footerText))));
    };
    CalendarMobile.prototype.handleMobileChange = function (newValue) {
        var _this = this;
        var _a = this.props, embed = _a.embed, minDuration = _a.minDuration, maxDuration = _a.maxDuration, confirm = _a.confirm, onChange = _a.onChange, viewMode = _a.viewMode, isDatePicker = _a.isDatePicker;
        var _b = this.state, startDate = _b.startDate, endDate = _b.endDate, dateTime = _b.dateTime, minDate = _b.minDate, maxDate = _b.maxDate;
        var precision = viewMode === 'time' ? 'hours' : viewMode || 'day';
        if (minDate && newValue && newValue.isBefore(minDate, 'second')) {
            newValue = minDate;
        }
        if (maxDate && newValue && newValue.isAfter(maxDate, 'second')) {
            newValue = maxDate;
        }
        if (!isDatePicker &&
            startDate &&
            !endDate &&
            newValue.isSameOrAfter(startDate) &&
            (!minDuration || newValue.isSameOrAfter(startDate.clone().add(minDuration))) &&
            (!maxDuration || newValue.isSameOrBefore(startDate.clone().add(maxDuration)))) {
            return this.setState({
                endDate: newValue.clone().endOf(precision).set({ hour: dateTime[0], minute: dateTime[1], second: dateTime[2] || 0 })
            }, function () {
                onChange && onChange(_this.state, function () { return embed && confirm && confirm(startDate, endDate); });
            });
        }
        this.setState({
            startDate: newValue.clone().startOf(precision).set({ hour: dateTime[0], minute: dateTime[1], second: dateTime[2] || 0 }),
            endDate: undefined
        }, function () {
            onChange && onChange(_this.state);
        });
    };
    CalendarMobile.prototype.renderMobileCalendarBody = function () {
        var _this = this;
        var _a = this.props, cx = _a.classnames, dateFormat = _a.dateFormat, timeFormat = _a.timeFormat, inputFormat = _a.inputFormat, locale = _a.locale, _b = _a.viewMode, viewMode = _b === void 0 ? 'days' : _b, close = _a.close, defaultDate = _a.defaultDate, showViewMode = _a.showViewMode;
        var __ = this.props.translate;
        var _c = this.state, minDate = _c.minDate, maxDate = _c.maxDate;
        if (!minDate || !maxDate) {
            return;
        }
        var calendarDates = [];
        for (var minDateClone = minDate.clone(); minDateClone.isSameOrBefore(maxDate); minDateClone.add(1, showViewMode)) {
            var date = minDateClone.clone();
            if (defaultDate) {
                date = (0, moment_1.default)(defaultDate).set({ year: date.get('year'), month: date.get('month') });
            }
            calendarDates.push(date);
        }
        return (react_1.default.createElement("div", { className: cx('CalendarMobile-body'), ref: this.mobileBody, onScroll: this.onMobileBodyScroll }, calendarDates.map(function (calendarDate, index) {
            var rdtOldNone = showViewMode === 'months'
                && calendarDate.clone().startOf('month').day() === 1
                ? 'rdtOldNone' : '';
            return react_1.default.createElement("div", { className: cx('CalendarMobile-calendar-wrap', rdtOldNone), key: 'calendar-wrap' + index },
                showViewMode === 'months' && react_1.default.createElement("div", { className: cx('CalendarMobile-calendar-mark'), key: 'calendar-mark' + index }, calendarDate.month() + 1),
                react_1.default.createElement("div", { className: cx('CalendarMobile-calendar-header') },
                    react_1.default.createElement("span", { className: "rdtSwitch" }, calendarDate.format(__('dateformat.year'))),
                    showViewMode === 'months' && react_1.default.createElement("span", { className: "rdtSwitch" }, calendarDate.format(__('MMM')))),
                react_1.default.createElement(Calendar_1.default, { className: cx('CalendarMobile-calendar', rdtOldNone), viewDate: calendarDate, value: calendarDate, onChange: _this.handleMobileChange, requiredConfirm: false, dateFormat: dateFormat, inputFormat: inputFormat, timeFormat: '', isValidDate: _this.checkIsValidDate, viewMode: viewMode, input: false, onClose: close, renderDay: _this.renderMobileDay, renderMonth: _this.renderMonth, renderQuarter: _this.renderQuarter, locale: locale, hideHeader: true, updateOn: viewMode, key: 'calendar' + index }));
        })));
    };
    CalendarMobile.prototype.renderMobileTimePicker = function () {
        var _a = this.props, cx = _a.classnames, timeFormat = _a.timeFormat, locale = _a.locale, close = _a.close, timeConstraints = _a.timeConstraints, defaultDate = _a.defaultDate, isDatePicker = _a.isDatePicker;
        var __ = this.props.translate;
        var _b = this.state, startDate = _b.startDate, endDate = _b.endDate, dateTime = _b.dateTime;
        return (react_1.default.createElement("div", { className: cx('CalendarMobile-time') },
            react_1.default.createElement("div", { className: cx('CalendarMobile-time-title') }, isDatePicker ? __('Date.titleTime') : startDate && endDate ? __('Calendar.endPick') : __('Calendar.startPick')),
            react_1.default.createElement(Calendar_1.default, { className: cx('CalendarMobile-time-calendar'), value: defaultDate, onChange: this.handleTimeChange, requiredConfirm: false, timeFormat: timeFormat, viewMode: "time", input: false, onClose: close, locale: locale, useMobileUI: true, showToolbar: false, viewDate: (0, moment_1.default)().set({ hour: dateTime[0], minute: dateTime[1], second: dateTime[2] || 0 }), timeConstraints: timeConstraints, isValidDate: this.checkIsValidDate })));
    };
    CalendarMobile.prototype.render = function () {
        var _a = this.props, className = _a.className, cx = _a.classnames, embed = _a.embed, close = _a.close, confirm = _a.confirm, footerExtra = _a.footerExtra, timeFormat = _a.timeFormat, showViewMode = _a.showViewMode, isDatePicker = _a.isDatePicker;
        var __ = this.props.translate;
        var _b = this.state, startDate = _b.startDate, endDate = _b.endDate, currentDate = _b.currentDate, showToast = _b.showToast, isScrollToBottom = _b.isScrollToBottom, minDate = _b.minDate, maxDate = _b.maxDate;
        var dateNow = currentDate
            ? currentDate.format(__("Calendar.".concat(showViewMode === 'months' ? 'yearmonth' : 'year')))
            : (0, moment_1.default)().format(__("Calendar.".concat(showViewMode === 'months' ? 'yearmonth' : 'year')));
        var header = (react_1.default.createElement("div", { className: cx('CalendarMobile-header'), ref: this.mobileHeader },
            react_1.default.createElement("div", { className: cx('CalendarMobile-subtitle') },
                react_1.default.createElement("span", { className: "subtitle-text" },
                    currentDate && currentDate.isSameOrBefore(minDate, showViewMode)
                        ? null
                        : react_1.default.createElement("a", { className: "rdtPrev", onClick: this.scrollPreYear }, "\u2039"),
                    dateNow,
                    currentDate && currentDate.isSameOrAfter(maxDate, showViewMode) || isScrollToBottom
                        ? null
                        : react_1.default.createElement("a", { className: "rdtNext", onClick: this.scrollAfterYear }, "\u203A"))),
            showViewMode === 'months' ? react_1.default.createElement("div", { className: cx('CalendarMobile-weekdays') }, this.getDaysOfWeek().map(function (day, index) { return (react_1.default.createElement("span", { key: day + index, className: "weekday" }, day)); })) : null));
        var footer = (react_1.default.createElement("div", { className: cx('CalendarMobile-footer') },
            timeFormat && startDate && this.renderMobileTimePicker(),
            react_1.default.createElement("div", { className: cx('CalendarMobile-footer-toolbar') },
                react_1.default.createElement("div", { className: cx('CalendarMobile-footer-ranges') }, footerExtra),
                confirm && !embed && react_1.default.createElement("a", { className: cx('Button', 'Button--primary', 'date-range-confirm', {
                        'is-disabled': !startDate || !(endDate || isDatePicker)
                    }), onClick: function () {
                        confirm(startDate, endDate);
                        close && close();
                    } }, __('confirm')))));
        return (react_1.default.createElement("div", { className: cx('CalendarMobile', embed ? 'CalendarMobile-embed' : '', className) },
            react_1.default.createElement("div", { className: cx('CalendarMobile-wrap') },
                header,
                this.renderMobileCalendarBody(),
                footer),
            showToast ? react_1.default.createElement("div", { className: cx('CalendarMobile-toast') }, __('Calendar.toast')) : null));
    };
    var _a, _b, _c;
    CalendarMobile.defaultProps = {
        showViewMode: 'months'
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], CalendarMobile.prototype, "onMobileBodyScroll", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], CalendarMobile.prototype, "scrollPreYear", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], CalendarMobile.prototype, "scrollAfterYear", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Boolean]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], CalendarMobile.prototype, "handleCalendarClick", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], CalendarMobile.prototype, "handleTimeChange", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof moment_1.default !== "undefined" && moment_1.default.Moment) === "function" ? _a : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], CalendarMobile.prototype, "checkIsValidDate", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object, typeof (_b = typeof moment_1.default !== "undefined" && moment_1.default.Moment) === "function" ? _b : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], CalendarMobile.prototype, "renderMobileDay", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object, Number, Number]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], CalendarMobile.prototype, "renderMonth", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object, Number, Number]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], CalendarMobile.prototype, "renderQuarter", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_c = typeof moment_1.default !== "undefined" && moment_1.default.Moment) === "function" ? _c : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], CalendarMobile.prototype, "handleMobileChange", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], CalendarMobile.prototype, "renderMobileCalendarBody", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], CalendarMobile.prototype, "renderMobileTimePicker", null);
    return CalendarMobile;
}(react_1.default.Component));
exports.CalendarMobile = CalendarMobile;
;
exports.default = (0, theme_1.themeable)((0, locale_1.localeable)(CalendarMobile));
//# sourceMappingURL=./components/CalendarMobile.js.map
