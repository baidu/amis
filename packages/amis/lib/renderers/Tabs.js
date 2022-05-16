"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TabsRenderer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var factory_1 = require("../factory");
var find_1 = (0, tslib_1.__importDefault)(require("lodash/find"));
var helper_1 = require("../utils/helper");
var findIndex_1 = (0, tslib_1.__importDefault)(require("lodash/findIndex"));
var Tabs_1 = require("../components/Tabs");
var tpl_1 = require("../utils/tpl");
var tpl_builtin_1 = require("../utils/tpl-builtin");
var api_1 = require("../utils/api");
var Scoped_1 = require("../Scoped");
var Tabs = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Tabs, _super);
    function Tabs(props) {
        var _this = _super.call(this, props) || this;
        _this.newTabDefaultId = 3;
        var location = props.location || window.location;
        var tabs = props.tabs, source = props.source, data = props.data;
        var activeKey = 0;
        if (typeof props.activeKey !== 'undefined') {
            activeKey = props.activeKey;
        }
        else if (location && Array.isArray(tabs)) {
            var hash_1 = location.hash.substring(1);
            var tab = (0, find_1.default)(tabs, function (tab) { return tab.hash === hash_1; });
            if (tab) {
                activeKey = tab.hash;
            }
            else if (props.defaultActiveKey) {
                activeKey = (0, tpl_builtin_1.tokenize)(props.defaultActiveKey, props.data);
            }
            activeKey = activeKey || (tabs[0] && tabs[0].hash) || 0;
        }
        var _a = _this.initTabArray(tabs, source, data), localTabs = _a[0], isFromSource = _a[1];
        _this.state = {
            prevKey: undefined,
            activeKey: (_this.activeKey = activeKey),
            localTabs: localTabs,
            isFromSource: isFromSource
        };
        return _this;
    }
    // 初始化 tabs 数组，当从 source 获取数据源时
    Tabs.prototype.initTabArray = function (tabs, source, data) {
        if (!tabs) {
            return [[], false];
        }
        var arr = (0, tpl_builtin_1.resolveVariableAndFilter)(source, data, '| raw');
        if (!Array.isArray(arr)) {
            return [tabs, false];
        }
        tabs = Array.isArray(tabs) ? tabs : [tabs];
        var sourceTabs = [];
        arr.forEach(function (value, index) {
            var ctx = (0, helper_1.createObject)(data, (0, helper_1.isObject)(value) ? (0, tslib_1.__assign)({ index: index }, value) : { item: value, index: index });
            sourceTabs.push.apply(sourceTabs, tabs.map(function (tab) { return ((0, tslib_1.__assign)((0, tslib_1.__assign)({}, tab), { ctx: ctx })); }));
        });
        return [sourceTabs, true];
    };
    Tabs.prototype.componentDidMount = function () {
        var _a, _b;
        this.autoJumpToNeighbour(this.activeKey);
        var _c = this.props, name = _c.name, value = _c.value, onChange = _c.onChange, source = _c.source, tabs = _c.tabs, data = _c.data;
        var localTabs = this.state.localTabs;
        // 如果没有配置 name ，说明不需要同步表单值
        if (!name ||
            typeof onChange !== 'function' ||
            // 如果关联某个变量数据，则不启用
            source) {
            return;
        }
        value = value !== null && value !== void 0 ? value : (0, helper_1.getVariable)(data, name);
        //  如果有值，切到对应的 tab
        if (value && Array.isArray(localTabs)) {
            var key = this.resolveKeyByValue(value);
            key !== undefined && this.handleSelect(key);
        }
        else {
            var tab = this.resolveTabByKey(this.activeKey);
            if (tab && value !== ((_a = tab.value) !== null && _a !== void 0 ? _a : tab.title)) {
                onChange((_b = tab.value) !== null && _b !== void 0 ? _b : tab.title, name);
            }
        }
    };
    Tabs.prototype.componentDidUpdate = function (preProps, prevState) {
        var _a, _b, _c;
        var props = this.props;
        var localTabs = this.state.localTabs;
        // 响应外部修改 tabs
        var isTabsModified = (0, helper_1.isObjectShallowModified)({
            tabs: props.tabs,
            source: (0, tpl_builtin_1.resolveVariableAndFilter)(props.source, props.data, '| raw')
        }, {
            tabs: preProps.tabs,
            source: (0, tpl_builtin_1.resolveVariableAndFilter)(preProps.source, preProps.data, '| raw')
        }, false);
        if (isTabsModified) {
            var _d = this.initTabArray(props.tabs, props.source, props.data), newLocalTabs = _d[0], isFromSource = _d[1];
            this.setState({
                localTabs: newLocalTabs,
                isFromSource: isFromSource
            });
            localTabs = newLocalTabs;
        }
        if (props.location &&
            preProps.location &&
            props.location.hash !== preProps.location.hash) {
            var hash_2 = props.location.hash.substring(1);
            if (!hash_2) {
                return;
            }
            var tab = (0, find_1.default)(localTabs, function (tab) { return tab.hash === hash_2; });
            if (tab && tab.hash && tab.hash !== this.state.activeKey) {
                this.setState({
                    activeKey: (this.activeKey = tab.hash),
                    prevKey: this.state.activeKey
                });
            }
        }
        else if (Array.isArray(localTabs) &&
            Array.isArray(prevState.localTabs) &&
            JSON.stringify(localTabs.map(function (item) { return item.hash; })) !==
                JSON.stringify(prevState.localTabs.map(function (item) { return item.hash; }))) {
            var activeKey_1 = this.state.activeKey;
            var location = props.location;
            var tab = null;
            if (location && Array.isArray(localTabs)) {
                var hash_3 = location.hash.substring(1);
                tab = (0, find_1.default)(localTabs, function (tab) { return tab.hash === hash_3; });
            }
            if (tab) {
                activeKey_1 = tab.hash;
            }
            else if (!localTabs ||
                !localTabs.some(function (item, index) {
                    return item.hash ? item.hash === activeKey_1 : index === activeKey_1;
                })) {
                activeKey_1 = (localTabs && localTabs[0] && localTabs[0].hash) || 0;
            }
            this.setState({
                prevKey: undefined,
                activeKey: (this.activeKey = activeKey_1)
            });
        }
        this.autoJumpToNeighbour(this.activeKey);
        var _e = this.props, name = _e.name, value = _e.value, onChange = _e.onChange, source = _e.source, data = _e.data;
        // 如果没有配置 name ，说明不需要同步表单值
        if (!name ||
            typeof onChange !== 'function' ||
            // 如果关联某个变量数据，则不启用
            source) {
            return;
        }
        var key;
        value = value !== null && value !== void 0 ? value : (0, helper_1.getVariable)(data, name);
        var prevValue = (_a = preProps.value) !== null && _a !== void 0 ? _a : (0, helper_1.getVariable)(preProps.data, preProps.name);
        if (value !== prevValue &&
            (key = this.resolveKeyByValue(value)) !== undefined &&
            key !== this.activeKey) {
            this.handleSelect(key);
        }
        else if (this.activeKey !== prevState.activeKey) {
            var tab = this.resolveTabByKey(this.activeKey);
            if (tab && value !== ((_b = tab.value) !== null && _b !== void 0 ? _b : tab.title)) {
                onChange((_c = tab.value) !== null && _c !== void 0 ? _c : tab.title, name);
            }
        }
    };
    Tabs.prototype.resolveTabByKey = function (key) {
        var localTabs = this.state.localTabs;
        if (!Array.isArray(localTabs)) {
            return;
        }
        return (0, find_1.default)(localTabs, function (tab, index) {
            return tab.hash ? tab.hash === key : index === key;
        });
    };
    Tabs.prototype.resolveKeyByValue = function (value) {
        var localTabs = this.state.localTabs;
        if (!Array.isArray(localTabs)) {
            return;
        }
        var tab = (0, find_1.default)(localTabs, function (tab) { var _a; return ((_a = tab.value) !== null && _a !== void 0 ? _a : tab.title) === value; });
        return tab && tab.hash ? tab.hash : localTabs.indexOf(tab);
    };
    Tabs.prototype.autoJumpToNeighbour = function (key) {
        var _a = this.props, tabs = _a.tabs, data = _a.data;
        var localTabs = this.state.localTabs;
        if (!Array.isArray(localTabs)) {
            return;
        }
        // 当前 tab 可能不可见，所以需要自动切到一个可见的 tab, 向前找，找一圈
        var tabIndex = (0, findIndex_1.default)(localTabs, function (tab, index) {
            return tab.hash ? tab.hash === key : index === key;
        });
        if (localTabs[tabIndex] &&
            !(0, helper_1.isVisible)(localTabs[tabIndex], this.props.data)) {
            var len = localTabs.length;
            var i = tabIndex - 1 + len;
            var tries = len - 1;
            while (tries--) {
                var index = i-- % len;
                if ((0, helper_1.isVisible)(localTabs[index], data)) {
                    var activeKey = localTabs[index].hash || index;
                    this.setState({
                        activeKey: (this.activeKey = activeKey)
                    });
                    break;
                }
            }
        }
    };
    Tabs.prototype.handleAdd = function () {
        var _this = this;
        var localTabs = this.state.localTabs.concat();
        localTabs.push({
            title: "tab".concat(this.newTabDefaultId++),
            body: 'tab'
        });
        this.setState({
            localTabs: localTabs
        }, function () {
            _this.switchTo(_this.state.localTabs.length - 1);
        });
    };
    Tabs.prototype.handleClose = function (index, key) {
        var originTabs = this.state.localTabs.concat();
        originTabs.splice(index, 1);
        this.setState({
            localTabs: originTabs
        });
    };
    Tabs.prototype.handleEdit = function (index, text) {
        var originTabs = this.state.localTabs.concat();
        originTabs[index].title = text;
        this.setState({
            localTabs: originTabs
        });
    };
    Tabs.prototype.handleDragChange = function (e) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var activeTab, originTabs;
            var _this = this;
            return (0, tslib_1.__generator)(this, function (_a) {
                activeTab = this.resolveTabByKey(this.activeKey);
                originTabs = this.state.localTabs.concat();
                originTabs.splice(e.newIndex, 0, originTabs.splice(e.oldIndex, 1)[0]);
                this.setState({
                    localTabs: originTabs
                }, function () {
                    if (activeTab) {
                        var newActiveTabIndex = originTabs.indexOf(activeTab);
                        _this.switchTo(newActiveTabIndex);
                    }
                });
                return [2 /*return*/];
            });
        });
    };
    Tabs.prototype.handleSelect = function (key) {
        var _a;
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var _b, dispatchEvent, data, env, onSelect, id, localTabs, tab, rendererEvent, selectFunc;
            return (0, tslib_1.__generator)(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = this.props, dispatchEvent = _b.dispatchEvent, data = _b.data, env = _b.env, onSelect = _b.onSelect, id = _b.id;
                        localTabs = this.state.localTabs;
                        (_a = env.tracker) === null || _a === void 0 ? void 0 : _a.call(env, {
                            eventType: 'tabChange',
                            eventData: {
                                id: id,
                                key: key
                            }
                        });
                        tab = localTabs === null || localTabs === void 0 ? void 0 : localTabs.find(function (item, index) { return key === (item.hash ? item.hash : index); });
                        return [4 /*yield*/, dispatchEvent('change', (0, helper_1.createObject)(data, {
                                value: (tab === null || tab === void 0 ? void 0 : tab.hash) ? tab === null || tab === void 0 ? void 0 : tab.hash : key + 1
                            }))];
                    case 1:
                        rendererEvent = _c.sent();
                        if (rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented) {
                            return [2 /*return*/];
                        }
                        // 是 hash，需要更新到地址栏
                        if (typeof key === 'string' && env) {
                            env.updateLocation("#".concat(key));
                        }
                        else if (typeof this.state.activeKey === 'string' && env) {
                            env.updateLocation("#");
                        }
                        this.setState({
                            activeKey: (this.activeKey = key),
                            prevKey: this.state.activeKey
                        });
                        if (typeof onSelect === 'string') {
                            selectFunc = (0, api_1.str2AsyncFunction)(onSelect, 'key', 'props');
                            selectFunc && selectFunc(key, this.props);
                        }
                        else if (typeof onSelect === 'function') {
                            onSelect(key, this.props);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 动作处理
     */
    Tabs.prototype.doAction = function (action, args) {
        var actionType = action === null || action === void 0 ? void 0 : action.actionType;
        var activeKey = args === null || args === void 0 ? void 0 : args.activeKey;
        // 处理非用户自定义key
        if (typeof (args === null || args === void 0 ? void 0 : args.activeKey) !== 'string') {
            activeKey--;
        }
        if (actionType === 'changeActiveKey') {
            this.handleSelect(activeKey);
        }
    };
    Tabs.prototype.switchTo = function (index) {
        var localTabs = this.state.localTabs;
        Array.isArray(localTabs) &&
            localTabs[index] &&
            this.setState({
                activeKey: (this.activeKey = localTabs[index].hash || index)
            });
    };
    Tabs.prototype.currentIndex = function () {
        var _this = this;
        // const {tabs} = this.props;
        var localTabs = this.state.localTabs;
        return Array.isArray(localTabs)
            ? (0, findIndex_1.default)(localTabs, function (tab, index) {
                return tab.hash
                    ? tab.hash === _this.state.activeKey
                    : index === _this.state.activeKey;
            })
            : -1;
    };
    Tabs.prototype.renderToolbar = function () {
        var _a = this.props, toolbar = _a.toolbar, render = _a.render, cx = _a.classnames, toolbarClassName = _a.toolbarClassName;
        return toolbar ? (react_1.default.createElement("div", { className: cx("Tabs-toolbar", toolbarClassName) }, render('toolbar', toolbar))) : null;
    };
    Tabs.prototype.renderTabs = function () {
        var _this = this;
        var _a = this.props, cx = _a.classnames, ns = _a.classPrefix, contentClassName = _a.contentClassName, linksClassName = _a.linksClassName, tabRender = _a.tabRender, className = _a.className, render = _a.render, data = _a.data, dMode = _a.mode, tabsMode = _a.tabsMode, unmountOnExit = _a.unmountOnExit, source = _a.source, formStore = _a.formStore, formMode = _a.formMode, formHorizontal = _a.formHorizontal, subFormMode = _a.subFormMode, subFormHorizontal = _a.subFormHorizontal, addable = _a.addable, closable = _a.closable, draggable = _a.draggable, showTip = _a.showTip, showTipClassName = _a.showTipClassName, editable = _a.editable, sidePosition = _a.sidePosition, __ = _a.translate, addBtnText = _a.addBtnText;
        var mode = tabsMode || dMode;
        var mountOnEnter = this.props.mountOnEnter;
        // 如果在form下面，其他tabs默认需要渲染出来
        // 否则在其他 tab 下面的必填项检测不到
        if (formStore) {
            mountOnEnter = false;
        }
        var _b = this.state, tabs = _b.localTabs, isFromSource = _b.isFromSource;
        var children = [];
        // 是否从 source 数据中生成
        if (isFromSource) {
            children = tabs.map(function (tab, index) {
                var _a;
                return (0, helper_1.isVisible)(tab, tab.ctx) ? (react_1.default.createElement(Tabs_1.Tab, (0, tslib_1.__assign)({}, tab, { title: (0, tpl_1.filter)(tab.title, tab.ctx), disabled: (0, helper_1.isDisabled)(tab, tab.ctx), key: index, eventKey: index, mountOnEnter: mountOnEnter, unmountOnExit: typeof tab.reload === 'boolean'
                        ? tab.reload
                        : typeof tab.unmountOnExit === 'boolean'
                            ? tab.unmountOnExit
                            : unmountOnExit }), render("item/".concat(index), ((_a = tab) === null || _a === void 0 ? void 0 : _a.type) ? tab : tab.tab || tab.body, {
                    data: tab.ctx,
                    formMode: tab.mode || subFormMode || formMode,
                    formHorizontal: tab.horizontal || subFormHorizontal || formHorizontal
                }))) : null;
            });
        }
        else {
            children = tabs.map(function (tab, index) {
                var _a;
                return (0, helper_1.isVisible)(tab, data) ? (react_1.default.createElement(Tabs_1.Tab, (0, tslib_1.__assign)({}, tab, { title: (0, tpl_1.filter)(tab.title, data), disabled: (0, helper_1.isDisabled)(tab, data), key: index, eventKey: tab.hash || index, mountOnEnter: mountOnEnter, unmountOnExit: typeof tab.reload === 'boolean'
                        ? tab.reload
                        : typeof tab.unmountOnExit === 'boolean'
                            ? tab.unmountOnExit
                            : unmountOnExit }), _this.renderTab
                    ? _this.renderTab(tab, _this.props, index)
                    : tabRender
                        ? tabRender(tab, _this.props, index)
                        : render("tab/".concat(index), ((_a = tab) === null || _a === void 0 ? void 0 : _a.type) ? tab : tab.tab || tab.body, {
                            formMode: tab.mode || subFormMode || formMode,
                            formHorizontal: tab.horizontal || subFormHorizontal || formHorizontal
                        }))) : null;
            });
        }
        return (react_1.default.createElement(Tabs_1.Tabs, { addBtnText: __(addBtnText || 'add'), classPrefix: ns, classnames: cx, mode: mode, closable: closable, className: className, contentClassName: contentClassName, linksClassName: linksClassName, onSelect: this.handleSelect, activeKey: this.state.activeKey, toolbar: this.renderToolbar(), addable: addable, onAdd: this.handleAdd, onClose: this.handleClose, draggable: draggable, onDragChange: this.handleDragChange, showTip: showTip, showTipClassName: showTipClassName, editable: editable, onEdit: this.handleEdit, sidePosition: sidePosition }, children));
    };
    Tabs.prototype.render = function () {
        return this.renderTabs();
    };
    var _a;
    Tabs.defaultProps = {
        className: '',
        mode: '',
        mountOnEnter: true,
        unmountOnExit: false
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof Array !== "undefined" && Array) === "function" ? _a : Object, String, Object]),
        (0, tslib_1.__metadata)("design:returntype", Array)
    ], Tabs.prototype, "initTabArray", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Tabs.prototype, "autoJumpToNeighbour", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Tabs.prototype, "handleAdd", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Number, Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Tabs.prototype, "handleClose", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Number, String]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Tabs.prototype, "handleEdit", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", Promise)
    ], Tabs.prototype, "handleDragChange", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", Promise)
    ], Tabs.prototype, "handleSelect", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Number]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Tabs.prototype, "switchTo", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", Number)
    ], Tabs.prototype, "currentIndex", null);
    return Tabs;
}(react_1.default.Component));
exports.default = Tabs;
var TabsRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(TabsRenderer, _super);
    function TabsRenderer(props, context) {
        var _this = _super.call(this, props) || this;
        var scoped = context;
        scoped.registerComponent(_this);
        return _this;
    }
    TabsRenderer.prototype.componentWillUnmount = function () {
        var _a;
        (_a = _super.prototype.componentWillUnmount) === null || _a === void 0 ? void 0 : _a.call(this);
        var scoped = this.context;
        scoped.unRegisterComponent(this);
    };
    var _b;
    TabsRenderer.contextType = Scoped_1.ScopedContext;
    TabsRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'tabs'
        }),
        (0, tslib_1.__metadata)("design:paramtypes", [Object, typeof (_b = typeof Scoped_1.IScopedContext !== "undefined" && Scoped_1.IScopedContext) === "function" ? _b : Object])
    ], TabsRenderer);
    return TabsRenderer;
}(Tabs));
exports.TabsRenderer = TabsRenderer;
//# sourceMappingURL=./renderers/Tabs.js.map
