"use strict";
/**
 * @file Range
 * @description
 * @author fex
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Range = void 0;
var tslib_1 = require("tslib");
var range_1 = (0, tslib_1.__importDefault)(require("lodash/range"));
var keys_1 = (0, tslib_1.__importDefault)(require("lodash/keys"));
var isString_1 = (0, tslib_1.__importDefault)(require("lodash/isString"));
var difference_1 = (0, tslib_1.__importDefault)(require("lodash/difference"));
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var uncontrollable_1 = require("uncontrollable");
var Overlay_1 = (0, tslib_1.__importDefault)(require("./Overlay"));
var theme_1 = require("../theme");
var helper_1 = require("../utils/helper");
var tpl_builtin_1 = require("../utils/tpl-builtin");
var react_dom_1 = require("react-dom");
var icons_1 = require("./icons");
/**
 * 滑块值 -> position.left
 * @param value 滑块值
 * @param min 最小值
 * @param max 最大值
 * @returns position.left
 */
var valueToOffsetLeft = function (value, min, max) {
    return ((value - min) * 100) / (max - min) + '%';
};
/**
 * 滑块handle
 * 双滑块涉及两个handle，单独抽一个组件
 */
var HandleItem = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(HandleItem, _super);
    function HandleItem(props) {
        var _this = _super.call(this, props) || this;
        _this.handleRef = react_1.default.createRef();
        _this.state = {
            isDrag: false,
            labelActive: false
        };
        return _this;
    }
    /**
     * mouseDown事件
     * 防止拖动过快，全局监听 mousemove、mouseup
     */
    HandleItem.prototype.onMouseDown = function () {
        this.setState({
            isDrag: true,
            labelActive: true
        });
        window.addEventListener('mousemove', this.onMouseMove);
        window.addEventListener('mouseup', this.onMouseUp);
    };
    /**
     * mouseMove事件
     * 触发公共onchange事件
     */
    HandleItem.prototype.onMouseMove = function (e) {
        var isDrag = this.state.isDrag;
        var _a = this.props.type, type = _a === void 0 ? 'min' : _a;
        if (!isDrag) {
            return;
        }
        this.props.onChange(e.pageX, type);
    };
    /**
     * mouseUp事件
     * 移除全局 mousemove、mouseup
     */
    HandleItem.prototype.onMouseUp = function () {
        this.setState({
            isDrag: false
        });
        this.props.onAfterChange();
        window.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('mouseup', this.onMouseUp);
    };
    /**
     * mouseEnter事件
     * 鼠标移入 -> 展示label
     */
    HandleItem.prototype.onMouseEnter = function () {
        this.setState({
            labelActive: true
        });
    };
    /**
     * mouseLeave事件
     * 鼠标移出 & !isDrag -> 隐藏label
     */
    HandleItem.prototype.onMouseLeave = function () {
        var isDrag = this.state.isDrag;
        if (isDrag) {
            return;
        }
        this.setState({
            labelActive: false
        });
    };
    HandleItem.prototype.render = function () {
        var _this = this;
        var _a = this.props, cx = _a.classnames, disabled = _a.disabled, value = _a.value, min = _a.min, max = _a.max, tooltipVisible = _a.tooltipVisible, tipFormatter = _a.tipFormatter, unit = _a.unit, _b = _a.tooltipPlacement, tooltipPlacement = _b === void 0 ? 'auto' : _b;
        var _c = this.state, isDrag = _c.isDrag, labelActive = _c.labelActive;
        var style = {
            left: valueToOffsetLeft(value, min, max),
            zIndex: isDrag ? 2 : 1
        };
        return disabled ? (react_1.default.createElement("div", { className: cx('InputRange-handle'), style: style },
            react_1.default.createElement("div", { className: cx('InputRange-handle-icon') },
                react_1.default.createElement(icons_1.Icon, { icon: "slider-handle", className: "icon" })))) : (react_1.default.createElement("div", { className: cx('InputRange-handle'), style: style, ref: this.handleRef },
            react_1.default.createElement("div", { className: cx(isDrag ? 'InputRange-handle-drage' : 'InputRange-handle-icon'), onMouseDown: this.onMouseDown, onMouseEnter: this.onMouseEnter, onMouseLeave: this.onMouseLeave },
                react_1.default.createElement(icons_1.Icon, { icon: "slider-handle", className: "icon" })),
            react_1.default.createElement(Overlay_1.default, { placement: tooltipPlacement, target: function () { return (0, react_dom_1.findDOMNode)(_this); }, container: function () { return (0, react_dom_1.findDOMNode)(_this); }, rootClose: false, show: true },
                react_1.default.createElement(Label, { show: labelActive, classPrefix: this.props.classPrefix, classnames: cx, value: value, tooltipVisible: tooltipVisible, tipFormatter: tipFormatter, unit: unit, placement: tooltipPlacement }))));
    };
    var _a;
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], HandleItem.prototype, "onMouseDown", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof MouseEvent !== "undefined" && MouseEvent) === "function" ? _a : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], HandleItem.prototype, "onMouseMove", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], HandleItem.prototype, "onMouseUp", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], HandleItem.prototype, "onMouseEnter", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], HandleItem.prototype, "onMouseLeave", null);
    return HandleItem;
}(react_1.default.Component));
/**
 * 滑块标签
 */
