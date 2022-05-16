"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withRemoteConfig = exports.Store = void 0;
var tslib_1 = require("tslib");
/**
 * 一个可以拉取远程配置的 HOC
 *
 */
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var hoist_non_react_statics_1 = (0, tslib_1.__importDefault)(require("hoist-non-react-statics"));
var debounce_1 = (0, tslib_1.__importDefault)(require("lodash/debounce"));
var WithStore_1 = require("./WithStore");
var env_1 = require("../env");
var mobx_state_tree_1 = require("mobx-state-tree");
var api_1 = require("../utils/api");
var tpl_builtin_1 = require("../utils/tpl-builtin");
var mobx_1 = require("mobx");
var helper_1 = require("../utils/helper");
exports.Store = mobx_state_tree_1.types
    .model('RemoteConfigStore')
    .props({
    fetching: false,
    errorMsg: '',
    config: mobx_state_tree_1.types.frozen(),
    data: mobx_state_tree_1.types.frozen({})
})
    .actions(function (self) {
    var component = undefined;
    var load = (0, mobx_state_tree_1.flow)(function (env, api, ctx, config) {
        var ret, data, options, e_1;
        var _a;
        if (config === void 0) { config = {}; }
        return (0, tslib_1.__generator)(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, 3, 4]);
                    self.fetching = true;
                    return [4 /*yield*/, env.fetcher(api, ctx)];
                case 1:
                    ret = _b.sent();
                    if (!(0, mobx_state_tree_1.isAlive)(self)) {
                        return [2 /*return*/];
                    }
                    if (ret.ok) {
                        data = (0, api_1.normalizeApiResponseData)(ret.data);
                        options = config.adaptor
                            ? config.adaptor(data, component.props)
                            : data;
                        self.setConfig(options, config, 'remote');
                        (_a = config.afterLoad) === null || _a === void 0 ? void 0 : _a.call(config, data, self.config, component.props);
                        return [2 /*return*/, ret];
                    }
                    else {
                        throw new Error(ret.msg || 'fetch error');
                    }
                    return [3 /*break*/, 4];
                case 2:
                    e_1 = _b.sent();
                    (0, mobx_state_tree_1.isAlive)(self) && (self.errorMsg = e_1.message);
                    return [3 /*break*/, 4];
                case 3:
                    (0, mobx_state_tree_1.isAlive)(self) && (self.fetching = false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    });
    return {
        setComponent: function (c) {
            component = c;
        },
        load: load,
        setData: function (data) {
            self.data = data || {};
        },
        setConfig: function (options, config, motivation) {
            if (config.normalizeConfig) {
                options =
                    config.normalizeConfig(options, self.config, component.props, motivation) || options;
            }
            self.config = options;
        }
    };
});
function withRemoteConfig(config) {
    if (config === void 0) { config = {}; }
    return function (ComposedComponent) {
        var _a;
        var result = (0, hoist_non_react_statics_1.default)((0, WithStore_1.withStore)(function () { return exports.Store.create(); })((_a = /** @class */ (function (_super) {
                (0, tslib_1.__extends)(class_1, _super);
                function class_1(props) {
                    var _a;
                    var _this = _super.call(this, props) || this;
                    _this.toDispose = [];
                    _this.loadOptions = (0, debounce_1.default)(_this.loadAutoComplete.bind(_this), 250, {
                        trailing: true,
                        leading: false
                    });
                    _this.setConfig = _this.setConfig.bind(_this);
                    props.store.setComponent(_this);
                    _this.deferLoadConfig = _this.deferLoadConfig.bind(_this);
                    (_a = props.remoteConfigRef) === null || _a === void 0 ? void 0 : _a.call(props, _this);
                    props.store.setData(props.data);
                    _this.syncConfig();
                    return _this;
                }
                class_1.prototype.componentDidMount = function () {
                    var _this = this;
                    var env = this.props.env || this.context;
                    var _a = this.props, store = _a.store, data = _a.data;
                    var source = this.props[config.sourceField || 'source'];
                    if ((0, tpl_builtin_1.isPureVariable)(source)) {
                        this.toDispose.push((0, mobx_1.reaction)(function () {
                            return (0, tpl_builtin_1.resolveVariableAndFilter)(source, store.data, '| raw');
                        }, function () { return _this.syncConfig(); }));
                    }
                    else if (env && (0, api_1.isEffectiveApi)(source, data)) {
                        this.loadConfig();
                        source.autoRefresh !== false &&
                            this.toDispose.push((0, mobx_1.reaction)(function () {
                                var api = (0, api_1.normalizeApi)(source);
                                return api.trackExpression
                                    ? (0, tpl_builtin_1.tokenize)(api.trackExpression, store.data)
                                    : (0, api_1.buildApi)(api, store.data, {
                                        ignoreData: true
                                    }).url;
                            }, function () { return _this.loadConfig(); }));
                    }
                };
                class_1.prototype.componentDidUpdate = function (prevProps) {
                    var props = this.props;
                    if (props.data !== prevProps.data) {
                        props.store.setData(props.data);
                    }
                };
                class_1.prototype.componentWillUnmount = function () {
                    var _a, _b;
                    this.toDispose.forEach(function (fn) { return fn(); });
                    this.toDispose = [];
                    (_b = (_a = this.props).remoteConfigRef) === null || _b === void 0 ? void 0 : _b.call(_a, undefined);
                    this.loadOptions.cancel();
                };
                class_1.prototype.loadConfig = function (ctx) {
                    if (ctx === void 0) { ctx = this.props.data; }
                    return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
                        var env, store, source;
                        return (0, tslib_1.__generator)(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    env = this.props.env || this.context;
                                    store = this.props.store;
                                    source = this.props[config.sourceField || 'source'];
                                    if (!(env && (0, api_1.isEffectiveApi)(source, ctx))) return [3 /*break*/, 2];
                                    return [4 /*yield*/, store.load(env, source, ctx, config)];
                                case 1:
                                    _a.sent();
                                    _a.label = 2;
                                case 2: return [2 /*return*/];
                            }
                        });
                    });
                };
                class_1.prototype.loadAutoComplete = function (input) {
                    var env = this.props.env || this.context;
                    var _a = this.props, autoComplete = _a.autoComplete, data = _a.data, store = _a.store;
                    if (!env || !env.fetcher) {
                        throw new Error('fetcher is required');
                    }
                    var ctx = (0, helper_1.createObject)(data, {
                        term: input,
                        value: input
                    });
                    if (!(0, api_1.isEffectiveApi)(autoComplete, ctx)) {
                        return Promise.resolve({
                            options: []
                        });
                    }
                    return store.load(env, autoComplete, ctx, config);
                };
                class_1.prototype.setConfig = function (value, ctx) {
                    var store = this.props.store;
                    store.setConfig(value, config, ctx);
                };
                class_1.prototype.syncConfig = function () {
                    var _a = this.props, store = _a.store, data = _a.data;
                    var source = this.props[config.sourceField || 'source'];
                    if ((0, tpl_builtin_1.isPureVariable)(source)) {
                        store.setConfig((0, tpl_builtin_1.resolveVariableAndFilter)(source, data, '| raw') || [], config, 'syncConfig');
                    }
                    else if ((0, helper_1.isObject)(source) && !(0, api_1.isEffectiveApi)(source, data)) {
                        store.setConfig(source, config, 'syncConfig');
                    }
                };
                class_1.prototype.deferLoadConfig = function (item) {
                    var _a, _b;
                    return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
                        var _c, store, data, deferApi, source, env, indexes, ret, response, e_2, ret2;
                        return (0, tslib_1.__generator)(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    _c = this.props, store = _c.store, data = _c.data, deferApi = _c.deferApi;
                                    source = this.props[config.sourceField || 'source'];
                                    env = this.props.env || this.context;
                                    indexes = (0, helper_1.findTreeIndex)(store.config, function (a) { return a === item; });
                                    ret = (_a = config.beforeDeferLoad) === null || _a === void 0 ? void 0 : _a.call(config, item, indexes, store.config, this.props);
                                    ret && store.setConfig(ret, config, 'before-defer-load');
                                    _d.label = 1;
                                case 1:
                                    _d.trys.push([1, 3, , 4]);
                                    if (!(0, api_1.isEffectiveApi)(item.deferApi || deferApi || source)) {
                                        throw new Error('deferApi is required');
                                    }
                                    return [4 /*yield*/, env.fetcher(item.deferApi || deferApi || source, (0, helper_1.createObject)(data, item))];
                                case 2:
                                    response = _d.sent();
                                    return [3 /*break*/, 4];
                                case 3:
                                    e_2 = _d.sent();
                                    response = {
                                        ok: false,
                                        msg: e_2.message,
                                        status: 500,
                                        data: undefined
                                    };
                                    return [3 /*break*/, 4];
                                case 4:
                                    ret2 = (_b = config.afterDeferLoad) === null || _b === void 0 ? void 0 : _b.call(config, item, indexes, // 只能假定还是那个 index 了
                                    response, store.config, this.props);
                                    ret2 && store.setConfig(ret2, config, 'after-defer-load');
                                    return [2 /*return*/];
                            }
                        });
                    });
                };
                class_1.prototype.render = function () {
                    var store = this.props.store;
                    var env = this.props.env || this.context;
                    var injectedProps = {
                        config: store.config,
                        loading: store.fetching,
                        deferLoad: this.deferLoadConfig,
                        updateConfig: this.setConfig
                    };
                    var _a = this.props, remoteConfigRef = _a.remoteConfigRef, autoComplete = _a.autoComplete, rest = (0, tslib_1.__rest)(_a, ["remoteConfigRef", "autoComplete"]);
                    return (react_1.default.createElement(ComposedComponent, (0, tslib_1.__assign)({}, rest, (env && (0, api_1.isEffectiveApi)(autoComplete) && this.loadOptions
                        ? { loadOptions: this.loadOptions }
                        : {}), (config.injectedPropsFilter
                        ? config.injectedPropsFilter(injectedProps, this.props)
                        : injectedProps))));
                };
                return class_1;
            }(react_1.default.Component)),
            _a.displayName = "WithRemoteConfig(".concat(ComposedComponent.displayName || ComposedComponent.name, ")"),
            _a.ComposedComponent = ComposedComponent,
            _a.contextType = env_1.EnvContext,
            _a)), ComposedComponent);
        return result;
    };
}
exports.withRemoteConfig = withRemoteConfig;
//# sourceMappingURL=./components/WithRemoteConfig.js.map
