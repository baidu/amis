"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListStore = exports.Item = void 0;
var tslib_1 = require("tslib");
var mobx_state_tree_1 = require("mobx-state-tree");
var iRenderer_1 = require("./iRenderer");
var isEqual_1 = (0, tslib_1.__importDefault)(require("lodash/isEqual"));
var find_1 = (0, tslib_1.__importDefault)(require("lodash/find"));
var helper_1 = require("../utils/helper");
var tpl_1 = require("../utils/tpl");
exports.Item = mobx_state_tree_1.types
    .model('Item', {
    id: mobx_state_tree_1.types.identifier,
    pristine: mobx_state_tree_1.types.frozen(),
    data: mobx_state_tree_1.types.frozen(),
    index: mobx_state_tree_1.types.number,
    newIndex: mobx_state_tree_1.types.number
})
    .views(function (self) { return ({
    get checked() {
        return (0, mobx_state_tree_1.getParent)(self, 2).isSelected(self);
    },
    get modified() {
        if (!self.data) {
            return false;
        }
        return Object.keys(self.data).some(function (key) { return !(0, isEqual_1.default)(self.data[key], self.pristine[key]); });
    },
    get moved() {
        return self.index !== self.newIndex;
    },
    get locals() {
        return (0, helper_1.createObject)((0, helper_1.extendObject)((0, mobx_state_tree_1.getParent)(self, 2).data, {
            index: self.index
        }), self.data);
    },
    get checkable() {
        var table = (0, mobx_state_tree_1.getParent)(self, 2);
        return table && table.itemCheckableOn
            ? (0, tpl_1.evalExpression)(table.itemCheckableOn, self.locals)
            : true;
    },
    get draggable() {
        var table = (0, mobx_state_tree_1.getParent)(self, 2);
        return table && table.itemDraggableOn
            ? (0, tpl_1.evalExpression)(table.itemDraggableOn, self.locals)
            : true;
    }
}); })
    .actions(function (self) { return ({
    toggle: function () {
        (0, mobx_state_tree_1.getParent)(self, 2).toggle(self);
    },
    change: function (values, savePristine) {
        self.data = (0, helper_1.immutableExtends)(self.data, values);
        savePristine && (self.pristine = self.data);
    },
    reset: function () {
        self.newIndex = self.index;
        self.data = self.pristine;
    }
}); });
exports.ListStore = iRenderer_1.iRendererStore
    .named('ListStore')
    .props({
    items: mobx_state_tree_1.types.array(exports.Item),
    selectedItems: mobx_state_tree_1.types.array(mobx_state_tree_1.types.reference(exports.Item)),
    primaryField: 'id',
    orderBy: '',
    orderDir: mobx_state_tree_1.types.optional(mobx_state_tree_1.types.union(mobx_state_tree_1.types.literal('asc'), mobx_state_tree_1.types.literal('desc')), 'asc'),
    draggable: false,
    dragging: false,
    multiple: true,
    selectable: false,
    itemCheckableOn: '',
    itemDraggableOn: '',
    hideCheckToggler: false
})
    .views(function (self) {
    function isSelected(item) {
        return !!~self.selectedItems.indexOf(item);
    }
    function getModifiedItems() {
        return self.items.filter(function (item) { return item.modified; });
    }
    function getModified() {
        return getModifiedItems().length;
    }
    function getMovedItems() {
        return self.items.filter(function (item) { return item.moved; });
    }
    function getMovied() {
        return getMovedItems().length;
    }
    return {
        get allChecked() {
            return !!(self.selectedItems.length ===
                self.checkableItems.length &&
                self.checkableItems.length);
        },
        get checkableItems() {
            return self.items.filter(function (item) { return item.checkable; });
        },
        get unSelectedItems() {
            return self.items.filter(function (item) { return !item.checked; });
        },
        isSelected: isSelected,
        get modified() {
            return getModified();
        },
        get modifiedItems() {
            return getModifiedItems();
        },
        get moved() {
            return getMovied();
        },
        get movedItems() {
            return getMovedItems();
        }
    };
})
    .actions(function (self) {
    function update(config) {
        config.selectable === void 0 || (self.selectable = config.selectable);
        config.draggable === void 0 || (self.draggable = config.draggable);
        config.multiple === void 0 || (self.multiple = config.multiple);
        config.hideCheckToggler === void 0 ||
            (self.hideCheckToggler = config.hideCheckToggler);
        if (typeof config.orderBy !== 'undefined') {
            setOrderByInfo(config.orderBy, config.orderDir === 'desc' ? 'desc' : 'asc');
        }
        config.itemCheckableOn === void 0 ||
            (self.itemCheckableOn = config.itemCheckableOn);
        config.itemDraggableOn === void 0 ||
            (self.itemDraggableOn = config.itemDraggableOn);
    }
    function initItems(items) {
        var arr = items.map(function (item, key) {
            item = (0, helper_1.isObject)(item)
                ? item
                : {
                    item: item
                };
            return {
                // id: String((item as any)[self.primaryField] || key),
                id: (0, helper_1.guid)(),
                index: key,
                newIndex: key,
                pristine: item,
                data: item,
                modified: false
            };
        });
        self.selectedItems.clear();
        self.items.replace(arr);
        self.dragging = false;
    }
    function updateSelected(selected, valueField) {
        self.selectedItems.clear();
        self.items.forEach(function (item) {
            if (~selected.indexOf(item.pristine)) {
                self.selectedItems.push(item);
            }
            else if ((0, find_1.default)(selected, function (a) {
                return a[valueField || 'value'] == item.pristine[valueField || 'value'];
            })) {
                self.selectedItems.push(item);
            }
        });
    }
    function toggleAll() {
        if (self.allChecked) {
            self.selectedItems.clear();
        }
        else {
            self.selectedItems.replace(self.checkableItems);
        }
    }
    function toggle(item) {
        if (!item.checkable) {
            return;
        }
        var idx = self.selectedItems.indexOf(item);
        if (self.multiple) {
            ~idx
                ? self.selectedItems.splice(idx, 1)
                : self.selectedItems.push(item);
        }
        else {
            ~idx
                ? self.selectedItems.splice(idx, 1)
                : self.selectedItems.replace([item]);
        }
    }
    function clear() {
        self.selectedItems.clear();
    }
    function setOrderByInfo(key, direction) {
        self.orderBy = key;
        self.orderDir = direction;
    }
    function reset() {
        self.items.forEach(function (item) { return item.reset(); });
        self.dragging = false;
    }
    function toggleDragging() {
        self.dragging = !self.dragging;
    }
    function stopDragging() {
        self.dragging = false;
    }
    function exchange(fromIndex, toIndex) {
        var item = self.items[fromIndex];
        item.newIndex = toIndex;
        var newItems = self.items.slice();
        newItems.splice(fromIndex, 1);
        newItems.splice(toIndex, 0, item);
        self.items.replace(newItems);
    }
    return {
        update: update,
        initItems: initItems,
        updateSelected: updateSelected,
        toggleAll: toggleAll,
        toggle: toggle,
        clear: clear,
        setOrderByInfo: setOrderByInfo,
        reset: reset,
        toggleDragging: toggleDragging,
        stopDragging: stopDragging,
        exchange: exchange
    };
});
//# sourceMappingURL=./store/list.js.map
