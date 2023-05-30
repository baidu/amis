import {Instance, types} from 'mobx-state-tree';
import {StoreNode} from './node';

export const StatusStore = types
  .model('StatusStore', {
    visibleState: types.optional(types.frozen(), {}),
    disableState: types.optional(types.frozen(), {}),
    staticState: types.optional(types.frozen(), {})
  })

  .actions(self => ({
    setVisible(key: string, value?: boolean) {
      const state = {
        ...self.visibleState,
        [key]: value
      };
      self.visibleState = state;
    },
    setDisable(key: string, value?: boolean) {
      const state = {
        ...self.disableState,
        [key]: value
      };
      self.disableState = state;
    },
    setStatic(key: string, value?: boolean) {
      const state = {
        ...self.staticState,
        [key]: value
      };
      self.staticState = state;
    },

    resetAll() {
      self.visibleState = {};
      self.disableState = {};
      self.staticState = {};
    }
  }));

export type IStatusStore = Instance<typeof StatusStore>;
