"use strict";
/**
 * @file AsideNav
 * @description 左侧导航。
 * @author fex
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsideNav = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var helper_1 = require("../utils/helper");
var theme_1 = require("../theme");
var AsideNav = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(AsideNav, _super);
    function AsideNav(props) {
        var _this = _super.call(this, props) || this;
        var isOpen = props.isOpen;
        var id = 1;
        _this.state = {
            navigations: (0, helper_1.mapTree)(props.navigations, function (item) {
                var isActive = typeof item.active === 'undefined'
                    ? props.isActive(item)
                    : item.active;
                return (0, tslib_1.__assign)((0, tslib_1.__assign)({}, item), { id: id++, active: isActive, open: isActive || isOpen(item) });
            }, 1, true)
        };
        _this.renderLink = _this.renderLink.bind(_this);
        _this.toggleExpand = _this.toggleExpand.bind(_this);
        return _this;
    }
    AsideNav.prototype.componentDidUpdate = function (prevProps) {
        var props = this.props;
        var isOpen = prevProps.isOpen;
        if (prevProps.navigations !== props.navigations ||
            prevProps.isActive !== props.isActive) {
            var id_1 = 1;
            this.setState({
                navigations: (0, helper_1.mapTree)(props.navigations, function (item) {
                    var isActive = typeof item.active === 'undefined'
                        ? props.isActive(item)
                        : item.active;
                    return (0, tslib_1.__assign)((0, tslib_1.__assign)({}, item), { id: id_1++, active: isActive, open: isActive || isOpen(item) });
                }, 1, true)
            });
        }
    };
    AsideNav.prototype.toggleExpand = function (link, e) {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        this.setState({
            navigations: (0, helper_1.mapTree)(this.state.navigations, function (item) { return ((0, tslib_1.__assign)((0, tslib_1.__assign)({}, item), { open: link.id === item.id ? !item.open : item.open })); }, 1, true)
        });
    };
    AsideNav.prototype.renderLink = function (link, key, props, depth) {
        var _a;
        if (props === void 0) { props = {}; }
        if (depth === void 0) { depth = 1; }
        var _b = this.props, renderLink = _b.renderLink, isActive = _b.isActive, renderSubLinks = _b.renderSubLinks, cx = _b.classnames, others = (0, tslib_1.__rest)(_b, ["renderLink", "isActive", "renderSubLinks", "classnames"]);
        var dom = renderLink((0, tslib_1.__assign)({ link: link, active: link.active, open: link.open, toggleExpand: this.toggleExpand, depth: depth, classnames: cx, subHeader: key === 'subHeader' }, others));
        if (!dom) {
            return;
        }
        else if (key === 'subHeader') {
            return react_1.default.cloneElement(dom, {
                key: key
            });
        }
        return (react_1.default.createElement("li", (0, tslib_1.__assign)({}, props, { key: key, className: cx("AsideNav-item", link.className, (_a = {},
                _a["is-open"] = link.open,
                _a["is-active"] = link.active,
                _a)) }),
            dom,
            renderSubLinks(link, this.renderLink, depth, this.props)));
    };
    AsideNav.prototype.render = function () {
        var _this = this;
        var navigations = this.state.navigations;
        var links = [];
        var _a = this.props, className = _a.className, cx = _a.classnames;
        navigations.forEach(function (navigation, index) {
            if (!Array.isArray(navigation.children)) {
                return;
            }
            if (navigation.prefix) {
                var prefix = typeof navigation.prefix === 'function'
                    ? navigation.prefix(_this.props)
                    : navigation.prefix;
                links.push(react_1.default.cloneElement(prefix, (0, tslib_1.__assign)((0, tslib_1.__assign)({}, prefix.props), { key: "".concat(index, "-prefix") })));
            }
            navigation.label &&
                links.push(react_1.default.createElement("li", { key: "".concat(index, "-label"), className: cx("AsideNav-label", navigation.className) },
                    react_1.default.createElement("span", null, navigation.label)));
            navigation.children.forEach(function (item, key) {
                var link = _this.renderLink(item, "".concat(index, "-").concat(key));
                link && links.push(link);
            });
            if (navigation.affix) {
                var affix = typeof navigation.affix === 'function'
                    ? navigation.affix(_this.props)
                    : navigation.affix;
                links.push(react_1.default.cloneElement(affix, (0, tslib_1.__assign)((0, tslib_1.__assign)({}, affix.props), { key: "".concat(index, "-affix") })));
            }
        });
        return (react_1.default.createElement("nav", { className: cx("AsideNav", className) },
            react_1.default.createElement("ul", { className: cx("AsideNav-list") }, links)));
    };
    AsideNav.defaultProps = {
        renderLink: function (item) { return react_1.default.createElement("a", null, item.label); },
        renderSubLinks: function (link, renderLink, depth, _a) {
            var cx = _a.classnames;
            return link.children && link.children.length ? (react_1.default.createElement("ul", { className: cx('AsideNav-subList') },
                link.label ? (react_1.default.createElement("li", { key: "subHeader", className: cx('AsideNav-subHeader') }, renderLink((0, tslib_1.__assign)((0, tslib_1.__assign)({}, link), { children: undefined }), 'subHeader', {}, depth))) : null,
                link.children.map(function (link, key) {
                    return renderLink(link, key, {}, depth + 1);
                }))) : link.label && depth === 1 ? (react_1.default.createElement("div", { className: cx('AsideNav-tooltip') }, link.label)) : null;
        },
        isActive: function (link) { return link.open; },
        isOpen: function (item) {
            return item.children ? item.children.some(function (item) { return item.open; }) : false;
        }
    };
    return AsideNav;
}(react_1.default.Component));
exports.AsideNav = AsideNav;
exports.default = (0, theme_1.themeable)(AsideNav);
//# sourceMappingURL=./components/AsideNav.js.map
