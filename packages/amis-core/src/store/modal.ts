import {ServiceStore} from './service';
import {types, SnapshotIn, Instance, isAlive} from 'mobx-state-tree';
import {createObject} from '../utils/helper';

export const ModalStore = ServiceStore.named('ModalStore')
  .props({
    form: types.frozen(),
    entered: false,
    resizeCoord: 0,
    schema: types.frozen()
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
      setEntered(value: boolean) {
        self.entered = value;
      },
      setFormData(obj: any) {
        self.form = obj;
      },
      reset() {
        self.form = {};
        self.reInitData({}, true);
      },

      setResizeCoord(value: number) {
        self.resizeCoord = value;
      },

      setSchema(schema: any) {
        if (schema && schema.then) {
          schema.then(
            (value: any) => isAlive(self) && (self as any).setSchema(value)
          );
          return;
        }

        self.schema = schema;
      }
    };
  });

export type IModalStore = Instance<typeof ModalStore>;
export type SModalStore = SnapshotIn<typeof ModalStore>;
