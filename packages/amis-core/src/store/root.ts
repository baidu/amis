import {addDisposer, flow, Instance, types, isAlive} from 'mobx-state-tree';
import {parseQuery} from '../utils/helper';
import {ServiceStore} from './service';
import {
  createObjectFromChain,
  extractObjectChain,
  isObjectShallowModified,
  createObject,
  cloneObject
} from '../utils';
import {
  GlobalVariableItem,
  GlobalVariableState,
  GlobalVariableItemFull,
  buildGlobalVariable,
  createGlobalVarState,
  GlobalVarContext,
  GlobalVarGetter,
  GlobalVarBulkGetter,
  GlobalVarSetter,
  GlobalVarBulkSetter
} from '../globalVar';
import isPlainObject from 'lodash/isPlainObject';
import debounce from 'lodash/debounce';
import {reaction} from 'mobx';

export const RootStore = ServiceStore.named('RootStore')
  .props({
    runtimeError: types.frozen(),
    runtimeErrorStack: types.frozen(),
    query: types.frozen(),
    ready: false,

    // 临时变更，等 react 完成一轮渲染后，将临时变更切成正式变更
    // 主要是为了让可能需要重新渲染的部分组件可以实现 this.props.data 和 prevProps.data 不一致
    // 因为很多组件内部会 diff this.props.data 和 prevProps.data 来决定是否更新的逻辑
    globalVarTempStates: types.optional(
      types.map(types.frozen<GlobalVariableState>()),
      {}
    ),

    // 正式变更
    globalVarStates: types.optional(
      types.map(types.frozen<GlobalVariableState>()),
      {}
    )
  })
  .volatile(self => {
    return {
      context: {} as any,
      legacyGlobalTempContext: {} as any,
      globalVars: [] as Array<GlobalVariableItemFull>,
      globalData: {
        global: {},
        globalState: {}
      } as any
    };
  })
  .views(self => ({
    get nextGlobalData(): any {
      let globalData = {} as any;
      let globalState = {} as any;
      const chain = extractObjectChain(self.data);

      let touched = false;
      let saved = true;
      let errors: any = {};
      let initialized = true;
      self.globalVarTempStates.forEach((state, key) => {
        globalData[key] = state.value;
        touched = touched || state.touched;
        if (!state.saved) {
          saved = false;
        }

        if (state.errorMessages.length) {
          errors[key] = state.errorMessages;
        }
        if (!state.initialized) {
          initialized = false;
        }
      });

      globalState = {
        fields: self.globalVarTempStates.toJSON(),
        initialized: initialized,
        touched: touched,
        saved: saved,
        errors: errors,
        valid: !Object.keys(errors).length
      };
      chain.unshift({
        global: globalData,
        globalState: globalState
      });
      chain.unshift(self.legacyGlobalTempContext);
      chain.unshift(self.context);

      return createObjectFromChain(chain);
    },

    get downStream() {
      let result = self.data;

      if (self.context || self.query) {
        const chain = extractObjectChain(result);

        // 数据链中添加 global 和 globalState
        // 对应的是全局变量的值和全局变量的状态
        const globalData = {} as any;
        let touched = false;
        let saved = true;
        let errors: any = {};
        let initialized = true;
        self.globalVarStates.forEach((state, key) => {
          globalData[key] = state.value;
          touched = touched || state.touched;
          if (!state.saved) {
            saved = false;
          }

          if (state.errorMessages.length) {
            errors[key] = state.errorMessages;
          }
          if (!state.initialized) {
            initialized = false;
          }
        });

        // 保存全局变量的值和状态
        Object.assign(self.globalData.global, globalData);
        Object.assign(self.globalData.globalState, {
          fields: self.globalVarStates.toJSON(),
          initialized: initialized,
          touched: touched,
          saved: saved,
          errors: errors,
          valid: !Object.keys(errors).length
        });

        // self.globalData 一直都是那个对象，这样组件里面始终拿到的都是最新的
        chain.unshift(self.globalData);

        chain.unshift(self.context);
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
  .actions(self => {
    function updateState(key: string, state: Partial<GlobalVariableState>) {
      return (self as any).updateGlobalVarState(key, state);
    }

    const init: (schema: any) => Promise<any> = flow(function* init(
      fn: () => Promise<any>
    ) {
      try {
        const ret: any = fn();
        if (ret?.then) {
          yield ret;
        }
      } catch (e) {
        self.runtimeError = e.message;
        self.runtimeErrorStack = e.stack;
      } finally {
        self.ready = true;
      }
    });

    /**
     * 比较新旧变量列表的差异
     * @param vars 新的变量列表
     * @param originVars 原始变量列表
     * @returns 返回新增、更新和删除的变量列表
     */
    function diffVariables(
      vars: GlobalVariableItem[],
      originVars: GlobalVariableItem[]
    ) {
      const removeVars: Array<GlobalVariableItem> = originVars.concat();
      const updateVars: Array<GlobalVariableItem> = [];
      const newVars: Array<GlobalVariableItem> = [];

      for (let varItem of vars) {
        const idx = removeVars.findIndex(item => item.key === varItem.key);

        if (~idx) {
          const [origin] = removeVars.splice(idx, 1);

          if (origin.id !== varItem.id) {
            updateVars.push(varItem);
          }
        } else {
          newVars.push(varItem);
        }
      }

      return {
        newVars,
        updateVars,
        removeVars
      };
    }

    /**
     * 初始化单个全局变量
     */
    async function initGlobalVarData(
      item: GlobalVariableItemFull,
      context: GlobalVarContext,
      getter?: GlobalVarGetter
    ) {
      let value = item.defaultValue;

      if (getter) {
        await getGlobalVarData(item, context, getter);
        const state = self.globalVarTempStates.get(item.key)!;
        updateState(item.key, {
          initialized: true,
          pristine: state.value
        });
      } else {
        updateState(item.key, {
          value,
          pristine: value,
          initialized: item.bulkGetter ? false : true
        });
      }
    }

    /**
     * 批量初始化全局变量
     */
    async function getGlobalVarData(
      item: GlobalVariableItemFull,
      context: GlobalVarContext,
      getter: GlobalVarGetter
    ) {
      try {
        updateState(item.key, {
          busy: true
        });
        const value = await getter(item, context);
        updateState(item.key, {
          value
        });
      } finally {
        updateState(item.key, {
          busy: false
        });
      }
    }

    /**
     * 批量初始化全局变量
     */
    async function bulkGetGlobalVarData(
      variables: Array<GlobalVariableItem>,
      context: GlobalVarContext,
      getter: GlobalVarBulkGetter
    ) {
      try {
        variables.forEach(item => {
          updateState(item.key, {
            busy: true
          });
        });
        const data = await getter.call(null, {
          ...context,
          variables
        });

        if (!isPlainObject(data)) {
          return;
        }

        for (let key in data) {
          // 返回非定义部分的数据不处理
          if (!variables.some(item => item.key === key)) {
            continue;
          }

          const state = self.globalVarTempStates.get(key);
          if (state) {
            updateState(key, {
              value: data[key],
              pristine: data[key],
              initialized: true
            });
          }
        }
      } finally {
        variables.forEach(item => {
          updateState(item.key, {
            busy: false
          });
        });
      }
    }

    /**
     * 初始化全局变量
     */
    async function initializeGlobalVars(
      newVars: GlobalVariableItem[],
      updateVars: GlobalVariableItem[]
    ) {
      const variables = newVars.concat(updateVars);
      const context = {
        ...self.context,
        variables
      };
      const globalVars = variables.map(item =>
        buildGlobalVariable(item, context)
      );

      const bulkGetters: Array<{
        fn: GlobalVarBulkGetter;
        variables: Array<GlobalVariableItem>;
      }> = [];
      const itemsNotInitialized: Array<GlobalVariableItemFull> = [];

      for (let item of globalVars) {
        let state = self.globalVarTempStates.get(item.key);
        if (state?.initialized) {
          continue;
        }

        itemsNotInitialized.push(item);

        if (item.bulkGetter) {
          let getter = bulkGetters.find(a => a.fn === item.bulkGetter);
          if (!getter) {
            getter = {
              fn: item.bulkGetter,
              variables: []
            };
            bulkGetters.push(getter);
          }
          getter.variables.push(item);
        }
      }

      // 先单个初始化
      await Promise.all(
        itemsNotInitialized.map(item =>
          initGlobalVarData(item, context, item.getter)
        )
      );
      // 再批量初始化
      await Promise.all(
        bulkGetters.map(({fn, variables}) =>
          bulkGetGlobalVarData(variables, context, fn)
        )
      );

      return globalVars;
    }

    // 设置全局变量,返回一个Promise
    const setGlobalVars: (vars?: Array<GlobalVariableItem>) => Promise<any> =
      flow(function* setGlobalVars(vars?: Array<GlobalVariableItem>) {
        const {newVars, updateVars, removeVars} = diffVariables(
          vars || [],
          self.globalVars
        );

        // 初始化全局变量
        const globalVars = yield initializeGlobalVars(newVars, updateVars);

        if (!isAlive(self)) {
          return;
        }

        self.globalVars = globalVars;
        removeVars.forEach(item => {
          self.globalVarTempStates.delete(item.key);
        });

        syncGlobalVarStates();
      });

    // 更新全局变量的值
    const updateGlobalVarValue = (key: string, value: any) => {
      return modifyGlobalVarValue(key, {op: 'set', value});
    };

    // 如果对应变量是个对象，那么可以通过这个扩充变量的值
    const modifyGlobalVarValue = (
      key: string,
      options: {
        op:
          | 'set'
          | 'merge'
          | 'push'
          | 'unshift'
          | 'remove'
          | 'toggle'
          | 'empty'
          | 'sort'
          | 'reverse'
          | 'refresh';
        value: any;
      }
    ) => {
      const state = self.globalVarTempStates.get(key);
      if (!state) {
        return;
      }

      let value = state.value;

      switch (options.op) {
        case 'set':
          value = options.value;
          break;
        // 下面这些以后使用的地方再加
        // case 'merge':
        //   value = {
        //     ...isPlainObject(value) ? value : {},
        //     ...options.value
        //   };
        //   break;
        // case 'push':
        //   value = Array.isArray(value) ? value.concat() : [];
        //   value = value.concat(options.value);
        //   break;
        // case 'unshift':
        //   value = Array.isArray(value) ? value.concat() : [];
        //   value.unshift(options.value);
        //   break;
        // case 'remove':
        //   value = (Array.isArray(value) ? value : []).filter((item: any) => item !== options.value);
        //   break;
        // case 'toggle':
        //   value = value === options.value ? undefined : options.value;
        //   break;
        // case 'empty':
        //   value = [];
        //   break;
        // case 'sort':
        //   value = value.sort(options.value);
        //   break;
        // case 'reverse':
        //   value = value.reverse();
        //   break;
        default:
          break;
      }

      updateState(key, {
        value,
        touched: true
      });

      lazySaveGlobalVarValues();
    };

    /**
     * 保存单个全局变量的值
     */
    async function saveGlobalVarData(
      item: GlobalVariableItemFull,
      value: any,
      context: GlobalVarContext,
      setter: GlobalVarSetter
    ) {
      try {
        updateState(item.key, {
          busy: true
        });

        await setter(item, value, context);

        updateState(item.key, {
          saved: true
        });
      } finally {
        updateState(item.key, {
          busy: false
        });
      }
    }

    /**
     * 批量保存全局变量
     */
    async function bulkSaveGlobalVarData(
      variables: Array<GlobalVariableItem>,
      values: any,
      context: GlobalVarContext,
      setter: GlobalVarBulkSetter
    ) {
      try {
        variables.forEach(item => {
          updateState(item.key, {
            busy: true
          });
        });
        await setter(values, {
          ...context,
          variables
        });

        variables.forEach(item => {
          updateState(item.key, {
            saved: true
          });
        });
      } finally {
        variables.forEach(item => {
          updateState(item.key, {
            busy: false
          });
        });
      }
    }

    /**
     * 保存全局变量的值
     */
    async function saveGlobalVarValues(key?: string) {
      const context = {
        ...self.context,
        variables: self.globalVars
      };
      const setters: Array<{
        fn: GlobalVarSetter;
        value: any;
        item: GlobalVariableItem;
      }> = [];
      const bulkSetters: Array<{
        fn: GlobalVarBulkSetter;
        variables: Array<GlobalVariableItem>;
        values: any;
      }> = [];
      const values: any = {};
      for (let varItem of self.globalVars) {
        const state = self.globalVarTempStates.get(varItem.key);
        if (!state?.touched) {
          continue;
        } else if (key && key !== varItem.key) {
          continue;
        } else if (!key && varItem.autoSave === false) {
          // 没有指定 key，但是 autoSave 为 false 的不保存
          continue;
        }

        values[varItem.key] = state.value;
        if (varItem.setter) {
          setters.push({
            fn: varItem.setter,
            item: varItem,
            value: state.value
          });
        }

        if (varItem.bulkSetter) {
          let setter = bulkSetters.find(a => a.fn === varItem.bulkSetter);
          if (!setter) {
            setter = {
              fn: varItem.bulkSetter,
              variables: [],
              values: {}
            };
            bulkSetters.push(setter);
          }
          setter.variables.push(varItem);
          setter.values[varItem.key] = state.value;
        }
      }

      await Promise.all(
        setters
          .map(({fn, item, value}) =>
            saveGlobalVarData(item, value, context, fn)
          )
          .concat(
            bulkSetters.map(({variables, values, fn}) =>
              bulkSaveGlobalVarData(variables, values, context, fn)
            )
          )
      );
    }

    // 延迟保存全局变量的值
    const lazySaveGlobalVarValues = debounce(saveGlobalVarValues, 250, {
      trailing: true,
      leading: false
    });

    function syncGlobalVarStates() {
      self.globalVarStates.clear();
      self.globalVarTempStates.forEach((state, key) => {
        self.globalVarStates.set(key, {...state});
      });
    }

    function syncLegacyGlobalVarStates() {
      if (
        self.legacyGlobalTempContext.__page !== self.context.__page ||
        self.legacyGlobalTempContext.appVariables !== self.context.appVariables
      ) {
        Object.assign(self.context, self.legacyGlobalTempContext);
        self.data = cloneObject(self.data);
      }
    }

    let pendingCount = 0;
    let callbacks: Array<() => void> = [];
    function addSyncGlobalVarStatePendingTask(
      fn: (callback: () => void) => void,
      callback?: () => void
    ) {
      pendingCount++;
      callback && callbacks.push(callback);
      fn(() => {
        pendingCount--;

        if (pendingCount === 0) {
          callbacks.forEach(callback => callback());
          callbacks = [];
          if (isAlive(self)) {
            (self as any).syncGlobalVarStates();
            (self as any).syncLegacyGlobalVarStates();
          }
        }
      });
    }

    function observeSet(
      obj: Record<string, any>,
      callback: (value: any) => void
    ) {
      if (!obj || obj.__observed) {
        // 如果已经被观察过了，就不需要再观察了
        return obj;
      }
      let timer: ReturnType<typeof requestAnimationFrame> = 0;
      return new Proxy(
        {...obj},
        {
          get(target, prop: string) {
            if (prop === '__observed') {
              return true;
            }
            return Reflect.get(target, prop);
          },
          set(target, prop: string, value) {
            Reflect.set(target, prop, value);

            cancelAnimationFrame(timer);
            timer = requestAnimationFrame(() => callback(target));
            console.warn("Don't modify the context directly.");

            return true;
          }
        }
      );
    }

    return {
      updateContextBySetter(context: any) {
        this.updateContext(context);
        self.data = cloneObject(self.data);
      },
      updateContext(context: any, isInit = false) {
        // 因为 context 不是受控属性，直接共用引用好了
        // 否则还会触发孩子节点的重新渲染

        let {__page, appVariables, ...rest} = context || {};

        // 对历史用法做兼容
        if (__page || appVariables) {
          // 有部分用户直接在自定义动作脚本里面修改 __page 或者 appVariables 变量
          // 奇怪的是之前的实现方式这种修改是会更新变更的
          // 所以这里用 Proxy 来解决不更新的问题
          __page = __page
            ? observeSet(__page, __page =>
                (self as any).updateContextBySetter({...self.context, __page})
              )
            : __page;
          appVariables = appVariables
            ? observeSet(appVariables, appVariables =>
                (self as any).updateContextBySetter({
                  ...self.context,
                  appVariables
                })
              )
            : appVariables;

          if (isInit) {
            self.context.__page = __page;
            self.context.appVariables = appVariables;
          }

          self.legacyGlobalTempContext.__page = __page;
          self.legacyGlobalTempContext.appVariables = appVariables;
        }

        Object.assign(self.context, rest);
      },
      updateGlobalVarState(key: string, state: Partial<GlobalVariableState>) {
        const origin = self.globalVarTempStates.get(key);
        const newState = {
          ...(origin || createGlobalVarState()),
          ...state
        };
        self.globalVarTempStates.set(key, newState as any);
      },
      setGlobalVars,
      updateGlobalVarValue,
      modifyGlobalVarValue,
      saveGlobalVarValues: lazySaveGlobalVarValues,
      setRuntimeError(error: any, errorStack: any) {
        self.runtimeError = error;
        self.runtimeErrorStack = errorStack;
      },
      updateLocation(location?: any, parseFn?: Function) {
        const query = parseFn ? parseFn(location) : parseQuery(location);
        if (isObjectShallowModified(query, self.query, false)) {
          self.query = query;
        }
      },
      init: init,
      syncGlobalVarStates,
      syncLegacyGlobalVarStates,
      addSyncGlobalVarStatePendingTask,
      afterCreate() {
        addDisposer(
          self,
          reaction(
            () => self.nextGlobalData,
            () =>
              (self as any).addSyncGlobalVarStatePendingTask((callback: any) =>
                requestAnimationFrame(callback)
              )
          )
        );
      },
      afterDestroy() {
        lazySaveGlobalVarValues.flush();
      }
    };
  });

export type IRootStore = Instance<typeof RootStore>;
