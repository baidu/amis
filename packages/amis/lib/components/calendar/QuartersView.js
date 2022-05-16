"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuarterView = void 0;
var tslib_1 = require("tslib");
var moment_1 = (0, tslib_1.__importDefault)(require("moment"));
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var locale_1 = require("../../locale");
var QuarterView = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(QuarterView, _super);
    function QuarterView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.renderQuarter = function (props, quartar, year, date) {
            return (react_1.default.createElement("td", (0, tslib_1.__assign)({}, props),
                react_1.default.createElement("span", null,
                    "Q",
                    quartar)));
        };
        _this.updateSelectedQuarter = function (event) {
            _this.props.updateSelectedDate(event);
        };
        return _this;
    }
    QuarterView.prototype.renderYear = function () {
        var __ = this.props.translate;
        var showYearHead = !/^mm$/i.test(this.props.inputFormat || '');
        if (!showYearHead) {
            return null;
        }
        var canClick = /yy/i.test(this.props.inputFormat || '');
        return (react_1.default.createElement("table", null,
            react_1.default.createElement("thead", null,
                react_1.default.createElement("tr", null,
                    react_1.default.createElement("th", { className: "rdtPrev", onClick: this.props.subtractTime(1, 'years') }, "\u00AB"),
                    canClick ? (react_1.default.createElement("th", { className: "rdtSwitch", onClick: this.props.showView('years') }, this.props.viewDate.format(__('dateformat.year')))) : (react_1.default.createElement("th", { className: "rdtSwitch" }, this.props.viewDate.format(__('dateformat.year')))),
                    react_1.default.createElement("th", { className: "rdtNext", onClick: this.props.addTime(1, 'years') }, "\u00BB")))));
    };
    QuarterView.prototype.renderQuarters = function () {
        var date = this.props.selectedDate, quarter = this.props.viewDate.quarter(), year = this.props.viewDate.year(), rows = [], i = 1, quarters = [], renderer = this.props.renderQuarter || this.renderQuarter, isValid = this.props.isValidDate || this.alwaysValidDate, classes, props, isDisabled;
        while (i < 5) {
            classes = 'rdtQuarter';
            isDisabled = !isValid((0, moment_1.default)("".concat(year, "-").concat(i), 'YYYY-Q'));
            if (isDisabled)
                classes += ' rdtDisabled';
            if (date && i === date.quarter() && year === date.year())
                classes += ' rdtActive';
            props = {
                'key': i,
                'data-value': i,
                'className': classes
            };
            if (!isDisabled) {
                props.onClick =
                    this.props.updateOn === 'quarters'
                        ? this.updateSelectedQuarter
                        : this.props.setDate('quarter');
            }
            quarters.push(renderer(props, i, year, date && date.clone()));
            if (quarters.length === 2) {
                rows.push(react_1.default.createElement('tr', { key: quarter + '_' + rows.length }, quarters));
                quarters = [];
            }
            i++;
        }
        return rows;
    };
    QuarterView.prototype.alwaysValidDate = function () {
        return true;
    };
    QuarterView.prototype.render = function () {
        var _a = this.props, cx = _a.classnames, hideHeader = _a.hideHeader;
        return (react_1.default.createElement("div", { className: cx('ClalendarQuarter') },
            hideHeader ? null : this.renderYear(),
            react_1.default.createElement("table", null,
                react_1.default.createElement("tbody", null, this.renderQuarters()))));
    };
    return QuarterView;
}(react_1.default.Component));
exports.QuarterView = QuarterView;
exports.default = (0, locale_1.localeable)(QuarterView);
//# sourceMappingURL=./components/calendar/QuartersView.js.map
