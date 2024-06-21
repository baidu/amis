import {ServiceStore} from './service';
import {types, SnapshotIn, Instance, isAlive} from 'mobx-state-tree';
import {createObject} from '../utils/helper';

export const ModalStore = ServiceStore.named('ModalStore')
  .props({
    entered: false,
    resizeCoord: 0,
    schema: types.frozen()
  })
  .views(self => {
    return {};
  })
  .actions(self => {
    return {
      setEntered(value: boolean) {
        self.entered = value;
      },

      reset() {
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
