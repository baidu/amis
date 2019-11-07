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
    storeType: 'RendererStore',
    stores: types.map(
      types.union(
        {
          eager: false,
          dispatcher: (snapshort: SIRendererStore) => {
            for (let storeFactory of allowedStoreList) {
              if (storeFactory.name === snapshort.storeType) {
                return storeFactory;
              }
            }

            return iRendererStore;
          }
        },
        iRendererStore,
        ...allowedStoreList
      )
    )
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
    }
  }))
  .views(self => ({
    getStoreById(id: string) {
      return self.stores.get(id);
    }
  }))
  .actions(self => ({
    addStore(store: SIRendererStore): IIRendererStore {
      if (self.stores.has(store.id as string)) {
        return self.stores.get(store.id) as IIRendererStore;
      }
      self.stores.put(store);
      return self.stores.get(store.id) as IIRendererStore;
    },

    removeStore(store: IIRendererStore) {
      detach(store);
    }
  }));

export type IRendererStore = typeof RendererStore.Type;
export {iRendererStore, IIRendererStore};
