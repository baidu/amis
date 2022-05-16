"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomTimeView = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var merge_1 = (0, tslib_1.__importDefault)(require("lodash/merge"));
var locale_1 = require("../../locale");
var icons_1 = require("../icons");
var Picker_1 = (0, tslib_1.__importDefault)(require("../Picker"));
var helper_1 = require("../../utils/helper");
var downshift_1 = (0, tslib_1.__importDefault)(require("downshift"));
var CustomTimeView = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(CustomTimeView, _super);
    function CustomTimeView(props) {
        var _this = _super.call(this, props) || this;
        _this.padValues = {
            hours: 2,
            minutes: 2,
            seconds: 2,
            milliseconds: 3
        };
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
        _this.renderDayPart = function () {
            var _a = _this.props, __ = _a.translate, cx = _a.classnames;
            return (react_1.default.createElement("div", { key: "dayPart", className: cx('CalendarCounter CalendarCounter--daypart') },
                react_1.default.createElement("span", { key: "up", className: cx('CalendarCounter-btn CalendarCounter-btn--up'), onClick: _this.onStartClicking('toggleDayPart', 'hours'), onContextMenu: _this.disableContextMenu },
                    react_1.default.createElement(icons_1.Icon, { icon: "right-arrow-bold" })),
                react_1.default.createElement("div", { className: cx('CalendarCounter-value'), key: _this.state.daypart }, __(_this.state.daypart)),
                react_1.default.createElement("span", { key: "down", className: cx('CalendarCounter-btn CalendarCounter-btn--down'), onClick: _this.onStartClicking('toggleDayPart', 'hours'), onContextMenu: _this.disableContextMenu },
                    react_1.default.createElement(icons_1.Icon, { icon: "right-arrow-bold" }))));
        };
        _this.getCounterValue = function (type) {
            if (type !== 'daypart') {
                var value = _this.state[type];
                if (type === 'hours' &&
                    _this.props.timeFormat.toLowerCase().indexOf(' a') !== -1) {
                    value = ((value - 1) % 12) + 1;
                    if (value === 0) {
                        value = 12;
                    }
                }
                return parseInt(value);
            }
            return 0;
        };
        _this.renderCounter = function (type) {
            var cx = _this.props.classnames;
            if (type !== 'daypart') {
                var value = _this.getCounterValue(type);
                var _a = _this.timeConstraints[type], min_1 = _a.min, max_1 = _a.max, step = _a.step;
                return (react_1.default.createElement("div", { key: type, className: cx('CalendarCounter') },
                    react_1.default.createElement("span", { key: "up", className: cx('CalendarCounter-btn CalendarCounter-btn--up'), onMouseDown: _this.onStartClicking('increase', type), onContextMenu: _this.disableContextMenu },
                        react_1.default.createElement(icons_1.Icon, { icon: "right-arrow-bold" })),
                    react_1.default.createElement("div", { key: "c", className: cx('CalendarCounter-value') },
                        react_1.default.createElement("input", { type: "text", value: _this.pad(type, value), className: cx('CalendarInput'), min: min_1, max: max_1, step: step, onChange: function (e) {
                                return _this.props.setTime(type, Math.max(min_1, Math.min(parseInt(e.currentTarget.value.replace(/\D/g, ''), 10) ||
                                    0, max_1)));
                            } })),
                    react_1.default.createElement("span", { key: "do", className: cx('CalendarCounter-btn CalendarCounter-btn--down'), onMouseDown: _this.onStartClicking('decrease', type), onContextMenu: _this.disableContextMenu },
                        react_1.default.createElement(icons_1.Icon, { icon: "right-arrow-bold" }))));
            }
            return null;
        };
        _this.onConfirm = function (value) {
            // 修正am、pm
            var hourIndex = _this.state.counters.indexOf('hours');
            if (hourIndex !== -1 &&
                _this.state.daypart !== false &&
                _this.props.timeFormat.toLowerCase().indexOf(' a') !== -1) {
                var amMode = value.splice(-1, 1)[0];
                var hour = value[hourIndex] % 12;
                // 修正pm
                amMode.toLowerCase().indexOf('p') !== -1 && (hour = hour + 12);
                value[hourIndex] = hour;
            }
            _this.props.onConfirm &&
                _this.props.onConfirm(value, _this.state.counters);
        };
        _this.getDayPartOptions = function () {
            var __ = _this.props.translate;
            var options = ['am', 'pm'];
            if (_this.props.timeFormat.indexOf(' A') !== -1) {
                options = ['AM', 'PM'];
            }
            return options.map(function (daypart) { return ({
                text: __(daypart),
                value: daypart
            }); });
        };
        _this.onPickerChange = function (value, index) {
            var time = {};
            _this.state.counters.forEach(function (type, i) { return (time[type] = value[i]); });
            if (_this.state.daypart !== false &&
                index > _this.state.counters.length - 1) {
                time.daypart = value[value.length - 1];
            }
            _this.setState(function (prevState) {
                return (0, tslib_1.__assign)((0, tslib_1.__assign)({}, prevState), time);
            });
            // @ts-ignore
            _this.props.onChange && _this.props.onChange(value);
        };
        _this.renderTimeViewPicker = function () {
            var __ = _this.props.translate;
            var title = __('Date.titleTime');
            var columns = [];
            var values = [];
            _this.state.counters.forEach(function (type) {
                if (type !== 'daypart') {
                    var _a = _this.timeConstraints[type], min = _a.min, max = _a.max, step = _a.step;
                    // 修正am pm时hours可选最大值
                    if (type === 'hours' &&
                        _this.state.daypart !== false &&
                        _this.props.timeFormat.toLowerCase().indexOf(' a') !== -1) {
                        max = max > 12 ? 12 : max;
                    }
                    columns.push({
                        options: (0, helper_1.getRange)(min, max, step).map(function (item) {
                            return {
                                text: _this.pad(type, item),
                                value: item
                            };
                        })
                    });
                    values.push(parseInt(_this.state[type], 10));
                }
            });
            if (_this.state.daypart !== false) {
                columns.push({
                    options: _this.getDayPartOptions()
                });
                values.push(_this.state.daypart);
            }
            return (react_1.default.createElement(Picker_1.default, { translate: _this.props.translate, locale: _this.props.locale, title: title, columns: columns, value: values, onConfirm: _this.onConfirm, onClose: _this.props.onClose, showToolbar: _this.props.showToolbar, onChange: _this.onPickerChange }));
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
        _this.state = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, _this.calculateState(_this.props)), { uniqueTag: 0 });
        if (_this.props.timeConstraints) {
            _this.timeConstraints = (0, merge_1.default)(_this.timeConstraints, _this.props.timeConstraints);
        }
        return _this;
    }
    CustomTimeView.prototype.componentWillMount = function () {
        this.setState({ uniqueTag: new Date().valueOf() });
    };
    CustomTimeView.prototype.componentDidMount = function () {
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
    CustomTimeView.prototype.componentDidUpdate = function (preProps) {
        if (preProps.viewDate !== this.props.viewDate ||
            preProps.selectedDate !== this.props.selectedDate ||
            preProps.timeFormat !== this.props.timeFormat) {
            this.setState(this.calculateState(this.props));
        }
    };
    CustomTimeView.prototype.onStartClicking = function (action, type) {
        var me = this;
        return function () {
            var update = {};
            update[type] = me[action](type);
            me.setState(update);
            me.timer = setTimeout(function () {
                me.increaseTimer = setInterval(function () {
                    update[type] = me[action](type);
                    me.setState(update);
                }, 70);
            }, 500);
            me.mouseUpListener = function () {
                clearTimeout(me.timer);
                clearInterval(me.increaseTimer);
                me.props.setTime(type, me.state[type]);
                document.body.removeEventListener('mouseup', me.mouseUpListener);
                document.body.removeEventListener('touchend', me.mouseUpListener);
            };
            document.body.addEventListener('mouseup', me.mouseUpListener);
            document.body.addEventListener('touchend', me.mouseUpListener);
        };
    };
    CustomTimeView.prototype.updateMilli = function (e) {
        var milli = parseInt(e.target.value, 10);
        if (milli === e.target.value && milli >= 0 && milli < 1000) {
            this.props.setTime('milliseconds', milli);
            this.setState({ milliseconds: milli });
        }
    };
    CustomTimeView.prototype.renderHeader = function () {
        if (!this.props.dateFormat)
            return null;
        var date = this.props.selectedDate || this.props.viewDate;
        return react_1.default.createElement('thead', { key: 'h' }, react_1.default.createElement('tr', {}, react_1.default.createElement('th', {
            className: 'rdtSwitch',
            colSpan: 4,
            onClick: this.props.showView('days')
        }, date.format(this.props.dateFormat))));
    };
    CustomTimeView.prototype.toggleDayPart = function (type) {
        // type is always 'hours'
        var value = parseInt(this.state[type], 10) + 12;
        if (value > this.timeConstraints[type].max)
            value =
                this.timeConstraints[type].min +
                    (value - (this.timeConstraints[type].max + 1));
        return this.pad(type, value);
    };
    CustomTimeView.prototype.increase = function (type) {
        var value = parseInt(this.state[type], 10) + this.timeConstraints[type].step;
        if (value > this.timeConstraints[type].max)
            value =
                this.timeConstraints[type].min +
                    (value - (this.timeConstraints[type].max + 1));
        if (value < this.timeConstraints[type].min) {
            value = this.timeConstraints[type].min;
        }
        return this.pad(type, value);
    };
    CustomTimeView.prototype.decrease = function (type) {
        var value = parseInt(this.state[type], 10) - this.timeConstraints[type].step;
        if (value < this.timeConstraints[type].min)
            value =
                this.timeConstraints[type].max +
                    1 -
                    (this.timeConstraints[type].min - value);
        return this.pad(type, value);
    };
    CustomTimeView.prototype.pad = function (type, value) {
        var str = value + '';
        while (str.length < this.padValues[type])
            str = '0' + str;
        return str;
    };
    CustomTimeView.prototype.disableContextMenu = function (event) {
        event.preventDefault();
        return false;
    };
    CustomTimeView.prototype.calculateState = function (props) {
        var date = props.selectedDate || props.viewDate, format = props.timeFormat, counters = [];
        if (format.toLowerCase().indexOf('h') !== -1) {
            counters.push('hours');
            if (format.indexOf('m') !== -1) {
                counters.push('minutes');
                if (format.indexOf('s') !== -1) {
                    counters.push('seconds');
                }
            }
        }
        var hours = parseInt(date.format('H'), 10);
        var daypart = false;
        if (this.state !== null &&
            this.props.timeFormat.toLowerCase().indexOf(' a') !== -1) {
            if (this.props.timeFormat.indexOf(' A') !== -1) {
                daypart = hours >= 12 ? 'PM' : 'AM';
            }
            else {
                daypart = hours >= 12 ? 'pm' : 'am';
            }
        }
        return {
            hours: hours,
            minutes: date.format('mm'),
            seconds: date.format('ss'),
            milliseconds: date.format('SSS'),
            daypart: daypart,
            counters: counters
        };
    };
    CustomTimeView.prototype.computedTimeOptions = function (timeScale) {
        var _a;
        var _b = (_a = this.timeConstraints) === null || _a === void 0 ? void 0 : _a[timeScale], min = _b.min, max = _b.max, step = _b.step;
        return Array.from({ length: max - min + 1 }, function (item, index) {
            var value = (index + min)
                .toString()
                .padStart(timeScale !== 'milliseconds' ? 2 : 3, '0');
            return index % step === 0 ? { label: value, value: value } : undefined;
        }).filter(function (item) { return !!item; });
    };
    CustomTimeView.prototype.render = function () {
        var _this = this;
        var _a = this.props, timeFormat = _a.timeFormat, selectedDate = _a.selectedDate, viewDate = _a.viewDate, isEndDate = _a.isEndDate, cx = _a.classnames, timeRangeHeader = _a.timeRangeHeader;
        var date = selectedDate || (isEndDate ? viewDate.endOf('day') : viewDate);
        var inputs = [];
        var timeConstraints = this.timeConstraints;
        if ((0, helper_1.isMobile)() && this.props.useMobileUI) {
            return (react_1.default.createElement("div", { className: cx('CalendarTime') }, this.renderTimeViewPicker()));
        }
        timeFormat.split(':').forEach(function (format, i) {
            var type = /h/i.test(format)
                ? 'hours'
                : /m/.test(format)
                    ? 'minutes'
                    : /s/.test(format)
                        ? 'seconds'
                        : '';
            if (type) {
                var min_2 = timeConstraints[type].min;
                var max_2 = timeConstraints[type].max;
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
                            return _this.setTime(type, Math.max(min_2, Math.min(parseInt(e.currentTarget.value.replace(/\D/g, ''), 10) || 0, max_2)));
                        }
                    });
                    return (react_1.default.createElement("div", { className: cx('CalendarInputWrapper') },
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
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement("div", { className: cx(timeRangeHeader ? 'TimeRangeHeaderWrapper' : null) }, timeRangeHeader),
            react_1.default.createElement("div", null, inputs)));
    };
    CustomTimeView.defaultProps = {
        showToolbar: true
    };
    return CustomTimeView;
}(react_1.default.Component));
exports.CustomTimeView = CustomTimeView;
exports.default = (0, locale_1.localeable)(CustomTimeView);
//# sourceMappingURL=./components/calendar/TimeView.js.map
