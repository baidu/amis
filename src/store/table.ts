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
import {resolveVariable, resolveVariableAndFilter} from '../utils/tpl-builtin';
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
  hasVisibleExpression,
  filterTree
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
    checkdisable: false,
    isPrimary: false,
    searchable: types.maybe(types.frozen()),
    enableSearch: true,
    sortable: false,
    filterable: types.optional(types.frozen(), undefined),
    fixed: '',
    index: 0,
    rawIndex: 0,
    breakpoint: types.optional(types.frozen(), undefined),
    pristine: types.optional(types.frozen(), undefined),
    remark: types.optional(types.frozen(), undefined),
    className: types.union(types.string, types.frozen())
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
    },

    setEnableSearch(value: boolean) {
      self.enableSearch = value;
    }
  }));

export type IColumn = Instance<typeof Column>;
export type SColumn = SnapshotIn<typeof Column>;

export const Row = types
  .model('Row', {
    storeType: 'Row',
    id: types.identifier,
    parentId: '',
    key: types.string,
    pristine: types.frozen({} as any),
    data: types.frozen({} as any),
    rowSpans: types.frozen({} as any),
    index: types.number,
    newIndex: types.number,
    path: '', // 行数据的位置
    expandable: false,
    checkdisable: false,
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
      let children: Array<any> | null = null;
      if (self.children.length) {
        children = self.children.map(item => item.locals);
      }

      const parent = getParent(self, 2) as ITableStore;
      return createObject(
        extendObject((getParent(self, self.depth * 2) as ITableStore).data, {
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

    setCheckdisable(bool: boolean) {
      self.checkdisable = bool;
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
    expandedRows: types.array(types.string),
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
    combineFromIndex: 0,
    formsRef: types.optional(types.array(types.frozen()), []),
    maxKeepItemSelectionLength: 0,
    keepItemSelectionOnPageChange: false
  })
  .views(self => {
    function getColumnsExceptBuiltinTypes() {
      return self.columns.filter(item => !/^__/.test(item.type));
    }

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
      return self.expandedRows.includes(row.id);
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

    function getHovedRow(): IRow | undefined {
      return flattenTree<IRow>(self.rows).find((item: IRow) => item.isHover);
    }

    function getUnSelectedRows() {
      return flattenTree<IRow>(self.rows).filter((item: IRow) => !item.checked);
    }

    function getData(superData: any): any {
      return createObject(superData, {
        items: self.rows.map(item => item.data),
        selectedItems: self.selectedRows.map(item => item.data),
        unSelectedItems: getUnSelectedRows().map(item => item.data)
      });
    }

    function hasColumnHidden() {
      return self.columns.findIndex(column => !column.toggled) !== -1;
    }

    function getColumnGroup() {
      const columns = getFilteredColumns();
      const len = columns.length;

      if (!len) {
        return [];
      }

      const groups: Array<{
        label: string;
        index: number;
        colSpan: number;
        rowSpan: number;
        has: Array<any>;
      }> = [
        {
          label: columns[0].groupName,
          colSpan: 1,
          rowSpan: 1,
          index: columns[0].index,
          has: [columns[0]]
        }
      ];

      //  如果是勾选栏，让它和下一列合并。
      if (columns[0].type === '__checkme' && columns[1]) {
        groups[0].label = columns[1].groupName;
      }

      for (let i = 1; i < len; i++) {
        let prev = groups[groups.length - 1];
        const current = columns[i];

        if (
          current.groupName === prev.label ||
          resolveVariableAndFilter(current.groupName, self.data) ===
            resolveVariableAndFilter(prev.label, self.data)
        ) {
          prev.colSpan++;
          prev.has.push(current);
        } else {
          groups.push({
            label: current.groupName,
            colSpan: 1,
            rowSpan: 1,
            index: current.index,
            has: [current]
          });
        }
      }

      if (groups.length === 1 && !groups[0].label) {
        groups.pop();
      }

      return groups.map(item => {
        const rowSpan =
          !item.label ||
          (item.has.length === 1 && item.label === item.has[0].label)
            ? 2
            : 1;
        return {
          ...item,
          rowSpan,
          label: rowSpan === 2 ? item.label || item.has[0].label : item.label
        };
      });
    }

    function getFirstToggledColumnIndex() {
      const column = self.columns.find(
        column => !/^__/.test(column.type) && column.toggled
      );

      return column == null ? null : column.index;
    }

    function getSearchableColumns() {
      return self.columns.filter(column => column.searchable);
    }

    return {
      get columnsData() {
        return getColumnsExceptBuiltinTypes();
      },

      get forms() {
        return getForms();
      },

      get searchableColumns() {
        return getSearchableColumns();
      },

      get activedSearchableColumns() {
        return getSearchableColumns().filter(column => column.enableSearch);
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
          self.expandedRows.length === this.expandableRows.length &&
          this.expandableRows.length
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
        return flattenTree<IRow>(self.rows).filter(
          (item: IRow) => item.checkable
        );
      },

      get expandableRows() {
        return self.rows.filter(item => item.expandable);
      },

      get moved() {
        return getMoved();
      },

      get movedRows() {
        return getMovedRows();
      },

      get hoverRow() {
        return getHovedRow();
      },

      get disabledHeadCheckbox() {
        const selectedLength = self.data?.selectedItems.length;
        const maxLength = self.maxKeepItemSelectionLength;

        if (!self.data || !self.keepItemSelectionOnPageChange || !maxLength) {
          return false;
        }

        return maxLength === selectedLength;
      },

      get firstToggledColumnIndex() {
        return getFirstToggledColumnIndex();
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
      },

      // 是否隐藏了某列
      hasColumnHidden() {
        return hasColumnHidden();
      },

      getExpandedRows() {
        const list: Array<IRow> = [];

        eachTree(self.rows, i => {
          if (self.expandedRows.includes(i.id)) {
            list.push(i as any);
          }
        });

        return list;
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
      config.combineFromIndex !== void 0 &&
        (self.combineFromIndex =
          parseInt(config.combineFromIndex as any, 10) || 0);

      config.maxKeepItemSelectionLength !== void 0 &&
        (self.maxKeepItemSelectionLength = config.maxKeepItemSelectionLength);
      config.keepItemSelectionOnPageChange !== void 0 &&
        (self.keepItemSelectionOnPageChange =
          config.keepItemSelectionOnPageChange);

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
          isPrimary: index === 3,
          className: item.className || ''
        }));

        self.columns.replace(columns as any);
      }
    }

    function updateColumns(columns: Array<SColumn>) {
      if (columns && Array.isArray(columns)) {
        columns = columns.filter(column => column).concat();

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
          pristine: item.pristine || item,
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
      maxCount: number,
      fromIndex = 0
    ): Array<SRow> {
      if (!columns.length || !maxCount || !arr.length) {
        return arr;
      }
      // 如果是嵌套模式，通常第一列都是存在差异的，所以从第二列开始。
      fromIndex =
        fromIndex ||
        (arr.some(item => Array.isArray(item.children) && item.children.length)
          ? 1
          : 0);

      const keys: Array<string> = [];
      const len = columns.length;
      for (let i = 0; i < len; i++) {
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

      while (fromIndex--) {
        keys.shift();
      }

      while (keys.length > maxCount) {
        keys.pop();
      }

      return combineCell(arr, keys);
    }

    function initChildren(
      children: Array<any>,
      depth: number,
      pindex: number,
      parentId: string,
      path: string = ''
    ): any {
      depth += 1;
      return children.map((item, index) => {
        item = isObject(item)
          ? item
          : {
              item
            };
        const id = item.__id ?? guid();

        return {
          // id: String(item && (item as any)[self.primaryField] || `${pindex}-${depth}-${key}`),
          id: String(id),
          parentId: String(parentId),
          key: String(`${pindex}-${depth}-${index}`),
          path: `${path}${index}`,
          depth: depth,
          index: index,
          newIndex: index,
          pristine: item,
          data: item,
          rowSpans: {},
          children:
            item && Array.isArray(item.children)
              ? initChildren(
                  item.children,
                  depth,
                  index,
                  id,
                  `${path}${index}.`
                )
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
      getEntryId?: (entry: any, index: number) => string,
      reUseRow?: boolean
    ) {
      self.selectedRows.clear();
      // self.expandedRows.clear();

      let arr: Array<SRow> = rows.map((item, index) => {
        if (!isObject(item)) {
          item = {
            item
          };
        }

        let id = String(
          getEntryId ? getEntryId(item, index) : item.__id ?? guid()
        );
        return {
          // id: getEntryId ? getEntryId(item, key) : String(item && (item as any)[self.primaryField] || `${key}-1-${key}`),
          id: id,
          key: String(`${index}-1-${index}`),
          depth: 1, // 最大父节点默认为第一层，逐层叠加
          index: index,
          newIndex: index,
          pristine: item,
          path: `${index}`,
          data: item,
          rowSpans: {},
          children:
            item && Array.isArray(item.children)
              ? initChildren(item.children, 1, index, id, `${index}.`)
              : [],
          expandable: !!(
            (item && Array.isArray(item.children) && item.children.length) ||
            (self.footable && self.footableColumns.length)
          )
        };
      });

      if (self.combineNum) {
        arr = autoCombineCell(
          arr,
          self.columns,
          self.combineNum,
          self.combineFromIndex
        );
      }

      replaceRow(arr, reUseRow);
      self.isNested = self.rows.some(item => item.children.length);

      const expand = self.footable && self.footable.expand;
      if (
        expand === 'first' ||
        (self.expandConfig && self.expandConfig.expand === 'first')
      ) {
        self.rows.length && self.expandedRows.push(self.rows[0].id);
      } else if (
        (expand === 'all' && !self.footable.accordion) ||
        (self.expandConfig &&
          self.expandConfig.expand === 'all' &&
          !self.expandConfig.accordion)
      ) {
        self.expandedRows.replace(self.rows.map(item => item.id));
      }

      self.dragging = false;
    }

    // 尽可能的复用 row
    function replaceRow(arr: Array<SRow>, reUseRow?: boolean) {
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

    function updateSelected(selected: Array<any>, valueField?: string) {
      self.selectedRows.clear();

      eachTree(self.rows, item => {
        if (~selected.indexOf(item.pristine)) {
          self.selectedRows.push(item.id);
        } else if (
          find(
            selected,
            a =>
              a[valueField || 'value'] &&
              a[valueField || 'value'] == item.pristine[valueField || 'value']
          )
        ) {
          self.selectedRows.push(item.id);
        }
      });

      updateCheckDisable();
    }

    function toggleAll() {
      const maxLength = self.maxKeepItemSelectionLength;
      const keep = self.keepItemSelectionOnPageChange;

      if (self.allChecked) {
        self.selectedRows.clear();
      } else {
        const selectedItems = self.data?.selectedItems;

        if (
          keep &&
          maxLength &&
          selectedItems &&
          maxLength >= selectedItems.length
        ) {
          const restCheckableRows = self.checkableRows.filter(
            item => !item.checked
          );
          const checkableRows = restCheckableRows.filter(
            (item, i) => i < maxLength - selectedItems.length
          );

          self.selectedRows.replace([...self.selectedRows, ...checkableRows]);
        } else {
          self.selectedRows.replace(self.checkableRows);
        }
      }
    }

    // 记录最近一次点击的多选框，主要用于 shift 多选时判断上一个选的是什么
    let lastCheckedRow: any = null;

    function toggle(row: IRow) {
      if (!row.checkable) {
        return;
      }

      lastCheckedRow = row;

      const idx = self.selectedRows.indexOf(row);

      if (self.multiple) {
        ~idx ? self.selectedRows.splice(idx, 1) : self.selectedRows.push(row);
      } else {
        ~idx
          ? self.selectedRows.splice(idx, 1)
          : self.selectedRows.replace([row]);
      }
    }

    // 按住 shift 的时候点击选项
    function toggleShift(row: IRow) {
      // 如果是同一个或非 multiple 模式下就和不用 shift 一样
      if (!lastCheckedRow || row === lastCheckedRow || !self.multiple) {
        toggle(row);
        return;
      }

      const maxLength = self.maxKeepItemSelectionLength;
      const checkableRows = self.checkableRows;
      const lastCheckedRowIndex = checkableRows.findIndex(
        row => row === lastCheckedRow
      );
      const rowIndex = checkableRows.findIndex(rowItem => row === rowItem);
      const minIndex =
        lastCheckedRowIndex > rowIndex ? rowIndex : lastCheckedRowIndex;
      const maxIndex =
        lastCheckedRowIndex > rowIndex ? lastCheckedRowIndex : rowIndex;

      const rows = checkableRows.slice(minIndex, maxIndex);
      rows.push(row); // 将当前行也加入进行判断
      for (const rowItem of rows) {
        const idx = self.selectedRows.indexOf(rowItem);
        if (idx === -1) {
          // 如果上一个是选中状态，则将之间的所有 check 都变成可选
          if (lastCheckedRow.checked) {
            if (maxLength) {
              if (self.selectedRows.length < maxLength) {
                self.selectedRows.push(rowItem);
              }
            } else {
              self.selectedRows.push(rowItem);
            }
          }
        } else {
          if (!lastCheckedRow.checked) {
            self.selectedRows.splice(idx, 1);
          }
        }
      }

      lastCheckedRow = row;
    }

    function updateCheckDisable() {
      if (!self.data) {
        return;
      }
      const maxLength = self.maxKeepItemSelectionLength;
      const selectedItems = self.data.selectedItems;

      self.selectedRows.map(item => item.setCheckdisable(false));
      if (maxLength && maxLength <= selectedItems.length) {
        self.unSelectedRows.map(
          item => !item.checked && item.setCheckdisable(true)
        );
      } else {
        self.unSelectedRows.map(
          item => item.checkdisable && item.setCheckdisable(false)
        );
      }
    }

    function clear() {
      self.selectedRows.clear();
    }

    function toggleExpandAll() {
      if (self.allExpanded) {
        self.expandedRows.clear();
      } else {
        self.expandedRows.replace(
          self.rows.filter(item => item.expandable).map(item => item.id)
        );
      }
    }

    function toggleExpanded(row: IRow) {
      const idx = self.expandedRows.indexOf(row.id);

      if (~idx) {
        self.expandedRows.splice(idx, 1);
      } else if (self.footable && self.footable.accordion) {
        self.expandedRows.replace([row.id]);
      } else if (self.expandConfig && self.expandConfig.accordion) {
        let rows = self
          .getExpandedRows()
          .filter(item => item.depth !== row.depth);
        rows.push(row);
        self.expandedRows.replace(rows.map(item => item.id));
      } else {
        self.expandedRows.push(row.id);
      }
    }

    function collapseAllAtDepth(depth: number) {
      let rows = self.getExpandedRows().filter(item => item.depth !== depth);
      self.expandedRows.replace(rows.map(item => item.id));
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

    function toggleAllColumns() {
      if (self.activeToggaleColumns.length) {
        if (self.activeToggaleColumns.length === self.toggableColumns.length) {
          self.toggableColumns.map(column => column.setToggled(false));
        } else {
          self.toggableColumns.map(column => column.setToggled(true));
        }
      } else {
        // 如果没有一个激活的，那就改成全选
        self.toggableColumns.map(column => column.setToggled(true));
      }
      persistSaveToggledColumns();
    }

    return {
      update,
      updateColumns,
      initRows,
      updateSelected,
      toggleAll,
      toggle,
      toggleShift,
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
      toggleAllColumns,
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
