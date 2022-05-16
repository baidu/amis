"use strict";
/**
 * @file Breadcrumb 面包屑
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BreadcrumbItem = exports.Breadcrumb = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var TooltipWrapper_1 = (0, tslib_1.__importDefault)(require("./TooltipWrapper"));
var theme_1 = require("../theme");
var RootClose_1 = require("../utils/RootClose");
var helper_1 = require("../utils/helper");
var icons_1 = require("../components/icons");
var icon_1 = require("../utils/icon");
/**
 * Breadcrumb 面包屑类
 */
var Breadcrumb = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Breadcrumb, _super);
    function Breadcrumb() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Breadcrumb.prototype.render = function () {
        var cx = this.props.classnames;
        var _a = this.props, className = _a.className, separatorClassName = _a.separatorClassName, items = _a.items, separator = _a.separator, restProps = (0, tslib_1.__rest)(_a, ["className", "separatorClassName", "items", "separator"]);
        var crumbsLength = items === null || items === void 0 ? void 0 : items.length;
        if (!crumbsLength) {
            return react_1.default.createElement("div", { className: cx('Breadcrumb', className) });
        }
        var crumbs = items.map(function (item, index) {
            var itemPlace = 'middle';
            if (index === 0) {
                itemPlace = 'start';
            }
            if (index === crumbsLength - 1) {
                itemPlace = 'end';
            }
            return (react_1.default.createElement(BreadcrumbItem, (0, tslib_1.__assign)({}, restProps, { item: item, itemPlace: itemPlace, key: index })));
        })
            .reduce(function (prev, curr, index) { return [
            prev,
            react_1.default.createElement("span", { className: cx('Breadcrumb-separator', separatorClassName), key: "separator-".concat(index) }, separator),
            curr
        ]; });
        return (react_1.default.createElement("div", { className: cx('Breadcrumb', className) }, crumbs));
    };
    Breadcrumb.defaultProps = {
        separator: '>',
        labelMaxLength: 16,
        tooltipPosition: 'top'
    };
    return Breadcrumb;
}(react_1.default.Component));
exports.Breadcrumb = Breadcrumb;
/**
 * BreadcrumbItem 面包项类
 */