var Label = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Label, _super);
    function Label() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Label.prototype.render = function () {
        var _a = this.props, cx = _a.classnames, value = _a.value, show = _a.show, tooltipVisible = _a.tooltipVisible, tipFormatter = _a.tipFormatter, _b = _a.unit, unit = _b === void 0 ? '' : _b, _c = _a.positionLeft, positionLeft = _c === void 0 ? 0 : _c, _d = _a.positionTop, positionTop = _d === void 0 ? 0 : _d;
        var placement = this.props.placement;
        if (placement === 'auto') {
            positionLeft >= 0 && positionTop >= 0 && (placement = 'top');
            positionLeft >= 0 && positionTop < 0 && (placement = 'bottom');
            positionLeft < 0 && positionTop >= 0 && (placement = 'left');
            positionLeft < 0 && positionTop < 0 && (placement = 'right');
        }
        // tooltipVisible 优先级 比show高
        // tooltipVisible 为 true时，tipFormatter才生效
        var isShow = tooltipVisible !== undefined
            ? tooltipVisible && tipFormatter
                ? tipFormatter(value)
                : tooltipVisible
            : show;
        return (react_1.default.createElement("div", { className: cx('InputRange-label', "pos-".concat((0, helper_1.camel)(placement)), {
                'InputRange-label-visible': isShow
            }) },
            react_1.default.createElement("span", null, value + unit)));
    };
    return Label;
}(react_1.default.Component));
var Range = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Range, _super);
    function Range() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.multipleValue = {
            min: _this.props.value.min,
            max: _this.props.value.max
        };
        _this.trackRef = react_1.default.createRef();
        return _this;
    }
    /**
     * 接收组件value变换
     * value变换 -> Range.updateValue
     * @param value
     */
    Range.prototype.updateValue = function (value) {
        this.props.updateValue(value);
    };
    /**
     * 获取 坐标、宽高
     */
    Range.prototype.getBoundingClient = function (dom) {
        var _a = dom === null || dom === void 0 ? void 0 : dom.getBoundingClientRect(), x = _a.x, y = _a.y, width = _a.width, height = _a.height;
        return { x: x, y: y, width: width, height: height };
    };
    /**
     * 坐标 -> 滑块值
     * @param pageX target.target 坐标
     * @returns 滑块值
     */
    Range.prototype.pageXToValue = function (pageX) {
        var _a = this.getBoundingClient(this.trackRef.current), x = _a.x, width = _a.width;
        var _b = this.props, max = _b.max, min = _b.min;
        return ((pageX - x) * (max - min)) / width + min;
    };
    /**
     * 滑块改变事件
     * @param pageX target.pageX 坐标
     * @param type min max
     * @returns void
     */
    Range.prototype.onChange = function (pageX, type) {
        var _a;
        if (type === void 0) { type = 'min'; }
        var _b = this.props, max = _b.max, min = _b.min, step = _b.step, multiple = _b.multiple, originValue = _b.value;
        var value = this.pageXToValue(pageX);
        if (value > max || value < min) {
            return;
        }
        var result = (0, tpl_builtin_1.stripNumber)(this.getStepValue(value, step));
        if (multiple) {
            this.updateValue((0, tslib_1.__assign)((0, tslib_1.__assign)({}, originValue), (_a = {}, _a[type] = result, _a)));
        }
        else {
            this.updateValue(result);
        }
    };
    /**
     * 获取step为单位的value
     * @param value 拖拽后计算的value
     * @param step 步长
     * @returns step为单位的value
     */
    Range.prototype.getStepValue = function (value, step) {
        var surplus = value % step;
        var result = 0;
        // 余数 >= 步长一半 -> 向上取
        // 余数 <  步长一半 -> 向下取
        var _value = surplus >= step / 2 ? value : value - step;
        while (result <= _value) {
            result += step;
        }
        return result;
    };
    /**
     * 点击滑轨 -> 触发onchange 改变value
     * @param e event
     * @returns void
     */
    Range.prototype.onClickTrack = function (e) {
        if (!!this.props.disabled) {
            return;
        }
        var value = this.props.value;
        var _value = this.pageXToValue(e.pageX);
        var type = Math.abs(_value - value.min) >
            Math.abs(_value - value.max)
            ? 'max'
            : 'min';
        this.onChange(e.pageX, type);
    };
    /**
     * 设置步长
     * @returns ReactNode
     */
    Range.prototype.renderSteps = function () {
        var _a = this.props, max = _a.max, min = _a.min, step = _a.step, showSteps = _a.showSteps, cx = _a.classnames, parts = _a.parts;
        var isShowSteps = showSteps;
        // 只要设置了 parts 就展示分隔
        if (parts > 1 || Array.isArray(parts)) {
            isShowSteps = true;
        }
        // 总区间
        var section = max - min;
        // 总区间被平均分为多少块
        var steps = parts > 1 ? parts : Math.floor(section / step);
        // 平均分 每块的长度
        var partLength = section / steps;
        // parts为数组时，以0为起点(传入的值 - min)
        var partLengthList = Array.isArray(parts)
            ? parts.map(function (item) { return item - min; })
            : (0, range_1.default)(steps - 1).map(function (item) { return (item + 1) * partLength; });
        return (isShowSteps && (react_1.default.createElement("div", null, partLengthList.map(function (item) { return (react_1.default.createElement("span", { key: item, className: cx('InputRange-track-dot'), style: { left: (item * 100) / (max - min) + '%' } })); }))));
    };
    /**
     * 双滑块改变最大值、最小值
     * @param pageX 拖拽后的pageX
     * @param type 'min' | 'max'
     */
    Range.prototype.onGetChangeValue = function (pageX, type) {
        var _a = this.props, max = _a.max, min = _a.min;
        var value = this.pageXToValue(pageX);
        if (value > max || value < min) {
            return;
        }
        this.multipleValue[type] = (0, tpl_builtin_1.stripNumber)(this.getStepValue(value, this.props.step));
        var _min = Math.min(this.multipleValue.min, this.multipleValue.max);
        var _max = Math.max(this.multipleValue.min, this.multipleValue.max);
        this.updateValue({ max: _max, min: _min });
    };
    /**
     * 计算每个标记 position.left
     * @param value 滑块值
     * @returns
     */
    Range.prototype.getOffsetLeft = function (value) {
        var _a = this.props, max = _a.max, min = _a.min;
        if ((0, isString_1.default)(value) && /^\d+%$/.test(value)) {
            return value;
        }
        return (+value * 100) / (max - min) + '%';
    };
    Range.prototype.render = function () {
        var _this = this;
        var _a = this.props, cx = _a.classnames, marks = _a.marks, multiple = _a.multiple, value = _a.value, max = _a.max, min = _a.min, disabled = _a.disabled, tooltipVisible = _a.tooltipVisible, unit = _a.unit, tooltipPlacement = _a.tooltipPlacement, tipFormatter = _a.tipFormatter, onAfterChange = _a.onAfterChange;
        // trace
        var traceActiveStyle = {
            width: valueToOffsetLeft(multiple
                ? value.max - value.min + min
                : value, min, max),
            left: valueToOffsetLeft(multiple ? value.min : min, min, max)
        };
        // handle 双滑块
        var diff = (0, difference_1.default)(Object.values(value), Object.values(this.multipleValue));
        if (diff && !!diff.length) {
            this.multipleValue = {
                min: value.min,
                max: value.max
            };
        }
        return (react_1.default.createElement("div", { className: cx('InputRange-wrap') },
            react_1.default.createElement("div", { ref: this.trackRef, className: cx('InputRange-track', 'InputRange-track--background'), onClick: this.onClickTrack },
                react_1.default.createElement("div", { className: cx('InputRange-track-active'), style: traceActiveStyle }),
                this.renderSteps(),
                multiple ? (['min', 'max'].map(function (type) { return (react_1.default.createElement(HandleItem, { key: type, value: _this.multipleValue[type], type: type, min: min, max: max, classPrefix: _this.props.classPrefix, classnames: cx, disabled: disabled, tooltipVisible: tooltipVisible, tipFormatter: tipFormatter, unit: unit, tooltipPlacement: tooltipPlacement, onAfterChange: onAfterChange, onChange: _this.onGetChangeValue.bind(_this) })); })) : (react_1.default.createElement(HandleItem, { value: +value, min: min, max: max, classPrefix: this.props.classPrefix, classnames: cx, disabled: disabled, tooltipVisible: tooltipVisible, tipFormatter: tipFormatter, unit: unit, tooltipPlacement: tooltipPlacement, onAfterChange: onAfterChange, onChange: this.onChange.bind(this) })),
                marks && (react_1.default.createElement("div", { className: cx('InputRange-marks') }, (0, keys_1.default)(marks).map(function (key) {
                    var _a, _b;
                    return (react_1.default.createElement("div", { key: key, style: { left: _this.getOffsetLeft(key) } },
                        react_1.default.createElement("span", { style: (_a = marks[key]) === null || _a === void 0 ? void 0 : _a.style }, ((_b = marks[key]) === null || _b === void 0 ? void 0 : _b.label) || marks[key])));
                }))))));
    };
    var _b;
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Range.prototype, "updateValue", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_b = typeof Element !== "undefined" && Element) === "function" ? _b : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Range.prototype, "getBoundingClient", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Number, String]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Range.prototype, "onChange", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Range.prototype, "onClickTrack", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Range.prototype, "renderSteps", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Number, Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Range.prototype, "onGetChangeValue", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Range.prototype, "getOffsetLeft", null);
    return Range;
}(react_1.default.Component));
exports.Range = Range;
exports.default = (0, theme_1.themeable)((0, uncontrollable_1.uncontrollable)(Range, {
    value: 'onChange'
}));
//# sourceMappingURL=./components/Range.js.map
