"use strict";
/**
 * 关联多选框，仅支持两层关联选择。
 * 左边先点选，然后右边再次点选。
 * 可以满足，先从 tree 中选中一个元素，然后查出来一个列表再次勾选。
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssociatedSelection = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var Selection_1 = require("./Selection");
var Select_1 = require("./Select");
var helper_1 = require("../utils/helper");
var theme_1 = require("../theme");
var uncontrollable_1 = require("uncontrollable");
var GroupedSelection_1 = (0, tslib_1.__importDefault)(require("./GroupedSelection"));
var TableSelection_1 = (0, tslib_1.__importDefault)(require("./TableSelection"));
var TreeSelection_1 = (0, tslib_1.__importDefault)(require("./TreeSelection"));
var GroupedSelection_2 = (0, tslib_1.__importDefault)(require("./GroupedSelection"));
var ChainedSelection_1 = (0, tslib_1.__importDefault)(require("./ChainedSelection"));
var icons_1 = require("./icons");
var locale_1 = require("../locale");
var AssociatedSelection = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(AssociatedSelection, _super);
    function AssociatedSelection() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            leftValue: _this.props.leftDefaultValue
        };
        return _this;
    }
    AssociatedSelection.prototype.componentDidMount = function () {
        var leftValue = this.state.leftValue;
        var _a = this.props, options = _a.options, onDeferLoad = _a.onDeferLoad;
        if (leftValue) {
            var selectdOption = Selection_1.BaseSelection.resolveSelected(leftValue, options, function (option) { return option.ref; });
            if (selectdOption && onDeferLoad && selectdOption.defer) {
                onDeferLoad(selectdOption);
            }
        }
    };
    AssociatedSelection.prototype.leftOption2Value = function (option) {
        return option.value;
    };
    AssociatedSelection.prototype.handleLeftSelect = function (value) {
        var _a = this.props, options = _a.options, onDeferLoad = _a.onDeferLoad;
        this.setState({ leftValue: value });
        var selectdOption = Selection_1.BaseSelection.resolveSelected(value, options, function (option) { return option.ref; });
        if (selectdOption && onDeferLoad && selectdOption.defer) {
            onDeferLoad(selectdOption);
        }
    };
    AssociatedSelection.prototype.handleLeftDeferLoad = function (option) {
        var _a = this.props, leftOptions = _a.leftOptions, onLeftDeferLoad = _a.onLeftDeferLoad, onDeferLoad = _a.onDeferLoad;
        if (typeof onLeftDeferLoad === 'function') {
            // TabsTransfer
            return onLeftDeferLoad === null || onLeftDeferLoad === void 0 ? void 0 : onLeftDeferLoad(option, leftOptions);
        }
        else if (typeof onDeferLoad === 'function') {
            // Select
            return onDeferLoad === null || onDeferLoad === void 0 ? void 0 : onDeferLoad(option);
        }
    };
    AssociatedSelection.prototype.handleRetry = function (option) {
        var onDeferLoad = this.props.onDeferLoad;
        onDeferLoad === null || onDeferLoad === void 0 ? void 0 : onDeferLoad(option);
    };
    AssociatedSelection.prototype.render = function () {
        var _a = this.props, cx = _a.classnames, className = _a.className, leftOptions = _a.leftOptions, options = _a.options, option2value = _a.option2value, rightMode = _a.rightMode, onChange = _a.onChange, columns = _a.columns, value = _a.value, disabled = _a.disabled, leftMode = _a.leftMode, cellRender = _a.cellRender, multiple = _a.multiple, itemRender = _a.itemRender;
        var selectdOption = Selection_1.BaseSelection.resolveSelected(this.state.leftValue, options, function (option) { return option.ref; });
        var __ = this.props.translate;
        return (react_1.default.createElement("div", { className: cx('AssociatedSelection', className) },
            react_1.default.createElement("div", { className: cx('AssociatedSelection-left') }, leftMode === 'tree' ? (react_1.default.createElement(TreeSelection_1.default, { option2value: this.leftOption2Value, options: leftOptions, value: this.state.leftValue, disabled: disabled, onChange: this.handleLeftSelect, multiple: false, clearable: false, onDeferLoad: this.handleLeftDeferLoad })) : (react_1.default.createElement(GroupedSelection_2.default, { option2value: this.leftOption2Value, options: leftOptions, value: this.state.leftValue, disabled: disabled, onChange: this.handleLeftSelect, multiple: false, clearable: false }))),
            react_1.default.createElement("div", { className: cx('AssociatedSelection-right') }, this.state.leftValue ? (selectdOption ? (selectdOption.defer && !selectdOption.loaded ? (react_1.default.createElement("div", { className: cx('AssociatedSelection-box') },
                react_1.default.createElement("div", { className: cx('AssociatedSelection-reload', selectdOption.loading ? 'is-spin' : 'is-clickable'), onClick: selectdOption.loading
                        ? undefined
                        : this.handleRetry.bind(this, selectdOption) },
                    react_1.default.createElement(icons_1.Icon, { icon: "reload", className: "icon" })),
                selectdOption.loading ? (react_1.default.createElement("p", null, __('loading'))) : (react_1.default.createElement("p", null, __('Transfer.refreshIcon'))))) : rightMode === 'table' ? (react_1.default.createElement(TableSelection_1.default, { columns: columns, value: value, disabled: disabled, options: selectdOption.children || [], onChange: onChange, option2value: option2value, cellRender: cellRender, multiple: multiple })) : rightMode === 'tree' ? (react_1.default.createElement(TreeSelection_1.default, { value: value, disabled: disabled, options: selectdOption.children || [], onChange: onChange, option2value: option2value, multiple: multiple, itemRender: itemRender })) : rightMode === 'chained' ? (react_1.default.createElement(ChainedSelection_1.default, { value: value, disabled: disabled, options: selectdOption.children || [], onChange: onChange, option2value: option2value, multiple: multiple, itemRender: itemRender })) : (react_1.default.createElement(GroupedSelection_1.default, { value: value, disabled: disabled, options: selectdOption.children || [], onChange: onChange, option2value: option2value, multiple: multiple, itemRender: itemRender }))) : (react_1.default.createElement("div", { className: cx('AssociatedSelection-box') }, __('Transfer.configError')))) : (react_1.default.createElement("div", { className: cx('AssociatedSelection-box') }, __('Transfer.selectFromLeft'))))));
    };
    var _a, _b, _c;
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof Select_1.Option !== "undefined" && Select_1.Option) === "function" ? _a : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], AssociatedSelection.prototype, "leftOption2Value", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_b = typeof Select_1.Option !== "undefined" && Select_1.Option) === "function" ? _b : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], AssociatedSelection.prototype, "handleLeftSelect", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_c = typeof Select_1.Option !== "undefined" && Select_1.Option) === "function" ? _c : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], AssociatedSelection.prototype, "handleLeftDeferLoad", null);
    return AssociatedSelection;
}(Selection_1.BaseSelection));
exports.AssociatedSelection = AssociatedSelection;
exports.default = (0, theme_1.themeable)((0, locale_1.localeable)((0, uncontrollable_1.uncontrollable)(AssociatedSelection, {
    value: 'onChange'
})));
//# sourceMappingURL=./components/AssociatedSelection.js.map
