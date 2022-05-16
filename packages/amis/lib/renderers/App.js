"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppRenderer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var components_1 = require("../components");
var Layout_1 = (0, tslib_1.__importDefault)(require("../components/Layout"));
var factory_1 = require("../factory");
var Scoped_1 = require("../Scoped");
var app_1 = require("../store/app");
var api_1 = require("../utils/api");
var helper_1 = require("../utils/helper");
var icon_1 = require("../utils/icon");
var App = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(App, _super);
    function App(props) {
        var _this = _super.call(this, props) || this;
        var store = props.store;
        store.syncProps(props, undefined, ['pages']);
        store.updateActivePage(props.env);
        if (props.env.watchRouteChange) {
            _this.unWatchRouteChange = props.env.watchRouteChange(function () {
                return store.updateActivePage(props.env);
            });
        }
        return _this;
    }
    App.prototype.componentDidMount = function () {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            return (0, tslib_1.__generator)(this, function (_a) {
                this.reload();
                return [2 /*return*/];
            });
        });
    };
    App.prototype.componentDidUpdate = function (prevProps) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var props, store;
            return (0, tslib_1.__generator)(this, function (_a) {
                props = this.props;
                store = props.store;
                store.syncProps(props, prevProps, ['pages']);
                if ((0, api_1.isApiOutdated)(prevProps.api, props.api, prevProps.data, props.data)) {
                    this.reload();
                }
                else if (props.location && props.location !== prevProps.location) {
                    store.updateActivePage(props.env);
                }
                return [2 /*return*/];
            });
        });
    };
    App.prototype.componentWillUnmount = function () {
        var _a;
        (_a = this.unWatchRouteChange) === null || _a === void 0 ? void 0 : _a.call(this);
    };
    App.prototype.reload = function (subpath, query, ctx, silent) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var _a, api, store, env, json;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (query) {
                            return [2 /*return*/, this.receive(query)];
                        }
                        _a = this.props, api = _a.api, store = _a.store, env = _a.env;
                        if (!(0, api_1.isEffectiveApi)(api, store.data)) return [3 /*break*/, 2];
                        return [4 /*yield*/, store.fetchInitData(api, store.data, {})];
                    case 1:
                        json = _b.sent();
                        if (json === null || json === void 0 ? void 0 : json.data.pages) {
                            store.setPages(json.data.pages);
                            store.updateActivePage(env);
                        }
                        _b.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    App.prototype.receive = function (values) {
        var store = this.props.store;
        store.updateData(values);
        this.reload();
    };
    App.prototype.handleNavClick = function (e) {
        e.preventDefault();
        var env = this.props.env;
        var link = e.currentTarget.getAttribute('href');
        env.jumpTo(link);
    };
    App.prototype.renderHeader = function () {
        var _a = this.props, cx = _a.classnames, brandName = _a.brandName, header = _a.header, render = _a.render, store = _a.store, logo = _a.logo;
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement("div", { className: cx('Layout-brandBar') },
                react_1.default.createElement("div", { onClick: store.toggleOffScreen, className: cx('Layout-offScreenBtn') },
                    react_1.default.createElement("i", { className: "bui-icon iconfont icon-collapse" })),
                react_1.default.createElement("div", { className: cx('Layout-brand') },
                    logo && ~logo.indexOf('<svg') ? (react_1.default.createElement(components_1.Html, { className: cx('AppLogo-html'), html: logo })) : logo ? (react_1.default.createElement("img", { className: cx('AppLogo'), src: logo })) : null,
                    react_1.default.createElement("span", { className: "hidden-folded m-l-sm" }, brandName))),
            react_1.default.createElement("div", { className: cx('Layout-headerBar') },
                react_1.default.createElement("a", { onClick: store.toggleFolded, type: "button", className: cx('AppFoldBtn') },
                    react_1.default.createElement("i", { className: "fa fa-".concat(store.folded ? 'indent' : 'dedent', " fa-fw") })),
                header ? render('header', header) : null)));
    };
    App.prototype.renderAside = function () {
        var _this = this;
        var _a = this.props, store = _a.store, env = _a.env, asideBefore = _a.asideBefore, asideAfter = _a.asideAfter, render = _a.render;
        return (react_1.default.createElement(react_1.default.Fragment, null,
            asideBefore ? render('aside-before', asideBefore) : null,
            react_1.default.createElement(components_1.AsideNav, { navigations: store.navigations, renderLink: function (_a, key) {
                    var link = _a.link, active = _a.active, toggleExpand = _a.toggleExpand, cx = _a.classnames, depth = _a.depth, subHeader = _a.subHeader;
                    var children = [];
                    if (link.visible === false) {
                        return null;
                    }
                    if (!subHeader && link.children && link.children.length) {
                        children.push(react_1.default.createElement("span", { key: "expand-toggle", className: cx('AsideNav-itemArrow'), onClick: function (e) { return toggleExpand(link, e); } }));
                    }
                    link.badge &&
                        children.push(react_1.default.createElement("b", { key: "badge", className: cx("AsideNav-itemBadge", link.badgeClassName || 'bg-info') }, link.badge));
                    if (!subHeader && link.icon) {
                        children.push((0, icon_1.generateIcon)(cx, link.icon, 'AsideNav-itemIcon'));
                    }
                    else if (store.folded && depth === 1 && !subHeader) {
                        children.push(react_1.default.createElement("i", { key: "icon", className: cx("AsideNav-itemIcon", link.children ? 'fa fa-folder' : 'fa fa-info') }));
                    }
                    children.push(react_1.default.createElement("span", { className: cx('AsideNav-itemLabel'), key: "label" }, link.label));
                    return link.path ? (/^https?\:/.test(link.path) ? (react_1.default.createElement("a", { target: "_blank", href: link.path, rel: "noopener" }, children)) : (react_1.default.createElement("a", { onClick: _this.handleNavClick, href: link.path || (link.children && link.children[0].path) }, children))) : (react_1.default.createElement("a", { onClick: link.children ? function () { return toggleExpand(link); } : undefined }, children));
                }, isActive: function (link) { return !!env.isCurrentUrl(link === null || link === void 0 ? void 0 : link.path, link); } }),
            asideAfter ? render('aside-before', asideAfter) : null));
    };
    App.prototype.renderFooter = function () {
        var _a = this.props, render = _a.render, footer = _a.footer;
        return footer ? render('footer', footer) : null;
    };
    App.prototype.render = function () {
        var _this = this;
        var _a;
        var _b = this.props, className = _b.className, size = _b.size, cx = _b.classnames, store = _b.store, render = _b.render;
        return (react_1.default.createElement(Layout_1.default, { header: this.renderHeader(), aside: this.renderAside(), footer: this.renderFooter(), folded: store.folded, offScreen: store.offScreen },
            store.activePage && store.schema ? (react_1.default.createElement(react_1.default.Fragment, null,
                store.bcn.length ? (react_1.default.createElement("ul", { className: cx('AppBcn') }, store.bcn.map(function (item, index) {
                    return (react_1.default.createElement("li", { key: index, className: cx('AppBcn-item') }, item.path ? (react_1.default.createElement("a", { href: item.path, onClick: _this.handleNavClick }, item.label)) : (item.label)));
                }))) : null,
                render('page', store.schema, {
                    key: "".concat((_a = store.activePage) === null || _a === void 0 ? void 0 : _a.id, "-").concat(store.schemaKey),
                    data: store.pageData
                }))) : store.pages && !store.activePage ? (react_1.default.createElement(components_1.NotFound, null,
                react_1.default.createElement("div", { className: "text-center" }, "\u9875\u9762\u4E0D\u5B58\u5728"))) : null,
            react_1.default.createElement(components_1.Spinner, { overlay: true, show: store.loading || !store.pages, size: "lg" })));
    };
    var _a;
    App.propsList = [
        'brandName',
        'logo',
        'header',
        'asideBefore',
        'asideAfter',
        'pages',
        'footer'
    ];
    App.defaultProps = {};
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof react_1.default !== "undefined" && react_1.default.MouseEvent) === "function" ? _a : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], App.prototype, "handleNavClick", null);
    return App;
}(react_1.default.Component));
exports.default = App;
var AppRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(AppRenderer, _super);
    function AppRenderer(props, context) {
        var _this = _super.call(this, props) || this;
        var scoped = context;
        scoped.registerComponent(_this);
        return _this;
    }
    AppRenderer.prototype.componentWillUnmount = function () {
        var scoped = this.context;
        scoped.unRegisterComponent(this);
        _super.prototype.componentWillUnmount.call(this);
    };
    AppRenderer.prototype.setData = function (values) {
        return this.props.store.updateData(values);
    };
    var _b;
    AppRenderer.contextType = Scoped_1.ScopedContext;
    AppRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'app',
            storeType: app_1.AppStore.name
        }),
        (0, tslib_1.__metadata)("design:paramtypes", [Object, typeof (_b = typeof Scoped_1.IScopedContext !== "undefined" && Scoped_1.IScopedContext) === "function" ? _b : Object])
    ], AppRenderer);
    return AppRenderer;
}(App));
exports.AppRenderer = AppRenderer;
//# sourceMappingURL=./renderers/App.js.map
