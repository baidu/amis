import {
    types,
    getEnv,
    getRoot,
    SnapshotIn
} from "mobx-state-tree";
import {
    cloneObject,
    extendObject,
    createObject,
    isObjectShallowModified
} from '../utils/helper';
import {IRendererStore} from './index';
import { Action } from "../types";
import { dataMapping } from "../utils/tpl-builtin";

export const iRendererStore = types
    .model('iRendererStore', {
        id: types.identifier,
        path: '',
        storeType: types.string,
        hasRemoteData: types.optional(types.boolean, false),
        data: types.optional(types.frozen(), {}),
        updatedAt: 0, // 从服务端更新时刻
        pristine: types.optional(types.frozen(), {}),
        parentId: types.optional(types.string, ''),
        action: types.optional(types.frozen(), undefined),
        dialogOpen: false,
        dialogData: types.optional(types.frozen(), undefined),
        drawerOpen: false,
        drawerData: types.optional(types.frozen(), undefined),
    })
    .views((self) => {
        return {
            get parentStore():IIRendererStore | null {
                return self.parentId && getRoot(self) && (getRoot(self) as IRendererStore).storeType === 'RendererStore'
                    ? (getRoot(self) as IRendererStore).stores.get(self.parentId)
                    : null;
            }
        };
    })
    .actions((self) => {
        const dialogCallbacks = new Map();

        return {
            initData(data:object = {}) {
                self.pristine = data;
                self.data = data;
            },
    
            reset() {
                self.data = self.pristine;
            },
    
            updateData(data:object = {}, tag?: object) {
                const prev = self.data;
                let newData;
                if (tag) {
                    let proto = createObject((self.data as any).__super || null, tag);
                    newData = createObject(proto, {
                        ...self.data,
                        ...data
                    });
                } else {
                    newData = extendObject(self.data, data);
                }
    
                Object.defineProperty(newData, '__prev', {
                    value: {...prev},
                    enumerable: false,
                    configurable: false,
                    writable: false,
                });
    
                self.data = newData;
            },
    
            setCurrentAction(action:object) {
                self.action = action;
            },
    
            openDialog(ctx: any, additonal?:object, callback?: (ret:any) => void) {
                let proto = ctx.__super ? ctx.__super : self.data;
    
                if (additonal) {
                    proto = createObject(proto, additonal);
                }
    
                const data = createObject(proto, {
                    ...ctx
                });
    
                if (self.action.dialog && self.action.dialog.data) {
                    self.dialogData = createObject(proto, {
                        ...dataMapping(self.action.dialog.data, data)
                    });
                } else {
                    self.dialogData = data;
                }
                self.dialogOpen = true;

                if (callback) {
                    dialogCallbacks.set(self.dialogData, callback);
                }
            },
    
            closeDialog(result?:any) {
                const callback = dialogCallbacks.get(self.dialogData);

                self.dialogOpen = false;

                if (callback) {
                    dialogCallbacks.delete(self.dialogData);
                    setTimeout(() => callback(result), 200);
                }
            },
    
            openDrawer(ctx: any, additonal?:object, callback?: (ret:any) => void) {
                let proto = ctx.__super ? ctx.__super : self.data;
    
                if (additonal) {
                    proto = createObject(proto, additonal);
                }
    
                const data = createObject(proto, {
                    ...ctx
                });
    
                if (self.action.drawer.data) {
                    self.drawerData = dataMapping(self.action.drawer.data, data);
                } else {
                    self.drawerData = data;
                }
                self.drawerOpen = true;

                if (callback) {
                    dialogCallbacks.set(self.drawerData, callback);
                }
            },
    
            closeDrawer(result?:any) {
                const callback = dialogCallbacks.get(self.drawerData);
                self.drawerOpen = false;

                if (callback) {
                    dialogCallbacks.delete(self.drawerData);
                    setTimeout(() => callback(result), 200);
                }
            }
        };
    });


export type IIRendererStore = typeof iRendererStore.Type;
export type SIRendererStore = SnapshotIn<typeof iRendererStore>;
// export type SIRendererStore = typeof iRendererStore.SnapshotType;
