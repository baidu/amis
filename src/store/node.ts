import {types, destroy, isAlive, detach, getEnv} from 'mobx-state-tree';
import {getStoreById} from './manager';

export const StoreNode = types
  .model('StoreNode', {
    id: types.identifier,
    path: '',
    storeType: types.string,
    disposed: false,
    parentId: '',
    childrenIds: types.optional(types.array(types.string), [])
  })
  .views(self => {
    return {
      get parentStore(): any {
        return isAlive(self) && self.parentId
          ? getStoreById(self.parentId)
          : null;
      },

      get __() {
        return getEnv(self).translate;
      }
    };
  })
  .actions(self => {
    function addChildId(id: string) {
      self.childrenIds.push(id);
    }

    function removeChildId(id: string) {
      const childrenIds = self.childrenIds.filter(item => item !== id);
      self.childrenIds.replace(childrenIds);

      self.disposed && dispose();
    }

    function dispose(callback?: () => void) {
      // 先标记自己是要销毁的。
      self.disposed = true;

      if (/(?:dialog|drawer)$/.test(self.path)) {
        destroy(self);
        callback?.();
      } else if (!self.childrenIds.length) {
        const parent = self.parentStore;
        parent?.onChildStoreDispose?.(self);
        destroy(self);
        callback?.();
        // destroy(self);
      }
    }

    return {
      onChildStoreDispose(child: any) {
        removeChildId(child.id);
      },

      dispose,
      addChildId,
      removeChildId
    };
  });

export type IStoreNode = typeof StoreNode.Type;
export type SIStoreNode = typeof StoreNode.SnapshotType;
