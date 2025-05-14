import {Instance, SnapshotIn, types} from 'mobx-state-tree';
import {
  extendObject,
  createObject,
  getVariable,
  cloneObject,
  setVariable,
  deleteVariable
} from '../utils/helper';
import {dataMapping} from '../utils/tpl-builtin';
import {SimpleMap} from '../utils/SimpleMap';
import {StoreNode} from './node';
import {IScopedContext} from '../Scoped';
import {IRootStore} from './root';
import {
  concatData,
  createObjectFromChain,
  extractObjectChain,
  injectObjectChain
} from '../utils';
import {DataChangeReason} from '../types';
import findLastIndex from 'lodash/findLastIndex';

export const iRendererStore = StoreNode.named('iRendererStore')
  .props({
    hasRemoteData: types.optional(types.boolean, false),
    data: types.optional(types.frozen(), {}),
    initedAt: 0, // 初始 init 的时刻
    updatedAt: 0, // 从服务端更新时刻
    pristine: types.optional(types.frozen(), {}), // pristine 的数据可能会被表单项的默认值，form 的 initApi 等修改
    pristineRaw: types.optional(types.frozen(), {}), // pristine的原始值
    upStreamData: types.optional(types.frozen(), {}), // 最原始的数据，只有由上游同步下来时才更新。用来判断是否变化过
    action: types.optional(types.frozen(), undefined),
    dialogSchema: types.frozen(),
    dialogOpen: false,
    dialogData: types.optional(types.frozen(), undefined),
    drawerSchema: types.frozen(),
    drawerOpen: false,
    drawerData: types.optional(types.frozen(), undefined)
  })
  .views(self => ({
    getValueByName(name: string, canAccessSuper: boolean = true) {
      return getVariable(self.data, name, canAccessSuper);
    },

    getPristineValueByName(name: string) {
      return getVariable(self.pristine, name, false);
    },

    get pristineDiff() {
      const data: any = {};
      Object.keys(self.pristine).forEach(key => {
        if (self.pristine[key] !== self.pristineRaw[key]) {
          data[key] = self.pristine[key];
        }
      });
      return data;
    }
  }))
  .actions(self => {
    const dialogCallbacks = new SimpleMap<
      (confirmed?: any, value?: any) => void
    >();
    let dialogScoped: IScopedContext | null = null;
    let drawerScoped: IScopedContext | null = null;
    let top: IRootStore | null = null;

    return {
      setTopStore(value: any) {
        top = value;
      },

      initData(
        data: object = {},
        skipSetPristine = false,
        changeReason?: DataChangeReason
      ) {
        self.initedAt = Date.now();

        if (self.data.__tag) {
          data = injectObjectChain(data, self.data.__tag);
        }

        if (!skipSetPristine) {
          self.pristine = data;
          self.pristineRaw = data;
        }

        changeReason &&
          Object.isExtensible(data) &&
          !(data as any).__changeReason &&
          Object.defineProperty(data, '__changeReason', {
            value: changeReason,
            enumerable: false,
            configurable: false,
            writable: false
          });

        self.data = data;
        self.upStreamData = data;
      },

      // 临时更新全局变量
      temporaryUpdateGlobalVars(globalVar: any) {
        const chain = extractObjectChain(self.data).filter(
          (item: any) => !item.hasOwnProperty('__isTempGlobalLayer')
        );
        const idx = findLastIndex(
          chain,
          item =>
            item.hasOwnProperty('global') || item.hasOwnProperty('globalState')
        );

        if (idx !== -1) {
          chain.splice(idx + 1, 0, {
            ...globalVar,
            __isTempGlobalLayer: true
          });
        }

        self.data = createObjectFromChain(chain);
      },

      // 撤销临时更新全局变量
      unDoTemporaryUpdateGlobalVars() {
        const chain = extractObjectChain(self.data).filter(
          (item: any) => !item.hasOwnProperty('__isTempGlobalLayer')
        );
        self.data = createObjectFromChain(chain);
      },

      reset() {
        self.data = self.pristine;
      },

      updateData(
        data: object = {},
        tag?: object,
        replace?: boolean,
        concatFields?: string | string[],
        changeReason?: DataChangeReason
      ) {
        if (concatFields) {
          data = concatData(data, self.data, concatFields);
        }

        const prev = self.data;
        let newData;
        if (tag) {
          let proto = createObject((self.data as any).__super || null, {
            ...tag,
            __tag: tag
          });
          newData = createObject(proto, {
            ...(replace ? {} : self.data),
            ...data
          });
        } else {
          newData = extendObject(self.data, data, !replace);
        }

        Object.defineProperty(newData, '__prev', {
          value: {...prev},
          enumerable: false,
          configurable: false,
          writable: false
        });

        changeReason &&
          Object.isExtensible(newData) &&
          !(newData as any).__changeReason &&
          Object.defineProperty(newData, '__changeReason', {
            value: changeReason,
            enumerable: false,
            configurable: false,
            writable: false
          });

        self.data = newData;
      },

      changeValue(
        name: string,
        value: any,
        changePristine?: boolean,
        force?: boolean,
        otherModifier?: (data: Object) => void,
        changeReason?: DataChangeReason
      ) {
        if (!name) {
          return;
        }

        const origin = getVariable(self.data, name, false);

        if (value === origin && !force) {
          return;
        }

        const prev = self.data;
        const data = cloneObject(self.data);
        if (prev.hasOwnProperty('__prev')) {
          // 基于之前的 __prev 改
          const prevData = cloneObject(prev.__prev);
          setVariable(prevData, name, origin);
          Object.defineProperty(data, '__prev', {
            value: prevData,
            enumerable: false,
            configurable: false,
            writable: false
          });
        } else {
          Object.defineProperty(data, '__prev', {
            value: {...prev},
            enumerable: false,
            configurable: false,
            writable: false
          });
        }

        if (value === undefined) {
          deleteVariable(data, name);
        } else {
          setVariable(data, name, value);
        }

        otherModifier?.(data);

        if (changePristine) {
          const pristine = cloneObject(self.pristine);
          setVariable(pristine, name, value);
          otherModifier?.(pristine);
          self.pristine = pristine;
        }

        if (!data.__pristine) {
          Object.defineProperty(data, '__pristine', {
            value: self.pristine,
            enumerable: false,
            configurable: false,
            writable: false
          });
        }

        changeReason &&
          Object.isExtensible(data) &&
          !data.__changeReason &&
          Object.defineProperty(data, '__changeReason', {
            value: changeReason,
            enumerable: false,
            configurable: false,
            writable: false
          });

        self.data = data;
      },

      setCurrentAction(action: any, resolveDefinitions?: (schema: any) => any) {
        // 处理 $ref
        resolveDefinitions &&
          ['dialog', 'drawer'].forEach(key => {
            if (action[key]?.$ref) {
              action = {
                ...action,
                [key]: {
                  ...resolveDefinitions(action[key].$ref),
                  ...action[key]
                }
              };
            }
          });

        self.action = action;
      },

      openDialog(
        ctx: any,
        additonal?: object,
        callback?: (confirmed: boolean, values: any) => void,
        scoped?: IScopedContext
      ) {
        const chain = extractObjectChain(ctx);
        chain.length === 1 && chain.unshift(self.data);
        if (additonal) {
          chain.splice(chain.length - 1, 0, additonal);
        }

        const data = createObjectFromChain(chain);
        const mappingData = self.action.data ?? self.action.dialog?.data;
        if (mappingData) {
          self.dialogData = createObjectFromChain([
            top?.context,
            dataMapping(mappingData, data)
          ]);

          const clonedAction = {
            ...self.action,
            dialog: {
              ...self.action.dialog
            }
          };
          delete clonedAction.dialog.data;
          self.action = clonedAction;
        } else {
          self.dialogData = data;
        }
        self.dialogSchema = self.action.dialog;
        self.dialogOpen = true;
        callback && dialogCallbacks.set(self.dialogData, callback);
        dialogScoped = scoped || null;
      },

      closeDialog(confirmed?: any, data?: any) {
        const callback = dialogCallbacks.get(self.dialogData);

        // 不要过早的清空，否则内部组件提前销毁，会出现 store 异常读取问题
        // self.dialogSchema = null;
        self.dialogOpen = false;
        dialogScoped = null;

        if (callback) {
          dialogCallbacks.delete(self.dialogData);
          setTimeout(() => callback(confirmed, data), 200);
        }
      },

      openDrawer(
        ctx: any,
        additonal?: object,
        callback?: (confirmed: boolean, ret: any) => void,
        scoped?: IScopedContext
      ) {
        const chain = extractObjectChain(ctx);
        chain.length === 1 && chain.unshift(self.data);
        if (additonal) {
          chain.splice(chain.length - 1, 0, additonal);
        }

        const data = createObjectFromChain(chain);

        const mappingData = self.action.data ?? self.action.drawer.data;
        if (mappingData) {
          self.drawerData = createObjectFromChain([
            top?.context,
            dataMapping(mappingData, data)
          ]);

          const clonedAction = {
            ...self.action,
            drawer: {
              ...self.action.drawer
            }
          };
          delete clonedAction.drawer.data;
          self.action = clonedAction;
        } else {
          self.drawerData = data;
        }
        self.drawerSchema = self.action.drawer;
        self.drawerOpen = true;

        if (callback) {
          dialogCallbacks.set(self.drawerData, callback);
        }

        drawerScoped = scoped || null;
      },

      closeDrawer(confirmed?: any, data?: any) {
        const callback = dialogCallbacks.get(self.drawerData);

        // 不要过早的清空，否则内部组件提前销毁，会出现 store 异常读取问题
        // self.drawerSchema = null;
        self.drawerOpen = false;
        drawerScoped = null;

        if (callback) {
          dialogCallbacks.delete(self.drawerData);
          setTimeout(() => callback(confirmed, data), 200);
        }
      },

      getDialogScoped() {
        return dialogScoped;
      },

      getDrawerScoped() {
        return drawerScoped;
      }
    };
  });

export type IIRendererStore = Instance<typeof iRendererStore>;
export type SIRendererStore = SnapshotIn<typeof iRendererStore>;
// export type SIRendererStore = typeof iRendererStore.SnapshotType;
