"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterStore = exports.IIRendererStore = exports.iRendererStore = exports.RendererStore = void 0;
var tslib_1 = require("tslib");
var mobx_state_tree_1 = require("mobx-state-tree");
var iRenderer_1 = require("./iRenderer");
Object.defineProperty(exports, "iRendererStore", { enumerable: true, get: function () { return iRenderer_1.iRendererStore; } });
Object.defineProperty(exports, "IIRendererStore", { enumerable: true, get: function () { return iRenderer_1.IIRendererStore; } });
var service_1 = require("./service");
var combo_1 = require("./combo");
var form_1 = require("./form");
var crud_1 = require("./crud");
var table_1 = require("./table");
var table_v2_1 = require("./table-v2");
var list_1 = require("./list");
var modal_1 = require("./modal");
var find_1 = (0, tslib_1.__importDefault)(require("lodash/find"));
var formItem_1 = require("./formItem");
var manager_1 = require("./manager");
var pagination_1 = require("./pagination");
var app_1 = require("./app");
var root_1 = require("./root");
(0, mobx_state_tree_1.setLivelynessChecking)(process.env.NODE_ENV === 'production' ? 'ignore' : 'error');
var allowedStoreList = [
    service_1.ServiceStore,
    form_1.FormStore,
    combo_1.ComboStore,
    crud_1.CRUDStore,
    table_1.TableStore,
    table_v2_1.TableStoreV2,
    list_1.ListStore,
    modal_1.ModalStore,
    formItem_1.FormItemStore,
    pagination_1.PaginationStore,
    app_1.AppStore
];
exports.RendererStore = mobx_state_tree_1.types
    .model('RendererStore', {
    storeType: 'RendererStore'
})
    .props({
    visibleState: mobx_state_tree_1.types.optional(mobx_state_tree_1.types.frozen(), {}),
    disableState: mobx_state_tree_1.types.optional(mobx_state_tree_1.types.frozen(), {})
})
    .views(function (self) { return ({
    get fetcher() {
        return (0, mobx_state_tree_1.getEnv)(self).fetcher;
    },
    get notify() {
        return (0, mobx_state_tree_1.getEnv)(self).notify;
    },
    get isCancel() {
        return (0, mobx_state_tree_1.getEnv)(self).isCancel;
    },
    get __() {
        return (0, mobx_state_tree_1.getEnv)(self).translate;
    },
    getStoreById: function (id) {
        return (0, manager_1.getStoreById)(id);
    },
    get stores() {
        return (0, manager_1.getStores)();
    }
}); })
    .actions(function (self) { return ({
    addStore: function (store) {
        if (store.storeType === root_1.RootStore.name) {
            return (0, manager_1.addStore)(root_1.RootStore.create(store, (0, mobx_state_tree_1.getEnv)(self)));
        }
        var factory = (0, find_1.default)(allowedStoreList, function (item) { return item.name === store.storeType; });
        return (0, manager_1.addStore)(factory.create(store, (0, mobx_state_tree_1.getEnv)(self)));
    },
    removeStore: function (store) {
        // store.dispose();
        (0, manager_1.removeStore)(store);
    },
    setVisible: function (id, value) {
        var _a;
        var state = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, self.visibleState), (_a = {}, _a[id] = value, _a));
        self.visibleState = state;
    },
    setDisable: function (id, value) {
        var _a;
        var state = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, self.disableState), (_a = {}, _a[id] = value, _a));
        self.disableState = state;
    }
}); });
var RegisterStore = function (store) {
    allowedStoreList.push(store);
};
exports.RegisterStore = RegisterStore;
//# sourceMappingURL=./store/index.js.map
