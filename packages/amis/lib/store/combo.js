"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComboStore = exports.UniqueGroup = void 0;
var mobx_state_tree_1 = require("mobx-state-tree");
var iRenderer_1 = require("./iRenderer");
var form_1 = require("./form");
var manager_1 = require("./manager");
exports.UniqueGroup = mobx_state_tree_1.types
    .model('UniqueGroup', {
    name: mobx_state_tree_1.types.identifier,
    itemsRef: mobx_state_tree_1.types.array(mobx_state_tree_1.types.string)
})
    .views(function (self) { return ({
    get items() {
        return self.itemsRef.map(function (id) { return (0, manager_1.getStoreById)(id); });
    }
}); })
    .actions(function (self) { return ({
    removeItem: function (item) {
        self.itemsRef.replace(self.itemsRef.filter(function (id) { return id !== item.id; }));
    },
    addItem: function (item) {
        self.itemsRef.push(item.id);
    }
}); });
exports.ComboStore = iRenderer_1.iRendererStore
    .named('ComboStore')
    .props({
    uniques: mobx_state_tree_1.types.map(exports.UniqueGroup),
    multiple: false,
    formsRef: mobx_state_tree_1.types.optional(mobx_state_tree_1.types.array(mobx_state_tree_1.types.string), []),
    minLength: 0,
    maxLength: 0,
    length: 0,
    activeKey: 0
})
    .views(function (self) {
    function getForms() {
        return self.formsRef.map(function (item) { return (0, manager_1.getStoreById)(item); });
    }
    return {
        get forms() {
            return getForms();
        },
        get addable() {
            if (self.maxLength && self.length >= self.maxLength) {
                return false;
            }
            if (self.uniques.size) {
                var isFull_1 = false;
                self.uniques.forEach(function (item) {
                    if (isFull_1 || !item.items.length) {
                        return;
                    }
                    var total = item.items[0].options.length;
                    var current = item.items.reduce(function (total, item) {
                        return total + item.selectedOptions.length;
                    }, 0);
                    isFull_1 = total && current >= total ? true : false;
                });
                if (isFull_1) {
                    return false;
                }
            }
            return true;
        },
        get removable() {
            if (self.minLength && self.minLength >= self.length) {
                return false;
            }
            return true;
        },
        /**
         * name 值有两种类型：
         * 1. 数字索引，出现在多条模式下，这个时候，需要返回当前索引下的form，并且用于下一层的遍历搜索
         * 2. 普通的表单项 name 值，出现在单条模式下，当前这层查找已经结束，所以要返回当前找到的items，而不能返回form
         *
         * @param name 查找的name
         */
        getItemsByName: function (name) {
            var forms = getForms();
            return self.multiple
                ? [forms[parseInt(name, 10)]]
                : forms[0].getItemsByName(name);
        }
    };
})
    .actions(function (self) {
    function config(setting) {
        typeof setting.multiple !== 'undefined' &&
            (self.multiple = setting.multiple);
        typeof setting.minLength !== 'undefined' &&
            (self.minLength = parseInt(setting.minLength, 10));
        typeof setting.maxLength !== 'undefined' &&
            (self.maxLength = parseInt(setting.maxLength, 10));
        typeof setting.length !== 'undefined' && (self.length = setting.length);
    }
    function bindUniuqueItem(item) {
        if (!self.uniques.has(item.name)) {
            self.uniques.put({
                name: item.name
            });
        }
        var group = self.uniques.get(item.name);
        group.addItem(item);
    }
    function unBindUniuqueItem(item) {
        var group = self.uniques.get(item.name);
        group.removeItem(item);
        if (!group.items.length) {
            self.uniques.delete(item.name);
        }
    }
    function addForm(form) {
        self.formsRef.push(form.id);
    }
    function onChildStoreDispose(child) {
        if (child.storeType === form_1.FormStore.name) {
            var idx = self.formsRef.indexOf(child.id);
            if (~idx) {
                self.formsRef.splice(idx, 1);
                child.items.forEach(function (item) {
                    if (item.unique) {
                        unBindUniuqueItem(item);
                    }
                });
                self.forms.forEach(function (form) {
                    return form.items.forEach(function (item) { return item.unique && item.syncOptions(undefined, form.data); });
                });
            }
        }
        self.removeChildId(child.id);
    }
    function setActiveKey(key) {
        self.activeKey = key;
    }
    return {
        config: config,
        setActiveKey: setActiveKey,
        bindUniuqueItem: bindUniuqueItem,
        unBindUniuqueItem: unBindUniuqueItem,
        addForm: addForm,
        onChildStoreDispose: onChildStoreDispose
    };
});
//# sourceMappingURL=./store/combo.js.map
