"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceRenderer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var factory_1 = require("../factory");
var service_1 = require("../store/service");
var types_1 = require("../types");
var tpl_1 = require("../utils/tpl");
var Scoped_1 = require("../Scoped");
var api_1 = require("../utils/api");
var components_1 = require("../components");
var helper_1 = require("../utils/helper");
var Service = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Service, _super);
    function Service(props) {
        var _this = _super.call(this, props) || this;
        _this.handleQuery = _this.handleQuery.bind(_this);
        _this.handleAction = _this.handleAction.bind(_this);
        _this.handleChange = _this.handleChange.bind(_this);
        _this.reload = _this.reload.bind(_this);
        _this.silentReload = _this.silentReload.bind(_this);
        _this.initInterval = _this.initInterval.bind(_this);
        _this.afterDataFetch = _this.afterDataFetch.bind(_this);
        _this.afterSchemaFetch = _this.afterSchemaFetch.bind(_this);
        _this.runDataProvider = _this.runDataProvider.bind(_this);
        _this.dataProviderSetData = _this.dataProviderSetData.bind(_this);
        return _this;
    }
    Service.prototype.componentDidMount = function () {
        this.mounted = true;
        this.initFetch();
    };
    Service.prototype.componentDidUpdate = function (prevProps) {
        var props = this.props;
        var store = props.store;
        var _a = props.messages, fetchSuccess = _a.fetchSuccess, fetchFailed = _a.fetchFailed;
        (0, api_1.isApiOutdated)(prevProps.api, props.api, prevProps.data, props.data) &&
            store
                .fetchData(props.api, store.data, {
                successMessage: fetchSuccess,
                errorMessage: fetchFailed
            })
                .then(this.afterDataFetch);
        (0, api_1.isApiOutdated)(prevProps.schemaApi, props.schemaApi, prevProps.data, props.data) &&
            store
                .fetchSchema(props.schemaApi, store.data, {
                successMessage: fetchSuccess,
                errorMessage: fetchFailed
            })
                .then(this.afterSchemaFetch);
        if (props.ws && prevProps.ws !== props.ws) {
            if (this.socket) {
                this.socket.close();
            }
            this.socket = this.fetchWSData(props.ws, store.data);
        }
        if ((0, helper_1.isObjectShallowModified)(prevProps.defaultData, props.defaultData)) {
            store.reInitData(props.defaultData);
        }
        if (props.dataProvider !== prevProps.dataProvider) {
            this.runDataProvider();
        }
    };
    Service.prototype.componentWillUnmount = function () {
        this.mounted = false;
        this.runDataProviderUnsubscribe();
        clearTimeout(this.timer);
        if (this.socket && this.socket.close) {
            this.socket.close();
        }
    };
    Service.prototype.doAction = function (action, args) {
        if ((action === null || action === void 0 ? void 0 : action.actionType) === 'rebuild') {
            var _a = this.props, schemaApi = _a.schemaApi, store = _a.store, dataProvider = _a.dataProvider, _b = _a.messages, fetchSuccess = _b.fetchSuccess, fetchFailed = _b.fetchFailed;
            store.updateData(args);
            clearTimeout(this.timer);
            if ((0, api_1.isEffectiveApi)(schemaApi, store.data)) {
                store
                    .fetchSchema(schemaApi, store.data, {
                    successMessage: fetchSuccess,
                    errorMessage: fetchFailed
                })
                    .then(this.afterSchemaFetch);
            }
            if (dataProvider) {
                this.runDataProvider();
            }
        }
    };
    Service.prototype.initFetch = function () {
        var _a = this.props, schemaApi = _a.schemaApi, initFetchSchema = _a.initFetchSchema, api = _a.api, ws = _a.ws, initFetch = _a.initFetch, initFetchOn = _a.initFetchOn, dataProvider = _a.dataProvider, store = _a.store, _b = _a.messages, fetchSuccess = _b.fetchSuccess, fetchFailed = _b.fetchFailed;
        if ((0, api_1.isEffectiveApi)(schemaApi, store.data, initFetchSchema)) {
            store
                .fetchSchema(schemaApi, store.data, {
                successMessage: fetchSuccess,
                errorMessage: fetchFailed
            })
                .then(this.afterSchemaFetch);
        }
        if ((0, api_1.isEffectiveApi)(api, store.data, initFetch, initFetchOn)) {
            store
                .fetchInitData(api, store.data, {
                successMessage: fetchSuccess,
                errorMessage: fetchFailed
            })
                .then(this.afterDataFetch);
        }
        if (ws) {
            this.socket = this.fetchWSData(ws, store.data);
        }
        if (dataProvider) {
            this.runDataProvider();
        }
    };
    // 使用外部函数获取数据
    Service.prototype.runDataProvider = function () {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var _a, dataProvider, store, dataProviderFunc, unsubscribe;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.runDataProviderUnsubscribe();
                        _a = this.props, dataProvider = _a.dataProvider, store = _a.store;
                        dataProviderFunc = dataProvider;
                        if (typeof dataProvider === 'string' && dataProvider) {
                            dataProviderFunc = (0, api_1.str2AsyncFunction)(dataProvider, 'data', 'setData', 'env');
                        }
                        if (!(typeof dataProviderFunc === 'function')) return [3 /*break*/, 2];
                        return [4 /*yield*/, dataProviderFunc(store.data, this.dataProviderSetData, this.props.env)];
                    case 1:
                        unsubscribe = _b.sent();
                        if (typeof unsubscribe === 'function') {
                            this.dataProviderUnsubscribe = unsubscribe;
                        }
                        _b.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    // 运行销毁外部函数的方法
    Service.prototype.runDataProviderUnsubscribe = function () {
        if (typeof this.dataProviderUnsubscribe === 'function') {
            try {
                this.dataProviderUnsubscribe();
            }
            catch (error) {
                console.error(error);
            }
        }
    };
    // 外部函数回调更新数据
    Service.prototype.dataProviderSetData = function (data) {
        if (!this.mounted) {
            return;
        }
        var store = this.props.store;
        store.updateData(data, undefined, false);
        store.setHasRemoteData();
    };
    // 使用 websocket 获取使用，因为有异步所以放这里而不是 store 实现
    Service.prototype.fetchWSData = function (ws, data) {
        var _this = this;
        var _a = this.props, env = _a.env, store = _a.store;
        var wsApi = (0, api_1.buildApi)(ws, data);
        env.wsFetcher(wsApi, function (data) {
            var returndata = data;
            if ('status' in data && 'data' in data) {
                returndata = data.data;
                if (data.status !== 0) {
                    store.updateMessage(data.msg, true);
                    env.notify('error', data.msg);
                    return;
                }
            }
            store.updateData(returndata, undefined, false);
            store.setHasRemoteData();
            // 因为 WebSocket 只会获取纯数据，所以没有 msg 之类的
            _this.afterDataFetch({ ok: true, data: returndata });
        }, function (error) {
            store.updateMessage(error, true);
            env.notify('error', error);
        });
    };
    Service.prototype.afterDataFetch = function (result) {
        // todo 应该统一这块
        // 初始化接口返回的是整个 response，
        // 保存 ajax 请求的时候返回时数据部分。
        var data = (result === null || result === void 0 ? void 0 : result.hasOwnProperty('ok')) ? result.data : result;
        var _a = this.props, onBulkChange = _a.onBulkChange, dispatchEvent = _a.dispatchEvent;
        dispatchEvent === null || dispatchEvent === void 0 ? void 0 : dispatchEvent('fetchInited', data);
        if (!(0, helper_1.isEmpty)(data) && onBulkChange) {
            onBulkChange(data);
        }
        this.initInterval(data);
    };
    Service.prototype.afterSchemaFetch = function (schema) {
        var _a = this.props, onBulkChange = _a.onBulkChange, formStore = _a.formStore, dispatchEvent = _a.dispatchEvent;
        dispatchEvent === null || dispatchEvent === void 0 ? void 0 : dispatchEvent('fetchSchemaInited', schema);
        if (formStore && (schema === null || schema === void 0 ? void 0 : schema.data) && onBulkChange) {
            onBulkChange && onBulkChange(schema.data);
        }
        this.initInterval(schema);
    };
    Service.prototype.initInterval = function (value) {
        var _a = this.props, interval = _a.interval, silentPolling = _a.silentPolling, stopAutoRefreshWhen = _a.stopAutoRefreshWhen, data = _a.data;
        clearTimeout(this.timer);
        interval &&
            this.mounted &&
            (!stopAutoRefreshWhen || !(0, tpl_1.evalExpression)(stopAutoRefreshWhen, data)) &&
            (this.timer = setTimeout(silentPolling ? this.silentReload : this.reload, Math.max(interval, 1000)));
        return value;
    };
    Service.prototype.reload = function (subpath, query, ctx, silent) {
        if (query) {
            return this.receive(query);
        }
        var _a = this.props, schemaApi = _a.schemaApi, initFetchSchema = _a.initFetchSchema, api = _a.api, initFetch = _a.initFetch, initFetchOn = _a.initFetchOn, store = _a.store, dataProvider = _a.dataProvider, _b = _a.messages, fetchSuccess = _b.fetchSuccess, fetchFailed = _b.fetchFailed;
        clearTimeout(this.timer);
        if ((0, api_1.isEffectiveApi)(schemaApi, store.data)) {
            store
                .fetchSchema(schemaApi, store.data, {
                successMessage: fetchSuccess,
                errorMessage: fetchFailed
            })
                .then(this.afterSchemaFetch);
        }
        if ((0, api_1.isEffectiveApi)(api, store.data)) {
            store
                .fetchData(api, store.data, {
                silent: silent,
                successMessage: fetchSuccess,
                errorMessage: fetchFailed
            })
                .then(this.afterDataFetch);
        }
        if (dataProvider) {
            this.runDataProvider();
        }
    };
    Service.prototype.silentReload = function (target, query) {
        this.reload(target, query, undefined, true);
    };
    Service.prototype.receive = function (values) {
        var store = this.props.store;
        store.updateData(values);
        this.reload();
    };
    Service.prototype.handleQuery = function (query) {
        var _a, _b;
        if (this.props.api || this.props.schemaApi) {
            this.receive(query);
        }
        else {
            (_b = (_a = this.props).onQuery) === null || _b === void 0 ? void 0 : _b.call(_a, query);
        }
    };
    Service.prototype.reloadTarget = function (target, data) {
        // 会被覆写
    };
    Service.prototype.handleDialogConfirm = function (values, action, ctx, targets) {
        var store = this.props.store;
        store.closeDialog(true);
    };
    Service.prototype.handleDialogClose = function (confirmed) {
        if (confirmed === void 0) { confirmed = false; }
        var store = this.props.store;
        store.closeDialog(confirmed);
    };
    Service.prototype.openFeedback = function (dialog, ctx) {
        var _this = this;
        return new Promise(function (resolve) {
            var store = _this.props.store;
            store.setCurrentAction({
                type: 'button',
                actionType: 'dialog',
                dialog: dialog
            });
            store.openDialog(ctx, undefined, function (confirmed) {
                resolve(confirmed);
            });
        });
    };
    Service.prototype.handleAction = function (e, action, data, throwErrors, delegate) {
        var _this = this;
        if (throwErrors === void 0) { throwErrors = false; }
        var _a = this.props, onAction = _a.onAction, store = _a.store, env = _a.env, api = _a.api, __ = _a.translate;
        if (api && action.actionType === 'ajax') {
            store.setCurrentAction(action);
            store
                .saveRemote(action.api, data, {
                successMessage: __(action.messages && action.messages.success),
                errorMessage: __(action.messages && action.messages.failed)
            })
                .then(function (payload) { return (0, tslib_1.__awaiter)(_this, void 0, void 0, function () {
                var redirect;
                return (0, tslib_1.__generator)(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.afterDataFetch(payload);
                            if (!(action.feedback && (0, helper_1.isVisible)(action.feedback, store.data))) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.openFeedback(action.feedback, store.data)];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2:
                            redirect = action.redirect && (0, tpl_1.filter)(action.redirect, store.data);
                            redirect && env.jumpTo(redirect, action);
                            action.reload && this.reloadTarget(action.reload, store.data);
                            return [2 /*return*/];
                    }
                });
            }); })
                .catch(function (e) {
                if (throwErrors || action.countDown) {
                    throw e;
                }
            });
        }
        else {
            onAction(e, action, data, throwErrors, delegate || this.context);
        }
    };
    Service.prototype.handleChange = function (value, name, submit, changePristine) {
        var _a, _b;
        var _c = this.props, store = _c.store, formStore = _c.formStore, onChange = _c.onChange;
        // form 触发的 onChange,直接忽略
        if (typeof name !== 'string') {
            return;
        }
        (_b = (_a = store).changeValue) === null || _b === void 0 ? void 0 : _b.call(_a, name, value);
        // 如果在form底下，则继续向上派送。
        formStore && (onChange === null || onChange === void 0 ? void 0 : onChange(value, name, submit, changePristine));
    };
    Service.prototype.renderBody = function () {
        var _a = this.props, render = _a.render, store = _a.store, schema = _a.body, cx = _a.classnames;
        return render('body', store.schema || schema, {
            key: store.schemaKey || 'body',
            onQuery: this.handleQuery,
            onAction: this.handleAction,
            onChange: this.handleChange
        });
    };
    Service.prototype.render = function () {
        var _a = this.props, className = _a.className, store = _a.store, render = _a.render, ns = _a.classPrefix, cx = _a.classnames;
        return (react_1.default.createElement("div", { className: cx("".concat(ns, "Service"), className) },
            store.error ? (react_1.default.createElement("div", { className: cx("Alert Alert--danger") },
                react_1.default.createElement("button", { className: cx('Alert-close'), onClick: function () { return store.updateMessage(''); }, type: "button" },
                    react_1.default.createElement("span", null, "\u00D7")),
                store.msg)) : null,
            this.renderBody(),
            react_1.default.createElement(components_1.Spinner, { size: "lg", overlay: true, key: "info", show: store.loading }),
            render(
            // 单独给 feedback 服务的，handleAction 里面先不要处理弹窗
            'modal', (0, tslib_1.__assign)((0, tslib_1.__assign)({}, (store.action &&
                store.action.dialog)), { type: 'dialog' }), {
                key: 'dialog',
                data: store.dialogData,
                onConfirm: this.handleDialogConfirm,
                onClose: this.handleDialogClose,
                show: store.dialogOpen
            })));
    };
    var _a, _b;
    Service.defaultProps = {
        messages: {
            fetchFailed: 'fetchFailed'
        }
    };
    Service.propsList = [];
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Service.prototype, "initFetch", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Array, typeof (_a = typeof types_1.Action !== "undefined" && types_1.Action) === "function" ? _a : Object, Object, typeof (_b = typeof Array !== "undefined" && Array) === "function" ? _b : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Service.prototype, "handleDialogConfirm", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Service.prototype, "handleDialogClose", null);
    return Service;
}(react_1.default.Component));
exports.default = Service;
var ServiceRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(ServiceRenderer, _super);
    function ServiceRenderer(props, context) {
        var _this = _super.call(this, props) || this;
        var scoped = context;
        scoped.registerComponent(_this);
        return _this;
    }
    ServiceRenderer.prototype.reload = function (subpath, query, ctx, silent) {
        var scoped = this.context;
        if (subpath) {
            return scoped.reload(query ? "".concat(subpath, "?").concat((0, helper_1.qsstringify)(query)) : subpath, ctx);
        }
        return _super.prototype.reload.call(this, subpath, query, ctx, silent);
    };
    ServiceRenderer.prototype.receive = function (values, subPath) {
        var scoped = this.context;
        if (subPath) {
            return scoped.send(subPath, values);
        }
        return _super.prototype.receive.call(this, values);
    };
    ServiceRenderer.prototype.componentWillUnmount = function () {
        _super.prototype.componentWillUnmount.call(this);
        var scoped = this.context;
        scoped.unRegisterComponent(this);
    };
    ServiceRenderer.prototype.reloadTarget = function (target, data) {
        var scoped = this.context;
        scoped.reload(target, data);
    };
    ServiceRenderer.prototype.setData = function (values) {
        return this.props.store.updateData(values);
    };
    var _c;
    ServiceRenderer.contextType = Scoped_1.ScopedContext;
    ServiceRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'service',
            storeType: service_1.ServiceStore.name,
            isolateScope: true,
            storeExtendsData: function (props) { return (props.formStore ? false : true); }
        }),
        (0, tslib_1.__metadata)("design:paramtypes", [Object, typeof (_c = typeof Scoped_1.IScopedContext !== "undefined" && Scoped_1.IScopedContext) === "function" ? _c : Object])
    ], ServiceRenderer);
    return ServiceRenderer;
}(Service));
exports.ServiceRenderer = ServiceRenderer;
//# sourceMappingURL=./renderers/Service.js.map
