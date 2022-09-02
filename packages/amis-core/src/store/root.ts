import {Instance, types} from 'mobx-state-tree';
import {createObject, qsparse} from '../utils/helper';
import {ServiceStore} from './service';

export const RootStore = ServiceStore.named('RootStore')
  .props({
    runtimeError: types.frozen(),
    runtimeErrorStack: types.frozen(),
    query: types.frozen(),
    visibleState: types.optional(types.frozen(), {}),
    disableState: types.optional(types.frozen(), {}),
    staticState: types.optional(types.frozen(), {})
  })
  .views(self => ({
    get downStream() {
      return self.query
        ? createObject(
            {
              ...(self.data && self.data.__super ? self.data.__super : null),
              ...self.query,
              __query: self.query
            },
            self.data
          )
        : self.data;
    }
  }))
  .actions(self => ({
    setRuntimeError(error: any, errorStack: any) {
      self.runtimeError = error;
      self.runtimeErrorStack = errorStack;
    },
    updateLocation(location?: any) {
      const query =
        (location && location.query) ||
        (location &&
          location.search &&
          qsparse(location.search.substring(1))) ||
        (window.location.search &&
          qsparse(window.location.search.substring(1)));

      self.query = query;
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
    },
    setStatic(id: string, value: boolean) {
      const state = {
        ...self.staticState,
        [id]: value
      };
      self.staticState = state;
    }
  }));

export type IRootStore = Instance<typeof RootStore>;
