import {
    types,
    SnapshotIn,
    getParent,
    flow,
    getEnv,
    getRoot
} from "mobx-state-tree";
import {
    iRendererStore,
} from './iRenderer';
import {
    FormItemStore,
    IFormItemStore
} from './formItem';
import {FormStore, IFormStore} from './form';

export const UniqueGroup = types
    .model('UniqueGroup', {
        name: types.identifier,
        items: types.array(types.reference(types.late(() => FormItemStore)))
    })

export type IUniqueGroup = typeof UniqueGroup.Type;

export const ComboStore = iRendererStore
    .named('ComboStore')
    .props({
        uniques: types.map(UniqueGroup),
        forms: types.array(types.reference(types.late(() => FormStore))),
        minLength: 0,
        maxLength: 0,
        length: 0
    })
    .views(self => ({
        get addable() {
            if (self.maxLength && self.length >= self.maxLength) {
                return false;
            }

            if (self.uniques.size) {
                let isFull = false;
                self.uniques.forEach(item => {
                    if (isFull || !item.items.length) {
                        return;
                    }

                    let total = item.items[0].options.length;
                    let current = item.items.reduce((total, item) => {
                        return total + item.selectedOptions.length;
                    }, 0)

                    isFull = total && (current >= total) ? true : false;
                });

                if (isFull) {
                    return false;
                }
            }

            return true;
        },

        get removable() {
            if (self.minLength && self.minLength >= self.length) {
                return false;
            }

            return true;
        }
    }))
    .actions(self => {
        function config(setting: {
            minLength?: number;
            maxLength?: number;
            length?: number;
        }) {
            typeof setting.minLength !== 'undefined' && (self.minLength = setting.minLength);
            typeof setting.maxLength !== 'undefined' && (self.maxLength = setting.maxLength);
            typeof setting.length !== 'undefined' && (self.length = setting.length);
        }

        function bindUniuqueItem(item:IFormItemStore) {
            if (!self.uniques.has(item.name)) {
                self.uniques.put({
                    name: item.name
                });
            }
            let group:IUniqueGroup = self.uniques.get(item.name) as IUniqueGroup;
            group.items.push(item);
        }

        function unBindUniuqueItem(item:IFormItemStore) {
            let group:IUniqueGroup = self.uniques.get(item.name) as IUniqueGroup;
            group.items.remove(item);
            if (!group.items.length) {
                self.uniques.delete(item.name);
            }
        }

        function addForm(form:IFormStore) {
            self.forms.push(form);
        }

        function removeForm(form:IFormStore) {
            self.forms.remove(form);
        }

        return {
            config,
            bindUniuqueItem,
            unBindUniuqueItem,
            addForm,
            removeForm
        };
    });

export type IComboStore = typeof ComboStore.Type;
export type SComboStore = SnapshotIn<typeof ComboStore>;
