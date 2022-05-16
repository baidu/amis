"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TabsTransfer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var helper_1 = require("../utils/helper");
var Tabs_1 = tslib_1.__importStar(require("./Tabs"));
var InputBox_1 = (0, tslib_1.__importDefault)(require("./InputBox"));
var TableSelection_1 = (0, tslib_1.__importDefault)(require("./TableSelection"));
var TreeSelection_1 = (0, tslib_1.__importDefault)(require("./TreeSelection"));
var ChainedSelection_1 = (0, tslib_1.__importDefault)(require("./ChainedSelection"));
var GroupedSelection_1 = (0, tslib_1.__importDefault)(require("./GroupedSelection"));
var Select_1 = require("./Select");
var Transfer_1 = (0, tslib_1.__importDefault)(require("./Transfer"));
var theme_1 = require("../theme");
var AssociatedSelection_1 = (0, tslib_1.__importDefault)(require("./AssociatedSelection"));
var locale_1 = require("../locale");
var icons_1 = require("./icons");
var debounce_1 = (0, tslib_1.__importDefault)(require("lodash/debounce"));
var TabsTransfer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(TabsTransfer, _super);
    function TabsTransfer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            inputValue: '',
            searchResult: null
        };
        _this.unmounted = false;
        _this.lazySearch = (0, debounce_1.default)(function (text, option) {
            (function (text) { return (0, tslib_1.__awaiter)(_this, void 0, void 0, function () {
                var onSearch, result;
                var _this = this;
                return (0, tslib_1.__generator)(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            onSearch = this.props.onSearch;
                            return [4 /*yield*/, onSearch(text, option, function (cancelExecutor) { return (_this.cancelSearch = cancelExecutor); })];
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
    TabsTransfer.prototype.componentWillUnmount = function () {
        this.lazySearch.cancel();
        this.unmounted = true;
    };
    TabsTransfer.prototype.handleSearch = function (text, option) {
        var _this = this;
        // text 有值的时候，走搜索否则直接走 handleSeachCancel ，等同于右侧的 clear 按钮
        if (text) {
            this.setState({
                inputValue: text
            }, function () {
                // 如果有取消搜索，先取消掉。
                _this.cancelSearch && _this.cancelSearch();
                _this.lazySearch(text, option);
            });
        }
        else {
            this.handleSeachCancel();
        }
    };
    TabsTransfer.prototype.handleSeachCancel = function () {
        this.setState({
            inputValue: '',
            searchResult: null
        });
    };
    TabsTransfer.prototype.handleSearchKeyDown = function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    };
    TabsTransfer.prototype.handleTabChange = function (key) {
        var _a, _b;
        (_b = (_a = this.props) === null || _a === void 0 ? void 0 : _a.onTabChange) === null || _b === void 0 ? void 0 : _b.call(_a, key);
        this.handleSeachCancel();
    };
    TabsTransfer.prototype.renderSearchResult = function (searchResult) {
        var _a = this.props, searchResultMode = _a.searchResultMode, noResultsText = _a.noResultsText, searchResultColumns = _a.searchResultColumns, cx = _a.classnames, value = _a.value, disabled = _a.disabled, onChange = _a.onChange, option2value = _a.option2value, cellRender = _a.cellRender, optionItemRender = _a.optionItemRender;
        var options = searchResult || [];
        var mode = searchResultMode;
        return mode === 'table' ? (react_1.default.createElement(TableSelection_1.default, { placeholder: noResultsText, className: cx('Transfer-checkboxes'), columns: searchResultColumns, options: options, value: value, disabled: disabled, onChange: onChange, option2value: option2value, cellRender: cellRender })) : mode === 'tree' ? (react_1.default.createElement(TreeSelection_1.default, { placeholder: noResultsText, className: cx('Transfer-checkboxes'), options: options, value: value, disabled: disabled, onChange: onChange, option2value: option2value, itemRender: optionItemRender
                ? function (item, states) {
                    return optionItemRender(item, states, {
                        panel: 'result'
                    });
                }
                : undefined })) : mode === 'chained' ? (react_1.default.createElement(ChainedSelection_1.default, { placeholder: noResultsText, className: cx('Transfer-checkboxes'), options: options, value: value, disabled: disabled, onChange: onChange, option2value: option2value, itemRender: optionItemRender
                ? function (item, states) {
                    return optionItemRender(item, states, {
                        panel: 'result'
                    });
                }
                : undefined })) : (react_1.default.createElement(GroupedSelection_1.default, { placeholder: noResultsText, className: cx('Transfer-checkboxes'), options: options, value: value, disabled: disabled, onChange: onChange, option2value: option2value, itemRender: optionItemRender
                ? function (item, states) {
                    return optionItemRender(item, states, {
                        panel: 'result'
                    });
                }
                : undefined }));
    };
    TabsTransfer.prototype.renderSelect = function () {
        var _this = this;
        var _a = this.props, options = _a.options, placeholder = _a.placeholder, activeKey = _a.activeKey, cx = _a.classnames, __ = _a.translate;
        var showOptions = options.filter(function (item) { return item.visible !== false; });
        if (!Array.isArray(options) || !options.length) {
            return (react_1.default.createElement("div", { className: cx('TabsTransfer-placeholder') }, __(placeholder || 'placeholder.noOption')));
        }
        return (react_1.default.createElement(Tabs_1.default, { mode: "line", className: cx('TabsTransfer-tabs'), onSelect: this.handleTabChange, activeKey: activeKey }, showOptions.map(function (option, index) { return (react_1.default.createElement(Tabs_1.Tab, { eventKey: index, key: index, title: option.label || option.title, className: "TabsTransfer-tab" },
            option.searchable ? (react_1.default.createElement("div", { className: cx('TabsTransfer-search') },
                react_1.default.createElement(InputBox_1.default, { value: _this.state.inputValue, onChange: function (text) { return _this.handleSearch(text, option); }, placeholder: __('Transfer.searchKeyword'), clearable: false, onKeyDown: _this.handleSearchKeyDown }, _this.state.searchResult !== null ? (react_1.default.createElement("a", { onClick: _this.handleSeachCancel },
                    react_1.default.createElement(icons_1.Icon, { icon: "close", className: "icon" }))) : (react_1.default.createElement(icons_1.Icon, { icon: "search", className: "icon" }))))) : null,
            _this.state.searchResult !== null
                ? _this.renderSearchResult(_this.state.searchResult)
                : _this.renderOptions(option))); })));
    };
    TabsTransfer.prototype.renderOptions = function (option) {
        var _a = this.props, cx = _a.classnames, value = _a.value, disabled = _a.disabled, onChange = _a.onChange, option2value = _a.option2value, onDeferLoad = _a.onDeferLoad, onLeftDeferLoad = _a.onLeftDeferLoad, cellRender = _a.cellRender, __ = _a.translate, optionItemRender = _a.optionItemRender;
        return option.selectMode === 'table' ? (react_1.default.createElement(TableSelection_1.default, { className: cx('Transfer-checkboxes'), columns: option.columns, options: option.children || [], value: value, disabled: disabled, onChange: onChange, option2value: option2value, onDeferLoad: onDeferLoad, cellRender: cellRender })) : option.selectMode === 'tree' ? (react_1.default.createElement(TreeSelection_1.default, { className: cx('Transfer-checkboxes'), options: option.children || [], value: value, disabled: disabled, onChange: onChange, option2value: option2value, onDeferLoad: onDeferLoad, itemRender: optionItemRender
                ? function (item, states) {
                    return optionItemRender(item, states, {
                        panel: 'tab',
                        tag: option
                    });
                }
                : undefined })) : option.selectMode === 'chained' ? (react_1.default.createElement(ChainedSelection_1.default, { className: cx('Transfer-checkboxes'), options: option.children || [], value: value, disabled: disabled, onChange: onChange, option2value: option2value, onDeferLoad: onDeferLoad, defaultSelectedIndex: option.defaultSelectedIndex, itemRender: optionItemRender
                ? function (item, states) {
                    return optionItemRender(item, states, {
                        panel: 'tab',
                        tag: option
                    });
                }
                : undefined })) : option.selectMode === 'associated' ? (react_1.default.createElement(AssociatedSelection_1.default, { className: cx('Transfer-checkboxes'), options: option.children || [], value: value, disabled: disabled, onChange: onChange, option2value: option2value, onDeferLoad: onDeferLoad, onLeftDeferLoad: onLeftDeferLoad, leftMode: option.leftMode, leftOptions: option.leftOptions, leftDefaultValue: option.leftDefaultValue, itemRender: optionItemRender
                ? function (item, states) {
                    return optionItemRender(item, states, {
                        panel: 'tab',
                        tag: option
                    });
                }
                : undefined })) : (react_1.default.createElement(GroupedSelection_1.default, { className: cx('Transfer-checkboxes'), options: option.children || [], value: value, disabled: disabled, onChange: onChange, option2value: option2value, onDeferLoad: onDeferLoad, itemRender: optionItemRender
                ? function (item, states) {
                    return optionItemRender(item, states, {
                        panel: 'tab',
                        tag: option
                    });
                }
                : undefined }));
    };
    TabsTransfer.prototype.render = function () {
        var _a = this.props, className = _a.className, cx = _a.classnames, optionItemRender = _a.optionItemRender, onSearch = _a.onSearch, reset = (0, tslib_1.__rest)(_a, ["className", "classnames", "optionItemRender", "onSearch"]);
        return (react_1.default.createElement(Transfer_1.default, (0, tslib_1.__assign)({}, reset, { statistics: false, classnames: cx, className: cx('TabsTransfer', className), selectRender: this.renderSelect })));
    };
    var _a, _b, _c;
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [String, typeof (_a = typeof Select_1.Option !== "undefined" && Select_1.Option) === "function" ? _a : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], TabsTransfer.prototype, "handleSearch", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], TabsTransfer.prototype, "handleSeachCancel", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_b = typeof react_1.default !== "undefined" && react_1.default.KeyboardEvent) === "function" ? _b : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], TabsTransfer.prototype, "handleSearchKeyDown", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Number]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], TabsTransfer.prototype, "handleTabChange", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], TabsTransfer.prototype, "renderSelect", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_c = typeof Select_1.Option !== "undefined" && Select_1.Option) === "function" ? _c : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], TabsTransfer.prototype, "renderOptions", null);
    return TabsTransfer;
}(react_1.default.Component));
exports.TabsTransfer = TabsTransfer;
exports.default = (0, theme_1.themeable)((0, locale_1.localeable)(TabsTransfer));
//# sourceMappingURL=./components/TabsTransfer.js.map
