"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transfer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var theme_1 = require("../theme");
var Selection_1 = require("./Selection");
var uncontrollable_1 = require("uncontrollable");
var ResultList_1 = (0, tslib_1.__importDefault)(require("./ResultList"));
var TableSelection_1 = (0, tslib_1.__importDefault)(require("./TableSelection"));
var TreeSelection_1 = (0, tslib_1.__importDefault)(require("./TreeSelection"));
var helper_1 = require("../utils/helper");
var InputBox_1 = (0, tslib_1.__importDefault)(require("./InputBox"));
var icons_1 = require("./icons");
var debounce_1 = (0, tslib_1.__importDefault)(require("lodash/debounce"));
var AssociatedSelection_1 = (0, tslib_1.__importDefault)(require("./AssociatedSelection"));
var locale_1 = require("../locale");
var GroupedSelection_1 = (0, tslib_1.__importDefault)(require("./GroupedSelection"));
var ChainedSelection_1 = (0, tslib_1.__importDefault)(require("./ChainedSelection"));
var Transfer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Transfer, _super);
    function Transfer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            inputValue: '',
            searchResult: null
        };
        _this.unmounted = false;
        _this.lazySearch = (0, debounce_1.default)(function (text) {
            (function (text) { return (0, tslib_1.__awaiter)(_this, void 0, void 0, function () {
                var onSearch, result;
                var _this = this;
                return (0, tslib_1.__generator)(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            onSearch = this.props.onSearch;
                            return [4 /*yield*/, onSearch(text, function (cancelExecutor) { return (_this.cancelSearch = cancelExecutor); })];
                        case 1:
                            result = _a.sent();
                            if (this.unmounted) {
                                return [2 /*return*/];
                            }
                            if (!Array.isArray(result)) {
                                throw new Error('onSearch 需要返回数组');
                            }
                            this.setState({
                                searchResult: result
                            });
                            return [2 /*return*/];
                    }
                });
            }); })(text).catch(function (e) { return console.error(e); });
        }, 250, {
            trailing: true,
            leading: false
        });
        return _this;
    }
    Transfer.prototype.componentDidMount = function () {
        var _a, _b;
        (_b = (_a = this.props) === null || _a === void 0 ? void 0 : _a.onRef) === null || _b === void 0 ? void 0 : _b.call(_a, this);
    };
    Transfer.prototype.componentWillUnmount = function () {
        this.lazySearch.cancel();
        this.unmounted = true;
    };
    Transfer.prototype.toggleAll = function () {
        var _a = this.props, options = _a.options, option2value = _a.option2value, onChange = _a.onChange, value = _a.value, onSelectAll = _a.onSelectAll;
        var valueArray = Selection_1.BaseSelection.value2array(value, options, option2value);
        var availableOptions = (0, helper_1.flattenTree)(options).filter(function (option, index, list) {
            return !option.disabled &&
                option.value !== void 0 &&
                list.indexOf(option) === index;
        });
        if (valueArray.length < availableOptions.length) {
            valueArray = availableOptions;
        }
        else {
            valueArray = [];
        }
        var newValue = option2value
            ? valueArray.map(function (item) { return option2value(item); })
            : valueArray;
        // > 0 全选。TODO：由于未来可能有逻辑：禁用清空不了，这里判断全选，得完善下
        newValue.length > 0 && (onSelectAll === null || onSelectAll === void 0 ? void 0 : onSelectAll(newValue));
        onChange === null || onChange === void 0 ? void 0 : onChange(newValue);
    };
    // 全选，给予动作全选使用
    Transfer.prototype.selectAll = function () {
        var _a = this.props, options = _a.options, option2value = _a.option2value, onChange = _a.onChange;
        ;
        var availableOptions = (0, helper_1.flattenTree)(options).filter(function (option, index, list) {
            return !option.disabled &&
                option.value !== void 0 &&
                list.indexOf(option) === index;
        });
        var newValue = option2value
            ? availableOptions.map(function (item) { return option2value(item); })
            : availableOptions;
        onChange === null || onChange === void 0 ? void 0 : onChange(newValue);
    };
    Transfer.prototype.clearAll = function () {
        var onChange = this.props.onChange;
        onChange && onChange([]);
    };
    Transfer.prototype.handleSearchKeyDown = function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    };
    Transfer.prototype.handleSearch = function (text) {
        var _this = this;
        // text 有值的时候，走搜索否则直接走 handleSeachCancel ，等同于右侧的 clear 按钮
        if (text) {
            this.setState({
                inputValue: text
            }, function () {
                // 如果有取消搜索，先取消掉。
                _this.cancelSearch && _this.cancelSearch();
                _this.lazySearch(text);
            });
        }
        else {
            this.handleSeachCancel();
        }
    };
    Transfer.prototype.handleSeachCancel = function () {
        this.setState({
            inputValue: '',
            searchResult: null
        });
    };
    Transfer.prototype.renderSelect = function (props) {
        var selectRender = props.selectRender, selectMode = props.selectMode, cx = props.classnames, selectTitle = props.selectTitle, onSearch = props.onSearch, disabled = props.disabled, options = props.options, statistics = props.statistics, __ = props.translate;
        if (selectRender) {
            return selectRender((0, tslib_1.__assign)((0, tslib_1.__assign)({}, props), { onSearch: this.handleSearch, onSearchCancel: this.handleSeachCancel, searchResult: this.state.searchResult }));
        }
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement("div", { className: cx('Transfer-title', selectMode === 'table' ? 'Transfer-title--light' : '') },
                react_1.default.createElement("span", null,
                    __(selectTitle || 'Transfer.available'),
                    statistics !== false ? (react_1.default.createElement("span", null,
                        "\uFF08",
                        this.valueArray.length,
                        "/",
                        this.availableOptions.length,
                        "\uFF09")) : null),
                selectMode !== 'table' ? (react_1.default.createElement("a", { onClick: props.onToggleAll || this.toggleAll, className: cx('Transfer-checkAll', disabled || !options.length ? 'is-disabled' : '') }, __('Select.checkAll'))) : null),
            onSearch ? (react_1.default.createElement("div", { className: cx('Transfer-search') },
                react_1.default.createElement(InputBox_1.default, { value: this.state.inputValue, onChange: this.handleSearch, placeholder: __('Transfer.searchKeyword'), clearable: false, onKeyDown: this.handleSearchKeyDown }, this.state.searchResult !== null ? (react_1.default.createElement("a", { onClick: this.handleSeachCancel },
                    react_1.default.createElement(icons_1.Icon, { icon: "close", className: "icon" }))) : (react_1.default.createElement(icons_1.Icon, { icon: "search", className: "icon" }))))) : null,
            this.state.searchResult !== null
                ? this.renderSearchResult(props)
                : this.renderOptions(props)));
    };
    Transfer.prototype.renderSearchResult = function (props) {
        var searchResultMode = props.searchResultMode, selectMode = props.selectMode, noResultsText = props.noResultsText, searchResultColumns = props.searchResultColumns, columns = props.columns, cx = props.classnames, value = props.value, disabled = props.disabled, onChange = props.onChange, option2value = props.option2value, optionItemRender = props.optionItemRender, cellRender = props.cellRender, multiple = props.multiple;
        var options = this.state.searchResult || [];
        var mode = searchResultMode || selectMode;
        var resultColumns = searchResultColumns || columns;
        return mode === 'table' ? (react_1.default.createElement(TableSelection_1.default, { placeholder: noResultsText, className: cx('Transfer-selection'), columns: resultColumns, options: options, value: value, disabled: disabled, onChange: onChange, option2value: option2value, cellRender: cellRender, itemRender: optionItemRender, multiple: multiple })) : mode === 'tree' ? (react_1.default.createElement(TreeSelection_1.default, { placeholder: noResultsText, className: cx('Transfer-selection'), options: options, value: value, disabled: disabled, onChange: onChange, option2value: option2value, itemRender: optionItemRender, multiple: multiple })) : mode === 'chained' ? (react_1.default.createElement(ChainedSelection_1.default, { placeholder: noResultsText, className: cx('Transfer-selection'), options: options, value: value, disabled: disabled, onChange: onChange, option2value: option2value, itemRender: optionItemRender, multiple: multiple })) : (react_1.default.createElement(GroupedSelection_1.default, { placeholder: noResultsText, className: cx('Transfer-selection'), options: options, value: value, disabled: disabled, onChange: onChange, option2value: option2value, itemRender: optionItemRender, multiple: multiple }));
    };
    Transfer.prototype.renderOptions = function (props) {
        var selectMode = props.selectMode, columns = props.columns, options = props.options, value = props.value, disabled = props.disabled, onChange = props.onChange, option2value = props.option2value, cx = props.classnames, onDeferLoad = props.onDeferLoad, leftOptions = props.leftOptions, leftMode = props.leftMode, rightMode = props.rightMode, cellRender = props.cellRender, leftDefaultValue = props.leftDefaultValue, optionItemRender = props.optionItemRender, multiple = props.multiple;
        return selectMode === 'table' ? (react_1.default.createElement(TableSelection_1.default, { className: cx('Transfer-selection'), columns: columns, options: options || [], value: value, disabled: disabled, onChange: onChange, option2value: option2value, onDeferLoad: onDeferLoad, cellRender: cellRender, multiple: multiple })) : selectMode === 'tree' ? (react_1.default.createElement(TreeSelection_1.default, { className: cx('Transfer-selection'), options: options || [], value: value, disabled: disabled, onChange: onChange, option2value: option2value, onDeferLoad: onDeferLoad, itemRender: optionItemRender, multiple: multiple })) : selectMode === 'chained' ? (react_1.default.createElement(ChainedSelection_1.default, { className: cx('Transfer-selection'), options: options || [], value: value, disabled: disabled, onChange: onChange, option2value: option2value, onDeferLoad: onDeferLoad, itemRender: optionItemRender, multiple: multiple })) : selectMode === 'associated' ? (react_1.default.createElement(AssociatedSelection_1.default, { className: cx('Transfer-selection'), options: options || [], value: value, disabled: disabled, onChange: onChange, option2value: option2value, onDeferLoad: onDeferLoad, columns: columns, leftOptions: leftOptions || [], leftMode: leftMode, rightMode: rightMode, leftDefaultValue: leftDefaultValue, itemRender: optionItemRender, multiple: multiple })) : (react_1.default.createElement(GroupedSelection_1.default, { className: cx('Transfer-selection'), options: options || [], value: value, disabled: disabled, onChange: onChange, option2value: option2value, onDeferLoad: onDeferLoad, itemRender: optionItemRender, multiple: multiple }));
    };
    Transfer.prototype.render = function () {
        var _a = this.props, inline = _a.inline, cx = _a.classnames, className = _a.className, value = _a.value, onChange = _a.onChange, resultTitle = _a.resultTitle, sortable = _a.sortable, options = _a.options, option2value = _a.option2value, disabled = _a.disabled, statistics = _a.statistics, showArrow = _a.showArrow, resultItemRender = _a.resultItemRender, __ = _a.translate;
        this.valueArray = Selection_1.BaseSelection.value2array(value, options, option2value);
        this.availableOptions = (0, helper_1.flattenTree)(options).filter(function (option, index, list) {
            return !option.disabled &&
                option.value !== void 0 &&
                list.indexOf(option) === index;
        });
        return (react_1.default.createElement("div", { className: cx('Transfer', className, inline ? 'Transfer--inline' : '') },
            react_1.default.createElement("div", { className: cx('Transfer-select') }, this.renderSelect(this.props)),
            react_1.default.createElement("div", { className: cx('Transfer-mid') }, showArrow /*todo 需要改成确认模式，即：点了按钮才到右边 */ ? (react_1.default.createElement("div", { className: cx('Transfer-arrow') },
                react_1.default.createElement(icons_1.Icon, { icon: "right-arrow", className: "icon" }))) : null),
            react_1.default.createElement("div", { className: cx('Transfer-result') },
                react_1.default.createElement("div", { className: cx('Transfer-title') },
                    react_1.default.createElement("span", null,
                        __(resultTitle || 'Transfer.selectd'),
                        statistics !== false ? (react_1.default.createElement("span", null,
                            "\uFF08",
                            this.valueArray.length,
                            "/",
                            this.availableOptions.length,
                            "\uFF09")) : null),
                    react_1.default.createElement("a", { onClick: this.clearAll, className: cx('Transfer-clearAll', disabled || !this.valueArray.length ? 'is-disabled' : '') }, __('clear'))),
                react_1.default.createElement(ResultList_1.default, { className: cx('Transfer-value'), sortable: sortable, disabled: disabled, value: value, onChange: onChange, placeholder: __('Transfer.selectFromLeft'), itemRender: resultItemRender }))));
    };
    var _a;
    Transfer.defaultProps = {
        multiple: true
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Transfer.prototype, "toggleAll", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Transfer.prototype, "clearAll", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof react_1.default !== "undefined" && react_1.default.KeyboardEvent) === "function" ? _a : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Transfer.prototype, "handleSearchKeyDown", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [String]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Transfer.prototype, "handleSearch", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Transfer.prototype, "handleSeachCancel", null);
    return Transfer;
}(react_1.default.Component));
exports.Transfer = Transfer;
exports.default = (0, theme_1.themeable)((0, locale_1.localeable)((0, uncontrollable_1.uncontrollable)(/** @class */ (function (_super) {
    (0, tslib_1.__extends)(class_1, _super);
    function class_1() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return class_1;
}(Transfer)), {
    value: 'onChange'
})));
//# sourceMappingURL=./components/Transfer.js.map
