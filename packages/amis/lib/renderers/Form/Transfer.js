"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferRender = exports.BaseTransferRenderer = void 0;
var tslib_1 = require("tslib");
var Options_1 = require("./Options");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var Transfer_1 = tslib_1.__importStar(require("../../components/Transfer"));
var helper_1 = require("../../utils/helper");
var Spinner_1 = (0, tslib_1.__importDefault)(require("../../components/Spinner"));
var find_1 = (0, tslib_1.__importDefault)(require("lodash/find"));
var Select_1 = require("../../components/Select");
var tpl_builtin_1 = require("../../utils/tpl-builtin");
var Selection_1 = require("../../components/Selection");
var ResultList_1 = require("../../components/ResultList");
var BaseTransferRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(BaseTransferRenderer, _super);
    function BaseTransferRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseTransferRenderer.prototype.handleChange = function (value, optionModified) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var _a, onChange, joinValues, delimiter, valueField, extractValue, options, dispatchEvent, setOptions, newValue, newOptions, rendererEvent;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, onChange = _a.onChange, joinValues = _a.joinValues, delimiter = _a.delimiter, valueField = _a.valueField, extractValue = _a.extractValue, options = _a.options, dispatchEvent = _a.dispatchEvent, setOptions = _a.setOptions;
                        newValue = value;
                        newOptions = options.concat();
                        if (Array.isArray(value)) {
                            newValue = value.map(function (item) {
                                var indexes = (0, helper_1.findTreeIndex)(options, (0, Select_1.optionValueCompare)(item[valueField || 'value'], valueField || 'value'));
                                if (!indexes) {
                                    newOptions.push(item);
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
    BaseTransferRenderer.prototype.option2value = function (option) {
        return option;
    };
    BaseTransferRenderer.prototype.handleSearch = function (term, cancelExecutor) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var _a, searchApi, options, labelField, valueField, env, data, __, payload, result, e_1, regexp_1;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, searchApi = _a.searchApi, options = _a.options, labelField = _a.labelField, valueField = _a.valueField, env = _a.env, data = _a.data, __ = _a.translate;
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
                            throw new Error('CRUD.invalidArray');
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
    BaseTransferRenderer.prototype.optionItemRender = function (option, states) {
        var _a = this.props, menuTpl = _a.menuTpl, render = _a.render, data = _a.data;
        if (menuTpl) {
            return render("item/".concat(states.index), menuTpl, {
                data: (0, helper_1.createObject)((0, helper_1.createObject)(data, states), option)
            });
        }
        return Selection_1.BaseSelection.itemRender(option, states);
    };
    BaseTransferRenderer.prototype.resultItemRender = function (option, states) {
        var _a = this.props, valueTpl = _a.valueTpl, render = _a.render, data = _a.data;
        if (valueTpl) {
            return render("value/".concat(states.index), valueTpl, {
                onChange: states.onChange,
                data: (0, helper_1.createObject)((0, helper_1.createObject)(data, states), option)
            });
        }
        return ResultList_1.ResultList.itemRender(option);
    };
    BaseTransferRenderer.prototype.renderCell = function (column, option, colIndex, rowIndex) {
        var _a = this.props, render = _a.render, data = _a.data;
        return render("cell/".concat(colIndex, "/").concat(rowIndex), (0, tslib_1.__assign)({ type: 'text' }, column), {
            value: (0, tpl_builtin_1.resolveVariable)(column.name, option),
            data: (0, helper_1.createObject)(data, option)
        });
    };
    BaseTransferRenderer.prototype.getRef = function (ref) {
        this.tranferRef = ref;
    };
    BaseTransferRenderer.prototype.onSelectAll = function (options) {
        var dispatchEvent = this.props.dispatchEvent;
        dispatchEvent('selectAll', options);
    };
    // 动作
    BaseTransferRenderer.prototype.doAction = function (action, data, throwErrors) {
        var _a;
        var _b = this.props, resetValue = _b.resetValue, onChange = _b.onChange;
        switch (action.actionType) {
            case 'clear':
                onChange === null || onChange === void 0 ? void 0 : onChange('');
                break;
            case 'reset':
                onChange === null || onChange === void 0 ? void 0 : onChange(resetValue !== null && resetValue !== void 0 ? resetValue : '');
                break;
            case 'selectAll':
                (_a = this.tranferRef) === null || _a === void 0 ? void 0 : _a.selectAll();
                break;
        }
    };
    BaseTransferRenderer.prototype.render = function () {
        var _a;
        var _b = this.props, className = _b.className, cx = _b.classnames, selectedOptions = _b.selectedOptions, showArrow = _b.showArrow, sortable = _b.sortable, selectMode = _b.selectMode, columns = _b.columns, loading = _b.loading, searchable = _b.searchable, searchResultMode = _b.searchResultMode, searchResultColumns = _b.searchResultColumns, deferLoad = _b.deferLoad, leftMode = _b.leftMode, rightMode = _b.rightMode, disabled = _b.disabled, selectTitle = _b.selectTitle, resultTitle = _b.resultTitle, menuTpl = _b.menuTpl, resultItemRender = _b.resultItemRender;
        // 目前 LeftOptions 没有接口可以动态加载
        // 为了方便可以快速实现动态化，让选项的第一个成员携带
        // LeftOptions 信息
        var _c = this.props, options = _c.options, leftOptions = _c.leftOptions, leftDefaultValue = _c.leftDefaultValue;
        if (selectMode === 'associated' &&
            options &&
            options.length &&
            options[0].leftOptions &&
            Array.isArray(options[0].children)) {
            leftOptions = options[0].leftOptions;
            leftDefaultValue = (_a = options[0].leftDefaultValue) !== null && _a !== void 0 ? _a : leftDefaultValue;
            options = options[0].children;
        }
        return (react_1.default.createElement("div", { className: cx('TransferControl', className) },
            react_1.default.createElement(Transfer_1.default, { value: selectedOptions, options: options, disabled: disabled, onChange: this.handleChange, option2value: this.option2value, sortable: sortable, showArrow: showArrow, selectMode: selectMode, searchResultMode: searchResultMode, searchResultColumns: searchResultColumns, columns: columns, onSearch: searchable ? this.handleSearch : undefined, onDeferLoad: deferLoad, leftOptions: leftOptions, leftMode: leftMode, rightMode: rightMode, cellRender: this.renderCell, selectTitle: selectTitle, resultTitle: resultTitle, optionItemRender: this.optionItemRender, resultItemRender: this.resultItemRender, onSelectAll: this.onSelectAll, onRef: this.getRef }),
            react_1.default.createElement(Spinner_1.default, { overlay: true, key: "info", show: loading })));
    };
    var _a, _b, _c, _d, _e;
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object, Boolean]),
        (0, tslib_1.__metadata)("design:returntype", Promise)
    ], BaseTransferRenderer.prototype, "handleChange", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], BaseTransferRenderer.prototype, "option2value", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [String, typeof (_b = typeof Function !== "undefined" && Function) === "function" ? _b : Object]),
        (0, tslib_1.__metadata)("design:returntype", Promise)
    ], BaseTransferRenderer.prototype, "handleSearch", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object, typeof (_c = typeof Selection_1.ItemRenderStates !== "undefined" && Selection_1.ItemRenderStates) === "function" ? _c : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], BaseTransferRenderer.prototype, "optionItemRender", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object, typeof (_d = typeof ResultList_1.ItemRenderStates !== "undefined" && ResultList_1.ItemRenderStates) === "function" ? _d : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], BaseTransferRenderer.prototype, "resultItemRender", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object, Object, Number, Number]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], BaseTransferRenderer.prototype, "renderCell", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_e = typeof Transfer_1.Transfer !== "undefined" && Transfer_1.Transfer) === "function" ? _e : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], BaseTransferRenderer.prototype, "getRef", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Array]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], BaseTransferRenderer.prototype, "onSelectAll", null);
    return BaseTransferRenderer;
}(react_1.default.Component));
exports.BaseTransferRenderer = BaseTransferRenderer;
// ts 3.9 里面非得这样才不报错，鬼知道为何。
var TransferRender = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(TransferRender, _super);
    function TransferRender() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TransferRender;
}(BaseTransferRenderer));
exports.TransferRender = TransferRender;
exports.default = (0, Options_1.OptionsControl)({
    type: 'transfer'
})(TransferRender);
//# sourceMappingURL=./renderers/Form/Transfer.js.map
