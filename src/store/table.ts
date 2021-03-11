import {
  types,
  getParent,
  SnapshotIn,
  flow,
  getEnv,
  getRoot,
  IAnyModelType,
  isAlive,
  Instance
} from 'mobx-state-tree';
import {iRendererStore} from './iRenderer';
import {resolveVariable} from '../utils/tpl-builtin';
import isEqual from 'lodash/isEqual';
import find from 'lodash/find';
import {
  isBreakpoint,
  createObject,
  isObject,
  isVisible,
  guid,
  findTree,
  flattenTree,
  eachTree,
  difference,
  immutableExtends,
  extendObject,
  hasVisibleExpression
} from '../utils/helper';
import {evalExpression} from '../utils/tpl';
import {IFormStore} from './form';
import {getStoreById} from './manager';

export const Column = types
  .model('Column', {
    label: types.optional(types.frozen(), undefined),
    type: types.optional(types.string, 'plain'),
    name: types.maybe(types.string),
    value: types.frozen(),
    groupName: '',
    toggled: false,
    toggable: true,
    expandable: false,
    isPrimary: false,
    searchable: types.maybe(types.frozen()),
    sortable: false,
    filterable: types.optional(types.frozen(), undefined),
    fixed: '',
    index: 0,
    rawIndex: 0,
    breakpoint: types.optional(types.frozen(), undefined),
    pristine: types.optional(types.frozen(), undefined),
    remark: types.optional(types.frozen(), undefined),
    className: ''
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
    id: types.identifier,
    parentId: '',
    key: types.string,
    pristine: types.frozen({} as any),
    data: types.frozen({} as any),
    rowSpans: types.frozen({} as any),
    index: types.number,
    newIndex: types.number,
    expandable: false,
    isHover: false,
    children: types.optional(
      types.array(types.late((): IAnyModelType => Row)),
      []
    ),
    depth: types.number // 当前children位于第几层，便于使用getParent获取最顶层TableStore
  })
  .views(self => ({
    get checked(): boolean {
      return (getParent(self, self.depth * 2) as ITableStore).isSelected(
        self as IRow
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
    },

    get collapsed(): boolean {
      const table = getParent(self, self.depth * 2) as ITableStore;
      if (table.dragging) {
        return true;
      }

      let from: IRow = self as any;

      while (from && (from as any) !== table) {
        if (!table.isExpanded(from)) {
          return true;
        }

        from = getParent(from, 2);
      }

      return false;
    },

    get expanded(): boolean {
      return !this.collapsed;
    },

    get moved() {
      return self.index !== self.newIndex;
    },

    get locals(): any {
      return createObject(
        extendObject((getParent(self, self.depth * 2) as ITableStore).data, {
          index: self.index
        }),
        self.data
      );
    },

    get checkable(): boolean {
      const table = getParent(self, self.depth * 2) as ITableStore;
      return table && table.itemCheckableOn
        ? evalExpression(table.itemCheckableOn, (self as IRow).locals)
        : true;
    },

    get draggable(): boolean {
      const table = getParent(self, self.depth * 2) as ITableStore;
      return table && table.itemDraggableOn
        ? evalExpression(table.itemDraggableOn, (self as IRow).locals)
        : true;
    }
  }))
  .actions(self => ({
    toggle() {
      (getParent(self, self.depth * 2) as ITableStore).toggle(self as IRow);
    },

    toggleExpanded() {
      (getParent(self, self.depth * 2) as ITableStore).toggleExpanded(
        self as IRow
      );
    },

    change(values: object, savePristine?: boolean) {
      self.data = immutableExtends(self.data, values);
      savePristine && (self.pristine = self.data);
    },

    reset() {
      self.newIndex = self.index;
      self.data = self.pristine;
    },

    setIsHover(value: boolean) {
      self.isHover = value;
    },

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
          const item = pool.shift()!;

          if (index < len) {
            self.children[index].replaceWith(item);
          } else {
            const row = Row.create(item);
            self.children.push(row);
          }
          index++;
        }
      }
    }
  }));

export type IRow = Instance<typeof Row>;
export type SRow = SnapshotIn<typeof Row>;

