import {Instance, types} from 'mobx-state-tree';
import {createObject, qsparse} from '../utils/helper';
import {ServiceStore} from './service';

export const RootStore = ServiceStore.named('RootStore')
  .props({
    runtimeError: types.frozen(),
    runtimeErrorStack: types.frozen(),
    query: types.frozen()
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
    }
  }));

export type IRootStore = Instance<typeof RootStore>;
