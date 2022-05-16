"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortletRenderer = exports.Portlet = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var mapValues_1 = (0, tslib_1.__importDefault)(require("lodash/mapValues"));
var Tabs_1 = require("../components/Tabs");
var factory_1 = require("../factory");
var tpl_builtin_1 = require("../utils/tpl-builtin");
var api_1 = require("../utils/api");
var helper_1 = require("../utils/helper");
var tpl_1 = require("../utils/tpl");
var Portlet = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Portlet, _super);
    function Portlet(props) {
        var _this = _super.call(this, props) || this;
        var activeKey = props.activeKey || 0;
        _this.state = {
            activeKey: activeKey
        };
        return _this;
    }
    Portlet.prototype.handleSelect = function (key) {
        var _a = this.props, onSelect = _a.onSelect, tabs = _a.tabs;
        if (typeof key === 'number' && key < tabs.length) {
            this.setState({
                activeKey: key
            });
        }
        if (typeof onSelect === 'string') {
            var selectFunc = (0, api_1.str2AsyncFunction)(onSelect, 'key', 'props');
            selectFunc && selectFunc(key, this.props);
        }
        else if (typeof onSelect === 'function') {
            onSelect(key, this.props);
        }
    };
    Portlet.prototype.renderToolbarItem = function (toolbar) {
        var render = this.props.render;
        var actions = [];
        if (Array.isArray(toolbar)) {
            toolbar.forEach(function (action, index) {
                return actions.push(render("toolbar/".concat(index), (0, tslib_1.__assign)({ type: 'button', level: 'link', size: 'sm' }, action), {
                    key: index
                }));
            });
        }
        return actions;
    };
    Portlet.prototype.renderToolbar = function () {
        var _a = this.props, toolbar = _a.toolbar, cx = _a.classnames, ns = _a.classPrefix, tabs = _a.tabs;
        var activeKey = this.state.activeKey;
        var tabToolbar = null;
        var tabToolbarTpl = null;
        // tabs里的toolbar
        var toolbarTpl = toolbar ? (react_1.default.createElement("div", { className: cx("".concat(ns, "toolbar")) }, this.renderToolbarItem(toolbar))) : null;
        // tab里的toolbar
        if (typeof activeKey !== 'undefined') {
            tabToolbar = tabs[activeKey].toolbar;
            tabToolbarTpl = tabToolbar ? (react_1.default.createElement("div", { className: cx("".concat(ns, "tab-toolbar")) }, this.renderToolbarItem(tabToolbar))) : null;
        }
        return toolbarTpl || tabToolbarTpl ? (react_1.default.createElement("div", { className: cx("".concat(ns, "Portlet-toolbar")) },
            toolbarTpl,
            tabToolbarTpl)) : null;
    };
    Portlet.prototype.renderDesc = function () {
        var _a = this.props, descTpl = _a.description, render = _a.render, cx = _a.classnames, ns = _a.classPrefix, data = _a.data;
        var desc = (0, tpl_1.filter)(descTpl, data);
        return desc ? (react_1.default.createElement("span", { className: cx("".concat(ns, "Portlet-header-desc")) }, desc)) : null;
    };
    Portlet.prototype.renderTabs = function () {
        var _a;
        var _this = this;
        var _b = this.props, cx = _b.classnames, ns = _b.classPrefix, tabsClassName = _b.tabsClassName, contentClassName = _b.contentClassName, linksClassName = _b.linksClassName, tabRender = _b.tabRender, render = _b.render, data = _b.data, dMode = _b.mode, tabsMode = _b.tabsMode, unmountOnExit = _b.unmountOnExit, source = _b.source, mountOnEnter = _b.mountOnEnter, scrollable = _b.scrollable, __ = _b.translate, addBtnText = _b.addBtnText, divider = _b.divider;
        var mode = tabsMode || dMode;
        var arr = (0, tpl_builtin_1.resolveVariable)(source, data);
        var tabs = this.props.tabs;
        if (!tabs) {
            return null;
        }
        tabs = Array.isArray(tabs) ? tabs : [tabs];
        var children = [];
        var tabClassname = cx("".concat(ns, "Portlet-tab"), tabsClassName, (_a = {},
            _a['unactive-select'] = tabs.length <= 1,
            _a['no-divider'] = !divider,
            _a));
        if (Array.isArray(arr)) {
            arr.forEach(function (value, index) {
                var ctx = (0, helper_1.createObject)(data, (0, helper_1.isObject)(value) ? (0, tslib_1.__assign)({ index: index }, value) : { item: value, index: index });
                children.push.apply(children, tabs.map(function (tab, tabIndex) {
                    var _a;
                    return (0, helper_1.isVisible)(tab, ctx) ? (react_1.default.createElement(Tabs_1.Tab, (0, tslib_1.__assign)({}, tab, { title: (0, tpl_1.filter)(tab.title, ctx), disabled: (0, helper_1.isDisabled)(tab, ctx), key: "".concat(index * 1000 + tabIndex), eventKey: index * 1000 + tabIndex, mountOnEnter: mountOnEnter, unmountOnExit: typeof tab.reload === 'boolean'
                            ? tab.reload
                            : typeof tab.unmountOnExit === 'boolean'
                                ? tab.unmountOnExit
                                : unmountOnExit }), render("item/".concat(index, "/").concat(tabIndex), ((_a = tab) === null || _a === void 0 ? void 0 : _a.type) ? tab : tab.tab || tab.body, {
                        data: ctx
                    }))) : null;
                }));
            });
        }
        else {
            children = tabs.map(function (tab, index) {
                var _a;
                return (0, helper_1.isVisible)(tab, data) ? (react_1.default.createElement(Tabs_1.Tab, (0, tslib_1.__assign)({}, tab, { title: (0, tpl_1.filter)(tab.title, data), disabled: (0, helper_1.isDisabled)(tab, data), key: index, eventKey: index, mountOnEnter: mountOnEnter, unmountOnExit: typeof tab.reload === 'boolean'
                        ? tab.reload
                        : typeof tab.unmountOnExit === 'boolean'
                            ? tab.unmountOnExit
                            : unmountOnExit }), _this.renderTab
                    ? _this.renderTab(tab, _this.props, index)
                    : tabRender
                        ? tabRender(tab, _this.props, index)
                        : render("tab/".concat(index), ((_a = tab) === null || _a === void 0 ? void 0 : _a.type) ? tab : tab.tab || tab.body))) : null;
            });
        }
        return (react_1.default.createElement(Tabs_1.Tabs, { addBtnText: __(addBtnText || 'add'), classPrefix: ns, classnames: cx, mode: mode, className: tabClassname, contentClassName: contentClassName, linksClassName: linksClassName, activeKey: this.state.activeKey, onSelect: this.handleSelect, toolbar: this.renderToolbar(), additionBtns: this.renderDesc(), scrollable: scrollable }, children));
    };
    Portlet.prototype.render = function () {
        var _a;
        var _b = this.props, className = _b.className, data = _b.data, cx = _b.classnames, ns = _b.classPrefix, style = _b.style, hideHeader = _b.hideHeader;
        var portletClassname = cx("".concat(ns, "Portlet"), className, (_a = {},
            _a['no-header'] = hideHeader,
            _a));
        var styleVar = typeof style === 'string'
            ? (0, tpl_builtin_1.resolveVariable)(style, data) || {}
            : (0, mapValues_1.default)(style, function (s) { return (0, tpl_builtin_1.resolveVariable)(s, data) || s; });
        return (react_1.default.createElement("div", { className: portletClassname, style: styleVar }, this.renderTabs()));
    };
    Portlet.defaultProps = {
        className: '',
        mode: 'line',
        divider: true
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Number]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Portlet.prototype, "handleSelect", null);
    return Portlet;
}(react_1.default.Component));
exports.Portlet = Portlet;
var PortletRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(PortletRenderer, _super);
    function PortletRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PortletRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'portlet'
        })
    ], PortletRenderer);
    return PortletRenderer;
}(Portlet));
exports.PortletRenderer = PortletRenderer;
//# sourceMappingURL=./renderers/Portlet.js.map
