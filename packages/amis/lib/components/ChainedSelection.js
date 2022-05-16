"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainedSelection = void 0;
var tslib_1 = require("tslib");
/**
 * 级联多选框，支持无限极。从左侧到右侧一层层点选。
 */
var Selection_1 = require("./Selection");
var theme_1 = require("../theme");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var uncontrollable_1 = require("uncontrollable");
var Checkbox_1 = (0, tslib_1.__importDefault)(require("./Checkbox"));
var helper_1 = require("../utils/helper");
var times_1 = (0, tslib_1.__importDefault)(require("lodash/times"));
var Spinner_1 = (0, tslib_1.__importDefault)(require("./Spinner"));
var locale_1 = require("../locale");
var ChainedSelection = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(ChainedSelection, _super);
    function ChainedSelection() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            selected: []
        };
        return _this;
    }
    ChainedSelection.prototype.componentDidMount = function () {
        var defaultSelectedIndex = this.props.defaultSelectedIndex;
        if (defaultSelectedIndex !== undefined) {
            this.setState({
                selected: ["".concat(defaultSelectedIndex)]
            });
        }
    };
    ChainedSelection.prototype.selectOption = function (option, depth, id) {
        var onDeferLoad = this.props.onDeferLoad;
        var selected = this.state.selected.concat();
        selected.splice(depth, selected.length - depth);
        selected.push(id);
        this.setState({
            selected: selected
        }, option.defer && onDeferLoad ? function () { return onDeferLoad(option); } : undefined);
    };
    ChainedSelection.prototype.renderItem = function (option, index, depth, id) {
        var _this = this;
        var _a = this.props, labelClassName = _a.labelClassName, disabled = _a.disabled, cx = _a.classnames, itemClassName = _a.itemClassName, itemRender = _a.itemRender, multiple = _a.multiple;
        var valueArray = this.valueArray;
        return (react_1.default.createElement("div", { key: index, className: cx('ChainedSelection-item', itemClassName, option.className, disabled || option.disabled ? 'is-disabled' : '', !!~valueArray.indexOf(option) ? 'is-active' : ''), onClick: function () { return _this.toggleOption(option); } },
            multiple ? (react_1.default.createElement(Checkbox_1.default, { size: "sm", checked: !!~valueArray.indexOf(option), disabled: disabled || option.disabled, labelClassName: labelClassName, description: option.description })) : null,
            react_1.default.createElement("div", { className: cx('ChainedSelection-itemLabel') }, itemRender(option, {
                index: index,
                multiple: multiple,
                checked: !!~valueArray.indexOf(option),
                onChange: function () { return _this.toggleOption(option); },
                disabled: disabled || option.disabled
            }))));
    };
    ChainedSelection.prototype.renderOption = function (option, index, depth, id) {
        var _this = this;
        var _a = this.props, labelClassName = _a.labelClassName, disabled = _a.disabled, cx = _a.classnames, itemClassName = _a.itemClassName, itemRender = _a.itemRender, multiple = _a.multiple;
        var valueArray = this.valueArray;
        if (Array.isArray(option.children) || option.defer) {
            return (react_1.default.createElement("div", { key: index, className: cx('ChainedSelection-item', itemClassName, option.className, disabled || option.disabled ? 'is-disabled' : '', ~this.state.selected.indexOf(id) ? 'is-active' : ''), onClick: function () { return _this.selectOption(option, depth, id); } },
                react_1.default.createElement("div", { className: cx('ChainedSelection-itemLabel') }, itemRender(option, {
                    index: index,
                    multiple: multiple,
                    checked: !!~this.state.selected.indexOf(id),
                    onChange: function () { return _this.selectOption(option, depth, id); },
                    disabled: disabled || option.disabled
                })),
                option.defer && option.loading ? react_1.default.createElement(Spinner_1.default, { size: "sm", show: true }) : null));
        }
        return this.renderItem(option, index, depth, id);
    };
    ChainedSelection.prototype.render = function () {
        var _this = this;
        var _a = this.props, value = _a.value, options = _a.options, className = _a.className, placeholder = _a.placeholder, cx = _a.classnames, option2value = _a.option2value, itemRender = _a.itemRender, __ = _a.translate;
        this.valueArray = Selection_1.BaseSelection.value2array(value, options, option2value);
        var body = [];
        if (Array.isArray(options) && options.length) {
            var selected_1 = this.state.selected.concat();
            var depth = Math.min((0, helper_1.getTreeDepth)(options), 3);
            (0, times_1.default)(Math.max(depth - selected_1.length, 1), function () { return selected_1.push(null); });
            selected_1.reduce(function (_a, selected, depth) {
                var body = _a.body, options = _a.options, subTitle = _a.subTitle, indexes = _a.indexes, placeholder = _a.placeholder;
                var nextOptions = [];
                var nextSubTitle = '';
                var nextPlaceholder = '';
                var nextIndexes = indexes;
                body.push(react_1.default.createElement("div", { key: depth, className: cx('ChainedSelection-col') },
                    subTitle ? (react_1.default.createElement("div", { className: cx('ChainedSelection-subTitle') }, subTitle)) : null,
                    Array.isArray(options) && options.length ? (options.map(function (option, index) {
                        var id = indexes.concat(index).join('-');
                        if (id === selected) {
                            nextSubTitle = option.subTitle;
                            nextOptions = option.children;
                            nextIndexes = indexes.concat(index);
                            nextPlaceholder = option.placeholder;
                        }
                        return _this.renderOption(option, index, depth, id);
                    })) : (react_1.default.createElement("div", { className: cx('ChainedSelection-placeholder') }, __(placeholder)))));
                return {
                    options: nextOptions,
                    subTitle: nextSubTitle,
                    placeholder: nextPlaceholder,
                    indexes: nextIndexes,
                    body: body
                };
            }, {
                options: options,
                body: body,
                indexes: [],
                placeholder: placeholder
            });
        }
        return (react_1.default.createElement("div", { className: cx('ChainedSelection', className) }, body && body.length ? (body) : (react_1.default.createElement("div", { className: cx('ChainedSelection-placeholder') }, __(placeholder)))));
    };
    return ChainedSelection;
}(Selection_1.BaseSelection));
exports.ChainedSelection = ChainedSelection;
exports.default = (0, theme_1.themeable)((0, locale_1.localeable)((0, uncontrollable_1.uncontrollable)(ChainedSelection, {
    value: 'onChange'
})));
//# sourceMappingURL=./components/ChainedSelection.js.map
