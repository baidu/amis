import {
  types,
  getEnv,
  detach,
  setLivelinessChecking,
  isAlive,
  Instance
} from 'mobx-state-tree';
import {iRendererStore, IIRendererStore, SIRendererStore} from './iRenderer';
import {IServiceStore, ServiceStore} from './service';
import {ComboStore, IComboStore} from './combo';
import {FormStore, IFormStore} from './form';
import {CRUDStore, ICRUDStore} from './crud';
import {IColumn, IRow, ITableStore, TableStore} from './table';
import {IColumnV2, IRowV2, ITableStoreV2, TableStoreV2} from './table-v2';
import {IListStore, ListStore} from './list';
import {IModalStore, ModalStore} from './modal';
import {TranslateFn} from '../locale';
import find from 'lodash/find';
import {IStoreNode, StoreNode} from './node';
import {FormItemStore, IFormItemStore} from './formItem';
import {addStore, getStoreById, getStores, removeStore} from './manager';
import {IPaginationStore, PaginationStore} from './pagination';
import {AppStore, IAppStore} from './app';
import {RootStore} from './root';

setLivelinessChecking(
  process.env.NODE_ENV === 'production' ? 'ignore' : 'error'
);

const allowedStoreList = [
  ServiceStore,
  FormStore,
  ComboStore,
  CRUDStore,
  TableStore,
  TableStoreV2,
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
    }
  }));

export type IRendererStore = Instance<typeof RendererStore>;
export {iRendererStore, IIRendererStore};
export const RegisterStore = function (store: any) {
  allowedStoreList.push(store as any);
};

export {
  ServiceStore,
  IServiceStore,
  FormStore,
  IFormStore,
  ComboStore,
  IComboStore,
  CRUDStore,
  ICRUDStore,
  TableStore,
  IColumn,
  IRow,
  ITableStore,
  TableStoreV2,
  ITableStoreV2,
  IColumnV2,
  IRowV2,
  ListStore,
  IListStore,
  ModalStore,
  IModalStore,
  FormItemStore,
  IFormItemStore,
  PaginationStore,
  IPaginationStore,
  AppStore,
  IAppStore,
  StoreNode,
  IStoreNode
};
