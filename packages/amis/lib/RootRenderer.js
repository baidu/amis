"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RootRenderer = void 0;
var tslib_1 = require("tslib");
var mobx_react_1 = require("mobx-react");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var Alert2_1 = (0, tslib_1.__importDefault)(require("./components/Alert2"));
var Spinner_1 = (0, tslib_1.__importDefault)(require("./components/Spinner"));
var Root_1 = require("./Root");
var Scoped_1 = require("./Scoped");
var root_1 = require("./store/root");
var helper_1 = require("./utils/helper");
var tpl_1 = require("./utils/tpl");
var qs_1 = (0, tslib_1.__importDefault)(require("qs"));
var pick_1 = (0, tslib_1.__importDefault)(require("lodash/pick"));
var mapValues_1 = (0, tslib_1.__importDefault)(require("lodash/mapValues"));
var RootRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(RootRenderer, _super);
    function RootRenderer(props) {
        var _this = _super.call(this, props) || this;
        _this.store = props.rootStore.addStore({
            id: (0, helper_1.guid)(),
            path: _this.props.$path,
            storeType: root_1.RootStore.name,
            parentId: ''
        });
        _this.store.initData(props.data);
        _this.store.updateLocation(props.location);
        (0, helper_1.bulkBindFunctions)(_this, [
            'handleAction',
            'handleDialogConfirm',
            'handleDialogClose',
            'handleDrawerConfirm',
            'handleDrawerClose',
            'handlePageVisibilityChange'
        ]);
        return _this;
    }
    RootRenderer.prototype.componentDidMount = function () {
        document.addEventListener('visibilitychange', this.handlePageVisibilityChange);
    };
    RootRenderer.prototype.componentDidUpdate = function (prevProps) {
        var props = this.props;
        if (props.data !== prevProps.data) {
            this.store.initData(props.data);
        }
        if (props.location !== prevProps.location) {
            this.store.updateLocation(props.location);
        }
    };
    RootRenderer.prototype.componentDidCatch = function (error, errorInfo) {
        this.store.setRuntimeError(error, errorInfo);
    };
    RootRenderer.prototype.componentWillUnmount = function () {
        this.props.rootStore.removeStore(this.store);
        document.removeEventListener('visibilitychange', this.handlePageVisibilityChange);
    };
    RootRenderer.prototype.handlePageVisibilityChange = function () {
        var env = this.props.env;
        if (document.visibilityState === 'hidden') {
            env === null || env === void 0 ? void 0 : env.tracker({
                eventType: 'pageHidden'
            });
        }
        else if (document.visibilityState === 'visible') {
            env === null || env === void 0 ? void 0 : env.tracker({
                eventType: 'pageVisible'
            });
        }
    };
    RootRenderer.prototype.handleAction = function (e, action, ctx, throwErrors, delegate) {
        var _this = this;
        var _a, _b;
        if (throwErrors === void 0) { throwErrors = false; }
        var _c = this.props, env = _c.env, messages = _c.messages, onAction = _c.onAction;
        var store = this.store;
        if ((onAction === null || onAction === void 0 ? void 0 : onAction(e, action, ctx, throwErrors, delegate || this.context)) ===
            false) {
            return;
        }
        var scoped = delegate || this.context;
        if (action.actionType === 'reload') {
            action.target && scoped.reload(action.target, ctx);
        }
        else if (action.target) {
            action.target.split(',').forEach(function (name) {
                var target = scoped.getComponentByName(name);
                target &&
                    target.doAction &&
                    target.doAction((0, tslib_1.__assign)((0, tslib_1.__assign)({}, action), { target: undefined }), ctx);
            });
        }
        else if (action.actionType === 'url' ||
            action.actionType === 'link' ||
            action.actionType === 'jump') {
            if (!env || !env.jumpTo) {
                throw new Error('env.jumpTo is required!');
            }
            env.jumpTo((0, tpl_1.filter)((action.to || action.url || action.link), ctx, '| raw'), action, ctx);
        }
        else if (action.actionType === 'email') {
            var mailTo = (0, tpl_1.filter)(action.to, ctx);
            var mailInfo = (0, mapValues_1.default)((0, pick_1.default)(action, 'to', 'cc', 'bcc', 'subject', 'body'), function (val) { return (0, tpl_1.filter)(val, ctx); });
            var mailStr = qs_1.default.stringify(mailInfo);
            var mailto = "mailto:".concat(mailTo, "?").concat(mailStr);
            window.open(mailto);
        }
        else if (action.actionType === 'dialog') {
            store.setCurrentAction(action);
            store.openDialog(ctx);
        }
        else if (action.actionType === 'drawer') {
            store.setCurrentAction(action);
            store.openDrawer(ctx);
        }
        else if (action.actionType === 'toast') {
            (_b = (_a = action.toast) === null || _a === void 0 ? void 0 : _a.items) === null || _b === void 0 ? void 0 : _b.forEach(function (item) {
                env.notify(item.level || 'info', item.body
                    ? (0, Root_1.renderChild)('body', item.body, (0, tslib_1.__assign)((0, tslib_1.__assign)({}, _this.props), { data: ctx }))
                    : '', (0, tslib_1.__assign)((0, tslib_1.__assign)((0, tslib_1.__assign)({}, action.toast), item), { title: item.title
                        ? (0, Root_1.renderChild)('title', item.title, (0, tslib_1.__assign)((0, tslib_1.__assign)({}, _this.props), { data: ctx }))
                        : null, useMobileUI: env.useMobileUI }));
            });
        }
        else if (action.actionType === 'ajax') {
            store.setCurrentAction(action);
            store
                .saveRemote(action.api, ctx, {
                successMessage: (action.messages && action.messages.success) ||
                    (messages && messages.saveSuccess),
                errorMessage: (action.messages && action.messages.failed) ||
                    (messages && messages.saveSuccess)
            })
                .then(function () { return (0, tslib_1.__awaiter)(_this, void 0, void 0, function () {
                var redirect;
                return (0, tslib_1.__generator)(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(action.feedback && (0, helper_1.isVisible)(action.feedback, store.data))) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.openFeedback(action.feedback, store.data)];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2:
                            redirect = action.redirect && (0, tpl_1.filter)(action.redirect, store.data);
                            redirect && env.jumpTo(redirect, action);
                            action.reload &&
                                this.reloadTarget(delegate || this.context, action.reload, store.data);
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
        else if (action.actionType === 'copy' &&
            (action.content || action.copy)) {
            env.copy &&
                env.copy((0, tpl_1.filter)(action.content || action.copy, ctx, '| raw'), {
                    format: action.copyFormat
                });
        }
    };
    RootRenderer.prototype.handleDialogConfirm = function (values, action) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var store = this.store;
        if (action.mergeData && values.length === 1 && values[0]) {
            store.updateData(values[0]);
        }
        var dialog = store.action.dialog;
        if (dialog &&
            dialog.onConfirm &&
            dialog.onConfirm.apply(dialog, (0, tslib_1.__spreadArray)([values, action], args, false)) === false) {
            return;
        }
        store.closeDialog(true);
    };
    RootRenderer.prototype.handleDialogClose = function (confirmed) {
        if (confirmed === void 0) { confirmed = false; }
        var store = this.store;
        store.closeDialog(confirmed);
    };
    RootRenderer.prototype.handleDrawerConfirm = function (values, action) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var store = this.store;
        if (action.mergeData && values.length === 1 && values[0]) {
            store.updateData(values[0]);
        }
        var drawer = store.action.drawer;
        if (drawer &&
            drawer.onConfirm &&
            drawer.onConfirm.apply(drawer, (0, tslib_1.__spreadArray)([values, action], args, false)) === false) {
            return;
        }
        store.closeDrawer();
    };
    RootRenderer.prototype.handleDrawerClose = function () {
        var store = this.store;
        store.closeDrawer();
    };
    RootRenderer.prototype.openFeedback = function (dialog, ctx) {
        var _this = this;
        return new Promise(function (resolve) {
            var store = _this.store;
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
    RootRenderer.prototype.reloadTarget = function (scoped, target, data) {
        scoped.reload(target, data);
    };
    RootRenderer.prototype.render = function () {
        var _a;
        var _b = this.props, pathPrefix = _b.pathPrefix, schema = _b.schema, rest = (0, tslib_1.__rest)(_b, ["pathPrefix", "schema"]);
        var store = this.store;
        if (store.runtimeError) {
            return (react_1.default.createElement(Alert2_1.default, { level: "danger" },
                react_1.default.createElement("h3", null, (_a = this.store.runtimeError) === null || _a === void 0 ? void 0 : _a.toString()),
                react_1.default.createElement("pre", null,
                    react_1.default.createElement("code", null, this.store.runtimeErrorStack.componentStack))));
        }
        return (react_1.default.createElement(react_1.default.Fragment, null,
            (0, Root_1.renderChild)(pathPrefix, schema, (0, tslib_1.__assign)((0, tslib_1.__assign)({}, rest), { data: this.store.downStream, onAction: this.handleAction })),
            react_1.default.createElement(Spinner_1.default, { size: "lg", overlay: true, key: "info", show: store.loading }),
            store.error ? (react_1.default.createElement(Alert2_1.default, { level: "danger", showCloseButton: true, onClose: store.clearMessage }, store.msg)) : null,
            (0, Root_1.renderChild)('dialog', (0, tslib_1.__assign)((0, tslib_1.__assign)({}, (store.action &&
                store.action.dialog)), { type: 'dialog' }), (0, tslib_1.__assign)((0, tslib_1.__assign)({}, rest), { key: 'dialog', data: store.dialogData, onConfirm: this.handleDialogConfirm, onClose: this.handleDialogClose, show: store.dialogOpen, onAction: this.handleAction })),
            (0, Root_1.renderChild)('drawer', (0, tslib_1.__assign)((0, tslib_1.__assign)({}, (store.action &&
                store.action.drawer)), { type: 'drawer' }), (0, tslib_1.__assign)((0, tslib_1.__assign)({}, rest), { key: 'drawer', data: store.drawerData, onConfirm: this.handleDrawerConfirm, onClose: this.handleDrawerClose, show: store.drawerOpen, onAction: this.handleAction }))));
    };
    RootRenderer.contextType = Scoped_1.ScopedContext;
    RootRenderer = (0, tslib_1.__decorate)([
        mobx_react_1.observer,
        (0, tslib_1.__metadata)("design:paramtypes", [Object])
    ], RootRenderer);
    return RootRenderer;
}(react_1.default.Component));
exports.RootRenderer = RootRenderer;
//# sourceMappingURL=./RootRenderer.js.map
