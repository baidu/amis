import {ServiceStore} from './service';
import {types, SnapshotIn} from 'mobx-state-tree';
import {createObject} from '../utils/helper';

export const ModalStore = ServiceStore.named('ModalStore')
  .props({
    form: types.frozen()
  })
  .views(self => {
    return {
      get formData() {
        return createObject(self.data, self.form);
      }
    };
  })
  .actions(self => {
    return {
      setFormData(obj: any) {
        self.form = obj;
      }
    };
  });

export type IModalStore = typeof ModalStore.Type;
export type SModalStore = SnapshotIn<typeof ModalStore>;
