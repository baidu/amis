"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IconPickerControlRenderer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var classnames_1 = (0, tslib_1.__importDefault)(require("classnames"));
var match_sorter_1 = require("match-sorter");
var keycode_1 = (0, tslib_1.__importDefault)(require("keycode"));
var downshift_1 = tslib_1.__importStar(require("downshift"));
var helper_1 = require("../../utils/helper");
var IconPickerIcons_1 = require("./IconPickerIcons");
var Item_1 = require("./Item");
var icons_1 = require("../../components/icons");
var IconPickerControl = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(IconPickerControl, _super);
    function IconPickerControl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            isOpen: false,
            inputValue: '',
            isFocused: false,
            vendorIndex: 0
        };
        return _this;
    }
    IconPickerControl.prototype.componentDidUpdate = function (prevProps) {
        var props = this.props;
        if (prevProps.value !== props.value) {
            this.setState({
                inputValue: ''
            });
        }
    };
    IconPickerControl.prototype.changeVendor = function (index) {
        this.setState({
            vendorIndex: index
        }, this.formatOptions);
    };
    IconPickerControl.prototype.formatOptions = function () {
        var vendorIndex = this.state.vendorIndex || 0;
        var _a = IconPickerIcons_1.ICONS[vendorIndex], prefix = _a.prefix, icons = _a.icons;
        return icons.map(function (icon) { return ({
            label: prefix + icon,
            value: prefix + icon
        }); });
    };
    IconPickerControl.prototype.getVendors = function () {
        return IconPickerIcons_1.ICONS.map(function (icons) { return icons.name; });
    };
    IconPickerControl.prototype.inputRef = function (ref) {
        this.input = ref;
    };
    IconPickerControl.prototype.focus = function () {
        if (!this.input) {
            return;
        }
        this.input.focus();
        var len = this.input.value.length;
        len && this.input.setSelectionRange(len, len);
    };
    IconPickerControl.prototype.handleClick = function () {
        if (this.props.disabled) {
            return;
        }
        this.focus();
        this.setState({
            isOpen: true
        });
    };
    IconPickerControl.prototype.handleFocus = function (e) {
        this.setState({
            isOpen: true,
            isFocused: true
        });
        this.props.onFocus && this.props.onFocus(e);
    };
    IconPickerControl.prototype.handleBlur = function (e) {
        var _a = this.props, onBlur = _a.onBlur, trimContents = _a.trimContents, value = _a.value, onChange = _a.onChange;
        this.setState({
            isFocused: false
        }, function () {
            if (trimContents && value && typeof value === 'string') {
                onChange(value.trim());
            }
        });
        onBlur && onBlur(e);
    };
    IconPickerControl.prototype.handleInputChange = function (evt) {
        var value = evt.currentTarget.value;
        this.setState({
            inputValue: value
        });
    };
    IconPickerControl.prototype.handleKeyDown = function (evt) {
        var code = (0, keycode_1.default)(evt.keyCode);
        if (code !== 'backspace') {
            return;
        }
        var onChange = this.props.onChange;
        if (!this.state.inputValue) {
            onChange('');
            this.setState({
                inputValue: ''
            });
        }
    };
    IconPickerControl.prototype.handleChange = function (value) {
        var _a = this.props, onChange = _a.onChange, disabled = _a.disabled;
        if (disabled) {
            return;
        }
        onChange(value);
        this.setState({
            isFocused: false,
            inputValue: ''
        });
    };
    IconPickerControl.prototype.handleStateChange = function (changes) {
        switch (changes.type) {
            case downshift_1.default.stateChangeTypes.itemMouseEnter:
            case downshift_1.default.stateChangeTypes.changeInput:
                this.setState({
                    isOpen: true
                });
                break;
            default:
                var state = {};
                if (typeof changes.isOpen !== 'undefined') {
                    state.isOpen = changes.isOpen;
                }
                if (this.state.isOpen && changes.isOpen === false) {
                    state.inputValue = '';
                }
                this.setState(state);
                break;
        }
    };
    IconPickerControl.prototype.handleClear = function () {
        var _this = this;
        var _a = this.props, onChange = _a.onChange, resetValue = _a.resetValue;
        onChange === null || onChange === void 0 ? void 0 : onChange(resetValue);
        this.setState({
            inputValue: resetValue,
            isFocused: true
        }, function () {
            _this.focus();
        });
    };
    IconPickerControl.prototype.renderFontIcons = function () {
        var _this = this;
        var _a = this.props, className = _a.className, inputOnly = _a.inputOnly, placeholder = _a.placeholder, cx = _a.classnames, name = _a.name, value = _a.value, noDataTip = _a.noDataTip, disabled = _a.disabled, clearable = _a.clearable, __ = _a.translate;
        var options = this.formatOptions();
        var vendors = this.getVendors();
        return (react_1.default.createElement(downshift_1.default, { isOpen: this.state.isOpen, inputValue: this.state.inputValue, onChange: this.handleChange, onOuterClick: this.handleBlur, onStateChange: this.handleStateChange, selectedItem: [value] }, function (_a) {
            var getInputProps = _a.getInputProps, getItemProps = _a.getItemProps, isOpen = _a.isOpen, inputValue = _a.inputValue;
            var filteredOptions = inputValue && isOpen
                ? (0, match_sorter_1.matchSorter)(options, inputValue, { keys: ['label', 'value'] })
                : options;
            return (react_1.default.createElement("div", { className: cx("IconPickerControl-input IconPickerControl-input--withAC", inputOnly ? className : '', {
                    'is-opened': isOpen
                }), onClick: _this.handleClick },
                react_1.default.createElement("div", { className: cx('IconPickerControl-valueWrap') },
                    placeholder && !value && !_this.state.inputValue ? (react_1.default.createElement("div", { className: cx('IconPickerControl-placeholder') }, placeholder)) : null,
                    !value || (inputValue && isOpen) ? null : (react_1.default.createElement("div", { className: cx('IconPickerControl-value') },
                        react_1.default.createElement("i", { className: cx(value) }),
                        value)),
                    react_1.default.createElement("input", (0, tslib_1.__assign)({}, getInputProps({
                        name: name,
                        ref: _this.inputRef,
                        onFocus: _this.handleFocus,
                        onChange: _this.handleInputChange,
                        onKeyDown: _this.handleKeyDown,
                        value: _this.state.inputValue
                    }), { autoComplete: "off", disabled: disabled, size: 10 })),
                    clearable && !disabled && value ? (react_1.default.createElement("a", { onClick: _this.handleClear, className: cx('IconPickerControl-clear') },
                        react_1.default.createElement(icons_1.Icon, { icon: "input-clear", className: "icon" }))) : null),
                isOpen ? (react_1.default.createElement("div", { className: cx('IconPickerControl-sugsPanel') },
                    vendors.length > 1 ? (react_1.default.createElement("div", { className: cx('IconPickerControl-tabs') }, vendors.map(function (vendor, index) { return (react_1.default.createElement("div", { className: cx('IconPickerControl-tab', {
                            active: _this.state.vendorIndex === index
                        }), onClick: function () { return _this.changeVendor(index); }, key: index }, vendor)); }))) : null,
                    filteredOptions.length ? (react_1.default.createElement("div", { className: cx('IconPickerControl-sugs', vendors.length > 1
                            ? 'IconPickerControl-multiVendor'
                            : 'IconPickerControl-singleVendor') }, filteredOptions.map(function (option, index) { return (react_1.default.createElement("div", (0, tslib_1.__assign)({}, getItemProps({
                        item: option.value,
                        className: cx("IconPickerControl-sugItem", {
                            'is-active': value === option.value
                        })
                    }), { key: index }),
                        react_1.default.createElement("i", { className: cx("".concat(option.value)), title: "".concat(option.value) }))); }))) : (react_1.default.createElement("div", { className: cx(vendors.length > 1
                            ? 'IconPickerControl-multiVendor'
                            : 'IconPickerControl-singleVendor') }, __(noDataTip))))) : null));
        }));
    };
    IconPickerControl.prototype.render = function () {
        var _a = this.props, className = _a.className, ns = _a.classPrefix, inputOnly = _a.inputOnly, disabled = _a.disabled;
        var input = this.renderFontIcons();
        if (inputOnly) {
            return input;
        }
        return (react_1.default.createElement("div", { className: (0, classnames_1.default)(className, "".concat(ns, "IconPickerControl"), {
                'is-focused': this.state.isFocused,
                'is-disabled': disabled
            }) }, input));
    };
    var _a, _b, _c;
    IconPickerControl.defaultProps = {
        resetValue: '',
        placeholder: '',
        noDataTip: 'placeholder.noData'
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Number]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], IconPickerControl.prototype, "changeVendor", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], IconPickerControl.prototype, "formatOptions", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], IconPickerControl.prototype, "getVendors", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], IconPickerControl.prototype, "inputRef", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], IconPickerControl.prototype, "focus", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], IconPickerControl.prototype, "handleClick", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], IconPickerControl.prototype, "handleFocus", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], IconPickerControl.prototype, "handleBlur", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof react_1.default !== "undefined" && react_1.default.ChangeEvent) === "function" ? _a : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], IconPickerControl.prototype, "handleInputChange", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_b = typeof react_1.default !== "undefined" && react_1.default.KeyboardEvent) === "function" ? _b : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], IconPickerControl.prototype, "handleKeyDown", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], IconPickerControl.prototype, "handleChange", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_c = typeof downshift_1.StateChangeOptions !== "undefined" && downshift_1.StateChangeOptions) === "function" ? _c : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], IconPickerControl.prototype, "handleStateChange", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], IconPickerControl.prototype, "handleClear", null);
    return IconPickerControl;
}(react_1.default.PureComponent));
exports.default = IconPickerControl;
var IconPickerControlRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(IconPickerControlRenderer, _super);
    function IconPickerControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IconPickerControlRenderer = (0, tslib_1.__decorate)([
        (0, Item_1.FormItem)({
            type: 'icon-picker'
        })
    ], IconPickerControlRenderer);
    return IconPickerControlRenderer;
}(IconPickerControl));
exports.IconPickerControlRenderer = IconPickerControlRenderer;
//# sourceMappingURL=./renderers/Form/IconPicker.js.map
