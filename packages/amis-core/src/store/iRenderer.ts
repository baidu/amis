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
import {createObjectFromChain, extractObjectChain} from '../utils';

export const iRendererStore = StoreNode.named('iRendererStore')
  .props({
    hasRemoteData: types.optional(types.boolean, false),
    data: types.optional(types.frozen(), {}),
    initedAt: 0, // 初始 init 的时刻
    updatedAt: 0, // 从服务端更新时刻
    pristine: types.optional(types.frozen(), {}),
    action: types.optional(types.frozen(), undefined),
    dialogOpen: false,
    dialogData: types.optional(types.frozen(), undefined),
    drawerOpen: false,
    drawerData: types.optional(types.frozen(), undefined)
  })
  .views(self => ({
    getValueByName(name: string, canAccessSuper: boolean = true) {
      return getVariable(self.data, name, canAccessSuper);
    },

    getPristineValueByName(name: string) {
      return getVariable(self.pristine, name, false);
    }
  }))
  .actions(self => {
    const dialogCallbacks = new SimpleMap<(result?: any) => void>();
    let dialogScoped: IScopedContext | null = null;
    let drawerScoped: IScopedContext | null = null;
    let top: IRootStore | null = null;

    return {
      setTopStore(value: any) {
        top = value;
      },

      initData(data: object = {}, skipSetPristine = false) {
        self.initedAt = Date.now();

        !skipSetPristine && (self.pristine = data);
        self.data = data;
      },

      reset() {
        self.data = self.pristine;
      },

      updateData(data: object = {}, tag?: object, replace?: boolean) {
        const prev = self.data;
        let newData;
        if (tag) {
          let proto = createObject((self.data as any).__super || null, tag);
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

        self.data = newData;
      },

      changeValue(
        name: string,
        value: any,
        changePristine?: boolean,
        force?: boolean,
        otherModifier?: (data: Object) => void
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

        self.data = data;
      },

      setCurrentAction(action: object) {
        self.action = action;
      },

      openDialog(
        ctx: any,
        additonal?: object,
        callback?: (ret: any) => void,
        scoped?: IScopedContext
      ) {
        const chain = extractObjectChain(ctx);
        chain.length === 1 && chain.unshift(self.data);
        if (additonal) {
          chain.splice(chain.length - 1, 0, additonal);
        }

        const data = createObjectFromChain(chain);

        if (self.action.dialog && self.action.dialog.data) {
          self.dialogData = createObjectFromChain([
            top?.context,
            dataMapping(self.action.dialog.data, data)
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
        self.dialogOpen = true;
        callback && dialogCallbacks.set(self.dialogData, callback);
        dialogScoped = scoped || null;
      },

      closeDialog(result?: any) {
        const callback = dialogCallbacks.get(self.dialogData);

        self.dialogOpen = false;
        dialogScoped = null;

        if (callback) {
          dialogCallbacks.delete(self.dialogData);
          setTimeout(() => callback(result), 200);
        }
      },

      openDrawer(
        ctx: any,
        additonal?: object,
        callback?: (ret: any) => void,
        scoped?: IScopedContext
      ) {
        const chain = extractObjectChain(ctx);
        chain.length === 1 && chain.unshift(self.data);
        if (additonal) {
          chain.splice(chain.length - 1, 0, additonal);
        }

        const data = createObjectFromChain(chain);

        if (self.action.drawer.data) {
          self.drawerData = createObjectFromChain([
            top?.context,
            dataMapping(self.action.drawer.data, data)
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
        self.drawerOpen = true;

        if (callback) {
          dialogCallbacks.set(self.drawerData, callback);
        }

        drawerScoped = scoped || null;
      },

      closeDrawer(result?: any) {
        const callback = dialogCallbacks.get(self.drawerData);
        self.drawerOpen = false;
        drawerScoped = null;

        if (callback) {
          dialogCallbacks.delete(self.drawerData);
          setTimeout(() => callback(result), 200);
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
