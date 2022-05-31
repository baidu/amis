import {
  types,
  getParent,
  SnapshotIn,
  flow,
  getEnv,
  getRoot,
  Instance
} from 'mobx-state-tree';
import {iRendererStore} from './iRenderer';
import isEqual from 'lodash/isEqual';
import find from 'lodash/find';
import {
  createObject,
  isObject,
  guid,
  immutableExtends,
  extendObject
} from '../utils/helper';
import {evalExpression} from '../utils/tpl';

export const Item = types
  .model('Item', {
    id: types.identifier,
    pristine: types.frozen(),
    data: types.frozen(),
    index: types.number,
    newIndex: types.number
  })
  .views(self => ({
    get checked(): boolean {
      return (getParent(self, 2) as IListStore).isSelected(self as IItem);
    },

    get modified() {
      if (!self.data) {
        return false;
      }

      return Object.keys(self.data).some(
        key => !isEqual(self.data[key], self.pristine[key])
      );
    },

    get moved() {
      return self.index !== self.newIndex;
    },

    get locals(): any {
      return createObject(
        extendObject((getParent(self, 2) as IListStore).data, {
          index: self.index
        }),
        self.data
      );
    },

    get checkable(): boolean {
      const table = getParent(self, 2) as IListStore;
      return table && table.itemCheckableOn
        ? evalExpression(table.itemCheckableOn, (self as IItem).locals)
        : true;
    },

    get draggable(): boolean {
      const table = getParent(self, 2) as IListStore;
      return table && table.itemDraggableOn
        ? evalExpression(table.itemDraggableOn, (self as IItem).locals)
        : true;
    }
  }))
  .actions(self => ({
    toggle() {
      (getParent(self, 2) as IListStore).toggle(self as IItem);
    },

    change(values: object, savePristine?: boolean) {
      self.data = immutableExtends(self.data, values);
      savePristine && (self.pristine = self.data);
    },

    reset() {
      self.newIndex = self.index;
      self.data = self.pristine;
    }
  }));

export type IItem = Instance<typeof Item>;
export type SItem = SnapshotIn<typeof Item>;

export const ListStore = iRendererStore
  .named('ListStore')
  .props({
    items: types.array(Item),
    selectedItems: types.array(types.reference(Item)),
    primaryField: 'id',
    orderBy: '',
    orderDir: types.optional(
      types.union(types.literal('asc'), types.literal('desc')),
      'asc'
    ),
    draggable: false,
    dragging: false,
    multiple: true,
    selectable: false,
    itemCheckableOn: '',
    itemDraggableOn: '',
    hideCheckToggler: false
  })
  .views(self => {
    function isSelected(item: IItem): boolean {
      return !!~self.selectedItems.indexOf(item);
    }

    function getModifiedItems() {
      return self.items.filter(item => item.modified);
    }

    function getModified() {
      return getModifiedItems().length;
    }

    function getMovedItems() {
      return self.items.filter(item => item.moved);
    }

    function getMovied() {
      return getMovedItems().length;
    }

    return {
      get allChecked(): boolean {
        return !!(
          self.selectedItems.length ===
            (self as IListStore).checkableItems.length &&
          (self as IListStore).checkableItems.length
        );
      },

      get checkableItems() {
        return self.items.filter(item => item.checkable);
      },

      get unSelectedItems() {
        return self.items.filter(item => !item.checked);
      },

      isSelected,

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
  .actions(self => {
    function update(config: Partial<SListStore>) {
      config.selectable === void 0 || (self.selectable = config.selectable);
      config.draggable === void 0 || (self.draggable = config.draggable);
      config.multiple === void 0 || (self.multiple = config.multiple);
      config.hideCheckToggler === void 0 ||
        (self.hideCheckToggler = config.hideCheckToggler);

      if (typeof config.orderBy !== 'undefined') {
        setOrderByInfo(
          config.orderBy,
          config.orderDir === 'desc' ? 'desc' : 'asc'
        );
      }

      config.itemCheckableOn === void 0 ||
        (self.itemCheckableOn = config.itemCheckableOn);
      config.itemDraggableOn === void 0 ||
        (self.itemDraggableOn = config.itemDraggableOn);
    }

    function initItems(items: Array<object>) {
      let arr = items.map((item, key) => {
        item = isObject(item)
          ? item
          : {
              item: item
            };

        return {
          // id: String((item as any)[self.primaryField] || key),
          id: guid(),
          index: key,
          newIndex: key,
          pristine: item,
          data: item,
          modified: false
        };
      });
      self.selectedItems.clear();
      self.items.replace(arr as Array<IItem>);
      self.dragging = false;
    }

    function updateSelected(selected: Array<any>, valueField?: string) {
      self.selectedItems.clear();
      self.items.forEach(item => {
        if (~selected.indexOf(item.pristine)) {
          self.selectedItems.push(item);
        } else if (
          find(
            selected,
            a =>
              a[valueField || 'value'] == item.pristine[valueField || 'value']
          )
        ) {
          self.selectedItems.push(item);
        }
      });
    }

    function toggleAll() {
      if (self.allChecked) {
        self.selectedItems.clear();
      } else {
        self.selectedItems.replace(self.checkableItems);
      }
    }

    function toggle(item: IItem) {
      if (!item.checkable) {
        return;
      }

      const idx = self.selectedItems.indexOf(item);

      if (self.multiple) {
        ~idx
          ? self.selectedItems.splice(idx, 1)
          : self.selectedItems.push(item);
      } else {
        ~idx
          ? self.selectedItems.splice(idx, 1)
          : self.selectedItems.replace([item]);
      }
    }

    function clear() {
      self.selectedItems.clear();
    }

    function setOrderByInfo(key: string, direction: 'asc' | 'desc') {
      self.orderBy = key;
      self.orderDir = direction;
    }

    function reset() {
      self.items.forEach(item => item.reset());
      self.dragging = false;
    }

    function toggleDragging() {
      self.dragging = !self.dragging;
    }

    function stopDragging() {
      self.dragging = false;
    }

    function exchange(fromIndex: number, toIndex: number) {
      const item: IItem = self.items[fromIndex];
      item.newIndex = toIndex;

      const newItems = self.items.slice();
      newItems.splice(fromIndex, 1);
      newItems.splice(toIndex, 0, item);

      self.items.replace(newItems);
    }

    return {
      update,
      initItems,
      updateSelected,
      toggleAll,
      toggle,
      clear,
      setOrderByInfo,
      reset,
      toggleDragging,
      stopDragging,
      exchange
    };
  });

export type IListStore = Instance<typeof ListStore>;
export type SListStore = SnapshotIn<typeof ListStore>;
