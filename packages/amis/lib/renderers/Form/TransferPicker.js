"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferPickerRenderer = void 0;
var tslib_1 = require("tslib");
var Options_1 = require("./Options");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var Spinner_1 = (0, tslib_1.__importDefault)(require("../../components/Spinner"));
var Transfer_1 = require("./Transfer");
var TransferPicker_1 = (0, tslib_1.__importDefault)(require("../../components/TransferPicker"));
var helper_1 = require("../../utils/helper");
var TransferPickerRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(TransferPickerRenderer, _super);
    function TransferPickerRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TransferPickerRenderer.prototype.dispatchEvent = function (name) {
        var _a = this.props, dispatchEvent = _a.dispatchEvent, data = _a.data;
        dispatchEvent(name, data);
    };
    // 动作
    TransferPickerRenderer.prototype.doAction = function (action) {
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
    TransferPickerRenderer.prototype.render = function () {
        var _this = this;
        var _a;
        var _b = this.props, className = _b.className, cx = _b.classnames, selectedOptions = _b.selectedOptions, sortable = _b.sortable, loading = _b.loading, searchable = _b.searchable, searchResultMode = _b.searchResultMode, showArrow = _b.showArrow, deferLoad = _b.deferLoad, disabled = _b.disabled, selectTitle = _b.selectTitle, resultTitle = _b.resultTitle, pickerSize = _b.pickerSize, columns = _b.columns, leftMode = _b.leftMode, selectMode = _b.selectMode, borderMode = _b.borderMode;
        // 目前 LeftOptions 没有接口可以动态加载
        // 为了方便可以快速实现动态化，让选项的第一个成员携带
        // LeftOptions 信息
        var _c = this.props, options = _c.options, leftOptions = _c.leftOptions, leftDefaultValue = _c.leftDefaultValue;
        if (selectMode === 'associated' &&
            options &&
            options.length === 1 &&
            options[0].leftOptions &&
            Array.isArray(options[0].children)) {
            leftOptions = options[0].leftOptions;
            leftDefaultValue = (_a = options[0].leftDefaultValue) !== null && _a !== void 0 ? _a : leftDefaultValue;
            options = options[0].children;
        }
        return (react_1.default.createElement("div", { className: cx('TransferControl', className) },
            react_1.default.createElement(TransferPicker_1.default, { borderMode: borderMode, selectMode: selectMode, value: selectedOptions, disabled: disabled, options: options, onChange: this.handleChange, option2value: this.option2value, sortable: sortable, searchResultMode: searchResultMode, onSearch: searchable ? this.handleSearch : undefined, showArrow: showArrow, onDeferLoad: deferLoad, selectTitle: selectTitle, resultTitle: resultTitle, size: pickerSize, columns: columns, leftMode: leftMode, leftOptions: leftOptions, optionItemRender: this.optionItemRender, resultItemRender: this.resultItemRender, onFocus: function () { return _this.dispatchEvent('focus'); }, onBlur: function () { return _this.dispatchEvent('blur'); } }),
            react_1.default.createElement(Spinner_1.default, { overlay: true, key: "info", show: loading })));
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [String]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], TransferPickerRenderer.prototype, "dispatchEvent", null);
    TransferPickerRenderer = (0, tslib_1.__decorate)([
        (0, Options_1.OptionsControl)({
            type: 'transfer-picker'
        })
    ], TransferPickerRenderer);
    return TransferPickerRenderer;
}(Transfer_1.BaseTransferRenderer));
exports.TransferPickerRenderer = TransferPickerRenderer;
//# sourceMappingURL=./renderers/Form/TransferPicker.js.map
