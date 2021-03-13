import {isAlive} from 'mobx-state-tree';
import {IIRendererStore} from './iRenderer';
import {IStoreNode} from './node';

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

export function getStores() {
  return stores;
}
