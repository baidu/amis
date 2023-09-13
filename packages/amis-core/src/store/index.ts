import {
  types,
  getEnv,
  detach,
  setLivelinessChecking,
  isAlive,
  Instance
} from 'mobx-state-tree';
import {iRendererStore, SIRendererStore} from './iRenderer';
import type {IIRendererStore} from './iRenderer';
import {ServiceStore} from './service';
import type {IServiceStore} from './service';
import {ComboStore} from './combo';
import type {IComboStore} from './combo';
import {FormStore} from './form';
import type {IFormStore} from './form';
import {CRUDStore} from './crud';
import type {ICRUDStore} from './crud';
import {TableStore} from './table';
import type {IColumn, IRow, ITableStore} from './table';
import {TableStore2} from './table2';
import type {IColumn2, IRow2, ITableStore2} from './table2';
import {ListStore} from './list';
import type {IListStore} from './list';
import {ModalStore} from './modal';
import type {IModalStore} from './modal';
import {TranslateFn} from '../locale';
import find from 'lodash/find';
import {StoreNode} from './node';
import type {IStoreNode} from './node';
import {FormItemStore} from './formItem';
import type {IFormItemStore} from './formItem';
import {addStore, getStoreById, getStores, removeStore} from './manager';
import {PaginationStore} from './pagination';
import type {IPaginationStore} from './pagination';
import {AppStore} from './app';
import type {IAppStore} from './app';
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
  TableStore2,
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
  TableStore2,
  ITableStore2,
  IColumn2,
  IRow2,
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
