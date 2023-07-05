import {Instance, types} from 'mobx-state-tree';
import {StoreNode} from './node';

export const StatusStore = types
  .model('StatusStore', {
    visibleState: types.optional(types.frozen(), {}),
    disableState: types.optional(types.frozen(), {}),
    staticState: types.optional(types.frozen(), {})
  })

  .actions(self => ({
    setVisible(id: string, value?: boolean) {
      const state = {
        ...self.visibleState,
        [id]: value
      };
      self.visibleState = state;
    },
    setDisable(id: string, value?: boolean) {
      const state = {
        ...self.disableState,
        [id]: value
      };
      self.disableState = state;
    },
    setStatic(id: string, value?: boolean) {
      const state = {
        ...self.staticState,
        [id]: value
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
