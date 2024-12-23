import {types, getParent, SnapshotIn, Instance} from 'mobx-state-tree';
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
    storeType: 'Item',
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
      const listStore = getParent(self, 2) as IListStore;
      return createObject(
        extendObject(listStore.data, {
          index: self.index,

          // 只有table时，也可以获取选中行
          ...listStore.eventContext
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
      const list = getParent(self, 2) as IListStore;

      return list && list.itemDraggableOn
        ? evalExpression(list.itemDraggableOn, (self as IItem).locals)
        : list.draggable;
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
    },
    updateData({children, ...rest}: any) {
      self.data = {
        ...self.data,
        ...rest
      };

      // if (Array.isArray(children)) {

      // }
    }
  }));

export type IItem = Instance<typeof Item>;
export type SItem = SnapshotIn<typeof Item>;

export const ListStore = iRendererStore
  .named('ListStore')
  .props({
    items: types.array(Item),

    // 记录原始列表和原始选中的列表
    // 因为如果是前端分页，上层 crud 或者 input-table 下发到这层的
    // 是某个页区间的数据，这个时候 items 和 selectedItems 会少很多条
    fullItems: types.optional(types.array(types.frozen()), []),
    fullSelectedItems: types.optional(types.array(types.frozen()), []),

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
    strictMode: false,
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
      },

      /**
       * 构建事件的上下文数据
       * @param buildChain
       * @returns
       */
      get eventContext() {
        const context = {
          selectedItems: self.selectedItems.map(item => item.data),
          selectedIndexes: self.selectedItems.map(item => item.index),
          items: self.items.map(item => item.data),
          unSelectedItems: this.unSelectedItems.map(item => item.data)
        };

        // 如果是前端分页情况，需要根据全量数据计算
        // 如果不是前端分页，数据都没有返回，那种就没办法支持全量数据信息了
        if (self.fullItems.length > self.items.length) {
          // todo 这里的选择顺序会一直变，这个有影响吗?
          const selectedItems = self.fullSelectedItems
            .filter(
              item =>
                !self.items.find(
                  row => row.pristine === (item.__pristine || item)
                )
            )
            .concat(context.selectedItems);

          context.selectedItems = selectedItems;
          context.items = self.fullItems.concat();
          context.unSelectedItems = self.fullItems.filter(
            item => !selectedItems.includes(item)
          );
          context.selectedIndexes = selectedItems.map(item =>
            self.fullItems.indexOf(item.__pristine || item)
          );
        }

        return context;
      }
    };
  })
  .actions(self => {
    function update(config: Partial<SListStore>) {
      config.selectable === void 0 || (self.selectable = config.selectable);
      config.draggable === void 0 || (self.draggable = config.draggable);
      config.multiple === void 0 || (self.multiple = config.multiple);
      config.strictMode === void 0 || (self.strictMode = config.strictMode);
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

    function initItems(
      items: Array<object>,
      fullItems?: Array<any>,
      fullSelectedItems?: Array<any>
    ) {
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
          pristine: (item as any).__pristine || item,
          data: item
        };
      });
      self.selectedItems.clear();
      self.items.replace(arr as Array<IItem>);
      self.dragging = false;
      Array.isArray(fullItems) && self.fullItems.replace(fullItems);
      Array.isArray(fullSelectedItems) &&
        self.fullSelectedItems.replace(fullSelectedItems);
    }

    function updateSelected(selected: Array<any>, valueField?: string) {
      self.selectedItems.clear();
      selected.forEach(item => {
        let resolved = self.items.find(a => a.pristine === item);

        // 先严格比较，
        if (!resolved) {
          resolved = self.items.find(a => {
            const selectValue = item[valueField || 'value'];
            const itemValue = a.pristine[valueField || 'value'];
            return selectValue === itemValue;
          });
        }

        // 再宽松比较
        if (!resolved) {
          resolved = self.items.find(a => {
            const selectValue = item[valueField || 'value'];
            const itemValue = a.pristine[valueField || 'value'];
            return selectValue == itemValue;
          });
        }

        resolved && self.selectedItems.push(resolved);
      });
    }

    function toggleAll() {
      if (self.allChecked) {
        self.selectedItems.clear();
      } else {
        self.selectedItems.replace(self.checkableItems);
      }
    }

    function clearAll() {
      self.selectedItems.clear();
    }

    function selectAll() {
      self.selectedItems.replace(self.checkableItems);
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

    function startDragging() {
      self.dragging = true;
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

    function getData(superData: any): any {
      return createObject(superData, {
        ...self.eventContext
      });
    }

    return {
      getData,
      update,
      initItems,
      updateSelected,
      toggleAll,
      clearAll,
      selectAll,
      toggle,
      clear,
      setOrderByInfo,
      reset,
      toggleDragging,
      startDragging,
      stopDragging,
      exchange
    };
  });

export type IListStore = Instance<typeof ListStore>;
export type SListStore = SnapshotIn<typeof ListStore>;
