"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStores = exports.getStoreById = exports.removeStore = exports.addStore = void 0;
var mobx_state_tree_1 = require("mobx-state-tree");
var stores = {};
function addStore(store) {
    if (stores[store.id]) {
        return stores[store.id];
    }
    stores[store.id] = store;
    // drawer dialog 不加进去，否则有些容器就不会自我销毁 store 了。
    if (store.parentId && !/(?:dialog|drawer)$/.test(store.path)) {
        var parent = stores[store.parentId];
        parent.addChildId(store.id);
    }
    cleanUp();
    return store;
}
exports.addStore = addStore;
var toDelete = [];
function removeStore(store) {
    var id = store.id;
    toDelete.push(id);
    store.dispose(cleanUp);
}
exports.removeStore = removeStore;
function cleanUp() {
    var index = toDelete.length - 1;
    while (index >= 0) {
        var id = toDelete[index];
        var store = stores[id];
        if (store && !(0, mobx_state_tree_1.isAlive)(store)) {
            delete stores[id];
            toDelete.splice(index, 1);
        }
        else {
            index--;
        }
    }
}
function getStoreById(id) {
    return stores[id];
}
exports.getStoreById = getStoreById;
function getStores() {
    return stores;
}
exports.getStores = getStores;
//# sourceMappingURL=./store/manager.js.map
