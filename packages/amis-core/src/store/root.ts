import {Instance, types} from 'mobx-state-tree';
import {createObject, extendObject, parseQuery} from '../utils/helper';
import {ServiceStore} from './service';
import {createObjectFromChain, extractObjectChain} from '../utils';

export const RootStore = ServiceStore.named('RootStore')
  .props({
    runtimeError: types.frozen(),
    runtimeErrorStack: types.frozen(),
    query: types.frozen(),
    visibleState: types.optional(types.frozen(), {}),
    disableState: types.optional(types.frozen(), {}),
    staticState: types.optional(types.frozen(), {})
  })
  .volatile(self => {
    return {
      context: {}
    };
  })
  .views(self => ({
    get downStream() {
      let result = self.data;

      if (self.context || self.query) {
        const chain = extractObjectChain(result);
        self.context && chain.unshift(self.context);
        self.query &&
          chain.splice(chain.length - 1, 0, {
            ...self.query,
            __query: self.query
          });

        result = createObjectFromChain(chain);
      }

      return result;
    }
  }))
  .actions(self => ({
    setContext(context: any) {
      self.context = context;
    },
    setRuntimeError(error: any, errorStack: any) {
      self.runtimeError = error;
      self.runtimeErrorStack = errorStack;
    },
    updateLocation(location?: any, parseFn?: Function) {
      self.query = parseFn ? parseFn(location) : parseQuery(location);
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
