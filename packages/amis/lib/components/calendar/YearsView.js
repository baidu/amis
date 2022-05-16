"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomYearsView = void 0;
var tslib_1 = require("tslib");
var moment_1 = (0, tslib_1.__importDefault)(require("moment"));
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var locale_1 = require("../../locale");
var Picker_1 = (0, tslib_1.__importDefault)(require("../Picker"));
var helper_1 = require("../../utils/helper");
var CustomYearsView = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(CustomYearsView, _super);
    function CustomYearsView(props) {
        var _this = _super.call(this, props) || this;
        _this.renderYear = function (props, year, date) {
            return (react_1.default.createElement("td", (0, tslib_1.__assign)({}, props),
                react_1.default.createElement("span", null, year)));
        };
        _this.onConfirm = function (value) {
            _this.props.onConfirm && _this.props.onConfirm(value, ['year']);
        };
        _this.onPickerChange = function (value) {
            _this.setState({ pickerValue: value[0] });
        };
        _this.renderYearPicker = function () {
            var _a = _this.props, __ = _a.translate, minDate = _a.minDate, maxDate = _a.maxDate, selectedDate = _a.selectedDate, viewDate = _a.viewDate;
            var year = (selectedDate || viewDate || (0, moment_1.default)()).year();
            var maxYear = maxDate ? maxDate.toObject().years : year + 100;
            var minYear = minDate ? minDate.toObject().years : year - 100;
            var title = __('Date.titleYear');
            var columns = [
                {
                    options: (0, helper_1.getRange)(minYear, maxYear, 1)
                }
            ];
            return (react_1.default.createElement(Picker_1.default, { translate: _this.props.translate, locale: _this.props.locale, title: title, columns: columns, value: _this.state.pickerValue, onConfirm: _this.onConfirm, onChange: _this.onPickerChange, onClose: _this.props.onClose }));
        };
        var selectedDate = props.selectedDate, viewDate = props.viewDate;
        var currentDate = selectedDate || viewDate || (0, moment_1.default)();
        _this.state = {
            pickerValue: currentDate.toObject().years
        };
        _this.updateSelectedYear = _this.updateSelectedYear.bind(_this);
        return _this;
    }
    CustomYearsView.prototype.renderYears = function (year) {
        var years = [], i = -1, rows = [], renderer = this.props.renderYear || this.renderYear, selectedDate = this.props.selectedDate, isValid = this.props.isValidDate || this.alwaysValidDate, classes, props, currentYear, isDisabled, noOfDaysInYear, daysInYear, validDay, 
        // Month and date are irrelevant here because
        // we're only interested in the year
        irrelevantMonth = 0, irrelevantDate = 1;
        year--;
        while (i < 11) {
            classes = 'rdtYear';
            currentYear = this.props.viewDate
                .clone()
                .set({ year: year, month: irrelevantMonth, date: irrelevantDate });
            noOfDaysInYear = parseInt(currentYear.endOf('year').format('DDD'), 10);
            daysInYear = Array.from({ length: noOfDaysInYear }, function (e, i) {
                return i + 1;
            });
            validDay = daysInYear.find(function (d) {
                var day = currentYear.clone().dayOfYear(d);
                return isValid(day);
            });
            isDisabled = validDay === undefined;
            if (isDisabled)
                classes += ' rdtDisabled';
            if (selectedDate && selectedDate.year() === year)
                classes += ' rdtActive';
            // 第一个和最后一个置灰
            if (i === -1 || i === 10)
                classes += ' text-muted';
            props = {
                'key': year,
                'data-value': year,
                'className': classes
            };
            if (!isDisabled)
                props.onClick =
                    this.props.updateOn === 'years'
                        ? this.updateSelectedYear
                        : this.props.setDate && this.props.setDate('year');
            years.push(renderer(props, year, selectedDate && selectedDate.clone()));
            if (years.length === 4) {
                rows.push(react_1.default.createElement('tr', { key: i }, years));
                years = [];
            }
            year++;
            i++;
        }
        return rows;
    };
    CustomYearsView.prototype.updateSelectedYear = function (event) {
        this.props.updateSelectedDate(event);
    };
    CustomYearsView.prototype.alwaysValidDate = function () {
        return true;
    };
    CustomYearsView.prototype.render = function () {
        var year = this.props.viewDate.year();
        year = year - (year % 10);
        var __ = this.props.translate;
        if ((0, helper_1.isMobile)() && this.props.useMobileUI) {
            return react_1.default.createElement("div", { className: "rdtYears" }, this.renderYearPicker());
        }
        return (react_1.default.createElement("div", { className: "rdtYears" },
            react_1.default.createElement("table", null,
                react_1.default.createElement("thead", null,
                    react_1.default.createElement("tr", null,
                        react_1.default.createElement("th", { className: "rdtPrev", onClick: this.props.subtractTime(10, 'years') }, "\u00AB"),
                        react_1.default.createElement("th", { className: "rdtSwitch" }, __('year-to-year', { from: year, to: year + 9 })),
                        react_1.default.createElement("th", { className: "rdtNext", onClick: this.props.addTime(10, 'years') }, "\u00BB")))),
            react_1.default.createElement("table", null,
                react_1.default.createElement("tbody", null, this.renderYears(year)))));
    };
    return CustomYearsView;
}(react_1.default.Component));
exports.CustomYearsView = CustomYearsView;
exports.default = (0, locale_1.localeable)(CustomYearsView);
//# sourceMappingURL=./components/calendar/YearsView.js.map
