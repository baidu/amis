"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListMenu = void 0;
var tslib_1 = require("tslib");
var theme_1 = require("../theme");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var locale_1 = require("../locale");
var ListMenu = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(ListMenu, _super);
    function ListMenu() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ListMenu.prototype.renderItem = function (result, option, optionIndex) {
        var _this = this;
        var _a = this.props, cx = _a.classnames, itemRender = _a.itemRender, disabled = _a.disabled, getItemProps = _a.getItemProps, highlightIndex = _a.highlightIndex, selectedOptions = _a.selectedOptions, onSelect = _a.onSelect;
        if (Array.isArray(option.children) && option.children.length) {
            var stackResult = {
                items: [],
                index: result.index
            };
            result.items.push(react_1.default.createElement("div", { className: cx('ListMenu-group'), key: optionIndex },
                react_1.default.createElement("div", { className: cx('ListMenu-groupLabel') }, itemRender(option)),
                option.children.reduce(function (result, option, index) {
                    return _this.renderItem(result, option, index);
                }, stackResult).items));
            result.index = stackResult.index;
            return result;
        }
        var index = result.index++;
        result.items.push(react_1.default.createElement("div", (0, tslib_1.__assign)({ className: cx('ListMenu-item', option.className, disabled || option.disabled ? 'is-disabled' : '', index === highlightIndex ? 'is-highlight' : '', ~(selectedOptions || []).indexOf(option) ? 'is-active' : ''), key: index, onClick: onSelect ? function (e) { return onSelect(e, option); } : undefined }, getItemProps({
            item: option,
            index: index
        })),
            react_1.default.createElement("div", { className: cx('ListMenu-itemLabel') }, itemRender(option))));
        return result;
    };
    ListMenu.prototype.render = function () {
        var _this = this;
        var _a = this.props, cx = _a.classnames, options = _a.options, placeholder = _a.placeholder, prefix = _a.prefix, children = _a.children;
        var __ = this.props.translate;
        return (react_1.default.createElement("div", { className: cx('ListMenu') },
            prefix,
            Array.isArray(options) && options.length ? (options.reduce(function (result, option, index) {
                return _this.renderItem(result, option, index);
            }, {
                items: [],
                index: 0
            }).items) : (react_1.default.createElement("span", { className: cx('ListMenu-placeholder') }, __(placeholder))),
            children));
    };
    ListMenu.defaultProps = {
        placeholder: 'placeholder.noOption',
        itemRender: function (option) { return react_1.default.createElement(react_1.default.Fragment, null, option.label); },
        getItemProps: function (props) { return null; }
    };
    return ListMenu;
}(react_1.default.Component));
exports.ListMenu = ListMenu;
exports.default = (0, theme_1.themeable)((0, locale_1.localeable)(ListMenu));
//# sourceMappingURL=./components/ListMenu.js.map
