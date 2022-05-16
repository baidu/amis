"use strict";
/**
 * @file filter
 * @author fex
 *
 * 不建议用，以后可能会删除。可以直接用组合出来，不需要新建一个组件。
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepeatControlRenderer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var classnames_1 = (0, tslib_1.__importDefault)(require("classnames"));
var Item_1 = require("./Item");
var LANG = {
    secondly: '秒',
    minutely: '分',
    hourly: '时',
    daily: '天',
    weekdays: '周中',
    weekly: '周',
    monthly: '月',
    yearly: '年'
};
var Select_1 = (0, tslib_1.__importDefault)(require("../../components/Select"));
var Range_1 = (0, tslib_1.__importDefault)(require("../../components/Range"));
var RepeatControl = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(RepeatControl, _super);
    function RepeatControl(props) {
        var _this = _super.call(this, props) || this;
        _this.handleOptionChange = _this.handleOptionChange.bind(_this);
        _this.handleChange = _this.handleChange.bind(_this);
        return _this;
    }
    RepeatControl.prototype.handleOptionChange = function (option) {
        this.props.onChange(option.value);
    };
    RepeatControl.prototype.handleChange = function (value) {
        var option = this.props.value;
        var parts = option ? option.split(':') : [];
        this.props.onChange("".concat(parts[0], ":").concat(value));
    };
    RepeatControl.prototype.renderInput = function () {
        var _this = this;
        var value = this.props.value;
        var parts = value ? value.split(':') : [];
        var _a = this.props, options = _a.options, placeholder = _a.placeholder, disabled = _a.disabled, ns = _a.classPrefix, __ = _a.translate;
        var optionsArray = [];
        optionsArray = options.split(',').map(function (key) { return ({
            label: LANG[key] || '不支持',
            value: key
        }); });
        optionsArray.unshift({
            label: __(placeholder),
            value: ''
        });
        var input;
        parts[1] = parseInt(parts[1], 10) || 1;
        switch (parts[0]) {
            case 'secondly':
                input = (react_1.default.createElement(Range_1.default, { key: "input", classPrefix: ns, value: parts[1], min: 1, step: 5, max: 60, disabled: disabled, onChange: function (value) { return _this.handleChange(value); } }));
                break;
            case 'minutely':
                input = (react_1.default.createElement(Range_1.default, { key: "input", classPrefix: ns, value: parts[1], min: 1, step: 5, max: 60, disabled: disabled, onChange: function (value) { return _this.handleChange(value); } }));
                break;
            case 'hourly':
                input = (react_1.default.createElement(Range_1.default, { key: "input", classPrefix: ns, value: parts[1], min: 1, step: 1, max: 24, disabled: disabled, onChange: function (value) { return _this.handleChange(value); } }));
                break;
            case 'daily':
                input = (react_1.default.createElement(Range_1.default, { key: "input", classPrefix: ns, value: parts[1], min: 1, step: 1, max: 30, disabled: disabled, onChange: function (value) { return _this.handleChange(value); } }));
                break;
            case 'weekly':
                input = (react_1.default.createElement(Range_1.default, { key: "input", classPrefix: ns, value: parts[1], min: 1, step: 1, max: 12, disabled: disabled, onChange: function (value) { return _this.handleChange(value); } }));
                break;
            case 'monthly':
                input = (react_1.default.createElement(Range_1.default, { key: "input", classPrefix: ns, value: parts[1], min: 1, step: 1, max: 12, disabled: disabled, onChange: function (value) { return _this.handleChange(value); } }));
                break;
            case 'yearly':
                input = (react_1.default.createElement(Range_1.default, { classPrefix: ns, key: "input", className: "v-middle", value: parts[1], min: 1, step: 1, max: 20, disabled: disabled, onChange: function (value) { return _this.handleChange(value); } }));
                break;
        }
        return (react_1.default.createElement("div", { className: "repeat-control hbox" },
            input ? (react_1.default.createElement("div", { className: "col v-middle", style: { width: 30 } },
                react_1.default.createElement("span", null, __('Repeat.pre')))) : null,
            input ? react_1.default.createElement("div", { className: "col v-middle" }, input) : null,
            react_1.default.createElement("div", { className: "col v-middle repeat-btn" },
                react_1.default.createElement(Select_1.default, { classPrefix: ns, className: input ? 'pull-right' : '', options: optionsArray, placeholder: __(placeholder), onChange: this.handleOptionChange, value: parts[0], clearable: false, searchable: false, disabled: disabled, joinValues: false }))));
    };
    RepeatControl.prototype.render = function () {
        var _a = this.props, className = _a.className, ns = _a.classPrefix;
        return (react_1.default.createElement("div", { className: (0, classnames_1.default)("".concat(ns, "RepeatControl"), className) }, this.renderInput()));
    };
    RepeatControl.defaultProps = {
        // options: 'secondly,minutely,hourly,daily,weekdays,weekly,monthly,yearly'
        options: 'hourly,daily,weekly,monthly',
        placeholder: '不重复'
    };
    return RepeatControl;
}(react_1.default.Component));
exports.default = RepeatControl;
var RepeatControlRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(RepeatControlRenderer, _super);
    function RepeatControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RepeatControlRenderer = (0, tslib_1.__decorate)([
        (0, Item_1.FormItem)({
            type: 'input-repeat',
            sizeMutable: false
        })
    ], RepeatControlRenderer);
    return RepeatControlRenderer;
}(RepeatControl));
exports.RepeatControlRenderer = RepeatControlRenderer;
//# sourceMappingURL=./renderers/Form/InputRepeat.js.map
