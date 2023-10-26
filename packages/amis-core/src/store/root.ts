import {Instance, types} from 'mobx-state-tree';
import {parseQuery} from '../utils/helper';
import {ServiceStore} from './service';
import {
  createObjectFromChain,
  extractObjectChain,
  isObjectShallowModified
} from '../utils';

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
    updateContext(context: any) {
      // 因为 context 不是受控属性，直接共用引用好了
      // 否则还会触发孩子节点的重新渲染
      Object.assign(self.context, context);
    },
    setRuntimeError(error: any, errorStack: any) {
      self.runtimeError = error;
      self.runtimeErrorStack = errorStack;
    },
    updateLocation(location?: any, parseFn?: Function) {
      const query = parseFn ? parseFn(location) : parseQuery(location);
      if (isObjectShallowModified(query, self.query, false)) {
        self.query = query;
      }
    }
  }));

export type IRootStore = Instance<typeof RootStore>;