export const TableStore = iRendererStore
  .named('TableStore')
  .props({
    columns: types.array(Column),
    rows: types.array(Row),
    selectedRows: types.array(types.reference(Row)),
    expandedRows: types.array(types.reference(Row)),
    primaryField: 'id',
    orderBy: '',
    orderDir: types.optional(
      types.union(types.literal('asc'), types.literal('desc')),
      'asc'
    ),
    draggable: false,
    dragging: false,
    selectable: false,
    multiple: true,
    footable: types.frozen(),
    expandConfig: types.frozen(),
    isNested: false,
    columnsTogglable: types.optional(
      types.union(types.boolean, types.literal('auto')),
      'auto'
    ),
    itemCheckableOn: '',
    itemDraggableOn: '',
    hideCheckToggler: false,
    combineNum: 0,
    formsRef: types.optional(types.array(types.frozen()), [])
  })
  .views(self => {
    function getForms() {
      return self.formsRef.map(item => ({
        store: getStoreById(item.id) as IFormStore,
        rowIndex: item.rowIndex
      }));
    }

    function getFilteredColumns() {
      return self.columns.filter(
        item =>
          item &&
          isVisible(
            item.pristine,
            hasVisibleExpression(item.pristine) ? self.data : {}
          ) &&
          (item.type === '__checkme'
            ? self.selectable &&
              !self.dragging &&
              !self.hideCheckToggler &&
              self.rows.length
            : item.type === '__dragme'
            ? self.dragging
            : item.type === '__expandme'
            ? (getFootableColumns().length || self.isNested) && !self.dragging
            : (item.toggled || !item.toggable) &&
              (!self.footable ||
                !item.breakpoint ||
                !isBreakpoint(item.breakpoint)))
      );
    }

    function getFootableColumns() {
      return self.columns.filter(item =>
        item.type === '__checkme' ||
        item.type === '__dragme' ||
        item.type === '__expandme'
          ? false
          : (item.toggled || !item.toggable) &&
            self.footable &&
            item.breakpoint &&
            isBreakpoint(item.breakpoint)
      );
    }

    function getLeftFixedColumns() {
      if (self.dragging) {
        return [];
      }

      let columns = getFilteredColumns().filter(item => item.fixed === 'left');

      // 有才带过去，没有就不带了
      if (columns.length) {
        columns = getFilteredColumns().filter(
          item => item.fixed === 'left' || /^__/.test(item.type)
        );
      }

      return columns;
    }

    function getRightFixedColumns() {
      if (self.dragging) {
        return [];
      }

      return getFilteredColumns().filter(item => item.fixed === 'right');
    }

    function isSelected(row: IRow): boolean {
      return !!~self.selectedRows.indexOf(row);
    }

    function isExpanded(row: IRow): boolean {
      return !!~self.expandedRows.indexOf(row);
    }

    function getTogglable() {
      if (self.columnsTogglable === 'auto') {
        return self.columns.filter(item => !/^__/.test(item.type)).length > 5;
      }

      return self.columnsTogglable;
    }

    function getToggableColumns() {
      return self.columns.filter(
        item => isVisible(item.pristine, self.data) && item.toggable !== false
      );
    }

    function getActiveToggableColumns() {
      return getToggableColumns().filter(item => item.toggled);
    }

    function getModifiedRows(rows: IRow[] = [], modifiedRows: IRow[] = []) {
      rows = rows && rows.length ? rows : self.rows;
      rows.forEach((item: IRow) => {
        if (item.children && item.children.length) {
          getModifiedRows(item.children, modifiedRows);
        }
        let diff = difference(item.data, item.pristine);
        let hasDifference = Object.keys(diff).length;
        if (hasDifference) {
          modifiedRows.push(item);
        }
      });
      return modifiedRows;
    }

    function getModified() {
      return getModifiedRows().length;
    }

    function getMovedRows() {
      return flattenTree(self.rows).filter((item: IRow) => item.moved);
    }

    function getMoved() {
      return getMovedRows().length;
    }

    function getHoverIndex(): number {
      return self.rows.findIndex(item => item.isHover);
    }

    function getUnSelectedRows() {
      return self.rows.filter(item => !item.checked);
    }

    function getData(superData: any): any {
      return createObject(superData, {
        items: self.rows.map(item => item.data),
        selectedItems: self.selectedRows.map(item => item.data),
        unSelectedItems: getUnSelectedRows().map(item => item.data)
      });
    }

    function getColumnGroup(): Array<{
      label: string;
      index: number;
      colSpan: number;
      has: Array<any>;
    }> {
      const columsn = getFilteredColumns();
      const len = columsn.length;

      if (!len) {
        return [];
      }

      const result: Array<{
        label: string;
        index: number;
        colSpan: number;
        has: Array<any>;
      }> = [
        {
          label: columsn[0].groupName,
          colSpan: 1,
          index: columsn[0].index,
          has: [columsn[0]]
        }
      ];

      //  如果是勾选栏，让它和下一列合并。
      if (columsn[0].type === '__checkme' && columsn[1]) {
        result[0].label = columsn[1].groupName;
      }

      for (let i = 1; i < len; i++) {
        let prev = result[result.length - 1];
        const current = columsn[i];

        if (current.groupName === prev.label) {
          prev.colSpan++;
          prev.has.push(current);
        } else {
          result.push({
            label: current.groupName,
            colSpan: 1,
            index: current.index,
            has: [current]
          });
        }
      }

      if (result.length === 1 && !result[0].label) {
        result.pop();
      }

      return result;
    }

    return {
      get forms() {
        return getForms();
      },

      get filteredColumns() {
        return getFilteredColumns();
      },

      get footableColumns() {
        return getFootableColumns();
      },

      get leftFixedColumns() {
        return getLeftFixedColumns();
      },

      get rightFixedColumns() {
        return getRightFixedColumns();
      },

      get toggableColumns() {
        return getToggableColumns();
      },

      get activeToggaleColumns() {
        return getActiveToggableColumns();
      },

      get someChecked() {
        return !!self.selectedRows.length;
      },

      get allChecked(): boolean {
        return !!(
          self.selectedRows.length ===
            (self as ITableStore).checkableRows.length &&
          (self as ITableStore).checkableRows.length
        );
      },

      isSelected,

      get allExpanded() {
        return !!(
          self.expandedRows.length === self.rows.length && self.rows.length
        );
      },

      isExpanded,

      get toggable() {
        return getTogglable();
      },

      get modified() {
        return getModified();
      },

      get modifiedRows() {
        return getModifiedRows();
      },

      get unSelectedRows() {
        return getUnSelectedRows();
      },

      get checkableRows() {
        return self.rows.filter(item => item.checkable);
      },

      get moved() {
        return getMoved();
      },

      get movedRows() {
        return getMovedRows();
      },

      get hoverIndex() {
        return getHoverIndex();
      },

      getData,

      get columnGroup() {
        return getColumnGroup();
      },

      getRowById(id: string) {
        return findTree(self.rows, item => item.id === id);
      },

      getItemsByName(name: string): any {
        return this.forms
          .filter(form => form.rowIndex === parseInt(name, 10))
          .map(item => item.store);
      }
    };
  })
  .actions(self => {
    function update(config: Partial<STableStore>) {
      config.primaryField !== void 0 &&
        (self.primaryField = config.primaryField);
      config.selectable !== void 0 && (self.selectable = config.selectable);
      config.columnsTogglable !== void 0 &&
        (self.columnsTogglable = config.columnsTogglable);
      config.draggable !== void 0 && (self.draggable = config.draggable);

      if (typeof config.orderBy === 'string') {
        setOrderByInfo(
          config.orderBy,
          config.orderDir === 'desc' ? 'desc' : 'asc'
        );
      }

      config.multiple !== void 0 && (self.multiple = config.multiple);
      config.footable !== void 0 && (self.footable = config.footable);
      config.expandConfig !== void 0 &&
        (self.expandConfig = config.expandConfig);
      config.itemCheckableOn !== void 0 &&
        (self.itemCheckableOn = config.itemCheckableOn);
      config.itemDraggableOn !== void 0 &&
        (self.itemDraggableOn = config.itemDraggableOn);
      config.hideCheckToggler !== void 0 &&
        (self.hideCheckToggler = !!config.hideCheckToggler);

      config.combineNum !== void 0 &&
        (self.combineNum = parseInt(config.combineNum as any, 10) || 0);

      if (config.columns && Array.isArray(config.columns)) {
        let columns: Array<SColumn> = config.columns
          .filter(column => column)
          .concat();
        if (!columns.length) {
          columns.push({
            type: 'text',
            label: '空'
          });
        }

        columns.unshift({
          type: '__expandme',
          toggable: false,
          className: 'Table-expandCell'
        });

        columns.unshift({
          type: '__checkme',
          fixed: 'left',
          toggable: false,
          className: 'Table-checkCell'
        });

        columns.unshift({
          type: '__dragme',
          toggable: false,
          className: 'Table-dragCell'
        });

        columns = columns.map((item, index) => ({
          ...item,
          index,
          rawIndex: index - 3,
          type: item.type || 'plain',
          pristine: item,
          toggled: item.toggled !== false,
          breakpoint: item.breakpoint,
          isPrimary: index === 3
        }));

        self.columns.replace(columns as any);
      }
    }

    function combineCell(arr: Array<SRow>, keys: Array<string>): Array<SRow> {
      if (!keys.length || !arr.length) {
        return arr;
      }

      const key: string = keys.shift() as string;
      let rowIndex = 0;
      let row = arr[rowIndex];
      row.rowSpans[key] = 1;
      let value = resolveVariable(key, row.data);
      for (let i = 1, len = arr.length; i < len; i++) {
        const current = arr[i];
        if (isEqual(resolveVariable(key, current.data), value)) {
          row.rowSpans[key] += 1;
          current.rowSpans[key] = 0;
        } else {
          if (row.rowSpans[key] > 1) {
            combineCell(arr.slice(rowIndex, i), keys.concat());
          }

          rowIndex = i;
          row = current;
          row.rowSpans[key] = 1;
          value = resolveVariable(key, row.data);
        }
      }

      if (row.rowSpans[key] > 1 && keys.length) {
        combineCell(arr.slice(rowIndex, arr.length), keys.concat());
      }

      return arr;
    }

    function autoCombineCell(
      arr: Array<SRow>,
      columns: Array<IColumn>,
      maxCount: number
    ): Array<SRow> {
      if (!columns.length || !maxCount || !arr.length) {
        return arr;
      }

      const keys: Array<string> = [];
      for (let i = 0; i < maxCount; i++) {
        const column = columns[i];

        // maxCount 可能比实际配置的 columns 还有多。
        if (!column) {
          break;
        }

        if ('__' === column.type.substring(0, 2)) {
          maxCount++;
          continue;
        }

        const key = column.name;
        if (!key) {
          break;
        }
        keys.push(key);
      }

      return combineCell(arr, keys);
    }

    function initChildren(
      children: Array<any>,
      depth: number,
      pindex: number,
      parentId: string
    ): any {
      depth += 1;
      return children.map((item, key) => {
        item = isObject(item)
          ? item
          : {
              item
            };
        const id = guid();

        return {
          // id: String(item && (item as any)[self.primaryField] || `${pindex}-${depth}-${key}`),
          id: id,
          parentId,
          key: String(`${pindex}-${depth}-${key}`),
          depth: depth,
          index: key,
          newIndex: key,
          pristine: item,
          data: item,
          rowSpans: {},
          children:
            item && Array.isArray(item.children)
              ? initChildren(item.children, depth, key, id)
              : [],
          expandable: !!(
            (item && Array.isArray(item.children) && item.children.length) ||
            (self.footable && self.footableColumns.length)
          )
        };
      });
    }

    function initRows(
      rows: Array<any>,
      getEntryId?: (entry: any, index: number) => string
    ) {
      self.selectedRows.clear();
      self.expandedRows.clear();

      let arr: Array<SRow> = rows.map((item, key) => {
        let id = getEntryId ? getEntryId(item, key) : guid();
        return {
          // id: getEntryId ? getEntryId(item, key) : String(item && (item as any)[self.primaryField] || `${key}-1-${key}`),
          id: id,
          key: String(`${key}-1-${key}`),
          depth: 1, // 最大父节点默认为第一层，逐层叠加
          index: key,
          newIndex: key,
          pristine: item,
          data: item,
          rowSpans: {},
          children:
            item && Array.isArray(item.children)
              ? initChildren(item.children, 1, key, id)
              : [],
          expandable: !!(
            (item && Array.isArray(item.children) && item.children.length) ||
            (self.footable && self.footableColumns.length)
          )
        };
      });

      if (self.combineNum) {
        arr = autoCombineCell(arr, self.columns, self.combineNum);
      }

      replaceRow(arr);
      self.isNested = self.rows.some(item => item.children.length);

      const expand = self.footable && self.footable.expand;
      if (
        expand === 'first' ||
        (self.expandConfig && self.expandConfig.expand === 'first')
      ) {
        self.rows.length && self.expandedRows.push(self.rows[0]);
      } else if (
        (expand === 'all' && !self.footable.accordion) ||
        (self.expandConfig &&
          self.expandConfig.expand === 'all' &&
          !self.expandConfig.accordion)
      ) {
        self.expandedRows.replace(self.rows);
      }

      self.dragging = false;
    }

    // 尽可能的复用 row
    function replaceRow(arr: Array<SRow>) {
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

    function updateSelected(selected: Array<any>, valueField?: string) {
      self.selectedRows.clear();
      self.rows.forEach(item => {
        if (~selected.indexOf(item.pristine)) {
          self.selectedRows.push(item);
        } else if (
          find(
            selected,
            a =>
              a[valueField || 'value'] &&
              a[valueField || 'value'] == item.pristine[valueField || 'value']
          )
        ) {
          self.selectedRows.push(item);
        }
      });
    }

    function toggleAll() {
      if (self.allChecked) {
        self.selectedRows.clear();
      } else {
        self.selectedRows.replace(self.checkableRows);
      }
    }

    function toggle(row: IRow) {
      if (!row.checkable) {
        return;
      }

      const idx = self.selectedRows.indexOf(row);

      if (self.multiple) {
        ~idx ? self.selectedRows.splice(idx, 1) : self.selectedRows.push(row);
      } else {
        ~idx
          ? self.selectedRows.splice(idx, 1)
          : self.selectedRows.replace([row]);
      }
    }

    function clear() {
      self.selectedRows.clear();
    }

    function toggleExpandAll() {
      if (self.allExpanded) {
        self.expandedRows.clear();
      } else {
        self.expandedRows.replace(self.rows);
      }
    }

    function toggleExpanded(row: IRow) {
      const idx = self.expandedRows.indexOf(row);

      if (~idx) {
        self.expandedRows.splice(idx, 1);
      } else if (self.footable && self.footable.accordion) {
        self.expandedRows.replace([row]);
      } else if (self.expandConfig && self.expandConfig.accordion) {
        let rows = self.expandedRows.filter(item => item.depth !== row.depth);
        rows.push(row);
        self.expandedRows.replace(rows);
      } else {
        self.expandedRows.push(row);
      }
    }

    function collapseAllAtDepth(depth: number) {
      let rows = self.expandedRows.filter(item => item.depth !== depth);
      self.expandedRows.replace(rows);
    }

    function setOrderByInfo(key: string, direction: 'asc' | 'desc') {
      self.orderBy = key;
      self.orderDir = direction;
    }

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

    function toggleDragging() {
      self.dragging = !self.dragging;
    }

    function stopDragging() {
      self.dragging = false;
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
        self.toggableColumns.map(item => item.name || item.index).join('-');
      localStorage.setItem(
        key,
        JSON.stringify(self.activeToggaleColumns.map(item => item.index))
      );
    }

    function addForm(form: IFormStore, rowIndex: number) {
      self.formsRef.push({
        id: form.id,
        rowIndex
      });
    }

    return {
      update,
      initRows,
      updateSelected,
      toggleAll,
      toggle,
      toggleExpandAll,
      toggleExpanded,
      collapseAllAtDepth,
      clear,
      setOrderByInfo,
      reset,
      toggleDragging,
      stopDragging,
      exchange,
      addForm,

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
            self.toggableColumns.map(item => item.name || item.index).join('-');

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

export type ITableStore = Instance<typeof TableStore>;
export type STableStore = SnapshotIn<typeof TableStore>;