var BreadcrumbItem = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(BreadcrumbItem, _super);
    function BreadcrumbItem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            tooltipTrigger: ['hover', 'focus'],
            tooltipRootClose: false,
            isOpened: false
        };
        _this.domRef = function (ref) {
            _this.target = ref;
        };
        _this.toogle = function (e) {
            e.preventDefault();
            _this.setState({
                isOpened: !_this.state.isOpened
            });
        };
        _this.close = function () {
            _this.setState({
                isOpened: false
            });
        };
        return _this;
    }
    /**
     * 渲染基础面包项
     * @param showHref 是否显示超链接
     * @param itemType 基础面包项类型
     * @param item 面包项
     * @param label 渲染文本
     * @returns
     */
    BreadcrumbItem.prototype.renderBreadcrumbBaseItem = function (showHref, itemType, item, label) {
        var _a = this.props, itemClassName = _a.itemClassName, dropdownItemClassName = _a.dropdownItemClassName, cx = _a.classnames;
        var baseItemClassName = itemType === 'default' ? itemClassName : dropdownItemClassName;
        if (showHref) {
            return (react_1.default.createElement("a", { href: item.href, className: cx('Breadcrumb-item-' + itemType, baseItemClassName) },
                item.icon
                    ? (0, icon_1.generateIcon)(cx, item.icon, 'Icon', 'Breadcrumb-icon')
                    : null,
                react_1.default.createElement("span", { className: cx('TplField') }, label)));
        }
        return (react_1.default.createElement("span", { className: cx('Breadcrumb-item-' + itemType, baseItemClassName) },
            item.icon
                ? (0, icon_1.generateIcon)(cx, item.icon, 'Icon', 'Breadcrumb-icon')
                : null,
            react_1.default.createElement("span", { className: cx('TplField') }, label)));
    };
    /**
     * 渲染基础面包项完整节点
     * @param item 面包项
     * @param tooltipPosition 浮窗提示位置
     * @param itemPlace 面包香所在相对位置
     * @param itemType 基础面包项类型
     * @returns
     */
    BreadcrumbItem.prototype.renderBreadcrumbNode = function (item, tooltipPosition, itemPlace, itemType) {
        if (tooltipPosition === void 0) { tooltipPosition = 'top'; }
        var _a = this.props, labelMaxLength = _a.labelMaxLength, tooltipContainer = _a.tooltipContainer;
        var _b = this.state, tooltipTrigger = _b.tooltipTrigger, tooltipRootClose = _b.tooltipRootClose;
        var pureLabel = item.label ? (0, helper_1.removeHTMLTag)(item.label) : '';
        // 限制最大展示长度的最小值
        var maxLength = labelMaxLength && +labelMaxLength > 1 ? +labelMaxLength : 1;
        // 面包项相对位置为 middle ，且超过最大展示长度的面包项，进行缩略展示，并使用浮窗提示
        if (pureLabel.length > maxLength && itemPlace === 'middle') {
            return (react_1.default.createElement(TooltipWrapper_1.default, { tooltip: pureLabel, placement: tooltipPosition, container: tooltipContainer, trigger: tooltipTrigger, rootClose: tooltipRootClose }, this.renderBreadcrumbBaseItem(true, itemType, item, pureLabel.substring(0, maxLength) + '...')));
        }
        var showHref = !item.href || itemPlace === 'end';
        return this.renderBreadcrumbBaseItem(!showHref, itemType, item, pureLabel);
    };
    /**
     * 渲染下拉菜单节点
     * @param dropdown 面包项下拉菜单
     * @returns
     */
    BreadcrumbItem.prototype.renderDropdownNode = function (dropdown) {
        var _this = this;
        var _a = this.props, dropdownClassName = _a.dropdownClassName, cx = _a.classnames;
        return (react_1.default.createElement(RootClose_1.RootClose, { disabled: !this.state.isOpened, onRootClose: this.close }, function (ref) {
            return (react_1.default.createElement("ul", { className: cx('Breadcrumb-dropdown', dropdownClassName), onClick: _this.close, ref: ref }, Array.isArray(dropdown)
                && dropdown.map(function (menuItem, index) {
                    return (react_1.default.createElement("li", { key: 'dropdown-item' + index }, _this.renderBreadcrumbNode(menuItem, 'right', 'middle', 'dropdown')));
                })));
        }));
    };
    BreadcrumbItem.prototype.render = function () {
        var _a = this.props, item = _a.item, itemPlace = _a.itemPlace, tooltipPosition = _a.tooltipPosition, cx = _a.classnames;
        var dropdown = item.dropdown, restItemProps = (0, tslib_1.__rest)(item, ["dropdown"]);
        return (react_1.default.createElement("span", { className: cx('Breadcrumb-item', {
                'is-opened': this.state.isOpened
            }, {
                'Breadcrumb-item-last': itemPlace === 'end'
            }), ref: this.domRef },
            this.renderBreadcrumbNode((0, tslib_1.__assign)({}, restItemProps), tooltipPosition, itemPlace, 'default'),
            dropdown ? (react_1.default.createElement("span", { onClick: this.toogle, className: cx('Breadcrumb-item-caret') },
                react_1.default.createElement(icons_1.Icon, { icon: "caret", className: "icon" }))) : null,
            dropdown && this.state.isOpened ? this.renderDropdownNode(dropdown) : null));
    };
    return BreadcrumbItem;
}(react_1.default.Component));
exports.BreadcrumbItem = BreadcrumbItem;
exports.default = (0, theme_1.themeable)(Breadcrumb);
//# sourceMappingURL=./components/Breadcrumb.js.map
