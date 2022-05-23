import {
  types,
  getParent,
  Instance,
  SnapshotIn,
  isAlive,
  IAnyModelType,
  flow,
  getEnv
} from 'mobx-state-tree';
import find from 'lodash/find';
import isEqual from 'lodash/isEqual';

import {
  isVisible,
  hasVisibleExpression,
  isObjectShallowModified,
  qsstringify,
  guid,
  eachTree,
  createObject,
  flattenTree,
  isObject,
  immutableExtends,
  isEmpty,
  extendObject,
  findTree
} from '../utils/helper';
import {normalizeApiResponseData} from '../utils/api';
import {Api, Payload, fetchOptions, ApiObject} from '../types';
import {ServiceStore} from './service';

class ServerError extends Error {
  type = 'ServerError';
}

export const Column = types
  .model('Column', {
    title: types.optional(types.frozen(), undefined),
    key: '',
    toggled: false,
    breakpoint: types.optional(types.frozen(), undefined),
    pristine: types.optional(types.frozen(), undefined),
    toggable: true,
    index: 0,
    type: '',
    children: types.optional(
      types.array(types.late((): IAnyModelType => Column)),
      []
    )
  })
  .actions(self => ({
    toggleToggle() {
      self.toggled = !self.toggled;
      const table = getParent(self, 2) as ITableStoreV2;

      if (!table.activeToggaleColumns.length) {
        self.toggled = true;
      }

      table.persistSaveToggledColumns();
    },
    setToggled(value: boolean) {
      self.toggled = value;
    }
  }));

export type IColumnV2 = Instance<typeof Column>;
export type SColumnV2 = SnapshotIn<typeof Column>;

export const Row = types
  .model('Row', {
    storeType: 'Row',
    id: types.identifier,
    parentId: '',
    key: types.string,
    pristine: types.frozen({} as any), // 原始数据
    data: types.frozen({} as any),
    index: types.number,
    newIndex: types.number,
    depth: types.number, // 当前children位于第几层，便于使用getParent获取最顶层TableStore
    children: types.optional(
      types.array(types.late((): IAnyModelType => Row)),
      []
    ),
    path: '' // 行数据的位置
  })
  .views(self => ({
    get checked(): boolean {
      return (getParent(self, self.depth * 2) as ITableStoreV2).isSelected(
        self as IRowV2
      );
    },

    get modified() {
      if (!self.data) {
        return false;
      }

      return Object.keys(self.data).some(
        key => !isEqual(self.data[key], self.pristine[key])
      );
    },

    get moved() {
      return self.index !== self.newIndex;
    },

    get locals(): any {
      let children: Array<any> | null = null;
      if (self.children.length) {
        children = self.children.map(item => item.locals);
      }

      const parent = getParent(self, 2) as ITableStoreV2;
      return createObject(
        extendObject((getParent(self, self.depth * 2) as ITableStoreV2).data, {
          index: self.index,
          // todo 以后再支持多层，目前先一层
          parent: parent.storeType === Row.name ? parent.data : undefined
        }),
        children
          ? {
              ...self.data,
              children
            }
          : self.data
      );
    },

    getDataWithModifiedChilden() {
      let data = {
        ...self.data
      };

      if (data.children && self.children) {
        data.children = self.children.map(item =>
          item.getDataWithModifiedChilden()
        );
      }

      return data;
    }
  }))
  .actions(self => ({
    replaceWith(data: any) {
      Object.keys(data).forEach(key => {
        if (key !== 'id') {
          (self as any)[key] = data[key];
        }
      });

      if (Array.isArray(data.children)) {
        const arr = data.children;
        const pool = arr.concat();

        // 把多的删了先
        if (self.children.length > arr.length) {
          self.children.splice(arr.length, self.children.length - arr.length);
        }

        let index = 0;
        const len = self.children.length;
        while (pool.length) {
          // 因为父级id未更新，所以需要将子级的parentId正确指向父级id
          const item = {
            ...pool.shift(),
            parentId: self.id
          }!;

          if (index < len) {
            self.children[index].replaceWith(item);
          } else {
            const row = Row.create(item);
            self.children.push(row);
          }
          index++;
        }
      }
    },
    change(values: object, savePristine?: boolean) {
      self.data = immutableExtends(self.data, values);
      savePristine && (self.pristine = self.data);
    },
    reset() {
      self.newIndex = self.index;
      self.data = self.pristine;
    }
  }));

