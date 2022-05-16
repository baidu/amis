"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumberInput = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
// @ts-ignore
var rc_input_number_1 = (0, tslib_1.__importDefault)(require("rc-input-number"));
var MiniDecimal_1 = tslib_1.__importStar(require("rc-input-number/lib/utils/MiniDecimal"));
var numberUtil_1 = require("rc-input-number/lib/utils/numberUtil");
var icons_1 = require("./icons");
var theme_1 = require("../theme");
var helper_1 = require("../utils/helper");
var NumberInput = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(NumberInput, _super);
    function NumberInput() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NumberInput.prototype.handleChange = function (value) {
        var _a = this.props, min = _a.min, max = _a.max, onChange = _a.onChange;
        if (typeof value === 'number') {
            if (typeof min === 'number') {
                value = Math.max(value, min);
            }
            if (typeof max === 'number') {
                value = Math.min(value, max);
            }
        }
        onChange === null || onChange === void 0 ? void 0 : onChange(value);
    };
    NumberInput.prototype.handleFocus = function (e) {
        var onFocus = this.props.onFocus;
        onFocus && onFocus(e);
    };
    NumberInput.prototype.handleBlur = function (e) {
        var onBlur = this.props.onBlur;
        onBlur && onBlur(e);
    };
    NumberInput.prototype.handleEnhanceModeChange = function (action) {
        var _a = this.props, value = _a.value, step = _a.step, disabled = _a.disabled, readOnly = _a.readOnly, precision = _a.precision;
        // value为undefined会导致溢出错误
        var val = Number(value) || 0;
        if (disabled || readOnly) {
            return;
        }
        if (isNaN(Number(step)) || !Number(step)) {
            return;
        }
        var stepDecimal = (0, MiniDecimal_1.default)(Number(step));
        if (action !== 'add') {
            stepDecimal = stepDecimal.negate();
        }
        var target = (0, MiniDecimal_1.default)(val).add(stepDecimal.toString());
        var getPrecision = function (numStr) {
            if (precision >= 0) {
                return precision;
            }
            return Math.max((0, numberUtil_1.getNumberPrecision)(numStr), (0, numberUtil_1.getNumberPrecision)(Number(step) || 1));
        };
        var triggerValueUpdate = function (newValue, userTyping) {
            var updateValue = newValue;
            var numStr = updateValue.toString();
            var mergedPrecision = getPrecision(numStr);
            if (mergedPrecision >= 0) {
                updateValue = (0, MiniDecimal_1.default)((0, MiniDecimal_1.toFixed)(numStr, '.', mergedPrecision));
            }
            return updateValue;
        };
        var updatedValue = triggerValueUpdate(target, false);
        val = Number(updatedValue.toString());
        this.handleChange(val);
    };
    NumberInput.prototype.renderBase = function () {
        var _a;
        var _b = this.props, className = _b.className, ns = _b.classPrefix, cx = _b.classnames, value = _b.value, step = _b.step, precision = _b.precision, max = _b.max, min = _b.min, disabled = _b.disabled, placeholder = _b.placeholder, onChange = _b.onChange, showSteps = _b.showSteps, formatter = _b.formatter, parser = _b.parser, borderMode = _b.borderMode, readOnly = _b.readOnly, displayMode = _b.displayMode, inputRef = _b.inputRef, keyboard = _b.keyboard;
        var precisionProps = {};
        if (typeof precision === 'number') {
            precisionProps.precision = precision;
        }
        return react_1.default.createElement(rc_input_number_1.default, (0, tslib_1.__assign)({ className: cx(className, showSteps === false ? 'no-steps' : '', displayMode === 'enhance' ? 'Number--enhance-input' : '', (_a = {},
                _a["Number--border".concat((0, helper_1.ucFirst)(borderMode))] = borderMode,
                _a)), ref: inputRef, readOnly: readOnly, prefixCls: "".concat(ns, "Number"), value: value, step: step, max: max, min: min, formatter: formatter, parser: parser, onChange: this.handleChange, disabled: disabled, placeholder: placeholder, onFocus: this.handleFocus, onBlur: this.handleBlur, keyboard: keyboard }, precisionProps));
    };
    NumberInput.prototype.render = function () {
        var _a;
        var _this = this;
        var _b = this.props, ns = _b.classPrefix, cx = _b.classnames, value = _b.value, precision = _b.precision, max = _b.max, min = _b.min, disabled = _b.disabled, showSteps = _b.showSteps, borderMode = _b.borderMode, readOnly = _b.readOnly, displayMode = _b.displayMode;
        var precisionProps = {};
        if (typeof precision === 'number') {
            precisionProps.precision = precision;
        }
        return (react_1.default.createElement(react_1.default.Fragment, null, displayMode === 'enhance' ?
            react_1.default.createElement("div", { className: cx('Number--enhance', disabled ? 'Number--enhance-disabled' : '', showSteps === false ? 'Number--enhance-no-steps' : '', (_a = {},
                    _a["Number--enhance-border".concat((0, helper_1.ucFirst)(borderMode))] = borderMode,
                    _a)) },
                react_1.default.createElement("div", { className: cx('Number--enhance-left-icon', value && value === min ? 'Number--enhance-border-min' : '', disabled ? 'Number--enhance-border-disabled' : '', readOnly ? 'Number--enhance-border-readOnly' : ''), onClick: function () { return _this.handleEnhanceModeChange('subtract'); } },
                    react_1.default.createElement(icons_1.Icon, { icon: "minus", className: "icon" })),
                this.renderBase(),
                react_1.default.createElement("div", { className: cx('Number--enhance-right-icon', value && value === max ? 'Number--enhance-border-max' : '', disabled ? 'Number--enhance-border-disabled' : '', readOnly ? 'Number--enhance-border-readOnly' : ''), onClick: function () { return _this.handleEnhanceModeChange('add'); } },
                    react_1.default.createElement(icons_1.Icon, { icon: "plus", className: "icon " }))) : this.renderBase()));
    };
    var _a, _b;
    NumberInput.defaultProps = {
        step: 1,
        readOnly: false,
        borderMode: 'full'
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], NumberInput.prototype, "handleChange", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof react_1.default !== "undefined" && react_1.default.SyntheticEvent) === "function" ? _a : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], NumberInput.prototype, "handleFocus", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_b = typeof react_1.default !== "undefined" && react_1.default.SyntheticEvent) === "function" ? _b : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], NumberInput.prototype, "handleBlur", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [String]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], NumberInput.prototype, "handleEnhanceModeChange", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], NumberInput.prototype, "renderBase", null);
    return NumberInput;
}(react_1.default.Component));
exports.NumberInput = NumberInput;
exports.default = (0, theme_1.themeable)(NumberInput);
//# sourceMappingURL=./components/NumberInput.js.map
