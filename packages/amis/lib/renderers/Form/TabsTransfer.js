"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TabsTransferRenderer = exports.BaseTabsTransferRenderer = void 0;
var tslib_1 = require("tslib");
var Options_1 = require("./Options");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var find_1 = (0, tslib_1.__importDefault)(require("lodash/find"));
var Spinner_1 = (0, tslib_1.__importDefault)(require("../../components/Spinner"));
var Transfer_1 = require("./Transfer");
var TabsTransfer_1 = (0, tslib_1.__importDefault)(require("../../components/TabsTransfer"));
var Select_1 = require("../../components/Select");
var helper_1 = require("../../utils/helper");
var Selection_1 = require("../../components/Selection");
var BaseTabsTransferRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(BaseTabsTransferRenderer, _super);
    function BaseTabsTransferRenderer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            activeKey: 0
        };
        return _this;
    }
    BaseTabsTransferRenderer.prototype.onTabChange = function (key) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var dispatchEvent, rendererEvent;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dispatchEvent = this.props.dispatchEvent;
                        return [4 /*yield*/, dispatchEvent('tab-change', { key: key })];
                    case 1:
                        rendererEvent = _a.sent();
                        if (rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented) {
                            return [2 /*return*/];
                        }
                        this.setState({
                            activeKey: key
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    BaseTabsTransferRenderer.prototype.handleTabSearch = function (term, option, cancelExecutor) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var _a, options, labelField, valueField, env, data, __, searchApi, payload, result, e_1, regexp_1;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, options = _a.options, labelField = _a.labelField, valueField = _a.valueField, env = _a.env, data = _a.data, __ = _a.translate;
                        searchApi = option.searchApi;
                        if (!searchApi) return [3 /*break*/, 5];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, env.fetcher(searchApi, (0, helper_1.createObject)(data, { term: term }), {
                                cancelExecutor: cancelExecutor
                            })];
                    case 2:
                        payload = _b.sent();
                        if (!payload.ok) {
                            throw new Error(__(payload.msg || 'networkError'));
                        }
                        result = payload.data.options || payload.data.items || payload.data;
                        if (!Array.isArray(result)) {
                            throw new Error(__('CRUD.invalidArray'));
                        }
                        return [2 /*return*/, result.map(function (item) {
                                var resolved = null;
                                var value = item[valueField || 'value'];
                                // 只有 value 值有意义的时候，再去找；否则直接返回
                                if (Array.isArray(options) && value !== null && value !== undefined) {
                                    resolved = (0, find_1.default)(options, (0, Select_1.optionValueCompare)(value, valueField));
                                }
                                return resolved || item;
                            })];
                    case 3:
                        e_1 = _b.sent();
                        if (!env.isCancel(e_1)) {
                            env.notify('error', e_1.message);
                        }
                        return [2 /*return*/, []];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        if (term) {
                            regexp_1 = (0, helper_1.string2regExp)(term);
                            return [2 /*return*/, (0, helper_1.filterTree)(options, function (option) {
                                    return !!((Array.isArray(option.children) && option.children.length) ||
                                        (option[valueField || 'value'] &&
                                            (regexp_1.test(option[labelField || 'label']) ||
                                                regexp_1.test(option[valueField || 'value']))));
                                }, 0, true)];
                        }
                        else {
                            return [2 /*return*/, options];
                        }
                        _b.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    BaseTabsTransferRenderer.prototype.handleChange = function (value, optionModified) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var _a, onChange, joinValues, delimiter, valueField, extractValue, options, dispatchEvent, setOptions, __, newValue, newOptions, UN_MATCH_RESULT, rendererEvent;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, onChange = _a.onChange, joinValues = _a.joinValues, delimiter = _a.delimiter, valueField = _a.valueField, extractValue = _a.extractValue, options = _a.options, dispatchEvent = _a.dispatchEvent, setOptions = _a.setOptions, __ = _a.translate;
                        newValue = value;
                        newOptions = options.concat();
                        UN_MATCH_RESULT = 'UN_MATCH_RESULT';
                        if (Array.isArray(value)) {
                            newValue = value.map(function (item) {
                                var indexes = (0, helper_1.findTreeIndex)(options, (0, Select_1.optionValueCompare)(item[valueField || 'value'], valueField || 'value'));
                                // 这里主要是把查询出来的没有匹配的搜索的结果（一般是DEFFER时）聚合在一个分类下
                                if (!indexes) {
                                    var searchIndexes = (0, helper_1.findTreeIndex)(newOptions, function (item) { return item.value === UN_MATCH_RESULT; });
                                    if (!searchIndexes) {
                                        newOptions.push({
                                            label: __('searchResult'),
                                            value: UN_MATCH_RESULT,
                                            visible: false,
                                            children: [item]
                                        });
                                    }
                                    else {
                                        var origin = (0, helper_1.getTree)(newOptions, searchIndexes);
                                        if (origin === null || origin === void 0 ? void 0 : origin.children) {
                                            origin.children.push(item);
                                            newOptions = (0, helper_1.spliceTree)(newOptions, searchIndexes, 1, (0, tslib_1.__assign)((0, tslib_1.__assign)({}, origin), item));
                                        }
                                    }
                                }
                                else if (optionModified) {
                                    var origin = (0, helper_1.getTree)(newOptions, indexes);
                                    newOptions = (0, helper_1.spliceTree)(newOptions, indexes, 1, (0, tslib_1.__assign)((0, tslib_1.__assign)({}, origin), item));
                                }
                                return joinValues || extractValue
                                    ? item[valueField || 'value']
                                    : item;
                            });
                            if (joinValues) {
                                newValue = newValue.join(delimiter || ',');
                            }
                        }
                        else if (value) {
                            newValue =
                                joinValues || extractValue
                                    ? value[valueField || 'value']
                                    : value;
                        }
                        (newOptions.length > options.length || optionModified) &&
                            setOptions(newOptions, true);
                        return [4 /*yield*/, dispatchEvent('change', {
                                value: newValue,
                                options: options
                            })];
                    case 1:
                        rendererEvent = _b.sent();
                        if (rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented) {
                            return [2 /*return*/];
                        }
                        onChange(newValue);
                        return [2 /*return*/];
                }
            });
        });
    };
    var _a, _b, _c, _d;
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Number]),
        (0, tslib_1.__metadata)("design:returntype", Promise)
    ], BaseTabsTransferRenderer.prototype, "onTabChange", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [String, typeof (_a = typeof Select_1.Option !== "undefined" && Select_1.Option) === "function" ? _a : Object, typeof (_b = typeof Function !== "undefined" && Function) === "function" ? _b : Object]),
        (0, tslib_1.__metadata)("design:returntype", Promise)
    ], BaseTabsTransferRenderer.prototype, "handleTabSearch", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object, Boolean]),
        (0, tslib_1.__metadata)("design:returntype", Promise)
    ], BaseTabsTransferRenderer.prototype, "handleChange", null);
    return BaseTabsTransferRenderer;
}(Transfer_1.BaseTransferRenderer));
exports.BaseTabsTransferRenderer = BaseTabsTransferRenderer;
var TabsTransferRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(TabsTransferRenderer, _super);
    function TabsTransferRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TabsTransferRenderer.prototype.optionItemRender = function (option, states) {
        var _a = this.props, menuTpl = _a.menuTpl, render = _a.render, data = _a.data;
        var ctx = arguments[2] || {};
        if (menuTpl) {
            return render("item/".concat(states.index), menuTpl, {
                data: (0, helper_1.createObject)((0, helper_1.createObject)(data, (0, tslib_1.__assign)((0, tslib_1.__assign)({}, states), ctx)), option)
            });
        }
        return Selection_1.BaseSelection.itemRender(option, states);
    };
    // 动作
    TabsTransferRenderer.prototype.doAction = function (action, args) {
        var _a = this.props, resetValue = _a.resetValue, onChange = _a.onChange;
        var activeKey = args === null || args === void 0 ? void 0 : args.activeKey;
        switch (action.actionType) {
            case 'clear':
                onChange === null || onChange === void 0 ? void 0 : onChange('');
                break;
            case 'reset':
                onChange === null || onChange === void 0 ? void 0 : onChange(resetValue !== null && resetValue !== void 0 ? resetValue : '');
                break;
            case 'changeTabKey':
                this.setState({
                    activeKey: activeKey
                });
                break;
        }
    };
    TabsTransferRenderer.prototype.render = function () {
        var _a = this.props, className = _a.className, cx = _a.classnames, options = _a.options, selectedOptions = _a.selectedOptions, sortable = _a.sortable, loading = _a.loading, searchResultMode = _a.searchResultMode, showArrow = _a.showArrow, deferLoad = _a.deferLoad, leftDeferLoad = _a.leftDeferLoad, disabled = _a.disabled, selectTitle = _a.selectTitle, resultTitle = _a.resultTitle;
        return (react_1.default.createElement("div", { className: cx('TabsTransferControl', className) },
            react_1.default.createElement(TabsTransfer_1.default, { activeKey: this.state.activeKey, value: selectedOptions, disabled: disabled, options: options, onChange: this.handleChange, option2value: this.option2value, sortable: sortable, searchResultMode: searchResultMode, onSearch: this.handleTabSearch, showArrow: showArrow, onDeferLoad: deferLoad, onLeftDeferLoad: leftDeferLoad, selectTitle: selectTitle, resultTitle: resultTitle, optionItemRender: this.optionItemRender, resultItemRender: this.resultItemRender, onTabChange: this.onTabChange }),
            react_1.default.createElement(Spinner_1.default, { overlay: true, key: "info", show: loading })));
    };
    var _e;
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object, typeof (_e = typeof Selection_1.ItemRenderStates !== "undefined" && Selection_1.ItemRenderStates) === "function" ? _e : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], TabsTransferRenderer.prototype, "optionItemRender", null);
    TabsTransferRenderer = (0, tslib_1.__decorate)([
        (0, Options_1.OptionsControl)({
            type: 'tabs-transfer'
        })
    ], TabsTransferRenderer);
    return TabsTransferRenderer;
}(BaseTabsTransferRenderer));
exports.TabsTransferRenderer = TabsTransferRenderer;
//# sourceMappingURL=./renderers/Form/TabsTransfer.js.map
