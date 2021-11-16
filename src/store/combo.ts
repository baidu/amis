import {types, SnapshotIn, isAlive, onAction, Instance} from 'mobx-state-tree';
import {IIRendererStore, iRendererStore} from './iRenderer';
import {FormItemStore} from './formItem';
import {FormStore, IFormStore, IFormItemStore} from './form';
import {getStoreById} from './manager';

export const UniqueGroup = types
  .model('UniqueGroup', {
    name: types.identifier,
    itemsRef: types.array(types.string)
  })
  .views(self => ({
    get items() {
      return self.itemsRef.map(
        id => (getStoreById(id) as any) as IFormItemStore
      );
    }
  }))
  .actions(self => ({
    removeItem(item: IFormItemStore) {
      self.itemsRef.replace(self.itemsRef.filter(id => id !== item.id));
    },

    addItem(item: IFormItemStore) {
      self.itemsRef.push(item.id);
    }
  }));

export type IUniqueGroup = typeof UniqueGroup.Type;

export const ComboStore = iRendererStore
  .named('ComboStore')
  .props({
    uniques: types.map(UniqueGroup),
    multiple: false,
    formsRef: types.optional(types.array(types.string), []),
    minLength: 0,
    maxLength: 0,
    length: 0,
    activeKey: 0
  })
  .views(self => {
    function getForms() {
      return self.formsRef.map(item => getStoreById(item) as IFormStore);
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
          let isFull = false;
          self.uniques.forEach(item => {
            if (isFull || !item.items.length) {
              return;
            }

            let total = item.items[0].options.length;
            let current = item.items.reduce((total, item) => {
              return total + item.selectedOptions.length;
            }, 0);

            isFull = total && current >= total ? true : false;
          });

          if (isFull) {
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
      getItemsByName(name: string): any {
        const forms = getForms();
        return self.multiple
          ? [forms[parseInt(name, 10)]]
          : forms[0].getItemsByName(name);
      }
    };
  })
  .actions(self => {
    function config(setting: {
      multiple?: boolean;
      minLength?: number;
      maxLength?: number;
      length?: number;
    }) {
      typeof setting.multiple !== 'undefined' &&
        (self.multiple = setting.multiple);
      typeof setting.minLength !== 'undefined' &&
        (self.minLength = parseInt(setting.minLength as any, 10));
      typeof setting.maxLength !== 'undefined' &&
        (self.maxLength = parseInt(setting.maxLength as any, 10));
      typeof setting.length !== 'undefined' && (self.length = setting.length);
    }

    function bindUniuqueItem(item: IFormItemStore) {
      if (!self.uniques.has(item.name)) {
        self.uniques.put({
          name: item.name
        });
      }
      let group: IUniqueGroup = self.uniques.get(item.name) as IUniqueGroup;
      group.addItem(item);
    }

    function unBindUniuqueItem(item: IFormItemStore) {
      let group: IUniqueGroup = self.uniques.get(item.name) as IUniqueGroup;
      group.removeItem(item);
      if (!group.items.length) {
        self.uniques.delete(item.name);
      }
    }

    function addForm(form: IFormStore) {
      self.formsRef.push(form.id);
    }

    function onChildStoreDispose(child: IFormStore) {
      if (child.storeType === FormStore.name) {
        const idx = self.formsRef.indexOf(child.id);
        if (~idx) {
          self.formsRef.splice(idx, 1);
          child.items.forEach(item => {
            if (item.unique) {
              unBindUniuqueItem(item);
            }
          });

          self.forms.forEach(form =>
            form.items.forEach(
              item => item.unique && item.syncOptions(undefined, form.data)
            )
          );
        }
      }
      self.removeChildId(child.id);
    }

    function setActiveKey(key: number) {
      self.activeKey = key;
    }

    return {
      config,
      setActiveKey,
      bindUniuqueItem,
      unBindUniuqueItem,
      addForm,
      onChildStoreDispose
    };
  });

export type IComboStore = Instance<typeof ComboStore>;
export type SComboStore = SnapshotIn<typeof ComboStore>;
