"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagControlRenderer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var Options_1 = require("./Options");
var downshift_1 = (0, tslib_1.__importDefault)(require("downshift"));
var find_1 = (0, tslib_1.__importDefault)(require("lodash/find"));
var react_dom_1 = require("react-dom");
var ResultBox_1 = (0, tslib_1.__importDefault)(require("../../components/ResultBox"));
var helper_1 = require("../../utils/helper");
var Spinner_1 = (0, tslib_1.__importDefault)(require("../../components/Spinner"));
var Overlay_1 = (0, tslib_1.__importDefault)(require("../../components/Overlay"));
var PopOver_1 = (0, tslib_1.__importDefault)(require("../../components/PopOver"));
var ListMenu_1 = (0, tslib_1.__importDefault)(require("../../components/ListMenu"));
var TagControl = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(TagControl, _super);
    function TagControl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.input = react_1.default.createRef();
        _this.state = {
            isOpened: false,
            inputValue: '',
            isFocused: false
        };
        return _this;
    }
    TagControl.prototype.componentDidUpdate = function (prevProps) {
        var props = this.props;
        if (prevProps.value !== props.value) {
            this.setState({
                inputValue: ''
            });
        }
    };
    TagControl.prototype.doAction = function (action, data, throwErrors) {
        var _a = this.props, resetValue = _a.resetValue, onChange = _a.onChange;
        var actionType = action === null || action === void 0 ? void 0 : action.actionType;
        if (actionType === 'clear') {
            onChange === null || onChange === void 0 ? void 0 : onChange('');
        }
        else if (actionType === 'reset') {
            onChange === null || onChange === void 0 ? void 0 : onChange(resetValue !== null && resetValue !== void 0 ? resetValue : '');
        }
    };
    TagControl.prototype.dispatchEvent = function (eventName, eventData) {
        if (eventData === void 0) { eventData = {}; }
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var _a, dispatchEvent, options, data, rendererEvent;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, dispatchEvent = _a.dispatchEvent, options = _a.options, data = _a.data;
                        return [4 /*yield*/, dispatchEvent(eventName, (0, helper_1.createObject)(data, (0, tslib_1.__assign)({ options: options }, eventData)))];
                    case 1:
                        rendererEvent = _b.sent();
                        // 返回阻塞标识
                        return [2 /*return*/, !!(rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented)];
                }
            });
        });
    };
    TagControl.prototype.getValue = function (type, option) {
        if (type === void 0) { type = 'normal'; }
        if (option === void 0) { option = {}; }
        var _a = this.props, selectedOptions = _a.selectedOptions, joinValues = _a.joinValues, extractValue = _a.extractValue, delimiter = _a.delimiter, valueField = _a.valueField;
        var newValue = selectedOptions.concat();
        if (type === 'push') {
            newValue.push(option);
        }
        else if (type === 'pop') {
            newValue.pop();
        }
        var newValueRes = joinValues
            ? newValue.map(function (item) { return item[valueField || 'value']; }).join(delimiter || ',')
            : extractValue
                ? newValue.map(function (item) { return item[valueField || 'value']; })
                : newValue;
        return newValueRes;
    };
    TagControl.prototype.addItem = function (option) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var _a, selectedOptions, onChange, newValue, newValueRes, isPrevented;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, selectedOptions = _a.selectedOptions, onChange = _a.onChange;
                        newValue = selectedOptions.concat();
                        if ((0, find_1.default)(newValue, function (item) { return item.value == option.value; })) {
                            return [2 /*return*/];
                        }
                        newValueRes = this.getValue('push', option);
                        return [4 /*yield*/, this.dispatchEvent('change', {
                                value: newValueRes
                            })];
                    case 1:
                        isPrevented = _b.sent();
                        isPrevented || onChange(newValueRes);
                        return [2 /*return*/];
                }
            });
        });
    };
    TagControl.prototype.handleFocus = function (e) {
        var _a, _b;
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var newValueRes, isPrevented;
            return (0, tslib_1.__generator)(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        this.setState({
                            isFocused: true,
                            isOpened: true
                        });
                        newValueRes = this.getValue('normal');
                        return [4 /*yield*/, this.dispatchEvent('focus', {
                                value: newValueRes
                            })];
                    case 1:
                        isPrevented = _c.sent();
                        isPrevented || ((_b = (_a = this.props).onFocus) === null || _b === void 0 ? void 0 : _b.call(_a, e));
                        return [2 /*return*/];
                }
            });
        });
    };
    TagControl.prototype.handleBlur = function (e) {
        var _a, _b;
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var _c, selectedOptions, onChange, joinValues, extractValue, delimiter, valueField, value, newValueRes, isPrevented;
            return (0, tslib_1.__generator)(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _c = this.props, selectedOptions = _c.selectedOptions, onChange = _c.onChange, joinValues = _c.joinValues, extractValue = _c.extractValue, delimiter = _c.delimiter, valueField = _c.valueField;
                        value = this.state.inputValue.trim();
                        newValueRes = this.getValue('normal');
                        return [4 /*yield*/, this.dispatchEvent('blur', {
                                value: newValueRes
                            })];
                    case 1:
                        isPrevented = _d.sent();
                        isPrevented || ((_b = (_a = this.props).onBlur) === null || _b === void 0 ? void 0 : _b.call(_a, e));
                        this.setState({
                            isFocused: false,
                            isOpened: false,
                            inputValue: ''
                        }, value
                            ? function () {
                                var newValue = selectedOptions.concat();
                                if (!(0, find_1.default)(newValue, function (item) { return item.value === value; })) {
                                    var option = {
                                        label: value,
                                        value: value
                                    };
                                    newValue.push(option);
                                    onChange(joinValues
                                        ? newValue
                                            .map(function (item) { return item[valueField || 'value']; })
                                            .join(delimiter || ',')
                                        : extractValue
                                            ? newValue.map(function (item) { return item[valueField || 'value']; })
                                            : newValue);
                                }
                            }
                            : undefined);
                        return [2 /*return*/];
                }
            });
        });
    };
    TagControl.prototype.close = function () {
        this.setState({
            isOpened: false
        });
    };
    TagControl.prototype.handleInputChange = function (text) {
        this.setState({
            inputValue: text
        });
    };
    TagControl.prototype.handleChange = function (value) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var _a, joinValues, extractValue, delimiter, valueField, onChange, newValue, isPrevented;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, joinValues = _a.joinValues, extractValue = _a.extractValue, delimiter = _a.delimiter, valueField = _a.valueField, onChange = _a.onChange;
                        newValue = Array.isArray(value) ? value.concat() : [];
                        if (joinValues || extractValue) {
                            newValue = value.map(function (item) { return item[valueField || 'value']; });
                        }
                        if (joinValues) {
                            newValue = newValue.join(delimiter || ',');
                        }
                        return [4 /*yield*/, this.dispatchEvent('change', {
                                value: newValue
                            })];
                    case 1:
                        isPrevented = _b.sent();
                        isPrevented || onChange(newValue);
                        return [2 /*return*/];
                }
            });
        });
    };
    TagControl.prototype.renderItem = function (item) {
        var labelField = this.props.labelField;
        return "".concat(item[labelField || 'label']);
    };
    TagControl.prototype.handleKeyDown = function (evt) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var _a, selectedOptions, onChange, delimiter, value, newValueRes, isPrevented, newValue, newValueRes, isPrevented;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, selectedOptions = _a.selectedOptions, onChange = _a.onChange, delimiter = _a.delimiter;
                        value = this.state.inputValue.trim();
                        if (!(selectedOptions.length && !value && evt.key == 'Backspace')) return [3 /*break*/, 2];
                        newValueRes = this.getValue('pop');
                        return [4 /*yield*/, this.dispatchEvent('change', {
                                value: newValueRes
                            })];
                    case 1:
                        isPrevented = _b.sent();
                        isPrevented || onChange(newValueRes);
                        return [3 /*break*/, 5];
                    case 2:
                        if (!(value && (evt.key === 'Enter' || evt.key === delimiter))) return [3 /*break*/, 5];
                        evt.preventDefault();
                        evt.stopPropagation();
                        newValue = selectedOptions.concat();
                        if (!!(0, find_1.default)(newValue, function (item) { return item.value == value; })) return [3 /*break*/, 4];
                        newValueRes = this.getValue('push', {
                            label: value,
                            value: value
                        });
                        return [4 /*yield*/, this.dispatchEvent('change', {
                                value: newValueRes
                            })];
                    case 3:
                        isPrevented = _b.sent();
                        isPrevented || onChange(newValueRes);
                        _b.label = 4;
                    case 4:
                        this.setState({
                            inputValue: ''
                        });
                        _b.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    TagControl.prototype.handleOptionChange = function (option) {
        if (this.state.inputValue || !option) {
            return;
        }
        this.addItem(option);
    };
    TagControl.prototype.getTarget = function () {
        return this.input.current;
    };
    TagControl.prototype.getParent = function () {
        return this.input.current && (0, react_dom_1.findDOMNode)(this.input.current).parentElement;
    };
    TagControl.prototype.reload = function () {
        var reload = this.props.reloadOptions;
        reload === null || reload === void 0 ? void 0 : reload();
    };
    TagControl.prototype.render = function () {
        var _this = this;
        var _a = this.props, className = _a.className, cx = _a.classnames, disabled = _a.disabled, placeholder = _a.placeholder, name = _a.name, clearable = _a.clearable, selectedOptions = _a.selectedOptions, loading = _a.loading, popOverContainer = _a.popOverContainer, dropdown = _a.dropdown, options = _a.options, optionsTip = _a.optionsTip, __ = _a.translate;
        var finnalOptions = Array.isArray(options)
            ? (0, helper_1.filterTree)(options, function (item) {
                return (Array.isArray(item.children) && !!item.children.length) ||
                    (item.value !== undefined && !~selectedOptions.indexOf(item));
            }, 0, true)
            : [];
        return (react_1.default.createElement(downshift_1.default, { selectedItem: selectedOptions, isOpen: this.state.isFocused, inputValue: this.state.inputValue, onChange: this.handleOptionChange, itemToString: this.renderItem }, function (_a) {
            var isOpen = _a.isOpen, highlightedIndex = _a.highlightedIndex, getItemProps = _a.getItemProps, getInputProps = _a.getInputProps;
            return (react_1.default.createElement("div", { className: cx(className, "TagControl") },
                react_1.default.createElement(ResultBox_1.default, (0, tslib_1.__assign)({}, getInputProps({
                    name: name,
                    ref: _this.input,
                    placeholder: __(placeholder || 'Tag.placeholder'),
                    value: _this.state.inputValue,
                    onKeyDown: _this.handleKeyDown,
                    onFocus: _this.handleFocus,
                    onBlur: _this.handleBlur,
                    disabled: disabled
                }), { onChange: _this.handleInputChange, className: cx('TagControl-input'), result: selectedOptions, onResultChange: _this.handleChange, itemRender: _this.renderItem, clearable: clearable, allowInput: true }), loading ? react_1.default.createElement(Spinner_1.default, { size: "sm" }) : undefined),
                dropdown !== false ? (react_1.default.createElement(Overlay_1.default, { container: popOverContainer || _this.getParent, target: _this.getTarget, placement: 'auto', show: isOpen && !!finnalOptions.length },
                    react_1.default.createElement(PopOver_1.default, { overlay: true, className: cx('TagControl-popover'), onHide: _this.close },
                        react_1.default.createElement(ListMenu_1.default, { options: finnalOptions, itemRender: _this.renderItem, highlightIndex: highlightedIndex, getItemProps: function (_a) {
                                var item = _a.item, index = _a.index;
                                return ((0, tslib_1.__assign)({}, getItemProps({
                                    index: index,
                                    item: item,
                                    disabled: item.disabled
                                })));
                            } })))) : (
                // 保留原来的展现方式，不推荐
                react_1.default.createElement("div", { className: cx('TagControl-sug') },
                    optionsTip ? (react_1.default.createElement("div", { className: cx('TagControl-sugTip') }, __(optionsTip))) : null,
                    options.map(function (item, index) { return (react_1.default.createElement("div", { className: cx('TagControl-sugItem', {
                            'is-disabled': item.disabled || disabled
                        }), key: index, onClick: _this.addItem.bind(_this, item) }, item.label)); })))));
        }));
    };
    var _a, _b, _c, _d;
    TagControl.defaultProps = {
        resetValue: '',
        labelField: 'label',
        valueField: 'value',
        multiple: true,
        placeholder: 'Tag.placeholder',
        optionsTip: 'Tag.tip'
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [String, Object]),
        (0, tslib_1.__metadata)("design:returntype", Promise)
    ], TagControl.prototype, "dispatchEvent", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [String, Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], TagControl.prototype, "getValue", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", Promise)
    ], TagControl.prototype, "handleFocus", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", Promise)
    ], TagControl.prototype, "handleBlur", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], TagControl.prototype, "close", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [String]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], TagControl.prototype, "handleInputChange", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof Array !== "undefined" && Array) === "function" ? _a : Object]),
        (0, tslib_1.__metadata)("design:returntype", Promise)
    ], TagControl.prototype, "handleChange", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_b = typeof Options_1.Option !== "undefined" && Options_1.Option) === "function" ? _b : Object]),
        (0, tslib_1.__metadata)("design:returntype", Object)
    ], TagControl.prototype, "renderItem", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_c = typeof react_1.default !== "undefined" && react_1.default.KeyboardEvent) === "function" ? _c : Object]),
        (0, tslib_1.__metadata)("design:returntype", Promise)
    ], TagControl.prototype, "handleKeyDown", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_d = typeof Options_1.Option !== "undefined" && Options_1.Option) === "function" ? _d : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], TagControl.prototype, "handleOptionChange", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], TagControl.prototype, "getTarget", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], TagControl.prototype, "getParent", null);
    return TagControl;
}(react_1.default.PureComponent));
exports.default = TagControl;
var TagControlRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(TagControlRenderer, _super);
    function TagControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TagControlRenderer = (0, tslib_1.__decorate)([
        (0, Options_1.OptionsControl)({
            type: 'input-tag'
        })
    ], TagControlRenderer);
    return TagControlRenderer;
}(TagControl));
exports.TagControlRenderer = TagControlRenderer;
//# sourceMappingURL=./renderers/Form/InputTag.js.map
