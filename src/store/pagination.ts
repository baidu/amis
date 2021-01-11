import {Instance, SnapshotIn, types} from 'mobx-state-tree';
import {createObject} from '../utils/helper';
import {resolveVariable} from '../utils/tpl-builtin';
import {iRendererStore} from './iRenderer';

export const PaginationStore = iRendererStore
  .named('PaginationStore')
  .props({
    page: 1,
    perPage: 10,
    inputName: '',
    outputName: '',
    mode: 'normal'
  })
  .views(self => ({
    get inputItems() {
      const items = resolveVariable(self.inputName || 'items', self.data);

      if (!Array.isArray(items)) {
        return [];
      }

      return items;
    },

    get locals() {
      const skip = (self.page - 1) * self.perPage;

      return createObject(self.data, {
        currentPage: self.page,
        lastPage: this.lastPage,
        [self.outputName || 'items']: this.inputItems.slice(
          skip,
          skip + self.perPage
        )
      });
    },
    get lastPage() {
      return Math.ceil(this.inputItems.length / self.perPage);
    }
  }))
  .actions(self => ({
    switchTo(page: number, perPage?: number) {
      self.page = page;

      if (typeof perPage === 'number') {
        self.perPage = perPage;
      }
    }
  }));

export type IPaginationStore = Instance<typeof PaginationStore>;
export type SPaginationStore = SnapshotIn<typeof PaginationStore>;
