import {Instance, types} from 'mobx-state-tree';
import {parseQuery} from '../utils/helper';
import {ServiceStore} from './service';
import {createObjectFromChain, extractObjectChain} from '../utils';

export const RootStore = ServiceStore.named('RootStore')
  .props({
    runtimeError: types.frozen(),
    runtimeErrorStack: types.frozen(),
    query: types.frozen()
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
    }
  }));

export type IRootStore = Instance<typeof RootStore>;
