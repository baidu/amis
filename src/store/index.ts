import {
  types,
  getEnv,
  detach,
  setLivelynessChecking,
  isAlive
} from 'mobx-state-tree';
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
import {IStoreNode} from './node';
import {FormItemStore} from './formItem';

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
  ModalStore,
  FormItemStore
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
    },

    get stores() {
      return stores;
    }
  }))
  .actions(self => ({
    addStore(store: {
      storeType: string;
      id: string;
      path: string;
      parentId?: string;
      [propName: string]: any;
    }): IStoreNode {
      const factory = find(
        allowedStoreList,
        item => item.name === store.storeType
      )!;

      return addStore(factory.create(store as any, getEnv(self)));
    },

    removeStore(store: IStoreNode) {
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
  [propName: string]: IStoreNode;
} = {};

export function addStore(store: IStoreNode) {
  if (stores[store.id]) {
    return stores[store.id];
  }

  stores[store.id] = store;

  // drawer dialog 不加进去，否则有些容器就不会自我销毁 store 了。
  if (store.parentId && !/(?:dialog|drawer)$/.test(store.path)) {
    const parent = stores[store.parentId] as IIRendererStore;
    parent.addChildId(store.id);
  }

  cleanUp();
  return store;
}

const toDelete: Array<string> = [];

export function removeStore(store: IStoreNode) {
  const id = store.id;
  toDelete.push(id);
  store.dispose(cleanUp);
}

function cleanUp() {
  let index = toDelete.length - 1;
  while (index >= 0) {
    const id = toDelete[index];
    const store = stores[id];

    if (store && !isAlive(store)) {
      delete stores[id];
      toDelete.splice(index, 1);
    } else {
      index--;
    }
  }
}

export function getStoreById(id: string) {
  return stores[id];
}
