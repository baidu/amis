import {types, getEnv, detach, setLivelynessChecking} from 'mobx-state-tree';
import 'setimmediate';
import {iRendererStore, IIRendererStore, SIRendererStore} from './iRenderer';
import {ServiceStore} from './service';
import {ComboStore} from './combo';
import {FormStore} from './form';
import {CRUDStore} from './crud';
import {TableStore} from './table';
import {ListStore} from './list';
import {ModalStore} from './modal';
import {TranslateFn} from '../locale';
import find from 'lodash/find';

setLivelynessChecking(
  process.env.NODE_ENV === 'production' ? 'ignore' : 'error'
);

const allowedStoreList = [
  ServiceStore,
  FormStore,
  ComboStore,
  CRUDStore,
  TableStore,
  ListStore,
  ModalStore
];

export const RendererStore = types
  .model('RendererStore', {
    storeType: 'RendererStore'
  })
  .views(self => ({
    get fetcher() {
      return getEnv(self).fetcher;
    },

    get notify() {
      return getEnv(self).notify;
    },

    get isCancel(): (value: any) => boolean {
      return getEnv(self).isCancel;
    },

    get __(): TranslateFn {
      return getEnv(self).translate;
    },
    getStoreById(id: string) {
      return getStoreById(id);
    }
  }))
  .actions(self => ({
    addStore(store: SIRendererStore): IIRendererStore {
      const factory = find(
        allowedStoreList,
        item => item.name === store.storeType
      )!;

      return addStore(factory.create(store, getEnv(self)));

      // if (self.stores.has(store.id as string)) {
      //   return self.stores.get(store.id) as IIRendererStore;
      // }

      // if (store.parentId) {
      //   const parent = self.stores.get(store.parentId) as IIRendererStore;
      //   parent.childrenIds.push(store.id);
      // }

      // self.stores.put(store);
      // return self.stores.get(store.id) as IIRendererStore;
    },

    removeStore(store: IIRendererStore) {
      // store.dispose();
      removeStore(store);
    }
  }));

export type IRendererStore = typeof RendererStore.Type;
export {iRendererStore, IIRendererStore};
export const RegisterStore = function (store: any) {
  allowedStoreList.push(store as any);
};

const stores: {
  [propName: string]: IIRendererStore;
} = {};

export function addStore(store: IIRendererStore) {
  if (stores[store.id]) {
    return stores[store.id];
  }

  stores[store.id] = store;

  // drawer dialog 不加进去，否则有些容器就不会自我销毁 store 了。
  if (store.parentId && !/(?:dialog|drawer)$/.test(store.path)) {
    const parent = stores[store.parentId] as IIRendererStore;
    parent.addChildId(store.id);
  }

  return store;
}

export function removeStore(store: IIRendererStore) {
  delete stores[store.id];
  store.dispose();
}

export function getStoreById(id: string) {
  return stores[id];
}
