import {
  types,
  getEnv,
  detach,
  setLivelynessChecking,
  isAlive,
  Instance
} from 'mobx-state-tree';
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
import {addStore, getStoreById, getStores, removeStore} from './manager';
import {PaginationStore} from './pagination';
import {AppStore} from './app';
import {RootStore} from './root';

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
  FormItemStore,
  PaginationStore,
  AppStore
];

export const RendererStore = types
  .model('RendererStore', {
    storeType: 'RendererStore'
  })
  .props({
    visibleState: types.optional(types.frozen(), {}),
    disableState: types.optional(types.frozen(), {})
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
      return getStores();
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
      if (store.storeType === RootStore.name) {
        return addStore(RootStore.create(store, getEnv(self)));
      }

      const factory = find(
        allowedStoreList,
        item => item.name === store.storeType
      )!;

      return addStore(factory.create(store as any, getEnv(self)));
    },

    removeStore(store: IStoreNode) {
      // store.dispose();
      removeStore(store);
    },

    setVisible(id: string, value: boolean) {
      const state = {
        ...self.visibleState,
        [id]: value
      };
      self.visibleState = state;
    },

    setDisable(id: string, value: boolean) {
      const state = {
        ...self.disableState,
        [id]: value
      };
      self.disableState = state;
    }
  }));

export type IRendererStore = Instance<typeof RendererStore>;
export {iRendererStore, IIRendererStore};
export const RegisterStore = function (store: any) {
  allowedStoreList.push(store as any);
};
