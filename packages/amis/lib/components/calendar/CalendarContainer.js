"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var DaysView_1 = (0, tslib_1.__importDefault)(require("./DaysView"));
var YearsView_1 = (0, tslib_1.__importDefault)(require("./YearsView"));
var MonthsView_1 = (0, tslib_1.__importDefault)(require("./MonthsView"));
var TimeView_1 = (0, tslib_1.__importDefault)(require("./TimeView"));
var QuartersView_1 = (0, tslib_1.__importDefault)(require("./QuartersView"));
var CustomCalendarContainer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(CustomCalendarContainer, _super);
    function CustomCalendarContainer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.viewComponents = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, _this.viewComponents), { days: DaysView_1.default, years: YearsView_1.default, months: MonthsView_1.default, time: TimeView_1.default, quarters: QuartersView_1.default });
        return _this;
    }
    CustomCalendarContainer.prototype.render = function () {
        return react_1.default.createElement(this.viewComponents[this.props.view], this.props.viewProps);
    };
    return CustomCalendarContainer;
}(react_1.default.Component));
exports.default = CustomCalendarContainer;
//# sourceMappingURL=./components/calendar/CalendarContainer.js.map
