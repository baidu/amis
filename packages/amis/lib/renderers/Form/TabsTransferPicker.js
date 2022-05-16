"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TabsTransferPickerRenderer = void 0;
var tslib_1 = require("tslib");
var Options_1 = require("./Options");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var Spinner_1 = (0, tslib_1.__importDefault)(require("../../components/Spinner"));
var TabsTransfer_1 = require("./TabsTransfer");
var TabsTransferPicker_1 = (0, tslib_1.__importDefault)(require("../../components/TabsTransferPicker"));
var helper_1 = require("../../utils/helper");
var Selection_1 = require("../../components/Selection");
var TabsTransferPickerRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(TabsTransferPickerRenderer, _super);
    function TabsTransferPickerRenderer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            activeKey: 0
        };
        return _this;
    }
    TabsTransferPickerRenderer.prototype.dispatchEvent = function (name) {
        var _a = this.props, dispatchEvent = _a.dispatchEvent, data = _a.data;
        dispatchEvent(name, data);
    };
    TabsTransferPickerRenderer.prototype.optionItemRender = function (option, states) {
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
    TabsTransferPickerRenderer.prototype.doAction = function (action) {
        var _a = this.props, resetValue = _a.resetValue, onChange = _a.onChange;
        switch (action.actionType) {
            case 'clear':
                onChange === null || onChange === void 0 ? void 0 : onChange('');
                break;
            case 'reset':
                onChange === null || onChange === void 0 ? void 0 : onChange(resetValue !== null && resetValue !== void 0 ? resetValue : '');
                break;
        }
    };
    TabsTransferPickerRenderer.prototype.render = function () {
        var _this = this;
        var _a = this.props, className = _a.className, cx = _a.classnames, options = _a.options, selectedOptions = _a.selectedOptions, sortable = _a.sortable, loading = _a.loading, searchResultMode = _a.searchResultMode, showArrow = _a.showArrow, deferLoad = _a.deferLoad, disabled = _a.disabled, selectTitle = _a.selectTitle, resultTitle = _a.resultTitle, pickerSize = _a.pickerSize, leftMode = _a.leftMode, leftOptions = _a.leftOptions;
        return (react_1.default.createElement("div", { className: cx('TabsTransferControl', className) },
            react_1.default.createElement(TabsTransferPicker_1.default, { activeKey: this.state.activeKey, onTabChange: this.onTabChange, value: selectedOptions, disabled: disabled, options: options, onChange: this.handleChange, option2value: this.option2value, sortable: sortable, searchResultMode: searchResultMode, onSearch: this.handleTabSearch, showArrow: showArrow, onDeferLoad: deferLoad, selectTitle: selectTitle, resultTitle: resultTitle, size: pickerSize, leftMode: leftMode, leftOptions: leftOptions, optionItemRender: this.optionItemRender, resultItemRender: this.resultItemRender, onFocus: function () { return _this.dispatchEvent('focus'); }, onBlur: function () { return _this.dispatchEvent('blur'); } }),
            react_1.default.createElement(Spinner_1.default, { overlay: true, key: "info", show: loading })));
    };
    var _a;
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [String]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], TabsTransferPickerRenderer.prototype, "dispatchEvent", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object, typeof (_a = typeof Selection_1.ItemRenderStates !== "undefined" && Selection_1.ItemRenderStates) === "function" ? _a : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], TabsTransferPickerRenderer.prototype, "optionItemRender", null);
    TabsTransferPickerRenderer = (0, tslib_1.__decorate)([
        (0, Options_1.OptionsControl)({
            type: 'tabs-transfer-picker'
        })
    ], TabsTransferPickerRenderer);
    return TabsTransferPickerRenderer;
}(TabsTransfer_1.BaseTabsTransferRenderer));
exports.TabsTransferPickerRenderer = TabsTransferPickerRenderer;
//# sourceMappingURL=./renderers/Form/TabsTransferPicker.js.map
