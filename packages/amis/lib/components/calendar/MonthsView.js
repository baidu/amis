"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomMonthsView = void 0;
var tslib_1 = require("tslib");
var moment_1 = (0, tslib_1.__importDefault)(require("moment"));
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var locale_1 = require("../../locale");
var Picker_1 = (0, tslib_1.__importDefault)(require("../Picker"));
var helper_1 = require("../../utils/helper");
var CustomMonthsView = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(CustomMonthsView, _super);
    function CustomMonthsView(props) {
        var _this = _super.call(this, props) || this;
        _this.renderMonth = function (props, month, year, date) {
            var localMoment = _this.props.viewDate;
            var monthStr = localMoment
                .localeData()
                .monthsShort(localMoment.month(month));
            var strLength = 3;
            // Because some months are up to 5 characters long, we want to
            // use a fixed string length for consistency
            var monthStrFixedLength = monthStr.substring(0, strLength);
            return (react_1.default.createElement("td", (0, tslib_1.__assign)({}, props),
                react_1.default.createElement("span", null, monthStrFixedLength)));
        };
        _this.onConfirm = function (value, types) {
            _this.props.onConfirm && _this.props.onConfirm(value, ['year', 'month']);
        };
        _this.onPickerChange = function (value, index) {
            var _a = _this.props, maxDate = _a.maxDate, minDate = _a.minDate;
            var year = (0, moment_1.default)().year();
            var columns = (0, tslib_1.__spreadArray)([], _this.state.columns, true);
            var maxDateObject = maxDate
                ? maxDate.toObject()
                : {
                    years: year + 100,
                    months: 11
                };
            var minDateObject = minDate
                ? minDate.toObject()
                : {
                    years: year - 100,
                    months: 0
                };
            var range = [];
            // 选择年份是最大值的年或者最小值的月时，需要重新计算月分选择的cloumn
            if (index === 0) {
                if (value[0] === minDateObject.years &&
                    value[0] === maxDateObject.years) {
                    range = (0, helper_1.getRange)(minDateObject.months, maxDateObject.months, 1);
                }
                else if (value[0] === minDateObject.years) {
                    range = (0, helper_1.getRange)(minDateObject.months, 11, 1);
                }
                else if (value[0] === maxDateObject.years) {
                    range = (0, helper_1.getRange)(0, maxDateObject.months, 1);
                }
                else {
                    range = (0, helper_1.getRange)(0, 11, 1);
                }
                columns[1] = {
                    options: range.map(function (i) {
                        return {
                            text: _this.props.timeCell(i + 1, 'month'),
                            value: i
                        };
                    })
                };
                _this.setState({ columns: columns, pickerValue: value });
            }
        };
        _this.renderPicker = function () {
            var __ = _this.props.translate;
            var title = __('Date.titleMonth');
            return (react_1.default.createElement(Picker_1.default, { translate: _this.props.translate, locale: _this.props.locale, title: title, columns: _this.state.columns, value: _this.state.pickerValue, onChange: _this.onPickerChange, onConfirm: _this.onConfirm, onClose: _this.props.onClose }));
        };
        var selectedDate = props.selectedDate, viewDate = props.viewDate;
        var currentDate = selectedDate || viewDate || (0, moment_1.default)();
        var dateBoundary = _this.props.getDateBoundary(currentDate);
        var columns = _this.props.getColumns(['year', 'month'], dateBoundary);
        _this.state = {
            columns: columns,
            pickerValue: currentDate.toArray()
        };
        _this.updateSelectedMonth = _this.updateSelectedMonth.bind(_this);
        return _this;
    }
    CustomMonthsView.prototype.renderMonths = function () {
        var date = this.props.selectedDate, month = this.props.viewDate.month(), year = this.props.viewDate.year(), rows = [], i = 0, months = [], renderer = this.props.renderMonth || this.renderMonth, isValid = this.props.isValidDate || this.alwaysValidDate, classes, props, currentMonth, isDisabled, noOfDaysInMonth, daysInMonth, validDay, 
        // Date is irrelevant because we're only interested in month
        irrelevantDate = 1;
        while (i < 12) {
            classes = 'rdtMonth';
            currentMonth = this.props.viewDate
                .clone()
                .set({ year: year, month: i, date: irrelevantDate });
            noOfDaysInMonth = parseInt(currentMonth.endOf('month').format('D'), 10);
            daysInMonth = Array.from({ length: noOfDaysInMonth }, function (e, i) {
                return i + 1;
            });
            validDay = daysInMonth.find(function (d) {
                var day = currentMonth.clone().set('date', d);
                return isValid(day);
            });
            isDisabled = validDay === undefined;
            if (isDisabled)
                classes += ' rdtDisabled';
            if (date && i === date.month() && year === date.year())
                classes += ' rdtActive';
            props = {
                'key': i,
                'data-value': i,
                'className': classes
            };
            if (!isDisabled)
                props.onClick =
                    this.props.updateOn === 'months'
                        ? this.updateSelectedMonth
                        : this.props.setDate && this.props.setDate('month');
            months.push(renderer(props, i, year, date && date.clone()));
            if (months.length === 4) {
                rows.push(react_1.default.createElement('tr', { key: i }, months));
                months = [];
            }
            i++;
        }
        return rows;
    };
    CustomMonthsView.prototype.updateSelectedMonth = function (event) {
        this.props.updateSelectedDate(event);
    };
    CustomMonthsView.prototype.alwaysValidDate = function () {
        return true;
    };
    CustomMonthsView.prototype.render = function () {
        var __ = this.props.translate;
        var showYearHead = !/^mm$/i.test(this.props.inputFormat || '') && !this.props.hideHeader;
        var canClick = /yy/i.test(this.props.inputFormat || '');
        if ((0, helper_1.isMobile)() && this.props.useMobileUI) {
            return react_1.default.createElement("div", { className: "rdtYears" }, this.renderPicker());
        }
        return (react_1.default.createElement("div", { className: "rdtMonths" },
            showYearHead && (react_1.default.createElement("table", null,
                react_1.default.createElement("thead", null,
                    react_1.default.createElement("tr", null,
                        react_1.default.createElement("th", { className: "rdtPrev", onClick: this.props.subtractTime(1, 'years') }, "\u00AB"),
                        canClick ? (react_1.default.createElement("th", { className: "rdtSwitch", onClick: this.props.showView('years') }, this.props.viewDate.format(__('dateformat.year')))) : (react_1.default.createElement("th", { className: "rdtSwitch" }, this.props.viewDate.format(__('dateformat.year')))),
                        react_1.default.createElement("th", { className: "rdtNext", onClick: this.props.addTime(1, 'years') }, "\u00BB"))))),
            react_1.default.createElement("table", null,
                react_1.default.createElement("tbody", null, this.renderMonths()))));
    };
    return CustomMonthsView;
}(react_1.default.Component));
exports.CustomMonthsView = CustomMonthsView;
exports.default = (0, locale_1.localeable)(CustomMonthsView);
//# sourceMappingURL=./components/calendar/MonthsView.js.map
