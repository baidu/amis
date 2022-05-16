"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupedSelection = void 0;
var tslib_1 = require("tslib");
var Selection_1 = require("./Selection");
var theme_1 = require("../theme");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var uncontrollable_1 = require("uncontrollable");
var Checkbox_1 = (0, tslib_1.__importDefault)(require("./Checkbox"));
var locale_1 = require("../locale");
var GroupedSelection = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(GroupedSelection, _super);
    function GroupedSelection() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GroupedSelection.prototype.renderOption = function (option, index) {
        var _this = this;
        var _a = this.props, labelClassName = _a.labelClassName, disabled = _a.disabled, cx = _a.classnames, itemClassName = _a.itemClassName, itemRender = _a.itemRender, multiple = _a.multiple;
        var valueArray = this.valueArray;
        if (Array.isArray(option.children)) {
            return (react_1.default.createElement("div", { key: index, className: cx('GroupedSelection-group', option.className) },
                react_1.default.createElement("div", { className: cx('GroupedSelection-itemLabel') }, itemRender(option, {
                    index: index,
                    multiple: multiple,
                    checked: false,
                    onChange: function () { return undefined; },
                    disabled: disabled || option.disabled
                })),
                react_1.default.createElement("div", { className: cx('GroupedSelection-items', option.className) }, option.children.map(function (child, index) {
                    return _this.renderOption(child, index);
                }))));
        }
        return (react_1.default.createElement("div", { key: index, className: cx('GroupedSelection-item', itemClassName, option.className, disabled || option.disabled ? 'is-disabled' : '', !!~valueArray.indexOf(option) ? 'is-active' : ''), onClick: function () { return _this.toggleOption(option); } },
            multiple ? (react_1.default.createElement(Checkbox_1.default, { size: "sm", checked: !!~valueArray.indexOf(option), disabled: disabled || option.disabled, labelClassName: labelClassName, description: option.description })) : null,
            react_1.default.createElement("div", { className: cx('GroupedSelection-itemLabel') }, itemRender(option, {
                index: index,
                multiple: multiple,
                checked: !!~valueArray.indexOf(option),
                onChange: function () { return _this.toggleOption(option); },
                disabled: disabled || option.disabled
            }))));
    };
    GroupedSelection.prototype.render = function () {
        var _this = this;
        var _a = this.props, value = _a.value, options = _a.options, className = _a.className, placeholder = _a.placeholder, cx = _a.classnames, option2value = _a.option2value, onClick = _a.onClick;
        var __ = this.props.translate;
        this.valueArray = Selection_1.BaseSelection.value2array(value, options, option2value);
        var body = [];
        if (Array.isArray(options) && options.length) {
            body = options.map(function (option, key) { return _this.renderOption(option, key); });
        }
        return (react_1.default.createElement("div", { className: cx('GroupedSelection', className), onClick: onClick }, body && body.length ? (body) : (react_1.default.createElement("div", { className: cx('GroupedSelection-placeholder') }, __(placeholder)))));
    };
    return GroupedSelection;
}(Selection_1.BaseSelection));
exports.GroupedSelection = GroupedSelection;
exports.default = (0, theme_1.themeable)((0, locale_1.localeable)((0, uncontrollable_1.uncontrollable)(GroupedSelection, {
    value: 'onChange'
})));
//# sourceMappingURL=./components/GroupedSelection.js.map
