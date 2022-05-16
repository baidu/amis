"use strict";
/**
 * @file Select
 * @description
 * @author fex
 * @date 2017-11-07
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectWithRemoteOptions = exports.Select = exports.normalizeOptions = exports.optionValueCompare = exports.matchOptionValue = exports.expandValue = exports.value2array = exports.Options = exports.Option = void 0;
var tslib_1 = require("tslib");
var uncontrollable_1 = require("uncontrollable");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var virtual_list_1 = (0, tslib_1.__importDefault)(require("./virtual-list"));
var Overlay_1 = (0, tslib_1.__importDefault)(require("./Overlay"));
var PopOver_1 = (0, tslib_1.__importDefault)(require("./PopOver"));
var TooltipWrapper_1 = (0, tslib_1.__importDefault)(require("./TooltipWrapper"));
var downshift_1 = (0, tslib_1.__importDefault)(require("downshift"));
var icons_1 = require("./icons");
// @ts-ignore
var match_sorter_1 = require("match-sorter");
var helper_1 = require("../utils/helper");
var isPlainObject_1 = (0, tslib_1.__importDefault)(require("lodash/isPlainObject"));
var Options_1 = require("../renderers/Form/Options");
var react_dom_1 = require("react-dom");
var theme_1 = require("../theme");
var Checkbox_1 = (0, tslib_1.__importDefault)(require("./Checkbox"));
var Input_1 = (0, tslib_1.__importDefault)(require("./Input"));
var locale_1 = require("../locale");
var Spinner_1 = (0, tslib_1.__importDefault)(require("./Spinner"));
var Schema_1 = require("../Schema");
Object.defineProperty(exports, "Option", { enumerable: true, get: function () { return Schema_1.Option; } });
Object.defineProperty(exports, "Options", { enumerable: true, get: function () { return Schema_1.Options; } });
var WithRemoteConfig_1 = require("./WithRemoteConfig");
var PopUp_1 = (0, tslib_1.__importDefault)(require("./PopUp"));
function value2array(value, props, enableNodePath) {
    if (enableNodePath === void 0) { enableNodePath = false; }
    if (enableNodePath) {
        value = (0, helper_1.normalizeNodePath)(value, enableNodePath, props.labelField, props.valueField, props.pathSeparator, props.delimiter).nodeValueArray;
    }
    if (props.multi || props.multiple) {
        if (typeof value === 'string') {
            value = value.split(props.delimiter || ',');
        }
        if (!Array.isArray(value)) {
            if (value === null || value === undefined) {
                return [];
            }
            value = [value];
        }
        return value
            .map(function (value) {
            return expandValue(value, props.options, props.valueField) ||
                ((0, helper_1.isObject)(value) && value.hasOwnProperty(props.valueField || 'value')
                    ? value
                    : undefined);
        })
            .filter(function (item) { return item; });
    }
    else if (Array.isArray(value)) {
        value = value[0];
    }
    var expandedValue = expandValue(value, props.options, props.valueField);
    return expandedValue
        ? [expandedValue]
        : (0, helper_1.isObject)(value) &&
            value.hasOwnProperty(props.valueField || 'value')
            ? [value]
            : [];
}
exports.value2array = value2array;
function expandValue(value, options, valueField) {
    var _a;
    if (valueField === void 0) { valueField = 'value'; }
    var valueType = typeof value;
    if (valueType !== 'string' &&
        valueType !== 'number' &&
        valueType !== 'boolean' &&
        valueType !== 'object') {
        return value;
    }
    if (!options) {
        return null;
    }
    if (valueType === 'object' &&
        value &&
        value.hasOwnProperty(valueField || 'value')) {
        value = (_a = value[valueField || 'value']) !== null && _a !== void 0 ? _a : '';
    }
    return (0, helper_1.findTree)(options, optionValueCompare(value, valueField || 'value'));
}
exports.expandValue = expandValue;
function matchOptionValue(a, b, valueField) {
    if (valueField === void 0) { valueField = 'value'; }
    return (0, helper_1.isObject)(a)
        ? a === b[valueField || 'value']
        : String(b[valueField || 'value']) === String(a);
}
exports.matchOptionValue = matchOptionValue;
function optionValueCompare(a, valueField) {
    if (valueField === void 0) { valueField = 'value'; }
    return function (b) { return matchOptionValue(a, b, valueField); };
}
exports.optionValueCompare = optionValueCompare;
function normalizeOptions(options, share, valueField) {
    if (share === void 0) { share = {
        values: [],
        options: []
    }; }
    if (valueField === void 0) { valueField = 'value'; }
    if (typeof options === 'string') {
        return options.split(',').map(function (item) {
            var idx = share.values.indexOf(item);
            if (~idx) {
                return share.options[idx];
            }
            var option = {
                label: item,
                value: item
            };
            share.values.push(option.value);
            share.options.push(option);
            return option;
        });
    }
    else if (Array.isArray(options) &&
        typeof options[0] === 'string') {
        return options.map(function (item) {
            var idx = share.values.indexOf(item);
            if (~idx) {
                return share.options[idx];
            }
            var option = {
                label: item,
                value: item
            };
            share.values.push(option.value);
            share.options.push(option);
            return option;
        });
    }
    else if (Array.isArray(options)) {
        return options.map(function (item) {
            var value = item && item[valueField];
            var idx = value !== undefined && !item.children
                ? share.values.indexOf(value)
                : -1;
            if (~idx) {
                return share.options[idx];
            }
            var option = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, item), { value: value });
            if (typeof option.children !== 'undefined') {
                option.children = normalizeOptions(option.children, share, valueField);
            }
            else if (value !== undefined) {
                share.values.push(value);
                share.options.push(option);
            }
            return option;
        });
    }
    else if ((0, isPlainObject_1.default)(options)) {
        return Object.keys(options).map(function (key) {
            var idx = share.values.indexOf(key);
            if (~idx) {
                return share.options[idx];
            }
            var option = {
                label: options[key],
                value: key
            };
            share.values.push(option.value);
            share.options.push(option);
            return option;
        });
    }
    return [];
}
exports.normalizeOptions = normalizeOptions;
var DownshiftChangeTypes = downshift_1.default.stateChangeTypes;
var Select = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Select, _super);
    function Select(props) {
        var _this = _super.call(this, props) || this;
        _this.menu = react_1.default.createRef();
        _this.state = {
            isOpen: props.defaultOpen || false,
            isFocused: false,
            inputValue: '',
            highlightedIndex: -1,
            selection: value2array(props.value, props),
            itemHeight: 35,
            pickerSelectItem: ''
        };
        return _this;
    }
    Select.prototype.componentDidMount = function () {
        var loadOptions = this.props.loadOptions;
        loadOptions && loadOptions('');
    };
    Select.prototype.componentDidUpdate = function (prevProps) {
        var props = this.props;
        var fn = helper_1.noop;
        if (JSON.stringify(props.value) !== JSON.stringify(prevProps.value) ||
            JSON.stringify(props.options) !== JSON.stringify(prevProps.options)) {
            var selection = value2array(props.value, props);
            this.setState({
                selection: selection
            }, fn);
        }
    };
    Select.prototype.open = function () {
        var _this = this;
        this.props.disabled ||
            this.setState({
                isOpen: true,
                highlightedIndex: -1
            }, function () { return setTimeout(_this.focus, 500); });
    };
    Select.prototype.close = function () {
        this.setState({
            isOpen: false
        });
    };
    Select.prototype.confirm = function () {
        // @ts-ignore
        this.handleChange(this.state.pickerSelectItem);
        this.setState({
            isOpen: false
        });
    };
    Select.prototype.toggle = function (e) {
        var _this = this;
        if (e &&
            this.menu.current &&
            this.menu.current.contains(e.target)) {
            return;
        }
        this.props.disabled ||
            this.setState({
                isOpen: !this.state.isOpen,
                highlightedIndex: -1
            }, this.state.isOpen ? undefined : function () { return setTimeout(_this.focus, 500); });
    };
    Select.prototype.onFocus = function (e) {
        var simpleValue = this.props.simpleValue;
        var selection = this.state.selection;
        var value = simpleValue ? selection.map(function (item) { return item.value; }) : selection;
        this.props.disabled ||
            this.state.isOpen ||
            this.setState({
                isFocused: true
            }, this.focus);
        this.props.onFocus &&
            this.props.onFocus((0, tslib_1.__assign)((0, tslib_1.__assign)({}, e), { value: value }));
    };
    Select.prototype.onBlur = function (e) {
        var simpleValue = this.props.simpleValue;
        var selection = this.state.selection;
        var value = simpleValue ? selection.map(function (item) { return item.value; }) : selection;
        this.setState({
            isFocused: false
        });
        this.props.onBlur &&
            this.props.onBlur((0, tslib_1.__assign)((0, tslib_1.__assign)({}, e), { value: value }));
    };
    Select.prototype.focus = function () {
        this.input
            ? this.input.focus()
            : this.getTarget() && this.getTarget().focus();
    };
    Select.prototype.blur = function () {
        this.input
            ? this.input.blur()
            : this.getTarget() && this.getTarget().blur();
    };
    Select.prototype.getTarget = function () {
        if (!this.target) {
            this.target = (0, react_dom_1.findDOMNode)(this);
        }
        return this.target;
    };
    Select.prototype.inputRef = function (ref) {
        this.input = ref;
    };
    Select.prototype.toggleCheckAll = function () {
        var _a = this.props, options = _a.options, onChange = _a.onChange, simpleValue = _a.simpleValue, checkAllBySearch = _a.checkAllBySearch, labelField = _a.labelField, valueField = _a.valueField;
        var inputValue = this.state.inputValue;
        var selection = this.state.selection;
        var filtedOptions = inputValue && checkAllBySearch
            ? (0, match_sorter_1.matchSorter)(options, inputValue, {
                keys: [labelField || 'label', valueField || 'value']
            })
            : options.concat();
        var optionsValues = filtedOptions.map(function (option) { return option.value; });
        var selectionValues = selection.map(function (select) { return select.value; });
        var checkedAll = optionsValues.every(function (option) { return selectionValues.indexOf(option) > -1; });
        selection = checkedAll ? [] : filtedOptions;
        onChange(simpleValue ? selection.map(function (item) { return item.value; }) : selection);
    };
    Select.prototype.removeItem = function (index, e) {
        var _a = this.props, onChange = _a.onChange, simpleValue = _a.simpleValue, disabled = _a.disabled;
        if (disabled) {
            return;
        }
        var value = this.state.selection;
        e && e.stopPropagation();
        value = Array.isArray(value) ? value.concat() : [value];
        value.splice(index, 1);
        onChange(simpleValue ? value.map(function (item) { return item.value; }) : value);
    };
    Select.prototype.handleInputChange = function (evt) {
        var _this = this;
        var loadOptions = this.props.loadOptions;
        this.setState({
            inputValue: evt.currentTarget.value
        }, function () { return loadOptions && loadOptions(_this.state.inputValue); });
    };
    Select.prototype.handlePickerChange = function (selectItem, index, confirm) {
        if (!this.props.multiple) {
            selectItem = selectItem[0];
        }
        this.setState({
            pickerSelectItem: selectItem
        });
        // 直接选中选项
        if (confirm) {
            this.handleChange(selectItem);
        }
    };
    Select.prototype.handleChange = function (selectItem) {
        var _a = this.props, onChange = _a.onChange, multiple = _a.multiple, simpleValue = _a.simpleValue, valueField = _a.valueField;
        var selection = this.state.selection;
        if (multiple) {
            var selectionValues = selection.map(function (item) { return item[valueField]; });
            selection = selection.concat();
            var idx = selectionValues.indexOf(selectItem[valueField]);
            if (~idx) {
                selection.splice(idx, 1);
            }
            else {
                selection.push(selectItem);
            }
            onChange(simpleValue ? selection.map(function (item) { return item[valueField]; }) : selection);
        }
        else {
            onChange(simpleValue ? selectItem[valueField] : selectItem);
        }
    };
    Select.prototype.handleStateChange = function (changes) {
        var _a = this.props, multiple = _a.multiple, checkAll = _a.checkAll;
        var update = {};
        switch (changes.type) {
            case DownshiftChangeTypes.keyDownEnter:
            case DownshiftChangeTypes.clickItem:
                update = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, update), { isOpen: multiple ? true : false, isFocused: multiple && checkAll ? true : false });
                break;
            case DownshiftChangeTypes.controlledPropUpdatedSelectedItem:
                break;
            case DownshiftChangeTypes.changeInput:
                update.highlightedIndex = 0;
                break;
            case DownshiftChangeTypes.keyDownArrowDown:
            case DownshiftChangeTypes.keyDownArrowUp:
            case DownshiftChangeTypes.itemMouseEnter:
                update = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, update), changes);
                break;
        }
        if (Object.keys(update).length) {
            this.setState(update);
        }
    };
    Select.prototype.handleKeyPress = function (e) {
        if (this.props.multiple && e.key === ' ') {
            this.toggle();
            e.preventDefault();
        }
    };
    Select.prototype.clearValue = function (e) {
        var onChange = this.props.onChange;
        e.preventDefault();
        e.stopPropagation();
        onChange(this.props.resetValue);
    };
    Select.prototype.clearSearchValue = function () {
        var loadOptions = this.props.loadOptions;
        this.setState({
            inputValue: ''
        }, function () { return loadOptions === null || loadOptions === void 0 ? void 0 : loadOptions(''); });
    };
    Select.prototype.handleAddClick = function () {
        var onAdd = this.props.onAdd;
        onAdd && onAdd();
    };
    Select.prototype.handleEditClick = function (e, item) {
        var onEdit = this.props.onEdit;
        e.preventDefault();
        e.stopPropagation();
        onEdit && onEdit(item);
    };
    Select.prototype.handleDeleteClick = function (e, item) {
        var onDelete = this.props.onDelete;
        e.preventDefault();
        e.stopPropagation();
        onDelete && onDelete(item);
    };
    Select.prototype.menuItemRef = function (ref) {
        ref && this.setState({ itemHeight: ref.offsetHeight });
    };
    Select.prototype.renderValue = function (_a) {
        var _this = this;
        var inputValue = _a.inputValue, isOpen = _a.isOpen;
        var _b = this.props, cx = _b.classnames, multiple = _b.multiple, valuesNoWrap = _b.valuesNoWrap, placeholder = _b.placeholder, labelField = _b.labelField, disabled = _b.disabled, __ = _b.translate;
        var selection = this.state.selection;
        // console.log('selection', selection);
        if (!selection.length) {
            return (react_1.default.createElement("div", { key: "placeholder", className: cx('Select-placeholder') }, __(placeholder)));
        }
        return selection.map(function (item, index) {
            if (!multiple) {
                return (react_1.default.createElement("div", { className: cx('Select-value', {
                        'is-disabled': disabled,
                        'is-invalid': item.__unmatched
                    }), key: index }, item[labelField || 'label']));
            }
            return valuesNoWrap ? ("".concat(item[labelField || 'label']).concat(index === selection.length - 1 ? '' : ' + ')) : (react_1.default.createElement(TooltipWrapper_1.default, { placement: 'top', tooltip: item[labelField || 'label'], trigger: 'hover', key: index },
                react_1.default.createElement("div", { className: cx('Select-value', {
                        'is-disabled': disabled,
                        'is-invalid': item.__unmatched
                    }) },
                    react_1.default.createElement("span", { className: cx('Select-valueLabel') }, item[labelField || 'label']),
                    react_1.default.createElement("span", { className: cx('Select-valueIcon', {
                            'is-disabled': disabled || item.disabled
                        }), onClick: _this.removeItem.bind(_this, index) }, "\u00D7"))));
        });
    };
    Select.prototype.renderOuter = function (_a) {
        var _this = this;
        var selectedItem = _a.selectedItem, getItemProps = _a.getItemProps, highlightedIndex = _a.highlightedIndex, inputValue = _a.inputValue, isOpen = _a.isOpen, getToggleButtonProps = _a.getToggleButtonProps, getInputProps = _a.getInputProps;
        var _b = this.props, popOverContainer = _b.popOverContainer, options = _b.options, value = _b.value, valueField = _b.valueField, labelField = _b.labelField, noResultsText = _b.noResultsText, loadOptions = _b.loadOptions, creatable = _b.creatable, multiple = _b.multiple, valuesNoWrap = _b.valuesNoWrap, cx = _b.classnames, popoverClassName = _b.popoverClassName, checkAll = _b.checkAll, checkAllLabel = _b.checkAllLabel, checkAllBySearch = _b.checkAllBySearch, searchable = _b.searchable, createBtnLabel = _b.createBtnLabel, disabled = _b.disabled, searchPromptText = _b.searchPromptText, editable = _b.editable, removable = _b.removable, overlayPlacement = _b.overlayPlacement, __ = _b.translate, hideSelected = _b.hideSelected, renderMenu = _b.renderMenu, mobileClassName = _b.mobileClassName, _c = _b.useMobileUI, useMobileUI = _c === void 0 ? false : _c;
        var selection = this.state.selection;
        var checkedAll = false;
        var checkedPartial = false;
        var filtedOptions = (inputValue && isOpen && !loadOptions
            ? (0, match_sorter_1.matchSorter)(options, inputValue, {
                keys: [labelField || 'label', valueField || 'value']
            })
            : options.concat()).filter(function (option) { return !option.hidden && option.visible !== false; });
        var selectionValues = selection.map(function (select) { return select[valueField]; });
        if (multiple && checkAll) {
            var optionsValues = (checkAllBySearch ? filtedOptions : options).map(function (option) { return option[valueField]; });
            checkedAll = optionsValues.every(function (option) { return selectionValues.indexOf(option) > -1; });
            checkedPartial = optionsValues.some(function (option) { return selectionValues.indexOf(option) > -1; });
        }
        var itemHeight = this.state.itemHeight;
        // 渲染单个选项
        var renderItem = function (_a) {
            var index = _a.index, style = _a.style;
            var item = filtedOptions[index];
            if (!item) {
                return null;
            }
            var checked = selectedItem === item || !!~selectionValues.indexOf(item[valueField]);
            if (hideSelected && checked) {
                return null;
            }
            return (react_1.default.createElement("div", (0, tslib_1.__assign)({}, getItemProps({
                key: typeof item.value === 'string'
                    ? "".concat(item.label, "-").concat(item.value)
                    : index,
                index: index,
                item: item,
                disabled: item.disabled
            }), { style: style, className: cx("Select-option", {
                    'is-disabled': item.disabled,
                    'is-highlight': highlightedIndex === index,
                    'is-active': checked
                }) }),
                removable ? (react_1.default.createElement("a", { "data-tooltip": __('Select.clear'), "data-position": "left" },
                    react_1.default.createElement(icons_1.Icon, { icon: "minus", className: "icon", onClick: function (e) { return _this.handleDeleteClick(e, item); } }))) : null,
                editable ? (react_1.default.createElement("a", { "data-tooltip": "\u7F16\u8F91", "data-position": "left" },
                    react_1.default.createElement(icons_1.Icon, { icon: "pencil", className: "icon", onClick: function (e) { return _this.handleEditClick(e, item); } }))) : null,
                renderMenu ? (multiple ? (react_1.default.createElement(Checkbox_1.default, { checked: checked, trueValue: item.value, onChange: function () {
                        _this.handleChange(item);
                    }, disabled: item.disabled }, renderMenu(item, {
                    multiple: multiple,
                    checkAll: checkAll,
                    checked: checked,
                    onChange: function () { return _this.handleChange(item); },
                    inputValue: inputValue || '',
                    searchable: searchable,
                    index: index
                }))) : (renderMenu(item, {
                    multiple: multiple,
                    checkAll: checkAll,
                    checked: checked,
                    onChange: function () { return _this.handleChange(item); },
                    inputValue: inputValue || '',
                    searchable: searchable,
                    index: index
                }))) : multiple ? (react_1.default.createElement(Checkbox_1.default, { checked: checked, trueValue: item.value, onChange: function () {
                        _this.handleChange(item);
                    }, disabled: item.disabled, size: "sm" },
                    item.disabled
                        ? item[labelField]
                        : (0, Options_1.highlight)(item[labelField], inputValue, cx('Select-option-hl')),
                    item.tip)) : (react_1.default.createElement("span", null,
                    item.disabled
                        ? item[labelField]
                        : (0, Options_1.highlight)(item[labelField], inputValue, cx('Select-option-hl')),
                    item.tip))));
        };
        var mobileUI = (0, helper_1.isMobile)() && useMobileUI;
        var column = {
            labelField: 'label',
            options: filtedOptions
        };
        var menu = (react_1.default.createElement("div", { ref: this.menu, className: cx('Select-menu', {
                'Select--longlist': filtedOptions.length && filtedOptions.length > 100,
                'is-mobile': mobileUI
            }) },
            searchable ? (react_1.default.createElement("div", { className: cx("Select-input", {
                    'is-focused': this.state.isFocused
                }) },
                react_1.default.createElement(icons_1.Icon, { icon: "search", className: "icon" }),
                react_1.default.createElement(Input_1.default, (0, tslib_1.__assign)({}, getInputProps({
                    onFocus: this.onFocus,
                    onBlur: this.onBlur,
                    disabled: disabled,
                    placeholder: __(searchPromptText),
                    onChange: this.handleInputChange,
                    ref: this.inputRef
                }))),
                (inputValue === null || inputValue === void 0 ? void 0 : inputValue.length) ? (react_1.default.createElement("a", { onClick: this.clearSearchValue, className: cx('Select-clear') },
                    react_1.default.createElement(icons_1.Icon, { icon: "close", className: "icon" }))) : null)) : null,
            multiple && valuesNoWrap ? (react_1.default.createElement("div", { className: cx('Select-option') },
                "\u5DF2\u9009\u62E9(",
                selectionValues.length,
                ")")) : null,
            multiple && checkAll && filtedOptions.length ? (react_1.default.createElement("div", { className: cx('Select-option') },
                react_1.default.createElement(Checkbox_1.default, { checked: checkedPartial, partial: checkedPartial && !checkedAll, onChange: this.toggleCheckAll, size: "sm" }, __(checkAllLabel)))) : null,
            react_1.default.createElement("div", { ref: this.menuItemRef, className: cx('Select-option invisible') }, multiple ? (react_1.default.createElement(Checkbox_1.default, { size: "sm" }, "Placeholder")) : (react_1.default.createElement("span", null, "Placeholder"))),
            creatable && !disabled ? (react_1.default.createElement("a", { className: cx('Select-addBtn'), onClick: this.handleAddClick },
                react_1.default.createElement(icons_1.Icon, { icon: "plus", className: "icon" }),
                __(createBtnLabel))) : null,
            filtedOptions.length ? (filtedOptions.length > 100 ? ( // 超过 100 行数据才启用 virtuallist 避免滚动条问题
            react_1.default.createElement(virtual_list_1.default, { height: filtedOptions.length > 8
                    ? 266
                    : filtedOptions.length * itemHeight, itemCount: filtedOptions.length, itemSize: itemHeight, renderItem: renderItem })) : (filtedOptions.map(function (item, index) {
                return renderItem({ index: index });
            }))) : (react_1.default.createElement("div", { className: cx('Select-noResult') }, __(noResultsText)))));
        return mobileUI ? (react_1.default.createElement(PopUp_1.default, { className: cx("Select-popup"), container: popOverContainer, isShow: this.state.isOpen, onHide: this.close }, menu)) : (react_1.default.createElement(Overlay_1.default, { container: popOverContainer || this.getTarget, target: this.getTarget, placement: overlayPlacement, show: true },
            react_1.default.createElement(PopOver_1.default, { overlay: true, className: cx('Select-popover'), style: {
                    minWidth: this.target ? this.target.offsetWidth : 'auto'
                }, onHide: this.close }, menu)));
    };
    Select.prototype.render = function () {
        var _this = this;
        var _a = this.props, cx = _a.classnames, multiple = _a.multiple, valuesNoWrap = _a.valuesNoWrap, searchable = _a.searchable, inline = _a.inline, block = _a.block, className = _a.className, value = _a.value, loading = _a.loading, clearable = _a.clearable, labelField = _a.labelField, disabled = _a.disabled, checkAll = _a.checkAll, borderMode = _a.borderMode, useMobileUI = _a.useMobileUI, hasError = _a.hasError;
        var selection = this.state.selection;
        var inputValue = this.state.inputValue;
        var resetValue = this.props.resetValue;
        var mobileUI = useMobileUI && (0, helper_1.isMobile)();
        return (react_1.default.createElement(downshift_1.default, { selectedItem: selection, highlightedIndex: this.state.highlightedIndex, isOpen: this.state.isOpen, inputValue: inputValue, onChange: 
            /*展示 Checkbox 的时候，会出发多次 onChange 原因待查*/ multiple ||
                checkAll
                ? helper_1.noop
                : this.handleChange, onStateChange: this.handleStateChange, itemToString: function (item) { return (item ? "".concat(item[labelField]) : ''); } }, function (options) {
            var _a;
            var isOpen = options.isOpen;
            return (react_1.default.createElement("div", { tabIndex: disabled ? -1 : 0, onKeyPress: _this.handleKeyPress, onClick: _this.toggle, onFocus: _this.onFocus, onBlur: _this.onBlur, className: cx("Select", (_a = {},
                    _a["Select--multi"] = multiple,
                    _a["Select--inline"] = inline,
                    _a["Select--block"] = block,
                    _a["Select--searchable"] = searchable,
                    _a['is-opened'] = isOpen,
                    _a['is-focused'] = _this.state.isFocused,
                    _a['is-disabled'] = disabled,
                    _a['is-mobile'] = mobileUI,
                    _a['is-error'] = hasError,
                    _a["Select--border".concat((0, helper_1.ucFirst)(borderMode))] = borderMode,
                    _a), className) },
                react_1.default.createElement("div", { className: cx("Select-valueWrap", {
                        'Select-valuesNoWrap': valuesNoWrap
                    }) }, _this.renderValue(options)),
                clearable &&
                    !disabled &&
                    (Array.isArray(value)
                        ? value.length
                        : value != null && value !== resetValue) ? (react_1.default.createElement("a", { onClick: _this.clearValue, className: cx('Select-clear') },
                    react_1.default.createElement(icons_1.Icon, { icon: "close-small", className: "icon" }))) : null,
                loading ? (react_1.default.createElement(Spinner_1.default, { show: true, icon: "reload", size: "sm", spinnerClassName: cx('Select-spinner') })) : null,
                react_1.default.createElement("span", { className: cx('Select-arrow') },
                    react_1.default.createElement(icons_1.Icon, { icon: "caret", className: "icon" })),
                isOpen ? _this.renderOuter(options) : null));
        }));
    };
    var _a, _b, _c, _d, _e, _f, _g;
    Select.defaultProps = {
        multiple: false,
        clearable: true,
        creatable: false,
        createBtnLabel: 'Select.createLabel',
        searchPromptText: 'Select.searchPromptText',
        loadingPlaceholder: 'loading',
        noResultsText: 'noResult',
        clearAllText: 'Select.clearAll',
        clearValueText: 'Select.clear',
        placeholder: 'Select.placeholder',
        valueField: 'value',
        labelField: 'label',
        resetValue: '',
        inline: false,
        disabled: false,
        checkAll: false,
        checkAllLabel: 'Select.checkAll',
        defaultCheckAll: false,
        overlayPlacement: 'auto'
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Select.prototype, "open", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Select.prototype, "close", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Select.prototype, "confirm", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof react_1.default !== "undefined" && react_1.default.MouseEvent) === "function" ? _a : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Select.prototype, "toggle", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Select.prototype, "onFocus", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Select.prototype, "onBlur", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Select.prototype, "focus", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Select.prototype, "getTarget", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_b = typeof HTMLInputElement !== "undefined" && HTMLInputElement) === "function" ? _b : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Select.prototype, "inputRef", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Select.prototype, "toggleCheckAll", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_c = typeof react_1.default !== "undefined" && react_1.default.ChangeEvent) === "function" ? _c : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Select.prototype, "handleInputChange", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object, Number, Boolean]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Select.prototype, "handlePickerChange", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Select.prototype, "handleChange", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Select.prototype, "handleStateChange", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_d = typeof react_1.default !== "undefined" && react_1.default.KeyboardEvent) === "function" ? _d : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Select.prototype, "handleKeyPress", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_e = typeof react_1.default !== "undefined" && react_1.default.MouseEvent) === "function" ? _e : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Select.prototype, "clearValue", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Select.prototype, "clearSearchValue", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Select.prototype, "handleAddClick", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_f = typeof Event !== "undefined" && Event) === "function" ? _f : Object, Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Select.prototype, "handleEditClick", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_g = typeof Event !== "undefined" && Event) === "function" ? _g : Object, Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Select.prototype, "handleDeleteClick", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Select.prototype, "menuItemRef", null);
    return Select;
}(react_1.default.Component));
exports.Select = Select;
var EnhancedSelect = (0, theme_1.themeable)((0, locale_1.localeable)((0, uncontrollable_1.uncontrollable)(Select, {
    value: 'onChange'
})));
exports.default = EnhancedSelect;
exports.SelectWithRemoteOptions = (0, WithRemoteConfig_1.withRemoteConfig)({
    adaptor: function (data) { return data.options || data.items || data.rows || data; },
    normalizeConfig: function (options, origin) {
        options = normalizeOptions(options);
        if (Array.isArray(options)) {
            return options.concat();
        }
        return origin;
    }
})(/** @class */ (function (_super) {
    (0, tslib_1.__extends)(class_1, _super);
    function class_1() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    class_1.prototype.render = function () {
        var _a = this.props, loading = _a.loading, config = _a.config, deferLoad = _a.deferLoad, updateConfig = _a.updateConfig, rest = (0, tslib_1.__rest)(_a, ["loading", "config", "deferLoad", "updateConfig"]);
        return (react_1.default.createElement(EnhancedSelect, (0, tslib_1.__assign)({}, rest, { options: config || rest.options || [], loading: loading })));
    };
    return class_1;
}(react_1.default.Component)));
//# sourceMappingURL=./components/Select.js.map
