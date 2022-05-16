"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreNode = void 0;
var mobx_state_tree_1 = require("mobx-state-tree");
var manager_1 = require("./manager");
exports.StoreNode = mobx_state_tree_1.types
    .model('StoreNode', {
    id: mobx_state_tree_1.types.identifier,
    path: '',
    storeType: mobx_state_tree_1.types.string,
    disposed: false,
    parentId: '',
    childrenIds: mobx_state_tree_1.types.optional(mobx_state_tree_1.types.array(mobx_state_tree_1.types.string), [])
})
    .views(function (self) {
    return {
        get parentStore() {
            return (0, mobx_state_tree_1.isAlive)(self) && self.parentId
                ? (0, manager_1.getStoreById)(self.parentId)
                : null;
        },
        get __() {
            return (0, mobx_state_tree_1.getEnv)(self).translate;
        },
        get hasChildren() {
            return !!self.childrenIds.length;
        },
        get children() {
            return self.childrenIds.map(function (item) { return (0, manager_1.getStoreById)(item); });
        }
    };
})
    .actions(function (self) {
    function addChildId(id) {
        self.childrenIds.push(id);
    }
    function removeChildId(id) {
        var childrenIds = self.childrenIds.filter(function (item) { return item !== id; });
        self.childrenIds.replace(childrenIds);
        self.disposed && dispose();
    }
    function dispose(callback) {
        var _a;
        // 先标记自己是要销毁的。
        self.disposed = true;
        if (/(?:dialog|drawer)$/.test(self.path)) {
            (0, mobx_state_tree_1.destroy)(self);
            callback === null || callback === void 0 ? void 0 : callback();
        }
        else if (!self.childrenIds.length) {
            var parent = self.parentStore;
            (_a = parent === null || parent === void 0 ? void 0 : parent.onChildStoreDispose) === null || _a === void 0 ? void 0 : _a.call(parent, self);
            (0, mobx_state_tree_1.destroy)(self);
            callback === null || callback === void 0 ? void 0 : callback();
            // destroy(self);
        }
    }
    return {
        onChildStoreDispose: function (child) {
            removeChildId(child.id);
        },
        syncProps: function (props, prevProps, list) {
            if (list === void 0) { list = Object.keys(props); }
            var target = self;
            list.forEach(function (key) {
                if (prevProps && props[key] === prevProps[key]) {
                    return;
                }
                var setter = "set".concat(key
                    .substring(0, 1)
                    .toUpperCase()).concat(key.substring(1));
                if (typeof target[setter] === 'function') {
                    target[setter](props[key]);
                }
                else if (target.hasOwnProperty(key)) {
                    target[key] = props[key];
                }
            });
        },
        dispose: dispose,
        addChildId: addChildId,
        removeChildId: removeChildId
    };
});
//# sourceMappingURL=./store/node.js.map