export type IRowV2 = Instance<typeof Row>;
export type SRowV2 = SnapshotIn<typeof Row>;

export const TableStoreV2 = ServiceStore.named('TableStoreV2')
  .props({
    columns: types.array(Column),
    rows: types.array(Row),
    selectedRowKeys: types.array(types.frozen()),
    selectedRows: types.array(types.reference(Row)),
    expandedRowKeys: types.array(types.frozen()),
    columnsTogglable: types.optional(
      types.union(types.boolean, types.literal('auto')),
      'auto'
    ),
    orderBy: '',
    order: types.optional(
      types.union(types.literal('asc'), types.literal('desc')),
      'asc'
    ),
    query: types.optional(types.frozen(), {}),
    pageNo: 1,
    pageSize: 10,
    dragging: false
  })
  .views(self => {
    function getToggable() {
      if (self.columnsTogglable === 'auto') {
        return self.columns.filter.length > 10;
      }

      return self.columnsTogglable;
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

    function getAllFilteredColumns(columns?: Array<SColumnV2>): Array<any> {
      if (columns) {
        return columns
          .filter(
            item =>
              item &&
              isVisible(
                item.pristine,
                hasVisibleExpression(item.pristine) ? self.data : {}
              ) &&
              (item.toggled || !item.toggable)
          )
          .map(item => ({
            ...item.pristine,
            type: item.type,
            children: item.children
              ? getAllFilteredColumns(item.children)
              : undefined
          }));
      }
      return [];
    }

    function getFilteredColumns() {
      return getAllFilteredColumns(self.columns);
    }

    function getUnSelectedRows() {
      return flattenTree<IRowV2>(self.rows).filter(
        (item: IRowV2) => !item.checked
      );
    }

    function getData(superData: any): any {
      return createObject(superData, {
        items: self.rows.map(item => item.data),
        selectedItems: self.selectedRows.map(item => item.data),
        unSelectedItems: getUnSelectedRows().map(item => item.data)
      });
    }

    function getRowByIndex(rowIndex: number, levels?: Array<string>): IRowV2 {
      if (levels && levels.length > 0) {
        const index = +(levels.shift() || 0);
        return getRowByIndex(index, levels);
      }
      return self.rows[rowIndex];
    }

    function isSelected(row: IRowV2): boolean {
      return !!~self.selectedRows.indexOf(row);
    }

    function getMovedRows() {
      return flattenTree(self.rows).filter((item: IRowV2) => item.moved);
    }

    function getMoved() {
      return getMovedRows().length;
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

      get dataSource() {
        return self.rows.map(item => item.data);
      },

      get currentSelectedRowKeys() {
        return self.selectedRowKeys.map(item => item);
      },

      get currentExpandedKeys() {
        return self.expandedRowKeys.map(item => item);
      },

      get unSelectedRows() {
        return getUnSelectedRows();
      },

      // 是否隐藏了某列
      hasColumnHidden() {
        return hasColumnHidden();
      },

      getData,

      getRowById(id: string) {
        return findTree(self.rows, item => item.id === id);
      },

      isSelected,

      getRowByIndex,

      get moved() {
        return getMoved();
      },

      get movedRows() {
        return getMovedRows();
      }
    };
  })
  .actions(self => {
    function updateColumns(columns: Array<SColumnV2>) {
      if (columns && Array.isArray(columns)) {
        let cols: Array<SColumnV2> = columns.filter(column => column).concat();

        cols = cols.map((item, index) => ({
          ...item,
          index,
          type: item.type || 'plain',
          pristine: item,
          toggled: item.toggled !== false,
          breakpoint: item.breakpoint,
          children: item.children ? updateColumns(item.children) : []
        }));

        return cols;
      }
      return;
    }

    function update(config: Partial<STableStoreV2>) {
      config.columnsTogglable !== void 0 &&
        (self.columnsTogglable = config.columnsTogglable);

      if (typeof config.orderBy === 'string') {
        setOrderByInfo(
          config.orderBy,
          config.order === 'desc' ? 'desc' : 'asc'
        );
      }

      if (config.columns && Array.isArray(config.columns)) {
        self.columns.replace(updateColumns(config.columns) as any);
      }
    }

    function exchange(fromIndex: number, toIndex: number, item?: IRow) {
      item = item || self.rows[fromIndex];

      if (item.parentId) {
        const parent: IRow = self.getRowById(item.parentId) as any;
        const offset = parent.children.indexOf(item) - fromIndex;
        toIndex += offset;
        fromIndex += offset;

        const newRows = parent.children.concat();
        newRows.splice(fromIndex, 1);
        newRows.splice(toIndex, 0, item);
        newRows.forEach((item, index) => (item.newIndex = index));
        parent.children.replace(newRows);
        return;
      }

      const newRows = self.rows.concat();
      newRows.splice(fromIndex, 1);
      newRows.splice(toIndex, 0, item);

      newRows.forEach((item, index) => (item.newIndex = index));
      self.rows.replace(newRows);
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

    function setOrderByInfo(key: string, direction: 'asc' | 'desc') {
      self.orderBy = key;
      self.order = direction;
    }

    function updateQuery(
      values: object,
      updater?: Function,
      pageNoField: string = 'pageNo',
      pageSizeField: string = 'pageSize',
      replace: boolean = false
    ) {
      const originQuery = self.query;
      self.query = replace
        ? {
            ...values
          }
        : {
            ...self.query,
            ...values
          };

      if (self.query[pageNoField || 'pageNo']) {
        self.pageNo = parseInt(self.query[pageNoField || 'pageNo'], 10);
      }

      if (self.query[pageSizeField || 'pageSize']) {
        self.pageSize = parseInt(self.query[pageSizeField || 'pageSize'], 10);
      }

      updater &&
        isObjectShallowModified(originQuery, self.query, false) &&
        setTimeout(updater.bind(null, `?${qsstringify(self.query)}`), 4);
    }

    function updateSelectedRows(
      rows: Array<any>,
      selectedKeys: Array<any>,
      keyField?: string
    ) {
      eachTree(rows, item => {
        if (~selectedKeys.indexOf(item.pristine[keyField || 'key'])) {
          self.selectedRows.push(item.id);
          self.selectedRowKeys.push(item.pristine[keyField || 'key']);
        } else if (
          find(selectedKeys, a => a && a == item.pristine[keyField || 'key'])
        ) {
          self.selectedRows.push(item.id);
          self.selectedRowKeys.push(item.pristine[keyField || 'key']);
        } else if (item.children) {
          updateSelectedRows(item.children, selectedKeys, keyField);
        }
      });
    }

    function updateSelected(selectedKeys: Array<any>, keyField?: string) {
      self.selectedRows.clear();
      self.selectedRowKeys.clear();

      updateSelectedRows(self.rows, selectedKeys, keyField);
    }

    function updateSelectedAll(keyField?: string) {
      const selectedKeys: Array<any> = [];
      eachTree(self.rows, item =>
        selectedKeys.push(item.pristine[keyField || 'key'])
      );
      updateSelectedRows(self.rows, selectedKeys, keyField);
    }

    function updateExpanded(expandedRowKeys: Array<any>, keyField?: string) {
      self.expandedRowKeys.clear();

      eachTree(self.rows, item => {
        if (~expandedRowKeys.indexOf(item.pristine[keyField || 'key'])) {
          self.expandedRowKeys.push(item.pristine[keyField || 'key']);
        } else if (
          find(expandedRowKeys, a => a && a == item.pristine[keyField || 'key'])
        ) {
          self.expandedRowKeys.push(item.pristine[keyField || 'key']);
        }
      });
    }

    // 尽可能的复用 row
    function replaceRow(arr: Array<SRowV2>, reUseRow?: boolean) {
      if (reUseRow === false) {
        self.rows.replace(arr.map(item => Row.create(item)));
        return;
      }

      const pool = arr.concat();

      // 把多的删了先
      if (self.rows.length > arr.length) {
        self.rows.splice(arr.length, self.rows.length - arr.length);
      }

      let index = 0;
      const len = self.rows.length;
      while (pool.length) {
        const item = pool.shift()!;

        if (index < len) {
          self.rows[index].replaceWith(item);
        } else {
          const row = Row.create(item);
          self.rows.push(row);
        }
        index++;
      }
    }

    function initChildren(
      children: Array<any>,
      depth: number,
      pindex: number,
      parentId: string,
      path: string = '',
      keyField?: string
    ): any {
      const key = keyField || 'children';

      depth += 1;
      return children.map((item, index) => {
        item = isObject(item)
          ? item
          : {
              item
            };
        const id = guid();

        return {
          id: id,
          parentId,
          key: String(`${pindex}-${depth}-${index}`),
          path: `${path}${index}`,
          depth: depth,
          index: index,
          newIndex: index,
          pristine: item,
          data: item,
          rowSpans: {},
          children:
            item && Array.isArray(item[key])
              ? initChildren(item[key], depth, index, id, `${path}${index}.`)
              : []
        };
      });
    }

    function initRows(
      rows: Array<any>,
      getEntryId?: (entry: any, index: number) => string,
      reUseRow?: boolean,
      keyField?: string
    ) {
      self.selectedRows.clear();

      const key = keyField || 'children';

      let arr: Array<SRowV2> = rows.map((item, index) => {
        let id = getEntryId ? getEntryId(item, index) : guid();

        return {
          id: id,
          key: String(`${index}-1-${index}`),
          index: index,
          newIndex: index,
          pristine: item,
          path: `${index}`,
          data: item,
          depth: 1, // 最大父节点默认为第一层，逐层叠加
          children:
            item && Array.isArray(item[key])
              ? initChildren(item[key], 1, index, id, `${index}.`, key)
              : []
        };
      });

      replaceRow(arr, reUseRow);
    }

    const saveRemote: (
      api: Api,
      data?: object,
      options?: fetchOptions
    ) => Promise<any> = flow(function* saveRemote(
      api: Api,
      data: object,
      options: fetchOptions = {}
    ) {
      try {
        options = {
          method: 'post', // 默认走 post
          ...options
        };

        self.markSaving(true);
        const json: Payload = yield getEnv(self).fetcher(api, data, options);
        self.markSaving(false);

        if (!isEmpty(json.data) || json.ok) {
          self.updateData(
            normalizeApiResponseData(json.data),
            {
              __saved: Date.now()
            },
            !!api && (api as ApiObject).replaceData
          );
          self.updatedAt = Date.now();
        }

        if (!json.ok) {
          self.updateMessage(
            json.msg ?? options.errorMessage ?? self.__('saveFailed'),
            true
          );
          getEnv(self).notify(
            'error',
            self.msg,
            json.msgTimeout !== undefined
              ? {
                  closeButton: true,
                  timeout: json.msgTimeout
                }
              : undefined
          );
          throw new ServerError(self.msg);
        } else {
          self.updateMessage(json.msg ?? options.successMessage);
          self.msg &&
            getEnv(self).notify(
              'success',
              self.msg,
              json.msgTimeout !== undefined
                ? {
                    closeButton: true,
                    timeout: json.msgTimeout
                  }
                : undefined
            );
        }
        return json.data;
      } catch (e) {
        self.markSaving(false);

        if (!isAlive(self) || self.disposed) {
          return;
        }

        e.type !== 'ServerError' && getEnv(self).notify('error', e.message);
        throw e;
      }
    });

    function reset() {
      self.rows.forEach(item => item.reset());
      let rows = self.rows.concat();
      eachTree(rows, item => {
        if (item.children) {
          let rows = item.children.concat().sort((a, b) => a.index - b.index);
          rows.forEach(item => item.reset());
          item.children.replace(rows);
        }
      });
      rows.forEach(item => item.reset());
      rows = rows.sort((a, b) => a.index - b.index);
      self.rows.replace(rows);
      self.dragging = false;
    }

    return {
      update,
      persistSaveToggledColumns,
      setOrderByInfo,
      updateQuery,
      initRows,
      updateSelected,
      updateSelectedAll,
      updateExpanded,
      exchange,
      reset,

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
      },
      saveRemote
    };
  });

export type ITableStoreV2 = Instance<typeof TableStoreV2>;
export type STableStoreV2 = SnapshotIn<typeof TableStoreV2>;
