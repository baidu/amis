"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CascaderSelectControlRenderer = exports.NestedSelectControlRenderer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var Overlay_1 = (0, tslib_1.__importDefault)(require("../../components/Overlay"));
var Checkbox_1 = (0, tslib_1.__importDefault)(require("../../components/Checkbox"));
var PopOver_1 = (0, tslib_1.__importDefault)(require("../../components/PopOver"));
var PopUp_1 = (0, tslib_1.__importDefault)(require("../../components/PopUp"));
var icons_1 = require("../../components/icons");
var helper_1 = require("../../utils/helper");
var Options_1 = require("../Form/Options");
var Select_1 = require("../../components/Select");
var react_dom_1 = require("react-dom");
var components_1 = require("../../components");
var xor_1 = (0, tslib_1.__importDefault)(require("lodash/xor"));
var union_1 = (0, tslib_1.__importDefault)(require("lodash/union"));
var compact_1 = (0, tslib_1.__importDefault)(require("lodash/compact"));
var RootClose_1 = require("../../utils/RootClose");
var Cascader_1 = (0, tslib_1.__importDefault)(require("../../components/Cascader"));
var NestedSelectControl = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(NestedSelectControl, _super);
    function NestedSelectControl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            isOpened: false,
            isFocused: false,
            inputValue: '',
            stack: [_this.props.options]
        };
        return _this;
    }
    NestedSelectControl.prototype.domRef = function (ref) {
        this.target = ref;
    };
    NestedSelectControl.prototype.componentDidUpdate = function (prevProps) {
        if (prevProps.options !== this.props.options) {
            this.setState({
                stack: [this.props.options]
            });
        }
    };
    NestedSelectControl.prototype.doAction = function (action, data, throwErrors) {
        var _a = this.props, resetValue = _a.resetValue, onChange = _a.onChange;
        var actionType = action === null || action === void 0 ? void 0 : action.actionType;
        if (actionType === 'clear') {
            onChange === null || onChange === void 0 ? void 0 : onChange('');
        }
        else if (actionType === 'reset') {
            onChange === null || onChange === void 0 ? void 0 : onChange(resetValue !== null && resetValue !== void 0 ? resetValue : '');
        }
    };
    NestedSelectControl.prototype.dispatchEvent = function (eventName, eventData) {
        if (eventData === void 0) { eventData = {}; }
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var _a, dispatchEvent, data, rendererEvent;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, dispatchEvent = _a.dispatchEvent, data = _a.data;
                        return [4 /*yield*/, dispatchEvent(eventName, (0, helper_1.createObject)(data, (0, tslib_1.__assign)({}, eventData)))];
                    case 1:
                        rendererEvent = _b.sent();
                        // 返回阻塞标识
                        return [2 /*return*/, !!(rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented)];
                }
            });
        });
    };
    NestedSelectControl.prototype.handleOutClick = function (e) {
        var options = this.props.options;
        e.defaultPrevented ||
            this.setState({
                isOpened: true
            });
    };
    NestedSelectControl.prototype.handleResultClear = function () {
        this.setState({
            inputValue: undefined
        });
    };
    NestedSelectControl.prototype.close = function () {
        this.setState({
            isOpened: false
        });
    };
    NestedSelectControl.prototype.removeItem = function (index, e) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var _a, onChange, selectedOptions, joinValues, valueField, extractValue, delimiter, value, isPrevented;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, onChange = _a.onChange, selectedOptions = _a.selectedOptions, joinValues = _a.joinValues, valueField = _a.valueField, extractValue = _a.extractValue, delimiter = _a.delimiter, value = _a.value;
                        e && e.stopPropagation();
                        selectedOptions.splice(index, 1);
                        if (joinValues) {
                            value = selectedOptions
                                .map(function (item) { return item[valueField || 'value']; })
                                .join(delimiter || ',');
                        }
                        else if (extractValue) {
                            value = selectedOptions.map(function (item) { return item[valueField || 'value']; });
                        }
                        return [4 /*yield*/, this.dispatchEvent('change', {
                                value: value
                            })];
                    case 1:
                        isPrevented = _b.sent();
                        isPrevented || onChange(value);
                        return [2 /*return*/];
                }
            });
        });
    };
    NestedSelectControl.prototype.renderValue = function (option, key) {
        var _a = this.props, cx = _a.classnames, labelField = _a.labelField, valueField = _a.valueField, options = _a.options, hideNodePathLabel = _a.hideNodePathLabel;
        var inputValue = this.state.inputValue;
        var regexp = (0, helper_1.string2regExp)(inputValue || '');
        if (hideNodePathLabel) {
            return option[labelField || 'label'];
        }
        var ancestors = (0, helper_1.getTreeAncestors)(options, option, true);
        return (react_1.default.createElement("span", { className: cx('Select-valueLabel'), key: key || option[valueField || 'value'] }, ancestors
            ? ancestors.map(function (item, index) {
                var label = item[labelField || 'label'];
                var isEnd = index === ancestors.length - 1;
                var unmatchText = label.split(regexp || '');
                var pointer = 0;
                return (react_1.default.createElement("span", { key: index },
                    regexp.test(label)
                        ? unmatchText.map(function (text, textIndex) {
                            var current = pointer;
                            pointer += text.length || (inputValue === null || inputValue === void 0 ? void 0 : inputValue.length) || 0;
                            return (react_1.default.createElement("span", { key: textIndex, className: cx({
                                    'NestedSelect-optionLabel-highlight': !text
                                }) }, text || label.slice(current, pointer)));
                        })
                        : label,
                    !isEnd && ' > '));
            })
            : option[labelField || 'label']));
    };
    NestedSelectControl.prototype.handleOptionClick = function (option) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var _a, multiple, onChange, joinValues, extractValue, valueField, onlyLeaf, value, isPrevented;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, multiple = _a.multiple, onChange = _a.onChange, joinValues = _a.joinValues, extractValue = _a.extractValue, valueField = _a.valueField, onlyLeaf = _a.onlyLeaf;
                        if (multiple) {
                            return [2 /*return*/];
                        }
                        value = joinValues
                            ? option[valueField || 'value']
                            : extractValue
                                ? option[valueField || 'value']
                                : option;
                        if (value === undefined) {
                            return [2 /*return*/];
                        }
                        if (onlyLeaf && option.children) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.dispatchEvent('change', {
                                value: value
                            })];
                    case 1:
                        isPrevented = _b.sent();
                        isPrevented || onChange(value);
                        isPrevented || this.handleResultClear();
                        !multiple && this.close();
                        return [2 /*return*/];
                }
            });
        });
    };
    NestedSelectControl.prototype.handleCheck = function (option, index) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var _a, onChange, selectedOptions, joinValues, delimiter, extractValue, withChildren, onlyChildren, cascade, options, onlyLeaf, stack, valueField, items, value, flattenTreeWithLeafNodes, isEvery, isEvery, toCheck, parent, newValue, isPrevented;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, onChange = _a.onChange, selectedOptions = _a.selectedOptions, joinValues = _a.joinValues, delimiter = _a.delimiter, extractValue = _a.extractValue, withChildren = _a.withChildren, onlyChildren = _a.onlyChildren, cascade = _a.cascade, options = _a.options, onlyLeaf = _a.onlyLeaf;
                        stack = this.state.stack;
                        valueField = this.props.valueField || 'value';
                        if (onlyLeaf && !Array.isArray(option) && option.children) {
                            return [2 /*return*/];
                        }
                        if (!Array.isArray(option) &&
                            option.children &&
                            option.children.length &&
                            typeof index === 'number') {
                            if (stack[index]) {
                                stack.splice(index + 1, 1, option.children);
                            }
                            else {
                                stack.push(option.children);
                            }
                        }
                        items = selectedOptions;
                        flattenTreeWithLeafNodes = function (option) {
                            return (0, compact_1.default)((0, helper_1.flattenTree)(Array.isArray(option) ? option : [option], function (node) {
                                return node.children && node.children.length ? null : node;
                            }));
                        };
                        // 三种情况：
                        // 1.全选，option为数组
                        // 2.单个选中，且有children
                        // 3.单个选中，没有children
                        if (Array.isArray(option)) {
                            if (withChildren) {
                                option = (0, helper_1.flattenTree)(option);
                            }
                            else if (onlyChildren) {
                                option = flattenTreeWithLeafNodes(option);
                            }
                            value = items.length === option.length ? [] : option;
                        }
                        else if (Array.isArray(option.children)) {
                            if (cascade) {
                                value = (0, xor_1.default)(items, [option]);
                            }
                            else if (withChildren) {
                                option = (0, helper_1.flattenTree)([option]);
                                isEvery = option.every(function (opt) { return !!~items.indexOf(opt); });
                                value = (isEvery ? xor_1.default : union_1.default)(items, option);
                            }
                            else if (onlyChildren) {
                                option = flattenTreeWithLeafNodes(option);
                                isEvery = option.every(function (opt) { return !!~items.indexOf(opt); });
                                value = (isEvery ? xor_1.default : union_1.default)(items, option);
                            }
                            else {
                                value = items.filter(function (item) { return !~(0, helper_1.flattenTree)([option]).indexOf(item); });
                                !~items.indexOf(option) && value.push(option);
                            }
                        }
                        else {
                            value = (0, xor_1.default)(items, [option]);
                        }
                        if (!cascade) {
                            toCheck = option;
                            while (true) {
                                parent = (0, helper_1.getTreeParent)(options, toCheck);
                                if (parent === null || parent === void 0 ? void 0 : parent.value) {
                                    // 如果所有孩子节点都勾选了，应该自动勾选父级。
                                    if (parent.children.every(function (child) { return ~value.indexOf(child); })) {
                                        parent.children.forEach(function (child) {
                                            var index = value.indexOf(child);
                                            if (~index && !withChildren && !onlyChildren) {
                                                value.splice(index, 1);
                                            }
                                        });
                                        if (!onlyChildren) {
                                            value.push(parent);
                                        }
                                        toCheck = parent;
                                        continue;
                                    }
                                }
                                break;
                            }
                        }
                        newValue = joinValues
                            ? value.map(function (item) { return item[valueField]; }).join(delimiter)
                            : extractValue
                                ? value.map(function (item) { return item[valueField]; })
                                : value;
                        return [4 /*yield*/, this.dispatchEvent('change', {
                                value: newValue
                            })];
                    case 1:
                        isPrevented = _b.sent();
                        isPrevented || onChange(newValue);
                        isPrevented || this.handleResultClear();
                        return [2 /*return*/];
                }
            });
        });
    };
    NestedSelectControl.prototype.allChecked = function (options) {
        var _this = this;
        var _a = this.props, selectedOptions = _a.selectedOptions, withChildren = _a.withChildren, onlyChildren = _a.onlyChildren;
        return options.every(function (option) {
            if ((withChildren || onlyChildren) && option.children) {
                return _this.allChecked(option.children);
            }
            return selectedOptions.some(function (item) { return item === option; });
        });
    };
    NestedSelectControl.prototype.partialChecked = function (options) {
        var _this = this;
        return options.some(function (option) {
            var childrenPartialChecked = option.children && _this.partialChecked(option.children);
            return (childrenPartialChecked ||
                _this.props.selectedOptions.some(function (item) { return item === option; }));
        });
    };
    NestedSelectControl.prototype.reload = function () {
        var reload = this.props.reloadOptions;
        reload && reload();
    };
    NestedSelectControl.prototype.getValue = function () {
        var _a = this.props, selectedOptions = _a.selectedOptions, joinValues = _a.joinValues, valueField = _a.valueField, extractValue = _a.extractValue, delimiter = _a.delimiter, value = _a.value;
        if (joinValues) {
            value = selectedOptions
                .map(function (item) { return item[valueField || 'value']; })
                .join(delimiter || ',');
        }
        else if (extractValue) {
            value = selectedOptions.map(function (item) { return item[valueField || 'value']; });
        }
        return value;
    };
    NestedSelectControl.prototype.onFocus = function (e) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var _a, onFocus, disabled, value, isPrevented;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, onFocus = _a.onFocus, disabled = _a.disabled;
                        value = this.getValue();
                        if (!(!disabled && !this.state.isOpened)) return [3 /*break*/, 2];
                        this.setState({
                            isFocused: true
                        });
                        return [4 /*yield*/, this.dispatchEvent('focus', {
                                value: value
                            })];
                    case 1:
                        isPrevented = _b.sent();
                        isPrevented || (onFocus && onFocus(e));
                        _b.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    NestedSelectControl.prototype.onBlur = function (e) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var onBlur, value, isPrevented;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onBlur = this.props.onBlur;
                        value = this.getValue();
                        this.setState({
                            isFocused: false
                        });
                        return [4 /*yield*/, this.dispatchEvent('blur', {
                                value: value
                            })];
                    case 1:
                        isPrevented = _a.sent();
                        isPrevented || (onBlur && onBlur(e));
                        return [2 /*return*/];
                }
            });
        });
    };
    NestedSelectControl.prototype.getTarget = function () {
        if (!this.target) {
            this.target = (0, react_dom_1.findDOMNode)(this);
        }
        return this.target;
    };
    NestedSelectControl.prototype.handleKeyPress = function (e) {
        if (e.key === ' ') {
            this.handleOutClick(e);
            e.preventDefault();
        }
    };
    NestedSelectControl.prototype.handleInputKeyDown = function (event) {
        var inputValue = this.state.inputValue;
        var _a = this.props, multiple = _a.multiple, selectedOptions = _a.selectedOptions;
        if (event.key === 'Backspace' &&
            !inputValue &&
            selectedOptions.length &&
            multiple) {
            this.removeItem(selectedOptions.length - 1);
        }
    };
    NestedSelectControl.prototype.handleInputChange = function (inputValue) {
        var _a = this.props, options = _a.options, labelField = _a.labelField, valueField = _a.valueField;
        var regexp = (0, helper_1.string2regExp)(inputValue);
        var filtedOptions = inputValue && this.state.isOpened
            ? (0, helper_1.filterTree)(options, function (option) {
                return regexp.test(option[labelField || 'label']) ||
                    regexp.test(option[valueField || 'value']) ||
                    !!(option.children && option.children.length);
            }, 1, true)
            : options.concat();
        this.setState({
            inputValue: inputValue,
            stack: [filtedOptions]
        });
    };
    NestedSelectControl.prototype.handleResultChange = function (value) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var _a, joinValues, extractValue, delimiter, valueField, onChange, multiple, newValue, isPrevented_1, isPrevented;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, joinValues = _a.joinValues, extractValue = _a.extractValue, delimiter = _a.delimiter, valueField = _a.valueField, onChange = _a.onChange, multiple = _a.multiple;
                        newValue = Array.isArray(value) ? value.concat() : [];
                        if (!(!multiple && !newValue.length)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.dispatchEvent('change', {
                                value: ''
                            })];
                    case 1:
                        isPrevented_1 = _b.sent();
                        isPrevented_1 || onChange('');
                        return [2 /*return*/];
                    case 2:
                        if (joinValues || extractValue) {
                            newValue = value.map(function (item) { return item[valueField || 'value']; });
                        }
                        if (joinValues) {
                            newValue = newValue.join(delimiter || ',');
                        }
                        return [4 /*yield*/, this.dispatchEvent('change', {
                                value: newValue
                            })];
                    case 3:
                        isPrevented = _b.sent();
                        isPrevented || onChange(newValue);
                        return [2 /*return*/];
                }
            });
        });
    };
    NestedSelectControl.prototype.renderOptions = function () {
        var _this = this;
        var _a = this.props, multiple = _a.multiple, selectedOptions = _a.selectedOptions, cx = _a.classnames, propOptions = _a.options, disabled = _a.disabled, checkAll = _a.checkAll, checkAllLabel = _a.checkAllLabel, __ = _a.translate, labelField = _a.labelField, menuClassName = _a.menuClassName, cascade = _a.cascade, onlyChildren = _a.onlyChildren;
        var valueField = this.props.valueField || 'value';
        var stack = this.state.stack;
        var partialChecked = this.partialChecked(propOptions);
        var allChecked = this.allChecked(propOptions);
        return (react_1.default.createElement(react_1.default.Fragment, null, stack.map(function (options, index) { return (react_1.default.createElement("div", { key: index, className: cx('NestedSelect-menu', menuClassName) },
            multiple && checkAll && index === 0 ? (react_1.default.createElement("div", { className: cx('NestedSelect-option', 'checkall') },
                react_1.default.createElement(Checkbox_1.default, { size: "sm", onChange: _this.handleCheck.bind(_this, options), checked: partialChecked, partial: partialChecked && !allChecked }),
                react_1.default.createElement("span", { onClick: _this.handleCheck.bind(_this, options) }, __(checkAllLabel)))) : null,
            options.map(function (option, idx) {
                var ancestors = (0, helper_1.getTreeAncestors)(propOptions, option);
                var parentChecked = ancestors === null || ancestors === void 0 ? void 0 : ancestors.some(function (item) { return !!~selectedOptions.indexOf(item); });
                var uncheckable = cascade ? false : multiple && parentChecked;
                var parentDisabled = ancestors === null || ancestors === void 0 ? void 0 : ancestors.some(function (item) { return !!item.disabled; });
                var nodeDisabled = uncheckable || option.disabled || parentDisabled || !!disabled;
                var selfChildrenChecked = !!(option.children && _this.partialChecked(option.children));
                var selfChecked = uncheckable || !!~selectedOptions.indexOf(option);
                if (!selfChecked &&
                    onlyChildren &&
                    option.children &&
                    _this.allChecked(option.children)) {
                    selfChecked = true;
                }
                return (react_1.default.createElement("div", { key: idx, className: cx('NestedSelect-option', {
                        'is-active': !nodeDisabled &&
                            (selfChecked || (!cascade && selfChildrenChecked))
                    }), onMouseEnter: _this.onMouseEnter.bind(_this, option, index) },
                    multiple ? (react_1.default.createElement(Checkbox_1.default, { size: "sm", onChange: _this.handleCheck.bind(_this, option, index), trueValue: option[valueField], checked: selfChecked || (!cascade && selfChildrenChecked), partial: !selfChecked, disabled: nodeDisabled })) : null,
                    react_1.default.createElement("div", { className: cx('NestedSelect-optionLabel', {
                            'is-disabled': nodeDisabled
                        }), onClick: function () {
                            return !nodeDisabled &&
                                (multiple
                                    ? _this.handleCheck(option, index)
                                    : _this.handleOptionClick(option));
                        } }, option[labelField || 'label']),
                    option.children && option.children.length ? (react_1.default.createElement("div", { className: cx('NestedSelect-optionArrowRight') },
                        react_1.default.createElement(icons_1.Icon, { icon: "right-arrow", className: "icon" }))) : null));
            }))); })));
    };
    NestedSelectControl.prototype.renderSearchResult = function () {
        var _this = this;
        var _a = this.state, stack = _a.stack, inputValue = _a.inputValue;
        var _b = this.props, cx = _b.classnames, __ = _b.translate, propOptions = _b.options, labelField = _b.labelField, cascade = _b.cascade, selectedOptions = _b.selectedOptions, multiple = _b.multiple, disabled = _b.disabled, onlyChildren = _b.onlyChildren, render = _b.render;
        var noResultsText = this.props.noResultsText;
        if (noResultsText) {
            noResultsText = render('noResultText', __(noResultsText));
        }
        var regexp = (0, helper_1.string2regExp)(inputValue || '');
        var flattenTreeWithNodes = (0, helper_1.flattenTree)(stack[0]).filter(function (option) {
            return regexp.test(option[labelField || 'label']);
        });
        // 一个stack一个menu
        var resultBody = (react_1.default.createElement("div", { className: cx('NestedSelect-menu') }, flattenTreeWithNodes.length ? (flattenTreeWithNodes.map(function (option, index) {
            var ancestors = (0, helper_1.getTreeAncestors)(propOptions, option);
            var uncheckable = cascade
                ? false
                : multiple &&
                    (ancestors === null || ancestors === void 0 ? void 0 : ancestors.some(function (item) { return !!~selectedOptions.indexOf(item); }));
            var isNodeDisabled = uncheckable ||
                option.disabled ||
                !!disabled ||
                (ancestors === null || ancestors === void 0 ? void 0 : ancestors.some(function (item) { return !!item.disabled; }));
            var isChildrenChecked = !!(option.children && _this.partialChecked(option.children));
            var isChecked = uncheckable || !!~selectedOptions.indexOf(option);
            if (!isChecked &&
                onlyChildren &&
                option.children &&
                _this.allChecked(option.children)) {
                isChecked = true;
            }
            return (react_1.default.createElement("div", { className: cx('NestedSelect-option', {
                    'is-active': !isNodeDisabled &&
                        (isChecked || (!cascade && isChildrenChecked))
                }), key: index },
                react_1.default.createElement("div", { className: cx('NestedSelect-optionLabel', {
                        'is-disabled': isNodeDisabled
                    }), onClick: function () {
                        !isNodeDisabled &&
                            (multiple
                                ? _this.handleCheck(option, option.value)
                                : _this.handleOptionClick(option));
                    } }, _this.renderValue(option, option.value))));
        })) : (react_1.default.createElement("div", { className: cx('NestedSelect-option', {
                'no-result': true
            }) }, noResultsText))));
        return resultBody;
    };
    NestedSelectControl.prototype.onMouseEnter = function (option, index, e) {
        var stack = this.state.stack;
        index = index + 1;
        var children = option.children;
        if (children && children.length) {
            if (stack[index]) {
                stack.splice(index, 1, children);
            }
            else {
                stack.push(children);
            }
        }
        else {
            stack[index] && stack.splice(index, 1);
        }
        this.setState({ stack: stack.slice(0, index + 1) });
    };
    NestedSelectControl.prototype.renderOuter = function () {
        var _this = this;
        var _a = this.props, popOverContainer = _a.popOverContainer, __ = _a.translate, cx = _a.classnames, options = _a.options, render = _a.render;
        var isSearch = !!this.state.inputValue;
        var noResultsText = this.props.noResultsText;
        if (noResultsText) {
            noResultsText = render('noResultText', __(noResultsText));
        }
        var body = (react_1.default.createElement(RootClose_1.RootClose, { disabled: !this.state.isOpened, onRootClose: this.close }, function (ref) {
            return (react_1.default.createElement("div", { className: cx('NestedSelect-menuOuter'), ref: ref }, isSearch ? (_this.renderSearchResult()) : options.length ? (_this.renderOptions()) : (react_1.default.createElement("div", { className: cx('NestedSelect-noResult') }, noResultsText))));
        }));
        return (react_1.default.createElement(Overlay_1.default, { target: this.getTarget, container: popOverContainer || (function () { return (0, react_dom_1.findDOMNode)(_this); }), placement: 'auto', show: true },
            react_1.default.createElement(PopOver_1.default, { className: cx('NestedSelect-popover') }, body)));
    };
    NestedSelectControl.prototype.render = function () {
        var _a;
        var _b = this.props, className = _b.className, disabled = _b.disabled, cx = _b.classnames, multiple = _b.multiple, placeholder = _b.placeholder, __ = _b.translate, inline = _b.inline, searchable = _b.searchable, autoComplete = _b.autoComplete, selectedOptions = _b.selectedOptions, clearable = _b.clearable, loading = _b.loading, borderMode = _b.borderMode, useMobileUI = _b.useMobileUI, env = _b.env;
        var mobileUI = useMobileUI && (0, helper_1.isMobile)();
        return (react_1.default.createElement("div", { className: cx('NestedSelectControl', className) },
            react_1.default.createElement(components_1.ResultBox, { useMobileUI: useMobileUI, disabled: disabled, ref: this.domRef, placeholder: __(placeholder !== null && placeholder !== void 0 ? placeholder : 'placeholder.empty'), className: cx("NestedSelect", (_a = {
                        'NestedSelect--inline': inline,
                        'NestedSelect--single': !multiple,
                        'NestedSelect--multi': multiple,
                        'NestedSelect--searchable': searchable,
                        'is-opened': this.state.isOpened,
                        'is-focused': this.state.isFocused
                    },
                    _a["NestedSelect--border".concat((0, helper_1.ucFirst)(borderMode))] = borderMode,
                    _a)), result: multiple
                    ? selectedOptions
                    : selectedOptions.length
                        ? selectedOptions[0]
                        : '', onResultClick: this.handleOutClick, value: this.state.inputValue, onChange: this.handleInputChange, onResultChange: this.handleResultChange, onClear: this.handleResultClear, itemRender: this.renderValue, onKeyPress: this.handleKeyPress, onFocus: this.onFocus, onBlur: this.onBlur, onKeyDown: this.handleInputKeyDown, clearable: clearable, hasDropDownArrow: true, allowInput: searchable, inputPlaceholder: '' }, loading ? react_1.default.createElement(components_1.Spinner, { size: "sm" }) : undefined),
            mobileUI ? (react_1.default.createElement(PopUp_1.default, { className: cx("NestedSelect-popup"), container: env && env.getModalContainer ? env.getModalContainer : undefined, isShow: this.state.isOpened, onHide: this.close, showConfirm: false, showClose: false },
                react_1.default.createElement(Cascader_1.default, (0, tslib_1.__assign)({ onClose: this.close }, this.props, { onChange: this.handleResultChange, options: this.props.options.slice(), value: selectedOptions })))) : this.state.isOpened ? (this.renderOuter()) : null));
    };
    var _a, _b, _c, _d, _e, _f, _g, _h;
    NestedSelectControl.defaultProps = {
        cascade: false,
        withChildren: false,
        onlyChildren: false,
        onlyLeaf: false,
        searchPromptText: 'Select.searchPromptText',
        noResultsText: 'noResult',
        checkAll: true,
        checkAllLabel: 'Select.checkAll',
        hideNodePathLabel: false
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], NestedSelectControl.prototype, "domRef", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [String, Object]),
        (0, tslib_1.__metadata)("design:returntype", Promise)
    ], NestedSelectControl.prototype, "dispatchEvent", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof react_1.default !== "undefined" && react_1.default.MouseEvent) === "function" ? _a : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], NestedSelectControl.prototype, "handleOutClick", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], NestedSelectControl.prototype, "handleResultClear", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], NestedSelectControl.prototype, "close", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_b = typeof Select_1.Option !== "undefined" && Select_1.Option) === "function" ? _b : Object, Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], NestedSelectControl.prototype, "renderValue", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_c = typeof Select_1.Option !== "undefined" && Select_1.Option) === "function" ? _c : Object]),
        (0, tslib_1.__metadata)("design:returntype", Promise)
    ], NestedSelectControl.prototype, "handleOptionClick", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object, Number]),
        (0, tslib_1.__metadata)("design:returntype", Promise)
    ], NestedSelectControl.prototype, "handleCheck", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], NestedSelectControl.prototype, "getValue", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", Promise)
    ], NestedSelectControl.prototype, "onFocus", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", Promise)
    ], NestedSelectControl.prototype, "onBlur", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], NestedSelectControl.prototype, "getTarget", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_f = typeof react_1.default !== "undefined" && react_1.default.KeyboardEvent) === "function" ? _f : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], NestedSelectControl.prototype, "handleKeyPress", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_g = typeof react_1.default !== "undefined" && react_1.default.KeyboardEvent) === "function" ? _g : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], NestedSelectControl.prototype, "handleInputKeyDown", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [String]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], NestedSelectControl.prototype, "handleInputChange", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_h = typeof Array !== "undefined" && Array) === "function" ? _h : Object]),
        (0, tslib_1.__metadata)("design:returntype", Promise)
    ], NestedSelectControl.prototype, "handleResultChange", null);
    return NestedSelectControl;
}(react_1.default.Component));
exports.default = NestedSelectControl;
var NestedSelectControlRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(NestedSelectControlRenderer, _super);
    function NestedSelectControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NestedSelectControlRenderer = (0, tslib_1.__decorate)([
        (0, Options_1.OptionsControl)({
            type: 'nested-select'
        })
    ], NestedSelectControlRenderer);
    return NestedSelectControlRenderer;
}(NestedSelectControl));
exports.NestedSelectControlRenderer = NestedSelectControlRenderer;
var CascaderSelectControlRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(CascaderSelectControlRenderer, _super);
    function CascaderSelectControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CascaderSelectControlRenderer = (0, tslib_1.__decorate)([
        (0, Options_1.OptionsControl)({
            type: 'cascader-select'
        })
    ], CascaderSelectControlRenderer);
    return CascaderSelectControlRenderer;
}(NestedSelectControl));
exports.CascaderSelectControlRenderer = CascaderSelectControlRenderer;
//# sourceMappingURL=./renderers/Form/NestedSelect.js.map
