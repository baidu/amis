"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HocStoreFactory = void 0;
var tslib_1 = require("tslib");
var hoist_non_react_statics_1 = (0, tslib_1.__importDefault)(require("hoist-non-react-statics"));
var mobx_react_1 = require("mobx-react");
var mobx_state_tree_1 = require("mobx-state-tree");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var filter_schema_1 = (0, tslib_1.__importDefault)(require("./utils/filter-schema"));
var helper_1 = require("./utils/helper");
var tpl_builtin_1 = require("./utils/tpl-builtin");
var WithRootStore_1 = require("./WithRootStore");
function HocStoreFactory(renderer) {
    return function (Component) {
        var StoreFactory = /** @class */ (function (_super) {
            (0, tslib_1.__extends)(StoreFactory, _super);
            function StoreFactory(props, context) {
                var _this = _super.call(this, props) || this;
                var rootStore = context;
                _this.renderChild = _this.renderChild.bind(_this);
                _this.refFn = _this.refFn.bind(_this);
                var store = rootStore.addStore({
                    id: (0, helper_1.guid)(),
                    path: _this.props.$path,
                    storeType: renderer.storeType,
                    parentId: _this.props.store ? _this.props.store.id : ''
                });
                _this.store = store;
                var extendsData = typeof renderer.extendsData === 'function'
                    ? renderer.extendsData(props)
                    : renderer.extendsData;
                if (extendsData === false) {
                    store.initData((0, helper_1.createObject)(_this.props.data
                        ? _this.props.data.__super
                        : null, (0, tslib_1.__assign)((0, tslib_1.__assign)({}, _this.formatData((0, tpl_builtin_1.dataMapping)(_this.props.defaultData, _this.props.data))), _this.formatData(_this.props.data))));
                }
                else if (_this.props.scope ||
                    (_this.props.data && _this.props.data.__super)) {
                    if (_this.props.store && _this.props.data === _this.props.store.data) {
                        store.initData((0, helper_1.createObject)(_this.props.store.data, (0, tslib_1.__assign)({}, _this.formatData((0, tpl_builtin_1.dataMapping)(_this.props.defaultData, _this.props.data)))));
                    }
                    else {
                        store.initData((0, helper_1.createObject)(_this.props.data.__super || _this.props.scope, (0, tslib_1.__assign)((0, tslib_1.__assign)({}, _this.formatData((0, tpl_builtin_1.dataMapping)(_this.props.defaultData, _this.props.data))), _this.formatData(_this.props.data))));
                    }
                }
                else {
                    store.initData((0, tslib_1.__assign)((0, tslib_1.__assign)({}, _this.formatData((0, tpl_builtin_1.dataMapping)(_this.props.defaultData, _this.props.data))), _this.formatData(_this.props.data)));
                }
                return _this;
            }
            StoreFactory.prototype.getWrappedInstance = function () {
                return this.ref;
            };
            StoreFactory.prototype.refFn = function (ref) {
                this.ref = ref;
            };
            StoreFactory.prototype.formatData = function (data) {
                if (Array.isArray(data)) {
                    return {
                        items: data
                    };
                }
                return data;
            };
            StoreFactory.prototype.componentDidUpdate = function (prevProps) {
                var _a, _b;
                var props = this.props;
                var store = this.store;
                var shouldSync = (_a = renderer.shouldSyncSuperStore) === null || _a === void 0 ? void 0 : _a.call(renderer, store, props, prevProps);
                if (shouldSync === false) {
                    return;
                }
                var extendsData = typeof renderer.extendsData === 'function'
                    ? renderer.extendsData(props)
                    : renderer.extendsData;
                if (extendsData === false) {
                    if (shouldSync === true ||
                        prevProps.defaultData !== props.defaultData ||
                        (0, helper_1.isObjectShallowModified)(prevProps.data, props.data) ||
                        //
                        // 特殊处理 CRUD。
                        // CRUD 中 toolbar 里面的 data 是空对象，但是 __super 会不一样
                        (props.data &&
                            prevProps.data &&
                            props.data.__super !== prevProps.data.__super)) {
                        store.initData((0, helper_1.extendObject)(props.data, (0, tslib_1.__assign)((0, tslib_1.__assign)((0, tslib_1.__assign)({}, (store.hasRemoteData ? store.data : null)), this.formatData(props.defaultData)), this.formatData(props.data))));
                    }
                }
                else if (shouldSync === true ||
                    (0, helper_1.isObjectShallowModified)(prevProps.data, props.data) ||
                    (props.syncSuperStore !== false &&
                        (0, helper_1.isSuperDataModified)(props.data, prevProps.data, store))) {
                    if (props.store && props.store.data === props.data) {
                        store.initData((0, helper_1.createObject)(props.store.data, props.syncSuperStore === false
                            ? (0, tslib_1.__assign)({}, store.data) : (0, helper_1.syncDataFromSuper)(store.data, props.store.data, prevProps.scope, store, props.syncSuperStore === true)));
                    }
                    else if (props.data && props.data.__super) {
                        store.initData((0, helper_1.extendObject)(props.data, store.hasRemoteData || store.path === 'page'
                            ? (0, tslib_1.__assign)((0, tslib_1.__assign)({}, store.data), props.data) : undefined));
                    }
                    else {
                        store.initData((0, helper_1.createObject)(props.scope, props.data));
                    }
                }
                else if ((shouldSync === true ||
                    !props.store ||
                    props.data !== props.store.data) &&
                    props.data &&
                    props.data.__super) {
                    // 这个用法很少，当 data.__super 值发生变化时，更新 store.data
                    if (!prevProps.data ||
                        (0, helper_1.isObjectShallowModified)(props.data.__super, prevProps.data.__super, false)) {
                        store.initData((0, helper_1.createObject)(props.data.__super, (0, tslib_1.__assign)((0, tslib_1.__assign)({}, props.data), store.data)), store.storeType === 'FormStore' &&
                            ((_b = prevProps.store) === null || _b === void 0 ? void 0 : _b.storeType) === 'CRUDStore');
                    }
                    // nextProps.data.__super !== props.data.__super) &&
                }
                else if (props.scope &&
                    props.data === props.store.data &&
                    (shouldSync === true || prevProps.data !== props.data)) {
                    // 只有父级数据变动的时候才应该进来，
                    // 目前看来这个 case 很少有情况下能进来
                    store.initData((0, helper_1.createObject)(props.scope, (0, tslib_1.__assign)({}, store.data)));
                }
            };
            StoreFactory.prototype.componentWillUnmount = function () {
                var rootStore = this.context;
                var store = this.store;
                (0, mobx_state_tree_1.isAlive)(store) && rootStore.removeStore(store);
                // @ts-ignore
                delete this.store;
            };
            StoreFactory.prototype.renderChild = function (region, node, subProps) {
                if (subProps === void 0) { subProps = {}; }
                var render = this.props.render;
                return render(region, node, (0, tslib_1.__assign)((0, tslib_1.__assign)({ data: this.store.data, dataUpdatedAt: this.store.updatedAt }, subProps), { scope: this.store.data, store: this.store }));
            };
            StoreFactory.prototype.render = function () {
                var _a = this.props, detectField = _a.detectField, rest = (0, tslib_1.__rest)(_a, ["detectField"]);
                var exprProps = {};
                if (!detectField || detectField === 'data') {
                    exprProps = (0, filter_schema_1.default)(rest, this.store.data, undefined, rest);
                    if (exprProps.hidden || exprProps.visible === false) {
                        return null;
                    }
                }
                return (react_1.default.createElement(Component, (0, tslib_1.__assign)({}, rest /* todo */, exprProps, { ref: this.refFn, data: this.store.data, dataUpdatedAt: this.store.updatedAt, store: this.store, scope: this.store.data, render: this.renderChild })));
            };
            var _a;
            StoreFactory.displayName = "WithStore(".concat(Component.displayName || Component.name, ")");
            StoreFactory.ComposedComponent = Component;
            StoreFactory.contextType = WithRootStore_1.RootStoreContext;
            StoreFactory = (0, tslib_1.__decorate)([
                mobx_react_1.observer,
                (0, tslib_1.__metadata)("design:paramtypes", [Object, typeof (_a = typeof react_1.default !== "undefined" && react_1.default.ContextType) === "function" ? _a : Object])
            ], StoreFactory);
            return StoreFactory;
        }(react_1.default.Component));
        (0, hoist_non_react_statics_1.default)(StoreFactory, Component);
        return StoreFactory;
    };
}
exports.HocStoreFactory = HocStoreFactory;
//# sourceMappingURL=./WithStore.js.map
