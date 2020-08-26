import {types, SnapshotIn, isAlive, onAction} from 'mobx-state-tree';
import {iRendererStore} from './iRenderer';
import {FormItemStore} from './formItem';
import {FormStore, IFormStore, IFormItemStore} from './form';
import {getStoreById} from './index';

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
    formsRef: types.optional(types.array(types.string), []),
    minLength: 0,
    maxLength: 0,
    length: 0,
    activeKey: 0
  })
  .views(self => ({
    get forms() {
      return self.formsRef.map(item => getStoreById(item) as IFormStore);
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
    }
  }))
  .actions(self => {
    function config(setting: {
      minLength?: number;
      maxLength?: number;
      length?: number;
    }) {
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

          self.forms.forEach(item =>
            item.items.forEach(item => item.unique && item.syncOptions())
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

export type IComboStore = typeof ComboStore.Type;
export type SComboStore = SnapshotIn<typeof ComboStore>;
