import {
  types,
  getParent,
  Instance,
  SnapshotIn,
  isAlive
} from 'mobx-state-tree';

import {isVisible, hasVisibleExpression} from '../utils/helper';
import {iRendererStore} from './iRenderer';

export const Column = types
  .model('Column', {
    title: types.optional(types.frozen(), undefined),
    key: '',
    toggled: false,
    breakpoint: types.optional(types.frozen(), undefined),
    pristine: types.optional(types.frozen(), undefined),
    toggable: true,
    index: 0,
    type: ''
  })
  .actions(self => ({
    toggleToggle() {
      self.toggled = !self.toggled;
      const table = getParent(self, 2) as ITableStore;

      if (!table.activeToggaleColumns.length) {
        self.toggled = true;
      }

      table.persistSaveToggledColumns();
    },
    setToggled(value: boolean) {
      self.toggled = value;
    }
  }));

export type IColumn = Instance<typeof Column>;
export type SColumn = SnapshotIn<typeof Column>;

export const Row = types
  .model('Row', {
    data: types.frozen({} as any)
  });

export type IRow = Instance<typeof Row>;
export type SRow = SnapshotIn<typeof Row>;

export const TableStoreV2 = iRendererStore
  .named('TableStoreV2')
  .props({
    columns: types.array(Column),
    rows: types.array(Row),
    columnsToggable: types.optional(
      types.union(types.boolean, types.literal('auto')),
      'auto'
    )
  })
  .views(self => {
    function getToggable() {
      if (self.columnsToggable === 'auto') {
        return self.columns.filter.length > 10;
      }

      return self.columnsToggable;
    }

    function hasColumnHidden() {
      return self.columns.findIndex(column => !column.toggled) !== -1;
    }

    function getToggableColumns() {
      return self.columns.filter(
        item => isVisible(item.pristine, self.data) && item.toggable !== false
      );
    }

    function getActiveToggableColumns() {
      return getToggableColumns().filter(item => item.toggled);
    }

    function getFilteredColumns() {
      return self.columns.filter(
        item =>
        item &&
          isVisible(
            item.pristine,
            hasVisibleExpression(item.pristine) ? self.data : {}
          ) &&
          (item.toggled || !item.toggable)
      ).map(item => ({...item.pristine, type: item.type}));      
    }

    return {
      get toggable() {
        return getToggable();
      },

      get columnsData() {
        return self.columns;
      },

      get toggableColumns() {
        return getToggableColumns();
      },

      get filteredColumns() {
        return getFilteredColumns();
      },

      get activeToggaleColumns() {
        return getActiveToggableColumns();
      },

      // 是否隐藏了某列
      hasColumnHidden() {
        return hasColumnHidden();
      }
    }
  })
  .actions(self => {
    function update(config: Partial<STableStore>) {
      config.columnsToggable !== void 0 &&
        (self.columnsToggable = config.columnsToggable);

      if (config.columns && Array.isArray(config.columns)) {
        let columns: Array<SColumn> = config.columns
          .filter(column => column)
          .concat();

        columns = columns.map((item, index) => ({
          ...item,
            index,
            type: item.type || 'plain',
            pristine: item,
            toggled: item.toggled !== false,
            breakpoint: item.breakpoint
        }));

        self.columns.replace(columns as any);
      }
    }

    function persistSaveToggledColumns() {
      const key =
        location.pathname +
        self.path +
        self.toggableColumns.map(item => item.key || item.index).join('-');
      localStorage.setItem(
        key,
        JSON.stringify(self.activeToggaleColumns.map(item => item.index))
      );
    }

    return {
      update,
      persistSaveToggledColumns,

      // events
      afterCreate() {
        setTimeout(() => {
          if (!isAlive(self)) {
            return;
          }
          const key =
            location.pathname +
            self.path +
            self.toggableColumns.map(item => item.key || item.index).join('-');

          const data = localStorage.getItem(key);

          if (data) {
            const selectedColumns = JSON.parse(data);
            self.toggableColumns.forEach(item =>
              item.setToggled(!!~selectedColumns.indexOf(item.index))
            );
          }
        }, 200);
      }
    };
  });

export type ITableStore = Instance<typeof TableStoreV2>;
export type STableStore = SnapshotIn<typeof TableStoreV2>;
